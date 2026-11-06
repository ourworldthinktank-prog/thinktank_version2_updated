"use client";

import { useRef, useState } from "react";

export interface GTab { id: string; kicker: string; title: string; items: string[]; tone: "t1" | "t2" | "t3" }

// Animated tabs: a sliding accent bar on the list, and a coloured panel whose bullets ease in one by one.
export default function GlobalTabs({ tabs }: { tabs: GTab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = tabs[active];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const k = e.key;
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(k)) return;
    e.preventDefault();
    const n = (i + (k === "ArrowDown" || k === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  return (
    <div className="gtabs">
      <div className="gtab-list" role="tablist" aria-label="Global Initiative focus">
        {tabs.map((x, i) => (
          <button
            key={x.id}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`gt-${x.id}`}
            aria-selected={active === i}
            aria-controls={`gp-${x.id}`}
            tabIndex={active === i ? 0 : -1}
            className={`gtab ${x.tone}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <small>{x.kicker}</small>
            <b>{x.title}</b>
          </button>
        ))}
      </div>
      <div key={t.id} className={`gpanel ${t.tone}`} role="tabpanel" id={`gp-${t.id}`} aria-labelledby={`gt-${t.id}`}>
        <div className="big">0{active + 1}</div>
        <h3>{t.title}</h3>
        <ul>
          {t.items.map((it, i) => (
            <li key={it} style={{ animationDelay: `${150 + i * 110}ms` }}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
