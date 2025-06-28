# React Progress Uploader

**语言 / Language:** [🇺🇸 English](./README.en.md) | [🇨🇳 中文](./README.md)

一个功能完整、类型安全的 React 文件上传组件库，支持拖拽上传、实时进度显示、文件类型限制、取消上传等特性。

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Storybook](https://img.shields.io/badge/Storybook-📚-pink.svg)](https://zhengliu92.github.io/React-progress-uploader/)

## ✨ 特性

- 🚀 **即插即用** - 零配置开箱即用，支持多种上传方式
- 📊 **实时进度** - 详细的上传进度和状态跟踪  
- ❌ **智能取消** - 支持单个文件或全部文件的上传取消
- 🎯 **多文件支持** - 批量上传，可配置并发数量
- 🎨 **文件过滤** - 灵活的文件类型和大小限制
- 🖱️ **拖拽体验** - 原生拖拽支持，用户体验友好
- 🎛️ **高度可定制** - 多种样式、尺寸和行为配置
- 📱 **响应式设计** - 完美支持移动端和桌面端
- 🔒 **类型安全** - 完整的 TypeScript 支持
- 🎪 **多种组件** - 按钮式、对话框式、区域式上传组件

## 📦 安装

```bash
# 使用 npm
npm install react-progress-uploader

# 使用 yarn  
yarn add react-progress-uploader

# 使用 pnpm
pnpm add react-progress-uploader
```

### 可选依赖

如果使用 axios 进行上传：
```bash
npm install axios
```

## 🚀 快速开始

> 📚 **在线文档和演示**: [查看Storybook](https://zhengliu92.github.io/React-progress-uploader/)

### 基础用法

```tsx
import React from 'react';
import { UploadButton } from 'react-progress-uploader';

// 最简单的使用方式
function BasicUpload() {
  const uploadFunction = async ({ file, onProgress, signal }) => {
    // 你的上传逻辑
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
      onUpload={(files, results) => {
        console.log('上传完成:', files);
      }}
    >
      选择文件上传
    </UploadButton>
  );
}
```

### 仅文件选择（不上传）

当不提供 `uploadFunction` 时，组件将作为纯文件选择器使用：

```tsx
import React from 'react';
import { UploadButton } from 'react-progress-uploader';

function FileSelector() {
  const handleFileSelection = (files) => {
    console.log('用户选择的文件:', files);
    // 处理选择的文件（例如：预览、验证、保存到状态等）
    files.forEach(file => {
      console.log(`文件: ${file.name}, 大小: ${file.size} bytes`);
    });
  };

  return (
    <UploadButton
      onUpload={handleFileSelection}
      multiple={true}
      acceptedFileTypes={['.jpg', '.png', '.pdf']}
      maxFiles={5}
      maxFileSize={5 * 1024 * 1024} // 5MB
    >
      选择文件
    </UploadButton>
  );
}
```

这种模式非常适合以下场景：
- 📁 文件选择器
- 🖼️ 图片预览
- ✅ 文件验证
- 📋 文件信息收集
- 🔄 自定义上传逻辑

### 使用 axios

```tsx
import React from 'react';
import { UploadButton } from 'react-progress-uploader';
import axios from 'axios';

function AxiosUpload() {
  const axiosUploadFunction = async ({ file, onProgress, signal }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${token}`, // 添加认证
        },
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

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error; // 重新抛出取消错误
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || '上传失败',
      };
    }
  };

  return (
    <UploadButton
      uploadFunction={axiosUploadFunction}
      multiple={true}
      acceptedFileTypes={['.jpg', '.png', '.pdf']}
      onUpload={(successfulFiles, results) => {
        console.log(`成功上传 ${successfulFiles.length} 个文件`);
      }}
      onUploadProgress={(progress) => {
        const completed = progress.filter(p => p.status === 'completed').length;
        console.log(`已完成: ${completed}/${progress.length}`);
      }}
    >
      上传文件
    </UploadButton>
  );
}
```

## 📚 组件API

### UploadButton

快速集成的按钮式上传组件。

```tsx
import { UploadButton } from 'react-progress-uploader';
```

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `uploadFunction` | `UploadFunction` | `undefined` | 上传函数实现（可选，不提供时作为文件选择器） |
| `children` | `ReactNode` | `"上传文件"` | 按钮内容 |
| `variant` | `"primary" \| "secondary" \| "outline"` | `"primary"` | 按钮样式 |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | 按钮尺寸 |
| `multiple` | `boolean` | `true` | 是否支持多文件 |
| `acceptedFileTypes` | `string[]` | `undefined` | 允许的文件类型 |
| `maxConcurrent` | `number` | `3` | 最大并发上传数 |
| `maxFiles` | `number` | `10` | 最大文件数量 |
| `maxFileSize` | `number` | `undefined` | 单文件最大大小(字节) |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `onUpload` | `UploadCallback` | `undefined` | 上传完成回调 |
| `onUploadProgress` | `ProgressCallback` | `undefined` | 进度更新回调 |

### DialogUploader

对话框式上传组件，提供完整的上传界面。

```tsx
import { DialogUploader } from 'react-progress-uploader';
```

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `isOpen` | `boolean` | **必需** | 是否显示对话框 |
| `onClose` | `() => void` | **必需** | 关闭对话框回调 |
| `uploadFunction` | `UploadFunction` | `undefined` | 上传函数实现（可选，不提供时作为文件选择器） |
| `onUpload` | `UploadCallback` | `undefined` | 上传完成回调 |
| `onUploadProgress` | `ProgressCallback` | `undefined` | 进度更新回调 |
| `multiple` | `boolean` | `true` | 是否支持多文件 |
| `acceptedFileTypes` | `string[]` | `undefined` | 允许的文件类型 |
| `maxConcurrent` | `number` | `3` | 最大并发上传数 |
| `maxFiles` | `number` | `10` | 最大文件数量 |
| `maxFileSize` | `number` | `undefined` | 单文件最大大小(字节) |

### Uploader

基础的拖拽上传区域组件。

```tsx
import { Uploader } from 'react-progress-uploader';
```

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `onFileSelect` | `(files: FileList) => void` | **必需** | 文件选择回调 |
| `multiple` | `boolean` | `true` | 是否支持多文件 |
| `acceptedFileTypes` | `string[]` | `undefined` | 允许的文件类型 |

## 🔧 Hooks API

### useUploadQueue

文件上传队列管理 hook。

```tsx
import { useUploadQueue } from 'react-progress-uploader';

