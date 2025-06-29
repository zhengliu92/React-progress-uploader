import { useState, useCallback } from "react";
import {
  validateFileType,
  validateFileSize,
  validateFileCount,
  isDuplicateFile,
  FileValidationResult,
  DEFAULT_MAX_FILES,
} from "../components/Uploader/utils";

interface UseFileSelectionOptions {
  multiple?: boolean;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxFileSize?: number; // 单位：字节
}

export const useFileSelection = ({
  multiple = true,
  acceptedFileTypes,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize,
}: UseFileSelectionOptions = {}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectionError, setSelectionError] = useState<string | null>(null);

  // 验证单个文件的所有条件
  const validateFile = useCallback(
    (file: File, existingFiles: File[]): FileValidationResult => {
      // 检查文件大小
      if (maxFileSize) {
        const sizeValidation = validateFileSize(file, maxFileSize);
        if (!sizeValidation.isValid) {
          return sizeValidation;
        }
      }

      // 检查文件类型
      const typeValidation = validateFileType(file, acceptedFileTypes);
      if (!typeValidation.isValid) {
        return typeValidation;
      }

      // 检查文件是否重复
      if (isDuplicateFile(file, existingFiles)) {
        return {
          isValid: false,
          error: `文件 "${file.name}" 已经存在`,
        };
      }

      return { isValid: true };
    },
    [acceptedFileTypes, maxFileSize]
  );

  // 添加文件
  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setSelectionError(null);

      const fileArray = Array.from(files);

      // 如果是单选模式，直接替换
      if (!multiple) {
        if (fileArray.length > 1) {
          setSelectionError("单选模式下只能选择一个文件");
          return false;
        }

        const file = fileArray[0];
        if (!file) return false;

        const validation = validateFile(file, []);
        if (!validation.isValid) {
          setSelectionError(validation.error || "文件验证失败");
          return false;
        }

        setSelectedFiles([file]);
        return true;
      }

      // 多选模式：验证文件数量
      const countValidation = validateFileCount(
        selectedFiles.length,
        fileArray.length,
        maxFiles
      );
      if (!countValidation.isValid) {
        setSelectionError(countValidation.error || "文件数量超限");
        return false;
      }

      // 验证每个文件并收集有效文件
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file, [
          ...selectedFiles,
          ...validFiles,
        ]);
        if (validation.isValid) {
          validFiles.push(file);
        } else if (validation.error) {
          errors.push(validation.error);
        }
      }

      // 如果有错误，显示第一个错误
      if (errors.length > 0) {
        setSelectionError(errors[0]);
        // 如果没有有效文件，直接返回
        if (validFiles.length === 0) {
          return false;
        }
      }

      // 添加有效文件
      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }

      return validFiles.length > 0;
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
      remainingSlots: maxFiles - selectedFiles.length,
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
