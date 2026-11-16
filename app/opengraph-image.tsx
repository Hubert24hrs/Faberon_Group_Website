import { ImageResponse } from "next/og";
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
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 64,
            height: 64,
            borderRadius: 14,
            background: "#eceef2",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 16,
              width: 9,
              height: 32,
              background: "#0b0d11",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 16,
              width: 26,
              height: 9,
              background: "#0b0d11",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 30,
              width: 17,
              height: 9,
              background: "#0b0d11",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 41,
              top: 30,
              width: 9,
              height: 9,
              background: "#f0a63a",
            }}
          />
        </div>
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
