import type { CSSProperties } from "react";

/* ---------- Content ---------- */

const AIMS = [
  { t: "Develop alternative solutions", d: "Fresh answers to the problems established approaches have failed to solve." },
  { t: "Empower citizens", d: "Put people at the centre of decisions that shape their lives." },
  { t: "Revitalise democracy", d: "Renew democratic institutions and practice for a new era." },
  { t: "Build a fairer global order", d: "A world organised around cooperation, justice and shared prosperity." },
];

const PILLARS = [
  { n: "01", t: "Rethink paradigms", d: "Question established ideas about how societies, economies and politics should work." },
  { n: "02", t: "Reimagine institutions", d: "Design institutions that deliver for citizens and earn their confidence." },
  { n: "03", t: "Modernise operations", d: "Bring contemporary ways of organising and working to progressive efforts." },
  { n: "04", t: "Restore public trust", d: "Offer a compelling vision of a shared future that people can believe in." },
  { n: "05", t: "Harness innovation", d: "Put disruptive innovation to work for the common good." },
  { n: "06", t: "Reclaim the centre", d: "Build new coalitions and partnerships across borders and movements." },
];

/* ---------- Styles (all scoped under .ab / .ab-*) ---------- */

const CSS = `
.ab { --ab-gold: var(--gold, #F7A21B); --ab-coral: var(--coral, #F26B3A); --ab-teal: var(--teal, #1FA897); --ab-ink: #14203f; --ab-muted: #5b6480; }
.ab-sec { padding: 72px 0; }
.ab-eyebrow { display: inline-flex; gap: 6px; align-items: center; margin-bottom: 18px; }
.ab-eyebrow i { display: block; height: 4px; border-radius: 4px; }
.ab-eyebrow i:nth-child(1) { width: 28px; background: var(--ab-coral); }
.ab-eyebrow i:nth-child(2) { width: 18px; background: var(--ab-gold); }
.ab-eyebrow i:nth-child(3) { width: 10px; background: var(--ab-teal); }
.ab-h2 { font-size: clamp(1.8rem, 3.4vw, 2.6rem); line-height: 1.15; margin: 0 0 14px; color: var(--ab-ink); }
.ab-sub { color: var(--ab-muted); font-size: 1.05rem; max-width: 640px; margin: 0 0 40px; line-height: 1.6; }

.ab-aims { background: #f6f7fb; }
.ab-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.ab-aim { position: relative; padding: 28px 24px; border-radius: 20px; background: #fff; border: 1px solid #e8eaf2; overflow: hidden; transition: transform .3s ease, box-shadow .3s ease; }
.ab-aim::before { content: ""; position: absolute; left: 0; top: 0; height: 4px; width: 100%; background: linear-gradient(90deg, var(--ab-coral), var(--ab-gold), var(--ab-teal)); transform: scaleX(0); transform-origin: left; transition: transform .45s ease; }
.ab-aim:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(20,32,63,.12); }
.ab-aim:hover::before { transform: scaleX(1); }
.ab-aim h3 { margin: 0 0 8px; font-size: 1.1rem; color: var(--ab-ink); }
.ab-aim p { margin: 0; color: var(--ab-muted); line-height: 1.55; font-size: .96rem; }

.ab-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.ab-pillar { padding: 30px 26px; border-radius: 20px; border: 1px solid #e8eaf2; background: #fff; transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
.ab-pillar:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(20,32,63,.12); border-color: transparent; }
.ab-num { display: inline-block; font-size: 2rem; font-weight: 800; line-height: 1; margin-bottom: 14px; background: linear-gradient(135deg, var(--ab-coral), var(--ab-gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ab-pillar h3 { margin: 0 0 8px; font-size: 1.15rem; color: var(--ab-ink); }
.ab-pillar p { margin: 0; color: var(--ab-muted); line-height: 1.55; font-size: .96rem; }

.ab-quote { position: relative; overflow: hidden; border-radius: 28px; padding: 72px 40px; text-align: center; color: #fff; background: linear-gradient(135deg, #2b1760, #5a2bb5 60%, #8a3bd8); }
.ab-quote::before, .ab-quote::after { content: ""; position: absolute; border-radius: 50%; filter: blur(60px); opacity: .55; animation: ab-float 9s ease-in-out infinite; }
.ab-quote::before { width: 280px; height: 280px; background: var(--ab-coral); left: -60px; top: -80px; }
.ab-quote::after { width: 240px; height: 240px; background: var(--ab-teal); right: -50px; bottom: -80px; animation-delay: -4s; }
.ab-quote p { position: relative; z-index: 1; margin: 0 auto; max-width: 820px; font-size: clamp(1.4rem, 3vw, 2.2rem); line-height: 1.35; font-weight: 700; }
.ab-quote em { font-style: normal; color: var(--ab-gold); }

@keyframes ab-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes ab-float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 24px); } }
.ab-rv { animation: ab-up .7s ease both; animation-delay: calc(var(--i, 0) * 90ms); }
@supports (animation-timeline: view()) {
  .ab-rv { animation: ab-up linear both; animation-timeline: view(); animation-range: entry 0% entry 45%; animation-delay: 0s; }
}
@media (prefers-reduced-motion: reduce) {
  .ab *, .ab *::before, .ab *::after { animation: none !important; transition: none !important; }
}
@media (max-width: 960px) {
  .ab-grid4, .ab-grid3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .ab-sec { padding: 52px 0; }
  .ab-grid4, .ab-grid3 { grid-template-columns: 1fr; }
  .ab-quote { padding: 52px 24px; border-radius: 22px; }
}
`;

/* ---------- Small building blocks ---------- */

const stagger = (i: number) => ({ "--i": i } as CSSProperties);

function Eyebrow() {
  return <div className="ab-eyebrow" aria-hidden="true"><i /><i /><i /></div>;
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="ab-rv">
      <Eyebrow />
      <h2 className="ab-h2">{title}</h2>
      <p className="ab-sub">{sub}</p>
    </div>
  );
}

/* ---------- Sections ---------- */

function Aims() {
  return (
    <section className="ab-sec ab-aims" id="focus">
      <div className="wrap">
        <Heading title="What we aim to do" sub="Working across normative, programmatic and organisational dimensions." />
        <div className="ab-grid4">
          {AIMS.map((a, i) => (
            <article className="ab-aim ab-rv" style={stagger(i)} key={a.t}>
              <h3>{a.t}</h3>
              <p>{a.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillars() {
  return (
    <section className="ab-sec" id="approach">
      <div className="wrap">
        <Heading title="How we get there" sub="Six commitments that guide the Institute and the Initiative." />
        <div className="ab-grid3">
          {PILLARS.map((p, i) => (
            <article className="ab-pillar ab-rv" style={stagger(i % 3)} key={p.n}>
              <span className="ab-num">{p.n}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingStatement() {
  return (
    <section className="ab-sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="ab-quote ab-rv">
          <p>
            Our world cannot be led by autocrats; it must be led by{" "}
            <em>democracies that care for people and the planet.</em>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Export ---------- */

export default function MissionSections() {
  return (
    <div className="ab">
      <style>{CSS}</style>
      <Aims />
      <Pillars />
      <ClosingStatement />
    </div>
  );
}