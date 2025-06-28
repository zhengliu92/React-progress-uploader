import { useCallback } from "react";
import { UploadProgress } from "./useUploadQueue";

export const useUploadUI = () => {
  // 获取进度条颜色
  const getProgressColor = useCallback((status: UploadProgress["status"]) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "error":
        return "#F44336";
      case "uploading":
        return "#2196F3";
      case "cancelled":
        return "#9E9E9E";
      default:
        return "#E0E0E0";
    }
  }, []);

  // 获取状态图标类型
  const getStatusIconType = useCallback((status: UploadProgress["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "error":
        return "error";
      case "cancelled":
        return "cancelled";
      case "uploading":
        return "uploading";
      default:
        return "pending";
    }
  }, []);

  // 格式化文件大小
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // 获取上传统计信息
  const getUploadStats = useCallback((progress: UploadProgress[]) => {
    const total = progress.length;
    const completed = progress.filter((p) => p.status === "completed").length;
    const failed = progress.filter((p) => p.status === "error").length;
    const cancelled = progress.filter((p) => p.status === "cancelled").length;
    const uploading = progress.filter((p) => p.status === "uploading").length;
    const pending = progress.filter((p) => p.status === "pending").length;

    // 计算总进度百分比（正确处理不同状态的文件）
    const totalProgress = progress.reduce((sum, p) => {
      switch (p.status) {
        case "completed":
          return sum + 100; // 已完成的文件按100%计算
        case "uploading":
          return sum + p.progress; // 正在上传的文件按实际进度计算
        case "cancelled":
        case "error":
        case "pending":
        default:
          return sum + 0; // 取消、错误、等待的文件按0%计算
      }
    }, 0);
    const averageProgress = total > 0 ? Math.round(totalProgress / total) : 0;

    return {
      total,
      completed,
      failed,
      cancelled,
      uploading,
      pending,
      averageProgress,
      isAllCompleted: total > 0 && completed + failed + cancelled === total,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, []);

  // 生成状态消息
  const getStatusMessage = useCallback((progress: UploadProgress) => {
    switch (progress.status) {
      case "completed":
        return "上传成功";
      case "error":
        return progress.error || "上传失败";
      case "cancelled":
        return "已取消";
      case "uploading":
        return `${progress.progress.toFixed(0)}%`;
      case "pending":
        return "等待上传";
      default:
        return "";
    }
  }, []);

  // 获取整体状态标题
  const getOverallStatusTitle = useCallback(
    (
      isUploading: boolean,
      isCancelling: boolean,
      progress: UploadProgress[]
    ) => {
      if (isCancelling) {
        return "正在取消上传...";
      }

      if (isUploading) {
        const stats = getUploadStats(progress);
        return `上传进度 (${stats.completed}/${stats.total})`;
      }

      return "选择文件";
    },
    [getUploadStats]
  );

  return {
    getProgressColor,
    getStatusIconType,
    formatFileSize,
    getUploadStats,
    getStatusMessage,
    getOverallStatusTitle,
  };
};
