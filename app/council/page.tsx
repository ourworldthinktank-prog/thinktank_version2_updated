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

export default async function CouncilPage() {
  const groups = await getCouncil();
  const lead = groups.find((g) => g.id === "leadership")!;
  const exec = groups.find((g) => g.id === "executive")!;
  const trust = groups.find((g) => g.id === "trustees")!;

  return (
    <Shell>
      <PageBanner
        variant="council"
        eyebrow="The Council"
        title={<>The people behind the <span style={{ color: "var(--gold)" }}>mission</span></>}
        intro="Leadership, executive team and trustees working together for a fairer world."
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
                <div className={`avatar ${grads[i % 5]}`}><Pic m={m} /></div>
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
                <div className={`circ ${grads[(i + 2) % 5]}`}><Pic m={m} /></div>
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
                <div className={`circ ${grads[(i + 4) % 5]}`}><Pic m={m} /></div>
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
