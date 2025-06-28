# React Progress Uploader

A feature-complete, type-safe React file upload component library that supports drag-and-drop uploads, real-time progress tracking, file type restrictions, upload cancellation, and more.

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📚 Live Demo

**[View Live Demo & Documentation](https://zhengliu92.github.io/React-progress-uploader/)**

## 📦 Installation

```bash
npm install react-progress-uploader
```

## 🚀 Best Practices

### 1. Basic Upload (Recommended)

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
      multiple={true}
      acceptedFileTypes={['.jpg', '.png', '.pdf']}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024} // 10MB
      onUpload={(files, results) => {
        console.log('Upload completed:', files);
      }}
    >
      Select Files to Upload
    </UploadButton>
  );
}
```

### 2. Using Axios (Recommended for Production)

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
        error: error.response?.data?.message || 'Upload failed' 
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
      Upload Files
    </UploadButton>
  );
}
```

### 3. Dialog Upload

```tsx
import { DialogUploader } from 'react-progress-uploader';

function DialogUpload() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Upload</button>
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

### 4. File Selection Only (No Upload)

```tsx
function FileSelector() {
  const handleFileSelection = (files) => {
    console.log('Selected files:', files);
    // Handle file logic
  };

  return (
    <UploadButton
      onUpload={handleFileSelection}
      multiple={true}
      acceptedFileTypes={['.jpg', '.png']}
      maxFiles={5}
    >
      Select Files
    </UploadButton>
  );
}
```

## 📝 Core API

### UploadButton Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `uploadFunction` | `UploadFunction` | `undefined` | Upload function (optional) |
| `multiple` | `boolean` | `true` | Multi-file support |
| `acceptedFileTypes` | `string[]` | `undefined` | File type restrictions |
| `maxFiles` | `number` | `10` | Maximum number of files |
| `maxFileSize` | `number` | `undefined` | File size limit (bytes) |
| `onUpload` | `UploadCallback` | `undefined` | Completion callback |
| `onUploadProgress` | `ProgressCallback` | `undefined` | Progress callback |

### Upload Function Type

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

## 🎯 Recommended Configuration

```tsx
// Recommended setup
<UploadButton
  uploadFunction={uploadFunction}
  multiple={true}
  acceptedFileTypes={['.jpg', '.png', '.pdf']} // Explicit file types
  maxFiles={5}                                  // Reasonable limit
  maxFileSize={10 * 1024 * 1024}              // 10MB size limit
  maxConcurrent={3}                            // Concurrent uploads
/>
```

## 📄 License

[MIT License](LICENSE) © 2024 