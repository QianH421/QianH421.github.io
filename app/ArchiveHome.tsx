import { useEffect, useMemo, useRef, useState } from "react";
import {
  isViewId,
  photographyCategories,
  sections,
  type SectionId,
  type ViewId,
  writingCategories,
} from "./content";

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function PhotographyPreview({ open }: { open: () => void }) {
  return (
    <div className="preview photography-preview">
      <div className="preview-kicker">
        <span>EXHIBITION WALL · LAYOUT STUDY</span>
        <span>4 × 5</span>
      </div>

      <figure className="photograph">
        <button className="photograph-mat" type="button" onClick={open} aria-label="进入大画幅摄影栏目">
          <img
            src="./images/hero-placeholder.jpg"
            alt="清晨平静海湾中的旧木栈桥——首页摄影占位图"
          />
        </button>
        <figcaption>
          <div>
            <p className="work-title">首页视觉占位图</p>
            <p>正式摄影作品录入后替换</p>
          </div>
          <p className="work-process">FULL FRAME · NO CROP</p>
        </figcaption>
      </figure>

      <div className="slideshow-status" aria-label="摄影作品状态">
        <span>ONE LAYOUT STUDY ON VIEW</span>
        <span>作品轮播将在正式照片录入后启用</span>
      </div>
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
        <div className="preview-empty-state">
          <span className="empty-index">—</span>
          <div>
            <h3>文字尚未公开</h3>
            <p>第一篇文章录入后，将在这里显示标题、日期、类别与摘录。</p>
          </div>
          <button className="text-link" type="button" onClick={open}>查看栏目结构 <Arrow /></button>
        </div>
      </div>
    </div>
  );
}

function DevlogPreview({ open }: { open: () => void }) {
  return (
    <div className="preview devlog-preview">
      <div className="preview-kicker light">
        <span>LARGE FORMAT CAMERA SIMULATOR</span>
        <span>PROJECT INDEX</span>
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
          <p className="eyebrow">DEVELOPMENT RECORD · 待录入</p>
          <h2>记录一台虚拟大画幅相机的设计、试验与版本变化。</h2>
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
      {active === "photography" && <PhotographyPreview open={open} />}
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
                <span>0</span>
              </li>
            ))}
          </ol>
          <EmptyCollection label={id === "writing" ? "文章" : "摄影作品"} />
        </div>
      )}

      {id === "devlog" && (
        <div className="devlog-detail detail-grid">
          <div className="technical-plate" aria-label="模拟器项目栏目示意">
            <span>CAMERA MOVEMENTS</span><span>FOCUS PLANE</span><span>OPTICS</span><span>BUILD NOTES</span>
          </div>
          <div className="detail-copy">
            <p className="detail-lead">开发日志将按日期与版本记录问题、判断、实现过程和图像试验。</p>
            <EmptyCollection label="开发日志" />
          </div>
        </div>
      )}
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
      <ol className="archive-list">
        {sections.map((section) => (
          <li key={section.id}>
            <button type="button" onClick={() => navigate(section.id)}>
              <span>{section.number}</span>
              <span><strong>{section.title}</strong><small>{section.english}</small></span>
              <span>{section.note}</span>
              <Arrow />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SearchView({ navigate }: { navigate: (view: ViewId) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  const matches = useMemo(
    () => normalized
      ? sections.filter((section) =>
          [section.title, section.english, section.summary, ...section.keywords]
            .join(" ")
            .toLocaleLowerCase("zh-CN")
            .includes(normalized),
        )
      : sections,
    [normalized],
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
          {matches.map((section) => (
            <li key={section.id}>
              <button type="button" onClick={() => navigate(section.id)}>
                <span>{section.number}</span>
                <span><strong>{section.title}</strong><small>{section.summary}</small></span>
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
  const section = sections.find((item) => item.id === view);
  const title = section
    ? `${section.title}｜个人档案`
    : view === "archive"
      ? "总目录｜个人档案"
      : view === "search"
        ? "搜索｜个人档案"
        : "个人档案｜文字、摄影与模拟器";
  const description = section?.summary ?? "一处收藏文字、大画幅摄影与模拟器开发过程的个人档案。";
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
      timeZone: "Australia/Sydney",
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
          <span className="identity-cn">个人档案</span>
          <span className="identity-en">WRITING · PHOTOGRAPHY · MAKING</span>
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
              <span>SYDNEY</span><span className="location-dot" aria-hidden="true" /><span>{clock} AEST</span><span>2026</span>
            </footer>
          </aside>

          <section id="section-preview" className={`visual-stage stage-${active}`} aria-live="polite">
            <Preview active={active} navigate={navigate} />
          </section>
        </div>
      )}

      {view === "archive" && <ArchiveView navigate={navigate} />}
      {view === "search" && <SearchView navigate={navigate} />}
      {view !== "home" && view !== "archive" && view !== "search" && <SectionView id={view} navigate={navigate} />}
    </main>
  );
}