const {
  uploadProgress,
  isUploading,
  isCancelling,
  startUpload,
  cancelAllUploads,
  resetQueue,
} = useUploadQueue({
  uploadFunction,
  maxConcurrent: 3,
  onUploadProgress: (progress) => console.log(progress),
  onUploadComplete: (files, results) => console.log('完成:', files),
});
```

### useFileSelection

文件选择和验证 hook。

```tsx
import { useFileSelection } from 'react-progress-uploader';

const {
  selectedFiles,
  selectionError,
  addFiles,
  removeFile,
  clearFiles,
  canAddMoreFiles,
  getFileStats,
} = useFileSelection({
  multiple: true,
  acceptedFileTypes: ['.jpg', '.png'],
  maxFiles: 5,
  maxFileSize: 10 * 1024 * 1024, // 10MB
});
```

### useUploadUI

UI 工具函数 hook。

```tsx
import { useUploadUI } from 'react-progress-uploader';

const {
  getProgressColor,
  getStatusIconType,
  formatFileSize,
  getUploadStats,
  getStatusMessage,
  getOverallStatusTitle,
} = useUploadUI();
```

## 📝 类型定义

```typescript
// 上传函数签名
type UploadFunction = (options: UploadOptions) => Promise<UploadResult>;

// 上传选项
interface UploadOptions {
  file: File;
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}

// 上传结果
interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
}

// 上传进度
interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error" | "cancelled";
  error?: string;
}

// 回调函数
type UploadCallback = (successfulFiles: File[], results: UploadResult[]) => void;
type ProgressCallback = (progress: UploadProgress[]) => void;
```

## 🎯 使用场景

### 图片上传

```tsx
function ImageUpload() {
  const imageUpload = async ({ file, onProgress, signal }) => {
    // 客户端图片压缩
    const compressedFile = await compressImage(file);
    
    const formData = new FormData();
    formData.append('image', compressedFile);
    
    const response = await fetch('/api/images', {
      method: 'POST',
      body: formData,
      signal,
    });
    
    return {
      success: response.ok,
      data: await response.json(),
    };
  };

  return (
    <UploadButton
      uploadFunction={imageUpload}
      acceptedFileTypes={['.jpg', '.jpeg', '.png', '.gif', '.webp']}
      maxFileSize={5 * 1024 * 1024} // 5MB
      variant="primary"
    >
      上传图片
    </UploadButton>
  );
}
```

### 文档上传

```tsx
function DocumentUpload() {
  return (
    <DialogUploader
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      uploadFunction={documentUploadFunction}
      acceptedFileTypes={['.pdf', '.doc', '.docx', '.txt']}
      maxFiles={3}
      multiple={true}
      onUpload={(files, results) => {
        console.log(`上传了 ${files.length} 个文档`);
      }}
    />
  );
}
```

### 云存储上传

```tsx
// 使用阿里云 OSS
const ossUpload = async ({ file, onProgress, signal }) => {
  try {
    const result = await ossClient.put(file.name, file, {
      progress: (p) => onProgress(Math.round(p * 100)),
    });
    
    return {
      success: true,
      data: { url: result.url, name: result.name },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || '上传到云存储失败',
    };
  }
};

