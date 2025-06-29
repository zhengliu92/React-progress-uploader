# React Progress Uploader

一个功能完整、类型安全的 React 文件上传组件库，支持拖拽上传、实时进度显示、文件类型限制、取消上传等特性。

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📚 在线演示

**[查看实时演示和文档](https://zhengliu92.github.io/React-progress-uploader/)**

## 🔧 最近更新 (v1.1.2)

### Bug 修复

- ✅ **修复文件列表重复显示问题** - 在 DialogUploader 中，同一文件不再重复显示
- ✅ **修复重复上传按钮问题** - 移除了 DialogUploader 中的重复"开始上传"按钮
- ✅ **优化 Windows 兼容性** - 使用`rimraf`替代`rm`命令，确保在 Windows 系统上正常构建
- ✅ **修复 npm 源配置问题** - 默认使用官方 npm 源，提升下载速度

### 技术改进

- 🚀 **新增 hideActions 属性** - Uploader 组件支持隐藏按钮区域，提供更灵活的集成方式
- 📦 **优化构建流程** - 改进 Windows 系统上的构建体验
- 🔍 **更好的类型安全** - 优化 TypeScript 类型定义

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

### 自定义按钮颜色

```tsx
import { UploadButton } from "react-progress-uploader";

function CustomColorUpload() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {/* 方法1: 使用颜色属性 */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        backgroundColor='#10B981' // 绿色背景
        color='white' // 白色文字
        variant='custom'
      >
        绿色按钮
      </UploadButton>

      {/* 方法2: 使用outline变体 + 自定义边框色 */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        variant='outline'
        borderColor='#F59E0B' // 黄色边框
        color='#F59E0B' // 黄色文字
      >
        黄色边框按钮
      </UploadButton>

      {/* 方法3: 使用style属性完全自定义 */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        style={{
          background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
          border: "none",
          color: "white",
          borderRadius: "20px",
        }}
      >
        渐变按钮
      </UploadButton>

      {/* 方法4: 深色主题 */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        backgroundColor='#1F2937'
        color='#F9FAFB'
        style={{ borderRadius: "8px" }}
      >
        深色按钮
      </UploadButton>
    </div>
  );
}
```

### 自定义按钮图标

```tsx
import { UploadButton } from "react-progress-uploader";

function CustomIconUpload() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {/* 默认云图标 */}
      <UploadButton uploadFunction={axiosUploadFunction}>
        默认云图标
      </UploadButton>

      {/* 隐藏图标 */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        showIcon={false}
      >
        纯文字按钮
      </UploadButton>

      {/* Emoji图标 */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        icon='📤'
      >
        发送文件
      </UploadButton>

      <UploadButton
        uploadFunction={axiosUploadFunction}
        icon='🖼️'
      >
        上传图片
      </UploadButton>

      <UploadButton
        uploadFunction={axiosUploadFunction}
        icon='📄'
      >
        上传文档
      </UploadButton>

      {/* 自定义SVG图标 */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        icon={
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
          >
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7,10 12,15 17,10' />
            <line
              x1='12'
              y1='15'
              x2='12'
              y2='3'
            />
          </svg>
        }
      >
        自定义图标
      </UploadButton>
    </div>
  );
}
```

### 自定义上传控制

```tsx
import { Uploader } from "react-progress-uploader";
import { useState } from "react";

function CustomControlUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  return (
    <div>
      {/* 只作为文件选择区域，隐藏内置按钮 */}
      <Uploader
        uploadFunction={axiosUploadFunction}
        multiple={true}
        acceptedFileTypes={[".jpg", ".png", ".pdf"]}
        hideActions={true} // 隐藏内置按钮
        onFileSelect={(files) => {
          setSelectedFiles(Array.from(files));
        }}
      />

      {/* 自定义上传控制 */}
      {selectedFiles.length > 0 && (
        <div>
          <p>已选择 {selectedFiles.length} 个文件</p>
          <button
            onClick={() => {
              /* 自定义上传逻辑 */
            }}
          >
            开始上传
          </button>
        </div>
      )}
    </div>
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

### UploadButton 组件特有 Props

| 属性              | 类型              | 默认值      | 描述                                                  |
| ----------------- | ----------------- | ----------- | ----------------------------------------------------- |
| `variant`         | `string`          | `primary`   | 按钮变体：`primary`、`secondary`、`outline`、`custom` |
| `color`           | `string`          | `undefined` | 自定义文字颜色                                        |
| `backgroundColor` | `string`          | `undefined` | 自定义背景颜色                                        |
| `borderColor`     | `string`          | `undefined` | 自定义边框颜色（outline 变体用）                      |
| `showIcon`        | `boolean`         | `true`      | 是否显示图标                                          |
| `icon`            | `React.ReactNode` | `undefined` | 自定义图标（覆盖默认云图标）                          |

### Uploader 组件特有 Props

| 属性          | 类型      | 默认值  | 描述                 |
| ------------- | --------- | ------- | -------------------- |
| `hideActions` | `boolean` | `false` | 是否隐藏上传按钮区域 |

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
