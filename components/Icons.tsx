import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 18, rest: SVGProps<SVGSVGElement>) {
  return { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true, ...rest } as SVGProps<SVGSVGElement>;
}

export function ArrowIcon({ size = 18, ...rest }: P) {
  return (
    <svg {...base(size, rest)}>
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function PlayIcon({ size = 18, ...rest }: P) {
  return (
    <svg {...base(size, rest)}>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}
export function SearchIcon({ size = 22, ...rest }: P) {
  return (
    <svg {...base(size, rest)}>
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function MenuIcon({ size = 24, ...rest }: P) {
  return (
    <svg {...base(size, rest)}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
export function GlobeMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <clipPath id="gc"><circle cx="24" cy="24" r="20" /></clipPath>
        <radialGradient id="go" cx="35%" cy="30%"><stop offset="0" stopColor="#6FE3F2" /><stop offset="1" stopColor="#1FA897" /></radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#go)" />
      <g clipPath="url(#gc)">
        <path d="M8 14c5-5 11-3 12 2s-4 7-3 12-4 8-7 4-3-12-6-14z" fill="#F7A21B" />
        <path d="M26 10c6-3 12 1 11 7s-6 6-5 12-5 10-8 6 0-10-3-14 0-9 5-11z" fill="#F26B3A" />
      </g>
      <circle cx="24" cy="24" r="21" fill="none" stroke="#0F2A5C" strokeWidth="1" opacity=".4" />
    </svg>
  );
}

export function FocusIcon({ name }: { name: "democracy" | "climate" | "economy" | "digital" }) {
  const common = { className: "ico", viewBox: "0 0 48 48", fill: "none", stroke: "#fff", strokeWidth: 2.5, "aria-hidden": true } as const;
  switch (name) {
    case "democracy":
      return <svg {...common}><path d="M6 40h36M10 40V22M20 40V22M28 40V22M38 40V22M6 22h36L24 8z" /></svg>;
    case "climate":
      return <svg {...common}><circle cx="24" cy="24" r="8" /><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4" /></svg>;
    case "economy":
      return <svg {...common}><path d="M8 40V24h10v16M20 40V8h12v32M34 40V18h8v22M4 40h40" /></svg>;
    case "digital":
      return <svg {...common}><rect x="8" y="10" width="32" height="22" rx="3" /><path d="M18 40h12M24 32v8" /><circle cx="24" cy="21" r="4" /></svg>;
  }
}
