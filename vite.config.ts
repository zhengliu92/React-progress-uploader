import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react({
      // 确保使用新的JSX transform，但不要自动导入
      jsxRuntime: "automatic",
      jsxImportSource: undefined,
    }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ReactUploader",
      fileName: (format) => `react-uploader.${format}.js`,
    },
    cssCodeSplit: false,
    rollupOptions: {
      // 更严格的external配置
      external: (id, importer) => {
        // 排除所有React相关的模块
        if (
          id === "react" ||
          id === "react-dom" ||
          id === "react/jsx-runtime" ||
          id === "react/jsx-dev-runtime" ||
          id.startsWith("react/") ||
          id.startsWith("react-dom/")
        ) {
          return true;
        }
        return false;
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJSXRuntime",
          "react/jsx-dev-runtime": "ReactJSXDevRuntime",
          "react-dom/client": "ReactDOMClient",
          "react-dom/server": "ReactDOMServer",
        },
        inlineDynamicImports: false,
        manualChunks: undefined,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "style.[hash].css";
          }
          return "[name].[hash][extname]";
        },
      },
    },
  },
  css: {
    modules: false,
  },
});
