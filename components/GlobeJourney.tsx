"use client";

import { useEffect, useRef } from "react";
import { LAND, SEA, INDIA_PTS, INDIA_RINGS, INDIA_POLY } from "./globeData";

/**
 * One particle globe that travels with the page:
 *   hero slot  ->  about slot  ->  splits into three worlds over the pillars.
 *
 * It finds its stops in the DOM:
 *   [data-gs="hero"]      the hero slot (empty div)
 *   [data-gs="about"]     the about slot (empty div)
 *   #focus                the pillars section
 *   [data-gs-world]       (optional) three elements inside the pillars, one world each
 *   [data-gj-focus="lon,lat"]  any element: hover/click turns the globe to that place
 */

const D = Math.PI / 180;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const hexRgb = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};

// Palette from the Bharat Summit globe artwork: amber, orange, red, cyan, teal, deep teal, navy.
const COLS = ["#F5A12A", "#F7A21B", "#F5A12A", "#1FB8CF", "#1E9C8C", "#1C6E8C", "#1C2D5E"].map(hexRgb);
const NC = COLS.length;
const NA = 8;

const CHIPS = [
  { label: "Democracy", sub: "India, the world’s largest", lon: 78, lat: 22, ang: -0.95 },
  { label: "Equality", sub: "Fair growth for all", lon: 22, lat: 2, ang: 0.35 },
  { label: "Planet", sub: "One shared home", lon: -62, lat: -8, ang: 1.95 },
];

function toVec(lon: number, lat: number): [number, number, number] {
  const cl = Math.cos(lat * D);
  return [cl * Math.cos(lon * D), Math.sin(lat * D), -cl * Math.sin(lon * D)];
}
function inPoly(x: number, y: number, poly: [number, number][]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[j];
    if (y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) c = !c;
  }
  return c;
}
function regionColour(lon: number, lat: number) {
  if (inPoly(lon, lat, INDIA_POLY)) return lat < 21 ? 1 : 0; // India: amber / orange
  if (lon < -30) return lat > 15 ? (lat > 50 ? 0 : 1) : lat > -20 ? 4 : 3; // Americas
  if (lon < 52 && lat < 36) return lat < -10 ? 2 : lat < 10 ? 5 : 3; // Africa and Arabia
  if (lon < 60) return lat > 55 ? 6 : 3; // Europe
  if (lat < -8) return lon > 160 ? 1 : 2; // Oceania
  if (lat > 50) return 6; // Siberia
  return lon > 120 ? 5 : 4; // East and South-East Asia
}
// yaw / pitch that bring (lon, lat) to the centre of the visible disc
function faceYaw(lon: number, lat: number) {
  const v = toVec(lon, lat);
  return -Math.atan2(v[0], v[2]);
}

type Particle = { vx: number; vy: number; vz: number; c: number; land: number; s: number; g: number; h: number; india: number };
type Pose = { cx: number; cy: number; R: number };

