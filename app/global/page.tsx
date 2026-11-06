import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Shell from "@/components/Shell";
import PageBanner from "@/components/PageBanner";

export const metadata: Metadata = {
  title: "Global Initiative",
  description: "The Global Initiative produces research and policy papers, supports thematic conferences and builds a progressive digital media network.",
};

type Stream = { id: string; kicker: string; title: string; items: string[] };

// DRAFT COPY adapted from the client's note; client to approve wording.
const streams: Stream[] = [
  {
    id: "research", kicker: "Ideas", title: "Research, advocacy and publications",
    items: [
      "An annual State of Global Progressivism report",
      "Policy briefs and papers for progressive policy-makers, with think tanks able to opt in to work jointly",
      "Literature on key issues to reimagine socio-economic and (geo)political paradigms",
    ],
  },
  {
    id: "conferences", kicker: "Gatherings", title: "Conferences and workshops",
    items: [
      "Supporting think tanks to curate thematic conferences and working groups in different nations, on themes such as climate justice and digital democracy",
      "Building ties with think tanks, civil society, movements and unions to bring grassroots issues to progressive leaders",
      "Dialogue with academics on policy research",
    ],
  },
  {
    id: "media", kicker: "Voice", title: "Communications and digital media",
    items: [
      "A progressive global broadcasting channel focused on social and digital media",
      "A global federated network of smaller channels",
    ],
  },
];

const words = ["Research", "Advocacy", "Publications", "Conferences", "Think tanks", "Civil society", "Unions", "Academics", "Digital media"];

/* Letter-by-letter split. Each letter reveals on scroll (pure CSS, no client JS). */
function Split({ text }: { text: string }) {
  let n = 0;
  return (
    <span aria-hidden="true">
      {text.split(" ").map((w, wi) => (
        <span className="gi-w" key={wi}>
          {[...w].map((c, ci) => (
            <span className="gi-l" style={{ "--i": n++ } as CSSProperties} key={ci}>{c}</span>
          ))}
          {"\u00A0"}
        </span>
      ))}
    </span>
  );
}

/* Scoped styles for this section only. Cards are scroll-sensitive (CSS scroll-driven animation);
   popups use the native HTML popover API, so no client JavaScript is needed.
   Unsupported browsers show everything inline, and reduced-motion is respected. */
