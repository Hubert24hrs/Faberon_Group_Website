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

export const site: SiteConfig = {
  name: "Faberon Group",
  // Must match the CAC Certificate of Incorporation and D-U-N-S record letter for letter.
  legalName: "Faberon Group Technologies Limited",
  // TODO: add the RC number from the Certificate of Incorporation. It shows in the footer once set.
  registrationNumber: null,
  tagline: "Our team's best work. Software and AI you own.",
  description:
    "Faberon Group Technologies Limited designs and builds custom SaaS, AI agents, automation, mobile apps and websites, then hands over the code and documentation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://faberongroups.com",
  base: "Lagos, Nigeria",
  contact: {
    email: "info@faberongroups.com",
    // TODO: add an active Nigerian number, e.g. "+234 800 000 0000". App store reviewers call it.
    phone: null,
    whatsapp: null,
    address: {
      street: "House 5, Zion Court Estate, Ikate",
      locality: "Lekki",
      region: "Lagos",
      country: "Nigeria",
      countryCode: "NG",
    },
    hours: null,
  },
  // TODO: add social profiles, e.g. { label: "LinkedIn", href: "https://..." }.
  socials: [],
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
