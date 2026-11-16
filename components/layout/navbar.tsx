"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { services } from "@/content/services";
import { ButtonLink } from "@/components/ui/button";
import { demoCta, features, primaryCta, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ServiceIcon } from "./service-icon";
import { SiteLiquidNav } from "./site-liquid-nav";
import { ThemeToggle } from "./theme-toggle";

const drawerLinks = [
  { label: "All services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  ...(features.work ? [{ label: "Work", href: "/work" }] : []),
  { label: "About Us", href: "/about" },
  ...(features.insights ? [{ label: "Insights", href: "/insights" }] : []),
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    drawerButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    document.body.style.overflow = "hidden";
    drawer?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = drawer.querySelectorAll<HTMLElement>("a, button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled ? "border-line bg-[var(--nav-bg)] backdrop-blur-md" : "border-transparent",
      )}
    >
      <div className="site-container flex h-[var(--nav-height)] items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          aria-label={`${site.legalName} home`}
          className="-m-1 shrink-0 rounded p-1 text-ink"
        >
          <Logo />
        </Link>

        {/* Liquid-glass navigation, in the menu bar on larger screens. */}
        <SiteLiquidNav className="hidden lg:block" />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <span className="max-sm:hidden">
            <ThemeToggle />
          </span>
          <ButtonLink
            href={demoCta.href}
            className="h-9! px-2.5! text-xs! max-[359px]:hidden sm:h-10! sm:px-4! sm:text-sm!"
          >
            {demoCta.label}
          </ButtonLink>
          <button
            ref={drawerButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-menu"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-surface-2 lg:hidden"
          >
            <Menu className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>

      {/* On phones and tablets the same navigation sits on a second row of the menu bar. */}
      <SiteLiquidNav scroll className="border-t border-line/60 lg:hidden" />

      {drawerOpen ? (
        <div
          ref={drawerRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-bg pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          <div className="site-container flex h-[var(--nav-height)] items-center justify-between">
            <Link
              href="/"
              aria-label={`${site.legalName} home`}
              onClick={closeDrawer}
              className="text-ink"
            >
              <Logo />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeDrawer}
              className="inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-surface-2"
            >
              <X className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <nav aria-label="Mobile" className="site-container pt-6 pb-10">
            <p className="eyebrow">Services</p>
            <ul className="mt-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={closeDrawer}
                    className="flex items-center gap-3 border-b border-line py-3.5 text-lg font-medium text-ink"
                  >
                    <ServiceIcon slug={service.slug} className="size-5 text-accent-text" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6">
              {drawerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeDrawer}
                    className="block py-2.5 text-lg text-muted hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 space-y-3">
              <ButtonLink href={demoCta.href} onClick={closeDrawer} className="w-full">
                {demoCta.label}
              </ButtonLink>
              <ButtonLink
                href={primaryCta.href}
                onClick={closeDrawer}
                variant="secondary"
                className="w-full"
              >
                {primaryCta.label}
              </ButtonLink>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
              Theme
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
