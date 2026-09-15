# 摄影内容说明

网站的系列信息保存在 `entries.json`，站点标题与链接预览信息保存在 `site.json`。

每张照片在 `images` 数组中有三个字段：

- `src`：从 `public/` 开始的相对路径；
- `alt`：照片中实际可见内容的准确描述；
- `label`：作品在系列中的标记。

示例：

```json
{
  "src": "images/royal-national-park/rnp-1.jpg",
  "alt": "照片中实际可见内容的准确描述",
  "label": "皇家国家公园 · 01"
}
```

调整 `images` 中的先后顺序，就会改变网页上的展示顺序。照片应该使用网页尺寸的 JPEG、PNG、WebP 或 AVIF，并始终保留一份不上传到网页的原始扫描文件。
