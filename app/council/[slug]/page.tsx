import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { Figure } from "@/components/CouncilCard";
import { GROUPS, MEMBERS, findMember } from "@/lib/council";
import "../council.css";

type P = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return MEMBERS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const m = findMember(slug);
  return m ? { title: `${m.name} | Council`, description: m.short } : { title: "Council" };
}

export default async function MemberPage({ params }: P) {
  const { slug } = await params;
  const m = findMember(slug);
  if (!m) notFound();
  const idx = MEMBERS.findIndex((x) => x.slug === m.slug);
  const prev = MEMBERS[idx - 1];
  const next = MEMBERS[idx + 1];
  const group = GROUPS.find((g) => g.id === m.group)!;
  const v = `v${idx % 5}`;

  return (
    <Shell>
      <section className="mp">
        <div className="wrap">
          <Link href={`/council#${m.group}`} className="mp-back">← Back to the council</Link>
          <div className="mp-grid">
            <div className={`mp-card mc ${v}`}>
              <div className="mc-stage">
                <i className="mc-stripes" aria-hidden="true" />
                <i className="mc-glow" aria-hidden="true" style={{ opacity: 0.5, transform: "scale(1.05)" }} />
                <div className="mc-fig"><Figure m={m} /></div>
              </div>
              <i className="mc-bar" aria-hidden="true" style={{ transform: "none" }} />
            </div>
            <div>
              <span className="mp-tag">{group.title}</span>
              <h1>{m.name}</h1>
              <p className="mp-role">{m.role}</p>
              <div className="mp-meta"><span>{m.country}</span><span>{m.org}</span></div>
              {m.placeholder && <p className="note">Placeholder profile. Real details are published only with written permission.</p>}
              <div className="mp-bio">{m.long.map((t, i) => <p key={i}>{t}</p>)}</div>
              <nav className="mp-pn" aria-label="More council members">
                {prev ? <Link href={`/council/${prev.slug}`}><small>Previous</small>← {prev.name}</Link> : <span />}
                {next ? <Link href={`/council/${next.slug}`}><small>Next</small>{next.name} →</Link> : null}
              </nav>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}