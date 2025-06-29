import { useState, useRef, useEffect, useCallback } from "react";

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error" | "cancelled";
  error?: string;
}

export interface UploadOptions {
  file: File;
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}

export interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface UseUploadQueueOptions {
  uploadFunction: (options: UploadOptions) => Promise<UploadResult>;
  maxConcurrent?: number;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  onUploadComplete?: (
    successfulFiles: File[],
    results?: UploadResult[]
  ) => void;
}

export const useUploadQueue = ({
  uploadFunction,
  maxConcurrent = 3,
  onUploadProgress,
  onUploadComplete,
}: UseUploadQueueOptions) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const abortControllers = useRef<(AbortController | null)[]>([]);
  const uploadAborted = useRef(false);
  const selectedFilesRef = useRef<File[]>([]);
  const callbacksRef = useRef({ onUploadProgress, onUploadComplete });

  // 更新回调引用
  useEffect(() => {
    callbacksRef.current = { onUploadProgress, onUploadComplete };
  }, [onUploadProgress, onUploadComplete]);

  // 检查上传状态并处理完成
  const checkUploadCompletion = useCallback(
    (progress: UploadProgress[]) => {
      if (progress.length === 0) return;

      const allCompleted = progress.every(
        (p) =>
          p.status === "completed" ||
          p.status === "error" ||
          p.status === "cancelled"
      );

      if (allCompleted && isUploading) {
        setIsUploading(false);

        // 通知上传完成
        const callbacks = callbacksRef.current;
        if (callbacks.onUploadComplete) {
          const successfulFiles = selectedFilesRef.current.filter((file) =>
            progress.some(
              (p) => p.fileName === file.name && p.status === "completed"
            )
          );
          const results = progress.map((p) => ({
            success: p.status === "completed",
            data: p.status === "completed" ? {} : undefined,
            error: p.status === "error" ? p.error || "上传失败" : undefined,
          }));

          callbacks.onUploadComplete(successfulFiles, results);
        }
      }
    },
    [isUploading]
  );

  // 监听上传进度变化
  useEffect(() => {
    if (uploadProgress.length > 0) {
      // 通知进度更新
      const callbacks = callbacksRef.current;
      if (callbacks.onUploadProgress) {
        callbacks.onUploadProgress(uploadProgress);
      }

      // 检查是否完成
      checkUploadCompletion(uploadProgress);
    }
  }, [uploadProgress, checkUploadCompletion]);

  // 更新上传进度的辅助函数
  const updateProgress = useCallback(
    (index: number, updates: Partial<UploadProgress>) => {
      setUploadProgress((prev) => {
        const updated = [...prev];
        if (updated[index] && updated[index].status !== "cancelled") {
          updated[index] = { ...updated[index], ...updates };
        }
        return updated;
      });
    },
    []
  );

  // 上传单个文件
  const uploadSingleFile = useCallback(
    async (file: File, index: number): Promise<void> => {
      // 检查文件是否已被取消
      const currentProgress = uploadProgress[index];
      if (currentProgress?.status === "cancelled") {
        return;
      }

      const controller = new AbortController();
      abortControllers.current[index] = controller;

      try {
        // 再次检查是否被取消
        if (uploadProgress[index]?.status === "cancelled") {
          console.log(
            `文件 ${file.name} (索引: ${index}) 在设置AbortController后被取消`
          );
          return;
        }

        // 更新状态为上传中
        updateProgress(index, { status: "uploading" });

        const result = await uploadFunction({
          file,
          onProgress: (progress) => {
            updateProgress(index, { progress });
          },
          signal: controller.signal,
        });

        // 根据结果更新状态
        if (result.success) {
          updateProgress(index, {
            progress: 100,
            status: "completed",
            error: undefined,
          });
        } else {
          // 失败时将进度设置为0，让用户清楚知道上传失败
          updateProgress(index, {
            progress: 0,
            status: "error",
            error: result.error || "上传失败",
          });
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log(`文件 ${file.name} (索引: ${index}) 上传被中断`);
          return;
        }

        console.log(`文件 ${file.name} (索引: ${index}) 上传出错:`, error);

        // 错误时将进度设置为0
        updateProgress(index, {
          progress: 0,
          status: "error",
          error: error.message || "上传失败",
        });
      } finally {
        abortControllers.current[index] = null;
      }
    },
    [uploadFunction, uploadProgress, updateProgress]
  );

  // 开始上传
  const startUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      selectedFilesRef.current = files;

      setIsUploading(true);
      setIsCancelling(false);
      uploadAborted.current = false;
      abortControllers.current = new Array(files.length).fill(null);

      // 初始化上传进度
      const initialProgress: UploadProgress[] = files.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "pending",
      }));
      setUploadProgress(initialProgress);

      // 实现并发队列控制
      let nextFileIndex = 0;
      const runningUploads: Promise<void>[] = [];

      const uploadNextFile = async (): Promise<void> => {
        while (nextFileIndex < files.length && !uploadAborted.current) {
          const fileIndex = nextFileIndex++;
          const file = files[fileIndex];

          try {
            await uploadSingleFile(file, fileIndex);
          } catch (error) {
            console.error(`文件 ${file.name} 上传失败:`, error);
          }
        }
      };

      // 启动并发上传
      const concurrency = Math.min(maxConcurrent, files.length);
      for (let i = 0; i < concurrency; i++) {
        runningUploads.push(uploadNextFile());
      }

      try {
        await Promise.allSettled(runningUploads);
      } catch (error) {
        console.error("上传过程中出现错误:", error);
      }
    },
    [maxConcurrent, uploadSingleFile]
  );

  // 取消所有上传
  const cancelAllUploads = useCallback(() => {
    setIsCancelling(true);
    uploadAborted.current = true;

    // 取消所有正在进行的上传请求
    abortControllers.current.forEach((controller) => {
      if (controller) {
        controller.abort();
      }
    });
    abortControllers.current = [];

    // 更新所有上传中和等待中的文件状态为已取消
    setUploadProgress((prev) =>
      prev.map((progress) => ({
        ...progress,
        status:
          progress.status === "uploading" || progress.status === "pending"
            ? "cancelled"
            : progress.status,
        // 取消时将进度设置为0
        progress:
          progress.status === "uploading" || progress.status === "pending"
            ? 0
            : progress.progress,
      }))
    );

    // 重置状态
    setTimeout(() => {
      setIsUploading(false);
      setIsCancelling(false);
      uploadAborted.current = false;
    }, 500);
  }, []);

  // 重置队列
  const resetQueue = useCallback(() => {
    setUploadProgress([]);
    setIsUploading(false);
    setIsCancelling(false);
    uploadAborted.current = false;
    abortControllers.current = [];
    selectedFilesRef.current = [];
  }, []);

  return {
    uploadProgress,
    isUploading,
    isCancelling,
    startUpload,
    cancelAllUploads,
    resetQueue,
  };
};
