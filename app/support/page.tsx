import type { Metadata } from "next";
import Link from "next/link";
import { RequestForm, type FieldSpec } from "@/components/forms/request-form";
import { FaqSection } from "@/components/sections/faq-section";
import { CompanyDetails } from "@/components/ui/company-details";
import { PageHeader } from "@/components/ui/page-header";
import { apps } from "@/config/apps";
import { company } from "@/config/company";
import { telHref } from "@/lib/site";
import { appOptions, messageMaxLength } from "@/lib/validators";

export const metadata: Metadata = {
  title: "Support",
  description: `Get help with apps published by ${company.storeDeveloperName}, or with this website.`,
  alternates: { canonical: "/support" },
};

const fields: FieldSpec[] = [
  { kind: "text", name: "name", label: "Name", required: true, autoComplete: "name" },
  { kind: "email", name: "email", label: "Email", required: true, autoComplete: "email" },
  { kind: "select", name: "app", label: "What is it about?", required: true, options: appOptions },
  {
    kind: "text",
    name: "device",
    label: "Device and OS version",
    hint: "For app problems, for example iPhone 15, iOS 18.1 or Pixel 8, Android 15.",
  },
  {
    kind: "textarea",
    name: "message",
    label: "What happened?",
    required: true,
    maxLength: messageMaxLength,
    hint: "What you were doing, what you expected, and what happened instead.",
  },
];

const supportFaqs = [
  {
    question: "How do I delete my account or my data?",
    answer:
      "Use the account settings in the app, the request form on our account and data deletion page, or email us. You don't need the app installed to ask.",
    link: { label: "Account and data deletion", href: "/delete-account" },
  },
  {
    question: "Where is your privacy policy?",
    answer:
      "Our privacy policy covers this website and the apps we publish under our own name: what we collect, who we share it with, how long we keep it and how to delete it.",
    link: { label: "Privacy Policy", href: "/privacy" },
  },
  {
    question: "How do I report a bug?",
    answer:
      "Send a request with the form on this page. Include the app, your device and OS version, and the steps that cause the problem. We may ask for a screenshot by email.",
  },
  {
    question: "How do I manage a purchase or subscription?",
    answer:
      "Purchases and subscriptions bought through the App Store or Google Play are managed in your Apple or Google account, not by us. Cancel or request a refund there. Deleting an app or an account does not cancel a store subscription.",
  },
];

export default function SupportPage() {
  const { support } = company.emails;

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="How can we help?"
        lead={`Support for people using apps published by ${company.storeDeveloperName}, and for visitors to this website.`}
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Support", href: "/support" },
        ]}
      />

      <div className="site-container grid gap-12 py-section lg:grid-cols-12">
        <section aria-labelledby="support-request" className="lg:col-span-7">
          <h2 id="support-request" className="text-h3">
            Send a support request
          </h2>
          <p className="mt-2 text-muted">
            A person on our team reads every request and replies by email
            {company.supportResponseTime ? `, ${company.supportResponseTime}` : ""}. You&apos;ll get
            an email with a reference straight away.
          </p>
          <div className="mt-8">
            <RequestForm
              endpoint="/api/support"
              schema="support"
              fields={fields}
              submitLabel="Send request"
              successTitle="Request sent"
              successText="We've emailed you a copy with your reference. We'll reply to the email address you gave."
              fallbackEmail={support}
              fallbackSubject="Support request"
            />
          </div>
        </section>

        <aside className="space-y-10 lg:col-span-5">
          <section aria-labelledby="support-contact">
            <h2 id="support-contact" className="text-h3">
              Other ways to reach us
            </h2>
            <ul className="mt-4 space-y-2 text-muted">
              <li>
                Email:{" "}
                <a href={`mailto:${support}`} className="text-accent-text underline">
                  {support}
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href={telHref(company.phone.e164)} className="text-accent-text underline">
                  {company.phone.display}
                </a>
              </li>
              <li>Post: {company.registeredAddress.formatted}</li>
            </ul>
          </section>

          <section aria-labelledby="support-include">
            <h2 id="support-include" className="text-h3">
              What to include
            </h2>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-muted">
              <li>The app or page the request is about.</li>
              <li>Your device and its operating system version.</li>
              <li>What you did, what you expected and what happened.</li>
              <li>The email address on your account, if the request is about an account.</li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              To delete an account or data, use the{" "}
              <Link href="/delete-account" className="text-accent-text underline">
                account and data deletion page
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="company-details">
            <h2 id="company-details" className="text-h3">
              Company details
            </h2>
            <div className="mt-4">
              <CompanyDetails />
            </div>
          </section>
        </aside>
      </div>

      {apps.length > 0 ? (
        <section aria-labelledby="app-support" className="border-t border-line py-section">
          <div className="site-container">
            <h2 id="app-support" className="text-h2">
              App support
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {apps.map((app) => (
                <article
                  key={app.slug}
                  id={app.slug}
                  className="rounded-lg border border-line bg-surface p-6"
                >
                  <h3 className="text-h3">{app.name}</h3>
                  <p className="mt-2 text-muted">{app.shortDescription}</p>
                  <p className="mt-3 text-sm">
                    Support email:{" "}
                    <a
                      href={`mailto:${app.supportEmail ?? support}`}
                      className="text-accent-text underline"
                    >
                      {app.supportEmail ?? support}
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FaqSection faqs={supportFaqs} title="Support questions" />
    </>
  );
}
