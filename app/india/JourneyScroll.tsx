"use client";

import { useEffect, useRef } from "react";

export type JourneyStep = { n: string; t: string; d: string; c: string };

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// Card surfaces: each card is slightly different so the stack reads clearly.
const SURFACES = [
  { bg: "#0f2a3d", fg: "#ffffff" },
  { bg: "#14384f", fg: "#ffffff" },
  { bg: "#f4efe6", fg: "#10202c" },
  { bg: "#e9dfcb", fg: "#10202c" },
];

export default function JourneyScroll({ steps }: { steps: JourneyStep[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-stk-card]"));
    const inners = cards.map((c) => c.querySelector<HTMLElement>("[data-stk-inner]")!);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      root.dataset.static = "true";
      return;
    }

    let ticking = false;

    const update = () => {
      ticking = false;

      // Progress (0..1) of each card being covered by the next one.
      const covered: number[] = cards.map((el, i) => {
        const next = cards[i + 1];
        if (!next) return 0;
        const stickyTop = parseFloat(getComputedStyle(el).top) || 0;
        const nextStickyTop = parseFloat(getComputedStyle(next).top) || 0;
        const h = el.offsetHeight || 1;
        const nextTop = next.getBoundingClientRect().top;
        return clamp(1 - (nextTop - nextStickyTop) / h);
      });

      cards.forEach((_, i) => {
        // Depth = how many cards are piled on top of this one (fractional).
        let depth = 0;
        for (let j = i; j < covered.length; j++) depth += covered[j];

        const scale = 1 - Math.min(depth, 3) * 0.045;
        const dim = Math.min(depth, 3) * 0.14;
        const inner = inners[i];
        inner.style.transform = `scale(${scale.toFixed(4)})`;
        inner.style.setProperty("--stk-dim", dim.toFixed(3));
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    root.dataset.ready = "true";
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="stk-root" ref={rootRef}>
      {steps.map((s, i) => {
        const surface = SURFACES[i % SURFACES.length];
        return (
          <div
            className="stk-card"
            data-stk-card
            key={s.n}
            style={{ ["--i" as string]: i } as React.CSSProperties}
          >
            <article
              className="stk-inner"
              data-stk-inner
              style={{ background: surface.bg, color: surface.fg }}
            >
              <div className="stk-num" aria-hidden="true">{s.n}</div>
              <div className="stk-body">
                <span className="stk-tag">Step {s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
              <span className="stk-dim" aria-hidden="true" />
            </article>
          </div>
        );
      })}

      <style>{`
        .stk-root {
          --stk-top: 110px;   /* distance from top of viewport where cards pin */
          --stk-step: 22px;   /* peek offset between stacked cards */
          position: relative;
          padding-bottom: 4vh;
        }

        .stk-card {
          position: sticky;
          top: calc(var(--stk-top) + var(--i) * var(--stk-step));
          margin-bottom: 38vh; /* scroll distance before the next card covers this one */
        }
        .stk-card:last-child { margin-bottom: 0; }

        .stk-inner {
          position: relative;
          display: grid;
          grid-template-columns: minmax(120px, 0.35fr) 1fr;
          align-items: center;
          gap: clamp(20px, 4vw, 56px);
          min-height: 320px;
          padding: clamp(28px, 5vw, 56px);
          border-radius: 28px;
          overflow: hidden;
          transform-origin: center top;
          box-shadow: 0 24px 60px -24px rgba(8, 20, 30, 0.55);
          will-change: transform;
        }

        .stk-num {
          font-size: clamp(88px, 16vw, 200px);
          font-weight: 800;
          line-height: 0.85;
          letter-spacing: -0.04em;
          color: var(--gold, #d4a017);
          user-select: none;
        }

        .stk-tag {
          display: inline-block;
          margin-bottom: 14px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid currentColor;
          opacity: 0.75;
        }

        .stk-body h3 {
          margin: 0 0 12px;
          font-size: clamp(26px, 3.4vw, 42px);
          line-height: 1.1;
          color: inherit;
        }
        .stk-body p {
          margin: 0;
          max-width: 58ch;
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.6;
          color: inherit;
          opacity: 0.88;
        }

        /* Darkening veil that deepens as cards pile on top */
        .stk-dim {
          position: absolute;
          inset: 0;
          background: #000;
          opacity: var(--stk-dim, 0);
          pointer-events: none;
        }

        @media (max-width: 720px) {
          .stk-root { --stk-top: 84px; --stk-step: 14px; }
          .stk-inner { grid-template-columns: 1fr; min-height: 0; border-radius: 22px; }
          .stk-num { font-size: 72px; }
          .stk-card { margin-bottom: 30vh; }
        }

        /* Reduced motion: plain stacked list, no sticky, no transforms */
        .stk-root[data-static="true"] .stk-card {
          position: static;
          margin-bottom: 20px;
        }
        .stk-root[data-static="true"] .stk-inner { transform: none; }
      `}</style>
    </div>
  );
}