import React from "react";
import { Uploader } from "./Uploader";
import type { Meta, StoryObj } from "@storybook/react";
import {
  mockUploadFunctions,
  fileTypeConfigs,
  fileSizeLimits,
  commonParameters,
  createInteractiveWrapper,
  formatFileSize,
  getFileInfo,
} from "../../stories/story-utils";

const meta: Meta<typeof Uploader> = {
  title: "Components/Uploader",
  component: Uploader,
  parameters: {
    ...commonParameters,
    docs: {
      description: {
        component: `
Uploader 是一个功能完整的文件上传组件。

## 主要特性

- **拖拽上传**：支持文件拖拽到指定区域上传
- **点击选择**：点击区域打开文件选择对话框
- **多文件支持**：可同时处理多个文件
- **文件过滤**：支持文件类型和大小限制
- **进度显示**：实时显示上传进度
- **状态管理**：完整的上传状态跟踪
- **错误处理**：友好的错误提示
- **响应式设计**：适配不同屏幕尺寸

## 使用模式

### 仅文件选择模式
不提供 \`uploadFunction\` 时，组件仅支持文件选择功能。

### 完整上传模式  
提供 \`uploadFunction\` 时，组件支持完整的文件上传功能。

## 样式定制

组件使用CSS类名，可以通过覆盖CSS来自定义样式。
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
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
    onFileSelect: {
      action: "onFileSelect",
      description: "文件选择回调函数",
      table: {
        type: { summary: "(files: FileList) => void" },
      },
    },
    uploadFunction: {
      description: "自定义上传函数，不提供时组件仅支持文件选择",
      table: {
        type: { summary: "(options: UploadOptions) => Promise<UploadResult>" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Uploader>;

export const Default: Story = {
  args: {
    uploadFunction: mockUploadFunctions.standard,
  },
  parameters: {
    docs: {
      description: {
        story:
          "默认的文件上传组件，支持任何文件格式的单文件选择。包含完整的上传功能。",
      },
    },
  },
};

export const MultipleFiles: Story = {
  args: {
    multiple: true,
    uploadFunction: mockUploadFunctions.standard,
  },
  render: (args) => {
    const InteractiveUploader = createInteractiveWrapper(Uploader, {
      showFileList: true,
      showLogs: true,
    });
    return <InteractiveUploader {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: "支持多文件选择的组件，显示文件列表和操作日志。",
      },
    },
  },
};

export const ImageOnly: Story = {
  args: {
    acceptedFileTypes: fileTypeConfigs.images,
    multiple: true,
    uploadFunction: mockUploadFunctions.fast,
  },
  render: (args) => {
    const InteractiveUploader = createInteractiveWrapper(Uploader, {
      showFileList: true,
      showLogs: true,
    });
    return <InteractiveUploader {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "仅支持图片格式的文件上传组件。支持常见图片格式：JPG、PNG、GIF、WebP、SVG。使用快速上传模式。",
      },
    },
  },
};

export const DocumentOnly: Story = {
  args: {
    acceptedFileTypes: fileTypeConfigs.documents,
    multiple: true,
    maxFiles: 5,
    uploadFunction: mockUploadFunctions.standard,
  },
  render: (args) => {
    const InteractiveUploader = createInteractiveWrapper(Uploader, {
      showFileList: true,
      showLogs: true,
    });
    return <InteractiveUploader {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "仅支持文档格式的多文件上传组件，最多5个文件。支持：PDF、DOC、DOCX、TXT、RTF、ODT。",
      },
    },
  },
};

export const MediaFiles: Story = {
  args: {
    acceptedFileTypes: fileTypeConfigs.media,
    multiple: true,
    maxFiles: 3,
    maxFileSize: fileSizeLimits.xlarge,
    uploadFunction: mockUploadFunctions.slow,
  },
  render: (args) => {
    const InteractiveUploader = createInteractiveWrapper(Uploader, {
      showFileList: true,
      showLogs: true,
      showStats: true,
    });
    return <InteractiveUploader {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "专门用于视频和音频文件的上传组件，最多3个文件，单个文件最大50MB。包含统计信息显示。使用慢速上传模式以适应大文件。",
      },
    },
  },
};

export const WithFileSizeLimit: Story = {
  args: {
    multiple: true,
    maxFileSize: fileSizeLimits.medium,
    maxFiles: 3,
    uploadFunction: mockUploadFunctions.standard,
  },
  render: (args) => {
    const InteractiveUploader = createInteractiveWrapper(Uploader, {
      showFileList: true,
      showLogs: true,
    });
    return <InteractiveUploader {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: "带文件大小限制的上传组件，单个文件最大5MB，最多3个文件。",
      },
    },
  },
};

export const StrictValidation: Story = {
  args: {
    acceptedFileTypes: fileTypeConfigs.data,
    multiple: true,
    maxFileSize: fileSizeLimits.small,
    maxFiles: 2,
    uploadFunction: mockUploadFunctions.reliable,
  },
  render: (args) => {
    const InteractiveUploader = createInteractiveWrapper(Uploader, {
      showFileList: true,
      showLogs: true,
    });
    return <InteractiveUploader {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "严格的文件验证上传示例：仅接受数据文件格式（CSV、XLSX、JSON、XML、YAML），单个文件最大1MB，最多2个文件。使用可靠上传模式。",
      },
    },
  },
};

// 带上传功能的故事
export const WithUploadFunction: Story = {
  args: {
    multiple: true,
    acceptedFileTypes: [
      ...fileTypeConfigs.images,
      ...fileTypeConfigs.documents,
    ],
    maxFiles: 5,
    maxFileSize: fileSizeLimits.large,
    uploadFunction: mockUploadFunctions.standard,
    maxConcurrent: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "具有完整上传功能的组件。支持图片和文档格式，最多5个文件，每个文件最大10MB，最大并发数2。",
      },
    },
  },
};

export const FastUpload: Story = {
  args: {
    multiple: true,
    uploadFunction: mockUploadFunctions.fast,
    maxConcurrent: 1,
  },
  parameters: {
    docs: {
      description: {
        story: "快速上传示例，串行上传以确保顺序。适合小文件或高速网络环境。",
      },
    },
  },
};

export const SlowUpload: Story = {
  args: {
    multiple: true,
    uploadFunction: mockUploadFunctions.slow,
    maxConcurrent: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          "慢速上传示例，支持2个文件并发上传。适合测试上传进度显示和取消功能。",
      },
    },
  },
};

export const UnreliableUpload: Story = {
  args: {
    multiple: true,
    uploadFunction: mockUploadFunctions.unreliable,
    maxConcurrent: 3,
  },
  parameters: {
    docs: {
      description: {
        story: "不可靠上传示例，30%失败率。用于测试错误处理和重试机制。",
      },
    },
  },
};

export const ReliableUpload: Story = {
  args: {
    multiple: true,
    uploadFunction: mockUploadFunctions.reliable,
    maxConcurrent: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "可靠上传示例，0%失败率，高并发。适合生产环境或演示完美情况。",
      },
    },
  },
};

// 自定义渲染的交互式示例
export const InteractiveDemo: Story = {
  render: () => {
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [uploadHistory, setUploadHistory] = React.useState<string[]>([]);

    const handleFileSelect = (files: FileList) => {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);

      const timestamp = new Date().toLocaleTimeString();
      const fileInfo = newFiles
        .map((f) => `${f.name} (${formatFileSize(f.size)})`)
        .join(", ");
      setUploadHistory((prev) => [
        ...prev,
        `[${timestamp}] 选择了 ${newFiles.length} 个文件: ${fileInfo}`,
      ]);
    };

    const handleUpload = (successFiles: File[], results?: any[]) => {
      const timestamp = new Date().toLocaleTimeString();
      setUploadHistory((prev) => [
        ...prev,
        `[${timestamp}] 上传完成: ${successFiles.length}/${
          results?.length || successFiles.length
        } 个文件成功`,
      ]);
    };

    const clearAll = () => {
      setSelectedFiles([]);
      setUploadHistory([]);
    };

    const getFileTypeIcon = (file: File) => {
      if (file.type.startsWith("image/")) return "🖼️";
      if (file.type.startsWith("video/")) return "🎥";
      if (file.type.startsWith("audio/")) return "🎵";
      if (file.type.includes("pdf")) return "📄";
      if (file.type.includes("text")) return "📝";
      return "📁";
    };

    return (
      <div style={{ padding: "20px", maxWidth: "800px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0" }}>完全交互式文件上传演示</h3>
          <Uploader
            multiple={true}
            acceptedFileTypes={[
              ...fileTypeConfigs.images,
              ...fileTypeConfigs.documents,
              ...fileTypeConfigs.media,
            ]}
            maxFiles={10}
            maxFileSize={fileSizeLimits.large}
            uploadFunction={mockUploadFunctions.standard}
            onFileSelect={handleFileSelect}
            onUpload={handleUpload}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* 文件列表 */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h4 style={{ margin: 0 }}>
                已选择的文件 ({selectedFiles.length})
              </h4>
              {selectedFiles.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    marginLeft: "12px",
                    padding: "4px 8px",
                    fontSize: "12px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  清空全部
                </button>
              )}
            </div>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px",
                minHeight: "200px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {selectedFiles.length === 0 ? (
                <div
                  style={{
                    color: "#6b7280",
                    fontStyle: "italic",
                    textAlign: "center",
                    paddingTop: "80px",
                  }}
                >
                  暂无选择的文件
                </div>
              ) : (
                selectedFiles.map((file, index) => {
                  const info = getFileInfo(file);
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        marginBottom: "4px",
                        backgroundColor: "white",
                        borderRadius: "4px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <span style={{ fontSize: "20px", marginRight: "8px" }}>
                        {getFileTypeIcon(file)}
                      </span>
                      <div style={{ flex: 1, fontSize: "14px" }}>
                        <div style={{ fontWeight: 500, color: "#374151" }}>
                          {info.name}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: "12px" }}>
                          {info.size} • {info.type}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 操作历史 */}
          <div>
            <h4 style={{ margin: "0 0 12px 0" }}>操作历史</h4>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px",
                minHeight: "200px",
                maxHeight: "300px",
                overflowY: "auto",
                fontFamily: "monospace",
                fontSize: "13px",
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
                  暂无操作记录
                </div>
              ) : (
                uploadHistory.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "4px",
                      padding: "2px 0",
                      color: "#374151",
                      borderBottom:
                        index < uploadHistory.length - 1
                          ? "1px solid #e5e7eb"
                          : "none",
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#f0f9ff",
            borderRadius: "8px",
            border: "1px solid #0ea5e9",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0", color: "#0369a1" }}>💡 使用提示</h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#0c4a6e" }}>
            <li>支持拖拽文件到上传区域</li>
            <li>支持图片、文档和媒体文件</li>
            <li>最多10个文件，单个文件最大10MB</li>
            <li>可以查看文件详细信息和上传历史</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
完全交互式的文件上传演示，展示了组件的所有功能：

- **文件选择**：支持拖拽和点击选择
- **类型过滤**：支持图片、文档和媒体文件
- **详细信息**：显示文件图标、名称、大小和类型
- **操作历史**：记录所有上传操作
- **实时反馈**：即时显示文件状态变化

这个示例展示了如何在实际项目中使用上传组件。
        `,
      },
    },
  },
};
