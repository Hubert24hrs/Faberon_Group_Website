import type { Metadata } from "next";
import { ContactView } from "@/components/sections/contact-view";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a demo",
  description: `Request a live demo of software and AI agents from ${site.legalName}.`,
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return <ContactView intent="demo" />;
}
