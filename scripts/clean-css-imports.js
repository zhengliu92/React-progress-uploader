const fs = require("fs");
const path = require("path");

function cleanCssImports(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      cleanCssImports(fullPath);
    } else if (item.endsWith(".d.ts")) {
      let content = fs.readFileSync(fullPath, "utf8");

      // 移除 CSS 导入行
      content = content.replace(
        /^import ["'].*\.css["'];$/gm,
        "// CSS已通过cssInjectedByJsPlugin注入"
      );

      fs.writeFileSync(fullPath, content, "utf8");
      console.log(`已清理 CSS 导入: ${fullPath}`);
    }
  }
}

// 从 dist 目录开始清理
const distPath = path.join(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  cleanCssImports(distPath);
  console.log("CSS 导入清理完成");
} else {
  console.log("dist 目录不存在");
}
