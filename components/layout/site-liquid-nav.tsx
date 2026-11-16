"use client";

import { Compass, Home, Layers, Mail, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { LiquidNavbar, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar";
import { cn } from "@/lib/utils";

const icon = { size: 18, strokeWidth: 1.8, "aria-hidden": true } as const;

const items: LiquidNavItem[] = [
  { label: "Home", href: "/", icon: <Home {...icon} />, fx: "glow" },
  { label: "Services", href: "/services", icon: <Layers {...icon} />, fx: "pop" },
  { label: "Solutions", href: "/solutions", icon: <Compass {...icon} />, fx: "spin" },
  { label: "About", href: "/about", icon: <Users {...icon} />, fx: "wave" },
  { label: "Contact", href: "/contact", icon: <Mail {...icon} />, fx: "plane" },
];

// A section owns its sub-pages; pages outside these sections show no active drop.
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

// The liquid-glass site navigation, with every item named.
// `scroll` lets it scroll sideways inside a narrow menu bar, keeping the current page in view.
export function SiteLiquidNav({
  className,
  scroll = false,
}: {
  className?: string;
  scroll?: boolean;
}) {
  const pathname = usePathname();
  const tone = useSyncExternalStore(subscribeTheme, readTone, () => "dark" as const);
  const scroller = useRef<HTMLDivElement>(null);
  const active = activeIndex(pathname);

  useEffect(() => {
    const box = scroller.current;
    const current = box?.querySelector<HTMLElement>("[aria-current=page]");
    if (!scroll || !box || !current) return;
    const target = current.offsetLeft - (box.clientWidth - current.offsetWidth) / 2;
    box.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [scroll, active]);

  const nav = (
    <LiquidNavbar items={items} active={active} tone={tone} compact={false} ariaLabel="Main" />
  );

  if (!scroll) return <div className={className}>{nav}</div>;

  return (
    <div
      ref={scroller}
      className={cn(
        "[scrollbar-width:none] overflow-x-auto overflow-y-hidden overscroll-x-contain [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {/* The water canvas bleeds 14px past the pill; the side padding keeps it inside the scroll box. */}
      <div className="mx-auto w-max px-4 py-1.5">{nav}</div>
    </div>
  );
}
