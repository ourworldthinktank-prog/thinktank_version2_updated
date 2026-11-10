import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { PillarsStage, ClosingStage } from "./ScrollStages";
import AimsAccordion from "@/components/AimsAccordion";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Our-World Institute and Initiative enables progressives to work together to develop alternative solutions, empower citizens, revitalise democracy and build a fairer global order.",
};

// DRAFT COPY: the one-line descriptions are adapted from the intro paragraph; client to approve wording.
const aims = [
  { n: "01", t: "Develop alternative solutions", tag: "Imagine what comes next", d: "Bring progressives together to design practical alternatives to the challenges our world faces." },
  { n: "02", t: "Empower citizens", tag: "Put people at the centre", d: "Give people the knowledge, voice and tools to shape the decisions that affect their lives." },
  { n: "03", t: "Revitalise democracy", tag: "Make democracy work", d: "Strengthen democratic institutions and practice so they work for everyone and earn public trust." },
  { n: "04", t: "Build a fairer global order", tag: "Shape a better world", d: "Shape cooperation between nations that is more equal, more sustainable and more peaceful." },
];

// DRAFT COPY: the one-line descriptions are adapted from the intro paragraph; client to approve wording.
const pillars = [
  { n: "01", t: "Rethink paradigms", d: "Question established ways of thinking and build fresh frameworks for a changing world." },
  { n: "02", t: "Reimagine institutions", d: "Redesign institutions so they work for people, not the other way round." },
  { n: "03", t: "Modernise operations", d: "Bring modern, open and effective ways of working to how progressives organise and deliver." },
  { n: "04", t: "Restore public trust", d: "Offer a compelling vision for a shared future that people can believe in." },
  { n: "05", t: "Harness innovation", d: "Put disruptive innovations to work for the common good." },
  { n: "06", t: "Reclaim the centre", d: "Build new coalitions and partnerships that win the centre ground for fairness." },
];

const closingLead = "Our world cannot be led by autocrats; it must be led by".split(" ");
const closingHighlight = "democracies that care for people and the planet.".split(" ");
const closingWords = [
  ...closingLead.map((t) => ({ t, hl: false })),
  ...closingHighlight.map((t) => ({ t, hl: true })),
];
const marqueeText = "DEMOCRACY ✦ PEOPLE ✦ PLANET ✦ ".repeat(3);

