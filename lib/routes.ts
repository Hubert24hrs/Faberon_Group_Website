import { apps } from "@/config/apps";
import { caseStudies } from "@/content/case-studies";
import { insights } from "@/content/insights";
import { services } from "@/content/services";
import { features } from "@/lib/site";

/**
 * True on the live production deployment. On Vercel this is VERCEL_ENV=production;
 * elsewhere, any production build (so a local `next build && next start` behaves like production).
 */
export const isProductionDeployment = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

/** Pages that must exist and be indexable before the URL goes into an enrollment form. */
export const requiredPaths = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/support",
  "/delete-account",
] as const;

/**
 * Every indexable page, in one typed list. The sitemap is built from it. Pages that are
 * noindex (such as /apps while no app is published) are left out.
 */
export function indexableRoutes(): string[] {
  return [
    "/",
    "/services",
    ...services.map((service) => `/services/${service.slug}`),
    "/solutions",
    "/about",
    "/contact",
    "/demo",
    "/support",
    "/delete-account",
    "/privacy",
    "/terms",
    ...(apps.length > 0 ? ["/apps"] : []),
    ...(features.work ? ["/work", ...caseStudies.map((study) => `/work/${study.slug}`)] : []),
    ...(features.insights
      ? ["/insights", ...insights.map((post) => `/insights/${post.slug}`)]
      : []),
  ];
}
