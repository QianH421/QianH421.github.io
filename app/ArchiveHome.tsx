import { useEffect, useMemo, useRef, useState } from "react";
import {
  entriesFor,
  entryFromView,
  entryView,
  isViewId,
  photographyCategories,
  publishedEntries,
  sections,
  siteConfig,
  type ArchiveEntry,
  type SectionId,
  type ViewId,
  writingCategories,
} from "./content";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function PhotographyPreview({ open, openEntry }: { open: () => void; openEntry: (slug: string) => void }) {
  const works = entriesFor("photography").filter((entry) => entry.category === "摄影作品");
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = works[currentIndex];

  useEffect(() => {
    if (works.length < 2) return;
    const timer = window.setInterval(() => setCurrentIndex((index) => (index + 1) % works.length), 8_000);
    return () => window.clearInterval(timer);
  }, [works.length]);

  const show = (direction: -1 | 1) => {
    setCurrentIndex((index) => (index + direction + works.length) % works.length);
  };

  return (
    <div className="preview photography-preview">
      <div className="preview-kicker">
        <span>{current ? `SELECTED WORK · ${String(currentIndex + 1).padStart(3, "0")}` : "EXHIBITION WALL · LAYOUT STUDY"}</span>
        <span>4 × 5</span>
      </div>

      <figure className="photograph">
        <button
          className="photograph-mat"
          type="button"
          onClick={() => current ? openEntry(current.slug) : open()}
          aria-label={current ? `阅读摄影作品：${current.title}` : "进入大画幅摄影栏目"}
        >
          <img
            key={current?.slug ?? "placeholder"}
            src={current ? `./${current.image}` : "./images/hero-placeholder.jpg"}
            alt={current?.alt ?? "清晨平静海湾中的旧木栈桥——首页摄影占位图"}
          />
        </button>
        <figcaption>
          <div>
            <p className="work-title">{current?.title ?? "首页视觉占位图"}</p>
            <p>{current ? [current.location, current.year].filter(Boolean).join(" · ") : "正式摄影作品录入后替换"}</p>
          </div>
          <p className="work-process">{current?.process ?? "FULL FRAME · NO CROP"}</p>
        </figcaption>
      </figure>

      {works.length > 1 ? (
        <div className="slideshow-controls" aria-label="摄影作品浏览">
          <button type="button" aria-label="上一张作品" onClick={() => show(-1)}>←</button>
          <div className="slide-progress"><span style={{ width: `${((currentIndex + 1) / works.length) * 100}%` }} /></div>
          <span>{String(currentIndex + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}</span>
          <button type="button" aria-label="下一张作品" onClick={() => show(1)}>→</button>
        </div>
      ) : (
        <div className="slideshow-status" aria-label="摄影作品状态">
          <span>{current ? "ONE PUBLISHED WORK ON VIEW" : "ONE LAYOUT STUDY ON VIEW"}</span>
          <span>{current ? "第二张作品发布后自动启用轮播" : "作品轮播将在正式照片录入后启用"}</span>
        </div>
      )}
    </div>
  );
}

function AboutPreview({ open }: { open: () => void }) {
  return (
    <div className="preview about-preview">
      <div className="preview-kicker">
        <span>PROFILE / NOTE</span>
        <span>01</span>
      </div>
      <div className="about-composition">
        <div className="about-image">
          <img src="./images/hero-placeholder.jpg" alt="个人档案预览占位照片" />
          <span>PORTRAIT / WORKSPACE · 待替换</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">一个缓慢积累的个人档案</p>
          <h2>在文字、银盐与虚拟光线之间。</h2>
          <p>这里将收藏个人经历、写作、大画幅摄影，以及虚拟大画幅相机逐步成形的过程。</p>
          <button className="text-link" type="button" onClick={open}>阅读简介 <Arrow /></button>
        </div>
      </div>
    </div>
  );
}

function WritingPreview({ open }: { open: () => void }) {
  const recent = entriesFor("writing").slice(0, 3);
  return (
    <div className="preview writing-preview">
      <div className="preview-kicker">
        <span>WRITING INDEX</span>
        <span>02</span>
      </div>
      <div className="writing-sheet writing-empty-sheet">
        <div className="writing-heading">
          <p className="eyebrow">随笔 / 散文 / 随想 / 社会评论</p>
          <h2>文字</h2>
        </div>
        {recent.length > 0 ? (
          <ol className="writing-list">
            {recent.map((entry) => (
              <li key={entry.slug}>
                <button type="button" onClick={() => window.location.hash = entryView(entry.slug)}>
                  <span className="article-date">{formatDate(entry.date, "short")}</span>
                  <span className="article-title">{entry.title}</span>
                  <span className="article-type">{entry.category}</span>
                  <Arrow />
                </button>
              </li>
            ))}
          </ol>
        ) : <div className="preview-empty-state">
          <span className="empty-index">—</span>
          <div>
            <h3>文字尚未公开</h3>
            <p>第一篇文章录入后，将在这里显示标题、日期、类别与摘录。</p>
          </div>
          <button className="text-link" type="button" onClick={open}>查看栏目结构 <Arrow /></button>
        </div>}
      </div>
    </div>
  );
}

function DevlogPreview({ open }: { open: () => void }) {
  const latest = entriesFor("devlog")[0];
  return (
    <div className="preview devlog-preview">
      <div className="preview-kicker light">
        <span>LARGE FORMAT CAMERA SIMULATOR</span>
        <span>{latest ? `BUILD ${latest.version}` : "PROJECT INDEX"}</span>
      </div>
      <div className="simulator-stage">
        <div className="ground-glow" />
        <div className="camera-model" aria-hidden="true">
          <div className="rear-standard"><span /></div>
          <div className="bellows"><i /><i /><i /><i /><i /></div>
          <div className="front-standard"><span /></div>
          <div className="rail" />
        </div>
        <div className="sim-readout">
          <span>FOCUS</span>
          <span>TILT / SWING</span>
          <span>RISE / SHIFT</span>
        </div>
      </div>
      <div className="devlog-footer">
        <div>
          <p className="eyebrow">{latest ? `LATEST UPDATE · ${formatDate(latest.date, "yearMonth")}` : "DEVELOPMENT RECORD · 待录入"}</p>
          <h2>{latest?.title ?? "记录一台虚拟大画幅相机的设计、试验与版本变化。"}</h2>
        </div>
        <button className="text-link light-link" type="button" onClick={open}>查看开发日志 <Arrow /></button>
      </div>
    </div>
  );
}

function Preview({ active, navigate }: { active: SectionId; navigate: (view: ViewId) => void }) {
  const open = () => navigate(active);
  return (
    <div key={active} className="preview-transition">
      {active === "about" && <AboutPreview open={open} />}
      {active === "writing" && <WritingPreview open={open} />}
      {active === "photography" && <PhotographyPreview open={open} openEntry={(slug) => navigate(entryView(slug))} />}
      {active === "devlog" && <DevlogPreview open={open} />}
    </div>
  );
}

function EmptyCollection({ label }: { label: string }) {
  return (
    <div className="collection-empty" role="status">
      <span aria-hidden="true">○</span>
      <div>
        <h3>{label}尚未录入</h3>
        <p>此处保留为空，直到正式内容与资料完成整理。</p>
      </div>
    </div>
  );
}

function SectionView({ id, navigate }: { id: SectionId; navigate: (view: ViewId) => void }) {
  const section = sections.find((item) => item.id === id)!;
  const sectionEntries = id === "about" ? [] : entriesFor(id);
  const categories = id === "writing" ? writingCategories : id === "photography" ? photographyCategories : [];

  return (
    <article className={`content-view content-${id}`}>
      <div className="content-rail">
        <button className="back-link" type="button" onClick={() => navigate("home")}>← 返回首页</button>
        <span>{section.number} / 04</span>
      </div>
      <header className="content-header">
        <p className="eyebrow">{section.english}</p>
        <h1>{section.title}</h1>
        <p>{section.summary}</p>
      </header>

      {id === "about" && (
        <div className="about-detail detail-grid">
          <div className="detail-placeholder" aria-hidden="true"><span>PORTRAIT / WORKSPACE</span></div>
          <div className="detail-copy">
            <p className="detail-lead">这里将介绍个人经历、关注的问题，以及文字、摄影与模拟器开发之间的联系。</p>
            <EmptyCollection label="个人资料" />
          </div>
        </div>
      )}

      {(id === "writing" || id === "photography") && (
        <div className="category-detail">
          <ol className="category-list">
            {categories.map((category, index) => (
              <li key={category}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{category}</strong>
                <span>{sectionEntries.filter((entry) => "category" in entry && entry.category === category).length}</span>
              </li>
            ))}
          </ol>
          {sectionEntries.length > 0
            ? <EntryIndex entries={sectionEntries} navigate={navigate} />
            : <EmptyCollection label={id === "writing" ? "文章" : "摄影作品"} />}
        </div>
      )}

      {id === "devlog" && (
        <div className="devlog-detail detail-grid">
          <div className="technical-plate" aria-label="模拟器项目栏目示意">
            <span>CAMERA MOVEMENTS</span><span>FOCUS PLANE</span><span>OPTICS</span><span>BUILD NOTES</span>
          </div>
          <div className="detail-copy">
            <p className="detail-lead">开发日志将按日期与版本记录问题、判断、实现过程和图像试验。</p>
            {sectionEntries.length > 0
              ? <EntryIndex entries={sectionEntries} navigate={navigate} />
              : <EmptyCollection label="开发日志" />}
          </div>
        </div>
      )}
    </article>
  );
}

function EntryIndex({ entries: items, navigate }: { entries: ArchiveEntry[]; navigate: (view: ViewId) => void }) {
  return (
    <ol className="entry-index">
      {items.map((entry) => (
        <li key={entry.slug}>
          <button type="button" onClick={() => navigate(entryView(entry.slug))}>
            <span>{formatDate(entry.date, "short")}</span>
            <strong>{entry.title}</strong>
            <Arrow />
          </button>
        </li>
      ))}
    </ol>
  );
}

function EntryView({ entry, navigate }: { entry: ArchiveEntry; navigate: (view: ViewId) => void }) {
  const section = sections.find((item) => item.id === entry.section)!;
  const photograph = entry.section === "photography" ? entry : undefined;
  const devlogImage = entry.section === "devlog" && entry.image ? entry : undefined;
  return (
    <article className={`content-view entry-view entry-${entry.section}`}>
      <div className="content-rail">
        <button className="back-link" type="button" onClick={() => navigate(entry.section)}>← 返回{section.title}</button>
        <span>{formatDate(entry.date, "full")}</span>
      </div>
      <header className="entry-header">
        <p className="eyebrow">{section.english}{entry.section === "devlog" ? ` · BUILD ${entry.version}` : "category" in entry ? ` · ${entry.category}` : ""}</p>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
      </header>
      {photograph && (
        <figure className="entry-photograph">
          <img src={`./${photograph.image}`} alt={photograph.alt} />
          <figcaption>{photograph.location} · {photograph.year}<span>{photograph.process}</span></figcaption>
        </figure>
      )}
      {devlogImage && <img className="entry-devlog-image" src={`./${devlogImage.image}`} alt={devlogImage.imageAlt ?? "开发日志配图"} />}
      <div className="prose">
        {entry.body.map((paragraph, index) => <p key={`${entry.slug}-${index}`}>{paragraph}</p>)}
      </div>
    </article>
  );
}

function ArchiveView({ navigate }: { navigate: (view: ViewId) => void }) {
  return (
    <section className="content-view archive-view">
      <div className="content-rail">
        <button className="back-link" type="button" onClick={() => navigate("home")}>← 返回首页</button>
        <span>INDEX / ALL</span>
      </div>
      <header className="content-header compact-header">
        <p className="eyebrow">ARCHIVE</p>
        <h1>总目录</h1>
        <p>所有公开内容最终会依栏目、类别和年份汇集于此。</p>
      </header>
      {publishedEntries.length > 0 ? (
        <ol className="archive-list">
          {publishedEntries.map((entry, index) => (
            <li key={entry.slug}>
              <button type="button" onClick={() => navigate(entryView(entry.slug))}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span><strong>{entry.title}</strong><small>{sections.find((section) => section.id === entry.section)?.english}</small></span>
                <span>{formatDate(entry.date, "full")}</span>
                <Arrow />
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <>
          <ol className="archive-list">
            {sections.map((section) => (
              <li key={section.id}>
                <button type="button" onClick={() => navigate(section.id)}>
                  <span>{section.number}</span>
                  <span><strong>{section.title}</strong><small>{section.english}</small></span>
                  <span>内容待录入</span>
                  <Arrow />
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}

function SearchView({ navigate }: { navigate: (view: ViewId) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  const searchItems = useMemo(() => [
    ...sections.map((section) => ({
      id: section.id as ViewId,
      number: section.number,
      title: section.title,
      summary: section.summary,
      searchText: [section.title, section.english, section.summary, ...section.keywords].join(" "),
    })),
    ...publishedEntries.map((entry, index) => ({
      id: entryView(entry.slug) as ViewId,
      number: `A${String(index + 1).padStart(2, "0")}`,
      title: entry.title,
      summary: entry.summary,
      searchText: [entry.title, entry.summary, ...entry.keywords, ...entry.body].join(" "),
    })),
  ], []);
  const matches = useMemo(
    () => normalized
      ? searchItems.filter((item) => item.searchText.toLocaleLowerCase("zh-CN").includes(normalized))
      : searchItems,
    [normalized, searchItems],
  );

  useEffect(() => inputRef.current?.focus(), []);

  return (
    <section className="content-view search-view">
      <div className="content-rail">
        <button className="back-link" type="button" onClick={() => navigate("home")}>← 返回首页</button>
        <span>SEARCH / LOCAL</span>
      </div>
      <div className="search-panel">
        <label htmlFor="site-search">搜索档案</label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="输入栏目、主题或关键词"
          autoComplete="off"
        />
        <p className="search-count" aria-live="polite">{normalized ? `${matches.length} 项结果` : "可搜索当前四个栏目"}</p>
        <ol className="search-results">
          {matches.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => navigate(item.id)}>
                <span>{item.number}</span>
                <span><strong>{item.title}</strong><small>{item.summary}</small></span>
                <Arrow />
              </button>
            </li>
          ))}
        </ol>
        {matches.length === 0 && <p className="no-results">没有匹配的公开内容。</p>}
      </div>
    </section>
  );
}

function routeFromHash(): ViewId {
  const value = window.location.hash.replace(/^#\/?/, "");
  return value && isViewId(value) ? value : "home";
}

function setDocumentMetadata(view: ViewId) {
  const entry = entryFromView(view);
  const section = sections.find((item) => item.id === view);
  const title = entry
    ? `${entry.title}｜${siteConfig.title}`
    : section
    ? `${section.title}｜${siteConfig.title}`
    : view === "archive"
      ? `总目录｜${siteConfig.title}`
      : view === "search"
        ? `搜索｜${siteConfig.title}`
        : siteConfig.browserTitle;
  const description = entry?.summary ?? section?.summary ?? siteConfig.description;
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", description);
}

export function ArchiveHome() {
  const [active, setActive] = useState<SectionId>("photography");
  const [view, setView] = useState<ViewId>(() => routeFromHash());
  const [clock, setClock] = useState("—:—");

  const navigate = (next: ViewId) => {
    if (next === "home") {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
      setView("home");
    } else {
      window.location.hash = next;
      setView(next);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const syncRoute = () => setView(routeFromHash());
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && view !== "home") navigate("home");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view]);

  useEffect(() => {
    setDocumentMetadata(view);
  }, [view]);

  useEffect(() => {
    const format = () => setClock(new Intl.DateTimeFormat("en-AU", {
          timeZone: siteConfig.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date()));
    format();
    const interval = window.setInterval(format, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="site-shell">
      <header className="topbar">
        <button className="identity" type="button" onClick={() => navigate("home")} aria-label="返回首页">
          <span className="identity-cn">{siteConfig.title}</span>
          <span className="identity-en">{siteConfig.subtitle}</span>
        </button>
        <nav className="utility-nav" aria-label="网站工具">
          <button type="button" aria-current={view === "archive" ? "page" : undefined} onClick={() => navigate("archive")}>ARCHIVE</button>
          <button type="button" aria-current={view === "search" ? "page" : undefined} onClick={() => navigate("search")}>SEARCH</button>
          <a href="./rss.xml" target="_blank" rel="alternate" type="application/rss+xml">RSS</a>
        </nav>
      </header>

      {view === "home" && (
        <div className="home-grid">
          <aside className="section-index" aria-label="主要栏目">
            <nav className="section-list" aria-label="首页栏目">
              {sections.map((section) => {
                const isActive = active === section.id;
                return (
                  <button
                    key={section.id}
                    className={`section-entry${isActive ? " is-active" : ""}`}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`${section.title}：预览并进入栏目`}
                    onMouseEnter={() => setActive(section.id)}
                    onFocus={() => setActive(section.id)}
                    onClick={() => navigate(section.id)}
                  >
                    <span className="entry-rule" aria-hidden="true" />
                    <span className="entry-copy">
                      <span className="entry-title">{section.title}</span>
                      <span className="entry-english">{section.english}</span>
                    </span>
                    <span className="entry-number">{section.number}</span>
                    <span className="entry-arrow" aria-hidden="true">↗</span>
                  </button>
                );
              })}
            </nav>
            <footer className="location-strip">
              <span>{siteConfig.location}</span><span className="location-dot" aria-hidden="true" /><span>{clock} {siteConfig.timeZoneLabel}</span><span>{new Date().getFullYear()}</span>
            </footer>
          </aside>

          <section id="section-preview" className={`visual-stage stage-${active}`} aria-live="polite">
            <Preview active={active} navigate={navigate} />
          </section>
        </div>
      )}

      {view === "archive" && <ArchiveView navigate={navigate} />}
      {view === "search" && <SearchView navigate={navigate} />}
      {view !== "home" && view !== "archive" && view !== "search" && entryFromView(view) && <EntryView entry={entryFromView(view)!} navigate={navigate} />}
      {view !== "home" && view !== "archive" && view !== "search" && !entryFromView(view) && <SectionView id={view as SectionId} navigate={navigate} />}
    </main>
  );
}

function formatDate(date: string, style: "short" | "yearMonth" | "full") {
  if (style === "short") return date.slice(2, 7).replace("-", ".");
  if (style === "yearMonth") return date.slice(0, 7).replace("-", ".");
  return date.replaceAll("-", ".");
}
