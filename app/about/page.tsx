import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";

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

/* Base = readable stacked list (older browsers, reduced motion) */
.ab-pil { position: relative; background: #0b1030; color: #fff; }
.ab-pil-stage { position: relative; isolation: isolate; overflow: hidden; padding: 56px 0 40px; }
.ab-pil-bg {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(60vw 60vw at 88% 8%, rgba(83,109,255,.38), transparent 62%),
    radial-gradient(50vw 50vw at 4% 96%, rgba(39,198,183,.26), transparent 62%),
    radial-gradient(30vw 30vw at 50% 50%, rgba(139,92,255,.16), transparent 70%);
}
.ab-pil-bg::after {
  content: ""; position: absolute; inset: 0; opacity: .5;
  background-image: radial-gradient(rgba(255,255,255,.16) .8px, transparent .8px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}
.ab-pil-slides { list-style: none; margin: 0; padding: 0; position: relative; }
.ab-s {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center; gap: clamp(20px, 5vw, 80px);
  width: min(1160px, calc(100% - 48px)); margin: 0 auto;
  padding: 40px 0; border-top: 1px solid rgba(255,255,255,.12);
}
.ab-pn {
  position: relative; isolation: isolate; display: inline-block; justify-self: start;
  font-size: clamp(6rem, 20vw, 15rem); font-weight: 900; line-height: .85;
  letter-spacing: -.07em; color: #fff;
}
.ab-pn::before, .ab-pn::after {
  content: attr(data-n); position: absolute; left: 0; top: 0; z-index: -1;
  pointer-events: none; opacity: 0;
}
.ab-pn::before { color: var(--ab-blue); }
.ab-pn::after { color: var(--ab-aqua); }
.ab-ptag {
  display: inline-block; margin-bottom: 18px; padding: 7px 14px; border-radius: 999px;
  border: 1px solid rgba(201,232,121,.5); color: var(--ab-lime);
  font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
}
.ab-pt h3 {
  margin: 0; color: #fff; font-size: clamp(2.1rem, 5vw, 4.4rem);
  line-height: 1; letter-spacing: -.05em; font-weight: 850;
}
.ab-pt h3::after {
  content: ""; display: block; width: 84px; height: 4px; margin: 22px 0 20px; border-radius: 4px;
  background: linear-gradient(90deg, var(--ab-blue), var(--ab-aqua), var(--ab-lime));
}
.ab-pt p { margin: 0; max-width: 40ch; color: rgba(255,255,255,.76); font-size: clamp(1rem, 1.5vw, 1.2rem); line-height: 1.65; }
.ab-pil-bar { display: none; }
.ab-pil-foot {
  width: min(1160px, calc(100% - 48px)); margin: 28px auto 0;
  display: flex; justify-content: space-between; align-items: center; gap: 20px;
  color: rgba(255,255,255,.55); font-size: .74rem; letter-spacing: .1em; text-transform: uppercase;
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .ab-pil { height: 900vh; view-timeline: --ab-pil block; }
    .ab-pil-stage { position: sticky; top: 0; height: 100vh; height: 100svh; padding: 0; }
    .ab-pil-slides { position: absolute; inset: 0; }
    .ab-s {
      position: absolute; inset: 0; margin: 0 auto; padding: 0 0 6vh;
      align-content: center; border: 0;
      --rin: contain calc(var(--i) * 16.6667% - 5%) contain calc(var(--i) * 16.6667% + 5%);
      --rout: contain calc((var(--i) + 1) * 16.6667% - 5%) contain calc((var(--i) + 1) * 16.6667% + 5%);
      --range: var(--rin), var(--rout);
      --fill: both, forwards;
      --ease: cubic-bezier(.2,.8,.2,1), cubic-bezier(.7,0,.8,.3);
      --nm-s: ab-s-in, ab-s-out;
      --nm-n: ab-n-in, ab-n-out;
      --nm-t: ab-t-in, ab-t-out;
      --nm-g1: ab-g1-in, ab-g1-out;
      --nm-g2: ab-g2-in, ab-g2-out;
    }
    .ab-s[data-pos="first"] {
      --range: var(--rout); --fill: forwards; --ease: cubic-bezier(.7,0,.8,.3);
      --nm-s: ab-s-out; --nm-n: ab-n-out; --nm-t: ab-t-out; --nm-g1: ab-g1-out; --nm-g2: ab-g2-out;
    }
    .ab-s[data-pos="last"] {
      --range: var(--rin); --fill: both; --ease: cubic-bezier(.2,.8,.2,1);
      --nm-s: ab-s-in; --nm-n: ab-n-in; --nm-t: ab-t-in; --nm-g1: ab-g1-in; --nm-g2: ab-g2-in;
    }
    .ab-s, .ab-pn, .ab-pt, .ab-pn::before, .ab-pn::after {
      animation-timeline: --ab-pil;
      animation-range: var(--range);
      animation-fill-mode: var(--fill);
      animation-timing-function: var(--ease);
    }
    .ab-s { animation-name: var(--nm-s); }
    .ab-pn { animation-name: var(--nm-n); }
    .ab-pt { animation-name: var(--nm-t); }
    .ab-pn::before { animation-name: var(--nm-g1); }
    .ab-pn::after { animation-name: var(--nm-g2); }

    .ab-pil-bar, .ab-pil-foot {
      position: absolute; left: 50%; translate: -50% 0;
      width: min(1160px, calc(100% - 48px));
    }
    .ab-pil-bar { display: block; bottom: 5vh; height: 2px; background: rgba(255,255,255,.16); }
    .ab-pil-bar i {
      display: block; height: 100%; transform-origin: left; transform: scaleX(0);
      background: linear-gradient(90deg, var(--ab-blue), var(--ab-aqua), var(--ab-lime));
      animation: ab-progress linear both; animation-timeline: --ab-pil;
      animation-range: contain 0% contain 100%;
    }
    .ab-pil-foot { bottom: calc(5vh + 16px); margin: 0; }
  }
}

@keyframes ab-s-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ab-s-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes ab-n-in {
  from { transform: translate3d(55vw,0,0) scale(.85); filter: blur(14px); }
  to { transform: none; filter: blur(0); }
}
@keyframes ab-n-out {
  from { transform: none; filter: blur(0); }
  to { transform: translate3d(-55vw,0,0) scale(.85); filter: blur(14px); }
}
@keyframes ab-t-in { from { opacity: 0; transform: translate3d(0,44px,0); } to { opacity: 1; transform: none; } }
@keyframes ab-t-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translate3d(0,-44px,0); } }
/* Ghost trails behind the moving number */
@keyframes ab-g1-in { from { opacity: .6; transform: translate3d(9vw,0,0); } to { opacity: 0; transform: none; } }
@keyframes ab-g1-out { from { opacity: 0; transform: none; } to { opacity: .6; transform: translate3d(9vw,0,0); } }
@keyframes ab-g2-in { from { opacity: .4; transform: translate3d(18vw,0,0); } to { opacity: 0; transform: none; } }
@keyframes ab-g2-out { from { opacity: 0; transform: none; } to { opacity: .4; transform: translate3d(18vw,0,0); } }

