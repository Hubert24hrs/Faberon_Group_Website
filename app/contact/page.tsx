import type { Metadata } from "next";
import { ContactView } from "@/components/sections/contact-view";
import { site } from "@/lib/site";
import { company } from "@/config/company";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.legalName} in ${company.registeredAddress.locality}, ${company.registeredAddress.region}, or book a consultation about your project.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView intent="consultation" />;
}
