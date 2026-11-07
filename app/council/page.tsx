import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { getCouncil, type CouncilMember } from "@/lib/content";

export const metadata: Metadata = {
  title: "Council",
  description: "The Leadership, Executive and Trustees of Our-World Institute & Initiative.",
};

/* ---------- helpers ---------- */
type Member = CouncilMember & { slug?: string };

const ACCENTS = ["#F7A21B", "#1FA897", "#F26B3A", "#7FE8F5", "#FF8FB1"];
const tone = (i: number) => ({ "--ac": ACCENTS[i % ACCENTS.length] }) as CSSProperties;
// profile URL: /council/<slug>. Uses m.slug if your data has one, otherwise "<group>-<number>".
const hrefOf = (gid: string, m: Member, i: number) => `/council/${m.slug || `${gid}-${i + 1}`}`;

function Pic({ m, w, h }: { m: Member; w: number; h: number }) {
  return m.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="cb-img"
      src={`${m.photo}?w=${w * 2}&h=${h * 2}&fit=crop&crop=faces&auto=format&q=80`}
      alt={m.alt || ""}
      width={w}
      height={h}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span className="cb-ini">{m.initials}</span>
  );
}

function Head({ title, blurb, count }: { title: string; blurb?: string; count: number }) {
  return (
    <div className="cb-head rv">
      <div className="cb-bars" aria-hidden="true"><i /><i /><i /></div>
      <h2>{title}</h2>
      {blurb && <p>{blurb}</p>}
      <span className="cb-count">{count} members</span>
    </div>
  );
}

