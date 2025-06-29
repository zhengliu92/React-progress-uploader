import React from "react";
import { UploadOptions, UploadResult, UploadProgress } from "../hooks";

// 故事专用的日志记录器
export class StoryLogger {
  private logs: string[] = [];
  private listeners: ((logs: string[]) => void)[] = [];

  log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    this.notifyListeners();
  }

  clear() {
    this.logs = [];
    this.notifyListeners();
  }

  getLogs() {
    return [...this.logs];
  }

  subscribe(listener: (logs: string[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getLogs()));
  }
}

// 通用的模拟上传函数配置
export interface MockUploadConfig {
  /** 上传速度（progress增加间隔，毫秒） */
  speed?: number;
  /** 失败概率（0-1） */
  failureRate?: number;
  /** 进度增加范围 */
  progressStep?: [number, number];
  /** 模拟延迟（毫秒） */
  delay?: number;
  /** 是否记录日志 */
  enableLogging?: boolean;
  /** 日志记录器 */
  logger?: StoryLogger;
}

// 创建模拟上传函数
export const createMockUploadFunction = (config: MockUploadConfig = {}) => {
  const {
    speed = 300,
    failureRate = 0.1,
    progressStep = [5, 20],
    delay = 0,
    enableLogging = false,
    logger,
  } = config;

  return async ({
    file,
    onProgress,
    signal,
  }: UploadOptions): Promise<UploadResult> => {
    if (enableLogging && logger) {
      logger.log(
        `开始上传文件: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`
      );
    }

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return new Promise((resolve, reject) => {
      let progress = 0;

      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval);
          if (enableLogging && logger) {
            logger.log(`上传被取消: ${file.name}`);
          }
          reject(new Error("AbortError"));
          return;
        }

        progress +=
          Math.random() * (progressStep[1] - progressStep[0]) + progressStep[0];

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          const shouldFail = Math.random() < failureRate;

          if (shouldFail) {
            if (enableLogging && logger) {
              logger.log(`上传失败: ${file.name}`);
            }
            resolve({
              success: false,
              error: `模拟上传失败: ${file.name}`,
            });
          } else {
            if (enableLogging && logger) {
              logger.log(`上传成功: ${file.name}`);
            }
            resolve({
              success: true,
              data: {
                url: `https://example.com/files/${file.name}`,
                fileId: Math.random().toString(36).substring(7),
                uploadTime: new Date().toISOString(),
              },
            });
          }
        } else {
          onProgress(progress);
        }
      }, speed + Math.random() * (speed * 0.5));
    });
  };
};

// 预定义的上传函数
export const mockUploadFunctions = {
  /** 标准上传（300ms间隔，10%失败率） */
  standard: createMockUploadFunction(),

  /** 快速上传（100ms间隔，5%失败率） */
  fast: createMockUploadFunction({
    speed: 100,
    failureRate: 0.05,
    progressStep: [10, 25],
  }),

  /** 慢速上传（800ms间隔，5%失败率） */
  slow: createMockUploadFunction({
    speed: 800,
    failureRate: 0.05,
    progressStep: [2, 8],
  }),

  /** 不可靠上传（随机速度，30%失败率） */
  unreliable: createMockUploadFunction({
    speed: 400,
    failureRate: 0.3,
    progressStep: [3, 15],
  }),

  /** 总是成功的上传 */
  reliable: createMockUploadFunction({
    speed: 200,
    failureRate: 0,
    progressStep: [8, 18],
  }),
};

