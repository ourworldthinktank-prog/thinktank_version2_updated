"use client";

import { useEffect, useRef } from "react";

export type FooterLogo = { src: string; alt: string };

/* ---- tweak these ---- */
const SLOW = 30;          // px/s. Normal drift, left to right
const FAST = 150;         // px/s. Speed while the mouse is over the strip, right to left
const REDUCED_SLOW = 25;  // px/s. Very slow drift when the OS asks for reduced motion (set 0 to make it fully still)

/**
 * Landmarks drift left to right. While the mouse is over them they speed up and run right to left,
 * then ease back. Layout, sizes, gaps and the greyscale/colour hover all come from the .ft-* rules in Footer.tsx,
 * so the landmarks stand on the footer's own bottom line.
 * Movement is JavaScript, so global "no animation" CSS can't freeze it.
 */
export default function FooterMarquee({ logos }: { logos: FooterLogo[] }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    if (!view || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = reduce ? REDUCED_SLOW : SLOW;
    const fast = reduce ? 0 : FAST; // with reduced motion, hovering just pauses it

    let pos = 0;     // track translateX, kept between -half and 0
    let v = base;    // current velocity, eased toward the target
    let hover = false;
    let visible = true;
    let last = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;

      v += ((hover ? -fast : base) - v) * (1 - Math.exp(-dt * 5)); // smooth speed and direction change
      const half = track.scrollWidth / 2 || 1;
      pos += v * dt;
      if (pos >= 0) pos -= half;
      else if (pos < -half) pos += half;
      track.style.transform = `translate3d(${pos.toFixed(1)}px,0,0)`;
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(view);

    // mouse only: a tap on a phone should not trigger the fast run
    const enter = (e: PointerEvent) => { if (e.pointerType === "mouse") hover = true; };
    const leave = () => { hover = false; };
    view.addEventListener("pointerenter", enter);
    view.addEventListener("pointerleave", leave);

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      view.removeEventListener("pointerenter", enter);
      view.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (!logos.length) return null;
  // enough copies in each half to always fill a wide screen
  const reps = Math.max(1, Math.ceil(16 / logos.length));
  const half = Array.from({ length: reps }, () => logos).flat();

  return (
    <div className="ft-view" ref={viewRef}>
      <div className="ft-track" ref={trackRef}>
        {[0, 1].map((h) => (
          <div className="ft-half" key={h} aria-hidden={h === 1 ? "true" : undefined}>
            {half.map((l, i) => (
              <span className="ft-lg" key={`${h}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={h === 0 ? l.alt : ""} decoding="async" draggable={false} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}