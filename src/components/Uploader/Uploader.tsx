import React, { useState, useRef } from "react";
import "./Uploader.css";

interface UploaderProps {
  onFileSelect?: (files: FileList) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
}

export const Uploader: React.FC<UploaderProps> = ({
  onFileSelect,
  multiple = false,
  acceptedFileTypes,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 验证文件类型
  const validateFileType = (file: File): boolean => {
    if (
      !acceptedFileTypes ||
      !Array.isArray(acceptedFileTypes) ||
      acceptedFileTypes.length === 0
    ) {
      return true;
    }

    const fileName = file.name.toLowerCase();
    return acceptedFileTypes.some((type) => {
      const normalizedType = type.toLowerCase().startsWith(".")
        ? type.toLowerCase()
        : `.${type.toLowerCase()}`;
      return fileName.endsWith(normalizedType);
    });
  };

  // 过滤有效文件
  const filterValidFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (validateFileType(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      const supportedTypes = Array.isArray(acceptedFileTypes)
        ? acceptedFileTypes.join(", ")
        : "";
      alert(
        `以下文件类型不受支持: ${invalidFiles.join(
          ", "
        )}\n支持的文件类型: ${supportedTypes}`
      );
    }

    return validFiles;
  };

  const handleFiles = (files: FileList) => {
    if (files && files.length > 0) {
      const validFiles = filterValidFiles(files);

      if (validFiles.length > 0) {
        // 创建一个新的 FileList 对象（模拟）
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));

        if (onFileSelect) {
          onFileSelect(dataTransfer.files);
        } else {
          const fileNames = validFiles.map((file) => file.name).join(", ");
          alert(
            `Selected file${validFiles.length > 1 ? "s" : ""}: ${fileNames}`
          );
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
      event.target.value = "";
    }
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // 只有当鼠标真正离开容器时才设置为false
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);

    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // 生成 accept 属性值
  const getAcceptValue = (): string | undefined => {
    if (
      !acceptedFileTypes ||
      !Array.isArray(acceptedFileTypes) ||
      acceptedFileTypes.length === 0
    ) {
      return undefined;
    }

    return acceptedFileTypes
      .map((type) => {
        return type.startsWith(".") ? type : `.${type}`;
      })
      .join(",");
  };

  // 生成支持的文件类型显示文本
  const getSupportedTypesText = (): string => {
    if (
      !acceptedFileTypes ||
      !Array.isArray(acceptedFileTypes) ||
      acceptedFileTypes.length === 0
    ) {
      return "支持任何文件格式";
    }

    const types = acceptedFileTypes
      .map((type) => (type.startsWith(".") ? type : `.${type}`))
      .join(", ");

    return `支持的文件格式: ${types}`;
  };

  return (
    <div
      className={`uploader-dropzone ${isDragActive ? "drag-active" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="uploader-input"
        onChange={handleChange}
        multiple={multiple}
        accept={getAcceptValue()}
        style={{ display: "none" }}
      />
      <div className="uploader-content">
        <svg
          className="uploader-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="uploader-text">
          {isDragActive
            ? "释放文件到这里"
            : `拖拽文件到这里或点击选择${multiple ? "（支持多选）" : ""}`}
        </p>
        <p className="uploader-subtext">{getSupportedTypesText()}</p>
      </div>
    </div>
  );
};
