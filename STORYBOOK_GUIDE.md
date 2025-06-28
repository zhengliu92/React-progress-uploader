# Storybook 使用指南

本项目已配置Storybook来展示和测试所有上传组件。

## 🚀 启动Storybook

```bash
npm run storybook
```

Storybook将在 `http://localhost:6006` 启动。

## 📱 可用的Stories

### 1. 组件Stories (Components)

#### UploadButton
- **路径**: `Components/UploadButton`
- **描述**: 展示UploadButton组件的各种配置和用法
- **包含示例**:
  - Default: 默认上传按钮
  - SingleFile: 单文件上传
  - ImageUpload: 仅图片上传
  - DocumentUpload: 文档上传
  - Interactive: 交互式示例

#### DialogUploader
- **路径**: `Components/DialogUploader`
- **描述**: 展示弹窗式上传组件的功能
- **包含示例**:
  - Default: 默认弹窗上传
  - SingleFile: 单文件模式
  - ImageOnly: 仅图片上传
  - SlowUpload: 慢速上传（测试取消功能）
  - WithFileSizeLimit: 带文件大小限制

#### Uploader
- **路径**: `Components/Uploader`
- **描述**: 基础的拖拽上传区域组件

### 2. 示例Stories (Examples)

#### Demo
- **路径**: `Examples/Demo`
- **描述**: 完整的组件演示页面，展示所有功能
- **功能特点**:
  - 真实axios上传示例
  - 模拟慢速上传测试
  - 不同配置的上传区域
  - 按钮状态演示
  - 上传历史和日志

#### AxiosUploadExample
- **路径**: `Examples/AxiosUploadExample`
- **描述**: 生产级的axios上传示例
- **功能特点**:
  - 真实HTTP请求
  - 强健的错误处理
  - 文件类型和大小验证
  - 超时设置
  - 实时日志系统

## 🎯 推荐使用流程

1. **了解基础组件**: 先查看 `Components` 部分了解各个组件的基本用法
2. **查看完整示例**: 访问 `Examples/Demo` 查看所有组件的综合使用
3. **生产实现参考**: 查看 `Examples/AxiosUploadExample` 了解如何在实际项目中实现
4. **测试功能**: 使用 `SlowUpload` 和其他测试示例验证功能

## 🔧 开发和调试

- **交互式调试**: 使用Storybook的Controls面板调整组件属性
- **实时编辑**: 修改组件代码后Storybook会自动重新加载
- **文档查看**: 每个story都包含详细的文档说明
- **代码查看**: 可以查看每个示例的源代码

## 📋 功能测试清单

使用Storybook可以测试以下功能：

- [ ] 单文件和多文件上传
- [ ] 文件类型限制
- [ ] 文件大小限制
- [ ] 拖拽上传
- [ ] 上传进度显示
- [ ] 取消上传功能
- [ ] 错误处理
- [ ] 不同样式和尺寸
- [ ] 真实HTTP请求
- [ ] 并发上传控制

## 🎨 自定义Story

如需添加新的story，请参考现有文件结构：

```
src/
├── components/
│   └── [ComponentName]/
│       └── [ComponentName].stories.tsx
└── stories/
    └── [ExampleName].stories.tsx
```

每个story文件应包含：
- 组件的meta配置
- 多个使用场景的示例
- 详细的文档描述
- 交互式控件配置 