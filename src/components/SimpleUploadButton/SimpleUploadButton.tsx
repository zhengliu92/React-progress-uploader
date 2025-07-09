import React, { useRef, useState, useCallback } from "react";
import { UploadOptions, UploadResult, UploadProgress, useUploaderCore } from "../../hooks";
import { UploadButtonIcon } from "../Icons";
import { FloatingUploadCard } from "../FloatingUploadCard";
import "./SimpleUploadButton.css";

interface SimpleUploadButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "outline" | "custom";
  size?: "small" | "medium" | "large";
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
  onUpload?: (successfulFiles: File[], results?: UploadResult[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  uploadFunction: (options: UploadOptions) => Promise<UploadResult>;
  multiple?: boolean;
  acceptedFileTypes?: string[];
  maxConcurrent?: number;
  maxFiles?: number;
  maxFileSize?: number;
  disabled?: boolean;
  showFloatingCard?: boolean; // 是否显示浮动卡片
  floatingCardTheme?: "light" | "dark" | "blue" | "green" | "purple" | "orange"; // 浮动卡片主题
}

export const SimpleUploadButton: React.FC<SimpleUploadButtonProps> = ({
  children = "选择文件",
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
  uploadFunction,
  multiple = true,
  acceptedFileTypes,
  maxConcurrent = 3,
  maxFiles = 10,
  maxFileSize,
  disabled = false,
  showFloatingCard = true,
  floatingCardTheme = "light",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCard, setShowCard] = useState(false);

  // 使用uploader core hook
  const uploader = useUploaderCore({
    multiple,
    acceptedFileTypes,
    maxFiles,
    maxFileSize,
    uploadFunction,
    maxConcurrent,
    onUpload: (successfulFiles, results) => {
      if (onUpload) {
        onUpload(successfulFiles, results);
      }
    },
    onUploadProgress: (progress) => {
      if (onUploadProgress) {
        onUploadProgress(progress);
      }
      // 如果有上传任务且启用浮动卡片，显示卡片
      if (progress.length > 0 && showFloatingCard && !showCard) {
        setShowCard(true);
      }
    },
  });

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // 先清空已有状态，确保每次都是重新选择
    uploader.handleClearFiles();
    
         // 验证文件并获取有效文件
     const validFiles: File[] = [];
     for (const file of fileArray) {
       // 使用uploader内部的验证逻辑
       const validation = uploader.validateFile(file, validFiles);
       if (validation.isValid) {
         validFiles.push(file);
       }
     }
    
    if (validFiles.length > 0) {
      // 如果启用浮动卡片，立即显示
      if (showFloatingCard) {
        setShowCard(true);
      }
      
      // 直接使用startUpload方法上传有效文件，不依赖于状态更新
      uploader.startUpload(validFiles);
    }

    // 清空input值，允许重复选择同一文件
    event.target.value = '';
  };

  const handleClearCard = useCallback(() => {
    setShowCard(false);
    uploader.resetQueue();
  }, [uploader]);

  // 处理自定义颜色
  const hasCustomColors = color || backgroundColor || borderColor || variant === "custom";
  const customStyle: React.CSSProperties = hasCustomColors
    ? {
        ...(backgroundColor && { backgroundColor }),
        ...(color && { color }),
        ...(borderColor && { borderColor }),
        ...(variant === "outline" && borderColor && { 
          borderWidth: "1px", 
          borderStyle: "solid" 
        }),
        ...(style || {}),
      }
    : style || {};

  // 选择变体类名
  const effectiveVariant = hasCustomColors && variant !== "custom" ? "custom" : variant;

  // 构建accept属性
  const acceptAttribute = acceptedFileTypes ? acceptedFileTypes.join(',') : undefined;

  return (
    <>
      <button
        className={`simple-upload-button simple-upload-button--${effectiveVariant} simple-upload-button--${size} ${className} ${
          disabled ? "simple-upload-button--disabled" : ""
        }`}
        style={customStyle}
        onClick={handleClick}
        disabled={disabled}
      >
        {showIcon &&
          (icon ? (
            <span className="simple-upload-button-icon simple-upload-button-custom-icon">
              {icon}
            </span>
          ) : (
            <UploadButtonIcon className="simple-upload-button-icon uploader-icon-upload-button" />
          ))}
        {children}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptAttribute}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* 浮动上传卡片 */}
      {showFloatingCard && (
        <FloatingUploadCard
          uploadProgress={uploader.uploadProgress}
          stats={uploader.stats}
          isCancelling={uploader.isCancelling}
          onCancelAll={uploader.cancelAllUploads}
          onClear={handleClearCard}
          getStatusMessage={uploader.getStatusMessage}
          getProgressColor={uploader.getProgressColor}
          visible={showCard}
          theme={floatingCardTheme}
        />
      )}
    </>
  );
}; 