import Link from "next/link";
import type { Member } from "@/lib/council";

// Silhouette shown until a real transparent photo is added.
export function Silhouette() {
  return (
    <svg viewBox="0 0 200 240" className="mc-sil" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="mcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d2ea" />
          <stop offset="1" stopColor="#6d7aa8" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="82" r="40" fill="url(#mcg)" />
      <path d="M12 240c4-62 38-96 88-96s84 34 88 96z" fill="url(#mcg)" />
    </svg>
  );
}

export function Figure({ m }: { m: Member }) {
  // eslint-disable-next-line @next/next/no-img-element
  return m.photo ? <img src={m.photo} alt="" width={480} height={560} loading="lazy" decoding="async" /> : <Silhouette />;
}

export default function CouncilCard({ m, i, size = "md" }: { m: Member; i: number; size?: "md" | "sm" | "lg" }) {
  return (
    <article className={`mc mc-${size} v${i % 5} rv`} style={{ ["--d" as string]: `${(i % 4) * 70}ms` }}>
      <div className="mc-stage">
        <i className="mc-stripes" aria-hidden="true" />
        <i className="mc-glow" aria-hidden="true" />
        <div className="mc-fig"><Figure m={m} /></div>
        <div className="mc-ov">
          <p>{m.short}</p>
          <span className="mc-more">Know more <b aria-hidden="true">→</b></span>
        </div>
      </div>
      <div className="mc-info">
        <h3>{m.name}</h3>
        <span className="mc-role">{m.role}</span>
        <em className="mc-country">{m.country}</em>
        <span className="mc-hint" aria-hidden="true">Tap to know more →</span>
      </div>
      <i className="mc-bar" aria-hidden="true" />
      <Link href={`/council/${m.slug}`} className="mc-hit" aria-label={`${m.name}: know more`} />
    </article>
  );
}