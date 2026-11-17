import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { apps } from "@/config/apps";
import { company } from "@/config/company";

export const metadata: Metadata = {
  title: "Our apps",
  description: `Apps published by ${company.storeDeveloperName}.`,
  alternates: { canonical: "/apps" },
};

// Lists published apps with store links. A 404 (and out of the sitemap) until one exists.
export default function AppsPage() {
  if (apps.length === 0) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Apps"
        title="Our apps"
        lead={`Apps published by ${company.storeDeveloperName}.`}
      />
      <div className="site-container py-section">
        <ul className="grid gap-4 md:grid-cols-2">
          {apps.map((app) => (
            <li
              key={app.slug}
              id={app.slug}
              className="rounded-lg border border-line bg-surface p-6"
            >
              <h2 className="text-h3">{app.name}</h2>
              <p className="mt-2 text-muted">{app.shortDescription}</p>
              <p className="mt-4 flex flex-wrap gap-4 text-sm">
                {app.ios?.storeUrl ? (
                  <a href={app.ios.storeUrl} className="text-accent-text underline">
                    App Store
                  </a>
                ) : null}
                {app.android?.storeUrl ? (
                  <a href={app.android.storeUrl} className="text-accent-text underline">
                    Google Play
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
