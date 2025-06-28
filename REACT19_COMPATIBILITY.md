# React 19 兼容性指南

这个文档解释了如何在 React 19 中使用 react-progress-uploader 组件库。

## 支持的版本

从 v1.0.9 开始，react-progress-uploader 支持：
- React 18.x
- React 19.x

## React 19 中的变化

### 1. peerDependencies 更新
我们已经更新了 `peerDependencies` 以支持 React 19：

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### 2. TypeScript 支持
如果你使用 TypeScript，确保安装正确的类型定义：

```bash
# React 18
npm install @types/react@^18.0.0 @types/react-dom@^18.0.0

# React 19
npm install @types/react@^19.0.0 @types/react-dom@^19.0.0
```

### 3. JSX Transform
React 19 要求使用新的 JSX Transform。确保你的构建配置正确设置：

#### Vite 配置
```js
// vite.config.js
export default {
  esbuild: {
    jsx: 'automatic'
  }
}
```

#### TypeScript 配置
```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

## 升级步骤

### 从 React 18 升级到 React 19

1. **更新 React 版本：**
   ```bash
   npm install react@^19.0.0 react-dom@^19.0.0
   npm install @types/react@^19.0.0 @types/react-dom@^19.0.0
   ```

2. **更新组件库版本：**
   ```bash
   npm install react-progress-uploader@latest
   ```

3. **运行自动迁移工具（如果需要）：**
   ```bash
   npx types-react-codemod@latest preset-19 ./src
   ```

4. **测试你的应用程序**

## 已知问题和解决方案

### 问题 1: "Property 'children' does not exist"
如果你在升级后遇到此错误，这是因为 React 19 移除了隐式的 children 属性。

**解决方案：**
在你的组件接口中显式声明 children：

```typescript
// 之前
interface MyComponentProps {
  title: string;
}

// 现在
interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}
```

### 问题 2: forwardRef 相关警告
React 19 中 ref 可以作为普通属性传递，不再需要 forwardRef。

**解决方案：**
react-progress-uploader 已经处理了这个问题，无需额外操作。

## 性能优化

React 19 引入了自动编译器优化，这意味着：
- 自动的 memoization
- 更少的重新渲染
- 更好的性能

我们的组件库已经针对这些改进进行了优化。

## 支持

如果你在升级过程中遇到问题：

1. 检查 [GitHub Issues](https://github.com/zhengliu92/React-progress-uploader/issues)
2. 查阅 [React 19 升级指南](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
3. 提交新的 issue

## 版本对照表

| 组件库版本 | React 18 | React 19 |
|-----------|----------|----------|
| v1.0.8 及之前 | ✅ | ❌ |
| v1.0.9+ | ✅ | ✅ | 