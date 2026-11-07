import Logo from "./Logo";
import { BHARAT_SUMMIT_URL } from "@/lib/content";

// "Connect" in the header jumps here (id="connect"): every page link, the legal pages and the newsletter.
export default function Footer() {
  return (
    <footer id="connect">
      <div className="foot-glow" aria-hidden="true" />
      <div className="wrap">
        <div className="foot">
          <div>
            <Logo footer />
            <p>Research, advocacy and global collaboration for a fairer world.</p>
            <div className="social">
              <a href="#" aria-label="X"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l8-9L3 3h6l4 5z" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9h4v11H4zM6 3a2 2 0 110 4 2 2 0 010-4zM10 9h4v2c.8-1.4 2.2-2.3 4-2.3 3 0 4 2 4 5V20h-4v-5.5c0-1.4-.5-2.3-1.8-2.3S14 13.2 14 14.5V20h-4z" /></svg></a>
              <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8s-.2-1.7-.9-2.4c-.9-.9-1.9-.9-2.3-1C15.6 4.4 12 4.4 12 4.4s-3.6 0-6.8.2c-.4.1-1.4.1-2.3 1C2.2 6.3 2 8 2 8s-.2 1.9-.2 3.8v1.8C1.8 15.5 2 17.3 2 17.3s.2 1.7.9 2.4c.9.9 2 .9 2.5 1 1.8.2 6.6.2 6.6.2s3.6 0 6.8-.2c.4-.1 1.4-.1 2.3-1 .7-.7.9-2.4.9-2.4s.2-1.9.2-3.8v-1.8C22.2 9.9 22 8 22 8zM10 15V9l5.2 3z" /></svg></a>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/india">India Initiative</a></li>
              <li><a href="/global">Global Initiative</a></li>
              <li><a href="/council">Advisory Board</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href={BHARAT_SUMMIT_URL} target="_blank" rel="noopener noreferrer">Bharat Summit</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="/copyright">Copyright</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>ourworld.thinktank@gmail.com</p>
          </div>
        </div>
        <svg className="skyline" viewBox="0 0 1200 70" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="#9FB0DA" strokeWidth="1.5"><path d="M0 70V50h80V36h30V50h90V28a22 22 0 0144 0v22h120V40h50V22l20-14 20 14v18h50v30M520 70V44h60V30a20 20 0 0140 0v14h70V70M760 70V46h80V26l24-16 24 16v20h90V34h40v36M1090 70V48h110" /></g>
        </svg>
        <div className="legal">
          <span>© 2026 Our-World Institute &amp; Initiative. All rights reserved.</span>
          <div>
            <a href="/copyright">Copyright</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
