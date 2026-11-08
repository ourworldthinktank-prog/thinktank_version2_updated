import { readdir } from "node:fs/promises";
import path from "node:path";
import { ArrowIcon } from "./Icons";
import FooterMarquee, { type FooterLogo } from "./FooterMarquee";
import ScrollTop from "./Scrolltop";

/* ---- Things you may want to change ---- */
const LOGO_SRC = "/assets/logo.png";                // path (in /public) of the Our World logo
const CONNECT_HREF = "/contact";             // where "Connect to us" goes
const LINKS = [                              // make these match your header links
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "India Initiative", href: "/india" },
  { label: "Global Initiative", href: "/global" },
  { label: "Advisory Board", href: "/advisory-board" },
  { label: "Events", href: "/events" },
];
// The moving logos are read from public/assets/footer automatically.
// If they don't show up on your host, list the file names here instead, e.g. ["unesco.svg", "undp.svg"].
const FOOTER_LOGOS: string[] = [];

const pretty = (file: string) => file.replace(/\.png$/i, "").replace(/[-_]+/g, " ").trim();
const toLogo = (file: string): FooterLogo => ({ src: `/assets/footer/${encodeURIComponent(file)}`, alt: pretty(file) });

async function loadLogos(): Promise<FooterLogo[]> {
  if (FOOTER_LOGOS.length) return FOOTER_LOGOS.map(toLogo);
  try {
    const dir = path.join(process.cwd(), "public", "assets", "footer");
    const files = (await readdir(dir)).filter((f) => /\.png$/i.test(f)).sort();
    return files.map(toLogo);
  } catch {
    return [];
  }
}

