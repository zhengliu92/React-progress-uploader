import React, { useState, useRef } from "react";
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
    docs: {
      description: {
        component: `
UploadButton 是一个功能完整的文件上传按钮组件。

## 主要特性

- **真实上传**：必须提供 uploadFunction 来处理文件上传
- **多种样式**：支持 primary、secondary、outline 三种样式
- **多尺寸支持**：small、medium、large 三种尺寸
- **文件过滤**：支持文件类型和大小限制
- **进度显示**：内置弹窗显示上传进度
- **并发控制**：可配置最大并发上传数量

## 使用场景

- 需要简单上传按钮的场景
- 表单中的文件上传字段
- 快速文件上传需求
- 需要自定义样式的上传按钮
        `,
      },
    },
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
    maxFiles: {
      control: "number",
      description: "最大文件数量限制",
    },
    maxFileSize: {
      control: "number",
      description: "单个文件最大大小（字节）",
    },
    disabled: {
      control: "boolean",
      description: "是否禁用按钮",
    },
    uploadFunction: {
      description: "必需的上传函数，处理文件上传逻辑",
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
    onUpload: (files: File[], results?: UploadResult[]) => {
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
    onUpload: (files: File[], results?: UploadResult[]) => {
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
    onUpload: (files: File[], results?: UploadResult[]) => {
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
    const lastLogKey = useRef<string>("");

    const handleUpload = (files: File[], results?: UploadResult[]) => {
      const fileNames = files.map((f) => f.name);
      setUploadHistory((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 上传完成: ${fileNames.join(
          ", "
        )} (${files.length}/${results?.length || files.length} 成功)`,
      ]);
    };

    const handleProgress = (progress: UploadProgress[]) => {
      const completed = progress.filter((p) => p.status === "completed").length;
      const cancelled = progress.filter((p) => p.status === "cancelled").length;
      const errors = progress.filter((p) => p.status === "error").length;
      const uploading = progress.filter((p) => p.status === "uploading").length;

      // 只在重要状态变化时记录日志，避免过多的进度更新日志
      const currentKey = `${completed}-${cancelled}-${errors}-${uploading}`;

      if (lastLogKey.current !== currentKey) {
        lastLogKey.current = currentKey;

        setProgressLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] 进度: ${completed}/${
            progress.length
          } 完成${uploading > 0 ? `, ${uploading} 上传中` : ""}${
            cancelled > 0 ? `, ${cancelled} 取消` : ""
          }${errors > 0 ? `, ${errors} 失败` : ""}`,
        ]);
      }
    };

    const clearHistory = () => {
      setUploadHistory([]);
      setProgressLogs([]);
      lastLogKey.current = "";
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

// 即时上传模式 - 选择文件后立即上传
export const InstantUpload: Story = {
  args: {
    children: "选择并立即上传",
    multiple: true,
    uploadFunction: mockUploadFunction,
    onUpload: (files: File[], results?: UploadResult[]) => {
      console.log("上传完成的文件:", files);
      const successCount =
        results?.filter((r) => r.success).length || files.length;
      alert(
        `已上传 ${successCount}/${files.length} 个文件: ${files
          .map((f) => f.name)
          .join(", ")}`
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story: "选择文件后立即开始上传，适用于需要快速上传的场景。",
      },
    },
  },
};

export const FileSelectionDemo: Story = {
  render: () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileUpload = (files: File[], results?: UploadResult[]) => {
      setSelectedFiles(files);
      console.log("上传完成:", files, results);
    };

    const clearSelection = () => {
      setSelectedFiles([]);
    };

    return (
      <div style={{ maxWidth: "500px", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <UploadButton
            onUpload={handleFileUpload}
            uploadFunction={mockUploadFunction}
            multiple={true}
            variant="outline"
          >
            选择并上传文件
          </UploadButton>

          {selectedFiles.length > 0 && (
            <button
              onClick={clearSelection}
              style={{
                marginLeft: "12px",
                padding: "8px 16px",
                background: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              清空选择
            </button>
          )}
        </div>

        <div>
          <h4 style={{ margin: "0 0 8px 0" }}>已选择的文件:</h4>
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              padding: "12px",
              minHeight: "100px",
            }}
          >
            {selectedFiles.length === 0 ? (
              <p style={{ margin: 0, color: "#64748b" }}>尚未选择任何文件</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {selectedFiles.map((file, index) => (
                  <li key={index} style={{ marginBottom: "4px" }}>
                    <strong>{file.name}</strong> (
                    {(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "演示文件上传功能，上传完成后显示文件信息，用于文件管理场景。",
      },
    },
  },
};

export const ImageUploadWithPreview: Story = {
  render: () => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleImageUpload = (files: File[], results?: UploadResult[]) => {
      setSelectedImages(files);
      console.log("图片上传完成:", files, results);

      // 生成图片预览
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            previews.push(e.target.result as string);
            if (previews.length === files.length) {
              setImagePreviews(previews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    };

    const clearSelection = () => {
      setSelectedImages([]);
      setImagePreviews([]);
    };

    return (
      <div style={{ maxWidth: "600px", padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <UploadButton
            onUpload={handleImageUpload}
            uploadFunction={mockUploadFunction}
            acceptedFileTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
            multiple={true}
            variant="secondary"
          >
            上传图片并预览
          </UploadButton>

          {selectedImages.length > 0 && (
            <button
              onClick={clearSelection}
              style={{
                marginLeft: "12px",
                padding: "8px 16px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              清空预览
            </button>
          )}
        </div>

        {imagePreviews.length > 0 && (
          <div>
            <h4 style={{ margin: "0 0 12px 0" }}>图片预览:</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "12px",
              }}
            >
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#f8fafc",
                  }}
                >
                  <img
                    src={preview}
                    alt={selectedImages[index]?.name}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      padding: "8px",
                      fontSize: "12px",
                      background: "white",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedImages[index]?.name}
                    </div>
                    <div style={{ color: "#64748b" }}>
                      {(selectedImages[index]?.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "上传图片并显示预览，演示如何在上传完成后处理和预览图片文件。",
      },
    },
  },
};

export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      files: [] as File[],
    });

    const handleFileUpload = (files: File[], results?: UploadResult[]) => {
      setFormData((prev) => ({ ...prev, files }));
      console.log("表单文件上传完成:", files, results);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("表单数据:", formData);
      alert(
        `表单提交:\n标题: ${formData.title}\n描述: ${
          formData.description
        }\n文件: ${formData.files.map((f) => f.name).join(", ")}`
      );
    };

    const handleReset = () => {
      setFormData({ title: "", description: "", files: [] });
    };

    return (
      <div style={{ maxWidth: "500px", padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
              }}
            >
              标题:
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "bold",
              }}
            >
              描述:
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              附件:
            </label>
            <UploadButton
              onUpload={handleFileUpload}
              uploadFunction={mockUploadFunction}
              multiple={true}
              variant="outline"
              size="small"
            >
              选择文件
            </UploadButton>

            {formData.files.length > 0 && (
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                <strong>已选择 {formData.files.length} 个文件:</strong>
                <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                  {formData.files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              提交表单
            </button>

            <button
              type="button"
              onClick={handleReset}
              style={{
                padding: "10px 20px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              重置
            </button>
          </div>
        </form>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "演示如何将文件上传按钮集成到表单中，上传完成后文件会作为表单数据的一部分。",
      },
    },
  },
};

export const MultipleSelectionTypes: Story = {
  render: () => {
    const [allFiles, setAllFiles] = useState<{ [key: string]: File[] }>({
      documents: [],
      images: [],
      any: [],
    });

    const handleFileUpload =
      (type: string) => (files: File[], results?: UploadResult[]) => {
        setAllFiles((prev) => ({ ...prev, [type]: files }));
        console.log(`${type} 文件上传完成:`, files, results);
      };

    const clearAll = () => {
      setAllFiles({ documents: [], images: [], any: [] });
    };

    const totalFiles = Object.values(allFiles).flat().length;

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
            onUpload={handleFileUpload("documents")}
            uploadFunction={mockUploadFunction}
            acceptedFileTypes={[".pdf", ".doc", ".docx", ".txt"]}
            multiple={true}
            variant="primary"
            size="small"
          >
            上传文档
          </UploadButton>

          <UploadButton
            onUpload={handleFileUpload("images")}
            uploadFunction={mockUploadFunction}
            acceptedFileTypes={[".jpg", ".jpeg", ".png", ".gif"]}
            multiple={true}
            variant="secondary"
            size="small"
          >
            上传图片
          </UploadButton>

          <UploadButton
            onUpload={handleFileUpload("any")}
            uploadFunction={mockUploadFunction}
            multiple={true}
            variant="outline"
            size="small"
          >
            上传任意文件
          </UploadButton>

          {totalFiles > 0 && (
            <button
              onClick={clearAll}
              style={{
                padding: "6px 12px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              清空所有
            </button>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
          }}
        >
          {Object.entries(allFiles).map(([type, files]) => (
            <div key={type}>
              <h4 style={{ margin: "0 0 8px 0", textTransform: "capitalize" }}>
                {type === "documents"
                  ? "文档"
                  : type === "images"
                  ? "图片"
                  : "其他文件"}{" "}
                ({files.length})
              </h4>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  padding: "8px",
                  minHeight: "120px",
                  fontSize: "12px",
                }}
              >
                {files.length === 0 ? (
                  <p style={{ margin: 0, color: "#64748b" }}>无文件</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: "16px" }}>
                    {files.map((file, index) => (
                      <li key={index} style={{ marginBottom: "2px" }}>
                        {file.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "演示多个不同类型的文件上传按钮，每个按钮有不同的文件类型限制，支持分类上传管理。",
      },
    },
  },
};
