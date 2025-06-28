# React 上传组件库

一个功能完整的 React 文件上传组件库，支持拖拽上传、进度显示、文件类型限制、取消上传等特性。

## 特性

- 🚀 **真实上传**: 支持使用 axios 或自定义函数进行真实的文件上传
- 📊 **进度跟踪**: 实时显示上传进度和状态
- ❌ **取消功能**: 支持单个文件或全部文件的上传取消
- 🎯 **多文件上传**: 支持同时上传多个文件
- 🎨 **文件类型过滤**: 支持按文件扩展名限制上传类型
- 🖱️ **拖拽支持**: 支持拖拽文件到上传区域
- 🎛️ **灵活配置**: 多种按钮样式、尺寸和行为配置
- 🔄 **并发控制**: 可配置最大并发上传数量
- 🎪 **多种组件**: 提供按钮式和区域式两种上传组件

## 安装

```bash
npm install axios  # 如果使用 axios 上传
```

## 快速开始

### 1. 基本的 axios 上传

```tsx
import React from 'react';
import { UploadButton } from './components/UploadButton/UploadButton';
import axios from 'axios';

// 创建上传函数
const uploadFunction = async ({ file, onProgress, signal }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
      throw error; // 重新抛出取消错误，让组件处理
    }
    
    return {
      success: false,
      error: error.message || '上传失败',
    };
  }
};

// 使用组件
function App() {
  const handleUpload = (successfulFiles, results) => {
    console.log('成功上传的文件:', successfulFiles);
    console.log('上传结果:', results);
  };

  const handleProgress = (progress) => {
    console.log('上传进度:', progress);
  };

  return (
    <UploadButton
      uploadFunction={uploadFunction}
      onUpload={handleUpload}
      onUploadProgress={handleProgress}
      multiple={true}
      maxConcurrent={3}
    >
      上传文件
    </UploadButton>
  );
}
```

### 2. 高级配置示例

```tsx
import React from 'react';
import { UploadButton } from './components/UploadButton/UploadButton';
import { DialogUploader } from './components/DialogUploader/DialogUploader';
import axios from 'axios';

// 带有认证的上传函数
const authenticatedUpload = async ({ file, onProgress, signal }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }

    return {
      success: false,
      error: error.response?.data?.message || error.message || '上传失败',
    };
  }
};

function AdvancedUpload() {
  return (
    <div>
      {/* 图片上传按钮 */}
      <UploadButton
        variant="primary"
        uploadFunction={authenticatedUpload}
        acceptedFileTypes={['.jpg', '.jpeg', '.png', '.gif', '.webp']}
        multiple={true}
        maxConcurrent={2}
        onUpload={(files, results) => {
          console.log(`上传了 ${files.length} 张图片`);
        }}
        onUploadProgress={(progress) => {
          const uploading = progress.filter(p => p.status === 'uploading').length;
          if (uploading > 0) {
            console.log(`正在上传 ${uploading} 个文件`);
          }
        }}
      >
        上传图片
      </UploadButton>

      {/* 文档上传按钮 */}
      <UploadButton
        variant="outline"
        uploadFunction={authenticatedUpload}
        acceptedFileTypes={['.pdf', '.doc', '.docx', '.txt']}
        multiple={false}
        onUpload={(files, results) => {
          if (results[0].success) {
            alert('文档上传成功！');
          } else {
            alert(`上传失败: ${results[0].error}`);
          }
        }}
      >
        上传文档
      </UploadButton>
    </div>
  );
}
```

### 3. 自定义上传函数

```tsx
// 使用 fetch API 的上传函数
const fetchUpload = async ({ file, onProgress, signal }) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    return { success: false, error: error.message };
  }
};

// 使用云服务的上传函数示例（以阿里云 OSS 为例）
const ossUpload = async ({ file, onProgress, signal }) => {
  try {
    // 假设你有一个 OSS 客户端实例
    const result = await ossClient.put(file.name, file, {
      progress: (p) => {
        onProgress(Math.round(p * 100));
      },
    });

    return {
      success: true,
      data: { url: result.url },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || '上传到云存储失败',
    };
  }
};
```

## 组件 API

### UploadButton

