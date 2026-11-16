import type { Metadata } from "next";
import { FinalCta } from "@/components/sections/final-cta";
import {
  hasTestimonials,
  TestimonialsCorridor,
  TestimonialsSection,
} from "@/components/sections/testimonials-section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description: `What clients say about working with ${site.legalName}.`,
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      {hasTestimonials ? <h1 className="sr-only">Testimonials</h1> : null}
      <TestimonialsCorridor />
      <div className="site-container pt-10">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Testimonials", href: "/testimonials" },
          ]}
        />
      </div>
      {/* With the corridor above, its title already heads the page. */}
      <TestimonialsSection
        id="client-testimonials"
        headingLevel={hasTestimonials ? "h2" : "h1"}
        bordered={false}
      />
      <FinalCta />
    </>
  );
}
