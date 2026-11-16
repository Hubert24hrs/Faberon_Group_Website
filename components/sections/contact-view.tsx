import { ConsultationForm } from "@/components/forms/consultation-form";
import { FaqSection } from "@/components/sections/faq-section";
import { CompanyDetails } from "@/components/ui/company-details";
import { PageHeader } from "@/components/ui/page-header";
import { contactFaqs } from "@/content/faqs";
import { getBookingUrl } from "@/lib/booking";

const copy = {
  consultation: {
    eyebrow: "Contact",
    title: "Book a consultation",
    lead: "Tell us what you need built. A person on our team will read it and reply.",
    steps: [
      "We read your request and reply by email.",
      "We arrange a consultation to understand the work.",
      "If it's a fit, we send a proposal with scope and price.",
    ],
  },
  demo: {
    eyebrow: "Request a demo",
    title: "See how we'd build it",
    lead: "Tell us about your business and what you'd like to see. We'll walk you through working software and AI agents like the ones you need.",
    steps: [
      "We read your request and reply by email.",
      "We schedule a live demo around your use case.",
      "If it's a fit, we send a proposal with scope and price.",
    ],
  },
};

export function ContactView({ intent }: { intent: "consultation" | "demo" }) {
  const bookingUrl = getBookingUrl();
  const text = copy[intent];

  return (
    <>
      <PageHeader eyebrow={text.eyebrow} title={text.title} lead={text.lead} />

      <div className="site-container grid gap-12 py-section lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ConsultationForm intent={intent} nextSteps={text.steps} />
        </div>

        <aside className="space-y-10 lg:col-span-5">
          <section aria-labelledby="company-details">
            <h2 id="company-details" className="text-h3">
              Company details
            </h2>
            <div className="mt-4 rounded-lg border border-line bg-surface px-5">
              <CompanyDetails />
            </div>
          </section>

          <section aria-labelledby="next-steps">
            <h2 id="next-steps" className="eyebrow font-sans font-normal">
              What happens next
            </h2>
            <ol className="mt-5 space-y-4">
              {text.steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2rem_1fr]">
                  <span className="pt-1 font-mono text-xs text-subtle">{index + 1}</span>
                  <span className="text-muted">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      {bookingUrl ? (
        <section className="border-t border-line py-section">
          <div className="site-container">
            <h2 className="text-h2">Prefer to pick a time?</h2>
            <iframe
              src={bookingUrl}
              title="Book a consultation time"
              loading="lazy"
              className="mt-8 h-[700px] w-full rounded-lg border border-line bg-surface"
            />
          </div>
        </section>
      ) : null}

      <FaqSection faqs={contactFaqs} title="Before you get in touch" />
    </>
  );
}
