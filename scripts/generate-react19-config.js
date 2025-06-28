#!/usr/bin/env node

/**
 * React 19 配置生成器
 * 为不同的构建工具生成配置代码
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🔧 React 19 配置生成器");
console.log("这个工具将帮助你生成解决 ReactCurrentDispatcher 错误的配置\n");

const configs = {
  vite: {
    name: "Vite",
    file: "vite.config.js",
    content: `import { defineConfig } from 'vite'
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
})`,
  },

  webpack: {
    name: "Webpack",
    file: "webpack.config.js",
    content: `const path = require('path');

module.exports = {
  // ... 其他配置
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  }
};`,
  },

  nextjs: {
    name: "Next.js",
    file: "next.config.js",
    content: `const path = require('path');

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

module.exports = nextConfig`,
  },

  cra: {
    name: "Create React App",
    file: "config-overrides.js",
    content: `const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    'react': path.resolve('./node_modules/react'),
    'react-dom': path.resolve('./node_modules/react-dom')
  };
  
  return config;
};

// 同时需要安装 react-app-rewired 和 customize-cra:
// npm install --save-dev react-app-rewired customize-cra
// 
// 然后修改 package.json 中的 scripts:
// "start": "react-app-rewired start",
// "build": "react-app-rewired build",
// "test": "react-app-rewired test"`,
  },
};

const errorBoundaryTemplate = `import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class UploaderErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uploader component error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ef4444', 
          borderRadius: '8px',
          backgroundColor: '#fef2f2',
          color: '#dc2626'
        }}>
          <h3>上传组件加载失败</h3>
          <p>错误信息: {this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default UploaderErrorBoundary;

// 使用方法:
// import UploaderErrorBoundary from './UploaderErrorBoundary';
// import { Uploader } from 'react-progress-uploader';
//
// function MyComponent() {
//   return (
//     <UploaderErrorBoundary>
//       <Uploader uploadUrl="/api/upload" />
//     </UploaderErrorBoundary>
//   );
// }`;

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function main() {
  try {
    console.log("请选择你的构建工具:");
    console.log("1. Vite");
    console.log("2. Webpack");
    console.log("3. Next.js");
    console.log("4. Create React App (CRA)");
    console.log("5. 生成错误边界组件");
    console.log("6. 生成所有配置文件\n");

    const choice = await askQuestion("请输入选项编号 (1-6): ");

    if (choice === "6") {
      // 生成所有配置
      console.log("\n📁 生成所有配置文件...\n");

      Object.entries(configs).forEach(([key, config]) => {
        console.log(`📄 ${config.name} 配置 (${config.file}):`);
        console.log("```javascript");
        console.log(config.content);
        console.log("```\n");
      });

      console.log("📄 错误边界组件 (UploaderErrorBoundary.tsx):");
      console.log("```typescript");
      console.log(errorBoundaryTemplate);
      console.log("```\n");
    } else if (choice === "5") {
      // 生成错误边界
      console.log("\n📄 错误边界组件:");
      console.log("```typescript");
      console.log(errorBoundaryTemplate);
      console.log("```\n");
    } else {
      const configKeys = ["vite", "webpack", "nextjs", "cra"];
      const selectedKey = configKeys[parseInt(choice) - 1];

      if (selectedKey && configs[selectedKey]) {
        const config = configs[selectedKey];
        console.log(`\n📄 ${config.name} 配置:`);
        console.log("```javascript");
        console.log(config.content);
        console.log("```\n");

        const save = await askQuestion("是否保存到文件? (y/n): ");

        if (save === "y" || save === "yes") {
          try {
            fs.writeFileSync(config.file, config.content);
            console.log(`✅ 配置已保存到 ${config.file}`);
          } catch (error) {
            console.log(`❌ 保存失败: ${error.message}`);
          }
        }
      } else {
        console.log("❌ 无效的选择");
      }
    }

    console.log("\n📋 下一步操作:");
    console.log("1. 将配置代码添加到对应的配置文件中");
    console.log("2. 重新启动开发服务器");
    console.log("3. 检查控制台是否还有错误");
    console.log("4. 如果问题仍然存在，请查看 REACT19_COMPATIBILITY.md");
  } catch (error) {
    console.error("发生错误:", error.message);
  } finally {
    rl.close();
  }
}

main();
