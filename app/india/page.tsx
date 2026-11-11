import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";
import { ArrowIcon } from "@/components/Icons";
import { BHARAT_SUMMIT_URL } from "@/lib/content";
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
  { n: "04", t: "A network that connects", d: "Establishing network of think-tanks, and all social media & communications departments of progressives parties.", c: "s4" },
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
              <h2>India Initiatives</h2>
              <p>From a flagship annual summit to a lasting network of think tanks and party teams.</p>
            </div>
          </div>
          <JourneyScroll steps={steps} ariaLabel="Four ways we work in India" />
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="rv">
            <div className="bars"><i /><i /><i /></div>
            <h2>Bringing People Together</h2>
            <p className="lead-in">A widening network of people and institutions advancing democracies that serve people and protect the planet.</p>
            <div className="pill-cloud" aria-label="Who we bring together">
              <span>Progressive parties</span><span>Think tanks</span><span>Governments</span><span>Businesses</span><span>Diaspora</span><span>Communications teams</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <div className="cta rv">
            <div>
              <h2>The flagship: Bharat Summit</h2>
              <p>An annual global event for all progressives to plan and work together, in Hyderabad.</p>
            </div>
            <a className="btn btn-primary" href={BHARAT_SUMMIT_URL} target="_blank" rel="noopener noreferrer">Visit Bharat Summit website <ArrowIcon /></a>
          </div>
        </div>
      </section>
    </Shell>
  );
}