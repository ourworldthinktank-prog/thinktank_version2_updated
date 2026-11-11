"use client";

import { useEffect, useRef, useState } from "react";
import { GlobeMark } from "./Icons";

// Uses /assets/logo.png when present; falls back to a drawn mark until the client's PNG is added.
export default function Logo({ footer = false }: { footer?: boolean }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const i = ref.current;
    if (i && i.complete && i.naturalWidth === 0) setFailed(true);
  }, []);
  return (
    <a href="/" className="logo" aria-label="Our World Institute and Initiative home">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          className={`logo-img${footer ? " logo-img-foot" : ""}`}
          src="/assets/logo1.webp"
          alt="Our World Institute & Initiative"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="logo-fb" style={{ display: "flex" }}>
          <GlobeMark className="logo-mark" />
          <span className="logo-text">
            <b>OUR WORLD</b>
            <small>INSTITUTE &amp; INITIATIVE</small>
          </span>
        </span>
      )}
    </a>
  );
}
