import type { Person } from "@/lib/content";
import { ArrowIcon } from "./Icons";

// Leadership Council banner: two rows of cards scrolling in opposite directions, with a drifting outline title behind.
// Placeholder people only. Do not show real names or photos without written permission.
function Row({ people, dir }: { people: Person[]; dir: "l" | "r" }) {
  // each row holds the list twice so the loop is seamless; the second copy is hidden from screen readers
  return (
    <div className={`cb-row ${dir}`}>
      <div className="cb-track">
        {[0, 1].map((copy) => (
          <div className="cb-set" key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
            {people.map((p, i) => (
              <div className="cb-card" key={`${copy}-${i}`}>
                <div className={`cb-av ${p.variant}`}><span>{p.initials}</span></div>
                <div><b>{p.name}</b><small>{p.role}</small></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CouncilBanner({ people }: { people: Person[] }) {
  // 8 cards per row; second row starts at a different colour so the rows never look identical
  const base = Array.from({ length: 8 }, (_, i) => people[i % people.length]);
  const row2 = [...base.slice(3), ...base.slice(0, 3)];
  return (
    <section className="cb" id="people">
      <div className="cb-bg" aria-hidden="true"><i /><i /></div>
      <div className="cb-outline" aria-hidden="true">
        <div className="cb-otrack">{[0, 1].map((k) => <span key={k}>LEADERSHIP COUNCIL · LEADERSHIP COUNCIL · </span>)}</div>
      </div>
      <div className="wrap cb-head" data-r>
        <div className="bars"><i /><i /><i /></div>
        <h2>Leadership Council</h2>
        <p className="cb-tag">Leaders and thinkers guiding the Institute and the Initiative.</p>
        <a className="link" href="/council">Meet the council <ArrowIcon size={16} /></a>
      </div>
      <div className="cb-rows" data-r>
        <Row people={base} dir="l" />
        <Row people={row2} dir="r" />
      </div>
      <p className="wrap cb-note">Council members will be announced soon. Cards are layout placeholders only.</p>
    </section>
  );
}
