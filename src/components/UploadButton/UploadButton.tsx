import React, { useState } from "react";
import { DialogUploader } from "../DialogUploader/DialogUploader";
import { UploadProgress, UploadOptions, UploadResult } from "../../hooks";
import "./UploadButton.css";

interface UploadButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  onUpload?: (successfulFiles: File[], results?: UploadResult[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
  uploadFunction: (options: UploadOptions) => Promise<UploadResult>;
  maxConcurrent?: number;
  maxFiles?: number;
  maxFileSize?: number; // 单位：字节
  disabled?: boolean;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  children = "上传文件",
  className = "",
  variant = "primary",
  size = "medium",
  onUpload,
  onUploadProgress,
  multiple = true,
  acceptedFileTypes,
  uploadFunction,
  maxConcurrent = 3,
  maxFiles = 10,
  maxFileSize,
  disabled = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    if (!disabled) {
      setIsDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleUpload = (successfulFiles: File[], results?: UploadResult[]) => {
    if (onUpload) {
      onUpload(successfulFiles, results);
    }
    // 不再自动关闭对话框，让用户查看结果后手动关闭
  };

  const handleUploadProgress = (progress: UploadProgress[]) => {
    if (onUploadProgress) {
      onUploadProgress(progress);
    }
  };

  return (
    <>
      <button
        className={`upload-button upload-button--${variant} upload-button--${size} ${className} ${
          disabled ? "upload-button--disabled" : ""
        }`}
        onClick={openDialog}
        disabled={disabled}
      >
        <svg
          className="upload-button-icon"
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
        {children}
      </button>

      <DialogUploader
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onUpload={handleUpload}
        onUploadProgress={handleUploadProgress}
        multiple={multiple}
        acceptedFileTypes={acceptedFileTypes}
        uploadFunction={uploadFunction}
        maxConcurrent={maxConcurrent}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
      />
    </>
  );
};
