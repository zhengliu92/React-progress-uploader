# React Progress Uploader 故障排除指南

如果在使用 `react-progress-uploader` 时遇到页面不显示的问题，请按照以下步骤进行排查：

## 🚨 最常见问题：CSS样式未导入

### ❌ 错误的导入方式
```tsx
import { UploadButton } from 'react-progress-uploader';
// 缺少CSS导入！

function App() {
  return <UploadButton>上传文件</UploadButton>;
}
```

### ✅ 正确的导入方式
```tsx
import { UploadButton } from 'react-progress-uploader';
import 'react-progress-uploader/dist/style.css'; // 🚨 必须导入CSS

function App() {
  return <UploadButton>上传文件</UploadButton>;
}
```

## 🔧 完整的测试示例

创建一个最简单的测试页面来验证组件是否正常工作：

```tsx
// TestUploader.tsx
import React from 'react';
import { UploadButton } from 'react-progress-uploader';
import 'react-progress-uploader/dist/style.css';

export function TestUploader() {
  const handleFileSelection = (files: File[]) => {
    console.log('选择的文件:', files);
    alert(`选择了 ${files.length} 个文件`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React Progress Uploader 测试</h1>
      
      {/* 最基础的测试 */}
      <div style={{ marginBottom: '20px' }}>
        <h2>基础文件选择测试</h2>
        <UploadButton onUpload={handleFileSelection}>
          选择文件
        </UploadButton>
      </div>

      {/* 样式测试 */}
      <div style={{ marginBottom: '20px' }}>
        <h2>样式变体测试</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <UploadButton variant="primary" onUpload={handleFileSelection}>
            Primary
          </UploadButton>
          <UploadButton variant="secondary" onUpload={handleFileSelection}>
            Secondary
          </UploadButton>
          <UploadButton variant="outline" onUpload={handleFileSelection}>
            Outline
          </UploadButton>
        </div>
      </div>

      {/* 尺寸测试 */}
      <div style={{ marginBottom: '20px' }}>
        <h2>尺寸测试</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <UploadButton size="small" onUpload={handleFileSelection}>
            Small
          </UploadButton>
          <UploadButton size="medium" onUpload={handleFileSelection}>
            Medium
          </UploadButton>
          <UploadButton size="large" onUpload={handleFileSelection}>
            Large
          </UploadButton>
        </div>
      </div>
    </div>
  );
}
```

## 🔍 排查步骤

### 1. 检查控制台错误
打开浏览器开发者工具（F12），查看控制台是否有错误信息：

```bash
# 常见错误信息：
- "Module not found: Can't resolve 'react-progress-uploader'"
- "Failed to load CSS"
- React Hook 相关错误
```

### 2. 检查网络面板
查看网络面板中CSS文件是否成功加载：
- 应该能看到 `style.css` 的请求
- 状态码应该是 200

### 3. 检查元素
在开发者工具中检查页面元素：
- 查看是否有 `.upload-button` 等CSS类名
- 检查是否有内联样式被应用

### 4. 版本兼容性检查

```bash
# 检查React版本
npm ls react react-dom

# 确保版本兼容：
# React >= 18.0.0
# react-dom >= 18.0.0
```

### 5. 依赖清理和重新安装

```bash
# 清理缓存并重新安装
rm -rf node_modules package-lock.json
npm install

# 或使用yarn
rm -rf node_modules yarn.lock
yarn install
```

## 🐛 已知问题和解决方案

### 问题1: CSS-in-JS 冲突
如果您使用了 styled-components、emotion 等CSS-in-JS库，可能会有样式冲突：

```tsx
// 解决方案：使用CSS Module导入
import styles from 'react-progress-uploader/dist/style.css';
```

### 问题2: Webpack配置问题
某些Webpack配置可能不支持CSS导入：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

### 问题3: Next.js 项目
在Next.js项目中，CSS应该在 `_app.tsx` 中导入：

```tsx
// pages/_app.tsx
import 'react-progress-uploader/dist/style.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### 问题4: Vite 项目
确保Vite配置正确处理CSS：

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: false, // 确保全局CSS可以正常加载
  },
});
```

## 🆘 仍然无法解决？

如果按照上述步骤仍然无法解决问题，请提供以下信息：

1. **React版本**: `npm ls react react-dom`
2. **构建工具**: Webpack/Vite/Create React App/Next.js
3. **错误信息**: 完整的控制台错误
4. **导入代码**: 您的实际导入代码
5. **项目结构**: 相关文件的目录结构

可以在GitHub Issues中提交问题，或者联系技术支持。

## 📝 最小复现示例

如果问题持续存在，请创建一个最小复现示例：

```bash
# 创建新的测试项目
npx create-react-app uploader-test
cd uploader-test

# 安装依赖
npm install react-progress-uploader

# 替换 src/App.js
```

```tsx
// src/App.js
import React from 'react';
import { UploadButton } from 'react-progress-uploader';
import 'react-progress-uploader/dist/style.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Uploader Test</h1>
        <UploadButton 
          onUpload={(files) => console.log(files)}
        >
          测试上传按钮
        </UploadButton>
      </header>
    </div>
  );
}

export default App;
```

如果这个最小示例可以正常工作，说明问题在您的项目配置中。 