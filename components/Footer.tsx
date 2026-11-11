import Link from "next/link";
import FooterFX from "./FooterFX";
import ScrollTop from "./Scrolltop";
import "./footer.css";

/* ---- Things you may want to change ---- */
const LOGO_SRC = "/assets/logo1.png";   // white logo for the navy footer (file in /public/assets)
const EMAIL = "ourworld.thinktank@gmail.com";
const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Advisory Board", href: "/council" },
];
const WORK = [
  { label: "India Initiative", href: "/india" },
  { label: "Global Initiative", href: "/global" },
  { label: "Events", href: "/events" },
];

export default function Footer() {
  return (
    <footer className="ft2" id="footer">
      <FooterFX />
      <div className="ft2-body">
        <div className="ft2-grid">
          <div className="ft2-brand">
            <Link className="ft2-logo" href="/" aria-label="Our World Institute and Initiative, home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_SRC} alt="Our World Institute and Initiative" width={200} height={159} />
            </Link>
            <p className="ft2-tag"><span>Ideas<b>.</b></span> <span>Dialogue<b>.</b></span> <span>Global Impact<b>.</b></span></p>
          </div>

          <div className="ft2-col" role="navigation" aria-labelledby="ft2-h-explore">
            <h2 className="ft2-h" id="ft2-h-explore">Explore</h2>
            <ul className="ft2-list">{EXPLORE.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>

          <div className="ft2-col" role="navigation" aria-labelledby="ft2-h-work">
            <h2 className="ft2-h" id="ft2-h-work">Our Work</h2>
            <ul className="ft2-list">{WORK.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>

          <div className="ft2-col ft2-mail ft2-mail-col">
            <h2 className="ft2-h">Connect</h2>
            <ul className="ft2-list"><li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li></ul>
          </div>
        </div>
        <div className="ft2-copy"><p>© {new Date().getFullYear()} Our World Institute and Initiative</p></div>
      </div>
      <ScrollTop />
    </footer>
  );
}