/* ---------- cards ---------- */
function LeadCard({ gid, m, i }: { gid: string; m: Member; i: number }) {
  return (
    <div className="rv">
      <Link href={hrefOf(gid, m, i)} className="cb-card cb-lead" style={tone(i)}>
        <div className="cb-in">
          <div className="cb-stage"><Pic m={m} w={320} h={400} /></div>
          <div className="cb-meta">
            <b>{m.name}</b>
            <small>{m.role}</small>
            <span className="cb-more">View profile →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function ExecCard({ gid, m, i }: { gid: string; m: Member; i: number }) {
  return (
    <div className="rv">
      <Link href={hrefOf(gid, m, i)} className="cb-card cb-ex" style={tone(i + 2)}>
        <div className="cb-circ"><div className="cb-pic"><Pic m={m} w={148} h={148} /></div></div>
        <b>{m.name}</b>
        <small>{m.role}</small>
        <span className="cb-more">View profile →</span>
      </Link>
    </div>
  );
}

const SPARKS = [
  { left: "8%", top: "16%", animationDelay: "0s" },
  { left: "90%", top: "22%", animationDelay: "1s" },
  { left: "84%", top: "82%", animationDelay: "2s" },
];

function TrusteeCard({ gid, m, i }: { gid: string; m: Member; i: number }) {
  return (
    <div className="rv">
      <Link href={hrefOf(gid, m, i)} className="cb-card cb-tr" style={tone(0)}>
        {SPARKS.map((s, k) => <i className="cb-sp" aria-hidden="true" key={k} style={s} />)}
        <div className="cb-circ"><div className="cb-pic"><Pic m={m} w={170} h={170} /></div></div>
        <div>
          <b>{m.name}</b>
          <small>{m.role}</small>
          <span className="cb-more">View profile →</span>
        </div>
      </Link>
    </div>
  );
}

/* ---------- page ---------- */
export default async function CouncilPage() {
  const groups = await getCouncil();
  const lead = groups.find((g) => g.id === "leadership")!;
  const exec = groups.find((g) => g.id === "executive")!;
  const trust = groups.find((g) => g.id === "trustees")!;

  return (
    <Shell>
      <style>{CSS}</style>
      <PageBanner variant="council" />

      <div className="council-body cb">
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
          <p className="note rv" style={{ marginTop: 18 }}>
            Council members will be announced soon. Cards below are layout placeholders only; names and photos are published only with written permission.
          </p>
        </div>

        <section className="cb-sec cb-dark" id="leadership">
          <div className="wrap">
            <Head title={lead.title} blurb={lead.blurb} count={lead.members.length} />
            <div className="cb-grid3">
              {lead.members.map((m, i) => <LeadCard gid={lead.id} m={m} i={i} key={i} />)}
            </div>
          </div>
        </section>

        <section className="cb-sec cb-light" id="executive">
          <div className="wrap">
            <Head title={exec.title} blurb={exec.blurb} count={exec.members.length} />
            <div className="cb-flex">
              {exec.members.map((m, i) => <ExecCard gid={exec.id} m={m} i={i} key={i} />)}
            </div>
          </div>
        </section>

        <section className="cb-sec cb-royal" id="trustees">
          <div className="wrap">
            <Head title={trust.title} blurb={trust.blurb} count={trust.members.length} />
            <div className="cb-grid2">
              {trust.members.map((m, i) => <TrusteeCard gid={trust.id} m={m} i={i} key={i} />)}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}

/* ---------- styles: pure CSS, transforms/opacity only ---------- */
const CSS = `
.cb { --ink: #14203f; }
.cb-sec { position: relative; padding: 76px 0 84px; scroll-margin-top: 80px; content-visibility: auto; contain-intrinsic-size: auto 800px; }
.cb-dark  { background: linear-gradient(160deg, #0a1a3a, #12305a 75%); color: #fff; }
.cb-light { background: #f6f7fb; color: var(--ink); }
.cb-royal { background: linear-gradient(160deg, #1a0f45, #4a2296 80%); color: #fff; }

.cb-head { max-width: 680px; margin: 0 0 44px; }
.cb-bars { display: inline-flex; gap: 6px; margin-bottom: 16px; }
.cb-bars i { display: block; height: 4px; border-radius: 4px; }
.cb-bars i:nth-child(1) { width: 28px; background: #F26B3A; }
.cb-bars i:nth-child(2) { width: 18px; background: #F7A21B; }
.cb-bars i:nth-child(3) { width: 10px; background: #1FA897; }
.cb-head h2 { margin: 0 0 10px; font-size: clamp(1.9rem, 3.6vw, 2.6rem); line-height: 1.12; color: inherit !important; }
.cb-head p { margin: 0; line-height: 1.6; font-size: 1.05rem; opacity: .78; }
.cb-count { display: inline-block; margin-top: 16px; padding: 5px 14px; border-radius: 999px; font-size: .8rem; font-weight: 700;
  background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); }
.cb-light .cb-count { background: #fff; border-color: #e3e6f0; }

/* shared card + photo: dark until hover */
.cb-card { display: block; color: inherit; text-decoration: none; outline: none; -webkit-tap-highlight-color: transparent; }
.cb-card:focus-visible { box-shadow: 0 0 0 3px #7FE8F5; }
.cb-img { display: block; width: 100%; height: 100%; object-fit: cover; opacity: var(--o, 1);
  filter: grayscale(1) brightness(.6) contrast(1.1); transition: filter .6s ease, opacity .6s ease, transform .7s ease; }
.cb-card:hover .cb-img, .cb-card:focus-visible .cb-img { filter: none; opacity: 1; transform: scale(1.06); }
.cb-ini { display: grid; place-items: center; width: 100%; height: 100%; font-size: 2.4rem; font-weight: 800; color: #fff; background: linear-gradient(135deg, #1d3a6e, #2b1760); }
.cb-more { display: block; margin-top: 10px; font-size: .8rem; font-weight: 700; color: var(--ac); transition: transform .3s ease; }
.cb-card:hover .cb-more { transform: translateX(6px); }

/* 1. leadership: rotating light border + drifting glow behind a dark photo */
.cb-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
.cb-lead { --o: .74; position: relative; padding: 2px; border-radius: 24px; overflow: hidden; background: rgba(255,255,255,.1);
  isolation: isolate; transition: transform .35s ease, box-shadow .35s ease; }
.cb-lead::before { content: ""; position: absolute; left: 50%; top: 50%; width: 240%; aspect-ratio: 1; margin: -120% 0 0 -120%; z-index: -1;
  background: conic-gradient(transparent 0 55%, var(--ac) 78%, transparent 100%); opacity: .45; animation: cb-spin 7s linear infinite; transition: opacity .4s; }
.cb-lead:hover { transform: translateY(-8px); box-shadow: 0 22px 48px rgba(0,0,0,.4); }
.cb-lead:hover::before { opacity: 1; animation-duration: 3s; }
.cb-in { border-radius: 22px; overflow: hidden; background: #0c1a3d; }
.cb-stage { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: linear-gradient(160deg, #0a1a3a, #17356a); }
.cb-stage::before, .cb-stage::after { content: ""; position: absolute; border-radius: 50%; will-change: transform; }
.cb-stage::before { width: 80%; aspect-ratio: 1; left: -20%; top: -10%; background: radial-gradient(circle, var(--ac), transparent 68%); animation: cb-d1 11s ease-in-out infinite alternate; }
.cb-stage::after { width: 70%; aspect-ratio: 1; right: -20%; bottom: -10%; background: radial-gradient(circle, #1FA897, transparent 68%); animation: cb-d2 14s ease-in-out infinite alternate; }
.cb-lead .cb-img, .cb-lead .cb-ini { position: absolute; inset: 0; z-index: 1; }
.cb-lead .cb-img { object-position: center top; }
.cb-lead .cb-ini { background: none; }
.cb-meta { padding: 16px 18px 20px; }
.cb-meta b { display: block; font-size: 1.08rem; color: #fff; }
.cb-meta small { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 4px; font-size: .88rem; line-height: 1.45; color: rgba(255,255,255,.72); }

/* 2. executive: spinning ring + pulsing halo around a round photo */
.cb-flex { --gap: 20px; --cols: 5; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--gap); }
.cb-flex > * { width: calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols)); }
.cb-ex { display: flex; flex-direction: column; align-items: center; height: 100%; padding: 26px 14px 22px; text-align: center; border-radius: 22px;
  background: #fff; border: 1px solid #e6e9f3; transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease; }
.cb-ex:hover, .cb-ex:focus-visible { transform: translateY(-8px); box-shadow: 0 18px 38px rgba(20,32,63,.14); border-color: var(--ac); }
.cb-circ { position: relative; isolation: isolate; flex: none; width: var(--sz, 148px); height: var(--sz, 148px); margin-bottom: 18px; }
.cb-circ::before { content: ""; position: absolute; inset: -4px; border-radius: 50%; opacity: .55; transition: opacity .4s;
  background: conic-gradient(var(--ac), transparent 35%, #1FA897 65%, transparent 90%); animation: cb-spin 5s linear infinite; }
.cb-circ::after { content: ""; position: absolute; inset: -16px; z-index: -1; border-radius: 50%; opacity: .35;
  background: radial-gradient(circle, var(--ac), transparent 68%); animation: cb-pulse 4s ease-in-out infinite; }
.cb-pic { position: relative; z-index: 1; width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #14264f; }
.cb-ex:hover .cb-circ::before, .cb-tr:hover .cb-circ::before { opacity: 1; animation-duration: 2.4s; }
.cb-ex:hover .cb-circ::after, .cb-tr:hover .cb-circ::after { opacity: .7; }
.cb-ex b { display: block; font-size: 1rem; color: var(--ink); }
.cb-ex small { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin-top: 4px; font-size: .84rem; line-height: 1.45; color: #5b6480; }
.cb-ex .cb-more { color: var(--ink); }

/* 3. trustees: large cards with twinkling sparks */
.cb-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px; max-width: 960px; }
.cb-tr { position: relative; display: flex; align-items: center; gap: 28px; padding: 32px; border-radius: 28px; overflow: hidden;
  background: rgba(255,255,255,.07); border: 1px solid rgba(247,162,27,.35); transition: transform .4s ease, box-shadow .4s ease; }
.cb-tr:hover { transform: translateY(-8px); box-shadow: 0 24px 54px rgba(0,0,0,.4), 0 0 36px rgba(247,162,27,.22); }
.cb-tr .cb-circ { --sz: 170px; margin: 0; }
.cb-tr b { display: block; font-size: 1.35rem; color: #fff; }
.cb-tr small { display: block; margin-top: 4px; line-height: 1.45; color: rgba(255,255,255,.75); }
.cb-sp { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: #F7A21B; box-shadow: 0 0 10px #F7A21B; opacity: 0; animation: cb-tw 3s ease-in-out infinite; }

@keyframes cb-spin { to { transform: rotate(360deg); } }
@keyframes cb-d1 { to { transform: translate3d(35%, 25%, 0) scale(1.2); } }
@keyframes cb-d2 { to { transform: translate3d(-30%, -22%, 0) scale(1.15); } }
@keyframes cb-pulse { 0%, 100% { transform: scale(1); opacity: .3; } 50% { transform: scale(1.12); opacity: .6; } }
@keyframes cb-tw { 0%, 100% { opacity: 0; transform: scale(.4); } 50% { opacity: 1; transform: scale(1.3); } }

/* touch screens have no hover: each photo turns to colour as it scrolls to the middle (no JS) */
@keyframes cb-lit { 0%, 100% { filter: grayscale(1) brightness(.6) contrast(1.1); opacity: var(--o, 1); } 50% { filter: none; opacity: 1; } }
@media (hover: none) {
  @supports (animation-timeline: view()) { .cb-img { animation: cb-lit linear both; animation-timeline: view(); animation-range: cover 28% cover 72%; } }
  @supports not (animation-timeline: view()) { .cb-img { filter: none; opacity: 1; } }
}

@media (max-width: 1100px) { .cb-flex { --cols: 4; } }
@media (max-width: 900px) { .cb-grid3 { grid-template-columns: repeat(2, 1fr); } .cb-flex { --cols: 3; } }
@media (max-width: 700px) {
  .cb-grid2 { grid-template-columns: 1fr; }
  .cb-flex { --cols: 2; --gap: 14px; }
  .cb-tr { flex-direction: column; text-align: center; }
  .cb-tr .cb-circ { --sz: 140px; }
}
@media (max-width: 560px) {
  .cb-sec { padding: 54px 0 60px; }
  .cb-grid3 { grid-template-columns: 1fr; }
  .cb-circ { --sz: 120px; }
  .cb-tr .cb-circ { --sz: 140px; }
}
@media (prefers-reduced-motion: reduce) {
  .cb-card, .cb-img, .cb-more { transition: none !important; }
  .cb-sp { display: none; }
}
@media (prefers-reduced-motion: reduce) and (hover: none) { .cb-img { animation: none !important; filter: none; opacity: 1; } }
`;