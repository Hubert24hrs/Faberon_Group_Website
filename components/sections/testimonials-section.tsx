import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Endless, type CorridorCard } from "@/components/ui/endless";
import { SectionHeader } from "@/components/ui/section-header";
import { testimonials } from "@/content/testimonials";
import { primaryCta, site } from "@/lib/site";

export const hasTestimonials = testimonials.length > 0;

const shareHref = site.contact.email
  ? `mailto:${site.contact.email}?subject=${encodeURIComponent(`Testimonial for ${site.name}`)}`
  : "/contact";

const cards: CorridorCard[] = testimonials.map((item) => ({
  text: item.quote,
  title: item.name,
  detail: `${item.role}, ${item.company}`,
}));

// The 3D corridor of client quotes. Renders nothing until real quotes exist.
export function TestimonialsCorridor() {
  if (!hasTestimonials) return null;
  return (
    <Endless
      items={cards}
      title="What clients say"
      caption={`${site.name}, from Lagos to clients worldwide`}
    />
  );
}

// Client testimonials as readable cards: name or organisation, role, and their words.
// Until real, approved quotes are added to content/testimonials.ts, it explains how
// testimonials are published and invites past clients to share one.
export function TestimonialsSection({
  id,
  headingLevel = "h2",
  showHeader = true,
  bordered = true,
}: {
  id?: string;
  headingLevel?: "h1" | "h2";
  showHeader?: boolean;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      aria-label="Testimonials"
      className={bordered ? "border-t border-line py-section" : "pt-10 pb-section"}
    >
      <div className="site-container">
        {showHeader ? (
          <Reveal>
            {headingLevel === "h1" ? (
              <div className="max-w-2xl">
                <p className="eyebrow">Testimonials</p>
                <h1 className="mt-4 text-h1">What clients say</h1>
              </div>
            ) : (
              <SectionHeader eyebrow="Testimonials" title="What clients say" />
            )}
          </Reveal>
        ) : null}

        {hasTestimonials ? (
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <Reveal as="li" key={`${item.name}-${item.company}`} className="h-full">
                <figure className="flex h-full flex-col rounded-lg border border-line bg-surface p-6 sm:p-8">
                  <Quote className="size-7 text-accent-text" strokeWidth={1.5} aria-hidden />
                  <blockquote className="mt-4 text-lead text-ink">{item.quote}</blockquote>
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
        ) : (
          <Reveal className="mt-10">
            <div className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <Quote
                  className="mt-1 size-7 shrink-0 text-accent-text"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div className="max-w-2xl space-y-2">
                  <p className="text-lead text-ink">
                    We publish a testimonial only when the client has approved the words and agreed
                    to be named.
                  </p>
                  <p className="text-muted">
                    Worked with us? We&apos;d value hearing how it went, and with your permission
                    we&apos;ll share it here.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <ButtonLink href={shareHref}>Share your experience</ButtonLink>
                <ButtonLink href={primaryCta.href} variant="secondary">
                  {primaryCta.label}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
