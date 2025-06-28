import React from "react";
import { Demo } from "./Demo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Demo> = {
  title: "Examples/Demo",
  component: Demo,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "完整的组件演示页面，展示了所有上传组件的功能和用法示例。包含真实上传、模拟上传、不同配置选项等多种场景。",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Demo>;

export const FullDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: `
完整的演示页面，包括：

- **真实上传示例**：使用axios向httpbin.org发送实际HTTP请求
- **模拟慢速上传**：用于测试取消功能和进度显示
- **直接上传区域**：展示不同的文件类型限制和配置
- **按钮状态演示**：展示不同样式、尺寸和状态的按钮
- **上传历史和进度日志**：实时显示上传状态和结果

这个演示页面是测试和展示上传组件功能的完整示例。
        `,
      },
    },
  },
  render: () => <Demo />,
};
