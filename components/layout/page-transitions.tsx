"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Liquid page transitions for the whole site.
//
// Following a link to another page, the new page opens in an expanding circle from
// where you tapped, like a drop landing on water, and ripple rings spread out from it.
// - Browsers with the View Transitions API get the reveal and the ripples.
// - Other browsers navigate as normal and get the ripples only.
// - With "reduce motion" switched on, nothing animates.
// Links on the same page (#sections, Home on the homepage) are left alone.

const RIPPLE_DELAYS = [0, 0.18, 0.36, 0.54]; // seconds; four rings, like water
const SETTLE_TIMEOUT = 2500; // never hold the old page longer than this

type Origin = { x: number; y: number };

function spawnRipples(layer: HTMLElement, { x, y }: Origin) {
  // The rings reach about 90% of the screen's longer side, so they read on any device.
  const reach = Math.round(Math.max(window.innerWidth, window.innerHeight) * 0.9);
  const add = (className: string, delay: number) => {
    const el = document.createElement("span");
    el.className = className;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
    el.style.setProperty("--d", `${reach}px`);
    el.style.animationDelay = `${delay}s`;
    el.addEventListener("animationend", () => el.remove(), { once: true });
    layer.appendChild(el);
  };
  add("liquid-splash", 0);
  for (const delay of RIPPLE_DELAYS) add("liquid-ripple", delay);
}

export function PageTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);
  const origin = useRef<Origin | null>(null);
  const settle = useRef<(() => void) | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || !link.href || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return; // mailto:, tel:, other sites
      if (url.pathname === window.location.pathname) return; // same page
      if (reduceMotion.matches) return;

      const box = link.getBoundingClientRect();
      // Keyboard activation reports 0,0, so fall back to the link's centre.
      const x = event.clientX || box.left + box.width / 2;
      const y = event.clientY || box.top + box.height / 2;
      origin.current = { x, y };

      if (typeof document.startViewTransition !== "function") return;

      event.preventDefault();
      const root = document.documentElement;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.style.setProperty("--liquid-x", `${x}px`);
      root.style.setProperty("--liquid-y", `${y}px`);
      root.style.setProperty("--liquid-r", `${Math.ceil(radius)}px`);

      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const timer = window.setTimeout(resolve, SETTLE_TIMEOUT);
            settle.current = () => {
              window.clearTimeout(timer);
              resolve();
            };
            router.push(url.pathname + url.search + url.hash);
          }),
      );
    };

    // Capture phase, so it runs before Next's link handler, which then stands aside.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // The new page has rendered: let the transition reveal it, and ripple from the tap.
  useEffect(() => {
    settle.current?.();
    settle.current = null;
    const from = origin.current;
    origin.current = null;
    if (from && layerRef.current) spawnRipples(layerRef.current, from);
  }, [pathname]);

  return <div ref={layerRef} className="liquid-ripple-layer" aria-hidden="true" />;
}
