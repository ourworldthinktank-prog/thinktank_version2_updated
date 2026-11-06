import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      sections={[
        { h: "Who we are", p: ["This website is operated by [registered legal name of the organisation], [registered address] (\"we\", \"us\"). You can reach us at [privacy contact email]."] },
        { h: "What information we collect", p: ["We collect only what we need:"], ul: [
          "Details you give us through forms, such as your name, email address, organisation and message (newsletter, contact and partnership forms).",
          "Basic technical data, such as browser type and pages visited, if you accept analytics cookies.",
        ] },
        { h: "How we use it", ul: [
          "To send the newsletter and updates you asked for.",
          "To respond to enquiries and partnership requests.",
          "To understand how the site is used and to improve it.",
        ] },
        { h: "Consent and legal basis", p: ["We rely on your consent for newsletters and for analytics cookies. You can withdraw consent at any time by using the unsubscribe link in our emails, by changing your cookie choice, or by writing to us. [Counsel to confirm the applicable legal bases and references to India's Digital Personal Data Protection Act, 2023 and, where relevant, the GDPR.]"] },
        { h: "Cookies", p: ["Essential cookies keep the site working. Analytics cookies are used only if you accept them in the cookie banner. [Cookie list to be completed.]"] },
        { h: "Who we share data with", p: ["We use trusted service providers such as website hosting and email delivery. They may process data only on our instructions. We do not sell personal data. [List providers and any transfers outside India.]"] },
        { h: "How long we keep it", p: ["We keep personal data only for as long as needed for the purposes above. [Retention periods to be confirmed.]"] },
        { h: "Your rights", p: ["You may ask to access, correct or delete your personal data, withdraw consent, or raise a complaint. Write to [privacy contact email]. [Grievance officer name and contact to be added if required.]"] },
        { h: "Security", p: ["We use reasonable technical and organisational measures, including encrypted connections and restricted access, to protect your data."] },
        { h: "Children", p: ["This website is not directed at children. [Counsel to confirm wording.]"] },
        { h: "Changes to this policy", p: ["We may update this policy from time to time. The date above shows when it was last changed."] },
        { h: "Contact", p: ["[Privacy contact name, email and postal address]"] },
      ]}
    />
  );
}
