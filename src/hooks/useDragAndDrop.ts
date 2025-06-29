import { useState, useRef, useCallback } from "react";
import { filterValidFiles, createFileList } from "../components/Uploader/utils";

interface UseDragAndDropProps {
  onFileSelect?: (files: FileList) => void;
  acceptedFileTypes?: string[];
  multiple?: boolean;
  isUploading?: boolean;
  onFileDrop?: (files: FileList | File[]) => boolean; // 返回处理结果
  onValidationError?: (errors: string[]) => void;
}

export const useDragAndDrop = ({
  onFileSelect,
  acceptedFileTypes,
  multiple = false,
  isUploading = false,
  onFileDrop,
  onValidationError,
}: UseDragAndDropProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const processFiles = useCallback(
    (files: FileList) => {
      if (!files || files.length === 0) return false;

      // 清除之前的错误
      setDragError(null);

      // 如果有类型限制，进行预过滤
      if (acceptedFileTypes && acceptedFileTypes.length > 0) {
        const { validFiles, errors } = filterValidFiles(
          files,
          acceptedFileTypes
        );

        if (errors.length > 0) {
          // 设置拖拽错误状态
          setDragError(errors[0]);
          onValidationError?.(errors);
          return false;
        }

        if (validFiles.length === 0) {
          setDragError("没有有效文件");
          return false;
        }

        // 创建新的FileList
        const validFileList = createFileList(validFiles);

        // 优先使用内部处理函数
        if (onFileDrop) {
          return onFileDrop(validFileList);
        }

        // 如果没有内部处理函数，使用外部回调
        if (onFileSelect) {
          onFileSelect(validFileList);
          return true;
        }
      } else {
        // 没有类型限制，直接处理
        if (onFileDrop) {
          return onFileDrop(files);
        }

        if (onFileSelect) {
          onFileSelect(files);
          return true;
        }
      }

      return false;
    },
    [acceptedFileTypes, onFileDrop, onFileSelect, onValidationError]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        processFiles(event.target.files);
        // 清空input值，允许重复选择相同文件
        event.target.value = "";
      }
    },
    [processFiles]
  );

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current++;

    if (dragCounterRef.current === 1) {
      setIsDragActive(true);
      setDragError(null);
    }
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
      setDragError(null);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // 重置拖拽状态
      setIsDragActive(false);
      dragCounterRef.current = 0;

      if (isUploading) {
        setDragError("正在上传中，无法添加文件");
        return;
      }

      if (event.dataTransfer.files) {
        const success = processFiles(event.dataTransfer.files);

        // 清空文件输入框
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (!success) {
          // 如果处理失败，显示一个通用错误（如果没有特定错误）
          if (!dragError) {
            setDragError("文件处理失败");
          }
        }
      }
    },
    [isUploading, processFiles, dragError]
  );

  const handleClick = useCallback(() => {
    if (!isUploading && fileInputRef.current) {
      setDragError(null);
      fileInputRef.current.click();
    }
  }, [isUploading]);

  // 清除拖拽错误
  const clearDragError = useCallback(() => {
    setDragError(null);
  }, []);

  return {
    isDragActive,
    dragError,
    fileInputRef,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onClick: handleClick,
    },
    inputHandlers: {
      onChange: handleChange,
    },
    clearDragError,
  };
};
