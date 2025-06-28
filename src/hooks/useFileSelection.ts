import { useState, useCallback } from "react";

interface UseFileSelectionOptions {
  multiple?: boolean;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number; // 单位：字节
}

export const useFileSelection = ({
  multiple = true,
  acceptedFileTypes,
  maxFiles = 10,
  maxFileSize,
}: UseFileSelectionOptions = {}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  // 验证文件
  const validateFile = useCallback(
    (file: File): string | null => {
      // 检查文件大小
      if (maxFileSize && file.size > maxFileSize) {
        const sizeMB = (maxFileSize / 1024 / 1024).toFixed(1);
        return `文件 "${file.name}" 超过了 ${sizeMB}MB 的大小限制`;
      }

      // 检查文件类型
      if (acceptedFileTypes && acceptedFileTypes.length > 0) {
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
        const fileType = file.type.toLowerCase();

        const isTypeAccepted = acceptedFileTypes.some((type) => {
          const normalizedType = type.toLowerCase();
          return (
            fileExtension === normalizedType ||
            fileType.includes(normalizedType.replace(".", ""))
          );
        });

        if (!isTypeAccepted) {
          return `文件 "${
            file.name
          }" 的类型不被支持。支持的类型：${acceptedFileTypes.join(", ")}`;
        }
      }

      return null;
    },
    [acceptedFileTypes, maxFileSize]
  );

  // 添加文件
  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setSelectionError(null);

      const fileArray = Array.from(files);

      // 验证文件数量
      const totalFiles = multiple
        ? selectedFiles.length + fileArray.length
        : fileArray.length;
      if (totalFiles > maxFiles) {
        setSelectionError(`最多只能选择 ${maxFiles} 个文件`);
        return false;
      }

      // 验证每个文件
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(error);
        } else {
          validFiles.push(file);
        }
      }

      // 如果有验证错误，显示第一个错误
      if (validationErrors.length > 0) {
        setSelectionError(validationErrors[0]);
        return false;
      }

      // 添加有效文件
      if (multiple) {
        setSelectedFiles((prev) => {
          // 去重：检查是否已经存在相同名称和大小的文件
          const newFiles = validFiles.filter(
            (newFile) =>
              !prev.some(
                (existingFile) =>
                  existingFile.name === newFile.name &&
                  existingFile.size === newFile.size
              )
          );
          return [...prev, ...newFiles];
        });
      } else {
        setSelectedFiles(validFiles.slice(0, 1));
      }

      return true;
    },
    [selectedFiles, multiple, maxFiles, validateFile]
  );

  // 移除文件
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setSelectionError(null);
  }, []);

  // 移除所有文件
  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setSelectionError(null);
  }, []);

  // 替换文件（用于拖拽场景）
  const replaceFiles = useCallback(
    (files: FileList | File[]) => {
      setSelectedFiles([]);
      return addFiles(files);
    },
    [addFiles]
  );

  // 检查是否可以添加更多文件
  const canAddMoreFiles = useCallback(() => {
    if (!multiple) return selectedFiles.length === 0;
    return selectedFiles.length < maxFiles;
  }, [multiple, selectedFiles.length, maxFiles]);

  // 获取文件统计信息
  const getFileStats = useCallback(() => {
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);

    return {
      count: selectedFiles.length,
      totalSize,
      totalSizeMB: parseFloat(totalSizeMB),
      maxFiles,
      canAddMore: canAddMoreFiles(),
    };
  }, [selectedFiles, maxFiles, canAddMoreFiles]);

  return {
    selectedFiles,
    selectionError,
    addFiles,
    removeFile,
    clearFiles,
    replaceFiles,
    canAddMoreFiles,
    getFileStats,
    validateFile,
  };
};
