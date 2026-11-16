import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { demoCta, site } from "@/lib/site";

const messages = [
  site.legalName,
  "Custom SaaS, AI agents and automation",
  "Mobile apps and websites",
  "Machine learning, data and cloud engineering",
  "You own the code and documentation",
  `Office in ${site.contact.address.locality}, ${site.contact.address.region}`,
  "Serving clients globally",
  "Request a demo",
];

// Scrolls right to left. The list is rendered twice so the loop has no gap,
// pauses on hover or focus, and stays still for reduced-motion users.
export function AnnouncementBar() {
  return (
    <Link
      href={demoCta.href}
      className="announcement relative flex h-9 items-center overflow-hidden bg-[var(--brand-navy)] text-[0.8125rem] text-[var(--brand-cream)]"
    >
      <span className="relative z-10 flex h-full shrink-0 items-center bg-[var(--brand-navy)] pr-3 pl-4 shadow-[8px_0_12px_var(--brand-navy)]">
        <ArrowRight className="size-4 text-[var(--brand-gold)]" strokeWidth={2} aria-hidden />
      </span>
      <span className="sr-only">
        {site.legalName}: {demoCta.label}
      </span>
      <span aria-hidden className="marquee-track flex w-max shrink-0">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex shrink-0 items-center">
            {messages.map((message) => (
              <span key={message} className="flex items-center whitespace-nowrap">
                <span
                  className={
                    message === demoCta.label
                      ? "px-5 font-semibold text-[var(--brand-gold)]"
                      : "px-5"
                  }
                >
                  {message}
                </span>
                <span className="size-1 rounded-full bg-[var(--brand-gold)]" />
              </span>
            ))}
          </span>
        ))}
      </span>
    </Link>
  );
}
