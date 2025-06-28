# React Progress Uploader

一个功能完整、类型安全的 React 文件上传组件库，支持拖拽上传、实时进度显示、文件类型限制、取消上传等特性。

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📚 在线演示

**[查看实时演示和文档](https://zhengliu92.github.io/React-progress-uploader/)**

## 📦 安装

```bash
npm install react-progress-uploader
```

## 🚀 最佳实践

### 1. 基础上传（推荐）

```tsx
import React from 'react';
import { UploadButton } from 'react-progress-uploader';

function BasicUpload() {
  const uploadFunction = async ({ file, onProgress, signal }) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      signal, // 支持取消
    });
    
    return {
      success: response.ok,
      data: await response.json(),
    };
  };

  return (
    <UploadButton 
      uploadFunction={uploadFunction}
      multiple={true}
      acceptedFileTypes={['.jpg', '.png', '.pdf']}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024} // 10MB
      onUpload={(files, results) => {
        console.log('上传完成:', files);
      }}
    >
      选择文件上传
    </UploadButton>
  );
}
```

### 2. 使用 Axios（推荐生产环境）

```tsx
import axios from 'axios';
import { UploadButton } from 'react-progress-uploader';

function AxiosUpload() {
  const axiosUploadFunction = async ({ file, onProgress, signal }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isCancel(error)) throw error;
      return { 
        success: false, 
        error: error.response?.data?.message || '上传失败' 
      };
    }
  };

  return (
    <UploadButton
      uploadFunction={axiosUploadFunction}
      multiple={true}
      acceptedFileTypes={['.jpg', '.png', '.pdf']}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024}
    >
      上传文件
    </UploadButton>
  );
}
```

### 3. 对话框上传

```tsx
import { DialogUploader } from 'react-progress-uploader';

function DialogUpload() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开上传</button>
      <DialogUploader
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        uploadFunction={uploadFunction}
        multiple={true}
        maxFiles={10}
      />
    </>
  );
}
```

### 4. 仅文件选择（无上传）

```tsx
function FileSelector() {
  const handleFileSelection = (files) => {
    console.log('选择的文件:', files);
    // 处理文件逻辑
  };

  return (
    <UploadButton
      onUpload={handleFileSelection}
      multiple={true}
      acceptedFileTypes={['.jpg', '.png']}
      maxFiles={5}
    >
      选择文件
    </UploadButton>
  );
}
```

## 📝 核心 API

### UploadButton Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `uploadFunction` | `UploadFunction` | `undefined` | 上传函数（可选） |
| `multiple` | `boolean` | `true` | 多文件支持 |
| `acceptedFileTypes` | `string[]` | `undefined` | 文件类型限制 |
| `maxFiles` | `number` | `10` | 最大文件数 |
| `maxFileSize` | `number` | `undefined` | 文件大小限制(字节) |
| `onUpload` | `UploadCallback` | `undefined` | 完成回调 |
| `onUploadProgress` | `ProgressCallback` | `undefined` | 进度回调 |

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

## 🎯 配置建议

```tsx
// 推荐配置
<UploadButton
  uploadFunction={uploadFunction}
  multiple={true}
  acceptedFileTypes={['.jpg', '.png', '.pdf']} // 明确文件类型
  maxFiles={5}                                  // 合理的数量限制
  maxFileSize={10 * 1024 * 1024}              // 10MB 大小限制
  maxConcurrent={3}                            // 并发上传数
/>
```

## 📄 许可证

[MIT License](LICENSE) © 2024
