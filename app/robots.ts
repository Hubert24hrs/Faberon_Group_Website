import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { isProductionDeployment } from "@/lib/routes";
import { absoluteUrl } from "@/lib/utils";

// Production: everything except the API, with the sitemap on the canonical origin.
// Preview and development deployments: nothing.
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml", SITE_URL),
  };
}
