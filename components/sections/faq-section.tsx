import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { faqs as homeFaqs } from "@/content/company";
import type { Faq } from "@/content/faqs";
import { JsonLd, faqJsonLd } from "@/lib/seo";

// Each page should render at most one FaqSection, since it emits FAQPage data.
export function FaqSection({
  faqs = homeFaqs,
  title = "Questions we get asked",
}: {
  faqs?: Faq[];
  title?: string;
}) {
  return (
    <section id="faq" className="border-t border-line py-section">
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="site-container grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <SectionHeader eyebrow="FAQ" title={title} />
        </Reveal>
        <div className="lg:col-span-8">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-t border-line last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  className="size-5 shrink-0 text-subtle transition-transform group-open:rotate-45"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </summary>
              <div className="max-w-prose pb-5">
                <p className="text-muted">{faq.answer}</p>
                {faq.link ? (
                  <Link
                    href={faq.link.href}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline"
                  >
                    {faq.link.label}
                    <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden />
                  </Link>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
