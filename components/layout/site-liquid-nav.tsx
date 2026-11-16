"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LiquidNavbar, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar";
import { activeSection, siteNav } from "./site-nav";

const items: LiquidNavItem[] = siteNav.map(({ label, href, icon: Icon, fx }) => ({
  label,
  href,
  fx,
  icon: <Icon size={18} strokeWidth={1.8} aria-hidden />,
}));

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTone = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

// The liquid-glass site navigation, with every item named.
export function SiteLiquidNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const tone = useSyncExternalStore(subscribeTheme, readTone, () => "dark" as const);

  return (
    <div className={className}>
      <LiquidNavbar
        items={items}
        active={activeSection(pathname)}
        tone={tone}
        compact={false}
        ariaLabel="Main"
      />
    </div>
  );
}
