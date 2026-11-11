"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = ["#ef493b", "#7778c9", "#a6c92b", "#16ae9c", "#f3bd18", "#17b6d1"];
const ANGLES = [-90, -30, 30, 90, 150, 210];   // clockwise from the top
const R = 36;                                    // ring radius in a 100 x 100 box

const CSS = `
/* People wheel (prefix pw-) */
.pw-stage{position:relative;height:340vh}
.pw-stick{position:sticky;top:clamp(88px,13vh,130px);display:grid;justify-items:center;gap:26px;padding-top:10px}
.pw-wheel{--s:min(90vw,480px);--n:clamp(86px,24%,118px);position:relative;width:var(--s);height:var(--s);margin:0 auto}
.pw-wheel{--nd:calc(var(--s) * .235)}
.pw-glow{position:absolute;inset:6%;border-radius:50%;opacity:0;transition:opacity .9s;background:radial-gradient(closest-side,color-mix(in srgb,var(--gc) 34%,transparent),transparent 72%);filter:blur(6px);pointer-events:none}
.pw-glow.on{opacity:1}
.pw-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.pw-orbit{fill:none;stroke:rgba(15,27,77,.08);stroke-width:.4}
.pw-track{fill:none;stroke:rgba(15,27,77,.14);stroke-width:1.1}
.pw-dash{stroke-width:.35;stroke-dasharray:.8 2.2;transform-origin:50px 50px;animation:pw-rot 60s linear infinite}
.pw-fill{fill:none;stroke:url(#pwg);stroke-width:1.5;stroke-linecap:round;transition:stroke-dasharray .9s cubic-bezier(.2,.8,.2,1)}
.pw-ln{stroke-width:.5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;opacity:0;transition:stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1),opacity .4s}
.pw-ln.on{stroke-dashoffset:0;opacity:.9}
.pw-comet{transform-origin:50px 50px;transition:transform .9s cubic-bezier(.2,.8,.2,1)}

.pw-core{position:absolute;left:50%;top:50%;width:42%;aspect-ratio:1;translate:-50% -50%;pointer-events:none}
.pw-globe{display:block;width:100%;height:100%;filter:drop-shadow(0 14px 30px color-mix(in srgb,var(--ac) 40%,transparent));transition:filter .6s}

.pw-node{position:absolute;translate:-50% -50%;width:var(--nd);height:var(--nd);border-radius:50%;display:grid;place-items:center;align-content:center;box-sizing:border-box;padding:0 calc(var(--nd) * .09);text-align:center;cursor:pointer;
  background:#fff;border:4px solid color-mix(in srgb,var(--c) 38%,#cfd6e6);color:#1b2447;font:inherit;font-weight:700;font-size:calc(var(--s) * .0245);line-height:1.25;
  opacity:.5;scale:.88;box-shadow:0 4px 14px rgba(15,27,77,.08);transition:opacity .5s,scale .6s cubic-bezier(.2,.8,.2,1),background .5s,color .5s,border-color .5s,box-shadow .6s}
.pw-node span{display:block}
.pw-node.done{opacity:.85;border-color:var(--c);scale:.94}
.pw-node.on{padding:0 calc(var(--nd) * .12);font-size:calc(var(--s) * .0225);opacity:1;scale:1.22;z-index:3;color:#fff;border-color:#fff;background:linear-gradient(145deg,var(--c),color-mix(in srgb,var(--c) 62%,#0b1b44));box-shadow:0 0 0 5px color-mix(in srgb,var(--c) 28%,transparent),0 18px 44px color-mix(in srgb,var(--c) 55%,transparent)}
.pw-node.on::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--c);animation:pw-ping 2s ease-out infinite;pointer-events:none}
.pw-node:focus-visible{outline:3px solid #3B3FD8;outline-offset:3px}
.pw-node:hover{opacity:1}

.pw-ticks{display:flex;gap:8px}
.pw-ticks i{width:34px;height:5px;border-radius:5px;background:rgba(15,27,77,.14);transition:background .5s,width .5s}
.pw-ticks i.on{background:var(--c);width:44px}

@keyframes pw-rot{to{transform:rotate(360deg)}}
@keyframes pw-ping{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.45);opacity:0}}

@media (max-width:600px){
  .pw-stage{height:300vh}
  .pw-wheel{--s:min(94vw,360px)}
  .pw-wheel{--nd:calc(var(--s) * .27)}
  .pw-node{font-size:calc(var(--s) * .0235);border-width:3px;padding:0 calc(var(--nd) * .07)}
  }
@media (prefers-reduced-motion:reduce){
  .pw-dash,.pw-node.on::after{animation:none}
  .pw-node,.pw-fill,.pw-comet,.pw-ln,.pw-glow{transition:none}
}
`;