const css = `
.gi{position:relative;overflow:hidden;padding:12vh 6vw 14vh;background:radial-gradient(800px 420px at 90% 0%,rgba(138,59,216,.32),transparent 60%),radial-gradient(700px 420px at 0% 100%,rgba(31,193,222,.2),transparent 60%),#060d24;color:#fff;font-family:inherit}
.gi-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap;margin-bottom:48px}
.gi-lab{letter-spacing:.25em;text-transform:uppercase;font-size:.8rem;color:#1FC1DE;font-weight:600}
.gi-h{margin:16px 0 0;font-size:clamp(2.4rem,6.5vw,5.5rem);line-height:.98;font-weight:500;color:#fff}
.gi-w{display:inline-block;overflow:hidden;vertical-align:top;white-space:nowrap;padding-bottom:.14em}
.gi-l{display:inline-block;animation:gi-up linear both;animation-timeline:view();animation-range:entry calc(var(--i)*1.5%) entry calc(45% + var(--i)*1.5%)}
@keyframes gi-up{from{transform:translateY(112%) rotate(6deg)}to{transform:none}}
.gi-sub{max-width:360px;margin:0;font-size:1.1rem;line-height:1.55;opacity:.85}
.gi-s1{--ac:#1FC1DE;--bg:linear-gradient(135deg,#0F2A5C,#2b1760)}
.gi-s2{--ac:#7fe6d6;--bg:linear-gradient(135deg,#0c6b66,#0F2A5C)}
.gi-s3{--ac:#d2b3ff;--bg:linear-gradient(135deg,#2b1760,#5a2bb5)}
.gi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.gi-card{--r:0deg;position:relative;overflow:hidden;min-height:50vh;padding:28px;border:0;border-radius:28px;background:var(--bg);color:#fff;font:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;transition:translate .45s cubic-bezier(.2,.8,.2,1),box-shadow .45s;animation:gi-card linear both;animation-timeline:view();animation-range:entry 0% cover 35%}
.gi-card:nth-child(1){--r:-5deg}.gi-card:nth-child(3){--r:5deg}.gi-card:nth-child(2){margin-top:5vh}
@keyframes gi-card{from{opacity:0;transform:translateY(16vh) rotate(var(--r)) scale(.9)}to{opacity:1;transform:none}}
.gi-card:before{content:"";position:absolute;left:-20%;top:105%;width:140%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.12);transition:top .7s cubic-bezier(.2,.8,.2,1)}
.gi-card:hover,.gi-card:focus-visible{translate:0 -10px;box-shadow:0 24px 60px rgba(0,0,0,.45)}.gi-card:hover:before,.gi-card:focus-visible:before{top:30%}
.gi-card>*{position:relative}
.gi-cn{font-size:clamp(5rem,11vw,8.5rem);font-weight:200;line-height:.8;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.4);transition:color .4s}.gi-card:hover .gi-cn{color:rgba(255,255,255,.14)}
.gi-ck{color:var(--ac);letter-spacing:.22em;text-transform:uppercase;font-size:.75rem;font-weight:600}
.gi-ct{margin:8px 0 22px;font-size:clamp(1.4rem,2.3vw,2rem);line-height:1.12;font-weight:500}
.gi-go{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;opacity:.9}
.gi-plus{width:46px;height:46px;border:1px solid rgba(255,255,255,.55);border-radius:50%;display:grid;place-items:center;font-size:1.5rem;letter-spacing:0;transition:transform .5s,background .3s,color .3s}.gi-card:hover .gi-plus{transform:rotate(135deg);background:#fff;color:#0F2A5C}
.gi-pop{position:fixed;inset:0;margin:auto;width:min(92vw,860px);max-height:86vh;overflow:auto;border:0;border-radius:28px;padding:clamp(28px,5vw,60px);background:var(--bg);color:#fff;font-family:inherit}
.gi-pop::backdrop{background:rgba(6,13,36,.78);backdrop-filter:blur(8px)}
.gi-pop:popover-open{animation:gi-pp .55s cubic-bezier(.2,.8,.2,1) both}.gi-pop:popover-open::backdrop{animation:gi-bd .4s both}
@keyframes gi-pp{from{opacity:0;transform:translateY(60px) scale(.94)}}@keyframes gi-bd{from{opacity:0}}
body:has(.gi-pop:popover-open){overflow:hidden}
.gi-pk{color:var(--ac);letter-spacing:.22em;text-transform:uppercase;font-size:.78rem;font-weight:600}
.gi-pt{margin:12px 0 0;font-size:clamp(1.8rem,4.2vw,3.2rem);line-height:1.05;font-weight:500;padding-right:50px}
.gi-ul{list-style:none;counter-reset:gi;margin:34px 0 0;padding:0}
.gi-it{counter-increment:gi;position:relative;padding:22px 0 22px 58px;font-size:clamp(1.05rem,1.8vw,1.35rem);line-height:1.45;border-top:1px solid rgba(255,255,255,.22)}
.gi-it:before{content:counter(gi,decimal-leading-zero);position:absolute;left:0;top:25px;font-size:.85rem;letter-spacing:.15em;color:var(--ac)}
.gi-pop:popover-open .gi-it{animation:gi-pi .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--k)*110ms + .25s)}
@keyframes gi-pi{from{opacity:0;transform:translateX(-40px)}}
.gi-x{position:absolute;top:18px;right:18px;width:44px;height:44px;border:1px solid rgba(255,255,255,.55);border-radius:50%;background:none;color:#fff;font-size:1.3rem;cursor:pointer;transition:transform .4s,background .3s,color .3s}.gi-x:hover{transform:rotate(90deg);background:#fff;color:#0F2A5C}
@media (max-width:800px){.gi-grid{grid-template-columns:1fr}.gi-card{min-height:34vh}.gi-card:nth-child(2){margin-top:0}}
@supports not selector(:popover-open){.gi-pop{position:static;width:auto;max-height:none;margin:16px 0 0;display:block}.gi-x,.gi-plus{display:none}}
@supports not (animation-timeline:view()){.gi-l,.gi-card{animation:none!important}}
@media (prefers-reduced-motion:reduce){.gi *,.gi-pop{animation:none!important;transition:none!important}}
`;

export default function GlobalPage() {
  return (
    <Shell>
      <PageBanner
        variant="global"
      />
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...words, ...words].map((w, i) => <span key={i}>{w}</span>)}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: css }} />
      <section className="gi" aria-labelledby="gi-title">
        <div className="gi-hd">
          <div>
            <div className="gi-lab">Global Initiative</div>
            <h2 className="gi-h" id="gi-title" aria-label="What the Initiative does">
              <Split text="What the Initiative does" />
            </h2>
          </div>
          <p className="gi-sub">Three streams, one purpose. Select a stream to open it.</p>
        </div>

        <div className="gi-grid">
          {streams.map((s, i) => (
            <button
              type="button"
              className={`gi-card gi-s${i + 1}`}
              key={s.id}
              {...({ popoverTarget: `gi-p-${s.id}` } as Record<string, string>)}
            >
              <div className="gi-cn" aria-hidden="true">0{i + 1}</div>
              <div>
                <div className="gi-ck">{s.kicker}</div>
                <div className="gi-ct">{s.title}</div>
                <div className="gi-go"><span>{s.items.length} activities</span><span className="gi-plus" aria-hidden="true">+</span></div>
              </div>
            </button>
          ))}
        </div>

        {streams.map((s, i) => (
          <div
            id={`gi-p-${s.id}`}
            className={`gi-pop gi-s${i + 1}`}
            key={s.id}
            {...({ popover: "auto" } as Record<string, string>)}
          >
            <button
              type="button"
              className="gi-x"
              aria-label="Close"
              {...({ popoverTarget: `gi-p-${s.id}`, popoverTargetAction: "hide" } as Record<string, string>)}
            >×</button>
            <div className="gi-pk">Stream 0{i + 1} / 03 · {s.kicker}</div>
            <h3 className="gi-pt">{s.title}</h3>
            <ul className="gi-ul">
              {s.items.map((it, k) => (
                <li className="gi-it" style={{ "--k": k } as CSSProperties} key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Shell>
  );
}