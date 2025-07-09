import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SimpleUploadButton } from "./SimpleUploadButton";
import {
  mockUploadFunctions,
  fileTypeConfigs,
  fileSizeLimits,
  commonArgTypes,
  commonParameters,
} from "../../stories/story-utils";

const meta: Meta<typeof SimpleUploadButton> = {
  title: "Components/SimpleUploadButton",
  component: SimpleUploadButton,
  parameters: commonParameters,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "custom"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    showFloatingCard: {
      control: "boolean",
      description: "是否显示浮动上传卡片",
    },
    showIcon: {
      control: "boolean",
      description: "是否显示图标",
    },
    floatingCardTheme: {
      control: "select",
      options: ["light", "dark", "blue", "green", "purple", "orange"],
      description: "浮动卡片主题",
    },
    multiple: { control: "boolean" },
    disabled: { control: "boolean" },
    acceptedFileTypes: { control: "object" },
    maxFiles: { control: "number" },
    maxFileSize: { control: "number" },
    maxConcurrent: { control: "number" },
  },
  args: {
    uploadFunction: mockUploadFunctions.standard,
    onUpload: (files, results) => {
      console.log("Upload completed:", files, results);
    },
    onUploadProgress: (progress) => {
      console.log("Upload progress:", progress);
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "选择文件上传",
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images.concat(fileTypeConfigs.documents),
    maxFiles: 5,
    maxFileSize: fileSizeLimits.large,
    showFloatingCard: true,
    floatingCardTheme: "light",
  },
};

export const SingleFile: Story = {
  args: {
    children: "选择单个文件",
    multiple: false,
    acceptedFileTypes: fileTypeConfigs.images,
    maxFiles: 1,
    showFloatingCard: true,
  },
};

export const Secondary: Story = {
  args: {
    children: "选择文档",
    variant: "secondary",
    acceptedFileTypes: fileTypeConfigs.documents,
    multiple: true,
    maxFiles: 3,
    showFloatingCard: true,
  },
};

export const Outline: Story = {
  args: {
    children: "选择图片",
    variant: "outline",
    acceptedFileTypes: fileTypeConfigs.images,
    multiple: true,
    maxFiles: 10,
    showFloatingCard: true,
  },
};

