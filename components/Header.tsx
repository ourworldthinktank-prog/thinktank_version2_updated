"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { MenuIcon } from "./Icons";

// Order: Home, About, India Initiative, Global Initiative, Council, Events, Connect (jumps to the footer)
const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/india", label: "India Initiative" },
  { href: "/global", label: "Global Initiative", globe: false },
  { href: "/council", label: "Council" },
  { href: "/events", label: "Events" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!navRef.current?.contains(t) && !burgerRef.current?.contains(t)) setOpen(false);
    };
    const onResize = () => window.innerWidth > 980 && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Logo />
        <nav id="menu" aria-label="Main" ref={navRef} className={open ? "open" : ""} onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          <ul>
            {links.map((l) => (
              <li key={l.label}>
                <a className="nl" href={l.href}>
                  {l.globe}
                  {l.label}
                </a>
              </li>
            ))}
            <li className="connect-li">
              <a className="btn btn-primary btn-sm connect-btn" href="#connect">Connect</a>
            </li>
          </ul>
        </nav>
        <button
          ref={burgerRef}
          className="icon-btn burger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
