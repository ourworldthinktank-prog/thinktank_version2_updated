import type { ReactNode } from "react";
export type BannerVariant = "about" | "india" | "global" | "council" | "events" | "legal";

const BANNERS: Record<BannerVariant, { src: string; alt: string }> = {
  about:   { src: "/assets/about_us.webp",   alt: "About Our World Institute" },
  india:   { src: "/assets/india_initiatives_banner.webp",   alt: "India Initiative: where ideas meet action" },
  global:  { src: "assets/global_initiatives_banner.webp",  alt: "Global Initiative" },
  council: { src: "/assets/advisory.webp", alt: "Council" },
  events:  { src: "/assets/ideas.webp",  alt: "Events" },
  legal:   { src: "/assets/ideas.webp",   alt: "Legal" },
};

export default function PageBanner({ variant }: { variant: BannerVariant }) {
  const { src, alt } = BANNERS[variant];

  return (
    <section style={{ width: "100%", lineHeight: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1920}
        height={600}
        decoding="async"
        fetchPriority="high"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </section>
  );
}