import React, { useState } from "react";
import { DialogUploader } from "./DialogUploader";
import type { Meta, StoryObj } from "@storybook/react";
import {
  mockUploadFunctions,
  fileTypeConfigs,
  fileSizeLimits,
  commonParameters,
  StoryLogger,
  LogDisplay,
  StatsDisplay,
  formatFileSize,
} from "../../stories/story-utils";

const meta: Meta<typeof DialogUploader> = {
  title: "Components/DialogUploader",
  component: DialogUploader,
  parameters: {
    ...commonParameters,
    docs: {
      description: {
        component: `
DialogUploader 是一个功能完整的弹窗式文件上传组件。

## 主要特性

- **弹窗界面**：模态弹窗，提供专注的上传体验
- **拖拽上传**：支持文件拖拽和点击选择
- **多文件支持**：可同时上传多个文件，带并发控制
- **实时进度**：显示每个文件的上传进度和总体进度
- **文件过滤**：支持文件类型和大小限制
- **错误处理**：完善的错误提示和重试机制
- **取消功能**：支持取消全部上传或单个文件
- **状态管理**：完整的上传状态跟踪
- **视觉反馈**：丰富的上传状态图标和动画

## 使用场景

- **批量文件上传**：需要上传多个文件的业务场景
- **专门的上传界面**：需要提供专注上传体验时
- **复杂上传流程**：需要详细进度和状态管理的场景
- **文件管理系统**：需要完整文件操作功能的系统
- **表单文件字段**：作为表单的高级文件输入组件

## 设计理念

DialogUploader 采用"弹窗专注"的设计模式，通过模态界面为用户提供专门的文件上传空间，避免干扰主界面。
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "控制弹窗的显示/隐藏状态",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onClose: {
      action: "onClose",
      description: "弹窗关闭回调函数",
      table: {
        type: { summary: "() => void" },
      },
    },
    multiple: {
      control: "boolean",
      description: "是否支持多文件选择",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    acceptedFileTypes: {
      control: "object",
      description: '允许的文件类型数组（例如：[".jpg", ".png", ".pdf"]）',
      table: {
        type: { summary: "string[]" },
      },
    },
    uploadFunction: {
      description: "必需的上传函数，处理文件上传逻辑",
      table: {
        type: { summary: "(options: UploadOptions) => Promise<UploadResult>" },
      },
    },
    maxConcurrent: {
      control: { type: "number", min: 1, max: 10 },
      description: "最大并发上传数量",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "3" },
      },
    },
    maxFiles: {
      control: { type: "number", min: 1, max: 50 },
      description: "最大文件数量限制",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "10" },
      },
    },
    maxFileSize: {
      control: "number",
      description: "单个文件最大大小（字节）",
      table: {
        type: { summary: "number" },
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

type Story = StoryObj<typeof DialogUploader>;

// 通用的Story包装器组件
const DialogWrapper = ({
  children,
  showLogs = false,
  showStats = false,
  ...args
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<any[]>([]);

  const handleUpload = (files: File[], results?: any[]) => {
    const timestamp = new Date().toLocaleTimeString();
    const successful = results?.filter((r) => r.success).length || files.length;
    const failed = (results?.length || files.length) - successful;

    const fileInfo = files
      .map((f) => `${f.name} (${formatFileSize(f.size)})`)
      .join(", ");
    setLogs((prev) => [
      ...prev,
      `[${timestamp}] 上传完成: ${fileInfo} (${successful} 成功${
        failed > 0 ? `, ${failed} 失败` : ""
      })`,
    ]);
  };

  const handleProgress = (progress: any[]) => {
    setUploadProgress(progress);
    args.onUploadProgress?.(progress);
  };

  const clearLogs = () => {
    setLogs([]);
    setSelectedFiles([]);
    setUploadProgress([]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "20px" }}>
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
            fontWeight: "500",
            boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow =
              "0 4px 8px rgba(59, 130, 246, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 2px 4px rgba(59, 130, 246, 0.3)";
          }}
        >
          📤 打开上传弹窗
        </button>

        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            style={{
              marginLeft: "12px",
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            清空记录
          </button>
        )}
      </div>

      <DialogUploader
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpload={handleUpload}
        onUploadProgress={handleProgress}
      />

      {/* 统计信息 */}
      {showStats && selectedFiles.length > 0 && (
        <StatsDisplay
          files={selectedFiles}
          uploadProgress={uploadProgress}
        />
      )}

      {/* 日志显示 */}
      {showLogs && (
        <LogDisplay
          logs={logs}
          title='上传日志'
          onClear={clearLogs}
          maxHeight='200px'
        />
      )}
    </div>
  );
};

export const Default: Story = {
  args: {
    uploadFunction: mockUploadFunctions.standard,
    multiple: true,
    maxConcurrent: 3,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "默认的弹窗上传器，支持多文件上传，显示实时进度和上传日志。使用标准上传速度（300ms间隔）和10%失败率。",
      },
    },
  },
};

export const SingleFile: Story = {
  args: {
    uploadFunction: mockUploadFunctions.reliable,
    multiple: false,
    maxConcurrent: 1,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "单文件上传模式，一次只能选择一个文件。使用可靠的上传函数（0%失败率）。",
      },
    },
  },
};

export const ImageGallery: Story = {
  args: {
    uploadFunction: mockUploadFunctions.fast,
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images,
    maxFiles: 10,
    maxFileSize: fileSizeLimits.large,
    maxConcurrent: 3,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
      showStats={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "图片库上传器，专门用于图片文件批量上传。支持常见图片格式，最多10个文件，单个文件最大10MB，使用快速上传。",
      },
    },
  },
};

export const DocumentManager: Story = {
  args: {
    uploadFunction: mockUploadFunctions.standard,
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.documents,
    maxFiles: 5,
    maxFileSize: fileSizeLimits.medium,
    maxConcurrent: 2,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
      showStats={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "文档管理器，专门用于文档文件上传。支持PDF、DOC、DOCX、TXT、RTF、ODT格式，最多5个文件，单个文件最大5MB。",
      },
    },
  },
};

export const MediaUploader: Story = {
  args: {
    uploadFunction: mockUploadFunctions.slow,
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.media,
    maxFiles: 3,
    maxFileSize: fileSizeLimits.xlarge,
    maxConcurrent: 1,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
      showStats={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "媒体文件上传器，用于视频和音频文件上传。支持MP4、AVI、MOV、MP3、WAV、FLAC格式，最多3个文件，单个文件最大50MB，串行上传。",
      },
    },
  },
};

export const SlowUploadTest: Story = {
  args: {
    uploadFunction: mockUploadFunctions.slow,
    multiple: true,
    maxConcurrent: 2,
    maxFiles: 5,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "慢速上传测试器，用于测试取消功能和进度显示。上传速度很慢（800ms间隔），方便观察进度变化和测试取消操作。",
      },
    },
  },
};

export const UnreliableNetwork: Story = {
  args: {
    uploadFunction: mockUploadFunctions.unreliable,
    multiple: true,
    maxConcurrent: 3,
    maxFiles: 8,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "不稳定网络模拟器，模拟网络不稳定环境（30%失败率）。用于测试错误处理、重试机制和用户体验。",
      },
    },
  },
};

export const StrictValidation: Story = {
  args: {
    uploadFunction: mockUploadFunctions.standard,
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.data,
    maxFiles: 2,
    maxFileSize: fileSizeLimits.small,
    maxConcurrent: 1,
  },
  render: (args) => (
    <DialogWrapper
      {...args}
      showLogs={true}
      showStats={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "严格验证模式，仅接受数据文件格式（CSV、XLSX、JSON、XML、YAML），最多2个文件，单个文件最大1MB，串行上传。用于演示严格的文件限制。",
      },
    },
  },
};

// 完整的交互式演示
export const InteractiveDemo: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentConfig, setCurrentConfig] = useState("standard");
    const [logs, setLogs] = useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = useState<any[]>([]);

    const configs = {
      standard: {
        name: "标准上传",
        uploadFunction: mockUploadFunctions.standard,
        acceptedFileTypes: undefined,
        maxFiles: 10,
        maxFileSize: fileSizeLimits.large,
        maxConcurrent: 3,
        icon: "📁",
      },
      images: {
        name: "图片上传",
        uploadFunction: mockUploadFunctions.fast,
        acceptedFileTypes: fileTypeConfigs.images,
        maxFiles: 10,
        maxFileSize: fileSizeLimits.large,
        maxConcurrent: 3,
        icon: "🖼️",
      },
      documents: {
        name: "文档上传",
        uploadFunction: mockUploadFunctions.standard,
        acceptedFileTypes: fileTypeConfigs.documents,
        maxFiles: 5,
        maxFileSize: fileSizeLimits.medium,
        maxConcurrent: 2,
        icon: "📄",
      },
      slow: {
        name: "慢速测试",
        uploadFunction: mockUploadFunctions.slow,
        acceptedFileTypes: undefined,
        maxFiles: 5,
        maxFileSize: fileSizeLimits.medium,
        maxConcurrent: 1,
        icon: "🐌",
      },
      unreliable: {
        name: "不稳定网络",
        uploadFunction: mockUploadFunctions.unreliable,
        acceptedFileTypes: undefined,
        maxFiles: 8,
        maxFileSize: fileSizeLimits.large,
        maxConcurrent: 3,
        icon: "⚠️",
      },
    };

    const currentSettings = configs[currentConfig as keyof typeof configs];

    const handleUpload = (files: File[], results?: any[]) => {
      const timestamp = new Date().toLocaleTimeString();
      const successful =
        results?.filter((r) => r.success).length || files.length;
      const failed = (results?.length || files.length) - successful;

      setLogs((prev) => [
        ...prev,
        `[${timestamp}] ${currentSettings.name} - 上传完成: ${
          files.length
        } 个文件 (${successful} 成功${failed > 0 ? `, ${failed} 失败` : ""})`,
      ]);
    };

    const handleProgress = (progress: any[]) => {
      setUploadProgress(progress);
    };

    const clearLogs = () => {
      setLogs([]);
      setUploadProgress([]);
    };

    return (
      <div style={{ padding: "20px", maxWidth: "900px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#374151" }}>
            交互式弹窗上传演示
          </h3>

          {/* 配置选择器 */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              选择上传配置：
            </label>
            <select
              value={currentConfig}
              onChange={(e) => setCurrentConfig(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
                color: "#374151",
                minWidth: "200px",
              }}
            >
              {Object.entries(configs).map(([key, config]) => (
                <option
                  key={key}
                  value={key}
                >
                  {config.icon} {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* 当前配置信息 */}
          <div
            style={{
              marginBottom: "20px",
              padding: "12px",
              backgroundColor: "#f0f9ff",
              borderRadius: "8px",
              border: "1px solid #0ea5e9",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>
              {currentSettings.icon} {currentSettings.name} - 配置信息
            </h4>
            <div
              style={{
                fontSize: "13px",
                color: "#0c4a6e",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "8px",
              }}
            >
              <div>
                <strong>文件类型：</strong>
                {currentSettings.acceptedFileTypes
                  ? currentSettings.acceptedFileTypes.join(", ")
                  : "不限制"}
              </div>
              <div>
                <strong>最大文件数：</strong>
                {currentSettings.maxFiles}
              </div>
              <div>
                <strong>文件大小限制：</strong>
                {formatFileSize(currentSettings.maxFileSize)}
              </div>
              <div>
                <strong>并发数：</strong>
                {currentSettings.maxConcurrent}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
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
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {currentSettings.icon} 打开 {currentSettings.name}
            </button>

            {logs.length > 0 && (
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
                清空日志
              </button>
            )}
          </div>
        </div>

        <DialogUploader
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onUpload={handleUpload}
          onUploadProgress={handleProgress}
          multiple={true}
          {...currentSettings}
        />

        {/* 日志和统计显示 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <LogDisplay
            logs={logs}
            title='上传历史'
            onClear={clearLogs}
            maxHeight='250px'
          />

          <div>
            <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>实时状态</h4>
            <div
              style={{
                background: "#f0f9ff",
                border: "1px solid #0ea5e9",
                borderRadius: "8px",
                padding: "12px",
                minHeight: "200px",
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {uploadProgress.length === 0 ? (
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
                <div>
                  <div
                    style={{
                      marginBottom: "12px",
                      fontSize: "14px",
                      color: "#0c4a6e",
                    }}
                  >
                    <strong>当前配置：</strong>
                    {currentSettings.name}
                  </div>
                  {uploadProgress.map((progress, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "8px",
                        padding: "8px",
                        backgroundColor: "white",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontWeight: "500", color: "#374151" }}>
                          {progress.fileName}
                        </span>
                        <span
                          style={{
                            color:
                              progress.status === "completed"
                                ? "#059669"
                                : progress.status === "error"
                                ? "#dc2626"
                                : progress.status === "cancelled"
                                ? "#6b7280"
                                : "#2563eb",
                          }}
                        >
                          {progress.status === "completed"
                            ? "✅"
                            : progress.status === "error"
                            ? "❌"
                            : progress.status === "cancelled"
                            ? "⏹️"
                            : "⏳"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "4px",
                        }}
                      >
                        {progress.progress}% - {progress.status}
                      </div>
                    </div>
                  ))}
                </div>
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
            💡 使用建议
          </h4>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#065f46",
              fontSize: "14px",
            }}
          >
            <li>尝试不同的配置模式，观察各种限制和行为</li>
            <li>使用慢速测试模式来观察详细的上传进度</li>
            <li>通过不稳定网络模式测试错误处理机制</li>
            <li>观察不同文件类型的验证效果</li>
            <li>测试取消和重试功能</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
完全交互式的弹窗上传演示，展示了不同配置下的上传行为：

### 功能特性

- **多种配置模式**：标准、图片、文档、慢速测试、不稳定网络
- **动态配置切换**：实时切换不同的上传配置
- **详细状态监控**：实时显示每个文件的上传状态
- **完整日志记录**：记录所有上传操作和结果
- **配置信息展示**：清楚显示当前配置的各项参数

### 测试指南

1. **标准模式**：测试正常的多文件上传流程
2. **图片模式**：测试文件类型过滤和快速上传
3. **文档模式**：测试文档文件上传和大小限制
4. **慢速测试**：观察详细进度和测试取消功能
5. **不稳定网络**：测试错误处理和重试机制
        `,
      },
    },
  },
};
