import { useCallback } from "react";
import { useFileSelection } from "./useFileSelection";
import { useUploadQueue } from "./useUploadQueue";
import { useUploadUI } from "./useUploadUI";
import { UploaderWithUploadProps } from "../types/uploader";
import { DEFAULT_MAX_FILES } from "../components/Uploader/utils";

export const useUploaderCore = ({
  multiple = false,
  acceptedFileTypes,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize,
  uploadFunction,
  maxConcurrent = 3,
  onUpload,
  onUploadProgress,
}: UploaderWithUploadProps) => {
  // 文件选择管理
  const fileSelection = useFileSelection({
    multiple,
    acceptedFileTypes,
    maxFiles,
    maxFileSize,
  });

  // 上传队列管理
  const uploadQueue = useUploadQueue({
    uploadFunction,
    maxConcurrent,
    onUploadProgress,
    onUploadComplete: onUpload,
  });

  // UI工具函数
  const uiUtils = useUploadUI();

  // 处理上传
  const handleUpload = useCallback(() => {
    if (fileSelection.selectedFiles.length > 0) {
      uploadQueue.startUpload(fileSelection.selectedFiles);
    }
  }, [fileSelection.selectedFiles, uploadQueue.startUpload]);

  // 清空文件和重置队列
  const handleClearFiles = useCallback(() => {
    fileSelection.clearFiles();
    uploadQueue.resetQueue();
  }, [fileSelection.clearFiles, uploadQueue.resetQueue]);

  // 统计信息
  const stats = uiUtils.getUploadStats(uploadQueue.uploadProgress);

  // 文件统计信息
  const fileStats = fileSelection.getFileStats();

  return {
    // 文件选择相关
    selectedFiles: fileSelection.selectedFiles,
    selectionError: fileSelection.selectionError,
    addFiles: fileSelection.addFiles,
    removeFile: fileSelection.removeFile,
    clearFiles: fileSelection.clearFiles,
    canAddMoreFiles: fileSelection.canAddMoreFiles,
    fileStats,

    // 上传队列相关
    uploadProgress: uploadQueue.uploadProgress,
    isUploading: uploadQueue.isUploading,
    isCancelling: uploadQueue.isCancelling,
    startUpload: uploadQueue.startUpload,
    cancelAllUploads: uploadQueue.cancelAllUploads,
    resetQueue: uploadQueue.resetQueue,

    // UI工具函数
    ...uiUtils,

    // 统计信息
    stats,

    // 便捷方法
    handleUpload,
    handleClearFiles,

    // 状态检查
    hasFiles: fileSelection.selectedFiles.length > 0,
    canUpload:
      fileSelection.selectedFiles.length > 0 && !uploadQueue.isUploading,
    isCompleted: uploadQueue.uploadProgress.length > 0 && stats.isAllCompleted,

    // 组合状态
    hasError: !!fileSelection.selectionError,
    canAddFiles: fileSelection.canAddMoreFiles() && !uploadQueue.isUploading,
  };
};
