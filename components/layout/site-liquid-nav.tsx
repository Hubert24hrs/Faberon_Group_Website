"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { LiquidNavbar, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar";
import { cn } from "@/lib/utils";
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
// `scroll`: for phones and tablets. The bar scrolls sideways when the names don't fit,
// and keeps the current page in view.
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
  const active = activeSection(pathname);

  useEffect(() => {
    const box = scroller.current;
    const current = box?.querySelector<HTMLElement>("[aria-current=page]");
    if (!scroll || !box || !current) return;
    const target = current.offsetLeft - (box.clientWidth - current.offsetWidth) / 2;
    box.scrollTo({ left: Math.max(0, target) });
  }, [scroll, active]);

  const nav = (
    <LiquidNavbar
      items={items}
      active={active}
      tone={tone}
      compact={false}
      dense
      ariaLabel="Main"
    />
  );

  if (!scroll) return <div className={className}>{nav}</div>;

  return (
    <div
      ref={scroller}
      className={cn(
        "[scrollbar-width:none] overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {/* The water canvas bleeds 14px past the pill; the padding keeps it inside the scroll box. */}
      <div className="mx-auto w-max px-4 pt-1 pb-2.5">{nav}</div>
    </div>
  );
}
