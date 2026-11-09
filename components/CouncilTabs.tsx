"use client";

import { useEffect, useRef, useState } from "react";

interface Tab { id: string; title: string; count: number }

// Sticky switcher with a sliding highlight that follows the section on screen.
export default function CouncilTabs({ tabs }: { tabs: Tab[] }) {
  const [on, setOn] = useState(tabs[0].id);
  const [pill, setPill] = useState({ x: 0, w: 0 });
  const box = useRef<HTMLDivElement>(null);
  const lock = useRef(0);

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

  useEffect(() => {
    const place = () => {
      const a = box.current?.querySelector<HTMLElement>(`[data-id="${on}"]`);
      if (a) setPill({ x: a.offsetLeft, w: a.offsetWidth });
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [on]);

  return (
    <div className="ct-bar">
      <div className="wrap">
        <div className="ct" ref={box} role="navigation" aria-label="Council sections">
          <i className="ct-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true" />
          {tabs.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              data-id={t.id}
              className={on === t.id ? "on" : ""}
              aria-current={on === t.id ? "true" : undefined}
              onClick={() => { setOn(t.id); lock.current = Date.now() + 900; }}
            >
              {t.title}<b>{t.count}</b>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}