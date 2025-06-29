import React, { useState } from "react";
import { DialogUploader } from "../DialogUploader/DialogUploader";
import { UploadProgress, UploadOptions, UploadResult } from "../../hooks";
import { DialogUploadIcon } from "../Icons";
import "./UploadButton.css";

interface UploadButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
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
  style,
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
        style={style}
        onClick={openDialog}
        disabled={disabled}
      >
        <DialogUploadIcon className='upload-button-icon uploader-icon-dialog-upload' />
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
