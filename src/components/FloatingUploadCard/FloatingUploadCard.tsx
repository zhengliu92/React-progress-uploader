import React, { useState } from "react";
import { UploadProgress as UploadProgressType } from "../../hooks/useUploadQueue";
import { StatusIcon } from "../shared/StatusIcon";
import { CloseIcon } from "../Icons";
import "./FloatingUploadCard.css";

interface FloatingUploadCardProps {
  uploadProgress: UploadProgressType[];
  stats: {
    completed: number;
    total: number;
    averageProgress: number;
    uploading: number;
    failed: number;
    cancelled: number;
    isAllCompleted: boolean;
  };
  isCancelling: boolean;
  onCancelAll: () => void;
  onClear: () => void;
  getStatusMessage: (progress: UploadProgressType) => string;
  getProgressColor: (status: UploadProgressType["status"]) => string;
  visible?: boolean;
  theme?: "light" | "dark" | "blue" | "green" | "purple" | "orange";
}

export const FloatingUploadCard: React.FC<FloatingUploadCardProps> = ({
  uploadProgress,
  stats,
  isCancelling,
  onCancelAll,
  onClear,
  getStatusMessage,
  getProgressColor,
  visible = true,
  theme = "light",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // 如果没有上传任务且已完成，不显示
  if (!visible || uploadProgress.length === 0) {
    return null;
  }

  const toggleExpanded = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsExpanded(true);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsExpanded(false);
  };

  const handleClose = () => {
    if (stats.isAllCompleted || stats.uploading === 0) {
      onClear();
    }
  };

  // 计算显示状态
  const hasActiveUploads = stats.uploading > 0;
  const canClose = stats.isAllCompleted || stats.uploading === 0;

  // 根据主题获取进度条颜色
  const getThemeProgressColor = () => {
    switch (theme) {
      case "dark":
        return "#60a5fa"; // 蓝色
      case "blue":
        return "#0ea5e9"; // 天蓝色
      case "green":
        return "#22c55e"; // 绿色
      case "purple":
        return "#a855f7"; // 紫色
      case "orange":
        return "#f59e0b"; // 橙色
      case "light":
      default:
        return "#3b82f6"; // 默认蓝色
    }
  };

  return (
    <div className={`floating-upload-card floating-upload-card--theme-${theme} ${isMinimized ? 'floating-upload-card--minimized' : ''}`}>
      {/* 最小化状态 */}
      <div 
        className={`floating-upload-card__minimized ${isMinimized ? 'floating-upload-card__minimized--visible' : 'floating-upload-card__minimized--hidden'}`} 
        onClick={toggleExpanded}
      >
        <div className="floating-upload-card__mini-content">
          <div className="floating-upload-card__mini-info">
            <span className="floating-upload-card__mini-stats">
              {stats.completed}/{stats.total}
            </span>
            <div className="floating-upload-card__mini-progress">
              <div 
                className="floating-upload-card__mini-progress-fill"
                style={{ 
                  width: `${Math.round(stats.averageProgress)}%`,
                  backgroundColor: getThemeProgressColor()
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 展开状态 */}
      <div 
        className={`floating-upload-card__content ${!isMinimized ? 'floating-upload-card__content--visible' : 'floating-upload-card__content--hidden'}`}
      >
          {/* 头部 */}
          <div className="floating-upload-card__header">
            <button
              className="floating-upload-card__toggle"
              onClick={toggleExpanded}
              title={isExpanded ? "收起" : "展开"}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className={`floating-upload-card__toggle-icon ${!isExpanded ? 'floating-upload-card__toggle-icon--expanded' : ''}`}
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            <div className="floating-upload-card__header-info">
              <span className="floating-upload-card__title">上传进度</span>
              <span className="floating-upload-card__stats">
                {stats.completed}/{stats.total} 
                {hasActiveUploads && ` (${stats.uploading} 进行中)`}
              </span>
            </div>

            <div className="floating-upload-card__actions">
              <button
                className="floating-upload-card__action-btn"
                onClick={handleMinimize}
                title="最小化"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              
              {canClose && (
                <button
                  className="floating-upload-card__action-btn floating-upload-card__close-btn"
                  onClick={handleClose}
                  title="关闭"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 总体进度条 */}
          <div className="floating-upload-card__overall-progress">
            <div className="floating-upload-card__overall-bar">
              <div
                className="floating-upload-card__overall-fill"
                style={{ width: `${stats.averageProgress}%` }}
              />
            </div>
            <span className="floating-upload-card__overall-percent">
              {stats.averageProgress}%
            </span>
          </div>

          {/* 文件列表 */}
          {isExpanded && (
            <div className="floating-upload-card__files">
              {uploadProgress.map((progress, index) => (
                <div
                  key={index}
                  className={`floating-upload-card__file floating-upload-card__file--${progress.status}`}
                >
                  <div className="floating-upload-card__file-header">
                    <span className="floating-upload-card__file-name" title={progress.fileName}>
                      {progress.fileName}
                    </span>
                    <div className="floating-upload-card__file-status">
                      <StatusIcon status={progress.status} variant="default" />
                      {progress.status === "uploading" && (
                        <span className="floating-upload-card__file-percent">
                          {Math.round(progress.progress)}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="floating-upload-card__file-progress">
                    <div
                      className="floating-upload-card__file-progress-fill"
                      style={{
                        width: `${progress.status === "completed" ? 100 : progress.progress}%`,
                        backgroundColor: getProgressColor(progress.status),
                      }}
                    />
                  </div>
                  
                  <div className="floating-upload-card__file-message">
                    {getStatusMessage(progress)}
                  </div>
                </div>
              ))}
              
              {/* 操作按钮 */}
              {hasActiveUploads && !isCancelling && (
                <div className="floating-upload-card__actions-bar">
                  <button
                    className="floating-upload-card__cancel-all"
                    onClick={onCancelAll}
                  >
                    取消所有上传
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

    </div>
  );
}; 