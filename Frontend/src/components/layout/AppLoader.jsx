import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const APP_ROOT_ID = "root";   // the id of your React mount element
const MIN_DISPLAY_MS = 1000;   // brief opening screen
const FAILSAFE_MS = 15000;    // only so a stalled asset can never trap the user
const EXIT_GUARD_MS = 1400;   // backup in case animationend never fires

// 28 tick marks around a 270° dial; the last 5 are the redline.
const TICKS = Array.from({ length: 28 }, (_, i) => {
  const angle = ((135 + i * 10) * Math.PI) / 180;
  const major = i % 3 === 0;
  const inner = major ? 85 : 89;
  const outer = 95;
  return {
    x1: 100 + inner * Math.cos(angle),
    y1: 100 + inner * Math.sin(angle),
    x2: 100 + outer * Math.cos(angle),
    y2: 100 + outer * Math.sin(angle),
    red: i >= 23,
    major,
  };
});

// Real readiness: all page assets loaded + web fonts ready.
const useWindowReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    let onLoad;
    const loaded = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        onLoad = resolve;
        window.addEventListener("load", onLoad, { once: true });
      }
    });
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    Promise.all([loaded, fontsReady]).then(markReady);
    const failsafe = setTimeout(markReady, FAILSAFE_MS);

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
      if (onLoad) window.removeEventListener("load", onLoad);
    };
  }, []);

  return ready;
};

/**
 * Full-screen loader.
 * `isReady` lets you add your own app state (auth hydrated, first data fetched…).
 * The screen dismisses only when the window is ready AND isReady is true.
 */
const AppLoader = ({ isReady = true }) => {
  const windowReady = useWindowReady();
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const ready = windowReady && isReady && minimumElapsed;
  const [phase, setPhase] = useState("loading"); // loading | exiting | done
  const guardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumElapsed(true), MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) setPhase((current) => (current === "loading" ? "exiting" : current));
  }, [ready]);

  // Block the page underneath while the loader is visible.
  useEffect(() => {
    if (phase === "done") return undefined;

    const appRoot = document.getElementById(APP_ROOT_ID);
    const previousOverflow = document.documentElement.style.overflow;

    appRoot?.setAttribute("inert", "");
    appRoot?.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "hidden";

    return () => {
      appRoot?.removeAttribute("inert");
      appRoot?.removeAttribute("aria-hidden");
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [phase]);

  // Backup so the overlay can never stay if an animation event is missed.
  useEffect(() => {
    if (phase !== "exiting") return undefined;
    guardRef.current = setTimeout(() => setPhase("done"), EXIT_GUARD_MS);
    return () => clearTimeout(guardRef.current);
  }, [phase]);

  if (phase === "done") return null;

  const handleAnimationEnd = (event) => {
    if (phase === "exiting" && event.target.dataset.panel === "top") setPhase("done");
  };

  // Portal to <body> so the loader sits outside the inert app root
  // and screen readers can still announce it.
  return createPortal(
    <div
      className="rvx-root"
      data-phase={phase}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
      onAnimationEnd={handleAnimationEnd}
    >
      <style>{LOADER_CSS}</style>

      <div className="rvx-panel rvx-panel-top" data-panel="top" />
      <div className="rvx-panel rvx-panel-bottom" />
      <div className="rvx-seam" aria-hidden="true" />

      <div className="rvx-content">
        <div className="rvx-glow" aria-hidden="true" />

        <svg
          className="rvx-dial"
          viewBox="0 0 200 200"
          aria-hidden="true"
          focusable="false"
        >
          {TICKS.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.red ? "#f05a1a" : "#ffffff"}
              strokeOpacity={t.red ? 0.9 : t.major ? 0.45 : 0.2}
              strokeWidth={t.major ? 2 : 1.2}
              strokeLinecap="round"
            />
          ))}

          {/* track */}
          <path
            d="M 44.85 155.15 A 78 78 0 1 1 155.15 155.15"
            pathLength="100"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.08"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* revving arc */}
          <path
            className="rvx-arc"
            d="M 44.85 155.15 A 78 78 0 1 1 155.15 155.15"
            pathLength="100"
            fill="none"
            stroke="#f05a1a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* needle */}
          <g className="rvx-needle">
            <line
              x1="100"
              y1="100"
              x2="56.2"
              y2="143.8"
              stroke="#f05a1a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
          <circle cx="100" cy="100" r="6" fill="#f05a1a" />
          <circle cx="100" cy="100" r="2.5" fill="#131315" />
        </svg>

        <p className="rvx-wordmark">
          REV<span>EX</span>
        </p>

        <p className="rvx-message">
          {phase === "loading" ? "Preparing your drive" : "Ready"}
          <span aria-hidden="true" className="rvx-dots">
            <i />
            <i />
            <i />
          </span>
        </p>
      </div>
    </div>,
    document.body
  );
};

