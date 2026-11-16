import {
  ChartScatter,
  Cloud,
  CodeXml,
  Database,
  Layers,
  PanelTop,
  Smartphone,
  Waypoints,
  Workflow,
  type LucideProps,
} from "lucide-react";
import type { ServiceSlug } from "@/content/services";

const icons = {
  "custom-saas": Layers,
  "ai-agents": Waypoints,
  "ai-automation": Workflow,
  "mobile-apps": Smartphone,
  websites: PanelTop,
  "machine-learning": ChartScatter,
  "data-solutions": Database,
  "full-stack-development": CodeXml,
  "cloud-devops": Cloud,
} satisfies Record<ServiceSlug, unknown>;

export function ServiceIcon({ slug, ...props }: { slug: ServiceSlug } & LucideProps) {
  const Icon = icons[slug];
  return <Icon strokeWidth={1.75} aria-hidden {...props} />;
}
