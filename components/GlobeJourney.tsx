"use client";

import { useEffect, useRef } from "react";

/**
 * Floating sphere that travels with the home page:
 *   hero slot  ->  about slot  ->  dives into the pillars.
 * As the pillars come up the sphere shrinks towards them and its little orbiting bodies fly out
 * to the three pillar cards, with a small pop where each one lands.
 *
 * It finds its stops in the DOM (same as before, so page.tsx does not change):
 *   [data-gs="hero"]    the hero slot (empty div)
 *   [data-gs="about"]   the about slot (empty div)
 *   #focus              the pillars section, with three .pl-card boxes inside it
 *
 * The artwork is /public/assets/think-sphere.png. Swap that file to change the picture.
 */

const SPHERE_SRC = "/assets/think-sphere.png";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const hexRgb = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};

const COLS = ["#F5A12A", "#1E9C8C", "#E8538A", "#8A4FD8", "#1FB8CF", "#F26B3A"].map(hexRgb);

type Pose = { cx: number; cy: number; R: number };

export default function GlobeJourney() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
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

    // Phones: lower pixel ratio and fewer little bodies, so it stays smooth
    const lite = window.innerWidth < 700 || window.matchMedia("(pointer: coarse)").matches;

    // ---------- the artwork ----------
    const img = new Image();
    img.decoding = "async";
    let loadedAt = 0;
    img.onload = () => { loadedAt = performance.now(); };
    img.src = SPHERE_SRC;

    // ---------- little bodies that orbit, and sparkles ----------
    const ORB_N = lite ? 9 : 14;
    const orbiters = Array.from({ length: ORB_N }, (_, i) => ({
      a: (i / ORB_N) * Math.PI * 2 + Math.random() * 0.3,
      r: 1.28 + Math.random() * 0.22,
      s: 2 + Math.random() * 3.5,
      c: COLS[i % COLS.length].join(","),
      sp: 0.12 + Math.random() * 0.1,
    }));
    const sparkles = Array.from({ length: lite ? 5 : 7 }, (_, i) => ({
      a: Math.random() * Math.PI * 2,
      d: 1.35 + Math.random() * 0.5,
      ph: Math.random() * 5,
      s: 5 + Math.random() * 6,
      c: i % 3 === 0 ? "245,161,42" : "31,184,207",
    }));

    // ---------- state ----------
    let W = 0;
    let H = 0;
    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // pointer: the sphere leans towards it and the light follows it
    const ptr = { x: -9999, y: -9999, seen: false };
    const m = { x: 0, y: 0, p: 0 };
    let bounce = 0;
    let ripple = -1;
    const pos = { x: 0, y: 0, vx: 0, vy: 0 };
    let squash = 0;
    let squashV = 0;

    const els: { hero: HTMLElement | null; about: HTMLElement | null; focus: HTMLElement | null; cards: HTMLElement[] } =
      { hero: null, about: null, focus: null, cards: [] };
    const refreshEls = () => {
      els.hero = document.querySelector<HTMLElement>('[data-gs="hero"]');
      els.about = document.querySelector<HTMLElement>('[data-gs="about"]');
      els.cards = Array.from(document.querySelectorAll<HTMLElement>(".pl-card"));
      els.focus = document.getElementById("focus") || document.querySelector<HTMLElement>('#pillars, [data-gs="pillars"], section.pillars');
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.seen = true;
    };
    const onLeave = () => { ptr.seen = false; };
    let sphereNow: Pose | null = null;
    const onDown = (e: PointerEvent) => {
      if (rm || e.button !== 0 || !sphereNow) return;
      const t = e.target as Element | null;
      if (!t?.closest?.("[data-gs]") || t.closest("a,button,input,textarea,select")) return;
      if (Math.hypot(e.clientX - sphereNow.cx, e.clientY - sphereNow.cy) > sphereNow.R * 1.2) return;
      bounce = 1;
      ripple = 0;
    };

    const slotPose = (r: DOMRect): Pose => ({ cx: r.left + r.width / 2, cy: r.top + r.height / 2, R: (Math.min(r.width, r.height) / 2) * 0.94 });

    const sparkle = (x: number, y: number, r: number, a: number, c: string) => {
      if (a <= 0.01) return;
      ctx.save();
      ctx.translate(x, y);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.4);
      g.addColorStop(0, `rgba(${c},${(0.35 * a).toFixed(3)})`);
      g.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, r * 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(${c},${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * 0.15, -r * 0.15, r, 0); ctx.quadraticCurveTo(r * 0.15, r * 0.15, 0, r);
      ctx.quadraticCurveTo(-r * 0.15, r * 0.15, -r, 0); ctx.quadraticCurveTo(-r * 0.15, -r * 0.15, 0, -r);
      ctx.fill();
      ctx.restore();
    };

    // The sphere, its glow, shadow, orbiting bodies and sparkles. (cx0, cy0) is its resting centre.
    const drawSphere = (cx0: number, cy0: number, R0: number, alpha: number, t: number, dt: number, s: number, dests: { x: number; y: number }[]) => {
      m.x += (clamp((ptr.x - cx0) / (R0 * 3), -1, 1) - m.x) * 0.06 * dt;
      m.y += (clamp((ptr.y - cy0) / (R0 * 3), -1, 1) - m.y) * 0.06 * dt;
      const near = ptr.seen && Math.hypot(ptr.x - cx0, ptr.y - cy0) < R0 * 4;
      m.p += ((near ? 1 : 0) - m.p) * 0.05 * dt;

      // a slow wandering float, pulled a little towards the cursor, with spring movement
      const wander = rm
        ? [0, 0]
        : [Math.sin(t * 0.37) * R0 * 0.16 + Math.sin(t * 0.83) * R0 * 0.04, Math.sin(t * 0.61) * R0 * 0.08 + Math.cos(t * 0.29) * R0 * 0.05];
      const goalX = wander[0] + m.x * R0 * 0.22 * m.p;
      const goalY = wander[1] + m.y * R0 * 0.16 * m.p;
      pos.vx = (pos.vx + (goalX - pos.x) * 0.012 * dt) * 0.92;
      pos.vy = (pos.vy + (goalY - pos.y) * 0.012 * dt) * 0.92;
      pos.x += pos.vx * dt;
      pos.y += pos.vy * dt;

      // click: a hop with a little squash
      let hop = 0;
      if (bounce > 0) {
        bounce = Math.max(0, bounce - 0.022 * dt);
        hop = Math.sin((1 - bounce) * Math.PI) * R0 * 0.22;
        if (bounce < 0.05) squashV += 0.06;
      }
      squashV += -squash * 0.12 * dt;
      squashV *= 0.86;
      squash += squashV * dt;

      // dive: as the pillars arrive the sphere shrinks and moves in among them
      const e = rm ? 0 : ease(s);
      const tgt = dests.length
        ? { x: dests.reduce((q, d) => q + d.x, 0) / dests.length, y: dests.reduce((q, d) => q + d.y, 0) / dests.length }
        : { x: cx0, y: cy0 + R0 * 2 };
      const R = R0 * (1 - 0.82 * e);
      const cx = lerp(cx0 + pos.x, tgt.x, e);
      const cy = lerp(cy0 + pos.y - hop, tgt.y, e);
      const aS = alpha * (rm ? 1 - s : 1 - ease(clamp((s - 0.55) / 0.45)));  // sphere, glow, shadow
      const aO = alpha * (1 - clamp((s - 0.9) / 0.1));                        // little bodies and sparkles
      ctx.save();
      ctx.globalAlpha = aS;

      // soft coloured glow behind
      for (const [ox, oy, c, rr] of [[-0.5, -0.4, "31,184,207", 1.5], [0.55, 0.45, "245,161,42", 1.5], [0.5, -0.5, "232,83,138", 1.1]] as [number, number, string, number][]) {
        const gx = cx + ox * R;
        const gy = cy + oy * R;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, R * rr);
        g.addColorStop(0, `rgba(${c},0.16)`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(gx, gy, R * rr, 0, Math.PI * 2); ctx.fill();
      }

      // shadow on the floor: smaller and lighter as the sphere rises
      const floorY = cy0 + R0 * 1.32;
      const lift = clamp((floorY - (cy + R)) / R, 0, 2);
      ctx.save();
      ctx.translate(cx - m.x * R * 0.15, floorY);
      ctx.scale(1, 0.13);
      const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(1, R * (0.95 - lift * 0.25)));
      sh.addColorStop(0, `rgba(28,45,94,${Math.max(0, 0.28 - lift * 0.12).toFixed(3)})`);
      sh.addColorStop(1, "rgba(28,45,94,0)");
      ctx.fillStyle = sh;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // little bodies behind the sphere
      const tilt = -0.32 + m.y * 0.1 * m.p;
      const spin = rm ? 0 : t;
      const orb = orbiters.map((o, i) => {
        const a = o.a + spin * o.sp;
        const rr = R0 * (1 - 0.3 * e) * o.r;
        let x = cx + Math.cos(a) * rr;
        let y = cy + Math.sin(a) * rr * 0.28 + Math.cos(a) * rr * tilt * 0.35;
        let z = Math.sin(a);
        let land = 0;
        const d = dests.length && !rm ? dests[i % dests.length] : null;
        if (d) {
          // each one leaves the orbit in turn, curves over to its card and lands there
          const k = ease(clamp((s - 0.08 - (i / ORB_N) * 0.22) / 0.5));
          const bow = Math.sin(Math.PI * k) * (i % 2 ? 1 : -1) * 0.22;
          const dx = d.x - x;
          const dy = d.y - y;
          x += dx * k - dy * bow;
          y += dy * k + dx * bow;
          if (k > 0.25) z = 1;
          land = clamp((k - 0.78) / 0.22);
        }
        return { x, y, z, o, land, k: d ? 1 : 0 };
      });
      const drawOrb = (q: (typeof orb)[number]) => {
        const sz = q.o.s * (0.75 + (0.35 * (q.z + 1)) / 2) * (1 + q.land * 0.5);
        const a = 0.45 + (0.5 * (q.z + 1)) / 2;
        ctx.fillStyle = `rgba(${q.o.c},${(a * 0.25).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, sz * 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${q.o.c},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(q.x, q.y, sz, 0, Math.PI * 2); ctx.fill();
        if (q.land > 0 && q.land < 1) {
          // a small pop where it lands
          ctx.strokeStyle = `rgba(${q.o.c},${(0.7 * (1 - q.land)).toFixed(3)})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(q.x, q.y, 8 + q.land * 34, 0, Math.PI * 2); ctx.stroke();
        }
      };
      ctx.globalAlpha = aO;
      orb.filter((q) => q.z < 0).forEach(drawOrb);
      ctx.globalAlpha = aS;

      // the sphere itself
      if (img.complete && img.naturalWidth) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = "#F3EAD8";
        ctx.fillRect(-R, -R, R * 2, R * 2);
        // the artwork drifts very slightly inside the sphere, opposite to the light, for a sense of curvature
        const px = -m.x * R * 0.03 * m.p;
        const py = -m.y * R * 0.03 * m.p;
        ctx.drawImage(img, -R * 1.02 + px, -R * 1.02 + py, R * 2.04, R * 2.04);

        // light from the upper left, leaning towards the cursor
        const lx = (-0.38 + m.x * 0.35 * m.p) * R;
        const ly = (-0.42 + m.y * 0.3 * m.p) * R;
        ctx.globalCompositeOperation = "multiply";
        const shade = ctx.createRadialGradient(lx, ly, R * 0.1, lx * 0.3, ly * 0.3, R * 1.35);
        shade.addColorStop(0, "rgba(255,255,255,1)");
        shade.addColorStop(0.55, "rgba(240,240,248,1)");
        shade.addColorStop(0.85, "rgba(190,196,222,1)");
        shade.addColorStop(1, "rgba(140,150,190,1)");
        ctx.fillStyle = shade;
        ctx.fillRect(-R, -R, R * 2, R * 2);
        ctx.globalCompositeOperation = "screen";
        const hl = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 0.75);
        hl.addColorStop(0, "rgba(255,255,255,0.42)");
        hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = hl;
        ctx.fillRect(-R, -R, R * 2, R * 2);
        const spec = ctx.createRadialGradient(lx * 1.05, ly * 1.05, 0, lx * 1.05, ly * 1.05, R * 0.16);
        spec.addColorStop(0, "rgba(255,255,255,0.55)");
        spec.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = spec;
        ctx.fillRect(-R, -R, R * 2, R * 2);
        const rim = ctx.createRadialGradient(-lx * 0.12, -ly * 0.12, R * 0.8, -lx * 0.12, -ly * 0.12, R * 1.12);
        rim.addColorStop(0, "rgba(120,220,235,0)");
        rim.addColorStop(1, "rgba(120,220,235,0.38)");
        ctx.fillStyle = rim;
        ctx.fillRect(-R, -R, R * 2, R * 2);
        ctx.restore();

        // click ripple
        if (ripple >= 0) {
          ripple += 0.02 * dt;
          if (ripple > 1) ripple = -1;
          else {
            ctx.strokeStyle = `rgba(31,184,207,${(0.5 * (1 - ripple)).toFixed(3)})`;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, R * (1 + ripple * 0.5), 0, Math.PI * 2); ctx.stroke();
          }
        }
      }

      // little bodies in front
      ctx.globalAlpha = aO;
      orb.filter((q) => q.z >= 0).forEach(drawOrb);

      // twinkling sparkles
      for (const sp of sparkles) {
        const a = rm ? 0.6 : Math.pow(Math.max(0, Math.sin(t * 0.9 + sp.ph)), 3);
        const ang = sp.a + (rm ? 0 : t * 0.05);
        sparkle(cx + Math.cos(ang) * R0 * sp.d * (1 - 0.6 * e), cy + Math.sin(ang) * R0 * sp.d * 0.8 * (1 - 0.6 * e), sp.s * (0.6 + 0.4 * a), a, sp.c);
      }
      ctx.restore();
    };

    let last = performance.now();
    let frameNo = 0;
    let raf = 0;
    let cleared = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(48, now - last) / 16.67;
      last = now;
      const t = now / 1000;
      const sy = window.scrollY;
      if (frameNo++ % 40 === 0 || !els.hero || !els.hero.isConnected) refreshEls();

      // ----- where is the sphere? -----
      const heroR = els.hero?.getBoundingClientRect();
      const aboutR = els.about?.getBoundingClientRect();
      const focusR = els.focus?.getBoundingClientRect();
      let big: Pose = { cx: W * 0.7, cy: H * 0.5, R: Math.min(W, H) * 0.3 };
      let heroW = 0;
      let alpha = 1;
      let s = 0; // 0 = hero or about, 1 = fully dived into the pillars
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
        // On phones the text sits below the sphere, so once pinned it fades to a soft backdrop
        if (narrow) alpha = 1 - 0.72 * clamp((sy - ys1) / (H * 0.5));
        big = { cx: lerp(hero.cx, about.cx, heroW), cy: lerp(hero.cy, aboutCy, heroW), R: lerp(hero.R, about.R, heroW) };
        // dives into the pillars as they come up
        if (focusR) s = clamp((H - focusR.top) / (H * 0.7));
        else {
          const secBottom = (els.about?.closest("section")?.getBoundingClientRect().bottom ?? aboutR.bottom) + sy;
          alpha *= 1 - clamp((sy - (secBottom - H * 0.9)) / (H * 0.5));
        }
      } else if (heroR) {
        big = slotPose(heroR);
      }
      // the slot is sized for the old globe; the sphere plus its orbit fits inside it at this radius
      const R = big.R * 0.74;
      sphereNow = { cx: big.cx, cy: big.cy, R };

      // Clock for the moving image backgrounds on the pillar cards (set only while a card is on screen)
      const dests: { x: number; y: number }[] = [];
      els.cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        if (r.bottom > -60 && r.top < H + 60) card.style.setProperty("--gj-t", rm ? "0" : t.toFixed(2));
        if (i < 3) dests.push({ x: r.left + r.width / 2, y: r.top + r.height * 0.42 });
      });
      if (dests.length < 3 && focusR) {
        dests.length = 0;
        for (let i = 0; i < 3; i++) dests.push({ x: focusR.left + (focusR.width * (i + 0.5)) / 3, y: focusR.top + focusR.height * 0.4 });
      }

      // while it dives, draw above the pillar cards so the stream is seen landing on them
      const wantZ = s > 0.01 && s < 1 ? "2" : "0";
      if (canvas.style.zIndex !== wantZ) canvas.style.zIndex = wantZ;

      // ----- draw -----
      const visible = alpha > 0.01 && s < 1 && big.cy > -R * 2.4 && big.cy < H + R * 2.4;
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        cleared = false;
        const fadeIn = loadedAt ? ease(clamp((now - loadedAt) / 700)) : 0;
        drawSphere(big.cx, big.cy, R, alpha * (rm ? (loadedAt ? 1 : 0) : fadeIn), t, dt, s, dests);
      } else if (!cleared) {
        ctx.clearRect(0, 0, W, H);
        cleared = true;
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
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(introTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.gj;
      document.documentElement.style.removeProperty("--gj-s");
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="gj-canvas"
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
      />
    </>
  );
}