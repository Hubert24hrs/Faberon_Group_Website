import type { Service } from "@/content/services";
import { site } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address.street,
      addressLocality: site.contact.address.locality,
      addressRegion: site.contact.address.region,
      addressCountry: site.contact.address.countryCode,
    },
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.socials.length > 0 ? { sameAs: site.socials.map((social) => social.href) } : {}),
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`, site.url),
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