const css = `
.ab {
  --ab-lime: #F5A12A;
  --ab-blue: #536DFF;
  --ab-aqua: #27C6B7;
  --ab-violet: #8B5CFF;
  --ab-ink: #14203f;
  --ab-muted: #68718a;
  --ab-paper: #f5f5f1;
  color: var(--ab-ink);
  overflow: clip;
}

.ab * { box-sizing: border-box; }
.ab-scroll-progress {
  position: fixed; z-index: 9999; inset: 0 auto auto 0;
  width: 100%; height: 4px; transform: scaleX(0);
  transform-origin: left center;
  background: linear-gradient(90deg, var(--ab-blue), var(--ab-aqua), var(--ab-lime));
  pointer-events: none;
  animation: ab-progress linear both;
  animation-timeline: scroll(root block);
}
.ab-grain {
  position: absolute; inset: 0; pointer-events: none; opacity: .13;
  background-image: radial-gradient(#536dff 0.65px, transparent 0.65px);
  background-size: 16px 16px; mask-image: linear-gradient(135deg, black, transparent 70%);
}
.ab-scroll-cue {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 32px;
  color: var(--ab-muted); font-size: .7rem; font-weight: 800;
  letter-spacing: .15em; text-transform: uppercase;
}
.ab-scroll-cue span {
  display: inline-block; width: 34px; height: 1px; background: var(--ab-blue);
  transform-origin: left; animation: ab-cue 1.8s ease-in-out infinite;
}

.ab-wrap { width: min(1160px, calc(100% - 48px)); margin: 0 auto; }
.ab-sec { padding: clamp(56px, 7vw, 96px) 0; }
.ab-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  margin-bottom: 22px; color: var(--ab-muted);
  font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
}
.ab-eyebrow i { display: block; width: 22px; height: 4px; border-radius: 4px; }
.ab-eyebrow i:nth-child(1) { background: var(--ab-blue); }
.ab-eyebrow i:nth-child(2) { background: var(--ab-lime); width: 15px; }
.ab-eyebrow i:nth-child(3) { background: var(--ab-aqua); width: 8px; }
.ab-kicker { display: block; margin-bottom: 18px; color: var(--ab-muted); font-size: .78rem; font-weight: 750; letter-spacing: .15em; text-transform: uppercase; }
.ab-h2 {
  max-width: 850px; margin: 0; color: var(--ab-ink);
  font-size: clamp(2.5rem, 6.5vw, 5.7rem); line-height: .98;
  letter-spacing: -.065em; font-weight: 850;
}
.ab-h2 .ab-accent { color: var(--ab-blue); }
.ab-sub { max-width: 560px; margin: 22px 0 0; color: var(--ab-muted); font-size: 1.05rem; line-height: 1.7; }

/* Intro: dark card, image placeholder beside the text */
.ab-intro-sec { padding-top: clamp(32px, 5vw, 64px); padding-bottom: clamp(20px, 3vw, 40px); }
.ab-intro-card {
  position: relative; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  gap: clamp(26px, 4vw, 64px); align-items: stretch;
  padding: clamp(18px, 2.6vw, 34px); border-radius: 28px; overflow: hidden;
  background: linear-gradient(135deg, #14203f 0%, #1c2a5c 62%, #1a3a58 100%);
  color: #fff; box-shadow: 0 40px 90px -40px rgba(20,32,63,.7);
}
.ab-intro-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image: radial-gradient(rgba(255,255,255,.12) .7px, transparent .7px); background-size: 18px 18px;
  mask-image: linear-gradient(120deg, transparent 30%, black);
}
.ab-intro-glow {
  position: absolute; width: 46%; aspect-ratio: 1; right: -12%; top: -22%; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, rgba(83,109,255,.5), transparent 68%); filter: blur(30px);
  animation: ab-float 14s ease-in-out infinite;
}
.ab-img { position: relative; min-height: 420px; border-radius: 18px; overflow: hidden; background: #14203f; }
.ab-img > img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.ab-img::after {
  content: ""; position: absolute; inset: -40%; pointer-events: none;
  background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,.16) 50%, transparent 60%);
  animation: ab-sheen 6s ease-in-out infinite;
}
.ab-img-in { position: relative; z-index: 1; display: grid; gap: 10px; justify-items: center; color: rgba(255,255,255,.85); }
.ab-img-in svg { width: 46px; height: 46px; }
.ab-img-in b { font-size: .78rem; letter-spacing: .18em; text-transform: uppercase; font-weight: 800; }
.ab-img-in small { font-size: .72rem; opacity: .65; }
.ab-img-badge {
  position: absolute; z-index: 2; left: 16px; top: 16px; width: 56px; height: 56px; border-radius: 50%;
  display: grid; place-items: center; background: var(--ab-lime); color: var(--ab-ink); box-shadow: 0 10px 30px rgba(0,0,0,.3);
}
.ab-img-badge svg { width: 26px; height: 26px; animation: ab-spin 14s linear infinite; }
.ab-intro-text { position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: center; padding: clamp(6px, 1.6vw, 22px) clamp(0px, 1vw, 12px) clamp(6px, 1.6vw, 22px) 0; }
.ab-intro-label { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 22px; font-size: .74rem; letter-spacing: .16em; text-transform: uppercase; color: rgba(255,255,255,.85); font-weight: 600; }
.ab-intro-label i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,.5); position: relative; }
.ab-intro-label i::after { content: ""; position: absolute; right: -2px; top: -2px; width: 6px; height: 6px; border-radius: 50%; background: var(--ab-lime); animation: ab-pulse 1.8s ease-out infinite; }
.ab-lead {
  margin: 0; color: #fff; text-transform: uppercase;
  font-size: clamp(1.05rem, 1.95vw, 1.6rem); line-height: 1.32; letter-spacing: -.005em; font-weight: 500;
  text-align: justify; text-justify: inter-word; hyphens: manual;
}
.ab-lead mark { background: none; color: var(--ab-lime); }
.ab-lead-sub { margin: 26px 0 0; max-width: 520px; color: rgba(255,255,255,.78); font-size: .98rem; line-height: 1.7; text-align: justify; text-justify: inter-word; }
.ab-lead-sub mark { background: none; color: var(--ab-aqua); font-weight: 600; }
@keyframes ab-sheen { 0%, 100% { transform: translateX(-30%); } 50% { transform: translateX(30%); } }

/* Aims: expanding panels (same colours as before) */
.ab-aims {
  background: var(--ab-paper); position: relative;
  background-image: radial-gradient(rgba(83,109,255,.12) .7px, transparent .7px);
  background-size: 19px 19px;
}
.ab-aims::before {
  content: ""; position: absolute; width: 42vw; height: 42vw; max-width: 560px; max-height: 560px;
  right: -18vw; top: 8%; border-radius: 50%;
  background: radial-gradient(circle, rgba(39,198,183,.12), transparent 68%);
  pointer-events: none;
}
.ab-aims { padding-top: clamp(44px, 6vw, 80px); }
.ab-aims-head { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 40px; }
.ab-aims-head .ab-sub { max-width: 300px; margin: 0 0 5px; }
.ab-ax { position: relative; z-index: 1; display: flex; height: clamp(400px, 46vw, 500px); border-radius: 20px; overflow: hidden; box-shadow: 0 30px 70px -40px rgba(20,32,63,.45); border: 1px solid #d8d9d3; background: #fff; }
.ab-ax-p {
  position: relative; flex: 0 0 clamp(84px, 9vw, 124px); min-width: 0; overflow: hidden; text-align: left; cursor: pointer;
  display: flex; flex-direction: column; justify-content: space-between; padding: 24px clamp(14px, 1.6vw, 26px);
  background: #fff; color: var(--ab-ink); border-right: 1px solid #e4e5df;
  transition: flex-basis .7s cubic-bezier(.2,.75,.25,1), background .5s ease, color .4s ease;
}
.ab-ax-p:last-child { border-right: 0; }
.ab-ax-p::before { content: ""; position: absolute; z-index: 0; inset: 0; background: linear-gradient(105deg, #17234a 0%, #263a78 68%, #244e62 100%); opacity: 0; transition: opacity .5s ease; }
.ab-ax-p:hover:not(.on)::before { opacity: .06; }
.ab-ax-p > * { position: relative; z-index: 1; }
.ab-ax-p.on { flex: 1 1 auto; color: #fff; cursor: default; }
.ab-ax-p.on::before { opacity: 1; }
.ab-ax-top { display: flex; align-items: center; gap: 10px; font-size: .8rem; letter-spacing: .08em; font-weight: 800; color: var(--ab-blue); }
.ab-ax-top i { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid var(--ab-blue); position: relative; flex: none; }
.ab-ax-top i::after { content: ""; position: absolute; inset: 2.5px; border-radius: 50%; background: var(--ab-blue); transition: background .4s; }
.ab-ax-p.on .ab-ax-top { color: var(--ab-lime); }
.ab-ax-p.on .ab-ax-top i { border-color: var(--ab-lime); }
.ab-ax-p.on .ab-ax-top i::after { background: var(--ab-lime); animation: ab-pulse 1.8s ease-out infinite; }
.ab-ax-vt { position: absolute; z-index: 1; left: clamp(14px, 1.6vw, 26px); bottom: 24px; writing-mode: vertical-rl; transform: rotate(180deg); font-size: clamp(1rem, 1.5vw, 1.35rem); font-weight: 800; letter-spacing: -.02em; line-height: 1.1; max-height: calc(100% - 90px); transition: opacity .3s ease; }
.ab-ax-p.on .ab-ax-vt { opacity: 0; pointer-events: none; }
.ab-ax-body { display: flex; flex-direction: column; gap: 16px; min-width: min(480px, 70vw); opacity: 0; visibility: hidden; transition: opacity .3s ease, visibility 0s .3s; }
.ab-ax-p.on .ab-ax-body { opacity: 1; visibility: visible; transition: opacity .3s ease; }
.ab-ax-p.on .ab-ax-body > * { animation: ab-reveal .7s cubic-bezier(.2,.7,.2,1) both; }
.ab-ax-p.on .ab-ax-body > *:nth-child(1) { animation-delay: .18s; }
.ab-ax-p.on .ab-ax-body > *:nth-child(2) { animation-delay: .28s; }
.ab-ax-p.on .ab-ax-body > *:nth-child(3) { animation-delay: .38s; }
.ab-ax-tag { align-self: flex-start; padding: 6px 12px; border: 1px solid rgba(255,255,255,.35); border-radius: 999px; font-size: .68rem; letter-spacing: .16em; text-transform: uppercase; color: var(--ab-lime); font-weight: 700; }
.ab-ax-body h3 { margin: 0; font-size: clamp(1.9rem, 4.4vw, 3.8rem); line-height: 1.02; letter-spacing: -.045em; font-weight: 850; color: #fff; }
.ab-ax-body p { margin: 0; max-width: 460px; color: rgba(255,255,255,.78); font-size: 1rem; line-height: 1.65; }
.ab-ax-bar { position: absolute; z-index: 2; left: 0; right: 0; top: 0; height: 3px; background: linear-gradient(90deg, var(--ab-blue), var(--ab-aqua), var(--ab-lime)); transform-origin: left; transform: scaleX(0); }
.ab-ax-p.on.ab-autoplay .ab-ax-bar { animation: ab-axbar var(--ab-ax-t, 5s) linear forwards; }
@keyframes ab-axbar { to { transform: scaleX(1); } }
@media (max-width: 850px) {
  .ab-intro-card { grid-template-columns: 1fr; }
  .ab-img { min-height: 280px; aspect-ratio: 4 / 3; }
  .ab-intro-text { padding: 6px 4px 14px; }
  .ab-lead-sub { max-width: none; }
}
@media (max-width: 700px) {
  .ab-axw { height: calc(100svh + (var(--n) - 1) * 58svh); }
  .ab-axw .ab-ax { position: sticky; top: 88px; }
  .ab-ax { flex-direction: column; height: auto; }
  .ab-ax-p { flex: 0 0 auto; height: 74px; padding: 0 18px; flex-direction: row; align-items: center; justify-content: flex-start; gap: 16px; border-right: 0; border-bottom: 1px solid #e4e5df; transition: height .6s cubic-bezier(.2,.75,.25,1), background .5s ease, color .4s ease; }
  .ab-ax-p:last-child { border-bottom: 0; }
  .ab-ax-p.on { flex: 0 0 auto; height: 330px; flex-direction: column; align-items: flex-start; justify-content: flex-start; padding: 24px 18px; gap: 18px; }
  .ab-ax-vt { position: static; writing-mode: horizontal-tb; transform: none; max-height: none; font-size: 1.05rem; }
  .ab-ax-p.on .ab-ax-vt { display: none; }
  .ab-ax-body { min-width: 0; }
}
@media (prefers-reduced-motion: reduce) { .ab-intro-glow, .ab-img::after, .ab-img-badge svg { animation: none !important; } }

/* ============ Pillars: pinned scroll stage ============ */
.ab-pillars-head { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 62px; }
.ab-pillars-head .ab-sub { margin: 0 0 4px; max-width: 300px; }

/* Motion */
@keyframes ab-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(35px,28px,0); } }

@keyframes ab-spin { to { transform: rotate(360deg); } }
@keyframes ab-rot { to { rotate: 360deg; } }
@keyframes ab-marq { to { transform: translateX(-50%); } }
@keyframes ab-pulse { 0% { box-shadow: 0 0 0 0 rgba(201,232,121,.7); } 100% { box-shadow: 0 0 0 14px rgba(201,232,121,0); } }
@keyframes ab-progress { to { transform: scaleX(1); } }
@keyframes ab-cue { 0%,100% { transform: scaleX(.45); opacity: .5; } 50% { transform: scaleX(1); opacity: 1; } }
@keyframes ab-drift { 0%,100% { transform: translate3d(0,0,0) rotate(18deg); } 50% { transform: translate3d(-12px,-18px,0) rotate(28deg); } }
@keyframes ab-shimmer { to { background-position: 300% center; } }

@keyframes ab-reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.ab-rv { animation: ab-reveal .8s cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(var(--i, 0) * 100ms); }
@supports (animation-timeline: view()) {
  .ab-rv { animation: ab-reveal linear both; animation-timeline: view(); animation-range: entry 0% entry 35%; animation-delay: 0s; }
}
@media (prefers-reduced-motion: reduce) {
  /* Only autoplaying loops are switched off. Scroll-linked effects stay, because the reader controls them. */
  .ab-scroll-cue span { animation-play-state: paused !important; }
  .ab *, .ab *::before, .ab *::after { transition: none !important; scroll-behavior: auto !important; }
}
@media (max-width: 850px) {
  .ab-intro { grid-template-columns: 1fr; gap: 48px; }
  .ab-intro-side { max-width: 520px; }
  .ab-aims-head, .ab-pillars-head { display: block; }
  .ab-aims-head .ab-sub, .ab-pillars-head .ab-sub { margin-top: 20px; max-width: 500px; }
}
@media (max-width: 600px) {
  .ab-wrap { width: min(100% - 36px, 1160px); }
  .ab-sec { padding: 48px 0; }
  .ab-aims-head, .ab-pillars-head { margin-bottom: 36px; }
  .ab-aim { grid-template-columns: 38px 1fr; gap: 12px; padding: 23px 2px; }
  .ab-aim-tag { grid-column: 2; margin-top: -4px; }
  .ab-aim-arrow { display: none; }
  .ab-aim:hover { padding-left: 12px; padding-right: 12px; }
}

`;

