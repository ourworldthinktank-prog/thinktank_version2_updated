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
    // LEADERSHIP COUNCIL
  {
    slug: "Salman_Khurshid",            // used in the page address and the photo file name
    group: "leadership",              // "leadership", "executive" or "trustees"
    name: "Salman Khurshid",
    role: "Senior Advocate; Indian National Congres, Former Minister of External Affairs of India (2012-2014)",
    country: "India",
    org: "",
    short: "Salman Khurshid held cabinet positions including Law and Justice Minister, Minority Affairs Minister, Corporate Affairs Minister, and for External Affairs",
    long: [
      "Salman Khurshid held cabinet positions including Law and Justice Minister, Minority Affairs Minister, Corporate Affairs Minister, and for External Affairs",
      "Khurshid is a prolific author and senior Counsel at the Supreme Court. He was also the President of the Delhi Public School Society and Dr. Zakir Husain Study Circle. He is currently a Member of the Congress Working Committee and Chairperson of the Foreign Affairs Department.",
    ],
    photo: "/assets/1.png",
    initials: "JD",
    placeholder: false,               // removes the "placeholder profile" note on her page
  },
  {
    slug: "Dr_Maria",            // used in the page address and the photo file name
    group: "leadership",              // "leadership", "executive" or "trustees"
    name: "Dr. Maria Joao Rodrigues",
    role: "President, Foundation for European Progressive Studies (FEPS), ",
    country: "Portugal",
    org: "",
    short: "Maria João Rodrigues is a Portuguese academic and politician, former President of the Foundation for European Progressive Studies (FEPS) in Brussels. ",
    long: [
      "Maria João Rodrigues is a Portuguese academic and politician, former President of the Foundation for European Progressive Studies (FEPS) in Brussels.",
      "She was Minister of Employment under Prime Minister António Guterres and later Vice-President of the S&D Group in the European Parliament. Her career spans major EU institutions,contributing to the Lisbon Treaty, Eurozone reform, the European Pillar of Social Rights, and the EU's strategic partnerships. ",
      "She is also a member of the Club of Rome and chairs the Board of Reimagine Europa. In academia, she has taught European economic policies at the Lisbon University Institute and Université Libre de Bruxelles and authored over one hundred publications.",
    ],
    photo: "/assets/maria.webp",
    initials: "JD",
    placeholder: false,               // removes the "placeholder profile" note on her page
  },
  {
    slug: "Anies_Baswedan",
    group: "leadership",
    name: "Anies Baswedan",
    role: "Former Governor of Jakarta, ",
    country: "Indonesia",
    org: "",
    short: "Anies Rasyid Baswedan served as Governor of Jakarta from 2017 to 2022 and as Indonesia's Minister of Education and Culture from 2014 to 2016. ",
    long: [
      "Anies Rasyid Baswedan served as Governor of Jakarta from 2017 to 2022 and as Indonesia's Minister of Education and Culture from 2014 to 2016. ",
      "Before entering government, he was Rector of Paramadina University and founded the Indonesia Mengajar program, which sends young teachers to remote areas across the country.",
      " In 2024, he ran for President of Indonesia backed by the Coalition of Change for Unity.",
    ],
    photo: "/assets/anies.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Patrick_Gaspard",
    group: "leadership",
    name: "Patrick Gaspard",
    role: "President and CEO, Center for American Progress; former United States Ambassador to South Africa",
    country: "USA",
    org: "",
    short: "Patrick Hubert Gaspard is an American diplomat and political strategist.",
    long: [
      "Patrick Hubert Gaspard is an American diplomat and political strategist.He began his career in local politics before serving as executive director of the Democratic National Committee (2011–2013) and White House Director of Political Affairs under President Obama.",
      "He was U.S. Ambassador to South Africa from 2013 to 2016 and later president of the Open Society Foundations (2017–2020). He has served as president and CEO of the Center for American Progress, and is currently the Distinguished Senior Fellow.",
    ],
    photo: "/assets/patrick.png",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Aloizio_Mercadante",
    group: "leadership",
    name: "Aloizio Mercadante",
    role: "Chair of the Brazilian Development Bank (BNDES).",
    country: "Brazil",
    org: "",
    short: "Aloizio Mercadanteis the Chair of the Brazilian Development Bank (BNDES).",
    long: [
      "Aloizio Mercadanteis the Chair of the Brazilian Development Bank (BNDES).He served as the Chief of Staff of Brazil between 2014 and 2015.",
      "He was a founder of the Workers Party in February 1980 and vice- chairman of the party between 1991 and 1999, then state senator from São Paulo between 2003 and 2010.",
      "From 2011 to 2012 he was Minister of Science, Technology and Innovation in Brazil, and in 2012 he became Minister of Education.",
    ],
    photo: "/assets/aloizio.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Heraldo_Munoz",
    group: "leadership",
    name: "Heraldo Munoz",
    role: "Minister of Foreign Affairs",
    country: "Chile",
    org: "",
    short: "Heraldo Munoz was Minister of Foreign Affairs of Chile under President Michelle Bachelet",
    long: [
      "Heraldo Munoz was Minister of Foreign Affairs of Chile under President Michelle Bachelet. The Permanent Representative of Chile to the United Nations and Organization of American States,and Minister Secretary- General of Chile's Government. He was also Assistant Secretary General of the UN Development Programme. ",
      "He co-founded Chile's Party for Democracy (PPD) of which he was President till 2021. He is also Director of the Prince Albert II of Monaco Foundation and the International Secretary of the Socialist Party of Chile.",
      
    ],
    photo: "/assets/Heraldo.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Chung_Eui-Yong",
    group: "leadership",
    name: "Chung Eui-Yong",
    role: "Former Minister of Foreign Affairs,",
    country: "Republic of Korea",
    org: "",
    short: "Chung Eui-Yongwas South Korea's former Foreign Minister and Director of National Security",
    long: [
      "Chung Eui-Yongwas South Korea's former Foreign Minister and Director of National Security. He was Korea's Ambassador to the Permanent Mission of the Republic of Korea to the UN Secretariat and International Organisations in Geneva, and South Korean President Moon's Special Advisor on Foreign Affairs, Diplomacy and National Security. ",
      "He is currently the Chairperson of the International Conference of Asian Political Parties (ICAPP).",
    ],
    photo: "/assets/chung.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Ebrahim_Patel",
    group: "leadership",
    name: "Ebrahim Patel",
    role: "Former Minister of Trade, Industry and Competition,",
    country: "South Africa",
    org: "",
    short: "Ebrahim Patel was South Africa's Minister of Trade, Industry and Competition, the Minister of Economic Development",
    long: [
      "Ebrahim Patel was South Africa's Minister of Trade, Industry and Competition, the Minister of Economic Development. He was active in the anti-apartheid and labour movements, heading the Southern African Clothing and Textile Workers Union (SACTWU). ",
      "He served on the governing body of the International Labour Organisation (ILO), in which position he drafted the ILO's Declaration on Social Justice for a Fair Globalisation in 2008.",
      "He also headed the Presidential Infrastructure Coordinating Commission, and has authored numerous books.",
    ],
    photo: "/assets/ebrahim.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Bert_Koenders",
    group: "leadership",
    name: "Bert Koenders",
    role: "Professor, Leiden University; Former Minister of Foreign Affairs,",
    country: "Netherlands",
    org: "",
    short: "Bert Koenders is a leader of the Dutch Labour Party (PvdA) who served as Minister of Foreign Affairs of the Netherlands from 2014 to 2017",
    long: [
      "Bert Koenders is a leader of the Dutch Labour Party (PvdA) who served as Minister of Foreign Affairs of the Netherlands from 2014 to 2017 , during which the Netherlands held the Presidency of the Council of the EU. ",
      "He previously served as Minister for Development Cooperation (2007–2010) and as Under-Secretary- General of the UN He founded the Parliamentary Network on the World Bank and IMF, served as President of the NATO Parliamentary Assembly, and was a member of the Dutch parliamentary inquiry committee on the Srebrenica massacre",
      "He currently holds the Kooijmans Chair in Peace, Security and Justice at Leiden University and chairs the  Dutch Advisory Council on International Affairs.",
    ],
    photo: "/assets/bert.webp",
    initials: "JD",
    placeholder: false,
  },
  // EXECUTIVE COUNCIL
  {
    slug: "Prof_Kaushik_Basu",
    group: "executive",
    name: "Prof Kaushik Basu",
    role: "Professor of Economics at Cornell University and former Senior Vice President and Chief Economist, World Bank.",
    country: "India",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Kaushik.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Sam_Pitroda",
    group: "executive",
    name: "Sam Pitroda",
    role: "Entrepreneur and former senior advisor to Indian Prime Ministers Dr Manmohan Singh and Rajiv Gandhi.",
    country: "India",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Sam.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Nurul_Izzah_Anwar",
    group: "executive",
    name: "Nurul Izzah Anwar",
    role: "Founder, People's Justice Party (KEADILAN) in 1999 and is Vice President of Malaysia's leading multiethnic party.",
    country: "Malaysia",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Nurul.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Salil_Shetty",
    group: "executive",
    name: "Salil Shetty",
    role: "Former Secretary General, Amnesty International; Senior Fellow, Carr Center for Human Rights Policy, Harvard University",
    country: "India",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Salil.png",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Antton_Ronnholm",
    group: "executive",
    name: "Antton Rönnholm",
    role: "Secretary General, Social Democratic Party of Finland",
    country: "Finland",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/antton.png",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Benjamin_Curley_Gutierrez",
    group: "executive",
    name: "Benjamin Curley Gutierrez",
    role: "Venture capitalist and innovation strategist",
    country: "Mexico",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Benjamin.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Christina_Wiremu_Brook",
    group: "executive",
    name: "Christina Wiremu Brook",
    role: "iTech Policy,",
    country: "Australia",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/christina.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Machris_Cabreros",
    group: "executive",
    name: "Machris Cabreros",
    role: "Progressive Alliance,",
    country: "Philippines",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/machris.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Johan_Hassel",
    group: "executive",
    name: "Johan Hassel",
    role: "Senior Fellow and Director of Global Progress, Center for American Progress,",
    country: "USA",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/johan.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Frederico_Assis",
    group: "executive",
    name: "Frederico Assis",
    role: "Brazilian political strategist and international affairs specialist",
    country: "Brazil",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Frederico.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Karen_Tramontano",
    group: "executive",
    name: "Karen Tramontano",
    role: "Co-Founder and Chief Executive Officer of Blue Star Strategies",
    country: "USA",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Karen.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Katherine_Tai",
    group: "executive",
    name: "Katherine Tai",
    role: "United States Trade Representative (2021 - 2025)",
    country: "USA",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Katherine.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Febe_Potgieter_Gqubule",
    group: "executive",
    name: "Fébé Potgieter-Gqubule",
    role: "National Executive Committee member and Head of Policy and Research for the African National Congress (ANC)",
    country: "South Africa",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/febe.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Amitabh_Behar",
    group: "executive",
    name: "Amitabh Behar",
    role: "Executive Director at Oxfam International",
    country: "India",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Amitabh.webp",
    initials: "JD",
    placeholder: false,
  },

  // TRUSTEES
  {
    slug: "Gurdeep_Sappal",
    group: "trustees",
    name: "Gurdeep Sappal",
    role: "Former Officer on Special Duty to the former Vice President of India, Hamid Ansari",
    country: "India",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/gurdeep.webp",
    initials: "JD",
    placeholder: false,
  },
  {
    slug: "Pushparaj_Deshpande",
    group: "trustees",
    name: "Pushparaj Deshpande",
    role: "Director of Samruddha Bharat Foundation and curator of the Bharat Summit",
    country: "India",
    org: "",
    short: "Two or three lines shown when someone hovers over the card.",
    long: [
      "First paragraph of the full biography.",
      "Second paragraph.",
      "Third paragraph.",
    ],
    photo: "/assets/Pushparaj.webp",
    initials: "JD",
    placeholder: false,
  }
  // ...next person
];
export const byGroup = (g: CouncilGroupId) => MEMBERS.filter((m) => m.group === g);
export const findMember = (slug: string) => MEMBERS.find((m) => m.slug === slug);