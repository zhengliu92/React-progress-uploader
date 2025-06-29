import React from "react";
import {
  useUploadQueue,
  UploadOptions,
  UploadResult,
  UploadProgress,
} from "../../hooks/useUploadQueue";
import { useFileSelection } from "../../hooks/useFileSelection";
import { useUploadUI } from "../../hooks/useUploadUI";
import { useDragAndDrop } from "../../hooks";
import { FileList, UploadProgress as UploadProgressComponent } from "../shared";
import { getAcceptValue, getSupportedTypesText } from "./utils";
import { ErrorIcon, UploadIcon, CancelIcon, UploadButtonIcon } from "../Icons";
import "./Uploader.css";

interface UploaderProps {
  onFileSelect?: (files: FileList) => void;
  onUpload?: (successfulFiles: File[], results?: UploadResult[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
  uploadFunction: (options: UploadOptions) => Promise<UploadResult>;
  maxConcurrent?: number;
  maxFiles?: number;
  maxFileSize?: number;
}

export const Uploader = ({
  onFileSelect,
  onUpload,
  onUploadProgress,
  multiple = false,
  acceptedFileTypes,
  uploadFunction,
  maxConcurrent = 3,
  maxFiles = 10,
  maxFileSize,
}: UploaderProps) => {
  // 使用文件选择hook
  const { selectedFiles, selectionError, addFiles, removeFile, clearFiles } =
    useFileSelection({
      multiple,
      acceptedFileTypes,
      maxFiles,
      maxFileSize,
    });

  // 使用上传队列hook（只有在提供uploadFunction时才启用）
  const {
    uploadProgress,
    isUploading,
    isCancelling,
    startUpload,
    cancelAllUploads,
    resetQueue,
  } = useUploadQueue({
    uploadFunction,
    maxConcurrent,
    onUploadProgress,
    onUploadComplete: onUpload,
  });

  // 使用UI工具hook
  const {
    getProgressColor,
    formatFileSize: formatSize,
    getUploadStats,
    getStatusMessage,
  } = useUploadUI();

  // 处理文件添加（统一处理内部和外部回调）
  const handleFileDrop = (files: FileList | File[]): boolean => {
    const fileList = Array.isArray(files) ? files : Array.from(files);
    const success = addFiles(fileList as any);

    // 如果有外部回调且添加成功，也调用外部回调
    if (success && onFileSelect && !Array.isArray(files)) {
      onFileSelect(files as FileList);
    }

    return success;
  };

  // 处理验证错误
  const handleValidationError = (errors: string[]) => {
    console.warn("文件验证错误:", errors);
  };

  // 使用拖拽和文件选择hook
  const {
    isDragActive,
    dragError,
    fileInputRef,
    dragHandlers,
    inputHandlers,
    clearDragError,
  } = useDragAndDrop({
    onFileSelect,
    acceptedFileTypes,
    multiple,
    isUploading,
    onFileDrop: handleFileDrop,
    onValidationError: handleValidationError,
  });

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      startUpload(selectedFiles);
    }
  };

  const handleClearFiles = () => {
    clearFiles();
    resetQueue();
    clearDragError();
  };

  const stats = getUploadStats(uploadProgress);

  // 获取显示的错误信息（优先显示选择错误，其次是拖拽错误）
  const displayError = selectionError || dragError;

  return (
    <div className='uploader-container'>
      {/* 错误提示 */}
      {displayError && (
        <div className='uploader-error'>
          <ErrorIcon className='uploader-icon-error' />
          <span>{displayError}</span>
          {dragError && (
            <button
              className='uploader-error-close'
              onClick={clearDragError}
              aria-label='关闭错误提示'
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* 文件拖拽区域 */}
      <div
        className={`uploader-dropzone ${isDragActive ? "drag-active" : ""} ${
          isUploading ? "uploading" : ""
        } ${displayError ? "has-error" : ""}`}
        {...dragHandlers}
      >
        <input
          ref={fileInputRef}
          type='file'
          className='uploader-input'
          multiple={multiple}
          accept={getAcceptValue(acceptedFileTypes)}
          style={{ display: "none" }}
          {...inputHandlers}
        />
        <div className='uploader-content'>
          <UploadIcon className='uploader-icon' />
          <p className='uploader-text'>
            {isDragActive
              ? "释放文件到这里"
              : `拖拽文件到这里或点击选择${multiple ? "（支持多选）" : ""}`}
          </p>
          <p className='uploader-subtext'>
            {getSupportedTypesText(acceptedFileTypes)}
            {maxFileSize && (
              <span className='uploader-size-limit'>
                ，单个文件最大 {(maxFileSize / 1024 / 1024).toFixed(1)}MB
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 已选择的文件列表 - 使用共享组件 */}
      {selectedFiles.length > 0 && uploadProgress.length === 0 && (
        <FileList
          files={selectedFiles}
          onRemoveFile={removeFile}
          formatFileSize={formatSize}
          variant='default'
          onClearAll={handleClearFiles}
        />
      )}

      {/* 上传进度 - 使用共享组件 */}
      {uploadProgress.length > 0 && (
        <UploadProgressComponent
          uploadProgress={uploadProgress}
          stats={stats}
          isCancelling={isCancelling}
          onCancelAll={cancelAllUploads}
          getStatusMessage={getStatusMessage}
          getProgressColor={getProgressColor}
          variant='default'
        />
      )}

      {/* 上传按钮和状态 */}
      <div className='uploader-actions'>
        {isUploading ? (
          <div className='uploader-uploading-info'>
            {isCancelling ? (
              <span className='uploader-cancelling-text'>正在取消...</span>
            ) : (
              <span className='uploader-uploading-text'>
                {stats.uploading} 个文件上传中
              </span>
            )}
            {!isCancelling && (
              <button
                className='uploader-button uploader-button--cancel'
                onClick={cancelAllUploads}
              >
                <CancelIcon className='uploader-icon-cancel' />
                停止上传
              </button>
            )}
          </div>
        ) : uploadProgress.length > 0 && stats.isAllCompleted ? (
          <div className='uploader-completed-info'>
            <span className='uploader-completed-text'>
              上传完成: {stats.completed} 成功, {stats.failed} 失败,{" "}
              {stats.cancelled} 取消
            </span>
            <button
              className='uploader-button uploader-button--secondary'
              onClick={handleClearFiles}
            >
              重新选择
            </button>
          </div>
        ) : (
          <div className='uploader-upload-actions'>
            {selectedFiles.length > 0 && (
              <button
                className='uploader-button uploader-button--secondary'
                onClick={handleClearFiles}
              >
                清空文件
              </button>
            )}
            <button
              className='uploader-button uploader-button--primary'
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
            >
              <UploadButtonIcon />
              开始上传 ({selectedFiles.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