const stagger = (i: number) => ({ "--i": i } as CSSProperties);

export default function AboutPage() {
  return (
    <Shell>
      <style>{css}</style>
      <div className="ab">
        <PageBanner variant="about" />

        {/* Intro: dark card with an image placeholder beside the text */}
        <section className="ab-sec ab-intro-sec">
          <div className="ab-wrap">
            <div className="ab-intro-card ab-rv">
              <span className="ab-intro-glow" aria-hidden="true" />
              <div className="ab-img">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img src="/pillars/about_us.png" alt="Our-World Institute and Initiative" decoding="async" />
  <span className="ab-img-badge" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9z" /></svg>
  </span>
</div>

              <div className="ab-intro-text">
                <span className="ab-intro-label"><i />A shared vision for our world</span>
                <p className="ab-lead">
                  The Our-World Institute and Initiative aims to enable progressives to work{" "}
                  <mark>collectively</mark> across normative, programmatic, and organisational
                  dimensions to develop alternative solutions, empower citizens, revitalise
                  democracy, and build a <mark>fairer global order.</mark>
                </p>
                <p className="ab-lead-sub">
                  This requires rethinking established paradigms, reimagining institutions,
                  modernising operational approaches, restoring public trust through a compelling
                  vision for a shared future, harnessing disruptive innovations for the common
                  good, and reclaiming the centre through <mark>new coalitions and partnerships.</mark>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Aims */}
        <section className="ab-sec ab-aims">
          <div className="ab-wrap">
            <div className="ab-aims-head ab-rv">
              <div>
                <div className="ab-eyebrow"><i /><i /><i /></div>
                <span className="ab-kicker">Our purpose</span>
                <h2 className="ab-h2">What we <span className="ab-accent">aim</span> to do.</h2>
              </div>
              <p className="ab-sub">
                Four ambitions. One shared direction: a fairer, more democratic
                world that works for everyone.
              </p>
            </div>

            <AimsAccordion aims={aims} />
          </div>
        </section>

        {/* Pillars: heading, then pinned scroll stage */}
        <section className="ab-sec" style={{ paddingBottom: 56 }}>
          <div className="ab-wrap">
            <div className="ab-pillars-head ab-rv">
              <div>
                <div className="ab-eyebrow"><i /><i /><i /></div>
                <span className="ab-kicker">The Path forward</span>
                <h2 className="ab-h2">How we <span className="ab-accent">get there.</span></h2>
              </div>
              <p className="ab-sub">
                Six commitments that guide the Institute and the Initiative.
              </p>
            </div>
          </div>
        </section>

        <PillarsStage pillars={pillars} />

        
      </div>
    </Shell>
  );
}