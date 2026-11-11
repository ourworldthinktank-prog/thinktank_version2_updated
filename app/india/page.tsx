import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { ArrowIcon } from "@/components/Icons";
import { BHARAT_SUMMIT_URL } from "@/lib/content";
import PeopleWheel from "@/components/PeopleWheel";
import JourneyScroll, { type JourneyStep } from "./JourneyScroll";

export const metadata: Metadata = {
  title: "India Initiative",
  description: "The India Initiative curates the Bharat Summit, enables inter-party exchange of best practice and builds a network of think tanks and progressive communications teams.",
};

// DRAFT COPY adapted from the client's note; client to approve wording.
const steps: JourneyStep[] = [
  { n: "01", t: "The Bharat Summit", d: "Curate Bharat Summit as an annual global event for all progressives to plan and work together", c: "s1" },
  { n: "02", t: "Sharing best practice", d: "Enable inter-party sharing of best-practices (media, social media, diaspora mobilization etc.)", c: "s2" },
  { n: "03", t: "Dialogue on the economy", d: "Facilitating dialogue with Indian governments and businesses on economic cooperation and investments (especially those that promote ecological, social, and economic justice)", c: "s3" },
  { n: "04", t: "A network that connects", d: "Establishing network of think-tanks, and all social media and communications departments of progressives parties.", c: "s4" },
];

export default function IndiaPage() {
  return (
    <Shell>
      <PageBanner
        variant="india"
      />

      <section className="sec">
        <div className="wrap">
          <div className="sec-head rv">
            <div>
              <div className="bars"><i /><i /><i /></div>
              <h2>India Initiative</h2>
              <p>From a flagship annual summit to a lasting network of think tanks and party teams.</p>
            </div>
          </div>
          <JourneyScroll steps={steps} ariaLabel="Four ways we work in India" />
        </div>
      </section>

      

<section className="sec people-section" style={{ paddingTop: 10 }}>
  <div className="wrap">
    <div className="rv">
      <div className="bars"><i /><i /><i /></div>
      <h2>Bringing People Together</h2>
      <p className="lead-in">
        A widening network of people and institutions advancing democracies that serve people and protect the planet.
      </p>
    </div>

    <PeopleWheel items={["Progressive parties", "Think tanks", "Governments", "Businesses", "Diaspora", "Communications teams"]} />
  </div>
</section>


<section className="sec" style={{ paddingTop: 10 }}>
  <div className="wrap">
    <div className="cta rv summit-cta">
      <div>
        <h2>The flagship: Bharat Summit</h2>
        <p>An annual global event for all progressives to plan and work together, in Hyderabad.</p>

<div className="summit-image">
        <img
          src="/assets/bharath_summit.jpeg"
          alt="Bharat Summit"
          loading="lazy"
          decoding="async"
        />
      </div>
      <p></p>
        <a
          className="btn btn-primary"
          href={BHARAT_SUMMIT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Bharat Summit website <ArrowIcon />
        </a>
      </div>
    </div>
  </div>
</section>









<style>{`
  .cta.summit-cta{display:grid;grid-template-columns:1fr;gap:28px;align-items:start}
  .summit-cta .summit-image{width:100%;max-width:none;max-height:auto;margin:0;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 60px rgba(11,27,68,.22);line-height:0}
  .summit-cta .summit-image img{display:block;width:100%;height:auto;object-fit:contain}
  .summit-cta .btn{display:flex;width:fit-content;margin:36px auto 0}
  .summit-cta > div:first-child{display:flex;flex-direction:column;align-items:center;text-align:center}
  @media (max-width: 800px){
    .summit-cta .summit-image{border-radius:16px}
    .summit-cta .btn{margin-top:30px}
  }
`}</style>

  </Shell>
  );
}