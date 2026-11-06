import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.org";
  const indexable = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return indexable
    ? { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${site}/sitemap.xml` }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
