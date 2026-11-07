import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CouncilBanner from "@/components/CouncilBanner";
import HeroWords from "@/components/HeroWords";
import Pillars from "@/components/Pillars";
import WordReveal from "@/components/WordReveal";
import CookieBanner from "@/components/CookieBanner";
import GlobeJourney from "@/components/GlobeJourney";
import HomeFX from "@/components/HomeFX";
import Reveal from "@/components/Reveal";
import { ArrowIcon, PlayIcon } from "@/components/Icons";
import { getNextEvent, getPeople } from "@/lib/content";
import "./home.css";
import "./journey.css";
import "./globe.css";
import { ClosingStage } from "./about/ScrollStages";

// Decides before first paint whether the intro runs (once per session, never for reduced motion).
// Add ?intro=1 to the address to replay it.
const INTRO_FLAG = `try{var s=sessionStorage.getItem('owii-intro');var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if((s||r)&&location.search.indexOf('intro=1')<0){document.documentElement.setAttribute('data-intro','skip')}else{document.documentElement.setAttribute('data-intro','run')}}catch(e){document.documentElement.setAttribute('data-intro','skip')}`;

const closingWords = [
  ..."Our world cannot be led by autocrats; it must be led by".split(" ").map((t) => ({ t, hl: false })),
  ..."democracies that care for people and the planet.".split(" ").map((t) => ({ t, hl: true })),
];
const marqueeText = "DEMOCRACY ✦ PEOPLE ✦ PLANET ✦ ".repeat(3);

const WORDS = ["Democracy", "Equity", "Climate Justice", "Digital Futures", "Peace", "Partnership", "Fair Growth", "People"];

// Hover or tap a pill and the globe turns to that part of the world ("lon,lat").
const ABOUT_PILLS = [
  { label: "Empower citizens", at: "-62,-8" },
  { label: "Restore public trust", at: "10,48" },
  { label: "Build a fairer global order", at: "22,2" },
  { label: "Home base: India", at: "78,22" },
];

function Split({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className="kw" key={i}><span style={{ ["--i" as string]: i + start }}>{w}</span></span>
      ))}
    </>
  );
}

function SectionHead({ title, blurb, href, cta = "View all" }: { title: string; blurb?: string; href?: string; cta?: string }) {
  return (
    <div className="sec-head" data-r>
      <div>
        <div className="bars"><i /><i /><i /></div>
        <h2>{title}</h2>
        {blurb && <p>{blurb}</p>}
      </div>
      {href && <a className="link" href={href}>{cta} <ArrowIcon size={16} /></a>}
    </div>
  );
}

export default async function Home() {
  const [people, event] = await Promise.all([getPeople(), getNextEvent()]);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_FLAG }} />
      <div className="home-dark">
        <GlobeJourney />
        <div className="scroll-progress" aria-hidden="true" />
        <div className="cursor-glow" aria-hidden="true" />
        <Header />
        <main id="main">
          {/* HERO */}
          <section className="hm-hero" id="about">
            <div className="wrap">
              <div className="hm-grid">
                <div className="hm-copy">
                  <div className="eyebrow hm-in" style={{ ["--d" as string]: "0ms" }}>People &nbsp;·&nbsp; Democracy &nbsp;·&nbsp; A Fairer Tomorrow</div>
                  <h1 aria-label="Ideas for a fairer world.">
                    <span className="hw-line" aria-hidden="true"><Split text="Ideas for" /></span>
                    <HeroWords />
                    <span className="hw-line" aria-hidden="true"><Split text="world" start={4} /><em>.</em></span>
                  </h1>
                  <div className="hero-cta hm-in" style={{ ["--d" as string]: "1100ms" }}>
                    <a className="btn btn-primary" href="#focus" data-magnetic>Explore our work <ArrowIcon /></a>
                  </div>
                </div>
                {/* The globe is drawn here by <GlobeJourney />; the Democracy / Equity / Planet chips orbit it */}
                <div className="hm-globe hm-in" style={{ ["--d" as string]: "500ms" }}>
                  <div className="gj-slot" data-gs="hero" aria-hidden="true" />
                </div>
              </div>
            </div>
            <a className="scroll-cue hm-in" style={{ ["--d" as string]: "1600ms" }} href="#about-us" aria-label="Scroll down"><span /></a>
          </section>

          {/* MARQUEE */}
          <div className="strip" aria-hidden="true">
            <div className="strip-track">
              {[0, 1].map((k) => (
                <div className="strip-row" key={k}>
                  {WORDS.map((w) => <span key={w + k}>{w}<i /></span>)}
                </div>
              ))}
            </div>
          </div>

          {/* ABOUT: copy on the left, the globe parks on the right */}
          <section className="gj-about" id="about-us">
            <div className="wrap gj-about-grid">
              <div className="gj-about-copy">
                <div className="about-c-k" data-r><span className="bars"><i /><i /><i /></span>About us</div>
                <WordReveal className="about-c-txt gj-about-txt" lines={["The Our-World Institute and Initiative brings progressives together to build alternatives and renew democracy. We work to empower citizens, restore public trust, and shape a fairer global order, through new ideas, practical programs, and stronger organizations."]} marks={{ democracy: "glow", alternatives: "glow" }} />
                <ul className="gj-pills" data-r aria-label="Turn the globe">
                </ul>
              </div>
              <div>
                <div className="gj-about-globe" data-gs="about" aria-hidden="true" />
                <p className="gj-hint" aria-hidden="true">Drag the globe to explore</p>
              </div>
            </div>
          </section>

          {/* THREE PILLARS: the globe pours into three worlds here (it finds #focus) */}
          <Pillars summitHref={event.href} />

          {/* STATEMENT: same animated closing block as the About page */}
          <section className="gj-close" id="why">
            <div className="wrap">
              <ClosingStage words={closingWords} marquee={marqueeText} />
            </div>
          </section>

          {/* <CouncilBanner people={people} /> */}
        </main>
        <Footer />
      </div>
      <CookieBanner />
      <HomeFX />
      <Reveal />
    </>
  );
}