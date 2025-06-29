# React Progress Uploader

一个功能完整、类型安全的 React 文件上传组件库，支持拖拽上传、实时进度显示、文件类型限制、取消上传等特性。

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📚 在线演示

**[查看实时演示和文档](https://zhengliu92.github.io/React-progress-uploader/)**

## 📦 安装

```bash
npm install react-progress-uploader axios
```

## 🚀 快速开始 - Axios 上传示例

### 基础用法

```tsx
import React from "react";
import axios from "axios";
import { UploadButton } from "react-progress-uploader";

function FileUpload() {
  const axiosUploadFunction = async ({ file, onProgress, signal }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        signal, // 支持取消上传
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isCancel(error)) throw error; // 处理取消
      return {
        success: false,
        error: error.response?.data?.message || "上传失败",
      };
    }
  };

  return (
    <UploadButton
      uploadFunction={axiosUploadFunction}
      multiple={true}
      acceptedFileTypes={[".jpg", ".png", ".pdf"]}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024} // 10MB
      onUpload={(files, results) => {
        console.log("上传成功的文件:", files);
        console.log("上传结果:", results);
      }}
      onUploadProgress={(progress) => {
        console.log("上传进度:", progress);
      }}
    >
      选择文件上传
    </UploadButton>
  );
}
```

### 对话框上传

```tsx
import { DialogUploader } from "react-progress-uploader";

function DialogUpload() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开上传</button>
      <DialogUploader
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        uploadFunction={axiosUploadFunction}
        multiple={true}
        maxFiles={10}
        acceptedFileTypes={[".jpg", ".png", ".pdf"]}
        maxFileSize={10 * 1024 * 1024}
        onUpload={(files, results) => {
          console.log("对话框上传完成:", files);
        }}
      />
    </>
  );
}
```

### 区域上传

```tsx
import { Uploader } from "react-progress-uploader";

function DragDropUpload() {
  return (
    <Uploader
      uploadFunction={axiosUploadFunction}
      multiple={true}
      acceptedFileTypes={[".jpg", ".png", ".pdf"]}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024}
      onUpload={(files, results) => {
        console.log("拖拽上传完成:", files);
      }}
    />
  );
}
```

## 📝 核心 API

### 主要组件

- `UploadButton` - 按钮式上传组件
- `DialogUploader` - 对话框上传组件
- `Uploader` - 拖拽区域上传组件

### 通用 Props

| 属性                | 类型               | 默认值      | 描述               |
| ------------------- | ------------------ | ----------- | ------------------ |
| `uploadFunction`    | `UploadFunction`   | **必需**    | Axios 上传函数     |
| `multiple`          | `boolean`          | `true`      | 多文件支持         |
| `acceptedFileTypes` | `string[]`         | `undefined` | 文件类型限制       |
| `maxFiles`          | `number`           | `10`        | 最大文件数         |
| `maxFileSize`       | `number`           | `undefined` | 文件大小限制(字节) |
| `maxConcurrent`     | `number`           | `3`         | 最大并发上传数     |
| `onUpload`          | `UploadCallback`   | `undefined` | 完成回调           |
| `onUploadProgress`  | `ProgressCallback` | `undefined` | 进度回调           |

### 上传函数类型

```typescript
type UploadFunction = (options: {
  file: File;
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}) => Promise<{
  success: boolean;
  data?: any;
  error?: string;
}>;
```

## 🎯 推荐配置

```tsx
<UploadButton
  uploadFunction={axiosUploadFunction}
  multiple={true}
  acceptedFileTypes={[".jpg", ".png", ".pdf"]} // 明确文件类型
  maxFiles={5} // 合理的数量限制
  maxFileSize={10 * 1024 * 1024} // 10MB 大小限制
  maxConcurrent={3} // 3个并发上传
/>
```

## 📄 许可证

[MIT License](LICENSE) © 2024
