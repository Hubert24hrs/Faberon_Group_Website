import { z } from "zod";

// Empty strings in .env files mean "not set".
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optional(z.string()),
  NEXT_PUBLIC_BOOKING_URL: optional(z.url()),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: optional(z.string().regex(/^[a-z0-9.-]+$/i)),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional(z.string()),
  // Set by Vercel on every deployment (production and preview): the project's
  // production domain, without the scheme. See Vercel's system environment variables.
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

const isDevelopment = process.env.NODE_ENV === "development";

// A bare origin: https outside development, no trailing slash, no path, query or hash.
const originSchema = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return url.origin === value && (url.protocol === "https:" || isDevelopment);
  } catch {
    return false;
  }
}, "must be an origin like https://example.com: https, no trailing slash, no path or query");

/**
 * The single public origin of the site. Resolution order:
 * 1. NEXT_PUBLIC_SITE_URL
 * 2. Vercel's production domain for the project, over https
 * 3. http://localhost:3000, in development only
 * A production build that can't resolve an origin fails here with this message.
 */
function resolveSiteUrl(): string {
  const candidate =
    clientEnv.NEXT_PUBLIC_SITE_URL ??
    (clientEnv.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${clientEnv.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : isDevelopment
        ? "http://localhost:3000"
        : undefined);

  if (!candidate) {
    throw new Error(
      "No site origin. Set NEXT_PUBLIC_SITE_URL (for example https://example.com), or build on Vercel.",
    );
  }
  const parsed = originSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new Error(
      `Site origin "${candidate}" ${parsed.error.issues[0]?.message ?? "is invalid"}.`,
    );
  }
  return parsed.data;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_HOST = new URL(SITE_URL).host;
