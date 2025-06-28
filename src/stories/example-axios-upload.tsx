import React, { useState, useRef } from "react";
import { UploadButton } from "../components/UploadButton/UploadButton";
import { DialogUploader } from "../components/DialogUploader/DialogUploader";
import axios from "axios";

interface UploadOptions {
  file: File;
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}

interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error" | "cancelled";
  error?: string;
}

// 真实的axios上传函数示例
const axiosUploadFunction = async ({
  file,
  onProgress,
  signal,
}: UploadOptions): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // 使用 httpbin.org 作为测试端点（真实项目中替换为您的API端点）
    const response = await axios.post("https://httpbin.org/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // 在真实项目中，您可能需要添加认证头
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (error.name === "AbortError" || axios.isCancel(error)) {
      throw error; // 重新抛出取消错误，让组件处理
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message || "上传失败",
    };
  }
};

// 带有错误处理的强健上传函数
const robustUploadFunction = async ({
  file,
  onProgress,
  signal,
}: UploadOptions): Promise<UploadResult> => {
  try {
    // 文件大小检查 (限制为10MB)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: "文件大小不能超过 10MB",
      };
    }

    // 文件类型检查
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "不支持的文件类型",
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadTime", new Date().toISOString());

    const response = await axios.post("https://httpbin.org/post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal,
      timeout: 30000, // 30秒超时
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });

    return {
      success: true,
      data: {
        ...response.data,
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
      },
    };
  } catch (error: any) {
    if (axios.isCancel(error) || error.name === "AbortError") {
      throw error;
    }

    // 根据错误类型返回友好的错误信息
    if (error.code === "ECONNABORTED") {
      return { success: false, error: "上传超时，请重试" };
    }

    if (error.response?.status === 413) {
      return { success: false, error: "文件太大，服务器拒绝上传" };
    }

    if (error.response?.status >= 500) {
      return { success: false, error: "服务器错误，请稍后重试" };
    }

    return {
      success: false,
      error: error.response?.data?.message || "上传失败，请重试",
    };
  }
};

// 使用自定义后端API的上传函数示例
const customApiUpload = async ({
  file,
  onProgress,
  signal,
}: UploadOptions): Promise<UploadResult> => {
  try {
    // 第一步：获取上传URL和token（假设您的后端提供这样的API）
    const { data: uploadConfig } = await axios.post(
      "/api/upload/init",
      {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
      { signal }
    );

    // 第二步：使用获取的URL上传文件
    const formData = new FormData();
    formData.append("file", file);

    // 添加后端返回的其他必需字段
    Object.entries(uploadConfig.fields || {}).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const response = await axios.post(
      uploadConfig.uploadUrl || "/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${uploadConfig.token}`,
        },
        signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percent);
          }
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (axios.isCancel(error)) {
      throw error;
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message || "上传失败",
    };
  }
};

