import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { getCouncil, type CouncilMember } from "@/lib/content";

type Member = CouncilMember & { slug?: string; bio?: string | string[] };
type Props = { params: Promise<{ slug: string }> };

// Flat list of every member with the same URL key the council page links to.
async function everyone() {
  const groups = await getCouncil();
  return groups.flatMap((g) =>
    g.members.map((m: Member, i: number) => ({ key: m.slug || `${g.id}-${i + 1}`, group: g.title, m }))
  );
}

export async function generateStaticParams() {
  return (await everyone()).map((x) => ({ slug: x.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = (await everyone()).find((x) => x.key === slug);
  return { title: found ? `${found.m.name} | Council` : "Council" };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const list = await everyone();
  const idx = list.findIndex((x) => x.key === slug);
  if (idx < 0) notFound();

  const { m, group } = list[idx];
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx < list.length - 1 ? list[idx + 1] : null;
  const paras = Array.isArray(m.bio) ? m.bio : m.bio ? [m.bio] : ["Biography coming soon."];

  return (
    <Shell>
      <style>{CSS}</style>
      <section className="cp">
        <div className="wrap">
          <Link href="/council" className="cp-back">← Back to Council</Link>

          <div className="cp-grid">
            <div className="cp-photo">
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${m.photo}?w=640&h=760&fit=crop&crop=faces&auto=format&q=80`} alt={m.alt || m.name} width={320} height={380} decoding="async" />
              ) : (
                <span>{m.initials}</span>
              )}
            </div>

            <div className="cp-text">
              <span className="cp-tag">{group}</span>
              <h1>{m.name}</h1>
              <p className="cp-role">{m.role}</p>
              <div className="cp-line" />
              {paras.map((p, i) => <p className="cp-bio" key={i}>{p}</p>)}
            </div>
          </div>

          <nav className="cp-nav" aria-label="More council members">
            {prev ? <Link href={`/council/${prev.key}`}><small>← Previous</small>{prev.m.name}</Link> : <span />}
            {next ? <Link href={`/council/${next.key}`}><small>Next →</small>{next.m.name}</Link> : <span />}
          </nav>
        </div>
      </section>
    </Shell>
  );
}

const CSS = `
.cp { padding: 44px 0 96px; background: #fff; color: #14203f; }
.cp-back { display: inline-block; margin-bottom: 36px; color: #14203f; text-decoration: none; transition: transform .3s ease; }
.cp-back:hover { transform: translateX(-4px); }
.cp-grid { display: grid; grid-template-columns: 320px 1fr; gap: 56px; align-items: start; }
.cp-photo { width: 320px; aspect-ratio: 4 / 4.75; border-radius: 22px; overflow: hidden; background: linear-gradient(160deg, #0a1a3a, #17356a); box-shadow: 0 18px 44px rgba(20,32,63,.18); }
.cp-photo img { display: block; width: 100%; height: 100%; object-fit: cover; }
.cp-photo span { display: grid; place-items: center; height: 100%; font-size: 3rem; font-weight: 800; color: #fff; }
.cp-tag { display: block; margin-bottom: 10px; font-size: .78rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #F26B3A; }
.cp h1 { margin: 0 0 12px; color: #14203f !important; font-size: clamp(2rem, 4.5vw, 3.2rem); line-height: 1.1; font-weight: 800; }
.cp-role { margin: 0; max-width: 720px; font-size: 1.15rem; line-height: 1.55; color: #3b4666; }
.cp-line { width: 72px; height: 4px; margin: 26px 0; border-radius: 4px; background: linear-gradient(90deg, #F26B3A, #F7A21B, #1FA897); }
.cp-bio { max-width: 700px; margin: 0 0 16px; font-size: 1.05rem; line-height: 1.8; color: #2b3552; }
.cp-nav { display: flex; justify-content: space-between; gap: 16px; margin-top: 64px; padding-top: 24px; border-top: 1px solid #e8eaf2; }
.cp-nav a { padding: 12px 18px; border-radius: 14px; background: #f3f5fb; color: #14203f; text-decoration: none; font-weight: 600; transition: transform .3s ease, background .3s ease; }
.cp-nav a:hover { transform: translateY(-3px); background: #e9edf8; }
.cp-nav small { display: block; font-size: .72rem; font-weight: 500; color: #5b6480; }
@media (max-width: 800px) { .cp-grid { grid-template-columns: 1fr; gap: 32px; } .cp-photo { width: 100%; max-width: 320px; } }
`;