const css = `
/* Light footer in the style of the Bharat Summit site: logo and links on the left, connect on the right,
   a skyline of monuments along the bottom, and a thin bar underneath. */
footer.ft,.home-dark footer.ft{position:relative;overflow:hidden;background:linear-gradient(180deg,#fff 0%,#F6F7FB 100%);color:#0F1B4D;margin-top:0}
.ft-top{width:min(1160px,calc(100% - 48px));margin:0 auto;padding:0px 0 106px;display:flex;justify-content:space-between;align-items:flex-start;gap:40px;flex-wrap:wrap;position:relative;z-index:2}
.ft-left{flex:1 1 520px;max-width:620px;display:grid;gap:24px;justify-items:start}
.ft-logo{display:inline-block}
.ft-logo img{display:block;height:68px;width:auto}
.ft-nav{width:100%;border-top:1px solid rgba(15,27,77,.55);padding-top:14px}
.ft-links{display:flex;flex-wrap:wrap;gap:6px 30px;list-style:none;margin:0;padding:0}
.ft .ft-links a{position:relative;display:inline-block;padding:4px 0 14px;color:#0F1B4D;font-weight:500;font-size:1rem;transition:color .25s}
.ft .ft-links a::after{content:"";position:absolute;left:0;bottom:0;width:20px;height:4px;border-radius:2px;background:var(--c,#F26B3A);transition:width .35s cubic-bezier(.2,.8,.2,1)}
.ft .ft-links li:nth-child(3n+1) a{--c:#F26B3A}
.ft .ft-links li:nth-child(3n+2) a{--c:#1E9C8C}
.ft .ft-links li:nth-child(3n) a{--c:#F5A12A}
.ft .ft-links a:hover::after{width:100%}
.ft-right{display:grid;gap:18px;justify-items:start;min-width:220px}
.ft .ft-h{margin:0;font-size:1.15rem;font-weight:700;color:#0F1B4D}
.ft .ft-btn{display:inline-flex;align-items:center;gap:10px;padding:15px 26px;border-radius:999px;font-weight:700;font-size:.98rem;color:#fff;background:linear-gradient(135deg,#F7A21B 0%,#F26B3A 48%,#FF5C8A 100%);box-shadow:0 12px 30px rgba(255,92,138,.35);transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s,filter .3s}
.ft .ft-btn *{color:#fff}
.ft .ft-btn:hover{transform:translateY(-3px);box-shadow:0 18px 38px rgba(255,92,138,.45);filter:brightness(1.06)}
.ft-btn svg{transition:transform .3s}
.ft-btn:hover svg{transform:translateX(4px)}

/* skyline: soft mountains and a warm glow behind moving monuments. The monuments stand on the line of the bar below. */
.ft-sky{position:relative;height:clamp(120px,14vw,170px)}
.ft-glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(60% 75% at 50% 100%,rgba(245,161,42,.18),transparent 70%)}
.ft-mtn{position:absolute;left:0;right:0;bottom:0;width:100%;height:78%;pointer-events:none}
.ft-mtn path{fill:rgba(110,150,215,.15)}
.ft-mtn path.b{fill:rgba(110,150,215,.2)}
.ft-sky .ft-view{position:absolute;inset:0;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.ft-sky .ft-track{display:flex;width:max-content;height:100%;will-change:transform}
.ft-sky .ft-half{display:flex;align-items:flex-end;gap:clamp(20px,2.6vw,40px);padding-right:clamp(20px,2.6vw,40px);height:100%}
.ft-sky .ft-lg{flex:none;display:block;height:100%}
.ft-sky .ft-lg:nth-child(4n+1){height:100%}
.ft-sky .ft-lg:nth-child(4n+2){height:84%}
.ft-sky .ft-lg:nth-child(4n+3){height:94%}
.ft-sky .ft-lg:nth-child(4n){height:76%}
.ft-sky .ft-lg img{display:block;height:100%;width:auto;max-width:200px;object-fit:contain;object-position:bottom;filter:grayscale(1);opacity:.8;transform-origin:50% 100%;transition:filter .35s ease,opacity .35s ease,transform .45s cubic-bezier(.2,.8,.2,1)}
.ft-sky .ft-lg:hover img{filter:grayscale(0);opacity:1;transform:scale(1.07)}

/* bottom bar */
.ft-bar{border-top:2px solid #0F1B4D;background:#fff}
.ft-bar-in{width:min(1160px,calc(100% - 48px));margin:0 auto;padding:18px 0;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.ft .ft-copy{margin:0;font-size:.82rem;color:#0F1B4D}
.ft-tag{display:flex;align-items:center;gap:14px;padding-right:76px}
.ft-tag i{display:inline-block;width:30px;height:4px;background:#F26B3A}
.ft-tag i:nth-child(2){background:#F5A12A}
.ft-tag i:nth-child(3){background:#1E9C8C}
.ft .ft-tag span{font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;color:#0F1B4D}

@media (max-width:760px){

  /* Main footer spacing */
  footer.ft .ft-top{
    width:calc(100% - 40px);
    padding:36px 0 24px;
    gap:28px;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
  }

  /* Logo section */
  footer.ft .ft-left{
    width:100%;
    max-width:100%;
    flex:none;
    display:grid;
    gap:18px;
    justify-items:start;
  }

  footer.ft .ft-logo{
    display:block;
    width:auto;
    margin:0;
    padding:0;
  }

  footer.ft .ft-logo img{
    display:block;
    height:68px;
    width:auto;
    max-width:100%;
    object-fit:contain;
  }

  /* FIX: Remove the unwanted horizontal line */
  footer.ft .ft-nav{
    width:100%;
    border-top:none !important;
    padding-top:0 !important;
    margin-top:0;
  }

  /* Navigation links */
  footer.ft .ft-links{
    display:flex;
    flex-wrap:wrap;
    gap:8px 20px;
    margin:0;
    padding:0;
  }

  footer.ft .ft-links a{
    font-size:14px;
    padding:4px 0 10px;
  }

  
  /* FORCE FOOTER NAVIGATION TO SHOW ON MOBILE */
  footer.ft .ft-left {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    width: 100% !important;
  }

  footer.ft .ft-nav {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }

  footer.ft .ft-links {
    display: flex !important;
    visibility: visible !important;
    opacity: 1 !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;
    gap: 12px 22px !important;
    list-style: none !important;
    padding: 10px 0 !important;
    margin: 0 !important;
  }

  footer.ft .ft-links li {
    display: block !important;
    visibility: visible !important;
  }

  footer.ft .ft-links a {
    display: inline-block !important;
    color: #0F1B4D !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* Connect section */
  footer.ft .ft-right{
    width:100%;
    min-width:0;
    gap:12px;
    justify-items:start;
  }

  footer.ft .ft-h{
    font-size:20px;
  }

  footer.ft .ft-right p{
    margin:0;
    font-size:15px;
    overflow-wrap:anywhere;
  }

  footer.ft .ft-btn{
    width:100%;
    justify-content:center;
  }

  /* Monument skyline */
  footer.ft .ft-sky{
    height:120px;
  }

  /* Copyright section */
  footer.ft .ft-bar-in{
    width:calc(100% - 40px);
    padding:18px 0;
    gap:16px;
    flex-direction:column;
    align-items:flex-start;
  }

  footer.ft .ft-copy{
    font-size:14px;
    line-height:1.6;
  }

  /* Footer slogan */
  footer.ft .ft-tag{
    padding-right:0;gap:10px;flex-wrap:wrap;
  }
footer.ft .ft-tag span{font-size:11px;letter-spacing:.15em;}
}
@media (prefers-reduced-motion:reduce){
  .ft-lg img,.ft-btn,.ft-btn svg{transition:none!important}
}
`;

export default async function Footer() {
  const logos = await loadLogos();
  return (
    <footer className="ft">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="ft-top">
        <div className="ft-left">
          <a className="ft-logo" href="/" aria-label="Our World Institute and Initiative, home">
            <img src={LOGO_SRC} alt="Our World Institute and Initiative" />
          </a>
          <nav className="ft-nav" aria-label="Footer">
            <ul className="ft-links">
              {LINKS.map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="ft-right">
          <h4 className="ft-h">Connect</h4>
          <p> ourworld.thinktank@gmail.com</p>
        </div>
      </div>

      {/* skyline of monuments, drifting left to right */}
      <div className="ft-sky" aria-label="Monuments">
        <div className="ft-glow" aria-hidden="true" />
        <svg className="ft-mtn" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 200V150L90 110L170 140L270 80L360 130L470 70L580 135L690 95L790 140L900 85L1010 130L1120 75L1230 125L1340 95L1440 130V200Z" />
          <path className="b" d="M0 200V170L120 140L220 165L340 120L450 160L560 135L680 170L800 130L930 165L1050 140L1170 168L1290 135L1440 165V200Z" />
        </svg>
        <FooterMarquee logos={logos} />
      </div>

      <div className="ft-bar">
        <div className="ft-bar-in">
          <p className="ft-copy">© {new Date().getFullYear()} Our-World Institute &amp; Initiative</p>
          <div className="ft-tag" aria-hidden="true"><i /><i /><i /><span>A fairer tomorrow</span></div>
        </div>
      </div>

      <ScrollTop />
    </footer>
  );
}