import React from "react";
import AxiosUploadExample from "./example-axios-upload";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AxiosUploadExample> = {
  title: "Examples/AxiosUploadExample",
  component: AxiosUploadExample,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
真实的Axios上传示例，展示了如何在实际项目中使用上传组件。

## 功能特点

- **真实HTTP请求**：向httpbin.org发送实际的上传请求
- **强健的错误处理**：包含文件大小限制、类型检查、超时设置
- **进度跟踪**：实时显示上传进度和状态
- **取消功能**：支持取消上传操作
- **日志系统**：记录上传历史和进度日志

## 上传函数示例

包含三种不同的上传函数实现：

1. **基本axios上传**：最简单的实现
2. **强健上传处理**：包含完整的错误处理和验证
3. **自定义API上传**：展示如何与自定义后端API集成

## 组件展示

- UploadButton组件的多种配置
- DialogUploader组件的使用
- 实时日志和状态显示
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AxiosUploadExample>;

export const FullExample: Story = {
  parameters: {
    docs: {
      description: {
        story: `
完整的Axios上传示例，包括：

- **基本上传**：使用httpbin.org作为测试端点
- **仅图片上传**：限制文件类型为图片格式
- **强健上传处理**：包含文件大小检查（10MB限制）、类型验证、错误处理
- **自定义对话框**：展示DialogUploader组件的使用
- **实时日志**：显示上传历史和进度日志

这是一个完整的生产级上传功能示例，可以直接在实际项目中使用。
        `,
      },
    },
  },
  render: () => <AxiosUploadExample />,
};
