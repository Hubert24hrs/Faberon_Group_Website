// The single source of truth for who the company is. Everything the site shows about
// the company (pages, footer, legal pages, structured data, emails) reads from here.
//
// Apple and Google compare these details with the CAC certificate and the
// Dun & Bradstreet record, so they must match those documents letter for letter.
// Never fill a value with a guess: a missing fact is null and renders nothing.

export type Attribution = "company" | "founder";

export type CompanyConfig = {
  legalName: string;
  shortName: string;
  /** The developer name on the App Store and Google Play listings. */
  storeDeveloperName: string;
  /** CAC registration number, e.g. "1234567". Null hides it everywhere. */
  rcNumber: string | null;
  dunsNumber: string | null;
  /** ISO date, e.g. "2025-03-14". */
  incorporationDate: string | null;
  registeredAddress: {
    street: string;
    locality: string;
    region: string;
    country: string;
    countryCode: string;
    /** One line, as printed on the site. */
    formatted: string;
  };
  phone: { e164: string; display: string };
  emails: { general: string; support: string; privacy: string };
  leadership: { name: string; title: string }[];
  socials: { label: string; href: string }[];
  stats: { value: string; label: string; attribution: Attribution }[];
  /** E.g. "within two business days". Null publishes no response time. */
  supportResponseTime: string | null;
  /** Null publishes no deletion completion window. */
  deletionWindowDays: number | null;
};

const legalName = "Faberon Group Technologies Limited";

const address = {
  street: "House 5, Gate 3, Zion Court Estate, Prince Samuel Adedoyin Street, Ikate",
  locality: "Lekki",
  region: "Lagos",
  country: "Nigeria",
  countryCode: "NG",
};

const generalEmail = "info@faberongroups.com";

// An empty string in the environment means "not set".
const fromEnv = (value: string | undefined) => (value && value.trim() ? value.trim() : null);

export const company: CompanyConfig = {
  legalName,
  shortName: "Faberon Group",
  // The owner confirmed the store listings will use the legal name.
  storeDeveloperName: legalName,
  rcNumber: fromEnv(process.env.NEXT_PUBLIC_COMPANY_RC_NUMBER),
  dunsNumber: null,
  incorporationDate: null,
  // The owner confirmed this matches the CAC certificate exactly.
  registeredAddress: {
    ...address,
    formatted: `${address.street}, ${address.locality}, ${address.region}, ${address.country}`,
  },
  phone: { e164: "+2347030288378", display: "+234 703 028 8378" },
  // Support and privacy use the general mailbox until separate ones exist.
  emails: { general: generalEmail, support: generalEmail, privacy: generalEmail },
  leadership: [{ name: "Idoko Hubert", title: "Founder" }],
  socials: [{ label: "TikTok", href: "https://www.tiktok.com/@faberon_group" }],
  // These describe the founder's own track record and are shown in his profile.
  stats: [
    { value: "3+", label: "Years building production systems", attribution: "founder" },
    { value: "20+", label: "Projects delivered", attribution: "founder" },
  ],
  supportResponseTime: null,
  deletionWindowDays: null,
};

/** "RC 1234567", or null while no number is set. */
export function rcLabel(): string | null {
  return company.rcNumber ? `RC ${company.rcNumber}` : null;
}
