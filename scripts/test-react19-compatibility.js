#!/usr/bin/env node

/**
 * React 19 兼容性测试脚本
 *
 * 运行：node scripts/test-react19-compatibility.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 检查 React 19 兼容性...\n");

// 检查项目
const checks = [
  {
    name: "package.json 检查",
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      const peerDeps = packageJson.peerDependencies || {};

      if (!peerDeps.react) {
        throw new Error("peerDependencies 中缺少 react");
      }

      // 检查是否支持React 19
      const reactVersion = peerDeps.react;
      if (!reactVersion.includes("19")) {
        console.warn("⚠️  peerDependencies 可能不支持 React 19");
        console.log(`   当前: ${reactVersion}`);
        console.log('   建议: "^18.0.0 || ^19.0.0"');
      }

      return "✅ package.json 配置正确";
    },
  },

  {
    name: "TypeScript 配置检查",
    check: () => {
      if (!fs.existsSync("tsconfig.json")) {
        return "⚠️  未找到 tsconfig.json";
      }

      const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"));
      const jsx = tsconfig.compilerOptions?.jsx;

      if (jsx !== "react-jsx") {
        throw new Error(`JSX 配置不正确: ${jsx}，应该是 'react-jsx'`);
      }

      return "✅ TypeScript 配置正确";
    },
  },

  {
    name: "Vite 配置检查",
    check: () => {
      if (!fs.existsSync("vite.config.ts")) {
        return "⚠️  未找到 vite.config.ts";
      }

      const viteConfig = fs.readFileSync("vite.config.ts", "utf8");

      if (
        !viteConfig.includes("react()") &&
        !viteConfig.includes("@vitejs/plugin-react")
      ) {
        throw new Error("Vite 配置中缺少 React 插件");
      }

      if (viteConfig.includes("jsxRuntime")) {
        return "✅ Vite 配置包含 JSX runtime 设置";
      }

      return '⚠️  建议在 Vite 配置中明确设置 jsxRuntime: "automatic"';
    },
  },

  {
    name: "构建测试",
    check: () => {
      try {
        console.log("   正在执行构建测试...");
        execSync("npm run build", { stdio: "pipe" });
        return "✅ 构建成功";
      } catch (error) {
        throw new Error(`构建失败: ${error.message}`);
      }
    },
  },

  {
    name: "类型检查",
    check: () => {
      try {
        console.log("   正在执行类型检查...");
        execSync("npx tsc --noEmit", { stdio: "pipe" });
        return "✅ 类型检查通过";
      } catch (error) {
        const output = error.stdout?.toString() || error.message;
        if (output.includes("error TS")) {
          throw new Error("存在 TypeScript 错误，请检查控制台输出");
        }
        return "⚠️  类型检查可能有问题";
      }
    },
  },
];

// 执行检查
let hasErrors = false;
let hasWarnings = false;

for (const { name, check } of checks) {
  try {
    console.log(`📋 ${name}`);
    const result = check();
    console.log(`   ${result}\n`);

    if (result.includes("⚠️")) {
      hasWarnings = true;
    }
  } catch (error) {
    console.log(`   ❌ ${error.message}\n`);
    hasErrors = true;
  }
}

// 总结
console.log("📊 检查总结:");
if (hasErrors) {
  console.log("❌ 发现错误，请修复后再升级到 React 19");
  process.exit(1);
} else if (hasWarnings) {
  console.log("⚠️  发现一些警告，建议修复后升级到 React 19");
} else {
  console.log("✅ 所有检查通过，可以安全升级到 React 19！");
}

console.log("\n📚 更多信息请查看 REACT19_COMPATIBILITY.md");
