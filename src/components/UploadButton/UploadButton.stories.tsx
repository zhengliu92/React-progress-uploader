import React, { useState } from "react";
import { UploadButton } from "./UploadButton";
import type { Meta, StoryObj } from "@storybook/react";
import {
  mockUploadFunctions,
  fileTypeConfigs,
  fileSizeLimits,
  commonParameters,
  StoryLogger,
  formatFileSize,
} from "../../stories/story-utils";

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
    ...commonParameters,
    docs: {
      description: {
        component: `
UploadButton 是一个功能完整的文件上传按钮组件。

## 主要特性

- **即开即用**：点击按钮即可打开上传对话框
- **多种样式**：支持 primary、secondary、outline 三种样式
- **多尺寸支持**：small、medium、large 三种尺寸
- **文件过滤**：支持文件类型和大小限制
- **进度显示**：内置弹窗显示上传进度
- **并发控制**：可配置最大并发上传数量
- **状态管理**：完整的上传流程控制

## 使用场景

- 需要简单上传按钮的场景
- 表单中的文件上传字段
- 快速文件上传需求
- 需要自定义样式的上传按钮
- 模态框式的上传体验

## 设计理念

UploadButton 采用"按钮触发+弹窗处理"的设计模式，为用户提供专注的上传体验。
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "按钮文本内容",
      table: {
        defaultValue: { summary: '"上传文件"' },
        type: { summary: "React.ReactNode" },
      },
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "custom"],
      description: "按钮样式变体",
      table: {
        defaultValue: { summary: '"primary"' },
        type: { summary: '"primary" | "secondary" | "outline" | "custom"' },
      },
    },
    color: {
      control: "color",
      description: "自定义文字颜色",
      table: {
        type: { summary: "string" },
      },
    },
    backgroundColor: {
      control: "color",
      description: "自定义背景颜色",
      table: {
        type: { summary: "string" },
      },
    },
    borderColor: {
      control: "color",
      description: "自定义边框颜色（outline变体用）",
      table: {
        type: { summary: "string" },
      },
    },
    showIcon: {
      control: "boolean",
      description: "是否显示图标",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    icon: {
      control: "text",
      description: "自定义图标（React元素）",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "按钮尺寸",
      table: {
        defaultValue: { summary: '"medium"' },
        type: { summary: '"small" | "medium" | "large"' },
      },
    },
    className: {
      control: "text",
      description: "自定义CSS类名",
      table: {
        type: { summary: "string" },
      },
    },
    uploadFunction: {
      description: "必需的上传函数，处理文件上传逻辑",
      table: {
        type: { summary: "(options: UploadOptions) => Promise<UploadResult>" },
      },
    },
    multiple: {
      control: "boolean",
      description: "是否支持多文件选择",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    acceptedFileTypes: {
      control: "object",
      description: '允许的文件类型数组（例如：[".jpg", ".png", ".pdf"]）',
      table: {
        type: { summary: "string[]" },
      },
    },
    maxFiles: {
      control: { type: "number", min: 1, max: 50 },
      description: "最大文件数量限制",
      table: {
        defaultValue: { summary: "10" },
        type: { summary: "number" },
      },
    },
    maxFileSize: {
      control: "number",
      description: "单个文件最大大小（字节）",
      table: {
        type: { summary: "number" },
      },
    },
    maxConcurrent: {
      control: { type: "number", min: 1, max: 10 },
      description: "最大并发上传数量",
      table: {
        defaultValue: { summary: "3" },
        type: { summary: "number" },
      },
    },
    disabled: {
      control: "boolean",
      description: "是否禁用组件",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    onUpload: {
      action: "onUpload",
      description: "文件上传完成回调",
      table: {
        type: { summary: "(files: File[], results?: UploadResult[]) => void" },
      },
    },
    onUploadProgress: {
      action: "onUploadProgress",
      description: "上传进度回调",
      table: {
        type: { summary: "(progress: UploadProgress[]) => void" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UploadButton>;

export const Default: Story = {
  args: {
    children: "上传文件",
    uploadFunction: mockUploadFunctions.standard,
  },
  parameters: {
    docs: {
      description: {
        story:
          "默认的上传按钮，支持多文件上传并带有进度显示。使用标准上传速度和10%失败率进行演示。",
      },
    },
  },
};

export const SingleFile: Story = {
  args: {
    children: "选择单个文件",
    multiple: false,
    uploadFunction: mockUploadFunctions.reliable,
  },
  parameters: {
    docs: {
      description: {
        story: "仅支持单文件上传的按钮，使用可靠的上传函数（0%失败率）。",
      },
    },
  },
};

export const ImageUpload: Story = {
  args: {
    children: "上传图片",
    acceptedFileTypes: fileTypeConfigs.images,
    multiple: true,
    variant: "primary",
    uploadFunction: mockUploadFunctions.fast,
    maxFiles: 10,
    maxFileSize: fileSizeLimits.large,
  },
  parameters: {
    docs: {
      description: {
        story:
          "专门用于图片上传的按钮，仅接受图片格式，使用快速上传函数。支持最多10个文件，单个文件最大10MB。",
      },
    },
  },
};

export const DocumentUpload: Story = {
  args: {
    children: "上传文档",
    acceptedFileTypes: fileTypeConfigs.documents,
    multiple: true,
    variant: "secondary",
    uploadFunction: mockUploadFunctions.standard,
    maxFiles: 5,
    maxFileSize: fileSizeLimits.medium,
  },
  parameters: {
    docs: {
      description: {
        story:
          "专门用于文档上传的按钮，仅接受文档格式（PDF、DOC、DOCX、TXT、RTF、ODT），最多5个文件，单个文件最大5MB。",
      },
    },
  },
};

export const SlowUpload: Story = {
  args: {
    children: "慢速上传 (测试取消)",
    uploadFunction: mockUploadFunctions.slow,
    multiple: true,
    variant: "outline",
    maxConcurrent: 1,
  },
  parameters: {
    docs: {
      description: {
        story:
          "慢速上传按钮，串行上传（并发数为1），用于测试取消上传功能和观察进度变化。",
      },
    },
  },
};

export const UnreliableUpload: Story = {
  args: {
    children: "不稳定网络上传",
    uploadFunction: mockUploadFunctions.unreliable,
    multiple: true,
    variant: "primary",
    maxConcurrent: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "模拟不稳定网络环境的上传（30%失败率），用于测试错误处理和用户体验。",
      },
    },
  },
};

// 绿色自定义颜色示例
export const GreenCustomButton: Story = {
  args: {
    children: "绿色上传按钮",
    backgroundColor: "#10B981",
    color: "white",
    variant: "custom",
    uploadFunction: mockUploadFunctions.reliable,
  },
  parameters: {
    docs: {
      description: {
        story: "展示使用backgroundColor和color属性创建绿色主题按钮的简单示例。",
      },
    },
  },
};

// 橙色边框自定义示例
export const OrangeOutlineButton: Story = {
  args: {
    children: "橙色边框按钮",
    variant: "outline",
    borderColor: "#EA580C",
    color: "#EA580C",
    uploadFunction: mockUploadFunctions.reliable,
  },
  parameters: {
    docs: {
      description: {
        story:
          "展示使用borderColor和color属性创建橙色边框按钮的outline变体示例。",
      },
    },
  },
};

// 隐藏图标的按钮
export const NoIcon: Story = {
  args: {
    children: "纯文字按钮",
    showIcon: false,
    uploadFunction: mockUploadFunctions.reliable,
  },
  parameters: {
    docs: {
      description: {
        story: "展示隐藏图标的纯文字上传按钮，通过设置showIcon=false实现。",
      },
    },
  },
};

// 自定义图标示例
export const CustomIcon: Story = {
  args: {
    children: "自定义图标",
    icon: "📁", // 使用emoji作为图标
    uploadFunction: mockUploadFunctions.reliable,
  },
  parameters: {
    docs: {
      description: {
        story:
          "展示使用自定义图标的按钮，这里使用emoji作为示例。可以传入任何React元素。",
      },
    },
  },
};

// 图标选项展示
export const IconOptions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        alignItems: "start",
      }}
    >
      {/* 默认云图标 */}
      <UploadButton uploadFunction={mockUploadFunctions.reliable}>
        默认云图标
      </UploadButton>

      {/* 隐藏图标 */}
      <UploadButton
        showIcon={false}
        uploadFunction={mockUploadFunctions.reliable}
      >
        纯文字按钮
      </UploadButton>

      {/* Emoji图标 */}
      <UploadButton
        icon='📤'
        uploadFunction={mockUploadFunctions.reliable}
      >
        发送图标
      </UploadButton>

      <UploadButton
        icon='📎'
        uploadFunction={mockUploadFunctions.reliable}
      >
        附件图标
      </UploadButton>

      <UploadButton
        icon='🖼️'
        uploadFunction={mockUploadFunctions.reliable}
      >
        图片图标
      </UploadButton>

      <UploadButton
        icon='📄'
        uploadFunction={mockUploadFunctions.reliable}
      >
        文档图标
      </UploadButton>

      {/* 自定义SVG图标 */}
      <UploadButton
        icon={
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7,10 12,15 17,10' />
            <line
              x1='12'
              y1='15'
              x2='12'
              y2='3'
            />
          </svg>
        }
        uploadFunction={mockUploadFunctions.reliable}
      >
        下载图标
      </UploadButton>

      <UploadButton
        icon={
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <polygon points='13,2 3,14 12,14 11,22 21,10 12,10' />
          </svg>
        }
        uploadFunction={mockUploadFunctions.reliable}
      >
        闪电图标
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
展示UploadButton支持的各种图标选项：

### 图标类型

- **默认云图标**：不设置任何图标属性时的默认样式
- **隐藏图标**：设置 \`showIcon={false}\` 创建纯文字按钮
- **Emoji图标**：使用emoji字符作为图标，简单易用
- **自定义SVG**：传入SVG元素实现自定义矢量图标

### 使用场景

- **专题上传**：使用相关的emoji或图标（如图片、文档）
- **品牌定制**：使用自定义SVG图标匹配品牌设计
- **简约风格**：隐藏图标实现纯文字按钮
- **功能区分**：不同图标表示不同的上传类型

### 技术特点

- 图标自动继承按钮的颜色
- SVG图标支持currentColor，适配主题
- 图标尺寸自动适配按钮大小
- 完全的TypeScript类型支持
        `,
      },
    },
  },
};

