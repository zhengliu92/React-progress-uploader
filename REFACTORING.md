# React Uploader 重构说明

## 重构目的

为了提高代码的可维护性和复用性，我们将原本过大的组件重构为更小的、专注于特定功能的 custom hooks 和组件。

## 架构重构

### 原有架构问题
- `DialogUploader` 组件过大，包含了太多逻辑（600+ 行代码）
- 文件选择、上传队列管理、UI状态等逻辑耦合在一起
- 难以测试和复用

### 新架构

#### 1. Custom Hooks

**`useUploadQueue`** - 上传队列管理
- 管理上传进度和状态
- 处理并发上传控制
- 支持取消单个或全部上传
- 自动处理上传完成回调

```typescript
const {
  uploadProgress,
  isUploading,
  isCancelling,
  startUpload,
  cancelAllUploads,
  cancelSingleUpload,
  resetQueue,
} = useUploadQueue({
  uploadFunction,
  maxConcurrent: 3,
  onUploadProgress,
  onUploadComplete,
});
```

**`useFileSelection`** - 文件选择管理
- 文件选择、验证和去重
- 支持文件类型和大小限制
- 提供文件统计信息

```typescript
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
  maxFiles: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
});
```

**`useUploadUI`** - UI 工具函数
- 提供进度条颜色、状态图标等UI相关函数
- 文件大小格式化
- 上传统计信息计算

```typescript
const {
  getProgressColor,
  getStatusIconType,
  formatFileSize,
  getUploadStats,
  getStatusMessage,
  getOverallStatusTitle,
} = useUploadUI();
```

#### 2. 重构后的组件

**DialogUploader** (从 600+ 行减少到 400+ 行)
- 专注于UI渲染和用户交互
- 使用custom hooks处理业务逻辑
- 更容易理解和维护

**UploadButton**
- 添加了新的props支持（maxFiles、maxFileSize）
- 使用统一的类型定义

### 重构优势

#### 1. 代码可复用性
每个hook都可以在其他组件中独立使用：

```typescript
// 在自定义组件中使用上传队列
function MyCustomUploader() {
  const { startUpload, uploadProgress } = useUploadQueue({
    uploadFunction: myUploadFunction,
  });
  
  // 自定义UI...
}
```

#### 2. 更好的测试性
每个hook可以独立测试：

```typescript
// 测试文件选择逻辑
const { addFiles, selectedFiles } = useFileSelection({ multiple: true });
addFiles(mockFiles);
expect(selectedFiles).toHaveLength(2);
```

#### 3. 更清晰的关注点分离
- `useUploadQueue` - 上传逻辑
- `useFileSelection` - 文件管理 
- `useUploadUI` - UI展示
- `DialogUploader` - 组件组装和用户交互

#### 4. 更灵活的配置
新增了更多配置选项：

```typescript
<UploadButton
  maxFiles={5}
  maxFileSize={10 * 1024 * 1024} // 10MB
  uploadFunction={customUploadFunction}
/>
```

### 新增功能

1. **文件大小限制**: 支持设置单个文件的最大大小
2. **文件数量限制**: 支持设置最大文件数量
3. **文件验证**: 自动验证文件类型和大小
4. **错误提示**: 更友好的错误提示信息
5. **去重功能**: 自动去除重复选择的文件

### 使用示例

```typescript
import { UploadButton, useUploadQueue, useFileSelection } from 'react-uploader';

// 基本使用
<UploadButton
  uploadFunction={myUploadFunction}
  maxFiles={3}
  maxFileSize={5 * 1024 * 1024}
  acceptedFileTypes={['.jpg', '.png', '.pdf']}
  onUpload={(files, results) => console.log('完成', files, results)}
/>

// 自定义组件
function CustomUploader() {
  const { selectedFiles, addFiles } = useFileSelection({
    maxFiles: 5,
    acceptedFileTypes: ['.jpg', '.png']
  });
  
  const { startUpload, uploadProgress } = useUploadQueue({
    uploadFunction: myUploadFunction,
    maxConcurrent: 2
  });

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => e.target.files && addFiles(e.target.files)} 
      />
      <button onClick={() => startUpload(selectedFiles)}>
        开始上传
      </button>
      {/* 自定义进度显示 */}
    </div>
  );
}
```

### 向后兼容性

重构后的组件完全向后兼容，现有代码无需修改即可使用。

### 总结

通过这次重构，我们实现了：
- 代码模块化和可复用性
- 更好的测试性和可维护性  
- 更灵活的配置选项
- 更清晰的代码结构
- 保持了向后兼容性

这为后续功能扩展和维护提供了更好的基础。 