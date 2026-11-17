import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { apps } from "@/config/apps";
import { rcLabel } from "@/config/company";
import { processorSentence } from "@/content/processors";
import { formatAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.legalName} collects and uses personal data on its website and mobile apps.`,
  alternates: { canonical: "/privacy" },
};

// TODO: have a lawyer review this before launch.
export default function PrivacyPage() {
  const email = site.contact.email;
  const contactLink = email ? (
    <a href={`mailto:${email}`} className="text-accent-text underline">
      {email}
    </a>
  ) : (
    <Link href="/contact" className="text-accent-text underline">
      our contact page
    </Link>
  );

  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" lead="Last updated 17 November 2026." />
      <div className="site-container py-16">
        <article className="prose-legal max-w-prose">
          <h2>Who we are</h2>
          <p>
            {site.legalName} (&quot;we&quot;, &quot;us&quot;) is a technology company registered in
            Nigeria, with its office at {formatAddress(site.contact.address)}. We control the
            personal data described in this policy. It is written with the Nigeria Data Protection
            Act 2023 and the EU and UK GDPR in mind.
          </p>

          <h2>What this policy covers</h2>
          <ul>
            <li>This website.</li>
            <li>
              Mobile apps that {site.legalName} publishes under its own name on the Apple App Store
              and Google Play.
            </li>
          </ul>
          <p>
            When we build an app or system for a client and it&apos;s published under the
            client&apos;s name, the client controls that data and their privacy policy applies.
          </p>

          <h2>What we collect on this website</h2>
          <ul>
            <li>
              Details you send through our consultation form: name, email address, company, the
              service you&apos;re interested in, budget range and your message.
            </li>
            <li>Details you give when booking a consultation, if booking is available.</li>
            <li>Standard server logs, such as IP address, which also support rate limiting.</li>
          </ul>

          <h2>What our mobile apps may collect</h2>
          <p>
            Each app collects only what it needs to work. The App Store and Google Play listing for
            each app states exactly which data it collects. Depending on the app, this can include:
          </p>
          <ul>
            <li>Account details, such as your name and email address, if the app has accounts.</li>
            <li>Content you choose to enter or upload in the app.</li>
            <li>
              Device and diagnostic data, such as device model, operating system version and crash
              reports, used to fix problems.
            </li>
          </ul>
          <p>
            Our apps ask for permission before using your camera, location, contacts, microphone or
            photos, and only use that access for the feature you&apos;re using. You can withdraw a
            permission at any time in your device settings.
          </p>

          <h2>How we use your data</h2>
          <ul>
            <li>To reply to your enquiry and take steps before entering a contract with you.</li>
            <li>To provide and support the apps and services you use.</li>
            <li>To keep our website and apps secure and prevent abuse.</li>
            <li>To meet our legal obligations.</li>
          </ul>
          <p>
            We don&apos;t sell your data, we don&apos;t use it for advertising, and we don&apos;t
            use it for automated decisions that have legal effects on you.
          </p>

          <h2>Who we share it with</h2>
          <p>
            We use service providers that process data for us and only on our instructions:{" "}
            {processorSentence()}. Any other provider an app uses, such as for crash reporting, is
            named in that app&apos;s store listing. We may also disclose data where the law requires
            it.
          </p>

          <h2>International transfers</h2>
          <p>
            Our providers may process data outside your country, including in the United States.
            Where the law requires it, we rely on appropriate safeguards for those transfers.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep enquiries for up to 24 months after our last contact unless they lead to a
            project. We keep app account data for as long as your account is open, then delete it.
            Project records are kept for as long as our contracts and the law require.
          </p>

          {/* Linked from app store listings: /privacy#account-deletion (the older
              /privacy#delete-account anchor still works). */}
          <span id="delete-account" aria-hidden="true" />
          <h2 id="account-deletion">Deleting your account and data</h2>
          <p>
            Where an app has accounts, you can delete your account from within the app. You can also
            ask us to delete your account and data by emailing {contactLink}. We&apos;ll confirm
            once it&apos;s done.
          </p>
          <p>
            You can also use the request form on our{" "}
            <Link href="/delete-account" className="text-accent-text underline">
              account and data deletion page
            </Link>
            , which works without the app installed. Before deleting anything, we confirm the
            account is yours by replying to its email address.
          </p>
          <p>
            When your account is deleted, we delete your app account data, which we keep only for as
            long as your account is open. Enquiries are kept for up to 24 months after our last
            contact unless they lead to a project, and project records are kept for as long as our
            contracts and the law require.
          </p>

          <h2>Children</h2>
          <p>
            Our website and apps are not directed at children under 13, and we don&apos;t knowingly
            collect their data. If you believe a child has given us personal data, contact us and
            we&apos;ll delete it.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you can ask to access, correct, delete or move your data,
            and object to or restrict how we use it. You can also complain to the Nigeria Data
            Protection Commission or your local data protection authority.
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            This website doesn&apos;t use advertising or tracking cookies. Your theme choice is
            stored in your own browser. If we enable website analytics, we use Plausible, which
            doesn&apos;t use cookies or collect personal data. A booking embed may set its own
            cookies.
          </p>

          <h2>Security</h2>
          <p>
            We protect data with access controls and encrypted connections. No system is perfectly
            secure, so we can&apos;t guarantee absolute security.
          </p>

          <h2>Changes</h2>
          <p>We&apos;ll update this page when this policy changes, and change the date above.</p>

          {apps.length > 0 ? (
            <>
              <h2 id="app-specific-information">App-specific information</h2>
              {apps.map((app) => (
                <section key={app.slug} id={app.slug} aria-labelledby={`${app.slug}-title`}>
                  <h3 id={`${app.slug}-title`}>{app.name}</h3>
                  <p>{app.dataNotes ?? app.shortDescription}</p>
                </section>
              ))}
            </>
          ) : null}

          <h2 id="contact">Contact</h2>
          <p>
            {site.legalName}
            {rcLabel() ? ` (${rcLabel()})` : ""}, {formatAddress(site.contact.address)}. To ask
            about your data or use your rights, contact {contactLink}
            {site.contact.phone ? ` or call ${site.contact.phone}` : ""}.
          </p>
          <p>
            You can also reach us through our{" "}
            <Link href="/contact" className="text-accent-text underline">
              contact form
            </Link>{" "}
            or our{" "}
            <Link href="/support" className="text-accent-text underline">
              support page
            </Link>
            .
          </p>
        </article>
      </div>
    </>
  );
}
