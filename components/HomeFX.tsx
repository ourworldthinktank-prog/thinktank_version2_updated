"use client";

import { useEffect } from "react";

// Brings the homepage to life: waits for the intro, reveals sections on scroll, scroll progress bar,
// cursor glow, hero parallax, tilting and spotlight cards, magnetic buttons and gallery parallax.
// Everything calms down for visitors who prefer reduced motion, and pointer effects are off on touch screens.
export default function HomeFX() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".home-dark");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const off: Array<() => void> = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const on = (el: HTMLElement | Window | Document, ev: string, fn: (e: any) => void, opt?: AddEventListenerOptions) => {
      el.addEventListener(ev, fn as EventListener, opt);
      off.push(() => el.removeEventListener(ev, fn as EventListener, opt));
    };

    // 1) start hero entrance once the intro has finished (or straight away when there is no intro)
    const ready = () => root.classList.add("ready");
    const state = document.documentElement.dataset.intro;
    if (state !== "run") ready();
    else { on(window, "owii:intro-done", ready, { once: true }); }

    // 2) reveal on scroll
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-r]"));
    if (reduce || !("IntersectionObserver" in window)) targets.forEach((t) => t.classList.add("in"));
    else {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }), { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
      targets.forEach((t) => io.observe(t));
      off.push(() => io.disconnect());
    }

    // 3) scroll progress + parallax layers
    const bar = root.querySelector<HTMLElement>(".scroll-progress");
    const par = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
        if (!reduce) {
          const vh = window.innerHeight;
          for (const el of par) {
            const r = el.getBoundingClientRect();
            if (r.bottom < -200 || r.top > vh + 200) continue;
            const speed = parseFloat(el.dataset.parallax || "0.1");
            el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -speed).toFixed(1)}px`;
          }
        }
      });
    };
    on(window, "scroll", onScroll, { passive: true });
    on(window, "resize", onScroll);
    onScroll();

    if (!reduce && fine) {
      // 4) soft cursor glow
      const glow = root.querySelector<HTMLElement>(".cursor-glow");
      if (glow) {
        let tx = window.innerWidth / 2, ty = window.innerHeight / 2, x = tx, y = ty, raf = 0, shown = false;
        const loop = () => {
          x += (tx - x) * 0.14; y += (ty - y) * 0.14;
          glow.style.translate = `${x - 160}px ${y - 160}px`;
          raf = requestAnimationFrame(loop);
        };
        on(window, "pointermove", (e: PointerEvent) => {
          tx = e.clientX; ty = e.clientY;
          if (!shown) { shown = true; glow.style.opacity = "1"; loop(); }
        });
        off.push(() => cancelAnimationFrame(raf));
      }

      // 5) hero parallax (CSS reads --nx / --ny)
      const hero = root.querySelector<HTMLElement>(".hm-hero");
      if (hero) {
        on(hero, "pointermove", (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          hero.style.setProperty("--nx", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
          hero.style.setProperty("--ny", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
        });
        on(hero, "pointerleave", () => { hero.style.setProperty("--nx", "0"); hero.style.setProperty("--ny", "0"); });
      }

      // 6) spotlight + tilt cards
      root.querySelectorAll<HTMLElement>("[data-spot]").forEach((el) => {
        const tilt = el.hasAttribute("data-tilt");
        on(el, "pointermove", (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left, y = e.clientY - r.top;
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty("--my", `${y}px`);
          if (tilt) {
            el.style.setProperty("--ty", `${(((x / r.width) - 0.5) * 12).toFixed(2)}deg`);
            el.style.setProperty("--tx", `${(-((y / r.height) - 0.5) * 12).toFixed(2)}deg`);
          }
        });
        on(el, "pointerleave", () => { el.style.setProperty("--tx", "0deg"); el.style.setProperty("--ty", "0deg"); });
      });

      // 7) magnetic buttons
      root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        on(el, "pointermove", (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.translate = `${((e.clientX - (r.left + r.width / 2)) * 0.22).toFixed(1)}px ${((e.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1)}px`;
        });
        on(el, "pointerleave", () => { el.style.translate = "0 0"; });
      });
    }

    return () => off.forEach((f) => f());
  }, []);

  return null;
}
