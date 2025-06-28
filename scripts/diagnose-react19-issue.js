#!/usr/bin/env node

/**
 * React 19 ReactCurrentDispatcher 错误诊断脚本
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 诊断 ReactCurrentDispatcher 错误...\n");

// 检查打包文件是否包含React代码
function checkBundleForReactCode() {
  console.log("📦 检查打包文件...");

  const distPath = path.join(process.cwd(), "dist");
  if (!fs.existsSync(distPath)) {
    console.log("❌ dist 目录不存在，请先运行 npm run build");
    return false;
  }

  const bundleFiles = ["react-uploader.es.js", "react-uploader.umd.js"];
  let hasReactCode = false;

  bundleFiles.forEach((file) => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");

      // 检查是否包含React内部代码
      const reactPatterns = [
        "ReactCurrentDispatcher",
        "ReactCurrentBatchConfig",
        "ReactCurrentOwner",
        "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
        "react/jsx-runtime",
        "useState",
        "useEffect",
        "createElement",
      ];

      const foundPatterns = reactPatterns.filter((pattern) =>
        content.includes(pattern)
      );

      if (foundPatterns.length > 0) {
        console.log(`⚠️  ${file} 包含 React 代码:`);
        foundPatterns.forEach((pattern) => {
          console.log(`   - ${pattern}`);
        });
        hasReactCode = true;
      } else {
        console.log(`✅ ${file} 不包含 React 代码`);
      }
    }
  });

  return hasReactCode;
}

// 检查package.json配置
function checkPackageConfig() {
  console.log("\n📋 检查 package.json 配置...");

  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

  // 检查peerDependencies
  if (
    packageJson.peerDependencies?.react &&
    packageJson.peerDependencies?.["react-dom"]
  ) {
    console.log("✅ React 已正确配置为 peerDependencies");
  } else {
    console.log("❌ React 未正确配置为 peerDependencies");
  }

  // 检查dependencies中是否包含React
  if (
    packageJson.dependencies?.react ||
    packageJson.dependencies?.["react-dom"]
  ) {
    console.log("⚠️  React 在 dependencies 中，这可能导致冲突");
    return false;
  }

  return true;
}

// 生成修复建议
function generateFixSuggestions() {
  console.log("\n🛠️  修复建议:\n");

  console.log("1. 📦 **更新 Vite 配置** (严格的 externals):");
  console.log(`
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom/client'
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime'
        }
      }
    }
  }
});`);

  console.log("\n2. 🔧 **使用者项目配置**:");
  console.log(`
// webpack.config.js (如果使用 webpack)
module.exports = {
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  }
};

// vite.config.js (如果使用 Vite)
export default defineConfig({
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  }
});`);

  console.log("\n3. 📝 **在使用者项目中添加组件导入检查**:");
  console.log(`
// 在使用组件前添加检查
import React from 'react';

if (typeof React === 'undefined') {
  throw new Error('React is not available');
}

// 检查React版本
console.log('React version:', React.version);

// 然后再导入组件
import { Uploader } from 'react-progress-uploader';`);

  console.log("\n4. 🔄 **重新构建和测试**:");
  console.log(`
npm run clean
npm run build
npm pack

# 在测试项目中
npm install ./react-progress-uploader-1.0.10.tgz
`);
}

// 主函数
async function main() {
  const hasReactCode = checkBundleForReactCode();
  const configCorrect = checkPackageConfig();

  if (hasReactCode) {
    console.log("\n❌ 发现问题：打包文件包含 React 代码");
  } else if (!configCorrect) {
    console.log("\n❌ 发现问题：package.json 配置不正确");
  } else {
    console.log("\n✅ 基础配置看起来正确");
  }

  generateFixSuggestions();

  console.log("\n📚 更多信息:");
  console.log(
    "- React 19 升级指南: https://react.dev/blog/2024/04/25/react-19-upgrade-guide"
  );
  console.log(
    "- Vite 库模式文档: https://vitejs.dev/guide/build.html#library-mode"
  );
}

main().catch(console.error);
