# React Progress Uploader

**Language / 语言:** [🇺🇸 English](./README.en.md) | [🇨🇳 中文](./README.md)

A feature-complete, type-safe React file upload component library that supports drag-and-drop uploads, real-time progress tracking, file type restrictions, upload cancellation, and more.

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Storybook](https://img.shields.io/badge/Storybook-📚-pink.svg)](https://zhengliu92.github.io/React-progress-uploader/)

## ✨ Features

- 🚀 **Plug & Play** - Zero configuration, ready to use with multiple upload methods
- 📊 **Real-time Progress** - Detailed upload progress and status tracking  
- ❌ **Smart Cancellation** - Support for individual file or batch upload cancellation
- 🎯 **Multi-file Support** - Batch uploads with configurable concurrency
- 🎨 **File Filtering** - Flexible file type and size restrictions
- 🖱️ **Drag Experience** - Native drag-and-drop support with excellent UX
- 🎛️ **Highly Customizable** - Multiple styles, sizes, and behavior configurations
- 📱 **Responsive Design** - Perfect support for mobile and desktop
- 🔒 **Type Safe** - Complete TypeScript support
- 🎪 **Multiple Components** - Button, dialog, and area upload components

## 📦 Installation

```bash
# Using npm
npm install react-progress-uploader

# Using yarn  
yarn add react-progress-uploader

# Using pnpm
pnpm add react-progress-uploader
```

### Optional Dependencies

If using axios for uploads:
```bash
npm install axios
```

## 🚀 Quick Start

> 📚 **Live Documentation & Demo**: [View Storybook](https://zhengliu92.github.io/React-progress-uploader/)

### Basic Usage

```tsx
import React from 'react';
import { UploadButton } from 'react-progress-uploader';

// Simplest usage
function BasicUpload() {
  const uploadFunction = async ({ file, onProgress, signal }) => {
    // Your upload logic
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      signal, // Support cancellation
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
        console.log('Upload completed:', files);
      }}
    >
      Select Files to Upload
    </UploadButton>
  );
}
```

### File Selection Only (No Upload)

When `uploadFunction` is not provided, the component works as a pure file selector:

```tsx
import React from 'react';
import { UploadButton } from 'react-progress-uploader';

function FileSelector() {
  const handleFileSelection = (files) => {
    console.log('User selected files:', files);
    // Handle selected files (e.g., preview, validation, save to state, etc.)
    files.forEach(file => {
      console.log(`File: ${file.name}, Size: ${file.size} bytes`);
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
      Select Files
    </UploadButton>
  );
}
```

This mode is perfect for scenarios like:
- 📁 File picker
- 🖼️ Image preview
- ✅ File validation
- 📋 File information collection
- 🔄 Custom upload logic

### Using axios

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
          // 'Authorization': `Bearer ${token}`, // Add authentication
        },
        signal, // Support upload cancellation
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
        throw error; // Re-throw cancellation error
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Upload failed',
      };
    }
  };

  return (
    <UploadButton
      uploadFunction={axiosUploadFunction}
      multiple={true}
      acceptedFileTypes={['.jpg', '.png', '.pdf']}
      onUpload={(successfulFiles, results) => {
        console.log(`Successfully uploaded ${successfulFiles.length} files`);
      }}
      onUploadProgress={(progress) => {
        const completed = progress.filter(p => p.status === 'completed').length;
        console.log(`Completed: ${completed}/${progress.length}`);
      }}
    >
      Upload Files
    </UploadButton>
  );
}
```

## 📚 Component API

### UploadButton

Quick integration button-style upload component.

```tsx
import { UploadButton } from 'react-progress-uploader';
```

#### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `uploadFunction` | `UploadFunction` | `undefined` | Upload function implementation (optional, works as file selector when not provided) |
| `children` | `ReactNode` | `"Upload Files"` | Button content |
| `variant` | `"primary" \| "secondary" \| "outline"` | `"primary"` | Button style |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Button size |
| `multiple` | `boolean` | `true` | Support multiple files |
| `acceptedFileTypes` | `string[]` | `undefined` | Allowed file types |
| `maxConcurrent` | `number` | `3` | Max concurrent uploads |
| `maxFiles` | `number` | `10` | Maximum number of files |
| `maxFileSize` | `number` | `undefined` | Max file size per file (bytes) |
| `disabled` | `boolean` | `false` | Whether disabled |
| `onUpload` | `UploadCallback` | `undefined` | Upload completion callback |
| `onUploadProgress` | `ProgressCallback` | `undefined` | Progress update callback |

### DialogUploader

Dialog-style upload component providing complete upload interface.

```tsx
import { DialogUploader } from 'react-progress-uploader';
```

#### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isOpen` | `boolean` | **Required** | Whether to show dialog |
| `onClose` | `() => void` | **Required** | Close dialog callback |
| `uploadFunction` | `UploadFunction` | `undefined` | Upload function implementation (optional, works as file selector when not provided) |
| `onUpload` | `UploadCallback` | `undefined` | Upload completion callback |
| `onUploadProgress` | `ProgressCallback` | `undefined` | Progress update callback |
| `multiple` | `boolean` | `true` | Support multiple files |
| `acceptedFileTypes` | `string[]` | `undefined` | Allowed file types |
| `maxConcurrent` | `number` | `3` | Max concurrent uploads |
| `maxFiles` | `number` | `10` | Maximum number of files |
| `maxFileSize` | `number` | `undefined` | Max file size per file (bytes) |

