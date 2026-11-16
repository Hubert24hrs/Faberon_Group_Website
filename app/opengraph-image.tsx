import { ImageResponse } from "next/og";
import { logoColors, logoShapes } from "@/components/layout/logo";
import { site } from "@/lib/site";

export const alt = `${site.legalName}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0b0d11",
        color: "#eceef2",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 36, fontWeight: 600 }}
      >
        <svg width="64" height="64" viewBox="0 0 1024 1024">
          <rect width="1024" height="1024" rx="236" fill={logoColors.navy} />
          <polygon points={logoShapes.letter} fill={logoColors.cream} />
          <polygon points={logoShapes.bar} fill={logoColors.gold} />
          <polygon points={logoShapes.peak} fill={logoColors.gold} />
        </svg>
        {site.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600 }}>
          <span>Our team&apos;s best work.</span>
          <span>Software and AI you own.</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#a2a9b5" }}>
          {site.legalName}
        </div>
      </div>
    </div>,
    size,
  );
}
