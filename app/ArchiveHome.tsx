import { useCallback, useEffect, useRef, useState } from "react";
import { entriesFor } from "./content";

const series = entriesFor("photography")[0];
const landscapeWorks = new Set([5, 8]);

function numberFor(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ArchiveHome() {
  const [activeWork, setActiveWork] = useState<number | null>(null);
  const workButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const viewerCloseButton = useRef<HTMLButtonElement | null>(null);
  const hero = series.images[5];

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

  return (
    <main className="site-shell" id="top">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="回到页首">
          <span>大画幅摄影</span>
          <small>LARGE FORMAT WORKS</small>
        </a>
        <nav aria-label="主导航">
          <a href="#works">作品</a>
          <a href="#series">系列</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">LARGE FORMAT PHOTOGRAPHY · 4 × 5</p>
          <h1 id="hero-title">在更慢的<br />目光里观看。</h1>
          <p className="intro">一组拍摄于皇家国家公园的大画幅摄影作品。九张照片，保留完整画幅，不作裁切。</p>
          <a className="view-link" href="#works">
            观看作品 <span aria-hidden="true">↓</span>
          </a>
        </div>

        <figure className="hero-frame">
          <img src={`./${hero.src}`} alt={hero.alt} fetchPriority="high" />
          <figcaption>
            <span>ROYAL NATIONAL PARK</span>
            <span>06 / 09</span>
          </figcaption>
        </figure>
      </section>

      <section className="series-intro" id="series" aria-labelledby="series-title">
        <div>
          <p className="eyebrow">SERIES 001 · 2026</p>
          <h2 id="series-title">皇家国家公园</h2>
          <p className="series-english">ROYAL NATIONAL PARK</p>
        </div>
        <div className="series-note">
          <p>从沙岩台地看向海岸，地层、浪线与灌木在一块块磨玻璃上慢慢定形。这个系列保留了现场的完整视野，也保留了大画幅摄影所需要的等待。</p>
          <dl>
            <div><dt>LOCATION</dt><dd>{series.location}</dd></div>
            <div><dt>DATE</dt><dd>{series.year}</dd></div>
            <div><dt>PROCESS</dt><dd>{series.process}</dd></div>
            <div><dt>EDITION</dt><dd>09 PHOTOGRAPHS</dd></div>
          </dl>
        </div>
      </section>

      <section className="gallery" id="works" aria-label="九张大画幅摄影作品">
        {series.images.map((image, index) => {
          const orientation = landscapeWorks.has(index) ? "landscape" : "portrait";
          return (
            <figure className={`work work-${orientation} work-${index + 1}`} key={image.src}>
              <button
                className="work-image"
                type="button"
                onClick={() => setActiveWork(index)}
                ref={(element) => { workButtons.current[index] = element; }}
                aria-label={`放大查看作品 ${numberFor(index)}：${image.label}`}
              >
                <img src={`./${image.src}`} alt={image.alt} loading={index < 2 ? "eager" : "lazy"} />
                <span className="enlarge-cue" aria-hidden="true">VIEW</span>
              </button>
              <figcaption>
                <span>RNP — {numberFor(index)}</span>
                <span>{orientation === "landscape" ? "LANDSCAPE" : "PORTRAIT"} · FULL FRAME</span>
              </figcaption>
            </figure>
          );
        })}
      </section>

      <section className="closing-note" aria-label="作品说明">
        <p className="eyebrow">FIELD NOTE</p>
        <blockquote>
          “更慢”并不只是曝光的时间，<br />也是按下快门之前的观看。
        </blockquote>
        <a href="#top">回到顶部 <span aria-hidden="true">↑</span></a>
      </section>

      <footer>
        <span>LARGE FORMAT PHOTOGRAPHY</span>
        <span>SYDNEY, AUSTRALIA</span>
        <span>© 2026</span>
      </footer>

      {activeWork !== null && (
        <div
          className="viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`作品 ${numberFor(activeWork)} 放大视图`}
        >
          <div className="viewer-bar">
            <span>RNP — {numberFor(activeWork)} / {numberFor(series.images.length - 1)}</span>
            <button type="button" onClick={closeViewer} ref={viewerCloseButton}>关闭 <span aria-hidden="true">×</span></button>
          </div>
          <div className="viewer-stage">
            <button type="button" className="viewer-previous" onClick={() => showWork(-1)} aria-label="上一张作品">←</button>
            <img src={`./${series.images[activeWork].src}`} alt={series.images[activeWork].alt} />
            <button type="button" className="viewer-next" onClick={() => showWork(1)} aria-label="下一张作品">→</button>
          </div>
          <p className="viewer-help">使用键盘方向键浏览 · ESC 退出</p>
        </div>
      )}
    </main>
  );
}
