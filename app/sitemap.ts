import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";
import { indexableRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((path) => ({ url: absoluteUrl(path, SITE_URL) }));
}
