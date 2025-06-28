import React, { useEffect } from "react";
import { Uploader } from "../Uploader/Uploader";
import {
  useUploadQueue,
  UploadOptions,
  UploadResult,
  UploadProgress,
} from "../../hooks/useUploadQueue";
import { useFileSelection } from "../../hooks/useFileSelection";
import { useUploadUI } from "../../hooks/useUploadUI";
import "./DialogUploader.css";

interface DialogUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (successfulFiles: File[], results: UploadResult[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  multiple?: boolean;
  acceptedFileTypes?: string[];
  uploadFunction: (options: UploadOptions) => Promise<UploadResult>;
  maxConcurrent?: number;
  maxFiles?: number;
  maxFileSize?: number;
}

export const DialogUploader: React.FC<DialogUploaderProps> = ({
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
}) => {
  // 使用文件选择hook
  const { selectedFiles, selectionError, addFiles, removeFile, clearFiles } =
    useFileSelection({
      multiple,
      acceptedFileTypes,
      maxFiles,
      maxFileSize,
    });

  // 使用上传队列hook
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
    getStatusIconType,
    formatFileSize: formatSize,
    getUploadStats,
    getStatusMessage,
    getOverallStatusTitle,
  } = useUploadUI();

  // 当对话框关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      clearFiles();
      resetQueue();
    }
  }, [isOpen, clearFiles, resetQueue]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isUploading) {
      onClose();
    }
  };

  const handleFileSelect = (files: FileList) => {
    addFiles(files);
  };

  const handleConfirmUpload = () => {
    if (selectedFiles.length > 0) {
      startUpload(selectedFiles);
    }
  };

  // 优化后的状态图标
  const getStatusIcon = (status: UploadProgress["status"]) => {
    const iconType = getStatusIconType(status);

    switch (iconType) {
      case "success":
        return (
          <div className="dialog-uploader-status-icon dialog-uploader-status-icon--success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#10B981" />
              <path
                d="M8 12l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case "error":
        return (
          <div className="dialog-uploader-status-icon dialog-uploader-status-icon--error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#EF4444" />
              <path
                d="M15 9l-6 6M9 9l6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case "cancelled":
        return (
          <div className="dialog-uploader-status-icon dialog-uploader-status-icon--cancelled">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#6B7280" />
              <path
                d="M15 9l-6 6M9 9l6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case "uploading":
        return (
          <div className="dialog-uploader-status-icon dialog-uploader-status-icon--uploading">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="dialog-uploader-spinning"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <path
                d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      case "pending":
        return (
          <div className="dialog-uploader-status-icon dialog-uploader-status-icon--pending">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="#F3F4F6"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <path
                d="M12 6v6l4 2"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const stats = getUploadStats(uploadProgress);

  return (
    <div className="dialog-uploader-backdrop" onClick={handleBackdropClick}>
      <div className="dialog-uploader-content">
        <div className="dialog-uploader-header">
          <h2 className="dialog-uploader-title">
            {isUploading
              ? "文件上传中"
              : uploadProgress.length > 0 && stats.isAllCompleted
              ? "上传完成"
              : "文件上传"}
            {multiple &&
              !isUploading &&
              uploadProgress.length === 0 &&
              " (支持多文件)"}
          </h2>
          <button
            className="dialog-uploader-close"
            onClick={onClose}
            disabled={isUploading}
            aria-label="关闭"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="dialog-uploader-body">
          {/* 错误提示 */}
          {selectionError && (
            <div className="dialog-uploader-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="#FEE2E2"
                  stroke="#EF4444"
                  strokeWidth="2"
                />
                <path
                  d="M15 9l-6 6M9 9l6 6"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{selectionError}</span>
            </div>
          )}

          {/* 文件选择区域 */}
          {!isUploading && (
            <Uploader
              onFileSelect={handleFileSelect}
              multiple={multiple}
              acceptedFileTypes={acceptedFileTypes}
            />
          )}

          {/* 已选择的文件列表 */}
          {selectedFiles.length > 0 && !isUploading && (
            <div className="dialog-uploader-selected-files">
              <h3>已选择的文件 ({selectedFiles.length}):</h3>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li key={index} className="dialog-uploader-file-item">
                    <div className="dialog-uploader-file-info">
                      <span className="dialog-uploader-file-name">
                        {file.name}
                      </span>
                      <span className="dialog-uploader-file-size">
                        {formatSize(file.size)}
                      </span>
                    </div>
                    <button
                      className="dialog-uploader-remove-file"
                      onClick={() => removeFile(index)}
                      aria-label={`移除 ${file.name}`}
                      title="移除文件"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 上传进度 */}
          {isUploading && (
            <div className="dialog-uploader-progress">
              <div className="dialog-uploader-progress-header">
                <div className="dialog-uploader-progress-header-info">
                  <h3>上传进度</h3>
                  <div className="dialog-uploader-progress-summary">
                    <span className="dialog-uploader-progress-stats">
                      {stats.completed}/{stats.total} 完成
                    </span>
                    <span className="dialog-uploader-progress-percentage">
                      {stats.averageProgress}%
                    </span>
                  </div>
                </div>
                {!isCancelling && stats.uploading > 0 && (
                  <button
                    className="dialog-uploader-cancel-all-btn"
                    onClick={cancelAllUploads}
                    title="取消所有上传"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M15 9l-6 6M9 9l6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    取消全部
                  </button>
                )}
              </div>

              <div className="dialog-uploader-progress-list">
                {uploadProgress.map((progress, index) => (
                  <div
                    key={index}
                    className={`dialog-uploader-progress-item dialog-uploader-progress-item--${progress.status}`}
                  >
                    <div className="dialog-uploader-progress-main">
                      <div className="dialog-uploader-progress-file-info">
                        <div className="dialog-uploader-progress-name-row">
                          <span className="dialog-uploader-progress-name">
                            {progress.fileName}
                          </span>
                          <div className="dialog-uploader-progress-actions">
                            {getStatusIcon(progress.status)}
                          </div>
                        </div>

                        <div className="dialog-uploader-progress-status-row">
                          <span className="dialog-uploader-progress-status">
                            {getStatusMessage(progress)}
                          </span>
                          {progress.status === "uploading" && (
                            <span className="dialog-uploader-progress-percent">
                              {Math.round(progress.progress)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="dialog-uploader-progress-bar">
                      <div
                        className="dialog-uploader-progress-fill"
                        style={{
                          width: `${progress.progress}%`,
                          backgroundColor: getProgressColor(progress.status),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 总体进度条 */}
              <div className="dialog-uploader-overall-progress">
                <div className="dialog-uploader-overall-progress-bar">
                  <div
                    className="dialog-uploader-overall-progress-fill"
                    style={{
                      width: `${stats.averageProgress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dialog-uploader-footer">
          {isUploading ? (
            <>
              <div className="dialog-uploader-footer-status">
                {isCancelling ? (
                  <span className="dialog-uploader-cancelling-text">
                    正在取消...
                  </span>
                ) : (
                  <span className="dialog-uploader-uploading-text">
                    {stats.uploading} 个文件上传中
                  </span>
                )}
              </div>
              {!isCancelling && (
                <button
                  className="dialog-uploader-button dialog-uploader-button--cancel-upload"
                  onClick={cancelAllUploads}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M15 9l-6 6M9 9l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  停止上传
                </button>
              )}
            </>
          ) : uploadProgress.length > 0 && stats.isAllCompleted ? (
            // 上传完成状态
            <>
              <div className="dialog-uploader-footer-status">
                <span className="dialog-uploader-completed-text">
                  上传完成: {stats.completed} 成功, {stats.failed} 失败,{" "}
                  {stats.cancelled} 取消
                </span>
              </div>
              <button
                className="dialog-uploader-button dialog-uploader-button--primary"
                onClick={onClose}
              >
                关闭
              </button>
            </>
          ) : (
            // 初始状态
            <>
              <button
                className="dialog-uploader-button dialog-uploader-button--secondary"
                onClick={onClose}
              >
                取消
              </button>
              <button
                className="dialog-uploader-button dialog-uploader-button--primary"
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
