import { apps } from "@/config/apps";
import { z } from "zod";

export const serviceGroups = [
  {
    label: "Software and AI products",
    options: ["Custom SaaS", "AI agents", "AI automation", "Mobile app", "Website"],
  },
  {
    label: "AI and machine learning",
    options: [
      "Machine learning models",
      "Deep learning",
      "Natural language processing (NLP)",
      "Computer vision",
      "Recommendation systems",
      "MLOps and model deployment",
    ],
  },
  {
    label: "Data solutions",
    options: [
      "Data engineering and ETL/ELT pipelines",
      "Data analytics and business intelligence",
      "Data warehousing and cloud data platforms",
      "Big data processing",
      "Database design (SQL and NoSQL)",
    ],
  },
  {
    label: "Full-stack development",
    options: [
      "Web application development",
      "Frontend development",
      "Backend and API development (REST, GraphQL)",
      "Authentication and access control",
      "Scalable system design",
    ],
  },
  {
    label: "Cloud and DevOps",
    options: [
      "Cloud deployment (AWS, Azure, GCP)",
      "Docker and containerisation",
      "CI/CD pipelines",
      "Monitoring and performance optimisation",
    ],
  },
  {
    label: "Other",
    options: ["White-label or partnership", "Not sure yet"],
  },
] as const;

export const serviceOptions: readonly string[] = serviceGroups.flatMap((group) => group.options);

export const budgetOptions = [
  "Under $10,000",
  "$10,001 to $25,000",
  "$25,001 to $100,000",
  "$100,001 or more",
  "Not yet sure",
] as const;

export const messageMinLength = 20;
export const messageMaxLength = 4000;

// Single-line fields end up in email headers, so line breaks are rejected.
const singleLine = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `Enter your ${label}`)
    .max(max, `Keep your ${label} under ${max} characters`)
    .regex(/^[^\r\n]*$/, `Enter your ${label} on one line`);

export const contactSchema = z.object({
  name: singleLine("name", 120),
  email: z.email("Enter a valid email address").max(254),
  company: singleLine("company", 160),
  service: z.string().refine((value) => serviceOptions.includes(value), {
    error: "Choose a service",
  }),
  budget: z.enum(budgetOptions, { error: "Choose a budget range" }),
  message: z
    .string()
    .trim()
    .min(messageMinLength, `Tell us a little more, at least ${messageMinLength} characters`)
    .max(messageMaxLength, "Keep your message under 4,000 characters"),
  intent: z.enum(["consultation", "demo"]).optional(),
  // Honeypot. Hidden from people, so anything here came from a bot.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

const attributionField = z.string().trim().max(500).optional();

export const attributionSchema = z.object({
  utmSource: attributionField,
  utmMedium: attributionField,
  utmCampaign: attributionField,
  utmTerm: attributionField,
  utmContent: attributionField,
  referrer: attributionField,
  landingPage: attributionField,
});

export type Attribution = z.infer<typeof attributionSchema>;

export const leadSchema = contactSchema.extend({
  attribution: attributionSchema.optional(),
  page: z.string().trim().max(200).optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address").max(254),
  website: z.string().max(200).optional(),
});

// ---------------------------------------------------------------------------
// Support and account-deletion requests. App choices come from config/apps.ts.

export const otherAppOption = "Website or other";

export const appOptions: readonly string[] = [...apps.map((app) => app.name), otherAppOption];

const appChoice = z.string().refine((value) => appOptions.includes(value), {
  error: "Choose what your request is about",
});

const optionalLine = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep the ${label} under ${max} characters`)
    .regex(/^[^\r\n]*$/, `Enter the ${label} on one line`)
    .optional()
    .or(z.literal(""));

const requestMeta = {
  // Spam trap. Hidden from people, so anything here came from a bot.
  website: z.string().max(200).optional(),
  turnstileToken: z.string().max(2048).optional(),
};

export const supportSchema = z.object({
  name: singleLine("name", 120),
  email: z.email("Enter a valid email address").max(254),
  app: appChoice,
  device: optionalLine("device and OS version", 160),
  message: z
    .string()
    .trim()
    .min(messageMinLength, `Describe the problem in at least ${messageMinLength} characters`)
    .max(messageMaxLength, "Keep your message under 4,000 characters"),
  ...requestMeta,
});

export type SupportInput = z.infer<typeof supportSchema>;

export const deletionRequestTypes = {
  account: "Delete my account and all its data",
  data: "Delete specific data and keep my account",
} as const;

export const deletionSchema = z.object({
  app: appChoice,
  email: z.email("Enter the email address you use in the app").max(254),
  username: optionalLine("username", 120),
  requestType: z.enum(Object.keys(deletionRequestTypes) as ["account", "data"], {
    error: "Choose what you'd like deleted",
  }),
  details: z
    .string()
    .trim()
    .max(2000, "Keep the details under 2,000 characters")
    .optional()
    .or(z.literal("")),
  confirmOwner: z.literal(true, {
    error: "Confirm that the account is yours",
  }),
  ...requestMeta,
});

export type DeletionInput = z.infer<typeof deletionSchema>;