export const MultipleFilesWithCard: Story = {
  args: {
    children: "多文件上传（显示卡片）",
    showFloatingCard: true,
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images.concat(fileTypeConfigs.documents),
    maxFiles: 8,
    maxFileSize: fileSizeLimits.large,
    maxConcurrent: 3,
  },
  parameters: {
    docs: {
      description: {
        story: "支持多文件上传，右下角显示浮动进度卡片，支持展开/收起和最小化。",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    children: "深色主题上传",
    showFloatingCard: true,
    floatingCardTheme: "dark",
    variant: "custom",
    backgroundColor: "#1f2937",
    color: "white",
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images.concat(fileTypeConfigs.documents),
    maxFiles: 8,
    maxFileSize: fileSizeLimits.large,
    uploadFunction: mockUploadFunctions.standard,
  },
  parameters: {
    docs: {
      description: {
        story: "深色主题的浮动卡片，适合暗色界面或夜间模式。具有深色背景和高对比度文字。",
      },
    },
  },
};

export const BlueTheme: Story = {
  args: {
    children: "蓝色主题上传",
    showFloatingCard: true,
    floatingCardTheme: "blue",
    variant: "custom",
    backgroundColor: "#2563eb",
    color: "white",
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images,
    maxFiles: 6,
    uploadFunction: mockUploadFunctions.fast,
  },
  parameters: {
    docs: {
      description: {
        story: "蓝色主题的浮动卡片，清新专业的设计风格，适合商务或科技类应用。",
      },
    },
  },
};

export const GreenTheme: Story = {
  args: {
    children: "绿色主题上传",
    showFloatingCard: true,
    floatingCardTheme: "green",
    variant: "custom",
    backgroundColor: "#10b981",
    color: "white",
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images,
    maxFiles: 6,
    uploadFunction: mockUploadFunctions.reliable,
  },
  parameters: {
    docs: {
      description: {
        story: "绿色主题的浮动卡片，自然友好的设计，适合环保、健康或教育类应用。",
      },
    },
  },
};

export const PurpleTheme: Story = {
  args: {
    children: "紫色主题上传",
    showFloatingCard: true,
    floatingCardTheme: "purple",
    variant: "custom",
    backgroundColor: "#8b5cf6",
    color: "white",
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images,
    maxFiles: 6,
    uploadFunction: mockUploadFunctions.slow,
  },
  parameters: {
    docs: {
      description: {
        story: "紫色主题的浮动卡片，优雅高端的设计风格，适合创意、艺术或高端品牌应用。",
      },
    },
  },
};

export const OrangeTheme: Story = {
  args: {
    children: "橙色主题上传",
    showFloatingCard: true,
    floatingCardTheme: "orange",
    variant: "custom",
    backgroundColor: "#f59e0b",
    color: "white",
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images,
    maxFiles: 6,
    uploadFunction: mockUploadFunctions.unreliable,
  },
  parameters: {
    docs: {
      description: {
        story: "橙色主题的浮动卡片，温暖活力的设计风格，适合活动、娱乐或社交类应用。",
      },
    },
  },
};

export const ThemeComparison: Story = {
  render: () => (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
      gap: "16px",
      padding: "16px" 
    }}>
      <div style={{ textAlign: "center" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#374151" }}>Light 主题</h4>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="light"
          variant="primary"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={3}
        >
          选择文件 (Light)
        </SimpleUploadButton>
      </div>
      
      <div style={{ textAlign: "center" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#374151" }}>Dark 主题</h4>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="dark"
          variant="custom"
          backgroundColor="#1f2937"
          color="white"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={3}
        >
          选择文件 (Dark)
        </SimpleUploadButton>
      </div>
      
      <div style={{ textAlign: "center" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#374151" }}>Blue 主题</h4>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="blue"
          variant="custom"
          backgroundColor="#2563eb"
          color="white"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={3}
        >
          选择文件 (Blue)
        </SimpleUploadButton>
      </div>
      
      <div style={{ textAlign: "center" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#374151" }}>Green 主题</h4>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="green"
          variant="custom"
          backgroundColor="#10b981"
          color="white"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={3}
        >
          选择文件 (Green)
        </SimpleUploadButton>
      </div>
      
      <div style={{ textAlign: "center" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#374151" }}>Purple 主题</h4>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="purple"
          variant="custom"
          backgroundColor="#8b5cf6"
          color="white"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={3}
        >
          选择文件 (Purple)
        </SimpleUploadButton>
      </div>
      
      <div style={{ textAlign: "center" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#374151" }}>Orange 主题</h4>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="orange"
          variant="custom"
          backgroundColor="#f59e0b"
          color="white"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={3}
        >
          选择文件 (Orange)
        </SimpleUploadButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "所有主题的对比展示。每个按钮都会显示对应主题的浮动卡片。点击任意按钮上传文件来查看不同主题的浮动卡片效果。",
      },
    },
  },
};

export const ThemeInContext: Story = {
  render: () => (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "32px",
      padding: "24px" 
    }}>
      {/* 模拟不同应用场景 */}
      <div style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        padding: "24px", 
        borderRadius: "12px",
        color: "white"
      }}>
        <h3 style={{ margin: "0 0 16px 0" }}>🌙 暗色应用场景</h3>
        <p style={{ margin: "0 0 16px 0", opacity: 0.9 }}>适合夜间模式或暗色主题的应用</p>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="dark"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={5}
          variant="custom"
          backgroundColor="#1f2937"
          color="white"
        >
          上传夜间照片
        </SimpleUploadButton>
      </div>
      
      <div style={{ 
        background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)", 
        padding: "24px", 
        borderRadius: "12px",
        color: "#0c4a6e"
      }}>
        <h3 style={{ margin: "0 0 16px 0" }}>💼 商务应用场景</h3>
        <p style={{ margin: "0 0 16px 0", opacity: 0.8 }}>适合企业级应用或专业工具</p>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.reliable}
          showFloatingCard={true}
          floatingCardTheme="blue"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.documents}
          maxFiles={8}
          maxFileSize={fileSizeLimits.large}
          variant="custom"
          backgroundColor="#2563eb"
          color="white"
        >
          上传商务文档
        </SimpleUploadButton>
      </div>
      
      <div style={{ 
        background: "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)", 
        padding: "24px", 
        borderRadius: "12px",
        color: "#14532d"
      }}>
        <h3 style={{ margin: "0 0 16px 0" }}>🌿 环保应用场景</h3>
        <p style={{ margin: "0 0 16px 0", opacity: 0.8 }}>适合环保、健康或自然主题的应用</p>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.standard}
          showFloatingCard={true}
          floatingCardTheme="green"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={6}
          variant="custom"
          backgroundColor="#10b981"
          color="white"
        >
          上传自然照片
        </SimpleUploadButton>
      </div>
      
      <div style={{ 
        background: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)", 
        padding: "24px", 
        borderRadius: "12px",
        color: "#92400e"
      }}>
        <h3 style={{ margin: "0 0 16px 0" }}>🎉 活动应用场景</h3>
        <p style={{ margin: "0 0 16px 0", opacity: 0.8 }}>适合活动、娱乐或社交类应用</p>
        <SimpleUploadButton
          uploadFunction={mockUploadFunctions.fast}
          showFloatingCard={true}
          floatingCardTheme="orange"
          multiple={true}
          acceptedFileTypes={fileTypeConfigs.images}
          maxFiles={10}
          variant="custom"
          backgroundColor="#f59e0b"
          color="white"
        >
          上传活动照片
        </SimpleUploadButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "在不同应用场景中展示主题的实际效果。展示了如何根据应用的整体设计风格选择合适的浮动卡片主题。",
      },
    },
  },
};