// 常用的文件类型配置
export const fileTypeConfigs = {
  images: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  documents: [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt"],
  media: [".mp4", ".avi", ".mov", ".mp3", ".wav", ".flac"],
  archives: [".zip", ".rar", ".7z", ".tar", ".gz"],
  code: [".js", ".ts", ".html", ".css", ".json", ".xml"],
  data: [".csv", ".xlsx", ".json", ".xml", ".yaml"],
  all: [] as string[],
};

// 常用的文件大小限制
export const fileSizeLimits = {
  small: 1 * 1024 * 1024, // 1MB
  medium: 5 * 1024 * 1024, // 5MB
  large: 10 * 1024 * 1024, // 10MB
  xlarge: 50 * 1024 * 1024, // 50MB
};

// 创建日志显示组件的样式
export const logDisplayStyles = {
  container: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    maxHeight: "200px",
    overflowY: "auto" as const,
  },
  header: {
    margin: "0 0 12px 0",
    fontSize: "16px",
    fontFamily: "system-ui",
    fontWeight: 600,
    color: "#1f2937",
  },
  logEntry: {
    marginBottom: "4px",
    padding: "2px 0",
    color: "#374151",
  },
  emptyState: {
    color: "#6b7280",
    fontStyle: "italic" as const,
  },
  clearButton: {
    marginLeft: "12px",
    padding: "4px 8px",
    fontSize: "12px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

// 通用的故事控制器参数（修复类型问题）
export const commonArgTypes = {
  multiple: {
    control: "boolean",
    description: "是否支持多文件选择",
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  acceptedFileTypes: {
    control: "object",
    description: '允许的文件类型数组（例如：[".jpg", ".png", ".pdf"]）',
    table: {
      type: { summary: "string[]" },
    },
  },
  maxFiles: {
    control: { type: "number", min: 1, max: 50 },
    description: "最大文件数量限制",
    table: {
      defaultValue: { summary: "10" },
      type: { summary: "number" },
    },
  },
  maxFileSize: {
    control: "number",
    description: "单个文件最大大小（字节）",
    table: {
      type: { summary: "number" },
    },
  },
  maxConcurrent: {
    control: { type: "number", min: 1, max: 10 },
    description: "最大并发上传数量",
    table: {
      defaultValue: { summary: "3" },
      type: { summary: "number" },
    },
  },
  disabled: {
    control: "boolean",
    description: "是否禁用组件",
    table: {
      defaultValue: { summary: "false" },
      type: { summary: "boolean" },
    },
  },
  onUpload: {
    action: "onUpload",
    description: "文件上传完成回调",
    table: {
      type: { summary: "(files: File[], results?: UploadResult[]) => void" },
    },
  },
  onUploadProgress: {
    action: "onUploadProgress",
    description: "上传进度回调",
    table: {
      type: { summary: "(progress: UploadProgress[]) => void" },
    },
  },
};

// 通用的故事参数
export const commonParameters = {
  layout: "centered" as const,
  docs: {
    source: {
      type: "code" as const,
    },
  },
};

// 实用工具函数
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileInfo = (file: File) => ({
  name: file.name,
  size: formatFileSize(file.size),
  type: file.type || "未知类型",
  lastModified: new Date(file.lastModified).toLocaleString("zh-CN"),
});

// 获取文件类型图标
export const getFileTypeIcon = (file: File): string => {
  if (file.type.startsWith("image/")) return "🖼️";
  if (file.type.startsWith("video/")) return "🎥";
  if (file.type.startsWith("audio/")) return "🎵";
  if (file.type.includes("pdf")) return "📄";
  if (file.type.includes("text")) return "📝";
  if (file.type.includes("zip") || file.type.includes("rar")) return "📦";
  if (file.type.includes("json") || file.type.includes("xml")) return "⚙️";
  return "📁";
};

// 创建文件详情卡片组件
export const FileInfoCard: React.FC<{
  file: File;
  index: number;
  onRemove?: () => void;
}> = ({ file, index, onRemove }) => {
  const info = getFileInfo(file);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span style={{ fontSize: "24px", marginRight: "12px" }}>
        {getFileTypeIcon(file)}
      </span>
      <div style={{ flex: 1, fontSize: "14px" }}>
        <div style={{ fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
          {info.name}
        </div>
        <div style={{ color: "#6b7280", fontSize: "12px" }}>
          {info.size} • {info.type}
        </div>
        <div style={{ color: "#9ca3af", fontSize: "11px", marginTop: "2px" }}>
          修改时间：{info.lastModified}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            color: "#ef4444",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            fontSize: "18px",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fee2e2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title='移除文件'
        >
          ×
        </button>
      )}
    </div>
  );
};

// 创建日志显示组件
export const LogDisplay: React.FC<{
  logs: string[];
  title?: string;
  onClear?: () => void;
  maxHeight?: string;
}> = ({ logs, title = "操作日志", onClear, maxHeight = "200px" }) => {
  return (
    <div style={{ ...logDisplayStyles.container, maxHeight }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4 style={logDisplayStyles.header}>{title}</h4>
        {onClear && (
          <button
            onClick={onClear}
            style={logDisplayStyles.clearButton}
          >
            清空日志
          </button>
        )}
      </div>
      {logs.length === 0 ? (
        <div style={logDisplayStyles.emptyState}>暂无日志记录</div>
      ) : (
        logs.map((log, index) => (
          <div
            key={index}
            style={logDisplayStyles.logEntry}
          >
            {log}
          </div>
        ))
      )}
    </div>
  );
};

// 创建统计信息组件
export const StatsDisplay: React.FC<{
  files: File[];
  uploadProgress?: UploadProgress[];
}> = ({ files, uploadProgress }) => {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalFiles = files.length;

  const stats = uploadProgress
    ? {
        total: uploadProgress.length,
        completed: uploadProgress.filter((p) => p.status === "completed")
          .length,
        failed: uploadProgress.filter((p) => p.status === "error").length,
        cancelled: uploadProgress.filter((p) => p.status === "cancelled")
          .length,
        uploading: uploadProgress.filter((p) => p.status === "uploading")
          .length,
      }
    : null;

  return (
    <div
      style={{
        padding: "12px",
        backgroundColor: "#f0f9ff",
        borderRadius: "8px",
        border: "1px solid #0ea5e9",
        marginBottom: "16px",
      }}
    >
      <h4 style={{ margin: "0 0 8px 0", color: "#0369a1", fontSize: "14px" }}>
        📊 统计信息
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "8px",
          fontSize: "13px",
        }}
      >
        <div>
          <span style={{ color: "#0c4a6e", fontWeight: 500 }}>文件数量：</span>
          <span style={{ color: "#075985" }}>{totalFiles}</span>
        </div>
        <div>
          <span style={{ color: "#0c4a6e", fontWeight: 500 }}>总大小：</span>
          <span style={{ color: "#075985" }}>{formatFileSize(totalSize)}</span>
        </div>
        {stats && (
          <>
            <div>
              <span style={{ color: "#0c4a6e", fontWeight: 500 }}>
                已完成：
              </span>
              <span style={{ color: "#059669" }}>{stats.completed}</span>
            </div>
            {stats.failed > 0 && (
              <div>
                <span style={{ color: "#0c4a6e", fontWeight: 500 }}>
                  失败：
                </span>
                <span style={{ color: "#dc2626" }}>{stats.failed}</span>
              </div>
            )}
            {stats.uploading > 0 && (
              <div>
                <span style={{ color: "#0c4a6e", fontWeight: 500 }}>
                  上传中：
                </span>
                <span style={{ color: "#2563eb" }}>{stats.uploading}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 创建交互式故事的包装器（修复类型问题）
export const createInteractiveWrapper = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: {
    showLogs?: boolean;
    showFileList?: boolean;
    showStats?: boolean;
    logger?: StoryLogger;
    maxHeight?: string;
  } = {}
) => {
  const WrapperComponent: React.FC<T> = (args) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const [logs, setLogs] = React.useState<string[]>([]);
    const [uploadProgress, setUploadProgress] = React.useState<
      UploadProgress[]
    >([]);

    const logger = options.logger || new StoryLogger();

    React.useEffect(() => {
      if (options.showLogs) {
        return logger.subscribe(setLogs);
      }
    }, [logger]);

    const handleFileSelect = (fileList: FileList) => {
      const newFiles = Array.from(fileList);
      setFiles((prev) => [...prev, ...newFiles]);

      if (options.showLogs) {
        const fileInfo = newFiles
          .map((f) => `${f.name} (${formatFileSize(f.size)})`)
          .join(", ");
        logger.log(`选择了 ${newFiles.length} 个文件: ${fileInfo}`);
      }
    };

    const handleUpload = (successFiles: File[], results?: any[]) => {
      if (options.showLogs) {
        logger.log(
          `上传完成: ${successFiles.length}/${
            results?.length || successFiles.length
          } 个文件成功`
        );
      }
    };

    const handleUploadProgress = (progress: UploadProgress[]) => {
      setUploadProgress(progress);
      if (args.onUploadProgress) {
        args.onUploadProgress(progress);
      }
    };

    const clearFiles = () => {
      setFiles([]);
      setUploadProgress([]);
      logger.clear();
    };

    const removeFile = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
      <div style={{ padding: "20px", minWidth: "400px", maxWidth: "1000px" }}>
        <Component
          {...args}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          onUploadProgress={handleUploadProgress}
        />

        {options.showStats && files.length > 0 && (
          <StatsDisplay
            files={files}
            uploadProgress={uploadProgress}
          />
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              options.showFileList && options.showLogs ? "1fr 1fr" : "1fr",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {options.showFileList && files.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h4 style={{ margin: 0, color: "#374151" }}>
                  已选择的文件 ({files.length})
                </h4>
                <button
                  onClick={clearFiles}
                  style={logDisplayStyles.clearButton}
                >
                  清空全部
                </button>
              </div>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "12px",
                  maxHeight: options.maxHeight || "300px",
                  overflowY: "auto",
                }}
              >
                {files.map((file, index) => (
                  <FileInfoCard
                    key={index}
                    file={file}
                    index={index}
                    onRemove={() => removeFile(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {options.showLogs && (
            <LogDisplay
              logs={logs}
              onClear={() => logger.clear()}
              maxHeight={options.maxHeight || "300px"}
            />
          )}
        </div>
      </div>
    );
  };

  return WrapperComponent;
};
