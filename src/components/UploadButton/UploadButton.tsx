import React, { useState } from "react";
import { DialogUploader } from "../DialogUploader/DialogUploader";
import { UploadProgress, UploadOptions, UploadResult } from "../../hooks";
import { DialogUploadIcon } from "../Icons";
import "./UploadButton.css";

interface UploadButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "outline" | "custom";
  size?: "small" | "medium" | "large";
  color?: string; // 自定义主色调
  backgroundColor?: string; // 自定义背景色
  borderColor?: string; // 自定义边框色（outline变体用）
  showIcon?: boolean; // 是否显示图标
  icon?: React.ReactNode; // 自定义图标
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
  color,
  backgroundColor,
  borderColor,
  showIcon = true,
  icon,
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

  // 处理自定义颜色
  const hasCustomColors =
    color || backgroundColor || borderColor || variant === "custom";
  const customStyle: React.CSSProperties = hasCustomColors
    ? {
        ...(backgroundColor && { backgroundColor }),
        ...(color && { color }),
        ...(borderColor && { borderColor }),
        ...(variant === "outline" &&
          borderColor && { borderWidth: "1px", borderStyle: "solid" }),
        ...(style || {}),
      }
    : style || {};

  // 选择变体类名
  const effectiveVariant =
    hasCustomColors && variant !== "custom" ? "custom" : variant;

  return (
    <>
      <button
        className={`upload-button upload-button--${effectiveVariant} upload-button--${size} ${className} ${
          disabled ? "upload-button--disabled" : ""
        }`}
        style={customStyle}
        onClick={openDialog}
        disabled={disabled}
      >
        {showIcon &&
          (icon ? (
            <span className='upload-button-icon upload-button-custom-icon'>
              {icon}
            </span>
          ) : (
            <DialogUploadIcon className='upload-button-icon uploader-icon-dialog-upload' />
          ))}
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
