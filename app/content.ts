import rawEntries from "../content/entries.json";
import rawSite from "../content/site.json";

export const writingCategories = ["随笔", "散文", "随想", "社会评论"] as const;
export const photographyCategories = [
  "摄影作品",
  "拍摄手记",
  "器材与操作",
  "大画幅经验谈",
  "胶片、冲洗与扫描",
] as const;

export type SectionId = "about" | "writing" | "photography" | "devlog";
export type EntrySectionId = Exclude<SectionId, "about">;
export type EntryViewId = `entry/${string}`;
export type ViewId = "home" | "archive" | "search" | SectionId | EntryViewId;

type BaseEntry = {
  slug: string;
  section: EntrySectionId;
  title: string;
  date: string;
  summary: string;
  keywords: string[];
  published: boolean;
  body: string[];
};

export type WritingEntry = BaseEntry & {
  section: "writing";
  category: (typeof writingCategories)[number];
};

export type PhotographyEntry = BaseEntry & {
  section: "photography";
  category: (typeof photographyCategories)[number];
  image: string;
  alt: string;
  location: string;
  year: string;
  process: string;
};

export type DevlogEntry = BaseEntry & {
  section: "devlog";
  version: string;
  image?: string;
  imageAlt?: string;
};

export type ArchiveEntry = WritingEntry | PhotographyEntry | DevlogEntry;

export type SiteConfig = {
  title: string;
  browserTitle: string;
  subtitle: string;
  description: string;
  location: string;
  timeZone: string;
  timeZoneLabel: string;
};

export const siteConfig = validateSite(rawSite);
export const entries = validateEntries(rawEntries);
export const publishedEntries = entries
  .filter((entry) => entry.published)
  .sort((a, b) => b.date.localeCompare(a.date));

export const sections = [
  {
    id: "about",
    number: "01",
    title: "个人简介",
    english: "ABOUT",
    summary: "个人经历、实践方向与联系方式。",
    keywords: ["个人", "简介", "经历", "联系", "about", "profile"],
  },
  {
    id: "writing",
    number: "02",
    title: "文字",
    english: "WRITING",
    summary: "随笔、散文、随想与社会评论，依年份归档。",
    keywords: ["文字", "随笔", "散文", "随想", "社会评论", "writing"],
  },
  {
    id: "photography",
    number: "03",
    title: "大画幅摄影",
    english: "LARGE FORMAT",
    summary: "摄影作品、拍摄手记，以及胶片、冲洗与扫描经验。",
    keywords: ["大画幅", "摄影", "胶片", "冲洗", "扫描", "large format"],
  },
  {
    id: "devlog",
    number: "04",
    title: "大画幅模拟器",
    english: "DEVLOG",
    summary: "大画幅相机模拟器的设计、试验与版本记录。",
    keywords: ["模拟器", "开发", "日志", "相机", "devlog", "simulator"],
  },
] as const;

export function entriesFor(section: "writing"): WritingEntry[];
export function entriesFor(section: "photography"): PhotographyEntry[];
export function entriesFor(section: "devlog"): DevlogEntry[];
export function entriesFor(section: EntrySectionId): ArchiveEntry[];
export function entriesFor(section: EntrySectionId): ArchiveEntry[] {
  return publishedEntries.filter((entry) => entry.section === section);
}

export function entryView(slug: string): EntryViewId {
  return `entry/${slug}`;
}

export function entryFromView(view: string) {
  if (!view.startsWith("entry/")) return undefined;
  return publishedEntries.find((entry) => entry.slug === view.slice("entry/".length));
}

export function isSectionId(value: string): value is SectionId {
  return sections.some((section) => section.id === value);
}

export function isViewId(value: string): value is ViewId {
  return value === "home"
    || value === "archive"
    || value === "search"
    || isSectionId(value)
    || Boolean(entryFromView(value));
}

export function validateSite(value: unknown): SiteConfig {
  if (!isRecord(value)) throw new Error("content/site.json 必须是对象");
  const keys = ["title", "browserTitle", "subtitle", "description", "location", "timeZone", "timeZoneLabel"] as const;
  for (const key of keys) {
    if (typeof value[key] !== "string" || !value[key].trim()) {
      throw new Error(`content/site.json 的 ${key} 必须是非空文字`);
    }
  }
  return value as SiteConfig;
}

export function validateEntries(value: unknown): ArchiveEntry[] {
  if (!Array.isArray(value)) throw new Error("content/entries.json 必须是数组");
  const slugs = new Set<string>();
  return value.map((candidate, index) => {
    if (!isRecord(candidate)) throw new Error(`第 ${index + 1} 条内容必须是对象`);
    const label = `第 ${index + 1} 条内容`;
    for (const key of ["slug", "section", "title", "date", "summary"] as const) {
      if (typeof candidate[key] !== "string" || !candidate[key].trim()) throw new Error(`${label}缺少 ${key}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.slug as string)) throw new Error(`${label}的 slug 格式不正确`);
    if (slugs.has(candidate.slug as string)) throw new Error(`${label}的 slug 重复`);
    slugs.add(candidate.slug as string);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.date as string) || Number.isNaN(Date.parse(`${candidate.date}T00:00:00Z`))) {
      throw new Error(`${label}的日期格式不正确`);
    }
    if (!isStringArray(candidate.keywords) || !isStringArray(candidate.body)) throw new Error(`${label}的 keywords 与 body 必须是文字数组`);
    if (typeof candidate.published !== "boolean") throw new Error(`${label}的 published 必须是 true 或 false`);

    if (candidate.section === "writing") {
      if (!writingCategories.includes(candidate.category as WritingEntry["category"])) throw new Error(`${label}的文字类别不正确`);
    } else if (candidate.section === "photography") {
      if (!photographyCategories.includes(candidate.category as PhotographyEntry["category"])) throw new Error(`${label}的摄影类别不正确`);
      for (const key of ["image", "alt", "location", "year", "process"] as const) {
        if (typeof candidate[key] !== "string" || !candidate[key].trim()) throw new Error(`${label}缺少 ${key}`);
      }
      validateImagePath(candidate.image as string, label);
    } else if (candidate.section === "devlog") {
      if (typeof candidate.version !== "string" || !candidate.version.trim()) throw new Error(`${label}缺少 version`);
      if (candidate.image !== undefined && typeof candidate.image !== "string") throw new Error(`${label}的 image 必须是文字路径`);
      if (candidate.imageAlt !== undefined && typeof candidate.imageAlt !== "string") throw new Error(`${label}的 imageAlt 必须是文字`);
      if (typeof candidate.image === "string") validateImagePath(candidate.image, label);
    } else {
      throw new Error(`${label}的 section 必须是 writing、photography 或 devlog`);
    }
    return candidate as ArchiveEntry;
  });
}

function validateImagePath(value: string, label: string) {
  if (value.startsWith("/") || value.includes("..") || !/^images\/[a-zA-Z0-9][a-zA-Z0-9._/-]*\.(?:avif|webp|jpe?g|png)$/i.test(value)) {
    throw new Error(`${label}的 image 必须是 public/images/ 下的安全网页图片路径`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
