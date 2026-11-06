import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.org";
  // Add research, insight, event and people URLs here once those templates exist.
  const paths = ["", "/about", "/india", "/global", "/council", "/events", "/privacy", "/terms", "/copyright"];
  return paths.map((p) => ({ url: site + p, lastModified: new Date() }));
}
