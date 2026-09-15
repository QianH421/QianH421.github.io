import { useCallback, useEffect, useRef, useState } from "react";
import { entriesFor } from "./content";

const series = entriesFor("photography")[0];
const landscapeWorks = new Set([5, 8]);

const englishAlt = [
  "A rocky shoreline reaches into the sea, crossed by a line of square stepping stones with low shrubs on the right.",
  "Layered sea cliffs seen from above, with the rock face extending along the right and ocean and reefs to the left.",
  "Sea cliffs and reefs recede into the distance on the right as waves unfold along the rocky shore.",
  "A bay seen from a sandstone plateau, where blue-green water meets a distant beach and low coastal shrubs.",
  "Open sea fills the left of the frame while red-brown rock and shrubs lead towards distant cliffs.",
  "A wide view of open water and a red-brown rocky shoreline extending in parallel towards distant cliffs.",
  "A bright white sandstone platform in the foreground beneath a deep blue sea and a clear horizon.",
  "A bay seen from above, unfolding through blue-green water, a distant beach and a red-brown sandstone plateau.",
  "A wide view of sea and rocky coastline receding into the distance, bordered by low shrubs on the right.",
];

const copy = {
  en: {
    brand: "Large Format Photography",
    brandSmall: "LARGE FORMAT WORKS",
    works: "Works",
    series: "Series",
    navigation: "Main navigation",
    language: "Language",
    heroKicker: "LARGE FORMAT PHOTOGRAPHY · 4 × 5",
    heroLines: ["Looking with", "a slower gaze."],
    intro: "A series of large-format photographs made in Royal National Park. Nine photographs, presented full frame and uncropped.",
    viewWorks: "View the works",
    seriesKicker: "SERIES 001 · 2026",
    seriesTitle: "Royal National Park",
    seriesSecondary: "皇家国家公园",
    seriesNote: "Looking out from the sandstone plateau, layers of rock, surf and coastal scrub slowly settle onto each sheet of ground glass. This series preserves the full view found in the field, as well as the waiting that large-format photography asks of us.",
    location: "LOCATION",
    date: "DATE",
    dateValue: "JULY 2026",
    process: "PROCESS",
    edition: "SEQUENCE",
    editionValue: "09 PHOTOGRAPHS",
    galleryLabel: "Nine large-format photographs",
    vertical: "VERTICAL",
    horizontal: "HORIZONTAL",
    fullFrame: "FULL FRAME",
    view: "VIEW",
    enlarge: "Enlarge work",
    artistNote: "ARTIST'S NOTE",
    quote: "What you photograph is exactly what you see.",
    authorship: "WRITTEN BY THE ARTIST · NOT AI-GENERATED",
    backToTop: "Back to top",
    copyright: "© 2026",
    close: "Close",
    previous: "Previous work",
    next: "Next work",
    viewer: "enlarged view",
    viewerHelp: "USE THE ARROW KEYS TO BROWSE · ESC TO EXIT",
  },
  zh: {
    brand: "大画幅摄影",
    brandSmall: "LARGE FORMAT WORKS",
    works: "作品",
    series: "系列",
    navigation: "主导航",
    language: "语言",
    heroKicker: "LARGE FORMAT PHOTOGRAPHY · 4 × 5",
    heroLines: ["在更慢的", "目光里观看。"],
    intro: "一组拍摄于皇家国家公园的大画幅摄影作品。九张照片，保留完整画幅，不作裁切。",
    viewWorks: "观看作品",
    seriesKicker: "SERIES 001 · 2026",
    seriesTitle: "皇家国家公园",
    seriesSecondary: "ROYAL NATIONAL PARK",
    seriesNote: "从沙岩台地看向海岸，地层、浪线与灌木在一块块磨玻璃上慢慢定形。这个系列保留了现场的完整视野，也保留了大画幅摄影所需要的等待。",
    location: "地点",
    date: "日期",
    dateValue: series.year,
    process: "工艺",
    edition: "序列",
    editionValue: "09 张摄影作品",
    galleryLabel: "九张大画幅摄影作品",
    vertical: "竖幅",
    horizontal: "横幅",
    fullFrame: "完整画幅",
    view: "观看",
    enlarge: "放大查看作品",
    artistNote: "作者题记",
    quote: "你拍到的就是你看到的东西。",
    authorship: "作者原创 · 非 AI 生成内容",
    backToTop: "回到顶部",
    copyright: "© 2026",
    close: "关闭",
    previous: "上一张作品",
    next: "下一张作品",
    viewer: "放大视图",
    viewerHelp: "使用键盘方向键浏览 · ESC 退出",
  },
} as const;

type Language = keyof typeof copy;

