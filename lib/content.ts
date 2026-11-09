// Typed content layer. Today it returns sample content; once Sanity is connected,
// replace each function body with a GROQ query. Components never change.

export type Tone = "a" | "b" | "c" | "d";

export interface ResearchItem {
  kind: string;
  title: string;
  href: string;
  tone: Tone;
}
export interface FeaturedReport {
  kind: string;
  title: string;
  summary: string;
  downloadHref: string;
}
export interface Insight {
  topic: string;
  topicColor: string;
  title: string;
  dateLabel: string;
  href: string;
  tone: Tone;
}
export interface FocusArea {
  title: string;
  href: string;
  icon: "democracy" | "climate" | "economy" | "digital";
  variant: "f1" | "f2" | "f3" | "f4";
}
export interface Person {
  name: string;
  role: string;
  initials: string;
  variant: "av1" | "av2" | "av3" | "av4" | "av5";
}
export interface EventItem {
  title: string;
  summary: string;
  dateLabel: string;
  status: string;
  location: string;
  href: string;
}
export interface Platform {
  id: "india" | "global";
  label: string;
  body: string;
  points: string[];
  href: string;
}

// Official Bharat Summit website. Set NEXT_PUBLIC_BHARAT_SUMMIT_URL in the environment.
export const BHARAT_SUMMIT_URL = process.env.NEXT_PUBLIC_BHARAT_SUMMIT_URL || "https://bharatsummit.co/";

export async function getFeaturedReport(): Promise<FeaturedReport> {
  return {
    kind: "Annual Report",
    title: "State of Global Progressivism",
    summary: "Trends, challenges and opportunities for a more equitable world.",
    downloadHref: "#",
  };
}

export async function getResearch(): Promise<ResearchItem[]> {
  return [
    { kind: "Policy Brief", title: "Sample Policy Brief Title", href: "#", tone: "a" },
    { kind: "Research Paper", title: "Sample Research Paper Title", href: "#", tone: "b" },
  ];
}

export async function getInsights(): Promise<Insight[]> {
  return [
    { topic: "Democracy", topicColor: "var(--navy)", title: "Sample Insight Headline on Democracy", dateLabel: "Date to be added", href: "#", tone: "d" },
    { topic: "Climate Justice", topicColor: "var(--teal)", title: "Sample Insight Headline on Climate", dateLabel: "Date to be added", href: "#", tone: "b" },
    { topic: "Digital Futures", topicColor: "var(--indigo)", title: "Sample Insight Headline on Technology", dateLabel: "Date to be added", href: "#", tone: "c" },
  ];
}

export async function getFocusAreas(): Promise<FocusArea[]> {
  return [
    { title: "Democracy & Governance", href: "#", icon: "democracy", variant: "f1" },
    { title: "Climate Justice", href: "#", icon: "climate", variant: "f2" },
    { title: "Economic Fairness", href: "#", icon: "economy", variant: "f3" },
    { title: "Digital Futures", href: "#", icon: "digital", variant: "f4" },
  ];
}

// Placeholders only. Do not publish real names or photos without written permission.
export async function getPeople(): Promise<Person[]> {
  return (["av1", "av2", "av3", "av4", "av5"] as const).map((variant) => ({
    name: "Name Surname",
    role: "Designation, Organisation",
    initials: "NS",
    variant,
  }));
}

export async function getNextEvent(): Promise<EventItem> {
  return {
    title: "Bharat Summit",
    summary: "An annual global event for all progressives to plan and work together.",
    dateLabel: "TBA",
    status: "Coming soon",
    location: "Hyderabad, India",
    href: BHARAT_SUMMIT_URL,
  };
}

export async function getPlatforms(): Promise<Platform[]> {
  return [
    {
      id: "india",
      label: "India Institute",
      body: "The India Institute brings progressives together around the annual summit, shares best practice between parties, and connects with governments and business on fair, sustainable growth.",
      points: [
        "Curating an annual global event for progressives",
        "Inter-party sharing of best practice",
        "A network of think tanks and communications teams",
      ],
      href: "#",
    },
    {
      id: "global",
      label: "Global Initiative",
      body: "The Global Initiative produces research and policy papers, supports think tanks in different nations, and builds cross-border partnerships for a fairer world.",
      points: [
        "Annual State of Global Progressivism report",
        "Policy briefs, papers and thematic conferences",
        "Ties with civil society, movements and unions",
      ],
      href: "#",
    },
  ];
}

/* ---------- Council (placeholders: add real names only with written permission) ---------- */
export interface CouncilMember { name: string; role: string; initials: string; photo?: string; alt?: string }
export interface CouncilGroup { id: "leadership" | "executive" | "trustees"; title: string; blurb: string; members: CouncilMember[] }

const ph = (n: number, role: string): CouncilMember[] =>
  Array.from({ length: n }, () => ({ name: "Name Surname", role, initials: "NS" }));

export async function getCouncil(): Promise<CouncilGroup[]> {
  return [
    { id: "leadership", title: "Leadership", blurb: "Senior voices guiding the vision and direction of the Institute and the Initiative.", members: ph(6, "Designation, Organisation") },
    { id: "executive", title: "Executive", blurb: "The team that runs programmes, research and partnerships day to day.", members: ph(6, "Role, Department") },
    { id: "trustees", title: "Trustees", blurb: "Trustees who safeguard the mission, independence and good governance of the organisation.", members: ph(4, "Trustee") },
  ];
}

/* ---------- Events (SAMPLE showcase: replace with real events) ---------- */
export interface ShowcaseEvent {
  title: string; kind: string; dateLabel: string; place: string; blurb: string;
  tone: "india" | "global" | "climate" | "digital"; href?: string; external?: boolean; sample?: boolean;
}

export async function getEvents(): Promise<ShowcaseEvent[]> {
  return [
    { title: "Bharat Summit", kind: "Flagship annual summit", dateLabel: "Dates to be announced", place: "Hyderabad, India", blurb: "An annual global event for all progressives to plan and work together.", tone: "india", href: BHARAT_SUMMIT_URL, external: true },
    { title: "Climate Justice Conference", kind: "Thematic conference", dateLabel: "Date to be announced", place: "Venue to be announced", blurb: "A thematic conference hosted with partner think tanks on climate justice and a fair transition.", tone: "climate", sample: true },
    { title: "Digital Democracy Working Group", kind: "Working group", dateLabel: "Date to be announced", place: "Online and in person", blurb: "A working group on technology, rights and the future of democratic participation.", tone: "digital", sample: true },
    { title: "State of Global Progressivism Launch", kind: "Report launch", dateLabel: "Date to be announced", place: "Venue to be announced", blurb: "The launch of the annual report, with findings, discussion and policy takeaways.", tone: "global", sample: true },
    { title: "Think-Tank Network Roundtable", kind: "Roundtable", dateLabel: "Date to be announced", place: "Venue to be announced", blurb: "A closed-door roundtable connecting think tanks, civil society and academics.", tone: "global", sample: true },
    { title: "Communications Lab", kind: "Workshop", dateLabel: "Date to be announced", place: "Online", blurb: "A hands-on workshop on media and social media practice for progressive teams.", tone: "digital", sample: true },
  ];
}