// 样式变体展示
export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <UploadButton
        variant='primary'
        uploadFunction={mockUploadFunctions.reliable}
      >
        Primary
      </UploadButton>
      <UploadButton
        variant='secondary'
        uploadFunction={mockUploadFunctions.reliable}
      >
        Secondary
      </UploadButton>
      <UploadButton
        variant='outline'
        uploadFunction={mockUploadFunctions.reliable}
      >
        Outline
      </UploadButton>
      <UploadButton
        variant='custom'
        backgroundColor='#10B981'
        color='white'
        uploadFunction={mockUploadFunctions.reliable}
      >
        Custom
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "展示不同样式变体的上传按钮：primary（主要）、secondary（次要）、outline（轮廓）、custom（自定义）。",
      },
    },
  },
};

// 尺寸变体展示
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
      <UploadButton
        size='small'
        uploadFunction={mockUploadFunctions.reliable}
      >
        Small
      </UploadButton>
      <UploadButton
        size='medium'
        uploadFunction={mockUploadFunctions.reliable}
      >
        Medium
      </UploadButton>
      <UploadButton
        size='large'
        uploadFunction={mockUploadFunctions.reliable}
      >
        Large
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "展示不同尺寸的上传按钮：small（小）、medium（中）、large（大）。",
      },
    },
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    children: "禁用状态",
    disabled: true,
    uploadFunction: mockUploadFunctions.standard,
  },
  parameters: {
    docs: {
      description: {
        story: "禁用状态的上传按钮，无法点击和交互。",
      },
    },
  },
};

