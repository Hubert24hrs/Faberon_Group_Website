import { leaders } from "@/content/leadership";
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

// Organization and ProfessionalService (a LocalBusiness type) in one node.
// Geo coordinates are left out until the office location is confirmed on a map.
export function organizationJsonLd() {
  const founder = leaders[0];
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/faberon-logo.svg", site.url),
    image: absoluteUrl("/opengraph-image", site.url),
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
    ...(founder
      ? {
          founder: {
            "@type": "Person",
            name: founder.name,
            jobTitle: founder.role,
            sameAs: founder.links.map((link) => link.href),
          },
        }
      : {}),
    ...(site.socials.length > 0 ? { sameAs: site.socials.map((social) => social.href) } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href, site.url),
    })),
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
    provider: { "@id": `${site.url}/#organization` },
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
