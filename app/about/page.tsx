import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { PillarsStage, ClosingStage } from "./ScrollStages";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Our-World Institute and Initiative enables progressives to work together to develop alternative solutions, empower citizens, revitalise democracy and build a fairer global order.",
};

const aims = [
  { n: "01", t: "Develop alternative solutions", tag: "Imagine what comes next" },
  { n: "02", t: "Empower citizens", tag: "Put people at the centre" },
  { n: "03", t: "Revitalise democracy", tag: "Make democracy work" },
  { n: "04", t: "Build a fairer global order", tag: "Shape a better world" },
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
  --ab-lime: #C9E879;
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
.ab-sec { padding: clamp(76px, 10vw, 132px) 0; }
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

/* Intro */
.ab-intro {
  position: relative;
  z-index: 1;
  display: block;
  max-width: 1000px;
  margin: 0 auto;
}

.ab-lead {
  max-width: 100%;
  margin: 0;
  color: var(--ab-ink);
  font-size: clamp(1.2rem, 2.35vw, 1.8rem);
  line-height: 1.7;
  letter-spacing: -.025em;
  font-weight: 500;
  text-align: justify;
  text-justify: inter-word;
}
/* Aims: bold editorial rows */

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

.ab-aims-head { display: flex; justify-content: space-between; align-items: end; gap: 30px; margin-bottom: 58px; }
.ab-aims-head .ab-sub { max-width: 300px; margin: 0 0 5px; }
.ab-aim-list { position: relative; z-index: 1; border-top: 1px solid #d8d9d3; }
.ab-aim {
  position: relative; display: grid; grid-template-columns: 72px 1fr auto;
  gap: 22px; align-items: center; padding: 27px 10px;
  border-bottom: 1px solid #d8d9d3; overflow: hidden;
  transition: padding .45s cubic-bezier(.2,.75,.25,1), color .35s ease;
}
.ab-aim::before {
  content: ""; position: absolute; z-index: 0; inset: 0;
  background: linear-gradient(105deg, #17234a 0%, #263a78 68%, #244e62 100%); transform: translateY(101%);
  transition: transform .5s cubic-bezier(.2,.75,.25,1);
}
.ab-aim:hover { padding-left: 24px; padding-right: 24px; color: #fff; }
.ab-aim:hover::before { transform: translateY(0); }
.ab-aim > * { position: relative; z-index: 1; }
.ab-aim-num { color: var(--ab-blue); font-size: .85rem; font-weight: 850; letter-spacing: .08em; }
.ab-aim h3 {
  margin: 0; font-size: clamp(1.45rem, 3.5vw, 2.8rem);
  line-height: 1.1; letter-spacing: -.045em; font-weight: 800;
  transition: transform .45s cubic-bezier(.2,.75,.25,1);
}
.ab-aim:hover h3 { transform: translateX(5px); }
.ab-aim-tag { color: var(--ab-muted); font-size: .78rem; transition: color .35s ease; }
.ab-aim:hover .ab-aim-tag { color: rgba(255,255,255,.65); }
.ab-aim-arrow { display: inline-block; margin-left: 12px; color: var(--ab-blue); transition: transform .35s ease; }
.ab-aim:hover .ab-aim-arrow { transform: translate(5px, -5px); }

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
  .ab-sec { padding: 68px 0; }
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

        {/* Intro */}
        <section className="ab-sec ab-intro-sec">
          <div className="ab-wrap ab-intro">
            <div className="ab-rv">
              <div className="ab-eyebrow">
                <i />
                <i />
                <i />
              </div>

              <span className="ab-kicker">
                A shared vision for our world
              </span>

              <p className="ab-lead">
                The Our-World Institute and Initiative aims to enable
                progressives to work <mark>collectively</mark> across
                normative, programmatic, and organisational dimensions
                to develop alternative solutions, empower citizens,
                revitalise democracy, and build a{" "}
                <mark>fairer global order.</mark> This requires rethinking
                established paradigms, reimagining institutions,
                modernising operational approaches, restoring public
                trust through a compelling vision for a shared future,
                harnessing disruptive innovations for the common good,
                and reclaiming the centre through new coalitions and
                partnerships.
              </p>
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

            <div className="ab-aim-list">
              {aims.map((a, i) => (
                <article className="ab-aim ab-rv" style={stagger(i)} key={a.n}>
                  <span className="ab-aim-num">{a.n} /</span>
                  <h3>{a.t}</h3>
                </article>
              ))}
            </div>
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

        {/* Closing statement */}
        <section className="ab-sec">
          <div className="ab-wrap">
            <ClosingStage words={closingWords} marquee={marqueeText} />
          </div>
        </section>
      </div>
    </Shell>
  );
}