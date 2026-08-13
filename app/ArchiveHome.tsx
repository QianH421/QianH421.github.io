"use client";

import { useEffect, useState } from "react";

const sections = [
  {
    id: "about",
    number: "01",
    title: "个人简介",
    english: "ABOUT",
  },
  {
    id: "writing",
    number: "02",
    title: "文字",
    english: "WRITING",
  },
  {
    id: "photography",
    number: "03",
    title: "大画幅摄影",
    english: "LARGE FORMAT",
  },
  {
    id: "devlog",
    number: "04",
    title: "大画幅模拟器",
    english: "DEVLOG",
  },
] as const;

type SectionId = (typeof sections)[number]["id"];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function PhotographyPreview() {
  return (
    <div className="preview photography-preview">
      <div className="preview-kicker">
        <span>SELECTED WORK · 001</span>
        <span>4 × 5</span>
      </div>

      <figure className="photograph">
        <div className="photograph-mat">
          <img
            src="./images/hero-placeholder.jpg"
            alt="清晨平静海湾中的旧木栈桥——首页摄影占位作品"
          />
        </div>
        <figcaption>
          <div>
            <p className="work-title">静水，习作一</p>
            <p>地点与年份待补</p>
          </div>
          <p className="work-process">4×5 COLOR NEGATIVE · SCAN</p>
        </figcaption>
      </figure>

      <div className="slideshow-controls" aria-label="摄影作品浏览">
        <button type="button" aria-label="上一张作品">←</button>
        <div className="slide-progress"><span /></div>
        <span>01 / 01</span>
        <button type="button" aria-label="下一张作品">→</button>
      </div>
    </div>
  );
}

function AboutPreview() {
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
          <p>
            这里收藏个人经历、写作、大画幅摄影，以及一台虚拟大画幅相机逐步成形的过程。
          </p>
          <button className="text-link" type="button">阅读简介 <Arrow /></button>
        </div>
      </div>
    </div>
  );
}

function WritingPreview() {
  return (
    <div className="preview writing-preview">
      <div className="preview-kicker">
        <span>RECENT WRITING</span>
        <span>02</span>
      </div>
      <div className="writing-sheet">
        <div className="writing-heading">
          <p className="eyebrow">随笔 / 社会评论</p>
          <h2>近期文字</h2>
        </div>
        <ol className="writing-list">
          <li>
            <button type="button">
              <span className="article-date">2026.08</span>
              <span className="article-title">从取景框之外开始</span>
              <span className="article-type">随笔</span>
              <Arrow />
            </button>
          </li>
          <li>
            <button type="button">
              <span className="article-date">2026.07</span>
              <span className="article-title">慢工具与当代生活</span>
              <span className="article-type">评论</span>
              <Arrow />
            </button>
          </li>
          <li>
            <button type="button">
              <span className="article-date">2026.05</span>
              <span className="article-title">一张照片需要多少时间</span>
              <span className="article-type">摄影手记</span>
              <Arrow />
            </button>
          </li>
        </ol>
        <p className="writing-note">标题为首页版式示例，正式内容录入后替换。</p>
      </div>
    </div>
  );
}

function DevlogPreview() {
  return (
    <div className="preview devlog-preview">
      <div className="preview-kicker light">
        <span>LARGE FORMAT CAMERA SIMULATOR</span>
        <span>BUILD 0.1</span>
      </div>
      <div className="simulator-stage">
        <div className="ground-glow" />
        <div className="camera-model" aria-hidden="true">
          <div className="rear-standard"><span /></div>
          <div className="bellows">
            <i /><i /><i /><i /><i />
          </div>
          <div className="front-standard"><span /></div>
          <div className="rail" />
        </div>
        <div className="sim-readout">
          <span>FOCUS 1.84 m</span>
          <span>TILT +2.5°</span>
          <span>RISE +12 mm</span>
        </div>
      </div>
      <div className="devlog-footer">
        <div>
          <p className="eyebrow">LATEST UPDATE · 2026.08</p>
          <h2>正在建立相机位移与焦平面的关系。</h2>
        </div>
        <button className="text-link light-link" type="button">查看开发日志 <Arrow /></button>
      </div>
    </div>
  );
}

function Preview({ active }: { active: SectionId }) {
  return (
    <div key={active} className="preview-transition">
      {active === "about" && <AboutPreview />}
      {active === "writing" && <WritingPreview />}
      {active === "photography" && <PhotographyPreview />}
      {active === "devlog" && <DevlogPreview />}
    </div>
  );
}

export function ArchiveHome() {
  const [active, setActive] = useState<SectionId>("photography");
  const [clock, setClock] = useState("—:—");

  useEffect(() => {
    const format = () =>
      setClock(
        new Intl.DateTimeFormat("en-AU", {
          timeZone: "Australia/Sydney",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    format();
    const interval = window.setInterval(format, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="site-shell">
      <header className="topbar">
        <button className="identity" type="button" onClick={() => setActive("photography")}>
          <span className="identity-cn">个人档案</span>
          <span className="identity-en">WRITING · PHOTOGRAPHY · MAKING</span>
        </button>
        <nav className="utility-nav" aria-label="网站工具">
          <button type="button">ARCHIVE</button>
          <button type="button">SEARCH</button>
          <button type="button">RSS</button>
        </nav>
      </header>

      <div className="home-grid">
        <aside className="section-index" aria-label="主要栏目">
          <div className="section-list" role="tablist" aria-label="首页栏目预览">
            {sections.map((section) => {
              const isActive = active === section.id;
              return (
                <button
                  key={section.id}
                  id={`tab-${section.id}`}
                  className={`section-entry${isActive ? " is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="section-preview"
                  onMouseEnter={() => setActive(section.id)}
                  onFocus={() => setActive(section.id)}
                  onClick={() => setActive(section.id)}
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
          </div>
          <footer className="location-strip">
            <span>SYDNEY</span>
            <span className="location-dot" aria-hidden="true" />
            <span>{clock} AEST</span>
            <span>2026</span>
          </footer>
        </aside>

        <section
          id="section-preview"
          className={`visual-stage stage-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
        >
          <Preview active={active} />
        </section>
      </div>
    </main>
  );
}
