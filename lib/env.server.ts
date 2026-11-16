import { z } from "zod";

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

const serverSchema = z.object({
  RESEND_API_KEY: optional(z.string()),
  CONTACT_TO_EMAIL: optional(z.email()),
  // May include a display name, e.g. "Faberon Group <info@faberongroups.com>".
  CONTACT_FROM_EMAIL: optional(z.string()),
  SLACK_WEBHOOK_URL: optional(z.url({ protocol: /^https$/ })),
  CRM_WEBHOOK_URL: optional(z.url({ protocol: /^https$/ })),
  TURNSTILE_SECRET_KEY: optional(z.string()),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | undefined;

// Server-only: never import this file from a client component.
export function serverEnv(): ServerEnv {
  cached ??= serverSchema.parse(process.env);
  return cached;
}
