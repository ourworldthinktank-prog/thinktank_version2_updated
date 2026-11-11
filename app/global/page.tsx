import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Global Initiative",
  description: "The Global Initiative produces research and policy papers, supports thematic conferences and builds a progressive digital media network.",
};

/* Set to false while testing if Windows has "animation effects" switched off. Keep true for visitors. */
const HONOR_REDUCED_MOTION = true;
const MOTION = HONOR_REDUCED_MOTION ? "(prefers-reduced-motion: no-preference)" : "all";

/* ---------- content (DRAFT: wording taken from the client's note, lightly tidied; client to approve) ---------- */
type Act = { t: string; sub?: string };
type Stream = { n: string; k: string; t: string; ac: string; on: string; acts: Act[] };

const streams: Stream[] = [
  {
    n: "01", k: "Ideas", t: "Research, Advocacy & Publications", ac: "#F5A12A", on: "#0b1030",
    acts: [
      { t: "An annual State of Global Progressivism report" },
      { t: "Mapping the Right’s conferences, think-tanks, foundations and initiatives" },
      { t: "Policy briefs and papers for progressive policy-makers, with think tanks able to opt in to work jointly" },
      { t: "Literature on key issues to reimagine existing socio-economic and (geo)political paradigms" },
    ],
  },
  {
    n: "03", k: "Voice", t: "Communications & Digital Media", ac: "#536DFF", on: "#ffffff",
    acts: [
      { t: "Establishing a progressive global broadcasting channel, focused primarily on social and digital media, and creating a global federated network of smaller channels" },
      { t: "A progressive social media strategy initiative, supporting progressive candidates with cutting-edge data analytics, AI, crowd-funding and more" },
    ],
  },
  {
    n: "02", k: "Gatherings", t: "Conferences & Workshops", ac: "#27C6B7", on: "#0b1030",
    acts: [
      {
        t: "Supporting think tanks to curate thematic conferences (on climate justice, digital democracy and more) and working groups in different nations, especially those heading into elections",
        sub: "These would be designed to indirectly showcase support for progressive parties and candidates.",
      },
      { t: "Establishing ties with think tanks, civil society, movements and unions globally to channel grassroots issues to progressive leaders and stakeholders, and in dialogue with academics on policy research" },
    ],
  },
];

const words = ["Research", "Advocacy", "Publications", "Conferences", "Think tanks", "Civil society", "Unions", "Academics", "Digital media", "Social media", "Data & AI"];

const pad = (n: number) => String(n).padStart(2, "0");
const tone = (s: Stream) => ({ "--ac": s.ac, "--on": s.on }) as CSSProperties;

