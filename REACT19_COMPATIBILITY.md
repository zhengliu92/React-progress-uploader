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

最后更新：2024年12月 