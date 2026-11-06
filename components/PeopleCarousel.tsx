"use client";

import { useRef } from "react";
import type { Person } from "@/lib/content";
import { ArrowIcon } from "./Icons";

export default function PeopleCarousel({ people }: { people: Person[] }) {
  const row = useRef<HTMLDivElement>(null);
  const scroll = (dx: number) => row.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <section className="sec" id="people" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <div className="bars"><i /><i /><i /></div>
            <h2>Leadership Council</h2>
          </div>
          <div className="arrows">
            <button type="button" aria-label="Previous" onClick={() => scroll(-280)}><ArrowIcon style={{ transform: "rotate(180deg)" }} /></button>
            <button type="button" aria-label="Next" onClick={() => scroll(280)}><ArrowIcon /></button>
          </div>
        </div>
        <p className="note rv">Council members will be announced soon. Cards below are layout placeholders only.</p>
        <div className="people-wrap rv">
          <div className="people" ref={row} tabIndex={0} aria-label="Leadership council carousel">
            {people.map((p, i) => (
              <div className="person" key={i}>
                <div className={`avatar ${p.variant}`}><span>{p.initials}</span></div>
                <div className="meta"><b>{p.name}</b><small>{p.role}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
