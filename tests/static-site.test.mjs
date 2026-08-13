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
  assert.match(html, /content="(?:\.\/|https:\/\/[^"]+\/)og\.jpg"/);
  assert.match(html, /rel="alternate" type="application\/rss\+xml"/);
  assert.doesNotMatch(html, /_next|_vinext|__[A-Z_]+__/);

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
  assert.match(source, /useState<SectionId>\("photography"\)/);
  assert.match(source, /onMouseMove=\{\(\) => setActive\(section\.id\)\}/);
  assert.doesNotMatch(source, /onMouseEnter=\{\(\) => setActive\(section\.id\)\}/);
  assert.match(source, /onClick=\{\(\) => navigate\(section\.id\)\}/);
  assert.match(source, /onClick=\{\(\) => navigate\("archive"\)\}/);
  assert.match(source, /onClick=\{\(\) => navigate\("search"\)\}/);
  assert.match(source, /href="\.\/rss\.xml"/);
  assert.match(source, /type="search"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /document\.title = title/);
  assert.match(source, /publishedEntries/);
  assert.match(source, /entryFromView/);
  assert.doesNotMatch(source, /从取景框之外开始|慢工具与当代生活|正在建立相机位移/);
});

test("real photography content stays centralized, validated and web-sized", async () => {
  const [contentSource, entriesJson, siteJson] = await Promise.all([
    readFile(new URL("app/content.ts", projectRoot), "utf8"),
    readFile(new URL("content/entries.json", projectRoot), "utf8"),
    readFile(new URL("content/site.json", projectRoot), "utf8"),
  ]);

  const entries = JSON.parse(entriesJson);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].slug, "royal-national-park");
  assert.equal(entries[0].images.length, 9);
  for (const image of entries[0].images) {
    const file = await stat(new URL(`public/${image.src}`, projectRoot));
    assert.ok(file.size < 2_000_000, `${image.src} should be web-sized`);
  }
  assert.equal(JSON.parse(siteJson).title, "个人档案");
  assert.match(contentSource, /validateEntries\(rawEntries\)/);
  assert.match(contentSource, /至少需要一张摄影图片/);
  assert.match(contentSource, /slug 格式不正确/);
  assert.match(contentSource, /日期格式不正确/);
  assert.match(contentSource, /public\/images\/ 下的安全网页图片路径/);
});
