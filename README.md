# 大画幅摄影作品站

一个以完整画幅展示为核心的单页摄影作品站。目前收录“皇家国家公园”系列九张 4×5 摄影作品。

## 网站内容

- 首屏作品与系列简介；
- 九张作品的沉浸式纵向展示；
- 点击照片进入全屏观看，支持键盘方向键与 ESC；
- 英语为默认界面，可在页首切换中文；
- 作者题记以英中双语呈现，并明确标记为作者原创、非 AI 生成；
- 适配手机和桌面屏幕；
- 自带 GitHub Pages 自动发布流程。

## 更换或增加作品

照片位于 `public/images/royal-national-park/`，作品标题、替代文字和拍摄信息位于 `content/entries.json`。详细格式见 `content/README.md`。

## 本地预览

需要 Node.js 24 与 pnpm 11。

```bash
pnpm install
pnpm dev
```

## 发布到 GitHub Pages

仓库已包含自动发布流程。在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**；此后每次推送到 `main` 都会自动更新网站。

默认公开网址为 `https://qianh421.github.io`。

## 检查

```bash
pnpm test
pnpm lint
```