export default function AxiosUploadExample() {
  const [uploadHistory, setUploadHistory] = useState<string[]>([]);
  const [progressLogs, setProgressLogs] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const lastLogKey = useRef<string>("");

  const handleUpload = (successfulFiles: File[], results: UploadResult[]) => {
    const fileNames = successfulFiles.map((f) => f.name);
    const timestamp = new Date().toLocaleTimeString();

    setUploadHistory((prev) => [
      ...prev,
      `[${timestamp}] 上传完成: ${fileNames.join(", ")} (${
        successfulFiles.length
      }/${results.length} 成功)`,
    ]);

    // 可以在这里处理上传结果
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`文件上传成功:`, result.data);
      } else {
        console.error(`文件上传失败:`, result.error);
      }
    });
  };

  const handleProgress = (progress: UploadProgress[]) => {
    const completed = progress.filter((p) => p.status === "completed").length;
    const cancelled = progress.filter((p) => p.status === "cancelled").length;
    const errors = progress.filter((p) => p.status === "error").length;
    const uploading = progress.filter((p) => p.status === "uploading").length;

    // 只在重要状态变化时记录日志，避免过多的进度更新日志
    const currentKey = `${completed}-${cancelled}-${errors}-${uploading}`;

    if (lastLogKey.current !== currentKey) {
      lastLogKey.current = currentKey;

      const timestamp = new Date().toLocaleTimeString();
      let logMessage = `[${timestamp}] 进度: ${completed}/${progress.length} 完成`;
      if (uploading > 0) logMessage += `, ${uploading} 上传中`;
      if (cancelled > 0) logMessage += `, ${cancelled} 取消`;
      if (errors > 0) logMessage += `, ${errors} 失败`;

      setProgressLogs((prev) => [...prev, logMessage]);
    }
  };

  const clearLogs = () => {
    setUploadHistory([]);
    setProgressLogs([]);
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "32px", color: "#374151" }}>
        React 上传组件 - Axios 真实上传示例
      </h1>

      {/* 基本上传示例 */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "16px", color: "#374151" }}>
          1. 基本 Axios 上传
        </h2>
        <p style={{ marginBottom: "24px", color: "#6b7280" }}>
          使用 httpbin.org 作为测试端点的基本上传功能。
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <UploadButton
            uploadFunction={axiosUploadFunction}
            onUpload={handleUpload}
            onUploadProgress={handleProgress}
            multiple={true}
            variant="primary"
          >
            📡 基本上传
          </UploadButton>

          <UploadButton
            uploadFunction={axiosUploadFunction}
            onUpload={handleUpload}
            onUploadProgress={handleProgress}
            acceptedFileTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
            multiple={true}
            variant="secondary"
          >
            🖼️ 仅图片
          </UploadButton>
        </div>
      </section>

      {/* 强健上传示例 */}
      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "16px", color: "#374151" }}>
          2. 强健的上传处理
        </h2>
        <p style={{ marginBottom: "24px", color: "#6b7280" }}>
          包含文件大小检查、类型验证、错误处理和超时设置。
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <UploadButton
            uploadFunction={robustUploadFunction}
            onUpload={handleUpload}
            onUploadProgress={handleProgress}
            multiple={true}
            variant="outline"
            maxConcurrent={2}
          >
            🛡️ 强健上传 (10MB限制)
          </UploadButton>

          <button
            onClick={() => setIsDialogOpen(true)}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🎯 自定义对话框上传
          </button>
        </div>
      </section>

      {/* 自定义对话框 */}
      <DialogUploader
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        uploadFunction={robustUploadFunction}
        onUpload={handleUpload}
        onUploadProgress={handleProgress}
        multiple={true}
        acceptedFileTypes={[".pdf", ".doc", ".docx", ".txt", ".jpg", ".png"]}
        maxConcurrent={3}
      />

      {/* 日志显示 */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ color: "#374151", margin: 0 }}>操作日志</h2>
          <button
            onClick={clearLogs}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            清空日志
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
          }}
        >
          <div>
            <h3 style={{ color: "#374151", marginBottom: "12px" }}>上传历史</h3>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "16px",
                height: "300px",
                overflowY: "auto",
                fontSize: "14px",
              }}
            >
              {uploadHistory.length === 0 ? (
                <p style={{ color: "#64748b", margin: 0 }}>暂无上传记录</p>
              ) : (
                uploadHistory.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "4px 0",
                      borderBottom:
                        index < uploadHistory.length - 1
                          ? "1px solid #e2e8f0"
                          : "none",
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 style={{ color: "#374151", marginBottom: "12px" }}>进度日志</h3>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "16px",
                height: "300px",
                overflowY: "auto",
                fontSize: "14px",
              }}
            >
              {progressLogs.length === 0 ? (
                <p style={{ color: "#64748b", margin: 0 }}>暂无进度记录</p>
              ) : (
                progressLogs.map((log, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "4px 0",
                      borderBottom:
                        index < progressLogs.length - 1
                          ? "1px solid #e2e8f0"
                          : "none",
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 使用说明 */}
      <section
        style={{
          marginTop: "48px",
          padding: "24px",
          backgroundColor: "#f0f9ff",
          borderRadius: "8px",
          border: "1px solid #0ea5e9",
        }}
      >
        <h2 style={{ color: "#0369a1", marginBottom: "16px" }}>
          💡 集成到您的项目
        </h2>
        <div style={{ color: "#0c4a6e", fontSize: "14px" }}>
          <p>
            <strong>1. 替换API端点：</strong>
          </p>
          <p>将示例中的 'https://httpbin.org/post' 替换为您的实际API端点。</p>

          <p style={{ marginTop: "16px" }}>
            <strong>2. 添加认证：</strong>
          </p>
          <p>在headers中添加Authorization或其他认证信息。</p>

          <p style={{ marginTop: "16px" }}>
            <strong>3. 处理响应：</strong>
          </p>
          <p>根据您的API响应格式调整result.data的处理逻辑。</p>

          <p style={{ marginTop: "16px" }}>
            <strong>4. 错误处理：</strong>
          </p>
          <p>根据您的后端错误格式自定义错误信息提取。</p>
        </div>
      </section>
    </div>
  );
}
