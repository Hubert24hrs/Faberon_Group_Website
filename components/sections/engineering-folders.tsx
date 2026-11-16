import { ArrowRight } from "lucide-react";
import Link from "next/link";
import GlassFolder, { type ArtRecipe, type FolderFile } from "@/components/ui/glass-folder-cards";
import { engineeringServices, type ServiceSlug } from "@/content/services";

// Generated artwork in the logo palette: navy, cream and gold.
const brandArt: Partial<Record<ServiceSlug, ArtRecipe>> = {
  "machine-learning": {
    style: "marble",
    colors: ["#050b14", "#0a2038", "#1d3a5f", "#0a2038", "#7a5a12", "#d5a63a", "#f3e3b0"],
    scale: 0.7,
    warp: 3.2,
    angle: -0.4,
    gloss: 0.5,
    veins: 0.45,
  },
  "data-solutions": {
    style: "streak",
    colors: ["#f3f1e4", "#e9d9a8", "#d5a63a", "#0a2038", "#14335a", "#5b7ea6", "#f3f1e4"],
    scale: 0.7,
    warp: 1.5,
    angle: -0.6,
    gloss: 0.2,
    veins: 0,
  },
  "full-stack-development": {
    style: "marble",
    colors: ["#04080f", "#0a2038", "#2c4f78", "#0e1a2b", "#c9a54f", "#f3f1e4", "#ffffff"],
    scale: 0.75,
    warp: 3.6,
    angle: 0.8,
    gloss: 0.5,
    veins: 0.4,
  },
  "cloud-devops": {
    style: "streak",
    colors: ["#0a2038", "#132c4d", "#d5a63a", "#f0d58c", "#f3f1e4", "#7a5a12"],
    scale: 0.7,
    warp: 1.6,
    angle: 0.35,
    gloss: 0.25,
    veins: 0,
  },
};

const folderLabels: Partial<Record<ServiceSlug, string>> = {
  "machine-learning": "Machine learning",
  "data-solutions": "Data solutions",
  "full-stack-development": "Full-stack",
  "cloud-devops": "Cloud & DevOps",
};

// Hover a folder to lean its glass forward; open it to fan out the capabilities,
// each of which links to the service page.
export function EngineeringFolders() {
  return (
    <ul className="grid justify-items-center gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {engineeringServices.map((service, index) => {
        const href = `/services/${service.slug}`;
        const art: ArtRecipe | "aurora" = brandArt[service.slug] ?? "aurora";
        // The last file sits at the front of the stack, so list them in reverse.
        const files: FolderFile[] = service.builds
          .map((build, buildIndex) => ({
            name: build.title,
            href,
            ...(buildIndex === 0 ? { art, meta: "Overview" } : {}),
          }))
          .reverse();

        return (
          <li key={service.slug} className="flex w-[260px] max-w-full flex-col items-center">
            <GlassFolder
              label={folderLabels[service.slug] ?? service.name}
              meta={`${service.builds.length} capabilities`}
              tone="dark"
              art={art}
              seed={index * 7 + 3}
              files={files}
              action="none"
              width={260}
              appearDelay={index * 120}
            />
            <div className="mt-5 w-full">
              <h4 className="font-medium">{service.name}</h4>
              <p className="mt-1 text-sm leading-snug text-muted">{service.navBlurb}</p>
              <Link
                href={href}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline"
              >
                Explore {service.name.toLowerCase()}
                <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
