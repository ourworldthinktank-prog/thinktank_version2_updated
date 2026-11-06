import Shell from "./Shell";
import PageBanner from "./PageBanner";

export interface LegalSection { h: string; p?: string[]; ul?: string[] }

// DRAFT legal template. The client's counsel must review and approve all wording before launch.
export default function LegalPage({ title, eyebrow, sections }: { title: string; eyebrow: string; sections: LegalSection[] }) {
  return (
    <Shell>
      <PageBanner variant="legal" eyebrow={eyebrow} title={title} />
      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap legal-wrap">
          <div className="draft-note" role="note">
            <b>Draft for legal review.</b> This text is a starting template. It must be reviewed, completed and approved by the organisation&apos;s legal counsel before the site goes live. Items in [square brackets] need to be filled in.
          </div>
          <p className="meta">Last updated: [date]</p>
          {sections.map((s) => (
            <div key={s.h}>
              <h2>{s.h}</h2>
              {s.p?.map((t, i) => <p key={i}>{t}</p>)}
              {s.ul && <ul>{s.ul.map((t) => <li key={t}>{t}</li>)}</ul>}
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
