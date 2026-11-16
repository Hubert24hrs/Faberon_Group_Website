"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ButtonLink } from "@/components/ui/button";
import { demoCta, primaryCta, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { activeSection, siteNav } from "./site-nav";
import { SiteLiquidNav } from "./site-liquid-nav";
import { ThemeToggle } from "./theme-toggle";

// Collapsed groups are inert, so the trap skips their links.
const FOCUSABLE = "a:not([inert] a), button:not([inert] button):not([tabindex='-1'])";

export function Navbar() {
  const pathname = usePathname();
  const current = activeSection(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<number>(-1);
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => {
    // The menu opens compact, so every item and the buttons fit on a phone screen.
    // Only the section you're in shows its links, and Home's long list stays folded.
    setExpanded(current > 0 ? current : -1);
    setMenuOpen(true);
  };

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const sheet = sheetRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    sheet?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !sheet) return;
      const focusable = sheet.querySelectorAll<HTMLElement>(FOCUSABLE);
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
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

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

        {/* Top right: the liquid-glass navigation on wide screens, and the full menu on every screen. */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <SiteLiquidNav className="mr-1 hidden xl:block" />
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
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={openMenu}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line/80 bg-surface/60 text-ink backdrop-blur-md transition-colors hover:bg-surface-2"
          >
            <Menu className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>

      {/* Portalled to <body>: the header's backdrop blur would otherwise contain the fixed sheet. */}
      {menuOpen
        ? createPortal(
            <div className="fixed inset-0 z-50">
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                onClick={closeMenu}
                className="menu-scrim absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]"
              />
              <div
                ref={sheetRef}
                id="site-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className="menu-sheet absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col overflow-y-auto overscroll-contain border-l border-white/10 bg-[color-mix(in_oklab,var(--bg)_74%,transparent)] pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] shadow-[0_0_80px_-20px_rgb(0_0_0/0.6)] backdrop-blur-2xl backdrop-saturate-150"
              >
                <div className="flex h-[var(--nav-height)] shrink-0 items-center justify-between px-5">
                  <p className="eyebrow">Menu</p>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={closeMenu}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-line/80 bg-surface/60 text-ink hover:bg-surface-2"
                  >
                    <X className="size-5" strokeWidth={1.75} aria-hidden />
                  </button>
                </div>

                <nav aria-label="Site" className="px-5 pb-6">
                  <ul>
                    {siteNav.map((section, index) => {
                      const open = expanded === index;
                      const isCurrent = index === current;
                      const panelId = `menu-${section.label.toLowerCase()}`;
                      const Icon = section.icon;
                      return (
                        <li key={section.href} className="border-b border-line/70">
                          <div className="flex items-center gap-2">
                            <Link
                              href={section.href}
                              onClick={closeMenu}
                              aria-current={isCurrent ? "page" : undefined}
                              className="group flex min-h-14 flex-1 items-center gap-3.5 py-2 text-lg font-medium text-ink"
                            >
                              <span
                                className={cn(
                                  "relative inline-flex size-10 items-center justify-center rounded-full border transition-colors",
                                  isCurrent
                                    ? "border-accent/50 bg-[radial-gradient(120%_140%_at_30%_0%,rgb(255_255_255/0.55),transparent_55%),color-mix(in_oklab,var(--accent)_30%,transparent)] text-ink shadow-[inset_0_1px_1px_rgb(255_255_255/0.7),0_6px_16px_-8px_var(--accent)]"
                                    : "border-line/80 bg-surface/50 text-muted group-hover:text-ink",
                                )}
                              >
                                <Icon className="size-[18px]" strokeWidth={1.8} aria-hidden />
                              </span>
                              {section.label}
                            </Link>
                            <button
                              type="button"
                              aria-expanded={open}
                              aria-controls={panelId}
                              aria-label={`${open ? "Hide" : "Show"} ${section.label} links`}
                              onClick={() => setExpanded(open ? -1 : index)}
                              className="inline-flex size-10 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
                            >
                              <ChevronDown
                                className={cn("size-5 transition-transform", open && "rotate-180")}
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </button>
                          </div>
                          <div
                            id={panelId}
                            inert={!open}
                            className={cn(
                              "grid transition-[grid-template-rows] duration-300",
                              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                            )}
                          >
                            <ul className="overflow-hidden">
                              {section.links.map((link) => (
                                <li key={link.href}>
                                  {link.external ? (
                                    <a
                                      href={link.href}
                                      className="block py-2 pl-[3.375rem] text-[0.9375rem] text-muted hover:text-ink"
                                    >
                                      {link.label}
                                    </a>
                                  ) : (
                                    <Link
                                      href={link.href}
                                      onClick={closeMenu}
                                      className="block py-2 pl-[3.375rem] text-[0.9375rem] text-muted hover:text-ink"
                                    >
                                      {link.label}
                                    </Link>
                                  )}
                                </li>
                              ))}
                              <li aria-hidden="true" className="h-3" />
                            </ul>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-8 space-y-3">
                    <ButtonLink href={demoCta.href} onClick={closeMenu} className="w-full">
                      {demoCta.label}
                    </ButtonLink>
                    <ButtonLink
                      href={primaryCta.href}
                      onClick={closeMenu}
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
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
