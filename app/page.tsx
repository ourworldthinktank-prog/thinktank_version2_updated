import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroGlobe from "@/components/HeroGlobe";
import MissionSections from "@/components/MissionSections";
import PeopleCarousel from "@/components/PeopleCarousel";
import CookieBanner from "@/components/CookieBanner";
import Reveal from "@/components/Reveal";
import { ArrowIcon } from "@/components/Icons";
import { getNextEvent, getPeople } from "@/lib/content";

function SectionHead({ title, blurb, href, cta = "View all" }: { title: string; blurb?: string; href?: string; cta?: string }) {
  return (
    <div className="sec-head rv">
      <div>
        <div className="bars"><i /><i /><i /></div>
        <h2>{title}</h2>
        {blurb && <p>{blurb}</p>}
      </div>
      {href && <a className="link" href={href}>{cta} <ArrowIcon size={16} /></a>}
    </div>
  );
}

function Hero({ eventHref }: { eventHref: string }) {
  return (
    <section className="hero" id="about">
      <div className="hero-stripes" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">People &nbsp;·&nbsp; Democracy &nbsp;·&nbsp; A Fairer Tomorrow</div>
            <h1>Ideas for<br />a fairer world<em>.</em></h1>
            <p className="hero-lead">The Our-World Institute and Initiative brings progressives together to build alternatives and renew democracy.</p>
            <p className="hero-lead">We work to empower citizens, restore public trust, and shape a fairer global order, through new ideas, practical programs, and stronger organizations.</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#focus">Explore <ArrowIcon /></a>
            </div>
          </div>
          <HeroGlobe />
        </div>

        <div className="pillars">
          <a href={eventHref} target="_blank" rel="noopener noreferrer" className="pillar rv">
            <span className="num">01</span>
            <span><b>Annual Summit</b><small>A global gathering of progressives</small></span>
          </a>
          <a href="#approach" className="pillar rv">
            <span className="num">02</span>
            <span><b>Research &amp; Policy</b><small>Evidence for change</small></span>
          </a>
          <a href="#approach" className="pillar rv">
            <span className="num">03</span>
            <span><b>Global Network</b><small>People, ideas, partnerships</small></span>
          </a>
        </div>
      </div>
    </section>
  );
}

function UpcomingEvent({ event }: { event: Awaited<ReturnType<typeof getNextEvent>> }) {
  return (
    <section className="sec" id="events" style={{ paddingTop: 30 }}>
      <div className="wrap">
        <SectionHead title="Upcoming Events" href={event.href} cta="Bharat Summit website" />
        <article className="event rv">
          <div className="date"><b>{event.dateLabel}</b><small>DATES TO BE ANNOUNCED</small></div>
          <div className="ev-body">
            <span className="tag" style={{ color: "var(--coral)" }}>{event.status}</span>
            <h3>{event.title}</h3>
            <p>{event.summary}</p>
            <a className="btn btn-primary btn-sm" href={event.href} target="_blank" rel="noopener noreferrer" style={{ marginBottom: 18 }}>
              Visit Bharat Summit website <ArrowIcon size={16} />
            </a>
            <div className="chips">
              <span className="chip">📍 {event.location}</span>
              <span className="chip">🗓 Date to be announced</span>
            </div>
          </div>
          <div className="ev-art" aria-hidden="true">
            <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
              <circle cx="300" cy="150" r="130" fill="#1FC1DE" opacity=".35" />
              <circle cx="360" cy="60" r="70" fill="#F7A21B" opacity=".55" />
              <g fill="none" stroke="#0F2A5C" strokeWidth="2.5" opacity=".75" strokeLinejoin="round">
                <path d="M210 240v-90h20v-30l15-18 15 18v30h20v90" />
                <path d="M290 240v-70h24v-26l14-16 14 16v26h24v70" />
                <path d="M335 240v-34a14 14 0 0 1 28 0v34" />
                <path d="M170 240v-50h24v50" />
              </g>
            </svg>
          </div>
        </article>
      </div>
    </section>
  );
}

export default async function Home() {
  const [people, event] = await Promise.all([getPeople(), getNextEvent()]);

  return (
    <>
      <Header />
      <main id="main">
        <Hero eventHref={event.href} />
        <PeopleCarousel people={people} />
        <UpcomingEvent event={event} />
      </main>
      <Footer />
      <CookieBanner />
      <Reveal />
    </>
  );
}