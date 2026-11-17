import Link from "next/link";
import { apps } from "@/config/apps";
import { services } from "@/content/services";
import { features, formatAddress, site, telHref } from "@/lib/site";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Logo } from "./logo";
import { hasTestimonials } from "@/content/testimonials";

const company = [
  { label: "About Us", href: "/about" },
  { label: "Leadership", href: "/about#leadership" },
  { label: "Solutions", href: "/solutions" },
  ...(hasTestimonials ? [{ label: "Testimonials", href: "/testimonials" }] : []),
  ...(features.work ? [{ label: "Work", href: "/work" }] : []),
  ...(features.insights ? [{ label: "Insights", href: "/insights" }] : []),
  { label: "Contact", href: "/contact" },
];

const legal = [
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  // Shown once an app is published; Privacy and Support always link to it.
  ...(apps.length > 0 ? [{ label: "Account and data deletion", href: "/delete-account" }] : []),
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="eyebrow font-sans font-normal text-subtle">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-muted transition-colors hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { email, phone } = site.contact;

  return (
    <footer className="border-t border-line">
      <div className="site-container grid grid-cols-2 gap-10 py-14 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <Link href="/" aria-label={`${site.legalName} home`} className="inline-block text-ink">
            <Logo large />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted">{site.tagline}</p>
          <address className="mt-6 max-w-xs space-y-1.5 text-sm text-muted not-italic">
            <p className="font-medium text-ink">{site.legalName}</p>
            <p>{formatAddress(site.contact.address)}</p>
            {email ? (
              <p>
                <a href={`mailto:${email}`} className="hover:text-ink">
                  {email}
                </a>
              </p>
            ) : null}
            {phone ? (
              <p>
                <a href={telHref(phone)} className="hover:text-ink">
                  {phone}
                </a>
              </p>
            ) : null}
          </address>
          {features.newsletter ? <NewsletterForm /> : null}
        </div>
        <div className="md:col-span-3">
          <FooterColumn
            title="Services"
            links={services.map((service) => ({
              label: service.name,
              href: `/services/${service.slug}`,
            }))}
          />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Company" links={company} />
        </div>
        <div className="md:col-span-2">
          <FooterColumn title="Help and legal" links={legal} />
          {site.socials.length > 0 ? (
            <div className="mt-8">
              <h2 className="eyebrow font-sans font-normal text-subtle">Follow us</h2>
              <ul className="mt-4 space-y-2.5">
                {site.socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="site-container flex flex-col gap-1 py-6 text-sm text-subtle sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {site.legalName}. All rights reserved.
            {site.registrationNumber ? ` RC ${site.registrationNumber}.` : ""}
          </p>
          <p>{site.base}, serving clients globally</p>
        </div>
      </div>
    </footer>
  );
}