/* ============ Closing statement ============ */
.ab-fin {
  position: relative; isolation: isolate; overflow: hidden;
  min-height: min(88vh, 780px); display: grid; place-items: center;
  padding: clamp(70px, 10vw, 140px) clamp(22px, 5vw, 70px);
  border-radius: 32px; text-align: center; color: #fff; background: #070b24;
  view-timeline: --ab-q block;
}
.ab-fin::after { /* vignette keeps text readable over the glow */
  content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(7,11,36,.15) 25%, rgba(7,11,36,.82) 85%);
}
.ab-fin-aurora { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.ab-fin-aurora i { position: absolute; display: block; border-radius: 50%; }
.ab-fin-aurora i:nth-child(1) {
  width: 90%; aspect-ratio: 1; left: 5%; top: -30%; opacity: .5; filter: blur(70px);
  background: conic-gradient(from 0deg, #536dff, #27c6b7, #8b5cff, #c9e879, #536dff);
  animation: ab-spin 22s linear infinite;
}
.ab-fin-aurora i:nth-child(2) {
  width: 46%; aspect-ratio: 1; right: -12%; bottom: -30%;
  background: radial-gradient(circle, rgba(39,198,183,.85), transparent 68%);
  animation: ab-float 11s ease-in-out infinite;
}
.ab-fin-aurora i:nth-child(3) {
  width: 40%; aspect-ratio: 1; left: -12%; bottom: -20%;
  background: radial-gradient(circle, rgba(139,92,255,.8), transparent 68%);
  animation: ab-float 13s ease-in-out infinite reverse;
}
.ab-fin-marq {
  position: absolute; inset: 0; z-index: -1; pointer-events: none; user-select: none;
  display: flex; flex-direction: column; justify-content: space-between; padding: 5% 0;
}
.ab-fin-marq div {
  display: flex; width: max-content; white-space: nowrap;
  font-size: clamp(4rem, 13vw, 10rem); font-weight: 900; line-height: 1; letter-spacing: -.05em;
  color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,.17);
  animation: ab-marq 40s linear infinite;
}
.ab-fin-marq div:nth-child(2) { animation-direction: reverse; -webkit-text-stroke-color: rgba(201,232,121,.2); }
.ab-fin-ring {
  position: absolute; left: 50%; top: 50%; z-index: -1; pointer-events: none;
  width: min(80vw, 780px); aspect-ratio: 1; translate: -50% -50%;
  border-radius: 50%; border: 1px dashed rgba(255,255,255,.22);
  animation: ab-rot 48s linear infinite;
}
.ab-fin-ring::before, .ab-fin-ring::after {
  content: ""; position: absolute; width: 12px; height: 12px; border-radius: 50%;
  left: 50%; margin-left: -6px;
}
.ab-fin-ring::before { top: -6px; background: var(--ab-lime); box-shadow: 0 0 26px 7px rgba(201,232,121,.7); }
.ab-fin-ring::after { bottom: -6px; background: var(--ab-aqua); box-shadow: 0 0 26px 7px rgba(39,198,183,.7); }
.ab-fin-ring.two { width: min(56vw, 540px); animation-duration: 32s; animation-direction: reverse; border-color: rgba(83,109,255,.4); }

.ab-fin-chip {
  display: inline-flex; align-items: center; gap: 10px; margin-bottom: 30px; padding: 9px 18px;
  border-radius: 999px; border: 1px solid rgba(255,255,255,.22); background: rgba(255,255,255,.06);
  backdrop-filter: blur(8px); font-size: .74rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
}
.ab-fin-chip i {
  width: 8px; height: 8px; border-radius: 50%; background: var(--ab-lime);
  box-shadow: 0 0 0 0 rgba(201,232,121,.7); animation: ab-pulse 2s ease-out infinite;
}
.ab-fin-text {
  max-width: 1020px; margin: 0 auto; perspective: 900px;
  font-size: clamp(2.2rem, 6vw, 5.6rem); line-height: 1.05; letter-spacing: -.055em; font-weight: 850;
}
.ab-w { display: inline-block; margin-inline-end: .26em; }
.ab-w.hl {
  color: transparent; -webkit-text-fill-color: transparent;
  background: linear-gradient(90deg, #c9e879, #8ff0e4, #ffffff, #c9e879);
  background-size: 300% auto; -webkit-background-clip: text; background-clip: text;
  animation: ab-shimmer 6s linear infinite; animation-delay: calc(var(--w) * -.5s);
}
.ab-fin-sign { margin-top: 38px; color: rgba(255,255,255,.6); font-size: .76rem; letter-spacing: .16em; text-transform: uppercase; }

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .ab-w {
      animation: ab-word linear both; animation-timeline: --ab-q;
      animation-range: entry calc(var(--w) * 3%) entry calc(var(--w) * 3% + 28%);
    }
    .ab-w.hl {
      animation: ab-word linear both, ab-shimmer 6s linear infinite;
      animation-timeline: --ab-q, auto;
      animation-range: entry calc(var(--w) * 3%) entry calc(var(--w) * 3% + 28%), normal;
      animation-delay: 0s, calc(var(--w) * -.5s);
    }
  }
}

