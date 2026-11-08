"use client";

import { useEffect, useRef, useState } from "react";

/** Round navy "back to top" button with a progress ring that fills as you scroll. Appears after 500px. */
export default function ScrollTop() {
  const btn = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      btn.current?.style.setProperty("--p", Math.min(1, y / max).toFixed(3));
      setShow(y > 500);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
  };

  const arrow = (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );

  return (
    <>
      <style>{CSS}</style>
      <button ref={btn} type="button" className={`stt${show ? " show" : ""}`} onClick={toTop} aria-label="Back to top" tabIndex={show ? 0 : -1}>
        <svg className="stt-ring" viewBox="0 0 60 60" aria-hidden="true">
          <defs>
            <linearGradient id="stt-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F7A21B" />
              <stop offset="0.55" stopColor="#F26B3A" />
              <stop offset="1" stopColor="#FF5C8A" />
            </linearGradient>
          </defs>
          <circle cx="30" cy="30" r="27" className="stt-bg" />
          <circle cx="30" cy="30" r="27" className="stt-fg" />
        </svg>
        <span className="stt-a stt-a1">{arrow}</span>
        <span className="stt-a stt-a2">{arrow}</span>
      </button>
    </>
  );
}

const CSS = `
.stt { position: fixed; z-index: 60; right: max(20px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom));
  width: 54px; height: 54px; padding: 0; border: 0; border-radius: 50%; overflow: hidden; cursor: pointer; color: #fff; background: #0f2a5c;
  box-shadow: 0 10px 26px rgba(15,42,92,.35); -webkit-tap-highlight-color: transparent;
  opacity: 0; visibility: hidden; transform: translateY(16px) scale(.9);
  transition: opacity .35s ease, transform .35s ease, visibility .35s, box-shadow .3s ease; }
.stt.show { opacity: 1; visibility: visible; transform: none; }
.stt:hover { box-shadow: 0 14px 32px rgba(15,42,92,.5); transform: translateY(-3px); }
.stt:focus-visible { outline: 3px solid #7FE8F5; outline-offset: 3px; }

.stt-ring { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.stt-bg, .stt-fg { fill: none; stroke-width: 3; }
.stt-bg { stroke: rgba(255,255,255,.16); }
.stt-fg { stroke: url(#stt-grad); stroke-linecap: round; stroke-dasharray: 169.65; stroke-dashoffset: calc(169.65 * (1 - var(--p, 0))); }

/* the arrow slides up and a second one slides in from below on hover */
.stt-a { position: absolute; inset: 0; display: grid; place-items: center; transition: transform .35s cubic-bezier(.2,.7,.2,1); }
.stt-a2 { transform: translateY(120%); }
.stt:hover .stt-a1 { transform: translateY(-120%); }
.stt:hover .stt-a2 { transform: none; }

@media (prefers-reduced-motion: reduce) { .stt, .stt-a { transition: none; } }
`;