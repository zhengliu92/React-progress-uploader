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
  uploadFunction?: (options: UploadOptions) => Promise<UploadResult>;
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

  // 监听上传进度变化，检查是否所有上传都已完成
  useEffect(() => {
    if (uploadProgress.length > 0) {
      // 始终通知进度更新
      if (onUploadProgress) {
        onUploadProgress(uploadProgress);
      }

      // 如果正在上传，检查是否所有文件都已完成
      if (isUploading) {
        const allCompleted = uploadProgress.every(
          (p) =>
            p.status === "completed" ||
            p.status === "error" ||
            p.status === "cancelled"
        );

        if (allCompleted) {
          setIsUploading(false);

          // 通知上传完成
          if (onUploadComplete) {
            const successfulFiles = selectedFilesRef.current.filter((file) =>
              uploadProgress.some(
                (p) => p.fileName === file.name && p.status === "completed"
              )
            );
            const results = uploadProgress.map((p) => ({
              success: p.status === "completed",
              data: p.status === "completed" ? {} : undefined,
              error: p.status === "error" ? p.error || "上传失败" : undefined,
            }));

            onUploadComplete(successfulFiles, results);
          }
        }
      }
    }
  }, [uploadProgress, isUploading, onUploadProgress, onUploadComplete]);

  // 上传单个文件
  const uploadSingleFile = useCallback(
    async (file: File, index: number): Promise<void> => {
      console.log(`开始上传文件: ${file.name} (索引: ${index})`);

      // 检查文件是否已被取消
      const currentStatus = uploadProgress[index]?.status;
      if (currentStatus === "cancelled") {
        console.log(`文件 ${file.name} (索引: ${index}) 已被取消，跳过上传`);
        return;
      }

      const controller = new AbortController();
      abortControllers.current[index] = controller;

      try {
        // 再次检查是否被取消（在设置AbortController后）
        if (uploadProgress[index]?.status === "cancelled") {
          console.log(
            `文件 ${file.name} (索引: ${index}) 在设置AbortController后被取消`
          );
          return;
        }

        // 更新状态为上传中
        setUploadProgress((prev) => {
          const updated = [...prev];
          if (updated[index] && updated[index].status !== "cancelled") {
            updated[index] = {
              ...updated[index],
              status: "uploading",
            };
          }
          return updated;
        });

        const result = uploadFunction
          ? await uploadFunction({
              file,
              onProgress: (progress) => {
                setUploadProgress((prev) => {
                  const updated = [...prev];
                  if (updated[index] && updated[index].status !== "cancelled") {
                    updated[index] = {
                      ...updated[index],
                      progress,
                    };
                  }
                  return updated;
                });
              },
              signal: controller.signal,
            })
          : { success: true, data: null };

        // 上传成功
        setUploadProgress((prev) => {
          const updated = [...prev];
          if (updated[index] && updated[index].status !== "cancelled") {
            updated[index] = {
              ...updated[index],
              progress: 100,
              status: result.success ? "completed" : "error",
              error: result.success ? undefined : result.error,
            };
          }
          return updated;
        });
      } catch (error: any) {
        // 上传失败（包括用户取消）
        if (error.name === "AbortError") {
          console.log(`文件 ${file.name} (索引: ${index}) 上传被中断`);
          return;
        }

        console.log(`文件 ${file.name} (索引: ${index}) 上传出错:`, error);

        setUploadProgress((prev) => {
          const updated = [...prev];
          if (updated[index] && updated[index].status !== "cancelled") {
            updated[index] = {
              ...updated[index],
              status: "error",
              error: error.message || "上传失败",
            };
          }
          return updated;
        });
      } finally {
        abortControllers.current[index] = null;
      }
    },
    [uploadFunction]
  );

  // 开始上传
  const startUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      selectedFilesRef.current = files;

      // 如果没有上传函数，直接调用完成回调
      if (!uploadFunction) {
        if (onUploadComplete) {
          onUploadComplete(files);
        }
        return;
      }

      setIsUploading(true);
      uploadAborted.current = false;
      abortControllers.current = new Array(files.length).fill(null);

      // 初始化上传进度
      const initialProgress: UploadProgress[] = files.map((file) => ({
        fileName: file.name,
        progress: 0,
        status: "pending",
      }));
      setUploadProgress(initialProgress);

      // 实现正确的并发队列控制
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

      // 启动并发上传（启动多个上传链，每个链会依次处理文件）
      const concurrency = Math.min(maxConcurrent, files.length);
      for (let i = 0; i < concurrency; i++) {
        runningUploads.push(uploadNextFile());
      }

      try {
        // 等待所有上传链完成
        await Promise.allSettled(runningUploads);
      } catch (error) {
        console.error("上传过程中出现错误:", error);
      }
    },
    [maxConcurrent, uploadSingleFile, uploadFunction, onUploadComplete]
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
