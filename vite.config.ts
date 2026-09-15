import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateEntries, validateSite, type ArchiveEntry, type SiteConfig } from "./app/content";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL ?? "").replace(/\/$/, "");
  const canonicalUrl = siteUrl || "http://localhost:5173";
  let site: SiteConfig;
  let entries: ArchiveEntry[];

  return {
    // Relative asset URLs work both at username.github.io/repository/ and at a
    // custom domain without maintaining separate builds.
    base: "./",
    plugins: [
      react(),
      {
        name: "large-format-portfolio-static-metadata",
        async buildStart() {
          const [rawSite, rawEntries] = await Promise.all([
            readJson<unknown>("content/site.json"),
            readJson<unknown>("content/entries.json"),
          ]);
          site = validateSite(rawSite);
          entries = validateEntries(rawEntries);
          await Promise.all(entries.filter((entry) => entry.published).flatMap((entry) => {
            if (entry.section === "photography") {
              return entry.images.map((image) => access(resolve("public", image.src)));
            }
            return entry.section === "devlog" && entry.image ? [access(resolve("public", entry.image))] : [];
          }));
        },
        transformIndexHtml(html) {
          const ogImage = siteUrl ? `${siteUrl}/og.png` : "./og.png";
          return html
            .replaceAll("__OG_IMAGE__", escapeHtml(ogImage))
            .replaceAll("__SITE_URL__", escapeHtml(canonicalUrl))
            .replaceAll("__SITE_TITLE__", escapeHtml(site.title))
            .replaceAll("__BROWSER_TITLE__", escapeHtml(site.browserTitle))
            .replaceAll("__SITE_DESCRIPTION__", escapeHtml(site.description));
        },
        async writeBundle() {
          const published = entries
            .filter((entry) => entry.published)
            .sort((a, b) => b.date.localeCompare(a.date));
          const buildDate = new Date().toUTCString();
          const channelItems = published.map((entry) => rssItem(entry, canonicalUrl)).join("");
          const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${escapeXml(site.title)}</title><link>${escapeXml(canonicalUrl)}</link><description>${escapeXml(site.description)}</description><language>en-AU</language><lastBuildDate>${buildDate}</lastBuildDate>${channelItems}</channel></rss>\n`;
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeXml(canonicalUrl)}</loc></url></urlset>\n`;
          const robots = `User-agent: *\nAllow: /\nSitemap: ${canonicalUrl}/sitemap.xml\n`;
          await Promise.all([
            writeFile(resolve("dist/rss.xml"), rss),
            writeFile(resolve("dist/sitemap.xml"), sitemap),
            writeFile(resolve("dist/robots.txt"), robots),
            writeStaticFallbacks(canonicalUrl, site),
          ]);
        },
      },
    ],
  };
});

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(resolve(path), "utf8")) as T;
}

function rssItem(entry: ArchiveEntry, siteUrl: string) {
  const link = `${siteUrl}/#series`;
  return `<item><title>${escapeXml(entry.title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid><pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(entry.summary)}</description><category>${escapeXml(entry.section)}</category></item>`;
}

async function writeStaticFallbacks(siteUrl: string, site: SiteConfig) {
  const sections = [
    ["works", "Works"],
    ["series", "Royal National Park"],
  ];
  await Promise.all(sections.map(async ([slug, title]) => {
    const directory = resolve("dist", slug);
    await mkdir(directory, { recursive: true });
    const target = `${siteUrl}/#${slug}`;
    const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(site.description)}"><title>${escapeHtml(title)} | ${escapeHtml(site.title)}</title><link rel="canonical" href="${escapeHtml(target)}"><meta http-equiv="refresh" content="0;url=${escapeHtml(target)}"><script>location.replace(${JSON.stringify(target)});</script></head><body><p><a href="${escapeHtml(target)}">Enter ${escapeHtml(title)}</a></p></body></html>`;
    await writeFile(resolve(directory, "index.html"), html);
  }));
}

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function escapeHtml(value: string) {
  return escapeXml(value);
}