export default function GlobeJourney() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const chipsEl = chipsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The home page runs a first-visit intro (data-intro="run") and waits for something to finish it.
    // If nothing has by now, finish it here so the header and hero copy are never left hidden.
    const html = document.documentElement;
    const introTimer = window.setTimeout(() => {
      if (html.getAttribute("data-intro") === "run") {
        try { sessionStorage.setItem("owii-intro", "1"); } catch { /* private mode */ }
        html.setAttribute("data-intro", "skip");
      }
      html.classList.add("gj-safe"); // last-resort reveal, see globe.css
    }, 4500);
    const debug = /[?&]gjdebug=1/.test(window.location.search);
    // Phones: fewer particles, lower pixel ratio, fewer arcs, so it stays smooth
    const lite = window.innerWidth < 700 || window.matchMedia("(pointer: coarse)").matches;
    // Dot size. Raise for bigger dots, lower for finer ones (phones draw fewer dots, so they get a little more).
    const DOT = lite ? 2.1 : 1.85;

    // ---------- build particles ----------
    const pts: Particle[] = [];
    const push = (lon: number, lat: number, c: number, land: number, s: number, india = 0) => {
      const v = toVec(lon, lat);
      pts.push({ vx: v[0], vy: v[1], vz: v[2], c, land, s, g: 0, h: Math.random(), india });
    };
    for (let i = 0; i < LAND.length; i += 2) {
      const lon = LAND[i] / 10;
      const lat = LAND[i + 1] / 10;
      if (lite && Math.random() < 0.35) continue;
      let c = regionColour(lon, lat);
      if (!inPoly(lon, lat, INDIA_POLY) && Math.random() < 0.07) c = (Math.random() * COLS.length) | 0; // a little texture
      push(lon, lat, c, 1, 0.8 + Math.random() * 0.5);
    }
    for (let i = 0; i < INDIA_PTS.length; i += 2) {
      const lat = INDIA_PTS[i + 1] / 100;
      push(INDIA_PTS[i] / 100, lat, lat < 21 ? 1 : 0, 1, 0.78 + Math.random() * 0.2, 1);
    }
    for (let i = 0; i < SEA.length; i += 2) {
      if (lite && Math.random() < 0.55) continue;
      push(SEA[i] / 10, SEA[i + 1] / 10, 5, 0, 0.6);
    }
    const N = pts.length;

    const rings = INDIA_RINGS.map((r) => {
      const out: [number, number, number][] = [];
      for (let i = 0; i < r.length; i += 2) out.push(toVec(r[i] / 100, r[i + 1] / 100));
      return out;
    });

    // arcs from India to the world
    const HOME: [number, number] = [77.2, 28.6];
    const CITIES: [number, number][] = [[-0.1, 51.5], [-74, 40.7], [-46.6, -23.5], [28, -26.2], [139.7, 35.7], [151.2, -33.9], [36.8, -1.3], [13.4, 52.5], [103.8, 1.35], [-99.1, 19.4]];
    const ARC_COLS = [1, 3, 0, 4, 2, 5].map((i) => COLS[i]);
    const slerp = (a: number[], b: number[], t: number) => {
      const dot = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1);
      const om = Math.acos(dot);
      const so = Math.sin(om) || 1e-6;
      const k1 = Math.sin((1 - t) * om) / so;
      const k2 = Math.sin(t * om) / so;
      return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
    };
    const arcs = CITIES.map((c, i) => {
      const a = toVec(HOME[0], HOME[1]);
      const b = toVec(c[0], c[1]);
      const dist = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
      const path: [number, number, number][] = [];
      for (let k = 0; k <= 48; k++) {
        const t = k / 48;
        const p = slerp(a, b, t);
        const h = 1 + Math.sin(t * Math.PI) * (0.08 + dist * 0.08);
        path.push([p[0] * h, p[1] * h, p[2] * h]);
      }
      return { path, t: Math.random(), speed: 0.0035 + Math.random() * 0.002, col: ARC_COLS[i % ARC_COLS.length] };
    });

    // Constellation of nodes and thin lines around the globe, like the design direction
    const nodes = Array.from({ length: lite ? 12 : 24 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 1.1 + Math.random() * 0.5,
      sp: (Math.random() < 0.5 ? -1 : 1) * (0.015 + Math.random() * 0.03),
      s: 1.6 + Math.random() * 1.8,
      c: [1, 3, 0, 4][(Math.random() * 4) | 0],
    }));
    const arcList = lite ? arcs.filter((_, i) => i % 2 === 0) : arcs;
    const motes = Array.from({ length: lite ? 14 : 36 }, () => ({
      x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7,
      r: 0.8 + Math.random() * 1.8, c: (Math.random() * 5) | 0, ph: Math.random() * 6.28,
    }));

    // ---------- state ----------
    let W = 0;
    let H = 0;
    let DPR = 1;
    let yaw = faceYaw(HOME[0], 22) - 0.35;
    let pitch = 0.3;
    let pitchTarget = 0.3;
    let yawVel = 0;
    const AUTO = rm ? 0 : 0.0016;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false, presence: 0, px: 0, py: 0 };
    let drag: { x: number; y: number } | null = null;
    let goal: { yaw: number; pitch: number; until: number } | null = null;
    const miniYaw = [faceYaw(78, 22), faceYaw(15, 20), faceYaw(-70, 0)];
    const miniHover = [0, 0, 0];

    const els: { hero: HTMLElement | null; about: HTMLElement | null; focus: HTMLElement | null; worlds: HTMLElement[]; mode: "attr" | "cards" | "thirds"; cardLayout: "row" | "col"; cards: HTMLElement[] } =
      { hero: null, about: null, focus: null, worlds: [], mode: "thirds", cardLayout: "row", cards: [] };

    // Looks for three card-like boxes inside the pillars section: side by side (row) or stacked (column)
    const findCards = (focus: HTMLElement): { list: HTMLElement[]; layout: "row" | "col" } | null => {
      const fr = focus.getBoundingClientRect();
      const all = Array.from(focus.querySelectorAll<HTMLElement>("article, li, [class*='card' i], [class*='pillar' i]"));
      const c = all.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 150 && r.width <= fr.width * 1.01 && r.height > 120;
      });
      const outer = c.filter((el) => !c.some((o) => o !== el && o.contains(el)));
      const group = (axis: "top" | "left") => {
        const groups: HTMLElement[][] = [];
        for (const el of outer) {
          const v = el.getBoundingClientRect()[axis];
          const g = groups.find((x) => Math.abs(x[0].getBoundingClientRect()[axis] - v) < 60);
          if (g) g.push(el); else groups.push([el]);
        }
        return groups.find((x) => x.length >= 3);
      };
      const row = group("top");
      if (row) return { list: row.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left).slice(0, 3), layout: "row" };
      const col = group("left");
      if (col) return { list: col.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top).slice(0, 3), layout: "col" };
      return null;
    };

    const refreshEls = () => {
      els.hero = document.querySelector<HTMLElement>('[data-gs="hero"]');
      els.about = document.querySelector<HTMLElement>('[data-gs="about"]');
      els.cards = Array.from(document.querySelectorAll<HTMLElement>(".pl-card"));
      els.focus = document.getElementById("focus") || document.querySelector<HTMLElement>('#pillars, [data-gs="pillars"], section.pillars');
      const attr = Array.from(document.querySelectorAll<HTMLElement>("[data-gs-world]"));
      if (attr.length >= 3) { els.worlds = attr.slice(0, 3); els.mode = "attr"; return; }
      const found = els.focus ? findCards(els.focus) : null;
      if (found) { els.worlds = found.list; els.mode = "cards"; els.cardLayout = found.layout; return; }
      els.worlds = []; els.mode = "thirds";
    };

    const layout = () => {
      DPR = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    // ---------- interaction ----------
    const setGoal = (lon: number, lat: number) => {
      if (drag) return;
      goal = { yaw: faceYaw(lon, lat), pitch: clamp(lat * D * 0.7, -0.7, 0.7), until: performance.now() + 2800 };
    };
    const onFocusEvt = (e: Event) => {
      const d = (e as CustomEvent<{ lon: number; lat: number }>).detail;
      if (d) setGoal(d.lon, d.lat);
    };
    const onOver = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.("[data-gj-focus]");
      if (!el) return;
      const [lon, lat] = (el.getAttribute("data-gj-focus") || "").split(",").map(Number);
      if (!Number.isNaN(lon) && !Number.isNaN(lat)) setGoal(lon, lat);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" && !drag) return;
      if (e.pointerType !== "touch") {
        mouse.tx = e.clientX;
        mouse.ty = e.clientY;
        if (mouse.presence < 0.05) { mouse.x = e.clientX; mouse.y = e.clientY; }
        mouse.active = true;
        mouse.px = e.clientX / W - 0.5;
        mouse.py = e.clientY / H - 0.5;
      }
      if (drag) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        yawVel = dx * 0.0045;
        yaw += dx * 0.0045;
        pitchTarget = clamp(pitchTarget + dy * 0.004, -0.9, 0.9);
        drag.x = e.clientX;
        drag.y = e.clientY;
      }
    };
    let bigNow: Pose | null = null;
    let sNow = 0;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !bigNow || sNow > 0.3) return;
      const t = e.target as Element | null;
      if (!t?.closest?.("[data-gs]") || t.closest("a,button,input,textarea,select")) return;
      if (Math.hypot(e.clientX - bigNow.cx, e.clientY - bigNow.cy) > bigNow.R * 1.15) return;
      drag = { x: e.clientX, y: e.clientY };
      goal = null;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    };
    const endDrag = () => {
      drag = null;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    const onLeave = () => { mouse.active = false; };

    // ---------- render ----------
    const NB = NC * NA;
    const buckets: number[][] = Array.from({ length: NB }, () => []);
    const out = [0, 0, 0];
    const proj = (vx: number, vy: number, vz: number, cy: number, sy: number, cp: number, sp: number) => {
      const x1 = vx * cy + vz * sy;
      const z1 = -vx * sy + vz * cy;
      out[0] = x1;
      out[1] = vy * cp - z1 * sp;
      out[2] = vy * sp + z1 * cp;
    };
    const L = [-0.45, 0.55, 0.7];

    const slotPose = (r: DOMRect): Pose => ({ cx: r.left + r.width / 2, cy: r.top + r.height / 2, R: (Math.min(r.width, r.height) / 2) * 0.94 });

    const drawHalo = (p: Pose, alpha: number) => {
      if (alpha < 0.01) return;
      const g = ctx.createRadialGradient(p.cx, p.cy, p.R * 0.8, p.cx, p.cy, p.R * 1.4);
      g.addColorStop(0, `rgba(31,184,207,${(0.06 * alpha).toFixed(3)})`);
      g.addColorStop(0.5, `rgba(245,161,42,${(0.06 * alpha).toFixed(3)})`);
      g.addColorStop(1, "rgba(245,161,42,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.cx, p.cy, p.R * 1.4, 0, Math.PI * 2);
      ctx.fill();
    };
    const drawRings = (p: Pose, ya: number, pi: number, alpha: number, w: number) => {
      if (alpha < 0.02) return;
      const cy = Math.cos(ya), sy = Math.sin(ya), cp = Math.cos(pi), sp = Math.sin(pi);
      ctx.lineJoin = "round";
      for (const pass of [[w * 3.2, 0.14], [w, 0.95]]) {
        ctx.lineWidth = pass[0];
        ctx.strokeStyle = `rgba(226,74,30,${(pass[1] * alpha).toFixed(3)})`;
        for (const ring of rings) {
          let open = false;
          ctx.beginPath();
          for (const v of ring) {
            proj(v[0], v[1], v[2], cy, sy, cp, sp);
            if (out[2] > 0.06) {
              const x = p.cx + out[0] * p.R;
              const y = p.cy - out[1] * p.R;
              if (open) ctx.lineTo(x, y); else { ctx.moveTo(x, y); open = true; }
            } else open = false;
          }
          ctx.stroke();
        }
      }
    };
    const drawNetwork = (p: Pose, t: number, alpha: number) => {
      if (alpha < 0.02) return;
      const pos = nodes.map((n) => {
        const ang = n.a + (rm ? 0 : t * n.sp);
        return [p.cx + Math.cos(ang) * n.r * p.R, p.cy + Math.sin(ang) * n.r * p.R * 0.92];
      });
      const reach = p.R * 0.62;
      ctx.lineWidth = 1;
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const d = Math.hypot(pos[i][0] - pos[j][0], pos[i][1] - pos[j][1]);
          if (d < reach) {
            ctx.strokeStyle = `rgba(15,27,77,${(0.17 * (1 - d / reach) * alpha).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(pos[i][0], pos[i][1]); ctx.lineTo(pos[j][0], pos[j][1]); ctx.stroke();
          }
        }
      }
      const k = clamp(p.R / 340, 0.6, 1.1);
      nodes.forEach((n, i) => {
        const [r, g, b] = COLS[n.c];
        ctx.fillStyle = `rgba(${r},${g},${b},${(0.85 * alpha).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(pos[i][0], pos[i][1], n.s * k, 0, Math.PI * 2); ctx.fill();
      });
    };
    const drawBeacon = (p: Pose, ya: number, pi: number, alpha: number, t: number) => {
      if (alpha < 0.02) return;
      const v = toVec(HOME[0], HOME[1]);
      proj(v[0], v[1], v[2], Math.cos(ya), Math.sin(ya), Math.cos(pi), Math.sin(pi));
      if (out[2] <= 0) return;
      const hx = p.cx + out[0] * p.R;
      const hy = p.cy - out[1] * p.R;
      const ph = rm ? 0.4 : (t * 0.6) % 1;
      const k = clamp(p.R / 340, 0.5, 1);
      ctx.strokeStyle = `rgba(242,107,58,${(0.6 * (1 - ph) * alpha).toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(hx, hy, (4 + ph * 22) * k, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(242,107,58,${alpha.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(hx, hy, 4 * k, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(hx, hy, 1.6 * k, 0, Math.PI * 2); ctx.fill();
    };

    let last = performance.now();
    let lastScroll = window.scrollY;
    let frameNo = 0;
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      const t = now / 1000;
      const sy = window.scrollY;
      if (frameNo++ % 40 === 0 || !els.hero || !els.hero.isConnected) refreshEls();

      // scrolling spins the globe a little
      if (!rm) yawVel += clamp((sy - lastScroll) * 0.0006, -0.04, 0.04);
      lastScroll = sy;

      mouse.x += (mouse.tx - mouse.x) * 0.2 * dt;
      mouse.y += (mouse.ty - mouse.y) * 0.2 * dt;
      mouse.presence += ((mouse.active ? 1 : 0) - mouse.presence) * 0.06 * dt;

      if (goal && now > goal.until) { goal = null; pitchTarget = 0.3; }
      if (goal && !drag) {
        let diff = (goal.yaw - yaw) % (Math.PI * 2);
        if (diff > Math.PI) diff -= Math.PI * 2;
        if (diff < -Math.PI) diff += Math.PI * 2;
        yaw += diff * 0.07 * dt;
        pitchTarget = goal.pitch;
        yawVel = 0;
      } else if (!drag) {
        yawVel *= Math.pow(0.94, dt);
        yaw += (AUTO + yawVel) * dt;
      }
      pitch += (pitchTarget + (rm ? 0 : mouse.py * 0.12 * mouse.presence) - pitch) * 0.06 * dt;

      // ----- where is the globe? -----
      const heroR = els.hero?.getBoundingClientRect();
      const aboutR = els.about?.getBoundingClientRect();
      const focusR = els.focus?.getBoundingClientRect();
      let big: Pose = { cx: W * 0.7, cy: H * 0.5, R: Math.min(W, H) * 0.3 };
      let heroW = 0;
      let bigAlpha = 1;
      const narrow = W < 900;
      if (heroR && aboutR) {
        const hero = slotPose(heroR);
        const about = slotPose(aboutR);
        const aboutDocCentre = aboutR.top + sy + aboutR.height / 2;
        const ys1 = Math.max(1, aboutDocCentre - H / 2);
        const from = H * 0.05;
        heroW = ease(clamp((sy - from) / Math.max(1, ys1 - from)));
        const pinCy = narrow ? lerp(H / 2, H * 0.42, clamp((sy - ys1) / (H * 0.3))) : H / 2;
        const aboutCy = sy >= ys1 ? pinCy : about.cy; // pinned once centred
        // On phones the text sits below the globe, so once pinned it fades to a soft backdrop
        if (narrow) bigAlpha = 1 - 0.72 * clamp((sy - ys1) / (H * 0.5));
        big = { cx: lerp(hero.cx, about.cx, heroW), cy: lerp(hero.cy, aboutCy, heroW), R: lerp(hero.R, about.R, heroW) };
        if (!focusR) {
          const secBottom = (els.about?.closest("section")?.getBoundingClientRect().bottom ?? aboutR.bottom) + sy;
          bigAlpha = 1 - clamp((sy - (secBottom - H * 0.9)) / (H * 0.5));
        }
      } else if (heroR) {
        big = slotPose(heroR);
      }

      // ----- spill into the three pillars -----
      let s = 0;
      const minis: (Pose & { rect?: DOMRect })[] = [];
      if (focusR) {
        const ft = focusR.top + sy;
        const start = ft - H * 1.05;
        const end = ft - H * 0.1;
        s = clamp((sy - start) / Math.max(1, end - start));
        if (els.mode === "attr" && els.worlds.length >= 3) {
          for (let i = 0; i < 3; i++) {
            const r = els.worlds[i].getBoundingClientRect();
            minis.push({ ...slotPose(r), rect: r });
          }
        } else if (els.mode === "cards" && els.worlds.length >= 3) {
          for (let i = 0; i < 3; i++) {
            const r = els.worlds[i].getBoundingClientRect();
            if (els.cardLayout === "col") {
              // stacked cards (phones): a small world in the top-right corner of each card
              const R = clamp(Math.min(r.width, r.height) * 0.16, 34, 54);
              minis.push({ cx: r.right - R - 16, cy: r.top + R + 16, R, rect: r });
            } else {
              const R = clamp(Math.min(r.width, r.height) * 0.3, 44, 120);
              minis.push({ cx: r.left + r.width / 2, cy: r.top + R + 28, R, rect: r });
            }
          }
        } else if (narrow) {
          const R = 44;
          for (let i = 0; i < 3; i++) {
            minis.push({ cx: focusR.right - R - 20, cy: focusR.top + (focusR.height * (i + 0.5)) / 3, R });
          }
        } else {
          const inner = els.focus?.querySelector<HTMLElement>(".wrap")?.getBoundingClientRect() ?? focusR;
          const R = clamp(inner.width / 3 * 0.3, 70, 150);
          for (let i = 0; i < 3; i++) {
            minis.push({ cx: inner.left + (inner.width * (i + 0.5)) / 3, cy: focusR.top + focusR.height * 0.5, R });
          }
        }
      }
      sNow = s;
      bigNow = big;

      // Clock for the moving image backgrounds on the pillar cards (set only while a card is on screen)
      for (const card of els.cards) {
        const r = card.getBoundingClientRect();
        if (r.bottom > -60 && r.top < H + 60) card.style.setProperty("--gj-t", rm ? "0" : t.toFixed(2));
      }

      // While the globe pours into the pillars it draws above the page so it is never hidden by cards
      const wantZ = s > (narrow ? 0.6 : 0.02) && !(s >= 1 && focusR && (focusR.bottom < 0 || focusR.top > H)) ? "2" : "0";
      if (canvas.style.zIndex !== wantZ) canvas.style.zIndex = wantZ;
      // The pillars fade in as the globe splits (see globe.css)
      const root = document.documentElement;
      if (focusR) {
        if (root.dataset.gj !== "on") root.dataset.gj = "on";
        root.style.setProperty("--gj-s", s.toFixed(3));
      } else if (root.dataset.gj) {
        delete root.dataset.gj;
      }

      // mini hover + spin
      for (let i = 0; i < minis.length; i++) {
        const m = minis[i];
        const inside = m.rect
          ? mouse.x >= m.rect.left && mouse.x <= m.rect.right && mouse.y >= m.rect.top && mouse.y <= m.rect.bottom
          : Math.hypot(mouse.x - m.cx, mouse.y - m.cy) < m.R * 1.5;
        miniHover[i] += ((inside && mouse.active && s > 0.85 ? 1 : 0) - miniHover[i]) * 0.12 * dt;
        miniYaw[i] += ((rm ? 0 : 0.0014) * (i % 2 ? -1 : 1) + miniHover[i] * 0.012) * dt;
        m.R *= 1 + miniHover[i] * 0.1;
      }
      const offscreen = s >= 1 && focusR && (focusR.bottom < -200 || focusR.top > H + 400);

      // ----- draw -----
      ctx.clearRect(0, 0, W, H);

      // ambient motes
      for (const m of motes) {
        const x = m.x * W - mouse.px * 30 * m.z * mouse.presence + Math.sin(t * 0.2 + m.ph) * 8;
        const y = ((((m.y * H - t * 6 * m.z) % H) + H) % H) - mouse.py * 30 * m.z * mouse.presence;
        const [r, g, b] = COLS[m.c];
        ctx.fillStyle = `rgba(${r},${g},${b},${(0.1 + 0.2 * m.z).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x, y, m.r * m.z, 0, Math.PI * 2); ctx.fill();
      }

      if (!offscreen && bigAlpha > 0.01) {
        const ox = rm ? 0 : -mouse.px * 10 * mouse.presence;
        const oy = rm ? 0 : -mouse.py * 10 * mouse.presence;
        if (s < 1) drawHalo({ cx: big.cx + ox, cy: big.cy + oy, R: big.R }, (1 - s) * bigAlpha);
        for (let i = 0; i < minis.length; i++) drawHalo(minis[i], s * (0.7 + miniHover[i] * 0.6));

        for (const b of buckets) b.length = 0;
        const cB = Math.cos(yaw), sB = Math.sin(yaw), cpB = Math.cos(pitch), spB = Math.sin(pitch);
        const mc = miniYaw.map((y) => [Math.cos(y), Math.sin(y)]);
        const cpM = Math.cos(0.25), spM = Math.sin(0.25);
        const hasMini = minis.length === 3;
        const useBig = s < 1;
        const useMini = s > 0 && hasMini;
        const bcx = big.cx + ox, bcy = big.cy + oy;
        const ksB = clamp(big.R / 340, 0.65, 1);
        if (s < 1) drawNetwork({ cx: bcx, cy: bcy, R: big.R }, t, (1 - s) * bigAlpha * 0.9);

        for (let k = 0; k < N; k++) {
          const p = pts[k];
          const gi = k % 3;
          let x = 0, y = 0, z = 0, sx = 0, sy2 = 0, R = big.R, ks = ksB;
          let xB = 0, yB = 0, zB = 0, sxB = 0, syB = 0;
          let e = 0;
          if (useBig) {
            proj(p.vx, p.vy, p.vz, cB, sB, cpB, spB);
            xB = out[0]; yB = out[1]; zB = out[2];
            sxB = bcx + xB * big.R;
            syB = bcy - yB * big.R;
          }
          if (useMini) {
            const m = minis[gi];
            proj(p.vx, p.vy, p.vz, mc[gi][0], mc[gi][1], cpM, spM);
            const xM = out[0], yM = out[1], zM = out[2];
            const sxM = m.cx + xM * m.R;
            const syM = m.cy - yM * m.R;
            const ksM = clamp(m.R / 340, 0.65, 1);
            e = s >= 1 || !useBig ? 1 : ease(clamp((s - p.h * 0.45) / 0.55));
            if (e >= 1) {
              x = xM; y = yM; z = zM; sx = sxM; sy2 = syM; R = m.R; ks = ksM;
            } else if (e <= 0) {
              x = xB; y = yB; z = zB; sx = sxB; sy2 = syB;
            } else {
              const dx = sxM - sxB;
              const dy = syM - syB;
              const bow = Math.sin(Math.PI * e) * (p.h - 0.5) * 0.5; // the stream fans out as it flies
              sx = lerp(sxB, sxM, e) - dy * bow;
              sy2 = lerp(syB, syM, e) + dx * bow;
              x = lerp(xB, xM, e); y = lerp(yB, yM, e); z = lerp(zB, zM, e);
              R = lerp(big.R, m.R, e); ks = lerp(ksB, ksM, e);
            }
          } else {
            x = xB; y = yB; z = zB; sx = sxB; sy2 = syB;
          }

          let target = 0;
          if (z > 0 && mouse.presence > 0.01) {
            const d = Math.hypot(sx - mouse.x, sy2 - mouse.y);
            const HR = Math.max(46, R * 0.28);
            if (d < HR) { const f = 1 - d / HR; target = f * f * (3 - 2 * f) * mouse.presence; }
          }
          p.g += (target - p.g) * (target > p.g ? 0.3 : 0.07) * dt;

          let a: number;
          let size: number;
          if (z > 0) {
            const limb = Math.pow(1 - z, 2.2);
            const lit = Math.max(0, x * L[0] + y * L[1] + z * L[2]);
            a = p.land ? 0.45 + 0.35 * lit + 0.35 * limb : 0.1 + 0.1 * limb;
            size = (p.land ? 1.1 : 0.72) * p.s * (0.75 + 0.35 * z + 0.4 * limb) * ks * DOT;
          } else {
            if (!p.land) continue;
            a = 0.07 * (1 + z);
            size = 0.7 * p.s * ks * DOT;
          }
          if (p.india && z > 0) a += 0.28;
          a = Math.min(1, a + p.g * 0.6) * lerp(bigAlpha, 1, e);
          if (e > 0 && e < 1) a = Math.min(1, a + Math.sin(Math.PI * e) * 0.2);
          size += p.g * 1.6 * ks;
          const ci = p.land ? p.c : 5;
          const ai = Math.min(NA - 1, Math.max(0, (a * NA) | 0));
          buckets[ci * NA + ai].push(sx, sy2, size);
        }
        for (let ci = 0; ci < NC; ci++) {
          const [r, g, b] = COLS[ci];
          for (let ai = 0; ai < NA; ai++) {
            const list = buckets[ci * NA + ai];
            if (!list.length) continue;
            ctx.fillStyle = `rgba(${r},${g},${b},${((ai + 0.5) / NA).toFixed(3)})`;
            ctx.beginPath();
            for (let k = 0; k < list.length; k += 3) {
              ctx.moveTo(list[k] + list[k + 2], list[k + 1]);
              ctx.arc(list[k], list[k + 1], list[k + 2], 0, Math.PI * 2);
            }
            ctx.fill();
          }
        }

        // India outline, beacon and arcs (big globe)
        if (s < 1) {
          const al = (1 - s) * bigAlpha;
          const bp = { cx: bcx, cy: bcy, R: big.R };
          drawRings(bp, yaw, pitch, al, 1.4);
          ctx.lineCap = "round";
          for (const arc of arcList) {
            if (!rm) arc.t = (arc.t + arc.speed * dt) % 1.35;
            const [r, g, b] = arc.col;
            const pr: number[][] = arc.path.map((v) => {
              proj(v[0], v[1], v[2], cB, sB, cpB, spB);
              return [out[0], out[1], out[2]];
            });
            ctx.lineWidth = 1.1;
            for (let i = 1; i < pr.length; i++) {
              const A = pr[i - 1], B = pr[i];
              if ((A[2] < 0 && Math.hypot(A[0], A[1]) < 1) || (B[2] < 0 && Math.hypot(B[0], B[1]) < 1)) continue;
              const head = arc.t - i / pr.length;
              const glow = head >= 0 && head < 0.35 ? 1 - head / 0.35 : 0;
              ctx.strokeStyle = `rgba(${r},${g},${b},${((0.20 + 0.7 * glow) * al).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(bcx + A[0] * big.R, bcy - A[1] * big.R);
              ctx.lineTo(bcx + B[0] * big.R, bcy - B[1] * big.R);
              ctx.stroke();
            }
            const E = pr[pr.length - 1];
            if (!(E[2] < 0 && Math.hypot(E[0], E[1]) < 1)) {
              ctx.fillStyle = `rgba(${r},${g},${b},${(0.9 * al).toFixed(3)})`;
              ctx.beginPath(); ctx.arc(bcx + E[0] * big.R, bcy - E[1] * big.R, 2.2, 0, Math.PI * 2); ctx.fill();
            }
          }
          drawBeacon(bp, yaw, pitch, al, t);
        }
        // minis: outline, beacon, hover ring
        if (hasMini && s > 0.6) {
          const al = clamp((s - 0.6) / 0.4);
          for (let i = 0; i < 3; i++) {
            drawRings(minis[i], miniYaw[i], 0.25, al, 1);
            if (i === 0) drawBeacon(minis[i], miniYaw[i], 0.25, al, t);
            if (miniHover[i] > 0.02) {
              ctx.strokeStyle = `rgba(31,184,207,${(0.55 * miniHover[i]).toFixed(3)})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath(); ctx.arc(minis[i].cx, minis[i].cy, minis[i].R * 1.12, 0, Math.PI * 2); ctx.stroke();
            }
          }
        }
      }

      if (debug) {
        ctx.font = "12px monospace";
        ctx.fillStyle = "#F5A12A";
        ctx.fillText(`gj debug | focus: ${els.focus ? "found" : "MISSING"} | worlds: ${els.mode} | s=${s.toFixed(2)} | about: ${els.about ? "ok" : "MISSING"} | hero: ${els.hero ? "ok" : "MISSING"}`, 12, H - 14);
        ctx.strokeStyle = "rgba(201,232,121,.8)";
        ctx.lineWidth = 1;
        for (const m of minis) { ctx.beginPath(); ctx.arc(m.cx, m.cy, m.R, 0, Math.PI * 2); ctx.stroke(); }
      }

      // floating chips around the hero globe
      if (chipsEl) {
        const vis = 1 - ease(clamp(heroW * 3.2));
        const kids = chipsEl.children;
        for (let i = 0; i < kids.length; i++) {
          const el = kids[i] as HTMLElement;
          const c = CHIPS[i];
          if (!c || vis < 0.01 || s > 0) { el.style.opacity = "0"; el.style.pointerEvents = "none"; continue; }
          const ang = c.ang + (rm ? 0 : Math.sin(t * 0.5 + i * 2) * 0.28);
          const rx = big.R * (W < 700 ? 0.92 : 1.2);
          const ry = big.R * (W < 700 ? 1.02 : 0.88);
          const hw = el.offsetWidth / 2 || 60;
          const hh = el.offsetHeight / 2 || 20;
          const x = clamp(big.cx + Math.cos(ang) * rx, hw + 8, W - hw - 8);
          const y = clamp(big.cy + Math.sin(ang) * ry, hh + 70, H - hh - 12);
          const front = 0.5 + 0.5 * Math.sin(ang);
          el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%) scale(${(0.88 + 0.12 * front).toFixed(3)})`;
          el.style.opacity = (vis * (0.7 + 0.3 * front)).toFixed(3);
          el.style.pointerEvents = vis > 0.5 ? "auto" : "none";
        }
      }
    };

    layout();
    refreshEls();
    raf = requestAnimationFrame(frame);
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 100); };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("gj:focus", onFocusEvt);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onOver);
    document.addEventListener("focusin", onOver);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(introTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("gj:focus", onFocusEvt);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onOver);
      document.removeEventListener("focusin", onOver);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      delete document.documentElement.dataset.gj;
      document.documentElement.style.removeProperty("--gj-s");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="gj-canvas" aria-hidden="true" />
      <div className="gj-chips" ref={chipsRef}>
        {CHIPS.map((c) => (
          <button
            type="button"
            className="gj-chip"
            key={c.label}
            data-gj-focus={`${c.lon},${c.lat}`}
            aria-label={`${c.label}: ${c.sub}. Turn the globe to face it.`}
          >
            <b>{c.label}</b>
            <span>{c.sub}</span>
          </button>
        ))}
      </div>
    </>
  );
}