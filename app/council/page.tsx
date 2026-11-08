import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { getCouncil, type CouncilMember } from "@/lib/content";

export const metadata: Metadata = {
  title: "Council",
  description: "The Leadership, Executive and Trustees of Our-World Institute & Initiative.",
};

const grads = ["av1", "av2", "av3", "av4", "av5"];

function Pic({ m }: { m: CouncilMember }) {
  // eslint-disable-next-line @next/next/no-img-element
  return m.photo ? <img src={`${m.photo}?w=520&h=600&fit=crop&crop=faces&auto=format&q=80`} alt={m.alt || m.name} width={260} height={300} loading="lazy" decoding="async" /> : <span>{m.initials}</span>;
}

/* Photos are black and white until hovered. A soft glow drifts behind each transparent photo. */
const CSS = `
.c-grid-lead .avatar, .c-grid-exec .circ, .c-trustees .circ { position: relative; overflow: hidden; isolation: isolate; }

/* animated glow behind the photo */
.cfx { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
.cfx::before, .cfx::after { content: ""; position: absolute; border-radius: 50%; will-change: transform; }
.cfx::before { width: 85%; aspect-ratio: 1; left: -20%; top: -15%; background: radial-gradient(circle, var(--fx1, #F7A21B), transparent 68%); animation: cfx1 9s ease-in-out infinite alternate; }
.cfx::after  { width: 75%; aspect-ratio: 1; right: -20%; bottom: -15%; background: radial-gradient(circle, var(--fx2, #1FA897), transparent 68%); animation: cfx2 12s ease-in-out infinite alternate; }
.c-grid-lead > :nth-child(3n + 2) .cfx, .c-grid-exec > :nth-child(3n + 2) .cfx, .c-trustees > :nth-child(2n) .cfx { --fx1: #1FA897; --fx2: #F26B3A; }
.c-grid-lead > :nth-child(3n) .cfx, .c-grid-exec > :nth-child(3n) .cfx { --fx1: #F26B3A; --fx2: #7FE8F5; }
@keyframes cfx1 { to { transform: translate3d(35%, 25%, 0) scale(1.2); } }
@keyframes cfx2 { to { transform: translate3d(-30%, -22%, 0) scale(1.15); } }

/* black and white until hover */
.c-grid-lead .avatar img, .c-grid-exec .circ img, .c-trustees .circ img { filter: grayscale(1) contrast(1.05) brightness(.92); transition: filter .6s ease, transform .6s ease; }
.person:hover .avatar img, .exec-card:hover .circ img, .trustee:hover .circ img { filter: none; transform: scale(1.05); }

/* touch screens have no hover: each photo turns to colour as it scrolls to the middle */
@keyframes cfx-lit { 0%, 100% { filter: grayscale(1) contrast(1.05) brightness(.92); } 50% { filter: none; } }
@media (hover: none) {
  @supports (animation-timeline: view()) {
    .c-grid-lead .avatar img, .c-grid-exec .circ img, .c-trustees .circ img { animation: cfx-lit linear both; animation-timeline: view(); animation-range: cover 28% cover 72%; }
  }
  @supports not (animation-timeline: view()) {
    .c-grid-lead .avatar img, .c-grid-exec .circ img, .c-trustees .circ img { filter: none; }
  }
}
`;

export default async function CouncilPage() {
  const groups = await getCouncil();
  const lead = groups.find((g) => g.id === "leadership")!;
  const exec = groups.find((g) => g.id === "executive")!;
  const trust = groups.find((g) => g.id === "trustees")!;

  return (
    <Shell>
      <style>{CSS}</style>
      <PageBanner
        variant="council"
      />

      <div className="council-body">
      <div className="subnav-bar">
        <div className="wrap">
          <div className="subnav" role="navigation" aria-label="Council sections">
            <a href="#leadership">Leadership</a>
            <a href="#executive">Executive</a>
            <a href="#trustees">Trustees</a>
          </div>
        </div>
      </div>
      <div className="wrap">
        <p className="note rv" style={{ marginTop: 18 }}>Council members will be announced soon. Cards below are layout placeholders only; names and photos are published only with written permission.</p>
      </div>

      <section className="sec c-block" id="leadership" style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="sec-head rv"><div><div className="bars"><i /><i /><i /></div><h2>{lead.title}</h2><p>{lead.blurb}</p></div></div>
          <div className="c-grid-lead">
            {lead.members.map((m, i) => (
              <div className="person lead rv" key={i}>
                <div className={`avatar ${grads[i % 5]}`}><i className="cfx" aria-hidden="true" /><Pic m={m} /></div>
                <div className="meta"><b>{m.name}</b><small>{m.role}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec c-block" id="executive" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="sec-head rv"><div><div className="bars"><i /><i /><i /></div><h2>{exec.title}</h2><p>{exec.blurb}</p></div></div>
          <div className="c-grid-exec">
            {exec.members.map((m, i) => (
              <div className="exec-card rv" key={i}>
                <div className={`circ ${grads[(i + 2) % 5]}`}><i className="cfx" aria-hidden="true" /><Pic m={m} /></div>
                <div><b>{m.name}</b><small>{m.role}</small></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec c-block" id="trustees" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="sec-head rv"><div><div className="bars"><i /><i /><i /></div><h2>{trust.title}</h2><p>{trust.blurb}</p></div></div>
          <div className="c-trustees">
            {trust.members.map((m, i) => (
              <div className="trustee rv" key={i}>
                <div className={`circ ${grads[(i + 4) % 5]}`}><i className="cfx" aria-hidden="true" /><Pic m={m} /></div>
                <b>{m.name}</b><small>{m.role}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </Shell>
  );
}