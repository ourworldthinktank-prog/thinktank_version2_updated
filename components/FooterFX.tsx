"use client";

import { useEffect, useRef } from "react";

// Animated wave (the white page flows into the navy footer) and a few sparkling stars.
// Draws on two canvases. Pauses when the footer is off screen. Respects reduced motion.
const STARS = [
  { x: 0.43, y: 0.12, r: 7, c: "255,255,255", p: 0.0 },
  { x: 0.58, y: 0.82, r: 5, c: "255,214,120", p: 1.7 },
  { x: 0.79, y: 0.1, r: 4, c: "255,255,255", p: 3.1 },
  { x: 0.95, y: 0.55, r: 6, c: "255,255,255", p: 0.9 },
  { x: 0.33, y: 0.86, r: 4, c: "255,255,255", p: 2.4 },
  { x: 0.66, y: 0.4, r: 3, c: "160,230,220", p: 4.0 },
  { x: 0.05, y: 0.7, r: 4, c: "255,214,120", p: 3.6 },
];
const ss = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

export default function FooterFX() {
  const waveRef = useRef<HTMLCanvasElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wave = waveRef.current!;
    const sky = skyRef.current!;
    const footer = wave.closest("footer") as HTMLElement;
    const wctx = wave.getContext("2d")!;
    const sctx = sky.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let WW = 0, WH = 0, SW = 0, SH = 0;
    const mouse = { x: -1, tx: -1, p: 0, on: false };

    // tagline fade-in when the footer comes into view
    let inObs: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      inObs = new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { footer.classList.add("in"); o.disconnect(); } }, { threshold: 0.2 });
      inObs.observe(footer);
    } else footer.classList.add("in");

    const sizeWave = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      WW = wave.clientWidth; WH = wave.clientHeight;
      wave.width = WW * dpr; wave.height = WH * dpr;
      wctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const sizeSky = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      SW = sky.clientWidth; SH = sky.clientHeight;
      sky.width = SW * dpr; sky.height = SH * dpr;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // navy edge: high at the left, dips just left of centre, sweeps up to the top right
    const edge = (x: number, t: number) => {
      const u = x / WW;
      const A = 0.56, B = 0.94, Bx = 0.3, C = 0.38;
      let y = u < Bx ? A + (B - A) * ss(u / Bx) : B + (C - B) * ss((u - Bx) / (1 - Bx));
      y *= WH;
      y += Math.sin(u * 7 + t * 0.6) * WH * 0.022 * (0.3 + u) + Math.sin(u * 17 - t * 0.9) * WH * 0.008;
      if (mouse.p > 0.001) y -= WH * 0.07 * Math.exp(-(((x - mouse.x) / (WW * 0.12)) ** 2)) * mouse.p;
      return y;
    };

    const drawWave = (t: number) => {
      if (!WW) return;
      const N = 90, xs: number[] = [];
      for (let i = 0; i <= N; i++) xs.push((i / N) * WW);
      const e = xs.map((x) => edge(x, t));
      const k = WH / 220;
      const thick = (u: number, start: number, max: number) => (u < start ? 0 : max * k * ss(clamp01((u - start) / (1 - start))));
      const red = e.map((y, i) => y - thick(xs[i] / WW, 0.3, 20));
      const amber = red.map((y, i) => y - thick(xs[i] / WW, 0.26, 14));
      const teal = amber.map((y, i) => y - (xs[i] / WW < 0.05 ? 0 : 1.6 + thick(xs[i] / WW, 0.05, 9)));

      wctx.clearRect(0, 0, WW, WH);

      // wireframe surface on the left, flowing into the teal ribbon
      const meshEnd = 0.58, rows = 9, cols = 30;
      const surf = (u: number, v: number): [number, number] => {
        const x = u * WW * meshEnd;
        const f = 1 - ss(clamp01(x / (WW * meshEnd)));
        const lift = WH * 0.26 * v * f;
        const ripple = Math.sin(u * 9 + t * 1.1 + v * 2.2) * WH * 0.035 * f * v;
        const i = Math.min(N, Math.round((x / WW) * N));
        const base = teal[i] + (teal[Math.min(N, i + 1)] - teal[i]) * ((x / WW) * N - i);
        return [x + v * 22 * f, base - lift + ripple];
      };
      wctx.lineWidth = 0.7;
      for (let r = 0; r <= rows; r++) {
        const v = r / rows;
        wctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const [x, y] = surf(c / cols, v);
          c ? wctx.lineTo(x, y) : wctx.moveTo(x, y);
        }
        const g = wctx.createLinearGradient(0, 0, WW * meshEnd, 0);
        g.addColorStop(0, `rgba(20,166,143,${(0.7 - v * 0.5).toFixed(2)})`);
        g.addColorStop(0.7, `rgba(20,166,143,${(0.45 - v * 0.3).toFixed(2)})`);
        g.addColorStop(1, "rgba(20,166,143,0)");
        wctx.strokeStyle = g; wctx.stroke();
      }
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        wctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const [x, y] = surf(u, r / rows);
          r ? wctx.lineTo(x, y) : wctx.moveTo(x, y);
        }
        wctx.strokeStyle = `rgba(20,166,143,${(0.32 * (1 - u) ** 1.4).toFixed(3)})`;
        wctx.stroke();
      }

      const band = (top: number[], bottom: number[], c1: string, c2: string, c3: string) => {
        wctx.beginPath();
        wctx.moveTo(xs[0], top[0]);
        for (let i = 1; i <= N; i++) wctx.lineTo(xs[i], top[i]);
        for (let i = N; i >= 0; i--) wctx.lineTo(xs[i], bottom[i]);
        wctx.closePath();
        const g = wctx.createLinearGradient(0, 0, WW, 0);
        g.addColorStop(0, c1); g.addColorStop(0.55, c2); g.addColorStop(1, c3);
        wctx.fillStyle = g; wctx.fill();
      };
      wctx.beginPath(); wctx.moveTo(0, WH + 1);
      for (let i = 0; i <= N; i++) wctx.lineTo(xs[i], e[i]);
      wctx.lineTo(WW, WH + 1); wctx.closePath();
      wctx.fillStyle = "#031F54"; wctx.fill();

      band(red, e, "#F04A3A", "#E8233A", "#D3162F");
      band(amber, red, "#FBC93A", "#F7B71E", "#F5A90E");
      band(teal, amber, "#18B49B", "#14A68F", "#0F927E");

      wctx.beginPath(); wctx.moveTo(xs[0], teal[0]);
      for (let i = 1; i <= N; i++) wctx.lineTo(xs[i], teal[i]);
      wctx.strokeStyle = "rgba(255,255,255,0.35)"; wctx.lineWidth = 1; wctx.stroke();

      if (!reduce) {
        const head = ((t * 0.08) % 1.4) - 0.2;
        const g = wctx.createLinearGradient(0, 0, WW, 0);
        const a = clamp01(head - 0.08), b = clamp01(head), c = clamp01(head + 0.08);
        g.addColorStop(0, "rgba(255,255,255,0)");
        if (a < b) g.addColorStop(a, "rgba(255,255,255,0)");
        g.addColorStop(b, "rgba(255,255,255,0.35)");
        if (c > b) g.addColorStop(c, "rgba(255,255,255,0)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        wctx.beginPath(); wctx.moveTo(xs[0], teal[0]);
        for (let i = 1; i <= N; i++) wctx.lineTo(xs[i], teal[i]);
        for (let i = N; i >= 0; i--) wctx.lineTo(xs[i], e[i]);
        wctx.closePath(); wctx.fillStyle = g; wctx.fill();
      }
    };

    const sparkle = (x: number, y: number, r: number, a: number, c: string, rot: number) => {
      if (a <= 0.01) return;
      sctx.save(); sctx.translate(x, y); sctx.rotate(rot);
      const g = sctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.6);
      g.addColorStop(0, `rgba(${c},${(0.35 * a).toFixed(3)})`); g.addColorStop(1, `rgba(${c},0)`);
      sctx.fillStyle = g; sctx.beginPath(); sctx.arc(0, 0, r * 2.6, 0, Math.PI * 2); sctx.fill();
      sctx.fillStyle = `rgba(${c},${a.toFixed(3)})`;
      sctx.beginPath();
      sctx.moveTo(0, -r * 1.6);
      sctx.quadraticCurveTo(r * 0.18, -r * 0.18, r * 1.6, 0);
      sctx.quadraticCurveTo(r * 0.18, r * 0.18, 0, r * 1.6);
      sctx.quadraticCurveTo(-r * 0.18, r * 0.18, -r * 1.6, 0);
      sctx.quadraticCurveTo(-r * 0.18, -r * 0.18, 0, -r * 1.6);
      sctx.fill();
      sctx.restore();
    };

    let shoot: { t0: number; x: number; y: number } | null = null;
    let nextShoot = 6;
    const drawSky = (t: number) => {
      if (!SW) return;
      sctx.clearRect(0, 0, SW, SH);
      for (const s of STARS) {
        const ph = (t * 0.22 + s.p * 0.37) % 1;
        const a = reduce ? 0.7 : Math.pow(Math.sin(ph * Math.PI), 3);
        sparkle(s.x * SW, s.y * SH, s.r * (0.6 + 0.4 * a), a, s.c, ph * 0.8);
        sctx.fillStyle = `rgba(${s.c},0.25)`; sctx.beginPath(); sctx.arc(s.x * SW, s.y * SH, 0.9, 0, Math.PI * 2); sctx.fill();
      }
      if (reduce) return;
      if (!shoot && t > nextShoot) shoot = { t0: t, x: SW * (0.55 + Math.random() * 0.35), y: SH * (0.05 + Math.random() * 0.2) };
      if (shoot) {
        const k = (t - shoot.t0) / 1.1;
        if (k >= 1) { shoot = null; nextShoot = t + 10 + Math.random() * 8; }
        else {
          const x = shoot.x - k * 220, y = shoot.y + k * 90, a = Math.sin(k * Math.PI);
          const g = sctx.createLinearGradient(x, y, x + 90, y - 37);
          g.addColorStop(0, `rgba(255,255,255,${(0.9 * a).toFixed(2)})`); g.addColorStop(1, "rgba(255,255,255,0)");
          sctx.strokeStyle = g; sctx.lineWidth = 1.4; sctx.lineCap = "round";
          sctx.beginPath(); sctx.moveTo(x, y); sctx.lineTo(x + 90, y - 37); sctx.stroke();
        }
      }
    };

    let last = performance.now(), running = false, raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(48, now - last) / 16.67; last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.08 * dt;
      mouse.p += ((mouse.on ? 1 : 0) - mouse.p) * 0.05 * dt;
      const t = now / 1000;
      drawWave(t); drawSky(t);
      if (running) raf = requestAnimationFrame(frame);
    };
    const resize = () => { sizeWave(); sizeSky(); if (!running) { drawWave(0); drawSky(0); } };
    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(resize, 100); };
    const onMove = (ev: PointerEvent) => {
      const r = wave.getBoundingClientRect();
      mouse.tx = ev.clientX - r.left;
      if (mouse.p < 0.05) mouse.x = mouse.tx;
      mouse.on = true;
    };
    const onLeave = () => { mouse.on = false; };

    window.addEventListener("resize", onResize);
    footer.addEventListener("pointermove", onMove);
    footer.addEventListener("pointerleave", onLeave);
    resize();

    let runObs: IntersectionObserver | null = null;
    if (!reduce) {
      runObs = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) { if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); } }
        else running = false;
      });
      runObs.observe(footer);
    }
    return () => {
      running = false; cancelAnimationFrame(raf); clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      footer.removeEventListener("pointermove", onMove);
      footer.removeEventListener("pointerleave", onLeave);
      inObs?.disconnect(); runObs?.disconnect();
    };
  }, []);

  return (
    <>
      <canvas ref={waveRef} className="ft2-wave" aria-hidden="true" />
      <canvas ref={skyRef} className="ft2-sky" aria-hidden="true" />
    </>
  );
}