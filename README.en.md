# React Progress Uploader

A feature-complete, type-safe React file upload component library that supports drag-and-drop uploads, real-time progress tracking, file type restrictions, upload cancellation, and more.

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 📚 Live Demo

**[View Live Demo & Documentation](https://zhengliu92.github.io/React-progress-uploader/)**

## 📦 Installation

```bash
npm install react-progress-uploader axios
```

## 🚀 Quick Start - Axios Upload Example

### Basic Usage

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
        signal, // Support cancellation
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
      if (axios.isCancel(error)) throw error; // Handle cancellation
      return {
        success: false,
        error: error.response?.data?.message || "Upload failed",
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
        console.log("Successfully uploaded files:", files);
        console.log("Upload results:", results);
      }}
      onUploadProgress={(progress) => {
        console.log("Upload progress:", progress);
      }}
    >
      Select Files to Upload
    </UploadButton>
  );
}
```

### Dialog Upload

```tsx
import { DialogUploader } from "react-progress-uploader";

function DialogUpload() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Upload</button>
      <DialogUploader
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        uploadFunction={axiosUploadFunction}
        multiple={true}
        maxFiles={10}
        acceptedFileTypes={[".jpg", ".png", ".pdf"]}
        maxFileSize={10 * 1024 * 1024}
        onUpload={(files, results) => {
          console.log("Dialog upload completed:", files);
        }}
      />
    </>
  );
}
```

### Drag & Drop Upload

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
        console.log("Drag & drop upload completed:", files);
      }}
    />
  );
}
```

## 📝 Core API

### Main Components

- `UploadButton` - Button-style upload component
- `DialogUploader` - Dialog upload component
- `Uploader` - Drag & drop area upload component

### Common Props

| Property            | Type               | Default      | Description                |
| ------------------- | ------------------ | ------------ | -------------------------- |
| `uploadFunction`    | `UploadFunction`   | **Required** | Axios upload function      |
| `multiple`          | `boolean`          | `true`       | Multi-file support         |
| `acceptedFileTypes` | `string[]`         | `undefined`  | File type restrictions     |
| `maxFiles`          | `number`           | `10`         | Maximum number of files    |
| `maxFileSize`       | `number`           | `undefined`  | File size limit (bytes)    |
| `maxConcurrent`     | `number`           | `3`          | Maximum concurrent uploads |
| `onUpload`          | `UploadCallback`   | `undefined`  | Completion callback        |
| `onUploadProgress`  | `ProgressCallback` | `undefined`  | Progress callback          |

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
<UploadButton
  uploadFunction={axiosUploadFunction}
  multiple={true}
  acceptedFileTypes={[".jpg", ".png", ".pdf"]} // Explicit file types
  maxFiles={5} // Reasonable limit
  maxFileSize={10 * 1024 * 1024} // 10MB size limit
  maxConcurrent={3} // 3 concurrent uploads
/>
```

## 📄 License

[MIT License](LICENSE) © 2024