// 使用 AWS S3
const s3Upload = async ({ file, onProgress, signal }) => {
  try {
    const { data } = await axios.post('/api/s3/presigned-url', {
      fileName: file.name,
      fileType: file.type,
    });
    
    await axios.put(data.uploadUrl, file, {
      headers: { 'Content-Type': file.type },
      signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    
    return {
      success: true,
      data: { url: data.accessUrl },
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    return {
      success: false,
      error: error.message || 'S3上传失败',
    };
  }
};
```

## 🎨 样式自定义

### CSS 变量

```css
:root {
  --upload-button-primary-bg: #3b82f6;
  --upload-button-primary-hover: #2563eb;
  --upload-button-border-radius: 8px;
  --upload-dialog-backdrop: rgba(0, 0, 0, 0.5);
  --upload-progress-color: #3b82f6;
}
```

### 自定义样式

```css
/* 自定义按钮样式 */
.upload-button--primary {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.upload-button--primary:hover {
  background: linear-gradient(45deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

/* 自定义对话框样式 */
.dialog-uploader-content {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 自定义进度条 */
.dialog-uploader-progress-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.dialog-uploader-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: progress-shine 2s infinite;
}
```

## 🚀 性能优化

### 大文件处理

```tsx
const optimizedUpload = async ({ file, onProgress, signal }) => {
  // 文件大小检查
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: `文件大小超过限制 (${Math.round(maxSize / 1024 / 1024)}MB)`,
    };
  }

  // 大文件分片上传
  if (file.size > 10 * 1024 * 1024) { // 10MB以上使用分片
    return await chunkUpload(file, onProgress, signal);
  }

  // 普通上传
  return await regularUpload(file, onProgress, signal);
};

// 分片上传实现
async function chunkUpload(file, onProgress, signal) {
  const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
  const chunks = Math.ceil(file.size / chunkSize);
  
  for (let i = 0; i < chunks; i++) {
    if (signal.aborted) throw new Error('AbortError');
    
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    await uploadChunk(chunk, i, chunks, file.name);
    onProgress(Math.round(((i + 1) / chunks) * 100));
  }
  
  return { success: true };
}
```

### 并发控制

```tsx
function BatchUpload() {
  return (
    <UploadButton
      uploadFunction={uploadFunction}
      maxConcurrent={2} // 限制并发数，避免服务器压力
      multiple={true}
      onUploadProgress={(progress) => {
        // 监控上传队列状态
        const stats = {
          uploading: progress.filter(p => p.status === 'uploading').length,
          completed: progress.filter(p => p.status === 'completed').length,
          failed: progress.filter(p => p.status === 'error').length,
        };
        console.log('上传统计:', stats);
      }}
    >
      批量上传
    </UploadButton>
  );
}
```

## 🔧 最佳实践

### 1. 错误处理

```tsx
const robustUpload = async ({ file, onProgress, signal }) => {
  try {
    // 预检查
    if (file.size > 50 * 1024 * 1024) {
      return { success: false, error: '文件大小不能超过50MB' };
    }

    // 文件类型验证
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: '不支持的文件类型' };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
      timeout: 60000, // 60秒超时
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error; // 保留取消错误
    }
    
    // 友好的错误信息
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: '上传超时，请检查网络连接' };
    }
    
    if (error.response?.status === 413) {
      return { success: false, error: '文件太大，服务器拒绝处理' };
    }
    
    if (error.response?.status >= 500) {
      return { success: false, error: '服务器错误，请稍后重试' };
    }
    
    return { 
      success: false, 
      error: error.response?.data?.message || '上传失败，请重试' 
    };
  }
};
```

### 2. 进度监控

```tsx
function AdvancedProgressTracking() {
  const [uploadStats, setUploadStats] = useState({
    totalFiles: 0,
    completedFiles: 0,
    failedFiles: 0,
    totalBytes: 0,
    uploadedBytes: 0,
    speed: 0, // bytes per second
    remainingTime: 0, // seconds
  });

  const handleProgress = useCallback((progress: UploadProgress[]) => {
    const totalFiles = progress.length;
    const completedFiles = progress.filter(p => p.status === 'completed').length;
    const failedFiles = progress.filter(p => p.status === 'error').length;
    
    // 计算总体进度
    const totalProgress = progress.reduce((sum, p) => sum + p.progress, 0);
    const avgProgress = totalFiles > 0 ? totalProgress / totalFiles : 0;
    
    setUploadStats(prev => ({
      ...prev,
      totalFiles,
      completedFiles,
      failedFiles,
      progress: avgProgress,
    }));
  }, []);

  return (
    <div>
      <UploadButton
        uploadFunction={uploadFunction}
        onUploadProgress={handleProgress}
        multiple={true}
      >
        上传文件
      </UploadButton>
      
      <div className="upload-stats">
        <p>总进度: {uploadStats.progress.toFixed(1)}%</p>
        <p>文件: {uploadStats.completedFiles}/{uploadStats.totalFiles}</p>
        {uploadStats.failedFiles > 0 && (
          <p style={{ color: 'red' }}>失败: {uploadStats.failedFiles}</p>
        )}
      </div>
    </div>
  );
}
```

### 3. 国际化支持

```tsx
const messages = {
  'zh-CN': {
    uploadButton: '上传文件',
    selectFiles: '选择文件',
    dragFilesHere: '拖拽文件到这里',
    uploading: '正在上传...',
    completed: '上传完成',
    failed: '上传失败',
    cancelled: '已取消',
  },
  'en-US': {
    uploadButton: 'Upload Files',
    selectFiles: 'Select Files',
    dragFilesHere: 'Drag files here',
    uploading: 'Uploading...',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
  },
};

