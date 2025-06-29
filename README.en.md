# React Progress Uploader

<div align="center">

[![Language](https://img.shields.io/badge/Language-中文-red?style=flat-square)](README.md)
[![Language](https://img.shields.io/badge/Language-English-blue?style=flat-square)](README.en.md)

**🌍 Languages:** [🇨🇳 简体中文](README.md) • [🇺🇸 English](README.en.md)

</div>

A feature-complete, type-safe React file upload component library that supports drag-and-drop uploads, real-time progress tracking, file type restrictions, upload cancellation, and more.

<div align="center">

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

## 📚 Live Demo

**[View Live Demo & Documentation](https://zhengliu92.github.io/React-progress-uploader/)**

## 🔧 Recent Updates (v1.1.3)

### 🆕 New Features

- 🎨 **Custom Button Colors** - Support `backgroundColor`, `color`, `borderColor` properties for quick button appearance customization
- 🎯 **Optional Button Icons** - New `showIcon` and `icon` properties to hide icons or use custom icons
- 🌈 **New Custom Variant** - Provides more flexible custom styling support
- 📖 **Bilingual Documentation** - Complete Chinese and English README with examples

### Bug Fixes

- ✅ **Fixed duplicate file list display** - Files no longer appear twice in DialogUploader
- ✅ **Fixed duplicate upload buttons** - Removed duplicate "Start Upload" buttons in DialogUploader
- ✅ **Fixed cancelled status icon display** - Cancelled status now correctly shows horizontal line icon
- ✅ **Fixed icon color inheritance** - Icons now properly inherit button colors
- ✅ **Improved Windows compatibility** - Use `rimraf` instead of `rm` command for better Windows support

### Technical Improvements

- 🚀 **Added hideActions property** - Uploader component supports hiding button area for more flexible integration
- 📦 **Optimized build process** - Improved build experience on Windows systems
- 🔍 **Better type safety** - Enhanced TypeScript type definitions
- 📚 **Enhanced Storybook examples** - Added comprehensive demos for icon options and custom colors

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

### Custom Button Colors

```tsx
import { UploadButton } from "react-progress-uploader";

function CustomColorUpload() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {/* Method 1: Using color properties */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        backgroundColor='#10B981' // Green background
        color='white' // White text
        variant='custom'
      >
        Green Button
      </UploadButton>

      {/* Method 2: Using outline variant + custom border color */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        variant='outline'
        borderColor='#F59E0B' // Yellow border
        color='#F59E0B' // Yellow text
      >
        Yellow Border Button
      </UploadButton>

      {/* Method 3: Using style property for complete customization */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        style={{
          background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
          border: "none",
          color: "white",
          borderRadius: "20px",
        }}
      >
        Gradient Button
      </UploadButton>

      {/* Method 4: Dark theme */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        backgroundColor='#1F2937'
        color='#F9FAFB'
        style={{ borderRadius: "8px" }}
      >
        Dark Button
      </UploadButton>
    </div>
  );
}
```

### Custom Button Icons

```tsx
import { UploadButton } from "react-progress-uploader";

function CustomIconUpload() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {/* Default cloud icon */}
      <UploadButton uploadFunction={axiosUploadFunction}>
        Default Cloud Icon
      </UploadButton>

      {/* Hide icon */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        showIcon={false}
      >
        Text Only Button
      </UploadButton>

      {/* Emoji icons */}
      <UploadButton
        uploadFunction={axiosUploadFunction}
        icon='📤'
      >
        Send Files
      </UploadButton>

      <UploadButton
        uploadFunction={axiosUploadFunction}
        icon='🖼️'
      >
        Upload Images
      </UploadButton>

      <UploadButton
        uploadFunction={axiosUploadFunction}
        icon='📄'
      >
        Upload Documents
      </UploadButton>

      {/* Custom SVG icon */}
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
        Custom Icon
      </UploadButton>
    </div>
  );
}
```

### Custom Upload Control

```tsx
import { Uploader } from "react-progress-uploader";
import { useState } from "react";

function CustomControlUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  return (
    <div>
      {/* Use as file selection area only, hide built-in buttons */}
      <Uploader
        uploadFunction={axiosUploadFunction}
        multiple={true}
        acceptedFileTypes={[".jpg", ".png", ".pdf"]}
        hideActions={true} // Hide built-in buttons
        onFileSelect={(files) => {
          setSelectedFiles(Array.from(files));
        }}
      />

      {/* Custom upload control */}
      {selectedFiles.length > 0 && (
        <div>
          <p>{selectedFiles.length} files selected</p>
          <button
            onClick={() => {
              /* Custom upload logic */
            }}
          >
            Start Upload
          </button>
        </div>
      )}
    </div>
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

### UploadButton Component Specific Props

| Property          | Type              | Default     | Description                                                 |
| ----------------- | ----------------- | ----------- | ----------------------------------------------------------- |
| `variant`         | `string`          | `primary`   | Button variant: `primary`, `secondary`, `outline`, `custom` |
| `color`           | `string`          | `undefined` | Custom text color                                           |
| `backgroundColor` | `string`          | `undefined` | Custom background color                                     |
| `borderColor`     | `string`          | `undefined` | Custom border color (for outline variant)                   |
| `showIcon`        | `boolean`         | `true`      | Whether to show icon                                        |
| `icon`            | `React.ReactNode` | `undefined` | Custom icon (overrides default cloud icon)                  |

### Uploader Component Specific Props

| Property      | Type      | Default | Description                        |
| ------------- | --------- | ------- | ---------------------------------- |
| `hideActions` | `boolean` | `false` | Whether to hide upload button area |

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
