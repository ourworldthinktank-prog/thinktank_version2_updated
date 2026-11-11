"use client";

import { useEffect, useRef, useState } from "react";

const GLOBE_GIF = "/assets/globe.gif";   // put your globe GIF at public/assets/globe.gif
const COLORS = ["#f5a12a", "#7778c9", "#face0b", "#16ae9c", "#f3bd18", "#17b6d1"];
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
.pw-globe{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 14px 30px color-mix(in srgb,var(--ac) 40%,transparent));transition:filter .6s}

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

// A ring of six circles. As the page scrolls, they light up one by one, 1 to 6,
// while a glowing dot travels round the ring and a line draws to the active circle.
export default function PeopleWheel({ items }: { items: string[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
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

          <div className="pw-core" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pw-globe" src={GLOBE_GIF} alt="" width={200} height={200} />
          </div>

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
      </div>
    </div>
  );
}