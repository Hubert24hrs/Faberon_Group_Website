import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Endless } from "@/components/ui/endless";
import { testimonials } from "@/content/testimonials";
import { features, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description: `What clients say about working with ${site.legalName}.`,
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  // Stays off until content/testimonials.ts holds real, approved quotes.
  if (!features.testimonials) notFound();

  return (
    <>
      <h1 className="sr-only">Testimonials</h1>
      <Endless
        items={testimonials}
        title="What clients say"
        caption={`${site.name}, from Lagos to clients worldwide`}
      />

      <section aria-labelledby="all-testimonials" className="border-t border-line py-section">
        <div className="site-container">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Testimonials", href: "/testimonials" },
            ]}
          />
          <p className="eyebrow mt-10">Testimonials</p>
          <h2 id="all-testimonials" className="mt-4 text-h2">
            In our clients&apos; words
          </h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <Reveal as="li" key={`${item.name}-${item.company}`} className="h-full">
                <figure className="flex h-full flex-col rounded-lg border border-line bg-surface p-6 sm:p-8">
                  <span aria-hidden className="font-display text-5xl leading-none text-accent-text">
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 text-lead text-ink">{item.quote}</blockquote>
                  <figcaption className="mt-auto border-t border-line pt-5">
                    <p className="font-display font-semibold text-ink">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {item.role}, {item.company}
                      {item.service ? ` · ${item.service}` : ""}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
