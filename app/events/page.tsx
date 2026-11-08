import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { ArrowIcon } from "@/components/Icons";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Summits, conferences, roundtables and workshops from Our-World Institute & Initiative.",
};

/* The flagship card is now one WebP that already contains the details.
   Put the files in /public/assets/events/ and set the real pixel size below. */
const EVENT_IMG = {
  desktop: "/assets/bharath_summit.webp",
  mobile: null as string | null, // optional taller/narrower version for phones, e.g. "/assets/events/bharat-summit-mobile.webp"
  width: 1600,
  height: 900,
};

const CSS = `
.evf { max-width: 1100px; margin-inline: auto; }
.evf-head { max-width: 1100px; margin: 0 auto 28px; }
.evf-eye { display: block; margin-bottom: 10px; font-size: .8rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: var(--gold, #F7A21B); }
.evf-head h2 { margin: 0; font-size: clamp(2.4rem, 8vw, 5.6rem); line-height: .95; font-weight: 800; letter-spacing: -.035em; text-transform: uppercase; color: #14203f !important; }
.evf-out { color: transparent; -webkit-text-stroke: 2px #14203f; }
.evf-img { position: relative; display: block; overflow: hidden; border-radius: 24px; background: #0a1a3a;
  box-shadow: 0 18px 44px rgba(20,32,63,.18); outline: none; -webkit-tap-highlight-color: transparent;
  transition: transform .4s ease, box-shadow .4s ease; }
.evf-img img { display: block; width: 100%; height: auto; transition: transform .8s ease; }
.evf-img:hover, .evf-img:focus-visible { transform: translateY(-6px); box-shadow: 0 26px 56px rgba(20,32,63,.26); }
.evf-img:hover img { transform: scale(1.03); }
.evf-img:focus-visible { box-shadow: 0 0 0 3px #7FE8F5; }
.evf-cta { display: flex; justify-content: center; margin-top: 24px; }
@media (max-width: 700px) {
  .evf-img { border-radius: 16px; }
  .evf-img:hover { transform: none; }
  .evf-cta { margin-top: 18px; }
  .evf-cta .btn { width: 100%; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) { .evf-img, .evf-img img { transition: none; } }
`;

export default async function EventsPage() {
  const [flagship] = await getEvents();

  return (
    <Shell>
      <style>{CSS}</style>
      <PageBanner variant="events" />

      <section className="sec">
        <div className="wrap">
          <div className="evf-head rv">
            <span className="evf-eye">Flagship Annual Summit</span>
            <h2>Bharat <span className="evf-out">Summit</span></h2>
          </div>

          <article className="evf rv">
            <a className="evf-img" href={flagship.href} target="_blank" rel="noopener noreferrer">
              <picture>
                {EVENT_IMG.mobile && <source media="(max-width: 700px)" srcSet={EVENT_IMG.mobile} />}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={EVENT_IMG.desktop}
                  alt={`${flagship.title}, ${flagship.place}, ${flagship.dateLabel}. Visit the Bharat Summit website.`}
                  width={EVENT_IMG.width}
                  height={EVENT_IMG.height}
                  decoding="async"
                />
              </picture>
            </a>

            <div className="evf-cta">
              <a className="btn btn-primary" href={flagship.href} target="_blank" rel="noopener noreferrer">
                Visit Bharat Summit website <ArrowIcon />
              </a>
            </div>
          </article>
        </div>
      </section>
    </Shell>
  );
}