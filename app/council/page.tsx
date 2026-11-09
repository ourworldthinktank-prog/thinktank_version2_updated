import type { Metadata, Viewport } from "next";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import CouncilTabs from "@/components/CouncilTabs";
import CouncilCard from "@/components/CouncilCard";
import { GROUPS, byGroup } from "@/lib/council";
import "./council.css";

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  title: "Council",
  description: "The Leadership, Executive and Trustees of Our-World Institute and Initiative.",
};

const LAYOUT = { leadership: "mc-lead", executive: "mc-exec", trustees: "mc-trust" } as const;
const SIZE = { leadership: "md", executive: "sm", trustees: "lg" } as const;

export default function CouncilPage() {
  return (
    <Shell>
      <PageBanner variant="council" />

      <div className="council-body">
        <CouncilTabs tabs={GROUPS.map((g) => ({ id: g.id, title: g.title, count: byGroup(g.id).length }))} />
        <div className="wrap">
          <p className="note rv" style={{ marginTop: 18 }}>Council members will be announced soon. Cards below are layout placeholders only; names and photos are published only with written permission.</p>
        </div>

        {GROUPS.map((g, gi) => (
          <section key={g.id} className="sec c-block" id={g.id} style={{ paddingTop: gi === 0 ? 30 : 20 }}>
            <div className="wrap">
              <div className="sec-head rv"><div><div className="bars"><i /><i /><i /></div><h2>{g.title}</h2><p>{g.blurb}</p></div></div>
              <div className={`mc-wrap ${LAYOUT[g.id]}`}>
                {byGroup(g.id).map((m, i) => <CouncilCard key={m.slug} m={m} i={i + gi} size={SIZE[g.id]} />)}
              </div>
            </div>
          </section>
        ))}
      </div>
    </Shell>
  );
}