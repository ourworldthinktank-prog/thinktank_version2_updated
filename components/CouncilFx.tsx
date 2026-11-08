"use client";

import { useEffect } from "react";

/* Tiny pointer layer for the council page (mouse only, one listener, no re-renders):
   - sets --mx/--my so the colour reveal grows from the cursor
   - tilts the hovered card a few degrees
   - moves the "VIEW" bubble that follows the cursor over cards
   Without this component the page still works: the reveal just grows from the centre. */
export default function CouncilFx({ honorReducedMotion = true }: { honorReducedMotion?: boolean }) {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const calm = honorReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cur = document.querySelector<HTMLElement>(".cb-cur");

    let card: HTMLElement | null = null;
    let last: PointerEvent | null = null;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;

    const tilt = (c: HTMLElement, rx: number, ry: number) => {
      c.style.setProperty("--rx", `${rx}deg`);
      c.style.setProperty("--ry", `${ry}deg`);
    };

    const loop = () => {
      raf = 0;
      if (!card) return;
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      if (cur) cur.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const frame = card.querySelector<HTMLElement>(".cb-fr");
      if (frame && last) {
        const r = frame.getBoundingClientRect();
        const px = last.clientX - r.left, py = last.clientY - r.top;
        card.style.setProperty("--mx", `${px}px`);
        card.style.setProperty("--my", `${py}px`);
        if (!calm) tilt(card, -(py / r.height - 0.5) * 8, (px / r.width - 0.5) * 10);
      }
      raf = requestAnimationFrame(loop);
    };

    const leaveCard = () => {
      if (card) tilt(card, 0, 0);
      card = null;
      cur?.classList.remove("on");
    };

    const onMove = (e: PointerEvent) => {
      last = e; tx = e.clientX; ty = e.clientY;
      const next = (e.target as Element | null)?.closest<HTMLElement>(".cb-fx") ?? null;
      if (next !== card) {
        leaveCard();
        card = next;
        if (card && cur) {
          x = tx; y = ty;
          cur.style.setProperty("--ac", getComputedStyle(card).getPropertyValue("--ac") || "#F7A21B");
          cur.classList.add("on");
        }
      }
      if (card && !raf) raf = requestAnimationFrame(loop);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", leaveCard);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", leaveCard);
      cancelAnimationFrame(raf);
    };
  }, [honorReducedMotion]);

  return null;
}