function numberFor(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ArchiveHome() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeWork, setActiveWork] = useState<number | null>(null);
  const workButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const viewerCloseButton = useRef<HTMLButtonElement | null>(null);
  const hero = series.images[5];
  const text = copy[language];

  const closeViewer = useCallback(() => {
    const closingIndex = activeWork;
    setActiveWork(null);
    window.requestAnimationFrame(() => {
      if (closingIndex !== null) workButtons.current[closingIndex]?.focus();
    });
  }, [activeWork]);

  const showWork = useCallback((direction: -1 | 1) => {
    setActiveWork((current) => {
      if (current === null) return 0;
      return (current + direction + series.images.length) % series.images.length;
    });
  }, []);

  useEffect(() => {
    const isEnglish = language === "en";
    document.documentElement.lang = isEnglish ? "en" : "zh-CN";
    document.title = isEnglish
      ? "Looking with a Slower Gaze | Large Format Photography"
      : "在更慢的目光里观看｜大画幅摄影";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      isEnglish
        ? "Nine large-format photographs made in Royal National Park, presented full frame and uncropped."
        : "一组拍摄于皇家国家公园的大画幅摄影作品，保留完整画幅，不作裁切。",
    );
  }, [language]);

  useEffect(() => {
    if (activeWork === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowLeft") showWork(-1);
      if (event.key === "ArrowRight") showWork(1);
    };

    document.body.style.overflow = "hidden";
    viewerCloseButton.current?.focus();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeWork, closeViewer, showWork]);

  const altFor = (index: number) => language === "en" ? englishAlt[index] : series.images[index].alt;

  return (
    <main className="site-shell" id="top">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label={text.backToTop}>
          <span>{text.brand}</span>
          <small>{text.brandSmall}</small>
        </a>
        <div className="masthead-actions">
          <nav aria-label={text.navigation}>
            <a href="#works">{text.works}</a>
            <a href="#series">{text.series}</a>
          </nav>
          <div className="language-switch" role="group" aria-label={text.language}>
            <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={language === "zh"} onClick={() => setLanguage("zh")}>中文</button>
          </div>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">{text.heroKicker}</p>
          <h1 id="hero-title">{text.heroLines[0]}<br />{text.heroLines[1]}</h1>
          <p className="intro">{text.intro}</p>
          <a className="view-link" href="#works">
            {text.viewWorks} <span aria-hidden="true">↓</span>
          </a>
        </div>

        <figure className="hero-frame">
          <img src={`./${hero.src}`} alt={altFor(5)} fetchPriority="high" />
          <figcaption>
            <span>ROYAL NATIONAL PARK</span>
            <span>06 / 09</span>
          </figcaption>
        </figure>
      </section>

      <section className="series-intro" id="series" aria-labelledby="series-title">
        <div>
          <p className="eyebrow">{text.seriesKicker}</p>
          <h2 id="series-title">{text.seriesTitle}</h2>
          <p className="series-english">{text.seriesSecondary}</p>
        </div>
        <div className="series-note">
          <p>{text.seriesNote}</p>
          <dl>
            <div><dt>{text.location}</dt><dd>{series.location}</dd></div>
            <div><dt>{text.date}</dt><dd>{text.dateValue}</dd></div>
            <div><dt>{text.process}</dt><dd>{series.process}</dd></div>
            <div><dt>{text.edition}</dt><dd>{text.editionValue}</dd></div>
          </dl>
        </div>
      </section>

      <section className="gallery" id="works" aria-label={text.galleryLabel}>
        {series.images.map((image, index) => {
          const orientation = landscapeWorks.has(index) ? "landscape" : "portrait";
          return (
            <figure className={`work work-${orientation} work-${index + 1}`} key={image.src}>
              <button
                className="work-image"
                type="button"
                onClick={() => setActiveWork(index)}
                ref={(element) => { workButtons.current[index] = element; }}
                aria-label={`${text.enlarge} ${numberFor(index)}: ${image.label}`}
              >
                <img src={`./${image.src}`} alt={altFor(index)} loading={index < 2 ? "eager" : "lazy"} />
                <span className="enlarge-cue" aria-hidden="true">{text.view}</span>
              </button>
              <figcaption>
                <span>RNP — {numberFor(index)}</span>
                <span>{orientation === "landscape" ? text.horizontal : text.vertical} · {text.fullFrame}</span>
              </figcaption>
            </figure>
          );
        })}
      </section>

      <section className="closing-note" aria-label={text.artistNote}>
        <p className="eyebrow">{text.artistNote}</p>
        <blockquote lang={language === "en" ? "en" : "zh-CN"}>“{text.quote}”</blockquote>
        <p className="authorship-mark">{text.authorship}</p>
        <a href="#top">{text.backToTop} <span aria-hidden="true">↑</span></a>
      </section>

      <footer>
        <span>LARGE FORMAT PHOTOGRAPHY</span>
        <span>SYDNEY, AUSTRALIA</span>
        <span>{text.copyright}</span>
      </footer>

      {activeWork !== null && (
        <div className="viewer" role="dialog" aria-modal="true" aria-label={`${text.enlarge} ${numberFor(activeWork)} ${text.viewer}`}>
          <div className="viewer-bar">
            <span>RNP — {numberFor(activeWork)} / {numberFor(series.images.length - 1)}</span>
            <button type="button" onClick={closeViewer} ref={viewerCloseButton}>{text.close} <span aria-hidden="true">×</span></button>
          </div>
          <div className="viewer-stage">
            <button type="button" className="viewer-previous" onClick={() => showWork(-1)} aria-label={text.previous}>←</button>
            <img src={`./${series.images[activeWork].src}`} alt={altFor(activeWork)} />
            <button type="button" className="viewer-next" onClick={() => showWork(1)} aria-label={text.next}>→</button>
          </div>
          <p className="viewer-help">{text.viewerHelp}</p>
        </div>
      )}
    </main>
  );
}
