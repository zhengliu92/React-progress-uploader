import React from "react";
import { UploadProgress as UploadProgressType } from "../../hooks/useUploadQueue";
import { StatusIcon } from "./StatusIcon";
import { CancelIcon, DialogCancelIcon } from "../Icons";
import "./UploadProgress.css";

interface UploadProgressProps {
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
  getStatusMessage: (progress: UploadProgressType) => string;
  getProgressColor: (status: UploadProgressType["status"]) => string;
  variant?: "default" | "dialog";
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  uploadProgress,
  stats,
  isCancelling,
  onCancelAll,
  getStatusMessage,
  getProgressColor,
  variant = "default",
}) => {
  const isDialog = variant === "dialog";
  const baseClass = isDialog ? "dialog-uploader" : "uploader";
  const CancelIconComponent = isDialog ? DialogCancelIcon : CancelIcon;
  const cancelIconClass = isDialog
    ? "uploader-icon-dialog-cancel"
    : "uploader-icon-cancel";

  return (
    <div className='upload-progress'>
      <div className='upload-progress__header'>
        <div className='upload-progress__header-info'>
          <h3 className='upload-progress__title'>上传进度</h3>
          <div className='upload-progress__summary'>
            <span className='upload-progress__stats'>
              {stats.completed}/{stats.total} 完成
            </span>
            <span className='upload-progress__percentage'>
              {stats.averageProgress}%
            </span>
          </div>
        </div>
        {!isCancelling && stats.uploading > 0 && (
          <button
            className='upload-progress__cancel-all-btn'
            onClick={onCancelAll}
            title='取消所有上传'
          >
            <CancelIconComponent className={cancelIconClass} />
            取消全部
          </button>
        )}
      </div>

      <div className='upload-progress__list'>
        {uploadProgress.map((progress, index) => (
          <div
            key={index}
            className={`upload-progress__item upload-progress__item--${progress.status}`}
          >
            <div className='upload-progress__main'>
              <div className='upload-progress__file-info'>
                <div className='upload-progress__name-row'>
                  <span className='upload-progress__name'>
                    {progress.fileName}
                  </span>
                  <div className='upload-progress__actions'>
                    <StatusIcon
                      status={progress.status}
                      variant={variant}
                    />
                  </div>
                </div>

                <div className='upload-progress__status-row'>
                  <span className='upload-progress__status'>
                    {getStatusMessage(progress)}
                  </span>
                  {progress.status === "uploading" && (
                    <span className='upload-progress__percent'>
                      {Math.round(progress.progress)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className='upload-progress__bar'>
              <div
                className='upload-progress__fill'
                style={{
                  width: `${
                    progress.status === "completed" ? 100 : progress.progress
                  }%`,
                  backgroundColor: getProgressColor(progress.status),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 总体进度条 */}
      <div className='upload-progress__overall'>
        <div className='upload-progress__overall-bar'>
          <div
            className='upload-progress__overall-fill'
            style={{
              width: `${stats.averageProgress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
