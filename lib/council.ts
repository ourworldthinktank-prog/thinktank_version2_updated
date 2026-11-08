// Council data: 9 Leadership, 14 Executive, 2 Trustees.
// All entries are PLACEHOLDERS. Replace name, role, country, organisation, bio and photo
// only with written permission from each person.
// Photos: put a transparent PNG at public/council/<slug>.png and set photo: "/council/<slug>.png".

export type CouncilGroupId = "leadership" | "executive" | "trustees";

export interface Member {
  slug: string;
  group: CouncilGroupId;
  name: string;
  role: string;
  country: string;
  org: string;
  short: string;      // shown on hover
  long: string[];     // shown on the individual page
  photo?: string;
  initials: string;
  placeholder: boolean;
}

export const GROUPS: { id: CouncilGroupId; title: string; blurb: string; count: number; role: string }[] = [
  { id: "leadership", title: "Leadership", blurb: "Senior voices guiding the vision and direction of the Institute and the Initiative.", count: 9, role: "Designation" },
  { id: "executive", title: "Executive", blurb: "The team that runs programmes, research and partnerships day to day.", count: 14, role: "Role" },
  { id: "trustees", title: "Trustees", blurb: "Trustees who safeguard the mission, independence and good governance of the organisation.", count: 2, role: "Trustee" },
];

// Sample countries only, to show how the card looks. Replace with the real ones.
const COUNTRIES = ["India", "Portugal", "Brazil", "Malaysia", "Chile", "South Korea", "South Africa", "Finland", "Mexico", "Australia", "United States"];

const SHORT = "Short biography goes here. Two or three lines on this person's work, background and what they bring to the Institute and the Initiative.";
const LONG = [
  "Full biography goes here. This is a placeholder: it will be replaced with a short profile written or approved by the member.",
  "It can cover their field of work, the organisations they have led or served, key publications or campaigns, and their role in shaping the Institute and the Initiative.",
  "Names, photographs and biographies are published only with the written permission of each person.",
];

let n = 0;
function make(group: CouncilGroupId, count: number, role: string): Member[] {
  return Array.from({ length: count }, (_, i) => {
    const k = ++n;
    const num = String(i + 1).padStart(2, "0");
    return {
      slug: `${group}-${num}`,
      group,
      name: `Council Member ${num}`,
      role: `${role}, Organisation`,
      country: COUNTRIES[(k - 1) % COUNTRIES.length],
      org: "Organisation name",
      short: SHORT,
      long: LONG,
      initials: num,
      placeholder: true,
    };
  });
}

export const MEMBERS: Member[] = [
  {
    slug: "leadership-01",            // used in the page address and the photo file name
    group: "leadership",              // "leadership", "executive" or "trustees"
    name: "Salman Khurshid",
    role: "Senior Advocate; Indian National Congress; former Minister of External Affairs of India (2012-2014)",
    country: "India",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/1.png",
    initials: "JD",
    placeholder: false,               // removes the "placeholder profile" note on her page
  },
  // ...next person
];
export const byGroup = (g: CouncilGroupId) => MEMBERS.filter((m) => m.group === g);
export const findMember = (slug: string) => MEMBERS.find((m) => m.slug === slug);