const LOADER_CSS = `
.rvx-root{position:fixed;inset:0;z-index:9999;overflow:hidden;color:#fff;font-family:inherit}

/* Door panels: lighter near the seam, like light spilling from a showroom */
.rvx-panel{position:absolute;left:0;right:0;height:50%}
.rvx-panel-top{top:0;background:linear-gradient(to bottom,#0b0b0d,#1b1b1e)}
.rvx-panel-bottom{bottom:0;background:linear-gradient(to top,#0b0b0d,#1b1b1e)}

.rvx-seam{position:absolute;left:0;right:0;top:50%;height:1px;transform:translateY(-50%);
  background:linear-gradient(90deg,transparent,#f05a1a 30%,#f05a1a 70%,transparent);
  box-shadow:0 0 18px 1px rgba(240,90,26,.55);animation:rvx-seam-in .9s ease-out both}

.rvx-content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:1.1rem;padding:1.5rem;animation:rvx-in .6s ease-out both}
.rvx-glow{position:absolute;width:min(90vw,560px);aspect-ratio:1;border-radius:9999px;pointer-events:none;
  background:radial-gradient(closest-side,rgba(240,90,26,.16),transparent)}

.rvx-dial{position:relative;width:min(58vw,240px);height:auto;overflow:visible}
.rvx-arc{filter:drop-shadow(0 0 6px rgba(240,90,26,.65));
  animation:rvx-rev-arc 1.8s cubic-bezier(.65,0,.35,1) infinite alternate}
.rvx-needle{transform-origin:100px 100px;
  animation:rvx-rev-needle 1.8s cubic-bezier(.65,0,.35,1) infinite alternate}

.rvx-wordmark{position:relative;margin:.25rem 0 0;font-size:clamp(2rem,7vw,2.75rem);font-weight:900;
  font-style:italic;letter-spacing:-.04em;line-height:1}
.rvx-wordmark span{color:#f05a1a}

.rvx-message{position:relative;margin:0;font-size:.7rem;font-weight:600;letter-spacing:.3em;
  text-transform:uppercase;color:rgba(255,255,255,.6)}
.rvx-dots{display:inline-flex;gap:.25em;margin-left:.45em}
.rvx-dots i{width:3px;height:3px;border-radius:9999px;background:#f05a1a;animation:rvx-dot 1.2s ease-in-out infinite}
.rvx-dots i:nth-child(2){animation-delay:.2s}
.rvx-dots i:nth-child(3){animation-delay:.4s}

/* Exit: content out, seam flash, doors open */
.rvx-root[data-phase="exiting"] .rvx-content{animation:rvx-out .35s ease-in forwards}
.rvx-root[data-phase="exiting"] .rvx-seam{animation:rvx-seam-flash .5s ease-out forwards}
.rvx-root[data-phase="exiting"] .rvx-panel-top{animation:rvx-up .75s cubic-bezier(.76,0,.24,1) .2s forwards}
.rvx-root[data-phase="exiting"] .rvx-panel-bottom{animation:rvx-down .75s cubic-bezier(.76,0,.24,1) .2s forwards}

@keyframes rvx-in{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
@keyframes rvx-out{to{opacity:0;transform:scale(1.07);filter:blur(4px)}}
@keyframes rvx-seam-in{from{transform:translateY(-50%) scaleX(0);opacity:0}to{transform:translateY(-50%) scaleX(1);opacity:1}}
@keyframes rvx-seam-flash{0%{opacity:1}40%{height:5px;opacity:1}100%{height:5px;opacity:0}}
@keyframes rvx-up{to{transform:translateY(-100%)}}
@keyframes rvx-down{to{transform:translateY(100%)}}
@keyframes rvx-rev-needle{from{transform:rotate(0deg)}to{transform:rotate(270deg)}}
@keyframes rvx-rev-arc{from{stroke-dasharray:4 96}to{stroke-dasharray:100 0}}
@keyframes rvx-dot{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes rvx-fade{to{opacity:0}}

/* Reduced motion: static dial, simple quick fade, no sliding */
@media (prefers-reduced-motion:reduce){
  .rvx-content,.rvx-seam,.rvx-arc,.rvx-needle,.rvx-dots i{animation:none}
  .rvx-arc{stroke-dasharray:55 45}
  .rvx-needle{transform:rotate(148deg)}
  .rvx-dots i{opacity:.6}
  .rvx-root[data-phase="exiting"] .rvx-content,
  .rvx-root[data-phase="exiting"] .rvx-seam{animation:rvx-fade .2s linear forwards}
  .rvx-root[data-phase="exiting"] .rvx-panel-top,
  .rvx-root[data-phase="exiting"] .rvx-panel-bottom{animation:rvx-fade .2s linear forwards}
}
`;

export default AppLoader;
