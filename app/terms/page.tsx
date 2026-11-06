import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function Terms() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      sections={[
        { h: "Acceptance of these terms", p: ["By using this website you agree to these terms. If you do not agree, please do not use the site."] },
        { h: "About this website", p: ["This website is operated by [registered legal name of the organisation]. It provides information about the Our-World Institute & Initiative, its research, events and network."] },
        { h: "Intellectual property", p: ["Unless stated otherwise, the content on this site is owned by or licensed to us. See our Copyright page for what you may and may not do with it."] },
        { h: "Acceptable use", p: ["You agree not to:"], ul: [
          "use the site unlawfully or in a way that harms others;",
          "attempt to disrupt, probe or gain unauthorised access to the site or its systems;",
          "submit false, misleading or abusive information through our forms.",
        ] },
        { h: "Third-party links", p: ["The site links to external websites, including the Bharat Summit website. We do not control them and are not responsible for their content or practices."] },
        { h: "Views and no endorsement", p: ["Content reflects the work of the Institute and Initiative and its contributors. Nothing on this site is legal, financial or professional advice. [Counsel to confirm the wording on the organisation's status, independence and its relationship to political parties and candidates.]"] },
        { h: "Disclaimer and limitation of liability", p: ["The site is provided \"as is\". To the extent permitted by law, we are not liable for loss arising from your use of the site. [Counsel to confirm.]"] },
        { h: "Governing law", p: ["These terms are governed by the laws of [jurisdiction], and the courts of [city] have jurisdiction. [Counsel to confirm.]"] },
        { h: "Changes", p: ["We may update these terms from time to time. Continued use of the site means you accept the updated terms."] },
        { h: "Contact", p: ["[Contact name, email and postal address]"] },
      ]}
    />
  );
}
