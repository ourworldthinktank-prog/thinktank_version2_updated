import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Copyright" };

export default function Copyright() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Copyright"
      sections={[
        { h: "Ownership", p: ["© 2026 [registered legal name of the organisation]. All rights reserved. The text, graphics, logos, images, reports and other material on this site are protected by copyright and other laws, unless stated otherwise."] },
        { h: "What you may do", ul: [
          "View and share links to pages on this site.",
          "Quote short extracts for non-commercial purposes such as news, research or education, with clear credit to the Our-World Institute & Initiative and a link to the source. [Counsel to confirm.]",
        ] },
        { h: "What needs permission", p: ["Please ask in writing before you copy, republish, adapt or distribute our content, logos or reports, or use them commercially. Write to [permissions email]."] },
        { h: "Third-party material", p: ["Some images, videos and other material belong to third parties and are used with permission or under licence. Credits are shown where required. [Photo and content credits to be completed.]"] },
        { h: "Trademarks", p: ["The names \"Our-World Institute & Initiative\" and our logos are marks of [registered legal name]. Do not use them without written permission."] },
        { h: "Reporting infringement", p: ["If you believe material on this site infringes your copyright, please contact [permissions email] with details so we can look into it promptly."] },
      ]}
    />
  );
}