function I18nUpload({ locale = 'zh-CN' }) {
  const t = messages[locale];
  
  return (
    <UploadButton uploadFunction={uploadFunction}>
      {t.uploadButton}
    </UploadButton>
  );
}
```

## 🐛 故障排除

### 常见问题

**Q: 上传进度条不显示？**
A: 确保你的上传函数正确调用了 `onProgress` 回调：
```tsx
onUploadProgress: (progressEvent) => {
  if (progressEvent.total) {
    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    onProgress(percent); // 这里是关键
  }
}
```

**Q: 取消上传不生效？**
A: 确保在上传函数中正确处理 `signal`：
```tsx
const response = await axios.post('/api/upload', formData, {
  signal, // 传递 AbortSignal
  // ...
});
```

**Q: 文件类型限制不生效？**
A: 检查文件类型格式，应该包含点号：
```tsx
acceptedFileTypes={['.jpg', '.png']} // ✅ 正确
acceptedFileTypes={['jpg', 'png']}   // ❌ 错误
```

**Q: 样式不生效？**
A: 确保导入了CSS文件：
```tsx
import 'react-progress-uploader/dist/style.css';
```

**Q: TypeScript 类型错误？**
A: 确保安装了类型定义：
```bash
npm install @types/react @types/react-dom
```

### 调试技巧

```tsx
// 开启调试模式
const debugUpload = async ({ file, onProgress, signal }) => {
  console.log('开始上传:', file.name, file.size);
  
  try {
    const result = await yourUploadFunction({ file, onProgress, signal });
    console.log('上传结果:', result);
    return result;
  } catch (error) {
    console.error('上传错误:', error);
    throw error;
  }
};
```

## 📱 浏览器兼容性

| 浏览器 | 最低版本 | 说明 |
|--------|----------|------|
| Chrome | 61+ | 完全支持 |
| Firefox | 60+ | 完全支持 |
| Safari | 12+ | 完全支持 |
| Edge | 79+ | 完全支持 |
| IE | 不支持 | 需要 polyfill |

### Polyfills

如需支持更低版本浏览器，请添加以下 polyfills：

```bash
npm install core-js whatwg-fetch abortcontroller-polyfill
```

```js
// 在应用入口添加
import 'core-js/stable';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
```

## 🤝 贡献

欢迎贡献代码！请阅读[贡献指南](CONTRIBUTING.md)了解详情。

### 开发环境

```bash
# 克隆仓库
git clone https://github.com/zhengliu92/React-progress-uploader.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行 Storybook
npm run storybook

# 构建产品版本
npm run build
```

## 📄 许可证

[MIT License](LICENSE) © 2024

---

## 🙏 致谢

感谢所有贡献者和使用者的支持！

如果这个项目对你有帮助，请给个 ⭐️
