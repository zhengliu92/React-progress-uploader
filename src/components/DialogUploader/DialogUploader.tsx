import React, { useEffect } from "react";
import { Uploader } from "../Uploader/Uploader";
import { useUploaderCore } from "../../hooks/useUploaderCore";
import {
  FileList,
  UploadProgress as UploadProgressComponent,
  StatusIcon,
} from "../shared";
import {
  UploadOptions,
  UploadResult,
  UploadProgress,
} from "../../hooks/useUploadQueue";
import { DialogErrorIcon, CloseIcon, DialogCancelIcon } from "../Icons";
import "./DialogUploader.css";

interface DialogUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (successfulFiles: File[], results?: UploadResult[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
  uploadFunction: (options: UploadOptions) => Promise<UploadResult>;
  maxConcurrent?: number;
  maxFiles?: number;
  maxFileSize?: number;
}

export const DialogUploader = ({
  isOpen,
  onClose,
  onUpload,
  onUploadProgress,
  multiple = true,
  acceptedFileTypes,
  uploadFunction,
  maxConcurrent = 3,
  maxFiles = 10,
  maxFileSize,
}: DialogUploaderProps) => {
  // 使用核心上传器hook
  const {
    selectedFiles,
    selectionError,
    addFiles,
    removeFile,
    handleClearFiles,
    uploadProgress,
    isUploading,
    isCancelling,
    cancelAllUploads,
    handleUpload,
    stats,
    formatFileSize,
    getStatusMessage,
    getProgressColor,
    getOverallStatusTitle,
  } = useUploaderCore({
    multiple,
    acceptedFileTypes,
    maxFiles,
    maxFileSize,
    uploadFunction,
    maxConcurrent,
    onUpload,
    onUploadProgress,
  });

  // 当对话框关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      handleClearFiles();
    }
  }, [isOpen, handleClearFiles]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isUploading) {
      onClose();
    }
  };

  const handleFileSelect = (files: FileList) => {
    // 将选择的文件添加到DialogUploader的状态中
    addFiles(files);
  };

  const handleConfirmUpload = () => {
    if (selectedFiles.length > 0) {
      handleUpload();
    }
  };

  return (
    <div
      className='dialog-uploader-backdrop'
      onClick={handleBackdropClick}
    >
      <div className='dialog-uploader-content'>
        <div className='dialog-uploader-header'>
          <h2 className='dialog-uploader-title'>
            {getOverallStatusTitle(isUploading, isCancelling, uploadProgress)}
            {multiple &&
              !isUploading &&
              uploadProgress.length === 0 &&
              " (支持多文件)"}
          </h2>
          <button
            className='dialog-uploader-close'
            onClick={onClose}
            disabled={isUploading}
            aria-label='关闭'
          >
            <CloseIcon
              className='uploader-icon-close'
              size={24}
            />
          </button>
        </div>

        <div className='dialog-uploader-body'>
          {/* 错误提示 */}
          {selectionError && (
            <div className='dialog-uploader-error'>
              <DialogErrorIcon
                className='uploader-icon-dialog-error'
                fill='#FEE2E2'
                stroke='#EF4444'
              />
              <span>{selectionError}</span>
            </div>
          )}

          {/* 文件选择区域 */}
          {uploadProgress.length === 0 && selectedFiles.length === 0 && (
            <Uploader
              onFileSelect={handleFileSelect}
              multiple={multiple}
              acceptedFileTypes={acceptedFileTypes}
              uploadFunction={() => Promise.resolve({ success: true })}
              hideActions={true}
            />
          )}

          {/* 已选择的文件列表 - 使用共享组件 */}
          {selectedFiles.length > 0 && uploadProgress.length === 0 && (
            <FileList
              files={selectedFiles}
              onRemoveFile={removeFile}
              formatFileSize={formatFileSize}
              variant='dialog'
              showHeader={true}
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
              variant='dialog'
            />
          )}
        </div>

        <div className='dialog-uploader-footer'>
          {isUploading ? (
            <>
              <div className='dialog-uploader-footer-status'>
                {isCancelling ? (
                  <span className='dialog-uploader-cancelling-text'>
                    正在取消...
                  </span>
                ) : (
                  <span className='dialog-uploader-uploading-text'>
                    {stats.uploading} 个文件上传中
                  </span>
                )}
              </div>
              {!isCancelling && (
                <button
                  className='dialog-uploader-button dialog-uploader-button--cancel-upload'
                  onClick={cancelAllUploads}
                >
                  <DialogCancelIcon />
                  停止上传
                </button>
              )}
            </>
          ) : uploadProgress.length > 0 && stats.isAllCompleted ? (
            // 上传完成状态
            <>
              <div className='dialog-uploader-footer-status'>
                <span className='dialog-uploader-completed-text'>
                  上传完成: {stats.completed} 成功, {stats.failed} 失败,{" "}
                  {stats.cancelled} 取消
                </span>
              </div>
              <button
                className='dialog-uploader-button dialog-uploader-button--primary'
                onClick={onClose}
              >
                关闭
              </button>
            </>
          ) : (
            // 初始状态
            <>
              <button
                className='dialog-uploader-button dialog-uploader-button--secondary'
                onClick={onClose}
              >
                取消
              </button>
              <button
                className='dialog-uploader-button dialog-uploader-button--primary'
                onClick={handleConfirmUpload}
                disabled={selectedFiles.length === 0}
              >
                开始上传 ({selectedFiles.length})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
