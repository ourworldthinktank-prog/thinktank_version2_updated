"use client";

import { useEffect, useRef, useState } from "react";

// Files live in /public/assets (exact names, lowercase):
//   globe.png : the hero globe (transparent background)
//   mesh.png  : the mesh web shown behind the globe (animated PNG works as-is)
const GLOBE_SRC = "/assets/globe1.gif";
const GLOBEP_SRC = "/assets/globe.png";
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
  const globepRef = useRef<HTMLImageElement>(null);
  const [meshBroken, setMeshBroken] = useBroken(meshRef);
  const [globeBroken, setGlobeBroken] = useBroken(globeRef);
  const [globepBroken, setGlobepBroken] = useBroken(globepRef);


  return (
    <div className="globe-box globe-stage">
      {/* mesh web behind the globe (hidden automatically if mesh.png is missing) */}
      {!meshBroken && (
        <div className="mesh-wrap" aria-hidden="true" style={{ WebkitMaskImage: "none", maskImage: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={meshRef}
            src={MESH_SRC}
            alt=""
            onError={() => setMeshBroken(true)}
            style={{ width: "90%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </div>
      )}

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
        <img
          ref={globepRef}
          className="globe-img globe-move"
          src={GLOBEP_SRC}
          alt="Illustration of the world connected by a network"
          onError={() => setGlobeBroken(true)}
          />
      )}
      <div className="hero-tags">Stronger democracies<br />Fairer societies<br />A sustainable planet</div>
    </div>
  );
}