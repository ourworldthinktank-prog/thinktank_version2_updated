"use client";

import { useEffect, useState, type CSSProperties } from "react";

// Middle line of the hero headline: "Ideas for [ a fairer ] world."
// Self-contained: it switches words with a timer and CSS transitions (no keyframes),
// so it keeps changing even when a global stylesheet freezes animations.
const PHRASES = ["a fairer", "a greener", "a safer", "an equal", "a stronger", "a freer"];

export default function HeroWords({ phrases = PHRASES, interval = 2600 }: { phrases?: string[]; interval?: number }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(-1);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const every = rm ? Math.max(interval, 500) : interval;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      stop();
      timer = setInterval(() => {
        setIdx((i) => {
          setPrev(i);
          return (i + 1) % phrases.length;
        });
      }, every);
    };
    const stop = () => { if (timer) clearInterval(timer); };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [phrases.length, interval]);

  return (
    <span className="hw-line hw-rot" aria-hidden="true">
      <span className="kw">
        <span style={{ ["--i" as string]: 2 } as CSSProperties}>
          <span className="hwr">
            {phrases.map((p, i) => (
              <span className={`hwr-w${i === idx ? " on" : i === prev ? " out" : ""}`} key={p}>{p}</span>
            ))}
          </span>
        </span>
      </span>
    </span>
  );
}