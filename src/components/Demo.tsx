import React, { useState } from "react";
import { UploadButton } from "./UploadButton/UploadButton";
import { Uploader } from "./Uploader/Uploader";
import { UploadProgress, UploadResult, UploadOptions } from "../hooks";
import axios from "axios";

export const Demo: React.FC = () => {
  const [uploadHistory, setUploadHistory] = useState<string[]>([]);
  const [progressLogs, setProgressLogs] = useState<string[]>([]);

  // 真实的axios上传函数示例
  const axiosUploadFunction = async ({
    file,
    onProgress,
    signal,
  }: UploadOptions): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
        throw error; // 重新抛出取消错误
      }

      return {
        success: false,
        error: error.message || "上传失败",
      };
    }
  };

  // 模拟慢速上传函数（用于测试取消功能）
  const slowMockUploadFunction = async ({
    file,
    onProgress,
    signal,
  }: UploadOptions): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      let progress = 0;

      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval);
          reject(new Error("AbortError"));
          return;
        }

        progress += Math.random() * 10 + 2; // 每次增加2-12%的进度
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // 模拟90%成功率
          if (Math.random() > 0.1) {
            resolve({
              success: true,
              data: { message: `${file.name} 上传成功` },
            });
          } else {
            resolve({
              success: false,
              error: "模拟上传失败",
            });
          }
        } else {
          onProgress(progress);
        }
      }, 300 + Math.random() * 500); // 300-800ms间隔，模拟慢速上传
    });
  };

  // 超慢速上传函数（专门用于测试单个文件取消功能）
  const ultraSlowUploadFunction = async ({
    file,
    onProgress,
    signal,
  }: UploadOptions): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
      let progress = 0;

      const interval = setInterval(() => {
        if (signal.aborted) {
          clearInterval(interval);
          reject(new Error("AbortError"));
          return;
        }

        progress += Math.random() * 2 + 0.5; // 每次只增加0.5-2.5%的进度，非常慢
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve({
            success: true,
            data: { message: `${file.name} 上传成功` },
          });
        } else {
          onProgress(progress);
        }
      }, 1000 + Math.random() * 1000); // 1-2秒间隔，超级慢速
    });
  };

  const handleUpload = (successfulFiles: File[], results: UploadResult[]) => {
    const fileNames = successfulFiles.map((file) => file.name);
    console.log("上传成功的文件:", successfulFiles);
    console.log("上传结果:", results);

    setUploadHistory((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] 上传完成: ${fileNames.join(
        ", "
      )} (${successfulFiles.length}/${results.length} 成功)`,
    ]);
  };

  const handleUploadProgress = (progress: UploadProgress[]) => {
    const completedFiles = progress.filter(
      (p) => p.status === "completed"
    ).length;
    const cancelledFiles = progress.filter(
      (p) => p.status === "cancelled"
    ).length;
    const errorFiles = progress.filter((p) => p.status === "error").length;
    const totalFiles = progress.length;

    let logMessage = `[${new Date().toLocaleTimeString()}] 进度更新: ${completedFiles}/${totalFiles} 文件完成`;
    if (cancelledFiles > 0) {
      logMessage += `, ${cancelledFiles} 个文件已取消`;
    }
    if (errorFiles > 0) {
      logMessage += `, ${errorFiles} 个文件失败`;
    }

    setProgressLogs((prev) => [...prev, logMessage]);
  };

  const handleFileSelect = (files: FileList) => {
    const fileNames = Array.from(files).map((file) => file.name);
    console.log("直接选择文件:", Array.from(files));
    alert(`直接选择了 ${files.length} 个文件: ${fileNames.join(", ")}`);
  };

  const clearLogs = () => {
    setUploadHistory([]);
    setProgressLogs([]);
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "32px", color: "#374151" }}>
        React Uploader 组件演示
      </h1>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "16px", color: "#374151" }}>
          1. 真实上传示例 (使用axios)
        </h2>
        <p style={{ marginBottom: "24px", color: "#6b7280" }}>
          这些按钮会向 httpbin.org 发送真实的HTTP请求，支持进度跟踪和取消功能。
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <UploadButton
            onUpload={handleUpload}
            onUploadProgress={handleUploadProgress}
            uploadFunction={axiosUploadFunction}
            multiple={true}
          >
            📡 真实axios上传
          </UploadButton>

          <UploadButton
            variant="secondary"
            onUpload={handleUpload}
            onUploadProgress={handleUploadProgress}
            uploadFunction={axiosUploadFunction}
            acceptedFileTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
            multiple={true}
          >
            🖼️ 图片上传 (真实)
          </UploadButton>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "16px", color: "#374151" }}>
          2. 模拟慢速上传 (测试取消功能)
        </h2>
        <p style={{ marginBottom: "24px", color: "#6b7280" }}>
          模拟慢速上传过程，方便测试单独取消和全部取消功能。
        </p>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <UploadButton
            onUpload={handleUpload}
            onUploadProgress={handleUploadProgress}
            uploadFunction={slowMockUploadFunction}
            multiple={true}
          >
            🐌 慢速上传 (测试取消)
          </UploadButton>

          <UploadButton
            variant="outline"
            size="large"
            onUpload={handleUpload}
            onUploadProgress={handleUploadProgress}
            uploadFunction={slowMockUploadFunction}
            acceptedFileTypes={[".pdf", ".doc", ".docx", ".txt"]}
            multiple={true}
          >
            📄 文档慢速上传
          </UploadButton>

          <UploadButton
            variant="outline"
            onUpload={handleUpload}
            onUploadProgress={handleUploadProgress}
            uploadFunction={ultraSlowUploadFunction}
            multiple={true}
          >
            🐢 超慢速上传 (测试单文件取消)
          </UploadButton>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "16px", color: "#374151" }}>
          3. 直接上传区域 (多种配置)
        </h2>
        <p style={{ marginBottom: "24px", color: "#6b7280" }}>
          直接嵌入页面的上传区域，支持不同的文件类型限制。
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          <div>
            <h4 style={{ marginBottom: "12px", color: "#374151" }}>
              任意文件类型 (多选)
            </h4>
            <Uploader onFileSelect={handleFileSelect} multiple={true} />
          </div>

          <div>
            <h4 style={{ marginBottom: "12px", color: "#374151" }}>
              仅图片文件 (单选)
            </h4>
            <Uploader
              onFileSelect={handleFileSelect}
              multiple={false}
              acceptedFileTypes={[".jpg", ".png", ".gif"]}
            />
          </div>

          <div>
            <h4 style={{ marginBottom: "12px", color: "#374151" }}>
              媒体文件 (多选)
            </h4>
            <Uploader
              onFileSelect={handleFileSelect}
              multiple={true}
              acceptedFileTypes={[".mp4", ".avi", ".mp3", ".wav"]}
            />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <h2 style={{ marginBottom: "16px", color: "#374151" }}>
          4. 按钮状态演示
        </h2>
        <p style={{ marginBottom: "24px", color: "#6b7280" }}>
          不同样式、尺寸和状态的按钮组合。
        </p>

        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ marginBottom: "12px", color: "#374151" }}>不同样式</h4>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <UploadButton
              variant="primary"
              onUpload={handleUpload}
              uploadFunction={axiosUploadFunction}
            >
              Primary
            </UploadButton>
            <UploadButton
              variant="secondary"
              onUpload={handleUpload}
              uploadFunction={axiosUploadFunction}
            >
              Secondary
            </UploadButton>
            <UploadButton
              variant="outline"
              onUpload={handleUpload}
              uploadFunction={axiosUploadFunction}
            >
              Outline
            </UploadButton>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <h4 style={{ marginBottom: "12px", color: "#374151" }}>不同尺寸</h4>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <UploadButton
              size="small"
              onUpload={handleUpload}
              uploadFunction={axiosUploadFunction}
            >
              Small
            </UploadButton>
            <UploadButton
              size="medium"
              onUpload={handleUpload}
              uploadFunction={axiosUploadFunction}
            >
              Medium
            </UploadButton>
            <UploadButton
              size="large"
              onUpload={handleUpload}
              uploadFunction={axiosUploadFunction}
            >
              Large
            </UploadButton>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: "12px", color: "#374151" }}>禁用状态</h4>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <UploadButton
              variant="primary"
              disabled
              uploadFunction={axiosUploadFunction}
            >
              Disabled Primary
            </UploadButton>
            <UploadButton
              variant="secondary"
              disabled
              uploadFunction={axiosUploadFunction}
            >
              Disabled Secondary
            </UploadButton>
            <UploadButton
              variant="outline"
              disabled
              uploadFunction={axiosUploadFunction}
            >
              Disabled Outline
            </UploadButton>
          </div>
        </div>
      </section>

      {/* 日志区域 */}
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
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 16px",
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
                maxHeight: "300px",
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
                maxHeight: "300px",
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
          background: "#f0f9ff",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ color: "#0369a1", marginBottom: "16px" }}>
          🚀 如何在您的项目中使用真实上传
        </h2>
        <div style={{ color: "#0c4a6e" }}>
          <h3>1. 安装依赖</h3>
          <pre
            style={{
              background: "#e0f2fe",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            npm install axios
          </pre>

          <h3>2. 创建上传函数</h3>
          <pre
            style={{
              background: "#e0f2fe",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {`const uploadFunction = async ({ file, onProgress, signal }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error; // 重新抛出取消错误
    }
    return { success: false, error: error.message };
  }
};`}
          </pre>

          <h3>3. 使用组件</h3>
          <pre
            style={{
              background: "#e0f2fe",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto",
            }}
          >
            {`<UploadButton
  uploadFunction={uploadFunction}
  onUpload={(files, results) => {
    console.log('成功上传的文件:', files);
    console.log('上传结果:', results);
  }}
  onUploadProgress={(progress) => {
    console.log('上传进度:', progress);
  }}
  multiple={true}
>
  上传文件
</UploadButton>`}
          </pre>
        </div>
      </section>
    </div>
  );
};
