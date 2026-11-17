import { Compass, Home, Layers, Mail, Users, type LucideIcon } from "lucide-react";
import type { NimbusFx } from "@/components/ui/liquid-glass-navbar";
import { services } from "@/content/services";
import { audiences } from "@/content/company";
import { demoCta, primaryCta, site, telHref } from "@/lib/site";

export type NavLink = { label: string; href: string; external?: boolean };

export type NavSection = {
  label: string;
  href: string;
  icon: LucideIcon;
  fx: NimbusFx;
  /** Where this section leads, shown under it in the menu. */
  links: NavLink[];
};

export const anchorId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

// The site's main sections, used by the liquid-glass bar and the full menu.
export const siteNav: NavSection[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    fx: "glow",
    links: [
      { label: "What we build", href: "/#what-we-build" },
      { label: "How an AI agent works", href: "/#ai-agents" },
      { label: "Who we build for", href: "/#who-we-build-for" },
      { label: "How we work", href: "/#process" },
      { label: "Engineering principles", href: "/#principles" },
      { label: "Questions and answers", href: "/#faq" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    icon: Layers,
    fx: "pop",
    links: services.map((service) => ({
      label: service.name,
      href: `/services/${service.slug}`,
    })),
  },
  {
    label: "Solutions",
    href: "/solutions",
    icon: Compass,
    fx: "spin",
    links: audiences.map((audience) => ({
      label: `For ${audience.name.toLowerCase()}`,
      href: `/solutions#${anchorId(audience.name)}`,
    })),
  },
  {
    label: "About",
    href: "/about",
    icon: Users,
    fx: "wave",
    links: [
      { label: "Why we exist", href: "/about#why-we-exist" },
      { label: "Mission and values", href: "/about#mission" },
      { label: "Leadership", href: "/about#leadership" },
      { label: "Company information", href: "/about#company-information" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
    fx: "plane",
    links: [
      { label: primaryCta.label, href: primaryCta.href },
      { label: demoCta.label, href: demoCta.href },
      ...(site.contact.phone
        ? [
            {
              label: `Call ${site.contact.phone}`,
              href: telHref(site.contact.phone),
              external: true,
            },
          ]
        : []),
      ...(site.contact.email
        ? [{ label: site.contact.email, href: `mailto:${site.contact.email}`, external: true }]
        : []),
    ],
  },
];

// A section owns its sub-pages; pages outside these sections match none (-1).
export function activeSection(pathname: string) {
  return siteNav.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
  );
}
