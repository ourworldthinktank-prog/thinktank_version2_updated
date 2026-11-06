import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { ArrowIcon } from "@/components/Icons";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Summits, conferences, roundtables and workshops from Our-World Institute & Initiative.",
};

export default async function EventsPage() {
  const [flagship, ...rest] = await getEvents();

  return (
    <Shell>
      <PageBanner
        variant="events"
        eyebrow="Events"
        title={<>Moments that bring us <span style={{ color: "var(--gold)" }}>together</span></>}
        intro="Summits, conferences, roundtables and workshops. Dates to be announced."
      />

      <section className="sec">
        <div className="wrap">
          <article className="ev-feature rv">
            <div className="body">
              <span className="tag" style={{ color: "var(--gold)" }}>{flagship.kind}</span>
              <h3>{flagship.title}</h3>
              <p>{flagship.blurb}</p>
              <div className="chips" style={{ margin: "18px 0 22px" }}>
                <span className="chip">📍 {flagship.place}</span><span className="chip">🗓 {flagship.dateLabel}</span>
              </div>
              <a className="btn btn-primary" href={flagship.href} target="_blank" rel="noopener noreferrer">Visit Bharat Summit website <ArrowIcon /></a>
            </div>
            <div className="art" aria-hidden="true"><i /><i /><i /></div>
          </article>

          
        </div>
      </section>
    </Shell>
  );
}
