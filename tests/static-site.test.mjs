import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("build emits a self-contained GitHub Pages homepage", async () => {
  const html = await readFile(new URL("dist/index.html", projectRoot), "utf8");

  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>个人档案｜文字、摄影与模拟器<\/title>/);
  assert.match(html, /src="\.\/assets\//);
  assert.match(html, /href="\.\/assets\//);
  assert.match(html, /content="\.\/og\.jpg"/);
  assert.match(html, /rel="alternate" type="application\/rss\+xml"/);
  assert.doesNotMatch(html, /_next|_vinext|__OG_IMAGE__|__SITE_URL__/);

  const [hero, socialCard] = await Promise.all([
    stat(new URL("dist/images/hero-placeholder.jpg", projectRoot)),
    stat(new URL("dist/og.jpg", projectRoot)),
  ]);

  assert.ok(hero.size < 500_000, "homepage photograph should be web-sized");
  assert.ok(socialCard.size < 300_000, "social card should be web-sized");

  await Promise.all([
    access(new URL("dist/images/hero-placeholder.jpg", projectRoot)),
    access(new URL("dist/og.jpg", projectRoot)),
    access(new URL("dist/favicon.svg", projectRoot)),
    access(new URL("dist/.nojekyll", projectRoot)),
    access(new URL("dist/rss.xml", projectRoot)),
    access(new URL("dist/sitemap.xml", projectRoot)),
    access(new URL("dist/robots.txt", projectRoot)),
  ]);
});

test("source contains real keyboard, search, archive, section and RSS navigation", async () => {
  const source = await readFile(
    new URL("app/ArchiveHome.tsx", projectRoot),
    "utf8",
  );

  assert.match(source, /onFocus=\{\(\) => setActive\(section\.id\)\}/);
  assert.match(source, /onClick=\{\(\) => navigate\(section\.id\)\}/);
  assert.match(source, /onClick=\{\(\) => navigate\("archive"\)\}/);
  assert.match(source, /onClick=\{\(\) => navigate\("search"\)\}/);
  assert.match(source, /href="\.\/rss\.xml"/);
  assert.match(source, /type="search"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /document\.title = title/);
  assert.doesNotMatch(source, /从取景框之外开始|慢工具与当代生活|正在建立相机位移/);
});