// 禁用状态的所有变体
export const DisabledVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <UploadButton
        variant='primary'
        disabled
        uploadFunction={mockUploadFunctions.reliable}
      >
        Primary Disabled
      </UploadButton>
      <UploadButton
        variant='secondary'
        disabled
        uploadFunction={mockUploadFunctions.reliable}
      >
        Secondary Disabled
      </UploadButton>
      <UploadButton
        variant='outline'
        disabled
        uploadFunction={mockUploadFunctions.reliable}
      >
        Outline Disabled
      </UploadButton>
      <UploadButton
        variant='custom'
        backgroundColor='#10B981'
        color='white'
        disabled
        uploadFunction={mockUploadFunctions.reliable}
      >
        Custom Disabled
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "展示不同变体的禁用状态按钮，包括自定义颜色变体，演示禁用样式的一致性。",
      },
    },
  },
};

// 完整的交互式示例，包含详细的日志和统计
export const InteractiveDemo: Story = {
  render: () => {
    const [uploadHistory, setUploadHistory] = useState<string[]>([]);
    const [progressLogs, setProgressLogs] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const logger = new StoryLogger();

    const handleUpload = (files: File[], results?: any[]) => {
      const timestamp = new Date().toLocaleTimeString();
      const successful =
        results?.filter((r) => r.success).length || files.length;
      const failed = (results?.length || files.length) - successful;

      setUploadHistory((prev) => [
        ...prev,
        `[${timestamp}] 上传完成: ${files
          .map((f) => f.name)
          .join(", ")} (${successful} 成功${
          failed > 0 ? `, ${failed} 失败` : ""
        })`,
      ]);
    };

    const handleProgress = (progress: any[]) => {
      const timestamp = new Date().toLocaleTimeString();
      const completed = progress.filter((p) => p.status === "completed").length;
      const uploading = progress.filter((p) => p.status === "uploading").length;
      const failed = progress.filter((p) => p.status === "error").length;

      if (uploading > 0 || completed > 0 || failed > 0) {
        const status = `${completed}/${progress.length} 完成${
          uploading > 0 ? `, ${uploading} 上传中` : ""
        }${failed > 0 ? `, ${failed} 失败` : ""}`;
        setProgressLogs((prev) => {
          const newLogs = [...prev, `[${timestamp}] 进度更新: ${status}`];
          return newLogs.slice(-10); // 只保留最近10条进度日志
        });
      }
    };

    const clearLogs = () => {
      setUploadHistory([]);
      setProgressLogs([]);
      setSelectedFiles([]);
    };

    return (
      <div style={{ padding: "20px", maxWidth: "900px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#374151" }}>
            交互式上传按钮演示
          </h3>

          {/* 按钮组 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <UploadButton
              variant='primary'
              onUpload={handleUpload}
              onUploadProgress={handleProgress}
              uploadFunction={mockUploadFunctions.fast}
              multiple={true}
              acceptedFileTypes={fileTypeConfigs.images}
            >
              📸 快速图片上传
            </UploadButton>

            <UploadButton
              variant='secondary'
              onUpload={handleUpload}
              onUploadProgress={handleProgress}
              uploadFunction={mockUploadFunctions.standard}
              multiple={true}
              acceptedFileTypes={fileTypeConfigs.documents}
              maxFileSize={fileSizeLimits.medium}
            >
              📄 文档上传
            </UploadButton>

            <UploadButton
              variant='outline'
              onUpload={handleUpload}
              onUploadProgress={handleProgress}
              uploadFunction={mockUploadFunctions.slow}
              multiple={true}
              maxConcurrent={1}
            >
              🐌 慢速上传 (测试)
            </UploadButton>

            <UploadButton
              variant='primary'
              onUpload={handleUpload}
              onUploadProgress={handleProgress}
              uploadFunction={mockUploadFunctions.unreliable}
              multiple={true}
              maxConcurrent={3}
            >
              ⚠️ 不稳定上传
            </UploadButton>
          </div>

          <button
            onClick={clearLogs}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            清空所有记录
          </button>
        </div>

        {/* 统计和日志显示 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* 上传历史 */}
          <div>
            <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>上传历史</h4>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px",
                minHeight: "200px",
                maxHeight: "300px",
                overflowY: "auto",
                fontSize: "13px",
                fontFamily: "monospace",
              }}
            >
              {uploadHistory.length === 0 ? (
                <div
                  style={{
                    color: "#6b7280",
                    fontStyle: "italic",
                    textAlign: "center",
                    paddingTop: "80px",
                  }}
                >
                  暂无上传记录
                </div>
              ) : (
                uploadHistory.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "6px",
                      padding: "4px 0",
                      color: "#374151",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 进度日志 */}
          <div>
            <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>实时进度</h4>
            <div
              style={{
                background: "#f0f9ff",
                border: "1px solid #0ea5e9",
                borderRadius: "8px",
                padding: "12px",
                minHeight: "200px",
                maxHeight: "300px",
                overflowY: "auto",
                fontSize: "13px",
                fontFamily: "monospace",
              }}
            >
              {progressLogs.length === 0 ? (
                <div
                  style={{
                    color: "#0369a1",
                    fontStyle: "italic",
                    textAlign: "center",
                    paddingTop: "80px",
                  }}
                >
                  等待上传操作...
                </div>
              ) : (
                progressLogs.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "6px",
                      padding: "4px 0",
                      color: "#0c4a6e",
                      borderBottom: "1px solid #bae6fd",
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 使用提示 */}
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#ecfdf5",
            borderRadius: "8px",
            border: "1px solid #10b981",
          }}
        >
          <h4 style={{ margin: "0 0 12px 0", color: "#047857" }}>
            💡 功能说明
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "12px",
              fontSize: "14px",
              color: "#065f46",
            }}
          >
            <div>
              <strong>📸 快速图片上传：</strong>
              仅支持图片格式，快速上传（100ms间隔）
            </div>
            <div>
              <strong>📄 文档上传：</strong>支持文档格式，标准速度，最大5MB
            </div>
            <div>
              <strong>🐌 慢速上传：</strong>串行上传，适合测试取消功能
            </div>
            <div>
              <strong>⚠️ 不稳定上传：</strong>30%失败率，测试错误处理
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
完整的交互式上传按钮演示，展示了不同配置的按钮和实时日志：

