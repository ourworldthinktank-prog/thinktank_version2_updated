"use client";

import { useEffect } from "react";

// Adds the scroll-reveal behaviour to every element with class "rv".
export default function Reveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    nodes.forEach((n, i) => {
      n.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(n);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
