import { z } from "zod";

// Empty strings in .env files mean "not set".
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optional(z.url()),
  NEXT_PUBLIC_BOOKING_URL: optional(z.url()),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: optional(z.string().regex(/^[a-z0-9.-]+$/i)),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional(z.string()),
  // Set by Vercel: the project's production domain, without the scheme.
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: optional(z.string().regex(/^[a-z0-9.-]+$/i)),
});

// Each variable is read by name so Next.js can inline it into client bundles.
export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_BOOKING_URL: process.env.NEXT_PUBLIC_BOOKING_URL,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
});

// The public address of the site. An explicit NEXT_PUBLIC_SITE_URL wins; otherwise
// Vercel's production domain is used, so canonical links and previews always point
// at an address that works. It becomes faberongroups.com once that domain is added.
export const siteUrl =
  clientEnv.NEXT_PUBLIC_SITE_URL ??
  (clientEnv.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${clientEnv.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://faberongroups.com");
