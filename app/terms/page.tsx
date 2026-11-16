import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { formatAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms for using the ${site.legalName} website and apps.`,
  alternates: { canonical: "/terms" },
};

// TODO: have a lawyer review this before launch.
export default function TermsPage() {
  const owner = site.legalName;
  const email = site.contact.email;

  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" lead="Last updated 16 November 2026." />
      <div className="site-container py-16">
        <article className="prose-legal max-w-prose">
          <h2>About these terms</h2>
          <p>
            These terms cover your use of this website and of mobile apps published by {owner}, a
            company registered in Nigeria with its office at {formatAddress(site.contact.address)}.
            By using them, you accept these terms.
          </p>

          <h2>Project work</h2>
          <p>
            These terms don&apos;t cover paid work. Each project is governed by its own written
            agreement, which sets out scope, price, ownership and delivery. Nothing on this site is
            an offer or a binding commitment.
          </p>

          <h2>Our mobile apps</h2>
          <p>
            An app may have its own terms, shown in the app or its store listing, and those apply
            together with these terms. If you download an app from the Apple App Store, Apple&apos;s
            standard licence agreement for apps also applies. Our{" "}
            <a href="/privacy" className="text-accent-text underline">
              Privacy Policy
            </a>{" "}
            explains how our apps handle your data.
          </p>

          <h2>Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Break the law or infringe anyone&apos;s rights through our website or apps.</li>
            <li>Try to disrupt them or gain unauthorised access to them.</li>
            <li>Send spam or automated submissions through our forms.</li>
          </ul>

          <h2>Sample content</h2>
          <p>
            The agent console on our home page is a scripted sample. Its names and figures are
            fictional, and it doesn&apos;t show a real client system.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The content and design of our website and apps belong to {owner} or its licensors. You
            may view and share pages for ordinary purposes, but you may not copy them for commercial
            use without our permission.
          </p>

          <h2>Availability and accuracy</h2>
          <p>
            We work to keep our website and apps accurate and available, but they&apos;re provided
            as is, without warranties, to the extent the law allows.
          </p>

          <h2>Liability</h2>
          <p>
            To the extent the law allows, {owner} isn&apos;t liable for indirect or consequential
            loss arising from your use of our website or apps. Nothing here limits liability that
            can&apos;t be limited by law.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>

          <h2>Changes</h2>
          <p>We may update these terms. The date at the top shows the latest version.</p>

          <h2>Contact</h2>
          <p>
            {owner}, {formatAddress(site.contact.address)}
            {email ? (
              <>
                {". Email "}
                <a href={`mailto:${email}`} className="text-accent-text underline">
                  {email}
                </a>
              </>
            ) : null}
            {site.contact.phone ? `, phone ${site.contact.phone}` : ""}.
          </p>
        </article>
      </div>
    </>
  );
}