/* Motion */
@keyframes ab-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(35px,28px,0); } }

@keyframes ab-spin { to { transform: rotate(360deg); } }
@keyframes ab-rot { to { rotate: 360deg; } }
@keyframes ab-marq { to { transform: translateX(-50%); } }
@keyframes ab-pulse { 0% { box-shadow: 0 0 0 0 rgba(201,232,121,.7); } 100% { box-shadow: 0 0 0 14px rgba(201,232,121,0); } }
@keyframes ab-word {
  from { opacity: 0; transform: translate3d(0,.6em,0) rotateX(-70deg) scale(.9); filter: blur(12px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}
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
   .ab *, .ab *::before, .ab *::after {
    animation: none !important; transition: none !important; scroll-behavior: auto !important;
  }
  .ab-scroll-progress { display: none; }
}
@media (max-width: 850px) {
  .ab-intro { grid-template-columns: 1fr; gap: 48px; }
  .ab-intro-side { max-width: 520px; }
  .ab-aims-head, .ab-pillars-head { display: block; }
  .ab-aims-head .ab-sub, .ab-pillars-head .ab-sub { margin-top: 20px; max-width: 500px; }
}
@media (max-width: 700px) {
  .ab-s { grid-template-columns: 1fr; gap: 6px; }
  .ab-pn { font-size: clamp(6.5rem, 34vw, 10rem); }
  .ab-pt h3 { font-size: clamp(1.9rem, 9vw, 2.8rem); }
  .ab-pt h3::after { margin: 16px 0 14px; }
}
@media (max-width: 600px) {
  .ab-wrap { width: min(100% - 36px, 1160px); }
  .ab-sec { padding: 68px 0; }
  .ab-aims-head, .ab-pillars-head { margin-bottom: 36px; }
  .ab-aim { grid-template-columns: 38px 1fr; gap: 12px; padding: 23px 2px; }
  .ab-aim-tag { grid-column: 2; margin-top: -4px; }
  .ab-aim-arrow { display: none; }
  .ab-aim:hover { padding-left: 12px; padding-right: 12px; }
  .ab-pil-foot { flex-direction: column; align-items: flex-start; gap: 4px; }
  .ab-fin { min-height: 540px; border-radius: 22px; }
  .ab-fin-ring { width: 130vw; }
  .ab-fin-ring.two { width: 90vw; }
}
`;

const stagger = (i: number) => ({ "--i": i } as CSSProperties);
const wordIdx = (i: number) => ({ "--w": i } as CSSProperties);

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
                  <span className="ab-aim-tag">{a.tag}<span className="ab-aim-arrow">↗</span></span>
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
                <span className="ab-kicker">The way forward</span>
                <h2 className="ab-h2">How we <span className="ab-accent">get there.</span></h2>
              </div>
              <p className="ab-sub">
                Six commitments that guide the Institute and the Initiative.
              </p>
            </div>
          </div>
        </section>

        <section className="ab-pil" aria-label="Our six pillars">
          <div className="ab-pil-stage">
            <div className="ab-pil-bg" aria-hidden="true" />
            <ol className="ab-pil-slides">
              {pillars.map((p, i) => (
                <li
                  className="ab-s"
                  style={stagger(i)}
                  data-pos={i === 0 ? "first" : i === pillars.length - 1 ? "last" : "mid"}
                  key={p.n}
                >
                  <div className="ab-pn" data-n={p.n} aria-hidden="true">{p.n}</div>
                  <div className="ab-pt">
                    <span className="ab-ptag">Pillar {p.n} of 0{pillars.length}</span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="ab-pil-foot">
              <span>Six pillars. A shared commitment.</span>
              <span>Our-World Institute &amp; Initiative</span>
            </div>
            <div className="ab-pil-bar" aria-hidden="true"><i /></div>
          </div>
        </section>

        {/* Closing statement */}
        <section className="ab-sec">
          <div className="ab-wrap">
            <div className="ab-fin">
              <div className="ab-fin-aurora" aria-hidden="true"><i /><i /><i /></div>
              <div className="ab-fin-marq" aria-hidden="true">
                <div><span>{marqueeText}</span><span>{marqueeText}</span></div>
                <div><span>{marqueeText}</span><span>{marqueeText}</span></div>
              </div>
              <span className="ab-fin-ring" aria-hidden="true" />
              <span className="ab-fin-ring two" aria-hidden="true" />

              <div>
                <span className="ab-fin-chip"><i />Our belief</span>
                <p className="ab-fin-text">
                  {closingWords.map((w, i) => (
                    <span className={`ab-w${w.hl ? " hl" : ""}`} style={wordIdx(i)} key={i}>
                      {w.t}
                    </span>
                  ))}
                </p>
                <div className="ab-fin-sign">Our-World Institute &amp; Initiative</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}