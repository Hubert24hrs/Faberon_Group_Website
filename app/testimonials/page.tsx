import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/sections/final-cta";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Endless, type CorridorCard } from "@/components/ui/endless";
import { principles, values } from "@/content/company";
import { testimonials } from "@/content/testimonials";
import { primaryCta, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description: `What clients say about working with ${site.legalName}, and what every client can count on.`,
  alternates: { canonical: "/testimonials" },
};

// Until real, approved quotes are added to content/testimonials.ts, the corridor shows
// the company's own commitments, labelled as such. Never present them as client quotes.
const commitments = [...values, ...principles];

export default function TestimonialsPage() {
  const hasQuotes = testimonials.length > 0;
  const cards: CorridorCard[] = hasQuotes
    ? testimonials.map((item) => ({
        text: item.quote,
        title: item.name,
        detail: `${item.role}, ${item.company}`,
      }))
    : commitments.map((item) => ({
        kicker: "Our commitment",
        text: item.detail,
        title: item.name,
        detail: site.legalName,
      }));

  const shareHref = site.contact.email
    ? `mailto:${site.contact.email}?subject=${encodeURIComponent(`Testimonial for ${site.name}`)}`
    : "/contact";

  return (
    <>
      <h1 className="sr-only">Testimonials</h1>
      <Endless
        items={cards}
        title={hasQuotes ? "What clients say" : "What every client can count on"}
        caption={`${site.name}, from Lagos to clients worldwide`}
      />

      <section aria-labelledby="client-testimonials" className="border-t border-line py-section">
        <div className="site-container">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Testimonials", href: "/testimonials" },
            ]}
          />
          <p className="eyebrow mt-10">Testimonials</p>
          <h2 id="client-testimonials" className="mt-4 text-h2">
            {hasQuotes ? "In our clients' words" : "Client testimonials"}
          </h2>

          {hasQuotes ? (
            <ul className="mt-12 grid gap-4 md:grid-cols-2">
              {testimonials.map((item) => (
                <Reveal as="li" key={`${item.name}-${item.company}`} className="h-full">
                  <figure className="flex h-full flex-col rounded-lg border border-line bg-surface p-6 sm:p-8">
                    <span
                      aria-hidden
                      className="font-display text-5xl leading-none text-accent-text"
                    >
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
          ) : (
            <div className="mt-6 grid gap-10 lg:grid-cols-12">
              <div className="space-y-4 text-lead text-muted lg:col-span-7">
                <p>
                  We publish a testimonial only when the client has approved the words and agreed to
                  be named. No paraphrasing, and nothing made up.
                </p>
                <p>
                  Worked with us? We&apos;d value hearing how it went, and with your permission
                  we&apos;ll share it here.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <ButtonLink href={shareHref}>Share your experience</ButtonLink>
                  <ButtonLink href={primaryCta.href} variant="secondary">
                    {primaryCta.label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {hasQuotes ? null : (
        <section aria-labelledby="commitments" className="border-t border-line py-section">
          <div className="site-container">
            <p className="eyebrow">Our commitments</p>
            <h2 id="commitments" className="mt-4 text-h2">
              What every client can count on
            </h2>
            <ul className="mt-10 grid gap-x-10 md:grid-cols-2">
              {commitments.map((item) => (
                <Reveal as="li" key={item.name}>
                  <div className="border-t border-line py-6">
                    <h3 className="text-h3">{item.name}</h3>
                    <p className="mt-1.5 text-muted">{item.detail}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
      <FinalCta />
    </>
  );
}
