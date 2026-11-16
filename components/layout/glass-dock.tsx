"use client";

import { Compass, Home, Layers, Mail, PlayCircle, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LiquidNavbar, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar";

const icon = { size: 18, strokeWidth: 1.8, "aria-hidden": true } as const;

const items: LiquidNavItem[] = [
  { label: "Home", href: "/", icon: <Home {...icon} />, fx: "glow" },
  { label: "Services", href: "/services", icon: <Layers {...icon} />, fx: "pop" },
  { label: "Solutions", href: "/solutions", icon: <Compass {...icon} />, fx: "spin" },
  { label: "About", href: "/about", icon: <Users {...icon} />, fx: "wave" },
  { label: "Demo", href: "/demo", icon: <PlayCircle {...icon} />, fx: "drop" },
  { label: "Contact", href: "/contact", icon: <Mail {...icon} />, fx: "plane" },
];

// The page's own section owns the highlight; pages outside the dock show no active drop.
function activeIndex(pathname: string) {
  return items.findIndex(({ href = "" }) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
  );
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTone = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

// A floating liquid-glass dock for moving around the whole site.
export function GlassDock() {
  const pathname = usePathname();
  const tone = useSyncExternalStore(subscribeTheme, readTone, () => "dark" as const);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-3 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] print:hidden">
      <div className="pointer-events-auto max-w-full">
        <LiquidNavbar items={items} active={activeIndex(pathname)} tone={tone} ariaLabel="Site" />
      </div>
    </div>
  );
}
