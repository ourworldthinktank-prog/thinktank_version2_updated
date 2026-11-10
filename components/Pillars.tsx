import { ArrowIcon } from "./Icons";

// The three pillars. Icons are drawn with stroke animation (see home.css, .pl-*).
// Each card is an image card: set `image` to a file in /public to replace the animated placeholder.
interface Pillar { n: string; title: string; text: string; href: string; external?: boolean; icon: "summit" | "research" | "network"; image?: string }

function Icon({ k }: { k: Pillar["icon"] }) {
  if (k === "summit")
    return (
      <svg viewBox="0 0 120 120" className="pl-ico" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path className="pl-d" pathLength="1" d="M12 100H108" />
        <path className="pl-d" pathLength="1" d="M24 100V64M96 100V64" />
        <path className="pl-d" pathLength="1" d="M24 64a36 36 0 0 1 72 0" />
        <path className="pl-d" pathLength="1" d="M44 100V66M60 100V44M76 100V66" />
        <path pathLength="1" className="pl-d pl-flag" d="M60 44V20l16 6-16 6" />
      </svg>
    );
  if (k === "research")
    return (
      <svg viewBox="0 0 120 120" className="pl-ico" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path className="pl-d" pathLength="1" d="M10 104H110" />
        <rect className="pl-bar" style={{ ["--b" as string]: 0 }} x="16" y="78" width="16" height="26" rx="3" />
        <rect className="pl-bar" style={{ ["--b" as string]: 1 }} x="42" y="62" width="16" height="42" rx="3" />
        <rect className="pl-bar" style={{ ["--b" as string]: 2 }} x="68" y="46" width="16" height="58" rx="3" />
        <rect className="pl-bar" style={{ ["--b" as string]: 3 }} x="94" y="30" width="16" height="74" rx="3" />
        <path className="pl-d pl-trend" pathLength="1" d="M14 58L48 42L74 28L104 10" />
        <circle className="pl-dot" cx="104" cy="10" r="5" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 120 120" className="pl-ico" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle className="pl-ring" cx="60" cy="60" r="50" strokeDasharray="3 7" />
      <path className="pl-d" pathLength="1" d="M60 60L24 32M60 60L98 30M60 60L22 92M60 60L98 92M60 60L60 14" />
      {[[24, 32], [98, 30], [22, 92], [98, 92], [60, 14]].map(([x, y], i) => (
        <circle key={i} className="pl-node" style={{ ["--b" as string]: i }} cx={x} cy={y} r="7" fill="currentColor" />
      ))}
      <circle className="pl-core" cx="60" cy="60" r="10" fill="currentColor" />
    </svg>
  );
}

export default function Pillars({ summitHref }: { summitHref: string }) {
  const items: Pillar[] = [
    // image: "/images/pillars/summit.jpg",   <- add a photo path here to replace the placeholder
    { n: "01", title: "Annual Summit", text: "A global gathering of progressives to plan and work together.", href: summitHref, external: true, icon: "summit" },
    { n: "02", title: "Research and Policy", text: "Evidence, papers and policy briefs that make the case for change.", href: "#platforms", icon: "research" },
    { n: "03", title: "Global Network", text: "People, ideas and partnerships that connect nations.", href: "#platforms", icon: "network" },
  ];
  return (
    <section className="sec pillars-sec" id="pillars">
      <div className="wrap">
        <div className="sec-head" data-r>
          <div>
            <div className="bars"><i /><i /><i /></div>
            <h2>Three pillars of our work</h2>
            <p>Everything we do rests on these three commitments.</p>
          </div>
        </div>
        <div className="pl-grid">
          {items.map((p, i) => (
            <a key={p.n} className={`pl-card pl-${p.icon}`} href={p.href} data-r data-spot data-tilt
              style={{ ["--rd" as string]: `${i * 140}ms`, ...(p.image ? { ["--pl-img" as string]: `url("${p.image}")` } : {}) }}
              {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {/* <span className="pl-num" aria-hidden="true">{p.n}</span>
              <Icon k={p.icon} /> */}
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <span className="pl-go">{p.external ? "Visit site" : "Learn more"} <ArrowIcon size={16} /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}