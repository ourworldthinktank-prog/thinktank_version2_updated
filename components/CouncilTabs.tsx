"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface Tab { id: string; title: string; count?: number }

// Sticky switcher. The word "Council" sits under the name (Leadership / Council), and a highlight slides to the section on screen.
const CSS = `
.ct-bar{position:sticky;top:84px;z-index:20;padding:14px 0;pointer-events:none}
.ct-bar .wrap{display:flex;justify-content:center}
.ct-bar .ct{position:relative;display:inline-flex;align-items:stretch;gap:4px;width:max-content;max-width:100%;padding:6px;border-radius:999px;background:rgba(26,33,88,.96);box-shadow:0 16px 38px rgba(11,27,68,.32),inset 0 0 0 1px rgba(255,255,255,.12);pointer-events:auto}
.ct-bar .ct-pill{position:absolute;left:0;top:6px;bottom:6px;width:0;border-radius:999px;background:linear-gradient(135deg,#FFC46B,#FF8F6B);box-shadow:0 6px 18px rgba(255,143,107,.35);transition:transform .5s cubic-bezier(.2,.8,.2,1),width .5s cubic-bezier(.2,.8,.2,1);z-index:0;will-change:transform,width}
.ct-bar .ct a{position:relative;z-index:1;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:9px 26px;border-radius:999px;color:rgba(255,255,255,.82);text-align:center;white-space:nowrap;transition:color .3s}
.ct-bar .ct a:hover{color:#fff}
.ct-bar .ct a.on{color:#0B1B44}
.ct-bar .ct-t{display:grid;gap:1px;justify-items:center;line-height:1.1}
.ct-bar .ct-main{font-size:1.08rem;font-weight:700;letter-spacing:.005em}
.ct-bar .ct-sub{font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:none;opacity:.72}
.ct-bar .ct a.on .ct-sub{opacity:.7}
.ct-bar .ct b{min-width:22px;padding:2px 7px;border-radius:999px;background:rgba(255,255,255,.16);font-size:.68rem;font-weight:700;transition:background .3s}
.ct-bar .ct a.on b{background:rgba(11,27,68,.14)}
.c-block{scroll-margin-top:150px}
@media (max-width:1100px){.ct-bar{top:72px}}
@media (max-width:560px){
  .ct-bar .ct{width:100%;gap:2px;padding:5px}
  .ct-bar .ct-pill{top:5px;bottom:5px}
  .ct-bar .ct a{flex:1 1 0;min-width:0;padding:8px 6px}
  .ct-bar .ct b{display:none}
  .ct-bar .ct-main{font-size:.86rem}
  .ct-bar .ct-sub{font-size:.82rem;letter-spacing:.03em}
}
@media (prefers-reduced-motion:reduce){.ct-bar .ct-pill{transition:none}}
`;

const split = (title: string): [string, string] => {
  const m = title.match(/^(.*?)\s+Council$/i);
  return m ? [m[1], "Council"] : [title, ""];
};

export default function CouncilTabs({ tabs }: { tabs: Tab[] }) {
  const [on, setOn] = useState(tabs[0].id);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  const box = useRef<HTMLDivElement>(null);
  const lock = useRef(0);

  // which section is on screen
  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const pick = () => {
      if (Date.now() < lock.current) return;
      const line = window.innerHeight * 0.38;
      let cur = tabs[0].id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
      setOn(cur);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    return () => window.removeEventListener("scroll", pick);
  }, [tabs]);

  // put the highlight exactly behind the active tab (measured from the real boxes, so it always fits)
  const place = useCallback(() => {
    const b = box.current;
    const a = b?.querySelector<HTMLElement>(`[data-id="${on}"]`);
    if (!b || !a) return;
    const br = b.getBoundingClientRect(), ar = a.getBoundingClientRect();
    setPill({ x: Math.round(ar.left - br.left), w: Math.round(ar.width) });
  }, [on]);

  useLayoutEffect(() => { place(); }, [place]);
  useEffect(() => {
    const b = box.current;
    if (!b) return;
    const ro = new ResizeObserver(place);
    ro.observe(b);
    b.querySelectorAll("a").forEach((a) => ro.observe(a));
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => { ro.disconnect(); window.removeEventListener("resize", place); };
  }, [place]);

  return (
    <div className="ct-bar">
      <style>{CSS}</style>
      <div className="wrap">
        <div className="ct" ref={box} role="navigation" aria-label="Council sections">
          <i className="ct-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true" />
          {tabs.map((t) => {
            const [main, sub] = split(t.title);
            return (
              <a
                key={t.id}
                href={`#${t.id}`}
                data-id={t.id}
                className={on === t.id ? "on" : ""}
                aria-current={on === t.id ? "true" : undefined}
                aria-label={t.title}
                onClick={() => { setOn(t.id); lock.current = Date.now() + 900; }}
              >
                <span className="ct-t"><span className="ct-main">{main}</span>{sub && <span className="ct-sub">{sub}</span>}</span>
                {typeof t.count === "number" && <b>{t.count}</b>}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}