import { ImageResponse } from "next/og";
import { logoColors, logoShapes } from "@/components/layout/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS adds its own rounded corners, so the background here is square.
export default function AppleIcon() {
  return new ImageResponse(
    <svg width="180" height="180" viewBox="0 0 1024 1024">
      <rect width="1024" height="1024" fill={logoColors.navy} />
      <polygon points={logoShapes.letter} fill={logoColors.cream} />
      <polygon points={logoShapes.bar} fill={logoColors.gold} />
      <polygon points={logoShapes.peak} fill={logoColors.gold} />
    </svg>,
    size,
  );
}
