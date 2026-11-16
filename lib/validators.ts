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
    .min(20, "Tell us a little more, at least 20 characters")
    .max(4000, "Keep your message under 4,000 characters"),
  intent: z.enum(["consultation", "demo"]).optional(),
  // Honeypot. Hidden from people, so anything here came from a bot.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address").max(254),
  website: z.string().max(200).optional(),
});