// A real globe, drawn from the same land data as the Bharat Summit globe. It turns as the page scrolls.
function GlobeSpin({ pRef }: { pRef: { current: number } }) {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current!;
    const ctx = canvas.getContext("2d")!;
    let pts: { x: number; y: number; z: number; c: number }[] = [];
    let alive = true, vis = true, raf = 0;
    let rot = -78 * Math.PI / 180, size = 0;
    const TILT = 0.38;
    const COLS = ["#1E9C8C", "#14A68F", "#F5A12A", "#F26B3A", "rgba(31,193,222,.55)"];

    const vec = (lon: number, lat: number) => {
      const a = lat * Math.PI / 180, l = lon * Math.PI / 180;
      return { x: Math.cos(a) * Math.sin(l), y: Math.sin(a), z: Math.cos(a) * Math.cos(l), l };
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr; canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const R = size * 0.46, c = size / 2;
      ctx.clearRect(0, 0, size, size);
      // sphere body
      const g = ctx.createRadialGradient(c - R * 0.35, c - R * 0.4, R * 0.1, c, c, R);
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.6, "#e4ecff"); g.addColorStop(1, "#b9cdf7");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();
      const ct = Math.cos(TILT), st = Math.sin(TILT), cr = Math.cos(rot), sr = Math.sin(rot);
      const cols = COLS.map(() => [] as number[]);
      for (const p of pts) {
        // spin about the vertical axis, then tilt
        const x1 = p.x * cr + p.z * sr, z1 = -p.x * sr + p.z * cr;
        const y2 = p.y * ct - z1 * st, z2 = p.y * st + z1 * ct;
        if (z2 <= 0.02) continue;
        cols[p.c].push(c + R * x1, c - R * y2, z2);
      }
      for (let k = 0; k < cols.length; k++) {
        const a = cols[k];
        ctx.fillStyle = COLS[k];
        for (let i = 0; i < a.length; i += 3) {
          const s = (k === 4 ? 1.1 : 1.8) * (0.55 + a[i + 2] * 0.7) * (size / 220);
          ctx.fillRect(a[i] - s / 2, a[i + 1] - s / 2, s, s);
        }
      }
      // soft rim shading so it reads as a ball
      const rim = ctx.createRadialGradient(c, c, R * 0.62, c, c, R);
      rim.addColorStop(0, "rgba(11,27,68,0)"); rim.addColorStop(1, "rgba(11,27,68,.28)");
      ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(c, c, R, 0, Math.PI * 2); ctx.fill();
    };

    const loop = () => {
      if (!alive) return;
      const target = -78 * Math.PI / 180 + pRef.current * Math.PI * 4;   // two full turns across the section
      const d = target - rot;
      if (Math.abs(d) > 0.0004) { rot += d * 0.12; draw(); }
      raf = vis ? requestAnimationFrame(loop) : 0;
    };

    fit();
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); });
    io.observe(canvas);
    const onResize = () => { fit(); draw(); };
    window.addEventListener("resize", onResize);

    fetch("/globe-data.json").then((r) => r.json()).then((d: { land: number[]; sea: number[]; indiaPts: number[] }) => {
      if (!alive) return;
      const out: typeof pts = [];
      for (let i = 0; i < d.land.length; i += 2) {
        const lon = d.land[i] / 10, lat = d.land[i + 1] / 10, v = vec(lon, lat);
        out.push({ x: v.x, y: v.y, z: v.z, c: Math.random() < 0.06 ? 2 : Math.random() < 0.5 ? 0 : 1 });
      }
      for (let i = 0; i < d.indiaPts.length; i += 2) {
        const v = vec(d.indiaPts[i] / 100, d.indiaPts[i + 1] / 100);
        out.push({ x: v.x, y: v.y, z: v.z, c: 3 });
      }
      for (let i = 0; i < d.sea.length; i += 14) {
        const v = vec(d.sea[i] / 10, d.sea[i + 1] / 10);
        out.push({ x: v.x, y: v.y, z: v.z, c: 4 });
      }
      pts = out; draw();
      if (!raf) raf = requestAnimationFrame(loop);
    }).catch(() => {});

    return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", onResize); };
  }, [pRef]);

  return <canvas ref={cv} className="pw-globe" aria-hidden="true" />;
}

