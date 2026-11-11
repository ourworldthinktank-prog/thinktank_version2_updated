"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type JourneyStep = {
  n: string;
  t: string;
  /** Short paragraph under the title */
  d?: string;
  c?: string;
  /** Small word shown in the pill, e.g. "Ideas" */
  k?: string;
  /** Optional numbered activities listed on the card */
  items?: string[];
};

/** One card's colours. bg can be any CSS background (a gradient works); fg is the text colour. */
export type CardColour = { bg: string; fg?: string; arrow?: string };

const isDark = (hex?: string) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? "");
  if (!m) return false;
  const n = parseInt(m[1], 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) < 140;
};

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (t: number) => t * t * (3 - 2 * t);
// Ease-out with a small overshoot, so each card lands with a bounce
const back = (t: number) => {
  const c1 = 1.3;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Floating confetti that sweeps right to left at different speeds (parallax)
type Shape = { x: number; y: number; s: number; t: "circle" | "ring" | "hex" | "tri" | "sq"; c: string; sp: number; rs: number; sy: number; f?: boolean };
const SHAPES: Shape[] = [
  { x: 6, y: 16, s: 26, t: "circle", c: "#F5A12A", sp: 0.6, rs: 0.6, sy: 1 },
  { x: 20, y: 80, s: 46, t: "ring", c: "#27C6B7", sp: 1.0, rs: -0.8, sy: -1 },
  { x: 34, y: 10, s: 34, t: "hex", c: "#536DFF", sp: 0.8, rs: 0.5, sy: 1 },
  { x: 48, y: 86, s: 22, t: "tri", c: "#F5A12A", sp: 1.2, rs: 1.0, sy: -1, f: true },
  { x: 60, y: 22, s: 54, t: "ring", c: "#8B5CFF", sp: 0.7, rs: 0.4, sy: 1 },
  { x: 72, y: 70, s: 30, t: "sq", c: "#27C6B7", sp: 1.1, rs: -0.9, sy: -1 },
  { x: 84, y: 12, s: 24, t: "circle", c: "#ffffff", sp: 0.9, rs: 0.3, sy: 1, f: true },
  { x: 96, y: 88, s: 40, t: "hex", c: "#C9E879", sp: 0.65, rs: -0.5, sy: -1 },
  { x: 108, y: 30, s: 28, t: "tri", c: "#536DFF", sp: 1.0, rs: 0.8, sy: 1 },
  { x: 118, y: 74, s: 50, t: "ring", c: "#C9E879", sp: 0.75, rs: 0.6, sy: -1 },
  { x: 128, y: 14, s: 32, t: "sq", c: "#8B5CFF", sp: 1.2, rs: -0.7, sy: 1, f: true },
  { x: 138, y: 54, s: 20, t: "circle", c: "#27C6B7", sp: 0.85, rs: 0.2, sy: -1 },
];

const css = `
.jr { position: relative; --jr-top: 76px; --jr-h: calc(100vh - var(--jr-top) - 20px); }
@supports (height: 100svh) { .jr { --jr-h: calc(100svh - var(--jr-top) - 20px); } }

.jr-stage {
  position: relative; isolation: isolate; overflow: hidden;
  border-radius: 32px; background: #0b1030; color: #fff;
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 40px 90px -40px rgba(7,11,36,.7);
  padding: 28px 0 24px;
}
.jr-bg {
  position: absolute; inset: 0; z-index: -2; pointer-events: none;
  background:
    radial-gradient(55% 70% at 92% 6%, rgba(83,109,255,.4), transparent 62%),
    radial-gradient(50% 60% at 4% 100%, rgba(39,198,183,.28), transparent 62%),
    radial-gradient(35% 40% at 50% 50%, rgba(139,92,255,.16), transparent 70%);
}
.jr-bg::after {
  content: ""; position: absolute; inset: 0; opacity: .5;
  background-image: radial-gradient(rgba(255,255,255,.16) .8px, transparent .8px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}
.jr-big {
  position: absolute; left: 0; top: 46%; z-index: -1; pointer-events: none; user-select: none;
  white-space: nowrap; font-size: clamp(7rem, 22vw, 17rem); font-weight: 900; line-height: 1;
  letter-spacing: -.05em; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.11);
  translate: 0 -50%;
}
.jr-shapes { position: absolute; inset: 0; pointer-events: none; z-index: -1; }
.jr-shapes.front { z-index: 4; }
.jr-sh {
  position: absolute; left: calc(var(--x) * 1%); top: calc(var(--y) * 1%);
  width: calc(var(--s) * 1px); height: calc(var(--s) * 1px); opacity: .8;
}
.jr-sh.circle { background: var(--c); border-radius: 50%; }
.jr-sh.ring { border: 3px solid var(--c); border-radius: 50%; }
.jr-sh.sq { background: var(--c); border-radius: 7px; }
.jr-sh.hex { background: var(--c); clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%); }
.jr-sh.tri { background: var(--c); clip-path: polygon(50% 0, 100% 100%, 0 100%); }

/* Cards */
.jr-cards { list-style: none; margin: 0; padding: 0 20px; display: grid; gap: 18px; }
.jr-card { position: relative; }
.jr-ring { display: none; }
.jr-inner {
  --bg: linear-gradient(135deg, #536DFF, #3a4fd6); --fg: #fff;
  position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 14px;
  min-height: 0; height: clamp(360px, calc(var(--jr-h) - 110px), 560px);
  padding: clamp(26px, 4vw, 46px);  border-radius: 28px; background: var(--bg); color: var(--fg);
  box-shadow: 0 30px 60px -28px rgba(0,0,0,.7);
}
.jr-card[data-v="1"] .jr-inner { --bg: linear-gradient(135deg, #27C6B7, #1a9e92); --fg: #08122e; }
.jr-card[data-v="2"] .jr-inner { --bg: linear-gradient(135deg, #536DFF, #3a4fd6); --fg: #fff; }
.jr-card[data-v="3"] .jr-inner { --bg: linear-gradient(135deg, #27C6B7, #1a9e92); --fg: #0b1030; }
.jr-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.jr-pill {
  display: inline-block; padding: 7px 14px; border-radius: 999px; border: 1px solid currentColor;
  font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; opacity: .85;
}
.jr-go {
  display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
  background: currentColor; font-size: 1.1rem; line-height: 1;
}
.jr-go b { color: var(--arrow, #0b1030); font-weight: 800; }
.jr-card[data-v="1"] .jr-inner, .jr-card[data-v="3"] .jr-inner { --arrow: #fff; }
.jr-inner h3 {
  position: relative; z-index: 1; margin: auto 0 0; max-width: 14ch; color: inherit;
  font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1.02; letter-spacing: -.045em; font-weight: 850;
}
.jr-inner p {
  position: relative; z-index: 1; margin: 0; max-width: 46ch; color: inherit; opacity: .9;
  font-size: clamp(1rem, 1.5vw, 1.2rem); line-height: 1.6;
}
.jr-items {
  position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: grid; gap: 10px;
}
.jr-items li {
  display: grid; grid-template-columns: 34px 1fr; gap: 8px; padding-top: 10px;
  border-top: 1px solid color-mix(in srgb, currentColor 28%, transparent);
  font-size: clamp(.86rem, 1.2vw, 1rem); line-height: 1.45;
}
.jr-items i { font-style: normal; font-size: .72rem; font-weight: 800; letter-spacing: .12em; opacity: .7; padding-top: .2em; }
.jr-card.has-items .jr-inner { min-height: 0; height: clamp(360px, calc(var(--jr-h) - 110px), 560px); }
.jr-card.has-items .jr-inner h3 { margin: 6px 0 0; max-width: 22ch; font-size: clamp(1.5rem, 2.8vw, 2.3rem); }
.jr-wm {
  position: absolute; right: 14px; bottom: -.12em; z-index: 0; pointer-events: none;
  font-size: clamp(8rem, 18vw, 13rem); font-weight: 900; line-height: .8; letter-spacing: -.07em;
  opacity: .16; color: currentColor;
}
.jr-veil { position: absolute; inset: 0; background: #070b24; opacity: 0; pointer-events: none; }

.jr-track { display: none; }
.jr-hint { display: none; }

/* Enhanced: pinned stage, cards fly in from the right and pile up to the left */
.jr[data-ready="true"] { height: calc(var(--jr-h) + var(--jr-n, 4) * 120vh); }
@supports (height: 100svh) { .jr[data-ready="true"] { height: calc(var(--jr-h) + var(--jr-n, 4) * 120svh); } }
.jr[data-ready="true"] .jr-stage {
  position: sticky; top: var(--jr-top); height: var(--jr-h); padding: 0;
  --fly: 100vw; --dx: 78px; --dy: -9px; --dr: 2.2deg; --rot: 10deg; --cw: min(760px, calc(100% - 40px));
}
.jr[data-rm="true"] .jr-stage { --rot: 0deg; --dr: 0deg; --tilt: 0; }
.jr[data-ready="true"] .jr-cards { position: absolute; inset: 0; display: block; padding: 0; }
.jr[data-ready="true"] .jr-card {
  position: absolute; left: 50%; top: 46%; width: var(--cw); translate: -50% -50%;
  opacity: min(1, calc(var(--a, 1) * 4));
  transform:
    translate3d(calc(var(--x, 0) * var(--fly) - var(--d, 0) * var(--dx)), calc(var(--d, 0) * var(--dy)), 0)
    rotate(calc(var(--x, 0) * var(--rot) - var(--d, 0) * var(--dr)))
    scale(calc(1 - var(--d, 0) * .055));
  will-change: transform, opacity;
}
.jr[data-ready="true"] .jr-inner {
  transform: perspective(900px)
             rotateY(calc(var(--mx, 0) * 6deg * var(--tilt, 1)))
             rotateX(calc(var(--my, 0) * -5deg * var(--tilt, 1)));
  transition: transform .25s ease-out;
}
.jr[data-ready="true"] .jr-veil { opacity: calc(var(--d, 0) * .2); }
/* landing pulse ring */
.jr[data-ready="true"] .jr-ring {
  display: block; position: absolute; left: 50%; top: 50%; width: 100%; aspect-ratio: 1;
  translate: -50% -50%; border-radius: 50%; border: 3px solid rgba(255,255,255,.7); pointer-events: none;
  scale: calc(.5 + var(--a, 1) * 1.1); opacity: calc(var(--burst, 0) * .55);
}
.jr[data-ready="true"] .jr-big { transform: translate3d(calc(var(--p, 0) * -58%), 0, 0); }
.jr[data-ready="true"] .jr-sh {
  transform:
    translate3d(calc(var(--p, 0) * var(--sp) * var(--sw, 1000px) * -1), calc(var(--p, 0) * var(--sy) * 90px), 0)
    rotate(calc(var(--p, 0) * var(--rs) * 360deg));
}
.jr[data-ready="true"] .jr-track {
  display: block; position: absolute; left: 50%; bottom: 22px; translate: -50% 0; z-index: 5;
  width: min(560px, calc(100% - 56px));
}
.jr-track ol { list-style: none; margin: 0; padding: 0; display: flex; justify-content: space-between; position: relative; }
.jr-line { position: absolute; left: 17px; right: 17px; top: 50%; height: 3px; margin-top: -1.5px; background: rgba(255,255,255,.16); border-radius: 3px; }
.jr-line i {
  display: block; height: 100%; border-radius: 3px; transform-origin: left; transform: scaleX(var(--fill, 0));
  background: linear-gradient(90deg, #536DFF, #27C6B7, #F5A12A);
}
.jr-run {
  position: absolute; top: 50%; left: calc(var(--fill, 0) * 100%); width: 14px; height: 14px; margin: -7px 0 0 -7px;
  border-radius: 50%; background: #F5A12A; box-shadow: 0 0 0 5px rgba(201,232,121,.25), 0 0 20px 4px rgba(201,232,121,.7);
}
.jr-stop {
  position: relative; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%;
  background: #0b1030; border: 2px solid rgba(255,255,255,.3);
  font-size: .68rem; font-weight: 800; letter-spacing: .04em; color: rgba(255,255,255,.8);
}
.jr-stop::before {
  content: ""; position: absolute; inset: -2px; border-radius: 50%; background: #F5A12A;
  opacity: var(--a, 0); scale: calc(.6 + var(--a, 0) * .4);
}
.jr-stop span { position: relative; color: color-mix(in srgb, #0b1030 calc(var(--a, 0) * 100%), #fff); }
.jr[data-ready="true"] .jr-hint {
  display: block; position: absolute; right: 24px; bottom: 28px; z-index: 5;
  color: rgba(255,255,255,.6); font-size: .7rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
  opacity: max(0, calc(1 - var(--p, 0) * 12));
}

@media (max-width: 700px) {
  .jr { --jr-top: 64px; }
  .jr-stage { border-radius: 22px; }
  .jr[data-ready="true"] .jr-stage { --dx: 16px; --dy: -6px; --cw: calc(100% - 32px); }
  .jr-inner, .jr-card.has-items .jr-inner { min-height: 0; height: clamp(380px, calc(var(--jr-h) - 100px), 580px); border-radius: 22px; }
  .jr[data-ready="true"] .jr-hint { display: none; }
  .jr[data-ready="true"] .jr-track { bottom: 16px; }
}
`;

export default function JourneyScroll({
  steps,
  label = "Step",
  ariaLabel = "Scroll through the steps",
  palette,
}: {
  steps: JourneyStep[];
  /** Word before the number in each pill, e.g. "Step" or "Stream" */
  label?: string;
  ariaLabel?: string;
  /** Optional colours for the cards, in order. Repeats if there are more cards than colours. */
  palette?: CardColour[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stopRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const N = steps.length;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.rm = rm ? "true" : "false";
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = root.getBoundingClientRect();
      const stageTop = parseFloat(getComputedStyle(stage).top) || 0;
      const p = clamp((stageTop - rect.top) / Math.max(1, rect.height - stage.offsetHeight));
      const u = p * (N - 0.5); // scroll units: one transition per card, plus a short hold at the end

      const sw = stage.clientWidth;
      const cw = cardRefs.current[0]?.offsetWidth ?? 600;
      stage.style.setProperty("--sw", `${sw}px`);
      stage.style.setProperty("--fly", `${sw / 2 + cw / 2 + 60}px`);
      root.style.setProperty("--p", p.toFixed(4));

      // a[i]: how far card i has arrived (0..1). Card 0 is already in place.
      const a = steps.map((_, i) => (i === 0 ? 1 : clamp((u - (i - 1) - 0.3) / 0.7)));
      const smooth = a.map(ease);

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        let depth = 0;
        for (let j = i + 1; j < N; j++) depth += smooth[j];
        const x = rm ? 1 - smooth[i] : 1 - back(a[i]);
        el.style.setProperty("--a", a[i].toFixed(4));
        el.style.setProperty("--x", x.toFixed(4));
        el.style.setProperty("--d", depth.toFixed(4));
        el.style.setProperty("--burst", i === 0 ? "0" : Math.sin(Math.PI * a[i]).toFixed(4));
        el.style.visibility = a[i] <= 0.001 ? "hidden" : "visible";
        el.style.zIndex = String(i + 1);
      });

      stopRefs.current.forEach((el, i) => {
        if (el) el.style.setProperty("--a", smooth[i].toFixed(4));
      });
      const fill = smooth.slice(1).reduce((sum, v) => sum + v, 0) / Math.max(1, N - 1);
      root.style.setProperty("--fill", fill.toFixed(4));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    // Cards tilt gently towards the pointer
    const onMove = (e: PointerEvent) => {
      if (rm) return;
      const r = stage.getBoundingClientRect();
      root.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      root.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    const onLeave = () => {
      root.style.setProperty("--mx", "0");
      root.style.setProperty("--my", "0");
    };

    root.dataset.ready = "true";
    update();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [steps]);

  const total = String(steps.length).padStart(2, "0");

  return (
    <section className="jr" ref={rootRef} aria-label={ariaLabel} style={{ "--jr-n": steps.length } as CSSProperties}>
      <style>{css}</style>
      <div className="jr-stage" ref={stageRef}>
        <div className="jr-bg" aria-hidden="true" />
        <div className="jr-big" aria-hidden="true">
          BHARAT ✦ SHARE ✦ DIALOGUE ✦ NETWORK ✦ BHARAT ✦ SHARE ✦ DIALOGUE ✦ NETWORK ✦
        </div>

        <div className="jr-shapes" aria-hidden="true">
          {SHAPES.filter((s) => !s.f).map((s, i) => (
            <span
              key={i}
              className={`jr-sh ${s.t}`}
              style={{ "--x": s.x, "--y": s.y, "--s": s.s, "--c": s.c, "--sp": s.sp, "--rs": s.rs, "--sy": s.sy } as CSSProperties}
            />
          ))}
        </div>

        <ol className="jr-cards">
          {steps.map((s, i) => (
            <li className={`jr-card${s.items?.length ? " has-items" : ""}`} data-v={i % 4} key={s.n} ref={(el: HTMLLIElement | null) => { cardRefs.current[i] = el; }}>
              <span className="jr-ring" aria-hidden="true" />
              <article
                className="jr-inner"
                style={
                  palette?.length
                    ? (() => {
                        const c = palette[i % palette.length];
                        const fg = c.fg ?? "#fff";
                        return { "--bg": c.bg, "--fg": fg, "--arrow": c.arrow ?? (isDark(fg) ? "#0b1030" : "#fff") } as CSSProperties;
                      })()
                    : undefined
                }
              >
                <div className="jr-top">
                  <span className="jr-pill">{label} {s.n} / {total}{s.k ? ` · ${s.k}` : ""}</span>
                  <span className="jr-go" aria-hidden="true"><b>↗</b></span>
                </div>
                <h3>{s.t}</h3>
                {s.d && <p>{s.d}</p>}
                {!!s.items?.length && (
                  <ul className="jr-items">
                    {s.items.map((it, k) => (
                      <li key={k}><i>{String(k + 1).padStart(2, "0")}</i><span>{it}</span></li>
                    ))}
                  </ul>
                )}
                <span className="jr-wm" aria-hidden="true">{s.n}</span>
                <span className="jr-veil" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ol>

        <div className="jr-shapes front" aria-hidden="true">
          {SHAPES.filter((s) => s.f).map((s, i) => (
            <span
              key={i}
              className={`jr-sh ${s.t}`}
              style={{ "--x": s.x, "--y": s.y, "--s": s.s, "--c": s.c, "--sp": s.sp, "--rs": s.rs, "--sy": s.sy } as CSSProperties}
            />
          ))}
        </div>

        <div className="jr-track" aria-hidden="true">
          <span className="jr-line"><i /></span>
          <span className="jr-run" />
          <ol>
            {steps.map((s, i) => (
              <li className="jr-stop" key={s.n} ref={(el: HTMLLIElement | null) => { stopRefs.current[i] = el; }}>
                <span>{s.n}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="jr-hint" aria-hidden="true">Keep scrolling ↓</div>
      </div>
    </section>
  );
}