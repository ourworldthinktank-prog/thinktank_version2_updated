"use client";

import { useEffect, useRef } from "react";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (t: number) => t * t * (3 - 2 * t);

/* ------------------------------------------------------------------ */
/* Pillars: pinned stage, number + text swap as you scroll             */
/* ------------------------------------------------------------------ */

export type Pillar = { n: string; t: string; d: string };

const pillarCss = `
.pl { position: relative; background: #0b1030; color: #fff; }
.pl-stage { position: relative; isolation: isolate; overflow: hidden; padding: 56px 0 40px; }
.pl-bg {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(60vw 60vw at 88% 8%, rgba(83,109,255,.38), transparent 62%),
    radial-gradient(50vw 50vw at 4% 96%, rgba(39,198,183,.26), transparent 62%),
    radial-gradient(30vw 30vw at 50% 50%, rgba(139,92,255,.16), transparent 70%);
}
.pl-bg::after {
  content: ""; position: absolute; inset: 0; opacity: .5;
  background-image: radial-gradient(rgba(255,255,255,.16) .8px, transparent .8px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}
.pl-slides { list-style: none; margin: 0; padding: 0; position: relative; }
.pl-s {
  --tx: 55vw; --bl: 14px; --ty: 44px; --g1: 9vw; --g2: 18vw;
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center; gap: clamp(20px, 5vw, 80px);
  width: min(1160px, calc(100% - 48px)); margin: 0 auto;
  padding: 40px 0; border-top: 1px solid rgba(255,255,255,.12);
}
.pl[data-rm="true"] .pl-s { --tx: 0vw; --bl: 0px; --ty: 0px; --g1: 0vw; --g2: 0vw; }
.pl-n {
  position: relative; isolation: isolate; display: inline-block; justify-self: start;
  font-size: clamp(6rem, 20vw, 15rem); font-weight: 900; line-height: .85;
  letter-spacing: -.07em; color: #fff;
}
.pl-n::before, .pl-n::after {
  content: attr(data-n); position: absolute; left: 0; top: 0; z-index: -1;
  pointer-events: none; opacity: 0;
}
.pl-n::before { color: var(--ab-blue, #536DFF); }
.pl-n::after { color: var(--ab-aqua, #27C6B7); }
.pl-tag {
  display: inline-block; margin-bottom: 18px; padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(201,232,121,.5); color: var(--ab-lime, #C9E879);
  font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
}
.pl-t h3 {
  margin: 0; color: #fff; font-size: clamp(2.1rem, 5vw, 4.4rem);
  line-height: 1; letter-spacing: -.05em; font-weight: 850;
}
.pl-t h3::after {
  content: ""; display: block; width: 84px; height: 4px; margin: 22px 0 20px; border-radius: 4px;
  background: linear-gradient(90deg, var(--ab-blue, #536DFF), var(--ab-aqua, #27C6B7), var(--ab-lime, #C9E879));
}
.pl-t p { margin: 0; max-width: 40ch; color: rgba(255,255,255,.76); font-size: clamp(1rem, 1.5vw, 1.2rem); line-height: 1.65; }
.pl-bar { display: none; }
.pl-foot {
  width: min(1160px, calc(100% - 48px)); margin: 28px auto 0;
  display: flex; justify-content: space-between; align-items: center; gap: 20px;
  color: rgba(255,255,255,.55); font-size: .74rem; letter-spacing: .1em; text-transform: uppercase;
}

/* Enhanced (JS ready): pinned stage driven by --in / --out per slide */
.pl[data-ready="true"] { height: 900vh; height: 900svh; }
.pl[data-ready="true"] .pl-stage { position: sticky; top: 0; height: 100vh; height: 100svh; padding: 0; }
.pl[data-ready="true"] .pl-slides { position: absolute; inset: 0; }
.pl[data-ready="true"] .pl-s {
  position: absolute; inset: 0; margin: 0 auto; padding: 0 0 6vh; border: 0; align-content: center;
  opacity: calc(var(--in, 1) * (1 - var(--out, 0)));
}
.pl[data-ready="true"] .pl-n {
  transform: translate3d(calc((1 - var(--in, 1) - var(--out, 0)) * var(--tx)), 0, 0)
             scale(calc(1 - (1 - var(--in, 1) + var(--out, 0)) * .15));
  filter: blur(calc((1 - var(--in, 1) + var(--out, 0)) * var(--bl)));
  will-change: transform, filter;
}
.pl[data-ready="true"] .pl-n::before {
  opacity: calc((1 - var(--in, 1) + var(--out, 0)) * .6);
  transform: translate3d(calc((1 - var(--in, 1) + var(--out, 0)) * var(--g1)), 0, 0);
}
.pl[data-ready="true"] .pl-n::after {
  opacity: calc((1 - var(--in, 1) + var(--out, 0)) * .4);
  transform: translate3d(calc((1 - var(--in, 1) + var(--out, 0)) * var(--g2)), 0, 0);
}
.pl[data-ready="true"] .pl-t {
  transform: translate3d(0, calc((1 - var(--in, 1) - var(--out, 0)) * var(--ty)), 0);
}
.pl[data-ready="true"] .pl-bar,
.pl[data-ready="true"] .pl-foot {
  position: absolute; left: 50%; translate: -50% 0; width: min(1160px, calc(100% - 48px));
}
.pl[data-ready="true"] .pl-bar { display: block; bottom: 5vh; height: 2px; background: rgba(255,255,255,.16); }
.pl[data-ready="true"] .pl-bar i {
  display: block; height: 100%; transform-origin: left; transform: scaleX(var(--p, 0));
  background: linear-gradient(90deg, var(--ab-blue, #536DFF), var(--ab-aqua, #27C6B7), var(--ab-lime, #C9E879));
}
.pl[data-ready="true"] .pl-foot { bottom: calc(5vh + 16px); margin: 0; }

@media (max-width: 700px) {
  .pl-s { grid-template-columns: 1fr; gap: 6px; }
  .pl-n { font-size: clamp(6.5rem, 34vw, 10rem); }
  .pl-t h3 { font-size: clamp(1.9rem, 9vw, 2.8rem); }
  .pl-t h3::after { margin: 16px 0 14px; }
}
@media (max-width: 600px) {
  .pl-foot { flex-direction: column; align-items: flex-start; gap: 4px; }
}
`;

