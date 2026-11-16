"use client";

import { useSyncExternalStore } from "react";
import { WarpCarousel } from "@/components/ui/warp-carousel";
import { highlightCards } from "@/content/highlights";

// The carousel paints on a canvas, so it needs real colour and font values
// rather than CSS variables. These follow the theme toggle and system theme.
function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

const noop = () => () => {};

export function HighlightsCarousel() {
  const background = useSyncExternalStore(
    subscribeTheme,
    () =>
      getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#12151b",
    () => "#12151b",
  );
  const font = useSyncExternalStore(
    noop,
    () => getComputedStyle(document.body).fontFamily,
    () => "system-ui, sans-serif",
  );

  return (
    <WarpCarousel
      cards={highlightCards}
      background={background}
      font={font}
      ariaLabel="Faberon Group highlights. Use the arrow keys to turn."
    />
  );
}
