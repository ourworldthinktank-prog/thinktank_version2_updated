"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_WORDS, HERO_WORD_EVENT } from "@/lib/heroWords";

// Files live in /public/assets (exact names, lowercase):
//   globe.png : the hero globe (transparent background)
//   mesh.png  : the mesh web shown behind the globe (animated PNG works as-is)
const GLOBE_SRC = "/assets/globe.png";
const MESH_SRC = "/assets/mesh.png";

// If an image failed before React hydrated, onError never fires, so also check on mount.
function useBroken(ref: React.RefObject<HTMLImageElement | null>) {
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    const i = ref.current;
    if (i && i.complete && i.naturalWidth === 0) setBroken(true);
  }, [ref]);
  return [broken, setBroken] as const;
}

export default function HeroGlobe() {
  const meshRef = useRef<HTMLImageElement>(null);
  const globeRef = useRef<HTMLImageElement>(null);
  const [meshBroken, setMeshBroken] = useBroken(meshRef);
  const [globeBroken, setGlobeBroken] = useBroken(globeRef);

  // Follows the rotating headline word: the glow colour changes and a ring pulses out on every change.
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const on = (e: Event) => setWi((e as CustomEvent<{ i: number }>).detail.i);
    window.addEventListener(HERO_WORD_EVENT, on);
    return () => window.removeEventListener(HERO_WORD_EVENT, on);
  }, []);
  const cur = HERO_WORDS[wi];

  return (
    <div className="globe-box globe-stage" style={{ ["--wc1" as string]: cur.c1, ["--wc2" as string]: cur.c2 }}>
      {/* mesh web behind the globe (hidden automatically if mesh.png is missing) */}
      {!meshBroken && (
        <div className="mesh-wrap" aria-hidden="true" style={{ WebkitMaskImage: "none", maskImage: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={meshRef}
            src={MESH_SRC}
            alt=""
            onError={() => setMeshBroken(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </div>
      )}
      <span className="halo halo-1" aria-hidden="true" />
      <span className="halo halo-2" aria-hidden="true" />
      <span className="globe-pulse" key={wi} aria-hidden="true" />

      {!globeBroken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={globeRef}
          className="globe-img globe-move"
          src={GLOBE_SRC}
          alt="Illustration of the world connected by a network"
          onError={() => setGlobeBroken(true)}
        />
      ) : (
        <svg className="globe-move" viewBox="0 0 400 400" aria-hidden="true">
          <defs>
            <radialGradient id="ocean" cx="35%" cy="30%"><stop offset="0" stopColor="#7FE8F5" /><stop offset=".55" stopColor="#1FC1DE" /><stop offset="1" stopColor="#0F8FA8" /></radialGradient>
            <clipPath id="gclip"><circle cx="200" cy="200" r="150" /></clipPath>
            <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1"><stop offset=".55" stopColor="#0F2A5C" stopOpacity="0" /><stop offset="1" stopColor="#0F2A5C" stopOpacity=".35" /></linearGradient>
          </defs>
          <circle cx="200" cy="200" r="150" fill="url(#ocean)" />
          <g clipPath="url(#gclip)">
            <path d="M95 120c28-28 70-22 82 8 10 26-18 38-14 66 4 30-14 56-32 46-20-12-12-44-34-62-14-12-16-40-2-58z" fill="#F7A21B" />
            <path d="M212 96c32-14 66 6 64 36-2 26-26 32-22 62 4 34-18 68-40 54-18-12-4-42-18-62-12-18-8-76 16-90z" fill="#1FA897" />
            <path d="M272 120c26-6 52 14 46 42-6 26-34 24-48 8-10-12-8-44 2-50z" fill="#F26B3A" />
            <path d="M250 270c24-8 52 6 40 28-12 22-50 16-52-6-1-10 4-18 12-22z" fill="#F26B3A" opacity=".9" />
            <g stroke="#fff" strokeOpacity=".28" fill="none">
              <ellipse cx="200" cy="200" rx="150" ry="55" /><ellipse cx="200" cy="200" rx="55" ry="150" /><ellipse cx="200" cy="200" rx="110" ry="150" />
            </g>
          </g>
          <circle cx="200" cy="200" r="150" fill="url(#shade)" />
        </svg>
      )}
      <div className="globe-word" aria-hidden="true"><span key={wi}>{cur.a === "an" ? "An" : "A"} {cur.w} world</span></div>
      <div className="hero-tags">Stronger democracies<br />Fairer societies<br />A sustainable planet</div>
    </div>
  );
}
