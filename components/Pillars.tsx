import type { CSSProperties } from "react";

// The three pillars: plain image cards (no links, no icons).
// To show a photo on a card, set `image` to a file in /public, for example "/images/pillars/summit.jpg".
interface Pillar { n: string; title: string; text: string; image?: string }

export default function Pillars(_props: { summitHref?: string }) {
  const items: Pillar[] = [
    { n: "01", title: "Annual Summit", text: "A global gathering of progressives to plan and work together." },
    { n: "02", title: "Research and Policy", text: "Evidence, papers and policy briefs that make the case for change." },
    { n: "03", title: "Global Network", text: "People, ideas and partnerships that connect nations." },
  ];
  const icons = ["summit", "research", "network"];
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
            <div
              key={p.n}
              className={`pl-card pl-${icons[i]}`}
              data-r
              data-spot
              data-tilt
              style={{ ["--rd" as string]: `${i * 140}ms`, ...(p.image ? { ["--pl-img" as string]: `url("${p.image}")` } : {}) } as CSSProperties}
            >
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}