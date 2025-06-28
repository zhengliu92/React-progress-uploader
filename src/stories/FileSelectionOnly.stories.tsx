import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { UploadButton } from "../components/UploadButton/UploadButton";
import { DialogUploader } from "../components/DialogUploader/DialogUploader";

const meta: Meta<typeof UploadButton> = {
  title: "Components/FileSelectionOnly",
  component: UploadButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "这些示例展示了当不提供 uploadFunction 时，组件如何作为纯文件选择器使用。",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础文件选择示例
export const BasicFileSelection: Story = {
  args: {
    children: "选择文件",
    multiple: true,
    acceptedFileTypes: [".jpg", ".png", ".pdf"],
    maxFiles: 5,
    onUpload: (files) => {
      console.log("选择的文件:", files);
      alert(
        `已选择 ${files.length} 个文件:\n${files.map((f) => f.name).join("\n")}`
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "不提供 uploadFunction 时，组件将作为文件选择器使用，选择文件后直接触发 onUpload 回调。",
      },
    },
  },
};

// 单文件选择示例
export const SingleFileSelection: Story = {
  args: {
    children: "选择单个文件",
    multiple: false,
    acceptedFileTypes: [".pdf"],
    onUpload: (files) => {
      console.log("选择的文件:", files[0]);
      alert(`已选择文件: ${files[0]?.name}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "单文件选择模式，适用于只需要选择一个文件的场景。",
      },
    },
  },
};

// 图片选择示例
export const ImageSelection: Story = {
  args: {
    children: "选择图片",
    multiple: true,
    acceptedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    maxFiles: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    onUpload: (files) => {
      console.log("选择的图片:", files);
      const fileList = files
        .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`)
        .join("\n");
      alert(`已选择 ${files.length} 张图片:\n${fileList}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "专门用于选择图片文件，带有文件大小限制。",
      },
    },
  },
};

// DialogUploader 文件选择示例
export const DialogFileSelection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    console.log("通过对话框选择的文件:", files);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#3B82F6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        打开文件选择对话框
      </button>

      {selectedFiles.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#F3F4F6",
            borderRadius: "8px",
          }}
        >
          <strong>已选择的文件:</strong>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <DialogUploader
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpload={handleFileSelect}
        multiple={true}
        acceptedFileTypes={[".pdf", ".doc", ".docx", ".txt"]}
        maxFiles={3}
        maxFileSize={10 * 1024 * 1024} // 10MB
      />
    </div>
  );
};

DialogFileSelection.parameters = {
  docs: {
    description: {
      story:
        "使用 DialogUploader 组件进行文件选择，不进行实际上传。选择文件后会直接返回文件列表。",
    },
  },
};

// 文件信息展示示例
export const FileInfoDisplay = () => {
  const [fileInfo, setFileInfo] = useState<string>("");

  const handleFileSelect = (files: File[]) => {
    const info = files
      .map((file) => {
        return `文件名: ${file.name}
大小: ${(file.size / 1024 / 1024).toFixed(2)} MB
类型: ${file.type || "未知"}
最后修改: ${new Date(file.lastModified).toLocaleString()}`;
      })
      .join("\n\n---\n\n");

    setFileInfo(info);
  };

  return (
    <div>
      <UploadButton
        onUpload={handleFileSelect}
        multiple={true}
        acceptedFileTypes={[".jpg", ".png", ".pdf", ".doc", ".docx"]}
        maxFiles={5}
      >
        选择文件并查看详情
      </UploadButton>

      {fileInfo && (
        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "#F9FAFB",
            borderRadius: "8px",
            whiteSpace: "pre-line",
            fontSize: "14px",
            fontFamily: "monospace",
          }}
        >
          <strong>文件详情:</strong>
          <br />
          <br />
          {fileInfo}
        </div>
      )}
    </div>
  );
};

FileInfoDisplay.parameters = {
  docs: {
    description: {
      story: "展示如何获取和显示选择文件的详细信息，包括文件名、大小、类型等。",
    },
  },
};