### Uploader

Basic drag-and-drop upload area component.

```tsx
import { Uploader } from 'react-progress-uploader';
```

#### Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `onFileSelect` | `(files: FileList) => void` | **Required** | File selection callback |
| `multiple` | `boolean` | `true` | Support multiple files |
| `acceptedFileTypes` | `string[]` | `undefined` | Allowed file types |

## 🔧 Hooks API

### useUploadQueue

File upload queue management hook.

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
  onUploadComplete: (files, results) => console.log('Completed:', files),
});
```

### useFileSelection

File selection and validation hook.

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

UI utility functions hook.

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

## 📝 Type Definitions

```typescript
// Upload function signature
type UploadFunction = (options: UploadOptions) => Promise<UploadResult>;

// Upload options
interface UploadOptions {
  file: File;
  onProgress: (progress: number) => void;
  signal: AbortSignal;
}

// Upload result
interface UploadResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Upload progress
interface UploadProgress {
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error" | "cancelled";
  error?: string;
}

// Callback functions
type UploadCallback = (successfulFiles: File[], results: UploadResult[]) => void;
type ProgressCallback = (progress: UploadProgress[]) => void;
```

## 🎯 Use Cases

### Image Upload

```tsx
function ImageUpload() {
  const imageUpload = async ({ file, onProgress, signal }) => {
    // Client-side image compression
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
      Upload Images
    </UploadButton>
  );
}
```

### Document Upload

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
        console.log(`Uploaded ${files.length} documents`);
      }}
    />
  );
}
```

### Cloud Storage Upload

```tsx
// Using Alibaba Cloud OSS
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
      error: error.message || 'Failed to upload to cloud storage',
    };
  }
};

// Using AWS S3
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
      error: error.message || 'S3 upload failed',
    };
  }
};
```

## 🎨 Style Customization

### CSS Variables

```css
:root {
  --upload-button-primary-bg: #3b82f6;
  --upload-button-primary-hover: #2563eb;
  --upload-button-border-radius: 8px;
  --upload-dialog-backdrop: rgba(0, 0, 0, 0.5);
  --upload-progress-color: #3b82f6;
}
```

### Custom Styles

```css
/* Custom button styles */
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

/* Custom dialog styles */
.dialog-uploader-content {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Custom progress bar */
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

## 🚀 Performance Optimization

### Large File Handling

```tsx
const optimizedUpload = async ({ file, onProgress, signal }) => {
  // File size check
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: `File size exceeds limit (${Math.round(maxSize / 1024 / 1024)}MB)`,
    };
  }

  // Use chunked upload for large files
  if (file.size > 10 * 1024 * 1024) { // 10MB+ use chunks
    return await chunkUpload(file, onProgress, signal);
  }

  // Regular upload
  return await regularUpload(file, onProgress, signal);
};

// Chunked upload implementation
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

### Concurrency Control

