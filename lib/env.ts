import { z } from "zod";

// Empty strings in .env files mean "not set".
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optional(z.url()),
  NEXT_PUBLIC_BOOKING_URL: optional(z.url()),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: optional(z.string().regex(/^[a-z0-9.-]+$/i)),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: optional(z.string()),
});

// Each variable is read by name so Next.js can inline it into client bundles.
export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_BOOKING_URL: process.env.NEXT_PUBLIC_BOOKING_URL,
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
});
