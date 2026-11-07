"use client";

import { useEffect, useRef } from "react";

// Words light up one by one as the section scrolls into view.
// marks: a word (lowercase, no punctuation) can be given an extra effect.
//   "glow"   = animated gradient text      "strike" = a line draws through it
export type Marks = Record<string, "glow" | "strike">;

export default function WordReveal({ lines, marks = {}, className = "" }: { lines: string[]; marks?: Marks; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".wr-w"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { words.forEach((w) => w.classList.add("lit")); return; }
    let lit = -1, raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (r.height + vh * 0.4)));
      const n = Math.round(p * words.length);
      if (n === lit) return;
      words.forEach((w, i) => w.classList.toggle("lit", i < n));
      lit = n;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className={`wr ${className}`} ref={root}>
      {lines.map((line, li) => (
        <p key={li} className={`wr-line wr-l${li + 1}`}>
          {line.split(" ").map((w, wi) => {
            const key = w.toLowerCase().replace(/[^a-z]/g, "");
            return <span key={wi} className={`wr-w${marks[key] ? " " + marks[key] : ""}`}>{w}</span>;
          }).flatMap((n, i, a) => (i < a.length - 1 ? [n, " "] : [n]))}
        </p>
      ))}
    </div>
  );
}
