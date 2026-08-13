# 个人档案

一处收藏文字、大画幅摄影与模拟器开发过程的个人网站。目前完成了首页、栏目、归档、搜索和静态发布系统；真实站名、署名、文章与摄影资料仍待录入。

## 录入内容

站点资料统一放在 `content/`：

- 修改 `content/site.json` 可以替换站名、说明、所在地与时区；
- 在 `content/entries.json` 添加文章、摄影作品或开发日志；
- 发布内容会自动进入栏目、总目录、搜索与 RSS；
- 摄影作品达到两张后，首页会自动启用约 8 秒一次的完整画幅轮播；
- 具体格式和示例见 `content/README.md`。

## 本地预览

需要 Node.js 24 与 pnpm 11。

```bash
pnpm install
pnpm dev
```

## 发布到 GitHub Pages

仓库已经包含自动发布流程。准备上线时：

1. 把项目上传至 GitHub，并将默认分支设为 `main`；
2. 在仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**；
3. 推送到 `main` 后，GitHub 会自动构建并发布 `dist`；
4. 域名确定后，在同一页面的 **Custom domain** 中填写域名并启用 **Enforce HTTPS**；
5. 按 GitHub 页面显示的目标值，在域名服务商处添加 DNS 记录。

本项目使用相对资源路径，因此既可以部署在 `username.github.io/repository/`，也可以切换到独立域名，不需要修改首页代码。

## 发布前仍需替换

- “个人档案”与页面说明；
- 首页摄影占位作品、作品名、地点、胶片和年份；
- 简介、文章标题和开发日志；
- 顶部 Archive、Search 与 RSS 的实际页面或功能；
- 独立域名。

## 常用命令

```bash
pnpm dev       # 本地预览
pnpm test      # 构建并检查静态产物
pnpm lint      # 检查代码
```
