import { company } from "@/config/company";
import { SITE_URL } from "@/lib/env";

export type SocialLink = { label: string; href: string };

type PostalAddress = {
  street: string;
  locality: string;
  region: string;
  country: string;
  countryCode: string;
};

type SiteConfig = {
  name: string;
  legalName: string;
  registrationNumber: string | null;
  tagline: string;
  description: string;
  url: string;
  base: string;
  contact: {
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: PostalAddress;
    hours: string | null;
  };
  socials: SocialLink[];
};

// Built from config/company.ts, which is the one place the company's details live.
export const site: SiteConfig = {
  name: company.shortName,
  legalName: company.legalName,
  registrationNumber: company.rcNumber,
  tagline: "Our team's best work. Software and AI you own.",
  description: `${company.legalName} designs and builds custom SaaS, AI agents, automation, mobile apps and websites, plus machine learning, data and cloud engineering, then hands over the code and documentation.`,
  url: SITE_URL,
  base: `${company.registeredAddress.region}, ${company.registeredAddress.country}`,
  contact: {
    email: company.emails.general,
    phone: company.phone.display,
    whatsapp: null,
    address: {
      street: company.registeredAddress.street,
      locality: company.registeredAddress.locality,
      region: company.registeredAddress.region,
      country: company.registeredAddress.country,
      countryCode: company.registeredAddress.countryCode,
    },
    hours: null,
  },
  socials: company.socials,
};

export function formatAddress({ street, locality, region, country }: PostalAddress) {
  return `${street}, ${locality}, ${region}, ${country}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

// Switch these on when real content exists. While off, the routes return 404
// and stay out of the navigation and sitemap.
export const features = {
  work: false,
  insights: false,
  newsletter: false,
};

export const primaryCta = { label: "Book a consultation", href: "/contact" };
export const demoCta = { label: "Request a demo", href: "/demo" };