```tsx
function BatchUpload() {
  return (
    <UploadButton
      uploadFunction={uploadFunction}
      maxConcurrent={2} // Limit concurrency to avoid server pressure
      multiple={true}
      onUploadProgress={(progress) => {
        // Monitor upload queue status
        const stats = {
          uploading: progress.filter(p => p.status === 'uploading').length,
          completed: progress.filter(p => p.status === 'completed').length,
          failed: progress.filter(p => p.status === 'error').length,
        };
        console.log('Upload stats:', stats);
      }}
    >
      Batch Upload
    </UploadButton>
  );
}
```

## 🔧 Best Practices

### 1. Error Handling

```tsx
const robustUpload = async ({ file, onProgress, signal }) => {
  try {
    // Pre-checks
    if (file.size > 50 * 1024 * 1024) {
      return { success: false, error: 'File size cannot exceed 50MB' };
    }

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Unsupported file type' };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      signal,
      timeout: 60000, // 60 second timeout
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error; // Preserve cancellation error
    }
    
    // Friendly error messages
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: 'Upload timeout, please check network connection' };
    }
    
    if (error.response?.status === 413) {
      return { success: false, error: 'File too large, server rejected the request' };
    }
    
    if (error.response?.status >= 500) {
      return { success: false, error: 'Server error, please try again later' };
    }
    
    return { 
      success: false, 
      error: error.response?.data?.message || 'Upload failed, please try again' 
    };
  }
};
```

### 2. Progress Monitoring

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
    
    // Calculate overall progress
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
        Upload Files
      </UploadButton>
      
      <div className="upload-stats">
        <p>Overall Progress: {uploadStats.progress.toFixed(1)}%</p>
        <p>Files: {uploadStats.completedFiles}/{uploadStats.totalFiles}</p>
        {uploadStats.failedFiles > 0 && (
          <p style={{ color: 'red' }}>Failed: {uploadStats.failedFiles}</p>
        )}
      </div>
    </div>
  );
}
```

### 3. Internationalization Support

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

function I18nUpload({ locale = 'en-US' }) {
  const t = messages[locale];
  
  return (
    <UploadButton uploadFunction={uploadFunction}>
      {t.uploadButton}
    </UploadButton>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

**Q: Upload progress bar not showing?**
A: Make sure your upload function correctly calls the `onProgress` callback:
```tsx
onUploadProgress: (progressEvent) => {
  if (progressEvent.total) {
    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    onProgress(percent); // This is the key
  }
}
```

**Q: Upload cancellation not working?**
A: Ensure you handle the `signal` correctly in your upload function:
```tsx
const response = await axios.post('/api/upload', formData, {
  signal, // Pass AbortSignal
  // ...
});
```

**Q: File type restrictions not working?**
A: Check file type format, should include the dot:
```tsx
acceptedFileTypes={['.jpg', '.png']} // ✅ Correct
acceptedFileTypes={['jpg', 'png']}   // ❌ Wrong
```

**Q: Styles not working?**
A: Make sure to import the CSS file:
```tsx
import 'react-progress-uploader/dist/style.css';
```

**Q: TypeScript type errors?**
A: Make sure you have the type definitions installed:
```bash
npm install @types/react @types/react-dom
```

### Debugging Tips

```tsx
// Enable debug mode
const debugUpload = async ({ file, onProgress, signal }) => {
  console.log('Starting upload:', file.name, file.size);
  
  try {
    const result = await yourUploadFunction({ file, onProgress, signal });
    console.log('Upload result:', result);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

## 📱 Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 61+ | Full support |
| Firefox | 60+ | Full support |
| Safari | 12+ | Full support |
| Edge | 79+ | Full support |
| IE | Not supported | Requires polyfills |

### Polyfills

To support older browsers, add these polyfills:

```bash
npm install core-js whatwg-fetch abortcontroller-polyfill
```

```js
// Add to your app entry point
import 'core-js/stable';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
```

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) for details.

### Development Environment

```bash
# Clone the repository
git clone https://github.com/zhengliu92/React-progress-uploader.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run Storybook
npm run storybook

# Build for production
npm run build
```

## 📄 License

[MIT License](LICENSE) © 2024

---

## 🙏 Acknowledgments

Thanks to all contributors and users for their support!

If this project helped you, please give it a ⭐️ 