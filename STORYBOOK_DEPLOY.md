# 📚 Storybook 部署指南

## 🚀 发布选项总览

您的React Progress Uploader组件库有多种方式发布Storybook文档：

### 1. GitHub Pages（推荐 - 免费）✅
### 2. Vercel（简单快速）
### 3. Netlify（功能丰富）
### 4. Chromatic（专业Storybook托管）

---

## 🏠 方法1: GitHub Pages 自动部署

### ✅ 优点
- 完全免费
- 自动化部署
- 与GitHub仓库集成
- 自定义域名支持

### 📋 设置步骤

#### 1. GitHub仓库设置
1. 前往 GitHub 仓库：https://github.com/zhengliu92/React-progress-uploader
2. 点击 `Settings` 标签
3. 在左侧菜单找到 `Pages`
4. 在 `Source` 部分选择 `GitHub Actions`

#### 2. 推送工作流
```bash
# 提交并推送GitHub Actions工作流
git add .
git commit -m "添加Storybook自动部署到GitHub Pages"
git push origin main
```

#### 3. 部署结果
- 🔗 **Storybook URL**: https://zhengliu92.github.io/React-progress-uploader/
- ⏱️ **部署时间**: 通常2-5分钟
- 🔄 **自动更新**: 每次推送main分支自动部署

---

## ⚡ 方法2: Vercel 部署

### 步骤
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署Storybook
npm run build-storybook
vercel --prod ./storybook-static
```

### 🎯 特点
- 🚀 部署速度极快
- 🌐 全球CDN
- 🆓 免费额度充足
- 📊 性能分析

---

## 🌊 方法3: Netlify 部署

### 自动部署
1. 前往 [Netlify](https://netlify.com)
2. 连接GitHub仓库
3. 设置构建命令：
   ```
   Build command: npm run build-storybook
   Publish directory: storybook-static
   ```

### 手动部署
```bash
# 1. 构建Storybook
npm run build-storybook

# 2. 手动拖拽storybook-static文件夹到Netlify
# 或使用Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=storybook-static
```

### 🎯 特点
- 🔧 丰富的配置选项
- 🔀 分支预览
- 📝 表单处理
- 🔐 身份验证

---

## 🎨 方法4: Chromatic（专业推荐）

### 设置Chromatic
```bash
# 1. 安装Chromatic
npm install --save-dev chromatic

# 2. 注册账号并获取项目token
# 访问 https://chromatic.com

# 3. 发布到Chromatic
npx chromatic --project-token=<your-project-token>
```

### 🎯 专业特性
- 🔍 **视觉回归测试** - 自动检测UI变化
- 🧪 **交互测试** - 测试组件行为
- 👥 **团队协作** - 设计师开发者协作
- 📱 **跨浏览器测试** - 多浏览器兼容性

---

## 🔧 本地预览Storybook

### 开发模式
```bash
npm run storybook
# 访问: http://localhost:6006
```

### 构建预览
```bash
npm run build-storybook
# 使用任何静态服务器预览storybook-static文件夹
npx serve storybook-static
```

---

## 📊 部署对比

| 平台 | 价格 | 设置难度 | 自动部署 | 自定义域名 | 特殊功能 |
|------|------|----------|----------|------------|----------|
| **GitHub Pages** | 🆓 免费 | ⭐⭐ 简单 | ✅ 是 | ✅ 是 | GitHub集成 |
| **Vercel** | 🆓 免费/付费 | ⭐ 极简 | ✅ 是 | ✅ 是 | 性能优化 |
| **Netlify** | 🆓 免费/付费 | ⭐⭐ 简单 | ✅ 是 | ✅ 是 | 功能丰富 |
| **Chromatic** | 💰 付费 | ⭐⭐⭐ 中等 | ✅ 是 | ✅ 是 | 专业测试 |

---

## 🎯 推荐部署策略

### 🔰 个人项目/开源项目
**推荐**: GitHub Pages
- 完全免费
- 与代码仓库集成
- 自动化部署

### 🏢 团队项目
**推荐**: Chromatic + GitHub Pages
- GitHub Pages: 公开文档
- Chromatic: 内部测试和协作

### 💼 商业项目
**推荐**: Vercel 或 Netlify
- 更好的性能
- 专业支持
- 高级功能

---

## ✅ 当前状态

✅ **已配置**: GitHub Actions自动部署
✅ **已构建**: Storybook静态文件
✅ **准备就绪**: 推送即可部署

### 🚀 立即部署
```bash
git add .
git commit -m "添加Storybook部署配置"
git push origin main
```

部署完成后，您的Storybook将在以下地址可用：
🔗 https://zhengliu92.github.io/React-progress-uploader/

---

## 🆘 故障排除

### GitHub Pages没有启用
1. 检查仓库设置 → Pages → Source选择 "GitHub Actions"
2. 确保仓库是公开的（或者有GitHub Pro）

### 构建失败
```bash
# 本地测试构建
npm run build-storybook

# 检查GitHub Actions日志
# 在仓库的Actions标签页查看详细错误
```

### 访问404错误
- 确保GitHub Pages已正确配置
- 等待几分钟让DNS生效
- 检查部署状态

---

现在您可以选择任何一种方式来发布您的Storybook文档！🎉 