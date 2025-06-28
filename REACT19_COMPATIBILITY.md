# React 19 兼容性指南

本文档说明了 React Progress Uploader 在 React 19 中可能遇到的兼容性问题和解决方案。

## 可能导致白屏的原因

### 1. JSX Transform 问题

**问题：** React 19 强制要求新的 JSX Transform，旧的配置可能导致白屏。

**解决方案：**
确保你的构建配置使用了新的 JSX Transform：

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"  // ✅ 正确配置
  }
}
```

```javascript
// babel.config.js 或 .babelrc
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"  // ✅ 启用新的 JSX Transform
    }]
  ]
}
```

### 2. 错误处理变化

**问题：** React 19 改变了错误处理机制，错误不再重新抛出。

**解决方案：**
在根组件中添加错误处理：

```typescript
import { createRoot } from 'react-dom/client';

const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    console.error('Uncaught error:', error, errorInfo);
    // 上报错误到监控系统
  },
  onCaughtError: (error, errorInfo) => {
    console.error('Caught error:', error, errorInfo);
    // 处理被Error Boundary捕获的错误
  }
});
```

### 3. Strict Mode 变化

**问题：** React 19 的 Strict Mode 更加严格，可能暴露之前隐藏的问题。

**解决方案：**
- 确保所有 useEffect 的依赖项正确
- 避免在 render 中创建对象或函数
- 使用 useCallback 和 useMemo 优化性能

### 4. TypeScript 类型问题

**问题：** React 19 更新了类型定义，可能导致类型错误。

**解决方案：**
更新依赖：

```bash
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

## 测试 React 19 兼容性

### 1. 创建测试环境

```bash
# 创建新的测试分支
git checkout -b test-react19

# 升级 React
npm install react@^19.0.0 react-dom@^19.0.0

# 升级类型定义
npm install @types/react@^19.0.0 @types/react-dom@^19.0.0 --save-dev
```

### 2. 检查项目

运行以下检查：

```bash
# 构建检查
npm run build

# 类型检查
npx tsc --noEmit

# 测试
npm test
```

### 3. 常见问题排查

#### 白屏问题排查步骤：

1. **检查浏览器控制台错误**
   - 打开开发者工具
   - 查看 Console 和 Network 面板
   - 记录所有错误信息

2. **检查 React DevTools**
   - 安装 React DevTools 浏览器扩展
   - 检查组件树是否正常渲染

3. **临时回退测试**
   ```javascript
   // 临时添加错误边界进行调试
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error) {
       return { hasError: true };
     }

     componentDidCatch(error, errorInfo) {
       console.error('ErrorBoundary caught an error:', error, errorInfo);
     }

     render() {
       if (this.state.hasError) {
         return <h1>Something went wrong.</h1>;
       }
       return this.props.children;
     }
   }
   ```

## 推荐的升级步骤

1. **先升级到 React 18.3**
   ```bash
   npm install react@18.3.0 react-dom@18.3.0
   ```

2. **解决所有警告**
   - 查看控制台中的 deprecation warnings
   - 根据警告信息修复代码

3. **升级到 React 19**
   ```bash
   npm install react@^19.0.0 react-dom@^19.0.0
   ```

4. **全面测试**
   - 测试所有组件功能
   - 验证上传流程
   - 检查错误处理

## 本项目的特定注意事项

### 1. 文件上传功能
- 确保 `DataTransfer` API 在 React 19 中正常工作
- 测试拖拽上传功能
- 验证文件类型验证逻辑

### 2. hooks 兼容性
- `useUploadQueue` - 检查 useEffect 依赖项
- `useFileSelection` - 验证状态更新逻辑
- `useUploadUI` - 测试组合 hook 行为

### 3. 组件测试重点
- `Uploader` - 基础上传功能
- `DialogUploader` - 对话框交互
- `UploadButton` - 按钮组件行为

## 获得帮助

如果遇到问题：