export function PillarsStage({ pillars }: { pillars: Pillar[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const N = pillars.length;
    const HALF = 0.05; // half-width of each hand-over, as a share of total scroll
    // Reduced motion: keep the scroll-linked swap, but as a plain cross-fade (no travel, no blur).
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.rm = rm ? "true" : "false";

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const rect = root.getBoundingClientRect();
      const p = clamp(-rect.top / Math.max(1, rect.height - vh));
      root.style.setProperty("--p", p.toFixed(4));

      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const inP = i === 0 ? 1 : ease(clamp((p - (i / N - HALF)) / (2 * HALF)));
        const outP = i === N - 1 ? 0 : ease(clamp((p - ((i + 1) / N - HALF)) / (2 * HALF)));
        el.style.setProperty("--in", inP.toFixed(4));
        el.style.setProperty("--out", outP.toFixed(4));
        el.style.visibility = inP <= 0.001 || outP >= 0.999 ? "hidden" : "visible";
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
    // capture: also catches scrolling inside a wrapper element, not just the window
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [pillars.length]);

  return (
    <section className="pl" ref={rootRef} aria-label="Our six pillars">
      <style>{pillarCss}</style>
      <div className="pl-stage">
        <div className="pl-bg" aria-hidden="true" />
        <ol className="pl-slides">
          {pillars.map((p, i) => (
            <li className="pl-s" key={p.n} ref={(el) => { slideRefs.current[i] = el; }}>
              <div className="pl-n" data-n={p.n} aria-hidden="true">{p.n}</div>
              <div className="pl-t">
                <span className="pl-tag">Pillar {p.n} of 0{pillars.length}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="pl-foot">
          <span>Six pillars. A shared commitment.</span>
          <span>Our-World Institute &amp; Initiative</span>
        </div>
        <div className="pl-bar" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing statement: aurora, marquee, rings, word-by-word reveal       */
/* ------------------------------------------------------------------ */

export type ClosingWord = { t: string; hl: boolean };

const closingCss = `
.fx {
  --wy: 1;
  position: relative; isolation: isolate; overflow: hidden;
  min-height: min(88vh, 780px); display: grid; place-items: center;
  padding: clamp(70px, 10vw, 140px) clamp(22px, 5vw, 70px);
  border-radius: 32px; text-align: center; color: #fff; background: #070b24;
}
.fx[data-rm="true"] { --wy: 0; }
.fx::after {
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(7,11,36,.15) 25%, rgba(7,11,36,.82) 85%);
}
.fx-aurora { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.fx-aurora i { position: absolute; display: block; border-radius: 50%; }
.fx-aurora i:nth-child(1) {
  width: 90%; aspect-ratio: 1; left: 5%; top: -30%; opacity: .5; filter: blur(70px);
  background: conic-gradient(from 0deg, #536dff, #27c6b7, #8b5cff, #c9e879, #536dff);
}
.fx-aurora i:nth-child(2) {
  width: 46%; aspect-ratio: 1; right: -12%; bottom: -30%;
  background: radial-gradient(circle, rgba(39,198,183,.85), transparent 68%);
}
.fx-aurora i:nth-child(3) {
  width: 40%; aspect-ratio: 1; left: -12%; bottom: -20%;
  background: radial-gradient(circle, rgba(139,92,255,.8), transparent 68%);
}
.fx-marq {
  position: absolute; inset: 0; z-index: -1; pointer-events: none; user-select: none;
  display: flex; flex-direction: column; justify-content: space-between; padding: 5% 0;
}
.fx-marq div {
  display: flex; width: max-content; white-space: nowrap;
  font-size: clamp(4rem, 13vw, 10rem); font-weight: 900; line-height: 1; letter-spacing: -.05em;
  color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.17);
  will-change: transform;
}
.fx-marq div:nth-child(2) { -webkit-text-stroke-color: rgba(201,232,121,.2); }
.fx-ring {
  position: absolute; left: 50%; top: 50%; z-index: -1; pointer-events: none;
  width: min(80vw, 780px); aspect-ratio: 1; translate: -50% -50%;
  scale: calc(.7 + var(--e, 1) * .3);
  border-radius: 50%; border: 1px dashed rgba(255,255,255,.22);
}
.fx-ring::before, .fx-ring::after {
  content: ""; position: absolute; width: 12px; height: 12px; border-radius: 50%;
  left: 50%; margin-left: -6px;
}
.fx-ring::before { top: -6px; background: #C9E879; box-shadow: 0 0 26px 7px rgba(201,232,121,.7); }
.fx-ring::after { bottom: -6px; background: #27C6B7; box-shadow: 0 0 26px 7px rgba(39,198,183,.7); }
.fx-ring.two {
  width: min(56vw, 540px); scale: calc(1.1 - var(--e, 1) * .2);
  border-color: rgba(83,109,255,.4);
}
.fx-chip {
  display: inline-flex; align-items: center; gap: 10px; margin-bottom: 30px; padding: 9px 18px;
  border-radius: 999px; border: 1px solid rgba(255,255,255,.22); background: rgba(255,255,255,.06);
  backdrop-filter: blur(8px); font-size: .74rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
}
.fx-chip i {
  width: 8px; height: 8px; border-radius: 50%; background: #C9E879;
  animation: fx-pulse 2s ease-out infinite;
}
.fx-text {
  max-width: 1020px; margin: 0 auto; perspective: 900px;
  font-size: clamp(2.2rem, 6vw, 5.6rem); line-height: 1.05; letter-spacing: -.055em; font-weight: 850;
}
.fx-w {
  display: inline-block; margin-inline-end: .26em;
  opacity: var(--r, 1);
  transform: translate3d(0, calc((1 - var(--r, 1)) * .6em * var(--wy)), 0)
             rotateX(calc((1 - var(--r, 1)) * -70deg * var(--wy)))
             scale(calc(1 - (1 - var(--r, 1)) * .1 * var(--wy)));
  filter: blur(calc((1 - var(--r, 1)) * 12px * var(--wy)));
}
.fx-w.hl {
  color: transparent; -webkit-text-fill-color: transparent;
  background: linear-gradient(90deg, #c9e879, #8ff0e4, #ffffff, #c9e879);
  background-size: 300% auto; -webkit-background-clip: text; background-clip: text;
  animation: fx-shimmer 6s linear infinite; animation-delay: calc(var(--w) * -.5s);
}
.fx-sign { margin-top: 38px; color: rgba(255,255,255,.6); font-size: .76rem; letter-spacing: .16em; text-transform: uppercase; }

@keyframes fx-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(35px,28px,0); } }
@keyframes fx-spin { to { transform: rotate(360deg); } }
@keyframes fx-rot { to { rotate: 360deg; } }
@keyframes fx-marq { to { transform: translateX(-50%); } }
@keyframes fx-pulse { 0% { box-shadow: 0 0 0 0 rgba(201,232,121,.7); } 100% { box-shadow: 0 0 0 14px rgba(201,232,121,0); } }
@keyframes fx-shimmer { to { background-position: 300% center; } }

@media (max-width: 600px) {
  .fx { min-height: 540px; border-radius: 22px; }
  .fx-ring { width: 130vw; }
  .fx-ring.two { width: 90vw; }
}
`;

export function ClosingStage({ words, marquee }: { words: ClosingWord[]; marquee: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);
  const ringA = useRef<HTMLSpanElement>(null);
  const ringB = useRef<HTMLSpanElement>(null);
  const aurora = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.rm = rm ? "true" : "false";
    const n = words.length;

    let scrollPart = 0; // pixels contributed by scroll position
    let drift = 0;      // pixels contributed by time (autoplay)
    let visible = true;
    let raf = 0;
    let prev = performance.now();
    let ticking = false;

    // Everything that moves behind the text is positioned from these two numbers.
    const applyMotion = () => {
      const a = rowA.current;
      const b = rowB.current;
      const x = drift + scrollPart;
      if (a && b) {
        const half = a.scrollWidth / 2 || 1;
        const m = ((x % half) + half) % half;
        a.style.transform = `translate3d(${(-m).toFixed(1)}px,0,0)`;
        b.style.transform = `translate3d(${(m - half).toFixed(1)}px,0,0)`;
      }
      if (ringA.current) ringA.current.style.rotate = `${(x * 0.06).toFixed(2)}deg`;
      if (ringB.current) ringB.current.style.rotate = `${(x * -0.09).toFixed(2)}deg`;
      const blobs = aurora.current?.children;
      if (blobs && blobs.length === 3) {
        const t = x / 40;
        (blobs[0] as HTMLElement).style.transform = `rotate(${(x * 0.4).toFixed(1)}deg)`;
        (blobs[1] as HTMLElement).style.transform =
          `translate3d(${(Math.sin(t / 1.7) * 40).toFixed(1)}px,${(Math.cos(t / 2.1) * 30).toFixed(1)}px,0)`;
        (blobs[2] as HTMLElement).style.transform =
          `translate3d(${(Math.cos(t / 1.9) * 40).toFixed(1)}px,${(Math.sin(t / 2.4) * 30).toFixed(1)}px,0)`;
      }
    };

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const rect = root.getBoundingClientRect();
      const e = clamp((vh * 0.95 - rect.top) / Math.min(rect.height, vh * 0.9));
      root.style.setProperty("--e", e.toFixed(4));
      scrollPart = (vh - rect.top) * 0.6;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = (i / n) * 0.5;
        el.style.setProperty("--r", ease(clamp((e - start) / 0.3)).toFixed(4));
      });
      applyMotion();
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // Autoplay drift runs only while the section is on screen (and not for reduced-motion users).
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!rm && visible) {
        drift += dt * 40;
        applyMotion();
      }
    };

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(root);

    update();
    raf = requestAnimationFrame(loop);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [words.length]);

  return (
    <div className="fx" ref={rootRef}>
      <style>{closingCss}</style>
      <div className="fx-aurora" aria-hidden="true" ref={aurora}><i /><i /><i /></div>
      <div className="fx-marq" aria-hidden="true">
        <div ref={rowA}><span>{marquee}</span><span>{marquee}</span></div>
        <div ref={rowB}><span>{marquee}</span><span>{marquee}</span></div>
      </div>
      <span className="fx-ring" aria-hidden="true" ref={ringA} />
      <span className="fx-ring two" aria-hidden="true" ref={ringB} />

      <div>
        <span className="fx-chip"><i />Our belief</span>
        <p className="fx-text">
          {words.map((w, i) => (
            <span
              className={`fx-w${w.hl ? " hl" : ""}`}
              style={{ ["--w" as string]: i } as React.CSSProperties}
              ref={(el) => { wordRefs.current[i] = el; }}
              key={i}
            >
              {w.t}
            </span>
          ))}
        </p>
        <div className="fx-sign">Our-World Institute &amp; Initiative</div>
      </div>
    </div>
  );
}