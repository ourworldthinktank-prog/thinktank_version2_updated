"use client";

import { useEffect, useRef, useState } from "react";

interface Aim { n: string; t: string; tag: string; d: string }
const EVERY = 5000;      // desktop: ms before it moves on by itself
const STICKY_TOP = 88;   // phone: gap under the header while the panels are pinned

// Expanding panels.
// Desktop: hover, focus or tap opens one, and it steps along by itself until the visitor takes over.
// Phone: the panels pin to the screen and open 1, 2, 3, 4 as you scroll.
export default function AimsAccordion({ aims }: { aims: Aim[] }) {
  const [on, setOn] = useState(0);
  const [auto, setAuto] = useState(false);
  const [seen, setSeen] = useState(false);
  const [phone, setPhone] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const set = () => setPhone(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAuto(!reduce);
  }, []);

  // desktop: step along by itself
  useEffect(() => {
    if (phone || !auto || !seen || touched.current) return;
    const id = window.setTimeout(() => setOn((v) => (v + 1) % aims.length), EVERY);
    return () => clearTimeout(id);
  }, [phone, auto, seen, on, aims.length]);

  // phone: scroll position decides which panel is open
  useEffect(() => {
    if (!phone) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const range = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(0.9999, Math.max(0, (STICKY_TOP - r.top) / range));
      setOn(Math.floor(p * aims.length));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [phone, aims.length]);

  const pick = (i: number) => { touched.current = true; setAuto(false); setOn(i); };

  return (
    <div className="ab-axw" ref={wrap} style={{ ["--n" as string]: aims.length }}>
      <div className="ab-ax" ref={root} style={{ ["--ab-ax-t" as string]: `${EVERY}ms` }}>
        {aims.map((a, i) => (
          <div
            key={a.n}
            className={`ab-ax-p${on === i ? " on" : ""}${!phone && auto && seen && !touched.current ? " ab-autoplay" : ""}`}
            onMouseEnter={() => { if (!phone && window.matchMedia("(hover: hover)").matches) pick(i); }}
          >
            <button
              type="button"
              className="ab-ax-hit"
              style={{ position: "absolute", inset: 0, zIndex: 3, cursor: on === i ? "default" : "pointer", background: "none", border: 0 }}
              onClick={() => pick(i)}
              onFocus={() => { if (!phone) pick(i); }}
              aria-expanded={on === i}
              aria-label={`${a.n} ${a.t}`}
            />
            <span className="ab-ax-bar" aria-hidden="true" />
            <div className="ab-ax-top"><i aria-hidden="true" />{a.n}</div>
            <span className="ab-ax-vt" aria-hidden="true">{a.t}</span>
            <div className="ab-ax-body">
              <span className="ab-ax-tag">{a.tag}</span>
              <h3>{a.t}</h3>
              <p>{a.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}