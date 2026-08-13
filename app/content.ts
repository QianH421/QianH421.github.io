export const sections = [
  {
    id: "about",
    number: "01",
    title: "个人简介",
    english: "ABOUT",
    summary: "个人经历、实践方向与联系方式。",
    note: "资料待补",
    keywords: ["个人", "简介", "经历", "联系", "about", "profile"],
  },
  {
    id: "writing",
    number: "02",
    title: "文字",
    english: "WRITING",
    summary: "随笔、散文、随想与社会评论，依年份归档。",
    note: "文章待录入",
    keywords: ["文字", "随笔", "散文", "随想", "社会评论", "writing"],
  },
  {
    id: "photography",
    number: "03",
    title: "大画幅摄影",
    english: "LARGE FORMAT",
    summary: "摄影作品、拍摄手记，以及胶片、冲洗与扫描经验。",
    note: "作品待录入",
    keywords: ["大画幅", "摄影", "胶片", "冲洗", "扫描", "large format"],
  },
  {
    id: "devlog",
    number: "04",
    title: "大画幅模拟器",
    english: "DEVLOG",
    summary: "大画幅相机模拟器的设计、试验与版本记录。",
    note: "日志待录入",
    keywords: ["模拟器", "开发", "日志", "相机", "devlog", "simulator"],
  },
] as const;

export type SectionId = (typeof sections)[number]["id"];
export type ViewId = "home" | "archive" | "search" | SectionId;

export const writingCategories = ["随笔", "散文", "随想", "社会评论", "按年份归档"];

export const photographyCategories = [
  "摄影作品",
  "拍摄手记",
  "器材与操作",
  "大画幅经验谈",
  "胶片、冲洗与扫描",
];

export function isSectionId(value: string): value is SectionId {
  return sections.some((section) => section.id === value);
}

export function isViewId(value: string): value is ViewId {
  return value === "home" || value === "archive" || value === "search" || isSectionId(value);
}
