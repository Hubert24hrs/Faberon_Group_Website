"use client";

import { useEffect } from "react";
import { captureAttribution, privacySignalsOn, track } from "@/lib/analytics";

// Loads Plausible only when configured and the visitor hasn't opted out via
// Do Not Track or Global Privacy Control. Plausible sets no cookies.
// Elements with data-track="Event name" report a click event.
export function Analytics({ domain }: { domain?: string }) {
  useEffect(() => {
    captureAttribution();
    if (!domain || privacySignalsOn()) return;

    window.plausible =
      window.plausible ??
      Object.assign(
        (...args: unknown[]) => {
          (window.plausible!.q = window.plausible!.q ?? []).push(args);
        },
        { q: [] as unknown[] },
      );

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = domain;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);

    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (target?.dataset.track) track(target.dataset.track, { path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [domain]);

  return null;
}
