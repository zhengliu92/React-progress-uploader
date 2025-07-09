# React Progress Uploader

<div align="center">

[![Language](https://img.shields.io/badge/Language-中文-red?style=flat-square)](README.md)
[![Language](https://img.shields.io/badge/Language-English-blue?style=flat-square)](README.en.md)

**🌍 Languages:** [🇨🇳 简体中文](README.md) • [🇺🇸 English](README.en.md)

</div>

一个功能完整、类型安全的 React 文件上传组件库，支持拖拽上传、实时进度显示、文件类型限制、取消上传等特性。

<div align="center">

[![npm version](https://badge.fury.io/js/react-progress-uploader.svg)](https://badge.fury.io/js/react-progress-uploader)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

## 📚 在线演示

**[查看实时演示和文档](https://zhengliu92.github.io/React-progress-uploader/)**

## 🔧 最近更新 (v1.1.4)

### 🆕 新功能

- 🎯 **全新 SimpleUploadButton 组件** - 轻量级的单击选择文件上传按钮，支持浮动进度卡片
  - ✨ **即时上传** - 选择文件后立即开始上传，无需额外对话框
  - 🎨 **浮动进度卡片** - 优雅的右下角悬浮进度显示，支持最小化和展开
  - 🌈 **6种主题模式** - light、dark、blue、green、purple、orange 主题任选
  - 📱 **响应式设计** - 自适应移动端和桌面端显示
- 🎨 **自定义按钮颜色** - 支持 `backgroundColor`、`color`、`borderColor` 属性快速自定义按钮外观
- 🎯 **可选按钮图标** - 新增 `showIcon` 和 `icon` 属性，支持隐藏图标或使用自定义图标
- 🌈 **新增 custom 变体** - 提供更灵活的自定义样式支持
- 📖 **双语文档支持** - 完整的中英文 README 和示例代码

### Bug 修复

- ✅ **修复 FloatingUploadCard 主题一致性** - 默认 light 主题现在使用统一的蓝色系配色方案
- ✅ **修复文件列表重复显示问题** - 在 DialogUploader 中，同一文件不再重复显示
- ✅ **修复重复上传按钮问题** - 移除了 DialogUploader 中的重复"开始上传"按钮
- ✅ **修复取消状态图标显示错误** - 取消状态现在正确显示水平线图标
- ✅ **修复图标颜色继承问题** - 图标现在正确继承按钮颜色
- ✅ **优化 Windows 兼容性** - 使用`rimraf`替代`rm`命令，确保在 Windows 系统上正常构建

### 技术改进

- 🚀 **新增 hideActions 属性** - Uploader 组件支持隐藏按钮区域，提供更灵活的集成方式
- 📦 **优化构建流程** - 改进 Windows 系统上的构建体验
- 🔍 **更好的类型安全** - 优化 TypeScript 类型定义
- 📚 **完善 Storybook 示例** - 新增图标选项和自定义颜色的完整演示

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

### 简单按钮上传（推荐）

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
        console.log("简单上传完成:", files);
      }}
      onUploadProgress={(progress) => {
        console.log("上传进度:", progress);
      }}
    >
      选择文件
    </SimpleUploadButton>
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

### 浮动卡片主题示例

```tsx
import { SimpleUploadButton } from "react-progress-uploader";

function ThemeExamples() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {/* Light 主题 */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="light"
        backgroundColor="#3b82f6"
        color="white"
      >
        Light 主题
      </SimpleUploadButton>

      {/* Dark 主题 */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="dark"
        backgroundColor="#1f2937"
        color="white"
      >
        Dark 主题
      </SimpleUploadButton>

      {/* Blue 主题 */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="blue"
        backgroundColor="#0ea5e9"
        color="white"
      >
        Blue 主题
      </SimpleUploadButton>

      {/* Green 主题 */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="green"
        backgroundColor="#10b981"
        color="white"
      >
        Green 主题
      </SimpleUploadButton>

      {/* Purple 主题 */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="purple"
        backgroundColor="#8b5cf6"
        color="white"
      >
        Purple 主题
      </SimpleUploadButton>

      {/* Orange 主题 */}
      <SimpleUploadButton
        uploadFunction={axiosUploadFunction}
        floatingCardTheme="orange"
        backgroundColor="#f59e0b"
        color="white"
      >
        Orange 主题
      </SimpleUploadButton>
    </div>
  );
}
```

## 📝 核心 API

### 主要组件

- `SimpleUploadButton` - 简单按钮上传组件（推荐）
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

### SimpleUploadButton 特有属性

| 属性                  | 类型                                                              | 默认值    | 描述                             |
| --------------------- | ----------------------------------------------------------------- | --------- | -------------------------------- |
| `showFloatingCard`    | `boolean`                                                         | `true`    | 是否显示浮动进度卡片             |
| `floatingCardTheme`   | `"light" \| "dark" \| "blue" \| "green" \| "purple" \| "orange"` | `"light"` | 浮动卡片主题                     |
| `variant`             | `"primary" \| "secondary" \| "outline" \| "custom"`              | `primary` | 按钮变体                         |
| `size`                | `"small" \| "medium" \| "large"`                                  | `medium`  | 按钮尺寸                         |
| `backgroundColor`     | `string`                                                          | -         | 自定义背景色                     |
| `color`               | `string`                                                          | -         | 自定义文字色                     |
| `borderColor`         | `string`                                                          | -         | 自定义边框色                     |
| `showIcon`            | `boolean`                                                         | `true`    | 是否显示图标                     |
| `icon`                | `React.ReactNode`                                                 | -         | 自定义图标                       |

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