### 功能特性

- **多种上传模式**：快速、标准、慢速、不稳定
- **文件类型过滤**：图片、文档等专门化上传
- **实时日志记录**：上传历史和进度跟踪
- **错误处理演示**：模拟网络不稳定情况
- **用户体验测试**：不同速度和并发设置

### 测试建议

1. 尝试不同类型的文件上传
2. 观察慢速上传的取消功能
3. 测试不稳定上传的错误处理
4. 对比不同按钮样式和交互
        `,
      },
    },
  },
};

// 自定义颜色示例
export const CustomColors: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        alignItems: "start",
      }}
    >
      {/* 成功主题 */}
      <UploadButton
        backgroundColor='#10B981'
        color='white'
        uploadFunction={mockUploadFunctions.reliable}
      >
        🟢 成功主题
      </UploadButton>

      {/* 警告主题 */}
      <UploadButton
        backgroundColor='#F59E0B'
        color='white'
        uploadFunction={mockUploadFunctions.reliable}
      >
        🟡 警告主题
      </UploadButton>

      {/* 危险主题 */}
      <UploadButton
        backgroundColor='#EF4444'
        color='white'
        uploadFunction={mockUploadFunctions.reliable}
      >
        🔴 危险主题
      </UploadButton>

      {/* 深色主题 */}
      <UploadButton
        backgroundColor='#1F2937'
        color='#F9FAFB'
        uploadFunction={mockUploadFunctions.reliable}
      >
        ⚫ 深色主题
      </UploadButton>

      {/* 紫色主题 */}
      <UploadButton
        backgroundColor='#8B5CF6'
        color='white'
        uploadFunction={mockUploadFunctions.reliable}
      >
        🟣 紫色主题
      </UploadButton>

      {/* 橙色边框（outline变体） */}
      <UploadButton
        variant='outline'
        borderColor='#EA580C'
        color='#EA580C'
        uploadFunction={mockUploadFunctions.reliable}
      >
        🟠 橙色边框
      </UploadButton>

      {/* 蓝色边框（outline变体） */}
      <UploadButton
        variant='outline'
        borderColor='#2563EB'
        color='#2563EB'
        uploadFunction={mockUploadFunctions.reliable}
      >
        🔵 蓝色边框
      </UploadButton>

      {/* 品牌色示例 */}
      <UploadButton
        backgroundColor='#6366F1'
        color='white'
        uploadFunction={mockUploadFunctions.reliable}
        style={{ borderRadius: "12px" }}
      >
        💎 品牌色
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
展示使用新颜色属性自定义按钮外观的各种方案：

### 颜色主题

- **成功主题**：绿色背景，适用于确认操作
- **警告主题**：黄色背景，适用于注意提醒
- **危险主题**：红色背景，适用于危险操作
- **深色主题**：深灰背景，适用于深色界面
- **紫色主题**：紫色背景，适用于创意设计
- **品牌色**：自定义品牌色彩方案

### Outline变体

- **橙色边框**：使用borderColor和color属性
- **蓝色边框**：outline变体的边框自定义

### 使用方法

使用 \`backgroundColor\`、\`color\` 和 \`borderColor\` 属性来快速自定义按钮颜色，
比使用 \`style\` 属性更加简洁和语义化。
        `,
      },
    },
  },
};

// 自定义样式示例
export const CustomStyling: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <UploadButton
        className='custom-upload-btn'
        style={{
          background: "linear-gradient(45deg, #ff6b6b, #feca57)",
          border: "none",
          color: "white",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        }}
        uploadFunction={mockUploadFunctions.reliable}
      >
        🎨 渐变风格按钮
      </UploadButton>

      <UploadButton
        style={{
          background: "#2c3e50",
          color: "#ecf0f1",
          border: "2px solid #34495e",
          borderRadius: "20px",
          padding: "12px 24px",
        }}
        uploadFunction={mockUploadFunctions.reliable}
      >
        🖤 深色主题按钮
      </UploadButton>

      <UploadButton
        style={{
          background: "transparent",
          color: "#e74c3c",
          border: "2px dashed #e74c3c",
          borderRadius: "8px",
        }}
        uploadFunction={mockUploadFunctions.reliable}
      >
        📎 虚线边框按钮
      </UploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "展示如何通过 style 属性和 className 自定义按钮样式，实现各种视觉效果。",
      },
    },
  },
};
