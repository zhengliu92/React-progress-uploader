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

## 🔧 Recent Updates (v1.1.4)

### 🆕 New Features

- 🎯 **Brand New SimpleUploadButton Component** - Lightweight one-click file selection with floating progress card
  - ✨ **Instant Upload** - Start uploading immediately after file selection, no additional dialogs needed
  - 🎨 **Floating Progress Card** - Elegant bottom-right floating progress display with minimize and expand options
  - 🌈 **6 Theme Modes** - Choose from light, dark, blue, green, purple, orange themes
  - 📱 **Responsive Design** - Adaptive display for both mobile and desktop
- 🎨 **Custom Button Colors** - Support `backgroundColor`, `color`, `borderColor` properties for quick button appearance customization
- 🎯 **Optional Button Icons** - New `showIcon` and `icon` properties to hide icons or use custom icons
- 🌈 **New Custom Variant** - Provides more flexible custom styling support
- 📖 **Bilingual Documentation** - Complete Chinese and English README with examples

### Bug Fixes

- ✅ **Fixed FloatingUploadCard theme consistency** - Default light theme now uses unified blue color scheme
- ✅ **Fixed duplicate file list display** - Files no longer appear twice in DialogUploader
- ✅ **Fixed duplicate upload buttons** - Removed duplicate "Start Upload" buttons in DialogUploader
- ✅ **Fixed cancelled status icon display** - Cancelled status now correctly shows horizontal line icon
- ✅ **Fixed icon color inheritance** - Icons now properly inherit button colors
- ✅ **Improved Windows compatibility** - Use `rimraf` instead of `rm` command for better Windows support

### Technical Improvements

- 🚀 **Added hideActions property** - Uploader component supports hiding button area for more flexible integration
- 📱 **Comprehensive Mobile Optimization** - 44px touch targets, 16px minimum fonts, safe area adaptation, responsive layouts, and 8 systematic mobile improvements
- 📦 **Optimized build process** - Improved build experience on Windows systems
- 🔍 **Better type safety** - Enhanced TypeScript type definitions
- 📚 **Enhanced Storybook examples** - Added comprehensive demos for icon options and custom colors

## 📱 Mobile Optimization

React Progress Uploader has been comprehensively optimized for mobile devices, ensuring an excellent user experience across all mobile platforms:

### 🎯 Touch Target Optimization
- **44px Minimum Touch Area** - All clickable elements comply with iOS and Android HIG standards
- **Enhanced Button Areas** - Proper padding and min-width/min-height ensure easy tapping
- **Accidental Touch Prevention** - Reasonable spacing prevents unintended adjacent button triggers

### 📝 Typography Optimization
- **Minimum 16px Fonts** - Prevents iOS Safari from auto-zooming the page
- **Progressive Font Sizing** - Dynamic text size adjustment based on screen dimensions
- **High Contrast Display** - Ensures text clarity and readability on small screens

### 📐 Responsive Layout
- **Multi-Breakpoint Support** - Optimized for super small screens (≤360px), small phones (≤480px), medium phones (640px-768px), tablets (768px-1024px)
- **Smart Spacing Adjustment** - Screen size-based padding and margin optimization
- **Content Adaptation** - File lists, progress bars, and other elements optimized for mobile display

### 🔄 Landscape Support
- **Landscape Mode Optimization** - Dedicated `@media (orientation: landscape)` queries
- **Low Height Screen Adaptation** - Special handling for `max-height: 600px` scenarios
- **Content Reflow** - Automatic layout adjustment in landscape mode for optimal screen utilization

### 📱 Safe Area Adaptation
- **Notched Screen Support** - Uses `env(safe-area-inset-*)` for iPhone X series and similar devices
- **Gesture Area Avoidance** - FloatingUploadCard intelligently avoids system gesture areas
- **Full-Screen Optimization** - Ensures important content isn't obscured by system UI

### 🎨 Progress Display Optimization
- **Mobile Progress Bars** - Clear progress display on small screens
- **Status Icon Scaling** - Appropriately sized icons for better mobile visibility
- **Floating Card Positioning** - Smart positioning to avoid covering important content

### ✋ Gesture Experience
- **Touch Event Optimization** - Proper touch event handling for smooth interactions
- **Hover State Adaptation** - Appropriate hover effect handling on touch devices
- **Drag Gesture Enhancement** - Optimized file drag-and-drop experience on mobile

### 🔧 Compatibility Assurance
- **iOS Safari Optimization** - Specific optimizations for known iOS device issues
- **Android Browser Support** - Consistent experience across various Android browsers
- **Progressive Enhancement** - Core functionality available on all devices, advanced features progressively enhanced

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

### Simple Button Upload (Recommended)

```tsx
import { SimpleUploadButton } from "react-progress-uploader";

function SimpleUpload() {
  return (
    <SimpleUploadButton
      uploadFunction={axiosUploadFunction}
      multiple={true}
      acceptedFileTypes={[".jpg", ".png", ".pdf"]}
      maxFiles={5}
      maxFileSize={10 * 1024 * 1024}
      showFloatingCard={true}
      floatingCardTheme="light"
      onUpload={(files, results) => {
        console.log("Simple upload completed:", files);
      }}
      onUploadProgress={(progress) => {
        console.log("Upload progress:", progress);
      }}
    >
      Select Files
    </SimpleUploadButton>
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

### Floating Card Theme Examples

```tsx
import { SimpleUploadButton } from "react-progress-uploader";

function ThemeExamples() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {/* Light Theme */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="light"
        backgroundColor="#3b82f6"
        color="white"
      >
        Light Theme
      </SimpleUploadButton>

      {/* Dark Theme */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="dark"
        backgroundColor="#1f2937"
        color="white"
      >
        Dark Theme
      </SimpleUploadButton>

      {/* Blue Theme */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="blue"
        backgroundColor="#0ea5e9"
        color="white"
      >
        Blue Theme
      </SimpleUploadButton>

      {/* Green Theme */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="green"
        backgroundColor="#10b981"
        color="white"
      >
        Green Theme
      </SimpleUploadButton>

      {/* Purple Theme */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="purple"
        backgroundColor="#8b5cf6"
        color="white"
      >
        Purple Theme
      </SimpleUploadButton>

      {/* Orange Theme */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="orange"
        backgroundColor="#f59e0b"
        color="white"
      >
        Orange Theme
      </SimpleUploadButton>
    </div>
  );
}
```

## 📝 Core API

### Main Components

- `SimpleUploadButton` - Simple button upload component (Recommended)
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

### SimpleUploadButton Specific Props

| Property              | Type                                                              | Default   | Description                      |
| --------------------- | ----------------------------------------------------------------- | --------- | -------------------------------- |
| `showFloatingCard`    | `boolean`                                                         | `true`    | Whether to show floating card    |
| `floatingCardTheme`   | `"light" \| "dark" \| "blue" \| "green" \| "purple" \| "orange"` | `"light"` | Floating card theme              |
| `variant`             | `"primary" \| "secondary" \| "outline" \| "custom"`              | `primary` | Button variant                   |
| `size`                | `"small" \| "medium" \| "large"`                                  | `medium`  | Button size                      |
| `backgroundColor`     | `string`                                                          | -         | Custom background color          |
| `color`               | `string`                                                          | -         | Custom text color                |
| `borderColor`         | `string`                                                          | -         | Custom border color              |
| `showIcon`            | `boolean`                                                         | `true`    | Whether to show icon             |
| `icon`                | `React.ReactNode`                                                 | -         | Custom icon                      |

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
