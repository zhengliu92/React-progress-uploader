import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react({
      // 确保使用新的JSX transform
      jsxRuntime: "automatic",
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
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
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
