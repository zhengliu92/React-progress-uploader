import React, { useState } from "react";
import { UploadButton } from "./UploadButton";
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

      progress += Math.random() * 20 + 5; // 每次增加5-25%的进度
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // 模拟95%成功率
        if (Math.random() > 0.05) {
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
    }, 200 + Math.random() * 300); // 200-500ms间隔
  });
};

// 慢速上传函数（用于测试取消功能）
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

      progress += Math.random() * 8 + 2; // 每次增加2-10%的进度，更慢
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
    }, 500 + Math.random() * 500); // 500-1000ms间隔，更慢
  });
};

const meta: Meta<typeof UploadButton> = {
  title: "Components/UploadButton",
  component: UploadButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "按钮文本内容",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"],
      description: "按钮样式变体",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "按钮尺寸",
    },
    multiple: {
      control: "boolean",
      description: "是否支持多文件选择",
    },
    acceptedFileTypes: {
      control: "object",
      description: "支持的文件类型数组",
    },
    maxConcurrent: {
      control: "number",
      description: "最大并发上传数量",
    },
    disabled: {
      control: "boolean",
      description: "是否禁用按钮",
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

type Story = StoryObj<typeof UploadButton>;

export const Default: Story = {
  args: {
    children: "上传文件",
    uploadFunction: mockUploadFunction,
  },
  parameters: {
    docs: {
      description: {
        story: "默认的上传按钮，支持多文件上传并带有进度显示。",
      },
    },
  },
};

export const SingleFile: Story = {
  args: {
    children: "选择单个文件",
    multiple: false,
    uploadFunction: mockUploadFunction,
    onUpload: (files: File[], results: UploadResult[]) => {
      console.log("上传成功的文件:", files);
      console.log("上传结果:", results);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "仅支持单文件上传的按钮。",
      },
    },
  },
};

export const ImageUpload: Story = {
  args: {
    children: "上传图片",
    acceptedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    multiple: true,
    variant: "primary",
    uploadFunction: mockUploadFunction,
    onUpload: (files: File[], results: UploadResult[]) => {
      console.log("上传成功的图片:", files);
      console.log("上传结果:", results);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "专门用于图片上传的按钮，仅接受图片格式。",
      },
    },
  },
};

export const DocumentUpload: Story = {
  args: {
    children: "上传文档",
    acceptedFileTypes: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
    multiple: true,
    variant: "secondary",
    uploadFunction: mockUploadFunction,
    onUpload: (files: File[], results: UploadResult[]) => {
      console.log("上传成功的文档:", files);
      console.log("上传结果:", results);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "专门用于文档上传的按钮，仅接受文档格式。",
      },
    },
  },
};

export const SlowUpload: Story = {
  args: {
    children: "慢速上传 (测试取消)",
    uploadFunction: slowUploadFunction,
    multiple: true,
    variant: "outline",
  },
  parameters: {
    docs: {
      description: {
        story: "慢速上传按钮，用于测试取消上传功能。",
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <UploadButton variant="primary" uploadFunction={mockUploadFunction}>
        Primary
      </UploadButton>
      <UploadButton variant="secondary" uploadFunction={mockUploadFunction}>
        Secondary
      </UploadButton>
      <UploadButton variant="outline" uploadFunction={mockUploadFunction}>
        Outline
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "不同样式变体的上传按钮。",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <UploadButton size="small" uploadFunction={mockUploadFunction}>
        Small
      </UploadButton>
      <UploadButton size="medium" uploadFunction={mockUploadFunction}>
        Medium
      </UploadButton>
      <UploadButton size="large" uploadFunction={mockUploadFunction}>
        Large
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "不同尺寸的上传按钮。",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    children: "禁用状态",
    disabled: true,
    uploadFunction: mockUploadFunction,
  },
  parameters: {
    docs: {
      description: {
        story: "禁用状态的上传按钮。",
      },
    },
  },
};

export const DisabledVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <UploadButton
        variant="primary"
        disabled
        uploadFunction={mockUploadFunction}
      >
        Primary Disabled
      </UploadButton>
      <UploadButton
        variant="secondary"
        disabled
        uploadFunction={mockUploadFunction}
      >
        Secondary Disabled
      </UploadButton>
      <UploadButton
        variant="outline"
        disabled
        uploadFunction={mockUploadFunction}
      >
        Outline Disabled
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "不同变体的禁用状态按钮。",
      },
    },
  },
};

export const WithProgress: Story = {
  render: () => {
    const [uploadHistory, setUploadHistory] = useState<string[]>([]);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);

    const handleUpload = (files: File[], results: UploadResult[]) => {
      const fileNames = files.map((f) => f.name);
      setUploadHistory((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 上传完成: ${fileNames.join(
          ", "
        )} (${files.length}/${results.length} 成功)`,
      ]);
    };

    const handleProgress = (progress: UploadProgress[]) => {
      const completed = progress.filter((p) => p.status === "completed").length;
      const cancelled = progress.filter((p) => p.status === "cancelled").length;
      const errors = progress.filter((p) => p.status === "error").length;

      setProgressLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 进度: ${completed}/${
          progress.length
        } 完成${cancelled > 0 ? `, ${cancelled} 取消` : ""}${
          errors > 0 ? `, ${errors} 失败` : ""
        }`,
      ]);
    };

    const clearHistory = () => {
      setUploadHistory([]);
      setProgressLogs([]);
    };

    return (
      <div style={{ maxWidth: "600px", padding: "20px" }}>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <UploadButton
            onUpload={handleUpload}
            onUploadProgress={handleProgress}
            uploadFunction={mockUploadFunction}
            multiple={true}
          >
            快速上传
          </UploadButton>

          <UploadButton
            variant="secondary"
            onUpload={handleUpload}
            onUploadProgress={handleProgress}
            uploadFunction={slowUploadFunction}
            multiple={true}
          >
            慢速上传 (测试取消)
          </UploadButton>

          <button
            onClick={clearHistory}
            style={{
              padding: "8px 16px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            清空记录
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>上传历史</h4>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                padding: "12px",
                height: "200px",
                overflowY: "auto",
                fontSize: "14px",
              }}
            >
              {uploadHistory.length === 0 ? (
                <p style={{ margin: 0, color: "#64748b" }}>暂无记录</p>
              ) : (
                uploadHistory.map((log, index) => (
                  <div key={index} style={{ marginBottom: "4px" }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>进度日志</h4>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                padding: "12px",
                height: "200px",
                overflowY: "auto",
                fontSize: "14px",
              }}
            >
              {progressLogs.length === 0 ? (
                <p style={{ margin: 0, color: "#64748b" }}>暂无记录</p>
              ) : (
                progressLogs.map((log, index) => (
                  <div key={index} style={{ marginBottom: "4px" }}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "演示带有进度跟踪和历史记录的上传按钮。",
      },
    },
  },
};
