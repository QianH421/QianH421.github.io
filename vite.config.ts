import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/$/, "");
  const canonicalUrl = siteUrl || "http://localhost:5173";

  return {
    // Relative asset URLs work both at username.github.io/repository/ and at a
    // custom domain without maintaining separate builds.
    base: "./",
    plugins: [
      react(),
      {
        name: "personal-archive-site-url",
        transformIndexHtml(html) {
          const ogImage = siteUrl ? `${siteUrl}/og.jpg` : "./og.jpg";
          return html
            .replaceAll("__OG_IMAGE__", ogImage)
            .replaceAll("__SITE_URL__", canonicalUrl);
        },
        async writeBundle() {
          const escapedUrl = canonicalUrl.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
          const buildDate = new Date().toUTCString();
          const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>个人档案</title><link>${escapedUrl}</link><description>文字、大画幅摄影与模拟器开发过程的个人档案。</description><language>zh-CN</language><lastBuildDate>${buildDate}</lastBuildDate></channel></rss>\n`;
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapedUrl}</loc></url></urlset>\n`;
          const robots = `User-agent: *\nAllow: /\nSitemap: ${canonicalUrl}/sitemap.xml\n`;
          await Promise.all([
            writeFile(resolve("dist/rss.xml"), rss),
            writeFile(resolve("dist/sitemap.xml"), sitemap),
            writeFile(resolve("dist/robots.txt"), robots),
          ]);
        },
      },
    ],
  };
});
