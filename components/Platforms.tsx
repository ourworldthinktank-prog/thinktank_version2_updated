"use client";

import { useRef, useState } from "react";
import type { Platform } from "@/lib/content";
import { ArrowIcon } from "./Icons";

export default function Platforms({ platforms }: { platforms: Platform[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : platforms.length - 1)) % platforms.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  return (
    <section className="sec platforms" id="platforms">
      <div className="wrap pf">
        <div className="rv">
          <div className="bars"><i /><i /><i /></div>
          <div className="tabs" role="tablist" aria-label="Our platforms">
            {platforms.map((p, i) => (
              <button
                key={p.id}
                ref={(el) => { refs.current[i] = el; }}
                role="tab"
                type="button"
                id={`tab-${p.id}`}
                aria-selected={active === i}
                aria-controls={`panel-${p.id}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <h2>Two platforms.<br /><span>A shared purpose.</span></h2>
          {platforms.map((p, i) => (
            <div key={p.id} className="pf-panel" id={`panel-${p.id}`} role="tabpanel" aria-labelledby={`tab-${p.id}`} hidden={active !== i}>
              <p>{p.body}</p>
              <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              <a className="link" href={p.href}>Learn more <ArrowIcon size={16} /></a>
            </div>
          ))}
        </div>
        <div className="pf-art rv" aria-hidden="true">
          <svg viewBox="0 0 440 400" preserveAspectRatio="xMidYMid slice">
            <circle cx="330" cy="90" r="90" fill="#fff" opacity=".14" />
            <path d="M0 400V300c60-40 120-10 180-40s90-90 160-80 100 50 100 50v170z" fill="#0F2A5C" opacity=".35" />
            <g fill="none" stroke="#fff" strokeWidth="3" opacity=".85">
              <path d="M150 400V200a70 70 0 0 1 140 0v200" /><path d="M180 400V210a40 40 0 0 1 80 0v190" /><path d="M110 400V170h220v230" /><path d="M110 170h220" />
            </g>
            <path d="M0 360c80-50 160-20 240-30s160 40 200 20v50H0z" fill="#F26B3A" opacity=".9" />
          </svg>
        </div>
      </div>
    </section>
  );
}
