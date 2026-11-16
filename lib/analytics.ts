import type { Attribution } from "@/lib/validators";

type Props = Record<string, string | number>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[] };
  }
}

// No-op until analytics is enabled and allowed by the visitor's privacy signals.
export function track(event: string, props?: Props) {
  window.plausible?.(event, props ? { props } : undefined);
}

export function privacySignalsOn() {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack === "1" || nav.globalPrivacyControl === true;
}

const ATTRIBUTION_KEY = "faberon-attribution";

// First touch wins for the browser session.
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const referrer =
      document.referrer && new URL(document.referrer).origin !== window.location.origin
        ? document.referrer
        : undefined;
    const attribution: Attribution = {
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      utmTerm: params.get("utm_term") ?? undefined,
      utmContent: params.get("utm_content") ?? undefined,
      referrer,
      landingPage: window.location.pathname,
    };
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Storage or URL parsing can fail; attribution is optional.
  }
}

export function readAttribution(): Attribution | undefined {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}