用于快速集成的上传按钮组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `uploadFunction` | `(options: UploadOptions) => Promise<UploadResult>` | **必需** | 上传函数 |
| `children` | `React.ReactNode` | `"上传文件"` | 按钮文本 |
| `variant` | `"primary" \| "secondary" \| "outline"` | `"primary"` | 按钮样式 |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | 按钮尺寸 |
| `multiple` | `boolean` | `true` | 是否支持多文件选择 |
| `acceptedFileTypes` | `string[]` | `undefined` | 允许的文件类型 |
| `maxConcurrent` | `number` | `3` | 最大并发上传数 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `onUpload` | `(files: File[], results: UploadResult[]) => void` | `undefined` | 上传完成回调 |
| `onUploadProgress` | `(progress: UploadProgress[]) => void` | `undefined` | 进度更新回调 |

### DialogUploader

可自定义的对话框上传组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `isOpen` | `boolean` | **必需** | 是否显示对话框 |
| `onClose` | `() => void` | **必需** | 关闭对话框回调 |
| `uploadFunction` | `(options: UploadOptions) => Promise<UploadResult>` | **必需** | 上传函数 |
| `onUpload` | `(files: File[], results: UploadResult[]) => void` | `undefined` | 上传完成回调 |
| `onUploadProgress` | `(progress: UploadProgress[]) => void` | `undefined` | 进度更新回调 |
| `multiple` | `boolean` | `true` | 是否支持多文件选择 |
| `acceptedFileTypes` | `string[]` | `undefined` | 允许的文件类型 |
| `maxConcurrent` | `number` | `3` | 最大并发上传数 |

### Uploader

基础的拖拽上传区域组件。

#### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `onFileSelect` | `(files: FileList) => void` | **必需** | 文件选择回调 |
| `multiple` | `boolean` | `true` | 是否支持多文件选择 |
| `acceptedFileTypes` | `string[]` | `undefined` | 允许的文件类型 |

## 类型定义

```typescript
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
```

## 最佳实践

### 1. 错误处理

```tsx
const robustUpload = async ({ file, onProgress, signal }) => {
  try {
    // 文件大小检查
    if (file.size > 50 * 1024 * 1024) { // 50MB
      return {
        success: false,
        error: '文件大小不能超过 50MB',
      };
    }

    // 文件类型检查
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: '不支持的文件类型',
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
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

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    
    // 根据错误类型返回友好的错误信息
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: '上传超时，请重试' };
    }
    
    if (error.response?.status === 413) {
      return { success: false, error: '文件太大，服务器拒绝上传' };
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
function UploadWithProgress() {
  const [globalProgress, setGlobalProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
  });

  const handleProgress = (progress) => {
    // 计算全局进度
    const totalProgress = progress.reduce((sum, p) => sum + p.progress, 0);
    setGlobalProgress(Math.round(totalProgress / progress.length));

    // 统计各种状态的文件数量
    setUploadStats({
      total: progress.length,
      completed: progress.filter(p => p.status === 'completed').length,
      failed: progress.filter(p => p.status === 'error').length,
      cancelled: progress.filter(p => p.status === 'cancelled').length,
    });
  };

  return (
    <div>
      <UploadButton
        uploadFunction={uploadFunction}
        onUploadProgress={handleProgress}
        multiple={true}
      >
        批量上传
      </UploadButton>
      
      <div>
        <p>总进度: {globalProgress}%</p>
        <p>完成: {uploadStats.completed}/{uploadStats.total}</p>
        <p>失败: {uploadStats.failed}</p>
        <p>取消: {uploadStats.cancelled}</p>
      </div>
    </div>
  );
}
```

### 3. 文件预处理

```tsx
const preprocessUpload = async ({ file, onProgress, signal }) => {
  try {
    // 图片压缩示例
    if (file.type.startsWith('image/')) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(file);
      });
      
      // 设置压缩后的尺寸
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为 blob
      const compressedBlob = await new Promise(resolve => {
        canvas.toBlob(resolve, file.type, 0.8);
      });
      
      file = new File([compressedBlob], file.name, { type: file.type });
    }

    // 继续正常上传流程
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    return { success: false, error: error.message };
  }
};
```

## 样式自定义

组件使用 CSS 类名，你可以通过覆盖这些类名来自定义样式：

```css
/* 自定义按钮样式 */
.upload-button--primary {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.upload-button--primary:hover {
  background: linear-gradient(45deg, #5a67d8 0%, #6b46c1 100%);
}

/* 自定义对话框样式 */
.dialog-uploader-content {
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 自定义进度条样式 */
.dialog-uploader-progress-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}
```

## 开发和构建

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动 Storybook
npm run storybook
```

## 浏览器支持

- Chrome >= 61
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 许可证

MIT License
