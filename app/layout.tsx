import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./extra.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.org";
const indexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Our World Institute & Initiative", template: "%s | Our World Institute & Initiative" },
  description:
    "Research, advocacy and global collaboration for stronger democracies, greater equity and a more sustainable, peaceful planet.",
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: "Our World Institute & Initiative",
    description: "Ideas for a fairer world.",
    type: "website",
    siteName: "Our World Institute & Initiative",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0F2A5C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`.rv{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
