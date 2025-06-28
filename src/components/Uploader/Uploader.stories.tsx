import React from "react";
import { Uploader } from "./Uploader";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Uploader> = {
  title: "Components/Uploader",
  component: Uploader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onFileSelect: {
      action: "onFileSelect",
      description: "文件选择回调函数",
    },
    multiple: {
      control: "boolean",
      description: "是否支持多选文件",
      defaultValue: false,
    },
    acceptedFileTypes: {
      control: "object",
      description: "支持的文件类型数组，如 ['.jpg', '.png', 'pdf']",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Uploader>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "默认的文件上传组件，支持任何文件格式的单文件上传。",
      },
    },
  },
};

export const MultipleFiles: Story = {
  args: {
    multiple: true,
    onFileSelect: (files: FileList) => {
      const fileNames = Array.from(files)
        .map((file) => file.name)
        .join(", ");
      alert(`已选择 ${files.length} 个文件: ${fileNames}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "支持多文件选择的上传组件。",
      },
    },
  },
};

export const ImageOnly: Story = {
  args: {
    acceptedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    onFileSelect: (files: FileList) => {
      const fileInfo = Array.from(files).map((file) => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
      }));
      console.log("图片文件:", fileInfo);
      alert(`已选择 ${files.length} 个图片文件`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "仅支持图片格式的文件上传组件。",
      },
    },
  },
};

export const DocumentOnly: Story = {
  args: {
    acceptedFileTypes: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
    multiple: true,
    onFileSelect: (files: FileList) => {
      const fileNames = Array.from(files).map((file) => file.name);
      console.log("文档文件:", fileNames);
      alert(`已选择 ${files.length} 个文档文件:\n${fileNames.join("\n")}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "仅支持文档格式的多文件上传组件。",
      },
    },
  },
};

export const VideoAudio: Story = {
  args: {
    acceptedFileTypes: [".mp4", ".avi", ".mov", ".mp3", ".wav", ".flac"],
    multiple: true,
    onFileSelect: (files: FileList) => {
      const mediaFiles = Array.from(files).map((file) => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type || "未知类型",
      }));

      console.log("媒体文件:", mediaFiles);

      const totalSize = mediaFiles.reduce(
        (sum, file) => sum + parseFloat(file.size.replace(" MB", "")),
        0
      );

      alert(
        `已选择 ${files.length} 个媒体文件\n总大小: ${totalSize.toFixed(2)} MB`
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story: "专门用于视频和音频文件的上传组件。",
      },
    },
  },
};

export const WithFileInfo: Story = {
  args: {
    multiple: true,
    onFileSelect: (files: FileList) => {
      const fileDetails = Array.from(files).map((file, index) => {
        const fileInfo = {
          index: index + 1,
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type || "未知类型",
          lastModified: new Date(file.lastModified).toLocaleString("zh-CN"),
        };

        console.log(`文件 ${fileInfo.index}:`, fileInfo);
        return fileInfo;
      });

      const totalSize = Array.from(files).reduce(
        (sum, file) => sum + file.size,
        0
      );

      const summary = `已选择 ${files.length} 个文件\n总大小: ${(
        totalSize / 1024
      ).toFixed(2)} KB\n\n文件列表:\n${fileDetails
        .map((f) => `${f.index}. ${f.name} (${f.size})`)
        .join("\n")}`;

      alert(summary);
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "展示文件详细信息的处理函数示例，包括文件名、大小、类型和修改时间。",
      },
    },
  },
};

export const StrictValidation: Story = {
  args: {
    acceptedFileTypes: [".json", ".xml", ".csv"],
    multiple: true,
    onFileSelect: (files: FileList) => {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log(
            `${file.name} 内容预览:`,
            e.target?.result?.toString().slice(0, 200) + "..."
          );
        };
        reader.readAsText(file);
      });

      alert(`严格验证通过！已选择 ${files.length} 个数据文件`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "严格的文件类型验证示例，仅接受特定的数据文件格式。",
      },
    },
  },
};

export const Interactive: Story = {
  render: () => {
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

    const handleFileSelect = (files: FileList) => {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);

      const fileInfo = newFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

      console.log("新增文件:", fileInfo);
    };

    const clearFiles = () => {
      setUploadedFiles([]);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Uploader
          multiple={true}
          acceptedFileTypes={[".jpg", ".png", ".pdf", ".txt"]}
          onFileSelect={handleFileSelect}
        />

        {uploadedFiles.length > 0 && (
          <div
            style={{
              padding: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              minWidth: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h4 style={{ margin: 0 }}>已上传文件 ({uploadedFiles.length})</h4>
              <button
                onClick={clearFiles}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                清空
              </button>
            </div>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  style={{ marginBottom: "4px", fontSize: "14px" }}
                >
                  <strong>{file.name}</strong> - {(file.size / 1024).toFixed(2)}{" "}
                  KB
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "完全交互式的文件上传组件示例，带有文件列表显示和管理功能。支持图片、PDF 和文本文件的多选上传。",
      },
    },
  },
};
