import React, { useState } from "react";
import { DialogUploader } from "./DialogUploader";
import type { Meta, StoryObj } from "@storybook/react";

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error" | "cancelled";
  error?: string;
}

interface UploadOptions {
  file: File;
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}

interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
}

// 模拟上传函数
const mockUploadFunction = async ({
  file,
  onProgress,
  signal,
}: UploadOptions): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    let progress = 0;

    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new Error("AbortError"));
        return;
      }

      progress += Math.random() * 15 + 5; // 每次增加5-20%的进度
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // 模拟90%成功率
        if (Math.random() > 0.1) {
          resolve({
            success: true,
            data: { message: `${file.name} 上传成功` },
          });
        } else {
          resolve({
            success: false,
            error: "模拟上传失败",
          });
        }
      } else {
        onProgress(progress);
      }
    }, 300 + Math.random() * 400); // 300-700ms间隔
  });
};

// 慢速上传函数（用于测试）
const slowUploadFunction = async ({
  file,
  onProgress,
  signal,
}: UploadOptions): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    let progress = 0;

    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new Error("AbortError"));
        return;
      }

      progress += Math.random() * 5 + 1; // 每次增加1-6%的进度，更慢
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        resolve({
          success: true,
          data: { message: `${file.name} 上传成功` },
        });
      } else {
        onProgress(progress);
      }
    }, 800 + Math.random() * 600); // 800-1400ms间隔，很慢
  });
};

const meta: Meta<typeof DialogUploader> = {
  title: "Components/DialogUploader",
  component: DialogUploader,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
DialogUploader是一个功能完整的弹窗式文件上传组件。

## 主要特性

- **弹窗界面**：模态弹窗，提供专注的上传体验
- **拖拽上传**：支持文件拖拽和点击选择
- **多文件支持**：可同时上传多个文件，带并发控制
- **实时进度**：显示每个文件的上传进度和总体进度
- **文件过滤**：支持文件类型和大小限制
- **错误处理**：完善的错误提示和重试机制
- **取消功能**：支持取消全部上传
- **状态管理**：完整的上传状态跟踪

## 使用场景

- 需要专门的上传界面时
- 多文件批量上传
- 需要详细进度显示的场景
- 复杂的上传流程管理
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "控制弹窗的显示/隐藏",
    },
    multiple: {
      control: "boolean",
      description: "是否支持多文件选择",
    },
    acceptedFileTypes: {
      control: "object",
      description: "允许的文件类型数组",
    },
    uploadFunction: {
      description: "必需的上传函数，处理文件上传逻辑",
    },
    maxConcurrent: {
      control: { type: "number", min: 1, max: 10 },
      description: "最大并发上传数量",
    },
    maxFiles: {
      control: { type: "number", min: 1, max: 50 },
      description: "最大文件数量限制",
    },
    maxFileSize: {
      control: "number",
      description: "单个文件最大大小（字节）",
    },
    onUpload: {
      action: "onUpload",
      description: "文件上传完成回调",
    },
    onUploadProgress: {
      action: "onUploadProgress",
      description: "上传进度回调",
    },
  },
};

export default meta;

type Story = StoryObj<typeof DialogUploader>;

// Story组件包装器
const DialogWrapper = ({ children, ...args }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleUpload = (files: File[], results?: UploadResult[]) => {
    const timestamp = new Date().toLocaleTimeString();
    const fileNames = files.map((f) => f.name).join(", ");
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] 上传完成: ${fileNames} (${files.length}/${
        results?.length || files.length
      } 成功)`,
    ]);
  };

  const handleProgress = (progress: UploadProgress[]) => {
    const completed = progress.filter((p) => p.status === "completed").length;
    const total = progress.length;
    if (completed === total && total > 0) {
      console.log("所有文件上传完成");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        打开上传弹窗
      </button>

      <DialogUploader
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpload={handleUpload}
        onUploadProgress={handleProgress}
      />

      {logs.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>上传日志:</h3>
          <ul
            style={{
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {logs.map((log, index) => (
              <li key={index} style={{ margin: "5px 0" }}>
                {log}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  args: {
    uploadFunction: mockUploadFunction,
    multiple: true,
    maxConcurrent: 3,
  },
  render: (args) => <DialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: "默认的弹窗上传器，支持多文件上传，显示实时进度。",
      },
    },
  },
};

export const SingleFile: Story = {
  args: {
    uploadFunction: mockUploadFunction,
    multiple: false,
    maxConcurrent: 1,
  },
  render: (args) => <DialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: "单文件上传模式，一次只能选择一个文件。",
      },
    },
  },
};

export const ImageOnly: Story = {
  args: {
    uploadFunction: mockUploadFunction,
    multiple: true,
    acceptedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    maxFiles: 5,
    maxConcurrent: 2,
  },
  render: (args) => <DialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story: "仅允许图片文件上传，最多5个文件，最大并发数为2。",
      },
    },
  },
};

export const SlowUpload: Story = {
  args: {
    uploadFunction: slowUploadFunction,
    multiple: true,
    maxConcurrent: 2,
    maxFiles: 10,
  },
  render: (args) => <DialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "模拟慢速上传，用于测试取消功能和进度显示。上传速度很慢，方便观察进度变化。",
      },
    },
  },
};

export const WithFileSizeLimit: Story = {
  args: {
    uploadFunction: mockUploadFunction,
    multiple: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
    acceptedFileTypes: [".pdf", ".doc", ".docx", ".txt"],
  },
  render: (args) => <DialogWrapper {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          "带文件大小限制的上传器，单个文件最大5MB，仅支持文档格式，最多3个文件。",
      },
    },
  },
};
