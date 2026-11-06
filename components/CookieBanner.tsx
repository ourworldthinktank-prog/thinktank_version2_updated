"use client";

import { useEffect, useState } from "react";

const KEY = "owii-cookie";

// Analytics must only be loaded after the visitor accepts. Listen for the
// "owii:consent" event (detail: "yes" | "no") where analytics gets wired in.
export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch {}
    if (!saved) setShow(true);
  }, []);

  function choose(c: "yes" | "no") {
    try { localStorage.setItem(KEY, c); } catch {}
    window.dispatchEvent(new CustomEvent("owii:consent", { detail: c }));
    setShow(false);
  }

  if (!show) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Cookie consent">
      <span>We use essential cookies to run this site. Analytics cookies load only if you accept. See our <a href="#" style={{ textDecoration: "underline", color: "var(--navy)" }}>Cookie Policy</a>.</span>
      <div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose("no")}>Reject</button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => choose("yes")}>Accept</button>
      </div>
    </div>
  );
}