export const WithoutFloatingCard: Story = {
  args: {
    children: "静默上传",
    showFloatingCard: false,
    multiple: true,
    acceptedFileTypes: fileTypeConfigs.images,
    maxFiles: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "禁用浮动卡片，上传进度通过回调函数处理。",
      },
    },
  },
};

export const CustomSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <SimpleUploadButton
        size="small"
        uploadFunction={mockUploadFunctions.fast}
        showFloatingCard={false}
      >
        小按钮
      </SimpleUploadButton>
      <SimpleUploadButton
        size="medium"
        uploadFunction={mockUploadFunctions.standard}
        showFloatingCard={false}
      >
        中按钮
      </SimpleUploadButton>
      <SimpleUploadButton
        size="large"
        uploadFunction={mockUploadFunctions.reliable}
        showFloatingCard={false}
      >
        大按钮
      </SimpleUploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "不同尺寸的上传按钮。",
      },
    },
  },
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <SimpleUploadButton
        uploadFunction={mockUploadFunctions.reliable}
        showFloatingCard={false}
        backgroundColor="#10b981"
        color="white"
      >
        绿色按钮
      </SimpleUploadButton>
      <SimpleUploadButton
        uploadFunction={mockUploadFunctions.unreliable}
        showFloatingCard={false}
        backgroundColor="#f59e0b"
        color="white"
      >
        橙色按钮
      </SimpleUploadButton>
      <SimpleUploadButton
        uploadFunction={mockUploadFunctions.slow}
        showFloatingCard={false}
        variant="outline"
        borderColor="#8b5cf6"
        color="#8b5cf6"
      >
        紫色边框
      </SimpleUploadButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "自定义颜色的上传按钮。",
      },
    },
  },
}; 