/* ---------- sections (div, not <header>, so the site's header styles never apply) ---------- */
/* 01: sticky title on the left, activities slide in on the right */
function StreamSplit({ s }: { s: Stream }) {
  return (
    <section className="gl-st gl-s1" id={`stream-${s.n}`} style={tone(s)}>
      <span className="gl-bigw" aria-hidden="true">{s.k}</span>
      <div className="wrap gl-split">
        <div className="gl-side">
          <span className="gl-no" aria-hidden="true">{s.n}</span>
          <span className="gl-pill">{s.k}</span>
          <h3>{s.t}</h3>
        </div>
        <ol className="gl-acts">
          {s.acts.map((a, i) => (
            <li className="gl-act" key={i}>
              <i>{pad(i + 1)}</i>
              <div>
                <p>{a.t}</p>
                {a.sub && <small>{a.sub}</small>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 02: two large panels that drift in opposite directions */
function StreamPanels({ s }: { s: Stream }) {
  return (
    <section className="gl-st gl-s2" id={`stream-${s.n}`} style={tone(s)}>
      <span className="gl-bigw" aria-hidden="true">{s.k}</span>
      <div className="wrap">
        <div className="gl-top">
          <span className="gl-no" aria-hidden="true">{s.n}</span>
          <div>
            <span className="gl-pill">{s.k}</span>
            <h3>{s.t}</h3>
          </div>
        </div>
        <ol className="gl-panels">
          {s.acts.map((a, i) => (
            <li className="gl-panel" key={i}>
              <i>{pad(i + 1)}</i>
              <div>
                <p>{a.t}</p>
                {a.sub && <small>{a.sub}</small>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 03: cards that stack on top of each other as you scroll */
const CARD_BG = [
  { bg: "linear-gradient(135deg, #27C6B7, #b7dfeb)", fg: "#08122e" },
  { bg: "linear-gradient(135deg, #F5A12A, #f1ba54)", fg: "#0b1030" },
  { bg: "linear-gradient(135deg, #ffffff, #e9ecff)", fg: "#14203f" },
];
function StreamStack({ s }: { s: Stream }) {
  return (
    <section className="gl-st gl-s3" id={`stream-${s.n}`} style={tone(s)}>
      <span className="gl-bigw" aria-hidden="true">{s.k}</span>
      <div className="wrap">
        <div className="gl-top">
          <span className="gl-no" aria-hidden="true">{s.n}</span>
          <div>
            <span className="gl-pill">{s.k}</span>
            <h3>{s.t}</h3>
          </div>
        </div>
        <ol className="gl-stack">
          {s.acts.map((a, i) => {
            const c = CARD_BG[i % CARD_BG.length];
            return (
              <li className="gl-card" key={i} style={{ "--i": i, "--cbg": c.bg, "--cfg": c.fg } as CSSProperties}>
                <i>{pad(i + 1)}</i>
                <div>
                  <p>{a.t}</p>
                  {a.sub && <small>{a.sub}</small>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- page ---------- */
export default function GlobalPage() {
  const [s1, s2, s3] = streams;
  return (
    <Shell>
      <style>{CSS}</style>
      <PageBanner variant="global" title="Global Initiative" />
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...words, ...words].map((w, i) => <span key={i}>{w}</span>)}
        </div>
      </div>

      <div className="gl">
        <StreamSplit s={s1} />
        <StreamPanels s={s3} />
        <StreamStack s={s2} />
      </div>
    </Shell>
  );
}

/* ---------- styles: transforms/opacity only; scroll effects are CSS scroll-driven animations (no JS) ---------- */
const CSS = `
:root:has(.gl) { scroll-behavior: smooth; }
.gl { --ink: #14203f; --line: #d9dde8; }
.gl h2, .gl h3 { color: inherit !important; }

/* ===== shared stream parts ===== */
.gl-st { position: relative; overflow: clip; padding: clamp(76px, 10vw, 130px) 0; scroll-margin-top: 70px; }
.gl-bigw { position: absolute; left: 0; top: 6%; z-index: 0; pointer-events: none; user-select: none; white-space: nowrap; text-transform: uppercase;
  font-size: clamp(7rem, 24vw, 20rem); font-weight: 900; line-height: 1; letter-spacing: -.05em; color: transparent; -webkit-text-stroke: 1px var(--bw); }
.gl-st > .wrap { position: relative; z-index: 1; }
.gl-no { display: block; font-size: clamp(7rem, 17vw, 13rem); font-weight: 900; line-height: .85; letter-spacing: -.06em; color: transparent; -webkit-text-stroke: 2px var(--st); }
.gl-pill { display: inline-block; margin: 18px 0 0; padding: 7px 14px; border-radius: 999px; border: 1px solid currentColor; color: var(--ac);
  font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.gl-st h3 { margin: 18px 0 0; font-size: clamp(2rem, 4.4vw, 3.8rem); line-height: 1.02; letter-spacing: -.045em; font-weight: 850; }
.gl-st p { margin: 0; }
.gl-st small { display: block; margin-top: 14px; font-size: .98rem; line-height: 1.6; opacity: .72; }

/* 01: sticky title + activities slide in */
.gl-s1 { --st: #fff; --bw: rgba(255,255,255,.09); background: #0b1030; color: #fff; text-aligm:justify;
  background-image: radial-gradient(55% 60% at 92% 6%, rgba(83,109,255,.34), transparent 62%), radial-gradient(45% 55% at 2% 100%, rgba(39,198,183,.22), transparent 62%); }
.gl-split { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(30px, 6vw, 90px); align-items: start; }
.gl-side { position: sticky; top: 120px; }
.gl-acts { list-style: none; margin: 0; padding: 0; }
.gl-act { position: relative; display: grid; grid-template-columns: 54px 1fr; gap: 16px; padding: 38px 0; border-top: 1px solid rgba(255,255,255,.18); transition: transform .4s ease; }
.gl-act:last-child { border-bottom: 1px solid rgba(255,255,255,.18); }
.gl-act::before { content: ""; position: absolute; left: 0; top: -1px; width: 100%; height: 2px; background: var(--ac); transform: scaleX(0); transform-origin: left; }
.gl-act:hover { transform: translateX(10px); }
.gl-act:hover::before { transform: scaleX(1); transition: transform .6s cubic-bezier(.2, .8, .2, 1); }
.gl-act i { padding-top: .6em; font-style: normal; font-size: .8rem; font-weight: 800; letter-spacing: .16em; color: var(--ac); }
.gl-act p { font-size: clamp(1.15rem, 1.9vw, 1.55rem); line-height: 1.4; font-weight: 500; }

/* 02: two panels, opposite drift */
.gl-s2 { --st: #14203f; --bw: rgba(20,32,63,.08); background: #f5f5f1; color: var(--ink);text-align:justify;
  background-image: radial-gradient(rgba(83,109,255,.12) .7px, transparent .7px); background-size: 19px 19px; }
.gl-top { display: flex; align-items: flex-end; gap: clamp(20px, 4vw, 56px); }
.gl-top .gl-no { font-size: clamp(5rem, 12vw, 9rem); flex: none; }
.gl-top h3 { max-width: 16ch; margin-top: 14px; }
.gl-panels { list-style: none; margin: clamp(40px, 6vw, 72px) 0 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
.gl-panel { position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 40px; min-height: 340px; padding: clamp(26px, 3.4vw, 42px);
  border-radius: 28px; background: #fff; border: 1px solid #e5e8f2; box-shadow: 0 24px 50px -34px rgba(20,32,63,.4); transition: box-shadow .4s ease, border-color .4s ease; }
.gl-panel:hover { border-color: var(--ac); box-shadow: 0 34px 70px -30px rgba(83,109,255,.5); }
.gl-panel i { font-style: normal; font-size: clamp(3.4rem, 7vw, 5.4rem); font-weight: 900; line-height: .9; letter-spacing: -.06em; color: transparent; -webkit-text-stroke: 2px var(--ac); }
.gl-panel p { font-size: clamp(1.1rem, 1.7vw, 1.4rem); line-height: 1.45; font-weight: 600; }

/* 03: stacking cards */
.gl-s3 { --st: #fff; --bw: rgba(255,255,255,.1); background: linear-gradient(160deg, #1a0f45, #4a2296 80%); color: #fff; text-align: justify; }
.gl-stack { list-style: none; margin: clamp(40px, 6vw, 72px) 0 0; padding: 0 0 12vh; }
.gl-card { position: sticky; top: calc(110px + var(--i) * 28px); display: grid; grid-template-columns: 110px 1fr; gap: 24px; align-items: start;
  min-height: min(52svh, 400px); margin-bottom: 28px; padding: clamp(26px, 4vw, 48px); border-radius: 28px; background: var(--cbg); color: var(--cfg);
  box-shadow: 0 30px 60px -30px rgba(0,0,0,.6); }
.gl-card i { font-style: normal; font-size: clamp(3.6rem, 8vw, 6rem); font-weight: 900; line-height: .9; letter-spacing: -.06em; opacity: .85; }
.gl-card p { font-size: clamp(1.15rem, 2vw, 1.6rem); line-height: 1.42; font-weight: 600; }
.gl-card small { color: inherit; }

/* ===== scroll motion ===== */
@keyframes gl-in { from { opacity: 0; translate: 0 50px; } to { opacity: 1; translate: 0 0; } }
@keyframes gl-slide { from { opacity: 0; translate: 70px 0; } to { opacity: 1; translate: 0 0; } }
@keyframes gl-line { to { transform: scaleX(1); } }
@keyframes gl-par { from { transform: translate3d(0, calc(var(--p) * 1px), 0); } to { transform: translate3d(0, calc(var(--p) * -1px), 0); } }
@keyframes gl-drift { from { transform: translate3d(8%, 0, 0); } to { transform: translate3d(-30%, 0, 0); } }

@media ${MOTION} {
  @supports (animation-timeline: view()) {
    .gl-top { animation: gl-in linear both; animation-timeline: view(); animation-range: entry 0% entry 60%; }

    /* big watermark words drift sideways */
    .gl-bigw { animation: gl-drift linear both; animation-timeline: view(); animation-range: cover; }

    /* 01: activities slide in and draw their top line */
    .gl-act { animation: gl-slide linear both; animation-timeline: view(); animation-range: entry 0% entry 55%; }
    .gl-act::before { animation: gl-line linear both; animation-timeline: view(); animation-range: entry 10% entry 70%; }

    /* 02: the two panels drift in opposite directions */
    .gl-panel { --p: 46; animation: gl-par linear both; animation-timeline: view(); animation-range: cover; }
    .gl-panel:nth-child(even) { --p: -46; }
  }
}

/* ===== responsive ===== */
@media (max-width: 900px) {
  .gl-split { grid-template-columns: minmax(0, 1fr); }
  .gl-side { position: static; }
  .gl-no { font-size: clamp(5.5rem, 24vw, 9rem); }
  .gl-panels { grid-template-columns: minmax(0, 1fr); }
  .gl-panel { min-height: 0; }
  .gl-card { grid-template-columns: minmax(0, 1fr); gap: 12px; min-height: 0; top: calc(84px + var(--i) * 16px); }
}
@media (max-width: 640px) {
  .gl-top { align-items: flex-start; flex-direction: column; gap: 4px; }
  .gl-act { grid-template-columns: 38px 1fr; padding: 28px 0; }
  .gl-stack { padding-bottom: 8vh; }
}
`;