1. 查看 [React 19 升级指南](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
2. 检查项目的 GitHub Issues
3. 在 React 社区寻求帮助

## 已知兼容性状态

- ✅ TypeScript 5.4+ 兼容
- ✅ Vite 5.2+ 兼容  
- ✅ Storybook 9.0+ 兼容
- ⚠️ 需要测试具体的 React 19 环境

## ⚠️ ReactCurrentDispatcher 错误

如果在 React 19 项目中使用本组件库时遇到以下错误：

```
Uncaught TypeError: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')
```

这是由于 **React 版本冲突** 导致的，下面是完整的解决方案：

## 🛠️ 解决方案

### 方案一：使用者项目配置（推荐）

#### 1. Vite 项目配置

在你的 React 19 项目的 `vite.config.js` 中添加：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 强制使用单一 React 实例
      'react': new URL('./node_modules/react', import.meta.url).pathname,
      'react-dom': new URL('./node_modules/react-dom', import.meta.url).pathname
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    // 预构建 React 相关依赖
    include: ['react', 'react-dom', 'react/jsx-runtime']
  }
})
```

#### 2. Webpack 项目配置

在你的 `webpack.config.js` 中添加：

```javascript
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  }
};
```

#### 3. Next.js 项目配置

在你的 `next.config.js` 中添加：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    };
    return config;
  },
}

module.exports = nextConfig
```

### 方案二：使用前检查

在导入组件前添加 React 检查：

```typescript
// 检查 React 是否正确加载
import React from 'react';

if (typeof React === 'undefined') {
  throw new Error('React is not available');
}

console.log('React version:', React.version);

// 然后导入组件
import { Uploader, DialogUploader, UploadButton } from 'react-progress-uploader';

function MyComponent() {
  return (
    <Uploader
      uploadUrl="/api/upload"
      onUploadComplete={(results) => {
        console.log('Upload completed:', results);
      }}
    />
  );
}
```

### 方案三：动态导入

使用动态导入延迟加载组件：

```typescript
import React, { Suspense, lazy } from 'react';

// 动态导入组件
const Uploader = lazy(() => 
  import('react-progress-uploader').then(module => ({ default: module.Uploader }))
);

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading uploader...</div>}>
      <Uploader uploadUrl="/api/upload" />
    </Suspense>
  );
}
```

## 🔍 问题诊断

### 检查 React 版本冲突

在你的项目中运行：

```bash
npm ls react react-dom
```

如果看到多个版本，说明有版本冲突。

### 检查组件库安装

```bash
# 重新安装组件库
npm uninstall react-progress-uploader
npm install react-progress-uploader@latest

# 或者使用具体版本
npm install react-progress-uploader@1.0.10
```

## 📦 package.json 配置

确保你的项目 `package.json` 中的 React 版本正确：

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-progress-uploader": "^1.0.10"
  }
}
```

## 🚀 最佳实践

### 1. 使用 peerDependencies

确保组件库使用 peerDependencies 而不是 dependencies：

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### 2. 错误边界

在使用组件的地方添加错误边界：

```typescript
import React, { ErrorBoundary } from 'react';

function UploaderErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<div>上传组件加载失败，请刷新页面重试</div>}
      onError={(error) => {
        console.error('Uploader error:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function MyComponent() {
  return (
    <UploaderErrorBoundary>
      <Uploader uploadUrl="/api/upload" />
    </UploaderErrorBoundary>
  );
}
```

### 3. 渐进式升级

如果问题持续存在，考虑渐进式升级：

```typescript
// 先在 React 18.3+ 中测试
npm install react@18.3.0 react-dom@18.3.0

// 测试通过后再升级到 React 19
npm install react@19.0.0 react-dom@19.0.0
```

## 🐛 已知问题

### React 19 Strict Mode

React 19 的 Strict Mode 更严格，可能会暴露一些之前隐藏的问题：

```typescript
// 如果遇到问题，可以临时禁用 Strict Mode 进行测试
function App() {
  return (
    // <React.StrictMode>  // 注释掉这行进行测试
      <MyComponent />
    // </React.StrictMode>
  );
}
```

### 服务端渲染 (SSR)

在 Next.js 或其他 SSR 环境中，确保组件只在客户端渲染：

```typescript
import { useEffect, useState } from 'react';

function ClientOnlyUploader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return <Uploader uploadUrl="/api/upload" />;
}
```

## 📞 获取帮助

如果以上方案都不能解决问题，请：

1. 检查浏览器控制台的完整错误信息
2. 提供你的项目配置文件 (vite.config.js, webpack.config.js 等)
3. 提供 package.json 中的依赖版本
4. 在 [GitHub Issues](https://github.com/zhengliu92/React-progress-uploader/issues) 中提交问题

## 📚 参考资料

- [React 19 升级指南](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Vite 库模式文档](https://vitejs.dev/guide/build.html#library-mode)
- [React 19 Breaking Changes](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#breaking-changes)

