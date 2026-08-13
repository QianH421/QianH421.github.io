# 内容录入说明

网站资料集中放在这个文件夹中。

- `site.json`：站名、副标题、说明、所在地与时区；
- `entries.json`：所有文章、摄影作品与开发日志；
- 摄影图片放在 `public/images/`，这里只填写从 `images/` 开始的相对路径。

## 文字示例

```json
{
  "slug": "first-note",
  "section": "writing",
  "title": "文章标题",
  "date": "2026-08-13",
  "summary": "首页与搜索结果显示的简短摘要。",
  "keywords": ["随笔", "摄影"],
  "published": true,
  "category": "随笔",
  "body": ["第一段正文。", "第二段正文。"]
}
```

## 摄影作品示例

```json
{
  "slug": "work-001",
  "section": "photography",
  "title": "作品名称",
  "date": "2026-08-13",
  "summary": "作品或系列说明。",
  "keywords": ["大画幅", "海岸"],
  "published": true,
  "category": "摄影作品",
  "image": "images/work-001.jpg",
  "alt": "照片中实际可见内容的准确描述",
  "location": "Sydney",
  "year": "2026",
  "process": "4×5 COLOR NEGATIVE · SCAN",
  "body": ["拍摄手记或作品说明。"]
}
```

## 开发日志示例

```json
{
  "slug": "build-001",
  "section": "devlog",
  "title": "日志标题",
  "date": "2026-08-13",
  "summary": "本次更新解决的问题。",
  "keywords": ["对焦", "相机位移"],
  "published": true,
  "version": "0.1.0",
  "body": ["实现过程与判断。"]
}
```

`slug` 必须使用小写英文字母、数字和连字符，并且不能重复。日期必须采用 `YYYY-MM-DD`。将 `published` 设为 `false` 可以保留草稿而不显示在网站、搜索、归档或 RSS 中。