// A ring of six circles. As the page scrolls, they light up one by one, 1 to 6,
// while a glowing dot travels round the ring and a line draws to the active circle.
export default function PeopleWheel({ items }: { items: string[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const prog = useRef(0);
  const n = items.length;

  useEffect(() => {
    let tick = false;
    const update = () => {
      tick = false;
      const el = stage.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(0.9999, Math.max(0, -r.top / range));
      prog.current = p;
      setIdx(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [n]);

  const goTo = (i: number) => {
    const el = stage.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * range, behavior: "smooth" });
  };

  const col = COLORS[idx % COLORS.length];
  const pos = (i: number) => {
    const a = (ANGLES[i] * Math.PI) / 180;
    return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
  };

  return (
    <div className="pw-stage" ref={stage} style={{ ["--ac" as string]: col }}>
      <style>{CSS}</style>
      <div className="pw-stick">
        <div className="pw-wheel">
          {COLORS.map((c, i) => <i key={i} className={`pw-glow${idx === i ? " on" : ""}`} style={{ ["--gc" as string]: c }} aria-hidden="true" />)}

          <svg className="pw-svg" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="pwg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ef493b" />
                <stop offset=".5" stopColor="#f3bd18" />
                <stop offset="1" stopColor="#17b6d1" />
              </linearGradient>
            </defs>
            <circle className="pw-orbit" cx="50" cy="50" r="46" />
            <circle className="pw-track" cx="50" cy="50" r={R} />
            <circle className="pw-track pw-dash" cx="50" cy="50" r={R + 5} />
            <circle className="pw-fill" cx="50" cy="50" r={R} pathLength={100} transform="rotate(-90 50 50)" style={{ strokeDasharray: `${(idx * 100) / n} 100` }} />
            {items.map((_, i) => {
              const p = pos(i);
              return <line key={i} className={`pw-ln${idx === i ? " on" : ""}`} x1="50" y1="50" x2={p.x} y2={p.y} pathLength={1} style={{ stroke: COLORS[i % COLORS.length] }} />;
            })}
            <g className="pw-comet" style={{ transform: `rotate(${(idx * 360) / n}deg)` }}>
              <circle cx="50" cy={50 - R} r="3.4" fill={col} opacity=".28" />
              <circle cx="50" cy={50 - R} r="1.7" fill="#fff" stroke={col} strokeWidth="1" />
            </g>
          </svg>

          <div className="pw-core" aria-hidden="true"><GlobeSpin pRef={prog} /></div>

          {items.map((t, i) => {
            const p = pos(i);
            const state = idx === i ? " on" : i < idx ? " done" : "";
            return (
              <button
                key={t}
                type="button"
                className={`pw-node${state}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, ["--c" as string]: COLORS[i % COLORS.length] }}
                onClick={() => goTo(i)}
                aria-current={idx === i ? "true" : undefined}
              >
                <span>{t}</span>
              </button>
            );
          })}
        </div>

        <div className="pw-ticks" aria-hidden="true">
          {items.map((_, i) => <i key={i} className={i <= idx ? "on" : ""} style={{ ["--c" as string]: COLORS[i % COLORS.length] }} />)}
        </div>
      </div>
    </div>
  );
}