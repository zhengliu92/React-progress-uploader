import React from "react";
import { CloseIcon } from "../Icons";
import "./FileList.css";

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  formatFileSize: (size: number) => string;
  variant?: "default" | "dialog";
  showHeader?: boolean;
  onClearAll?: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onRemoveFile,
  formatFileSize,
  variant = "default",
  showHeader = true,
  onClearAll,
}) => {
  const isDialog = variant === "dialog";
  const baseClass = isDialog ? "dialog-uploader" : "uploader";

  if (files.length === 0) return null;

  return (
    <div className='file-list'>
      {showHeader && (
        <div className='file-list__header'>
          <h3 className='file-list__title'>已选择的文件 ({files.length}):</h3>
          {onClearAll && !isDialog && (
            <button
              className='file-list__clear-btn'
              onClick={onClearAll}
            >
              清空
            </button>
          )}
        </div>
      )}
      <ul className='file-list__items'>
        {files.map((file, index) => (
          <li
            key={index}
            className='file-list__item'
          >
            <div className='file-list__info'>
              <span className='file-list__name'>{file.name}</span>
              <span className='file-list__size'>
                {formatFileSize(file.size)}
              </span>
            </div>
            <button
              className='file-list__remove-btn'
              onClick={() => onRemoveFile(index)}
              aria-label={`移除 ${file.name}`}
              title='移除文件'
            >
              <CloseIcon
                className='uploader-icon-close'
                size={isDialog ? 16 : undefined}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
