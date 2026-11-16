"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      theme?: "auto";
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Cloudflare Turnstile. Renders nothing unless a site key is configured.
export function Turnstile({
  siteKey,
  onToken,
}: {
  siteKey?: string;
  onToken: (token?: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey || !ready || !container.current || !window.turnstile) return;
    const id = window.turnstile.render(container.current, {
      sitekey: siteKey,
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(undefined),
      theme: "auto",
    });
    return () => window.turnstile?.remove(id);
  }, [siteKey, ready, onToken]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setReady(true)}
      />
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}
