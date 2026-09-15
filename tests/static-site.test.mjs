import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("build emits a self-contained GitHub Pages portfolio", async () => {
  const html = await readFile(new URL("dist/index.html", projectRoot), "utf8");

  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>Looking with a Slower Gaze \| Large Format Photography<\/title>/);
  assert.match(html, /src="\.\/assets\//);
  assert.match(html, /href="\.\/assets\//);
  assert.match(html, /content="(?:\.\/|https:\/\/[^"]+\/)og\.png"/);
  assert.match(html, /rel="alternate" type="application\/rss\+xml"/);
  assert.doesNotMatch(html, /_next|_vinext|__[A-Z_]+__/);

  const socialCard = await stat(new URL("dist/og.png", projectRoot));
  assert.ok(socialCard.size < 1_500_000, "social card should be web-sized");

  await Promise.all([
    access(new URL("dist/og.png", projectRoot)),
    access(new URL("dist/favicon.svg", projectRoot)),
    access(new URL("dist/.nojekyll", projectRoot)),
    access(new URL("dist/rss.xml", projectRoot)),
    access(new URL("dist/sitemap.xml", projectRoot)),
    access(new URL("dist/robots.txt", projectRoot)),
    access(new URL("dist/works/index.html", projectRoot)),
    access(new URL("dist/series/index.html", projectRoot)),
  ]);
});

test("portfolio exposes all nine works and accessible image viewing", async () => {
  const source = await readFile(new URL("app/ArchiveHome.tsx", projectRoot), "utf8");

  assert.match(source, /series\.images\.map/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /event\.key === "ArrowLeft"/);
  assert.match(source, /event\.key === "ArrowRight"/);
  assert.match(source, /useState<Language>\("en"\)/);
  assert.match(source, /aria-pressed=\{language === "zh"\}/);
  assert.match(source, /What you photograph is exactly what you see\./);
  assert.match(source, /WRITTEN BY THE ARTIST · NOT AI-GENERATED/);
  assert.match(source, /你拍到的就是你看到的东西。/);
  assert.match(source, /作者原创 · 非 AI 生成内容/);
  assert.match(source, /AI-generated — I haven't figured out what to write yet\./);
  assert.match(source, /ai生成，我还没想好写什么。/);
  assert.equal((source.match(/className="ai-generated-mark"/g) ?? []).length, 2);
  assert.match(source, /loading=\{index < 2 \? "eager" : "lazy"\}/);
  assert.doesNotMatch(source, /文字尚未公开|大画幅模拟器|个人档案/);
});

test("the Royal National Park series contains nine web-sized photographs", async () => {
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
  assert.equal(JSON.parse(siteJson).title, "Large Format Photography");
  assert.match(contentSource, /validateEntries\(rawEntries\)/);
  assert.match(contentSource, /至少需要一张摄影图片/);
});
