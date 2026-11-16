import type { Metadata } from "next";
import { ContactView } from "@/components/sections/contact-view";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.legalName} in Lekki, Lagos, or book a consultation about your project.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView intent="consultation" />;
}
