import type { Metadata } from "next";
import Link from "next/link";
import { RequestForm, type FieldSpec } from "@/components/forms/request-form";
import { PageHeader } from "@/components/ui/page-header";
import { apps } from "@/config/apps";
import { company } from "@/config/company";
import { appOptions, deletionRequestTypes } from "@/lib/validators";

export const metadata: Metadata = {
  title: "Delete your account or data",
  description: `How to delete your account or data from apps published by ${company.storeDeveloperName}: in the app, with the form on this page, or by email.`,
  alternates: { canonical: "/delete-account" },
};

const fields: FieldSpec[] = [
  { kind: "select", name: "app", label: "Which app?", required: true, options: appOptions },
  {
    kind: "email",
    name: "email",
    label: "Email address you use in the app",
    required: true,
    autoComplete: "email",
    hint: "We'll write to this address to confirm the account is yours.",
  },
  {
    kind: "text",
    name: "username",
    label: "Username, if the app uses one",
    autoComplete: "username",
  },
  {
    kind: "radio",
    name: "requestType",
    label: "What would you like deleted?",
    required: true,
    options: Object.entries(deletionRequestTypes).map(([value, label]) => ({ value, label })),
  },
  {
    kind: "textarea",
    name: "details",
    label: "Details",
    maxLength: 2000,
    rows: 4,
    hint: "If you're asking us to delete specific data, tell us which.",
  },
  {
    kind: "checkbox",
    name: "confirmOwner",
    label: "I confirm this account belongs to me.",
    required: true,
  },
];

export default function DeleteAccountPage() {
  const privacyEmail = company.emails.privacy;
  const mailto = `mailto:${privacyEmail}?subject=${encodeURIComponent("Account deletion request")}`;
  const appNames = apps.map((app) => app.name);
  const subscriptionApps = apps.filter((app) => app.hasSubscriptions);
  const inAppPaths = apps.filter((app) => app.inAppDeletionPath);

  return (
    <>
      <PageHeader
        eyebrow="Account and data deletion"
        title="Delete your account or data"
        lead={
          appNames.length > 0
            ? `For ${appNames.join(", ")}, published by ${company.storeDeveloperName}.`
            : `For apps published by ${company.storeDeveloperName}.`
        }
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Delete your account or data", href: "/delete-account" },
        ]}
      />

      <div className="site-container grid gap-12 py-section lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <section aria-labelledby="how-to-delete">
            <h2 id="how-to-delete" className="text-h2">
              Three ways to ask
            </h2>
            <p className="mt-3 text-muted">
              Choose whichever suits you. You don&apos;t need the app installed to use this page or
              to email us.
            </p>
            <ol className="mt-6 space-y-4">
              <li className="rounded-lg border border-line bg-surface p-5">
                <p className="font-medium text-ink">1. In the app</p>
                {inAppPaths.length > 0 ? (
                  <ul className="mt-1.5 space-y-1 text-muted">
                    {inAppPaths.map((app) => (
                      <li key={app.slug}>
                        {app.name}: {app.inAppDeletionPath}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-muted">
                    Where an app has accounts, open its account settings and choose to delete your
                    account.
                  </p>
                )}
              </li>
              <li className="rounded-lg border border-line bg-surface p-5">
                <p className="font-medium text-ink">2. With the form on this page</p>
                <p className="mt-1.5 text-muted">
                  <a href="#deletion-request" className="text-accent-text underline">
                    Fill in the request form
                  </a>
                  . You&apos;ll get an email with a reference straight away.
                </p>
              </li>
              <li className="rounded-lg border border-line bg-surface p-5">
                <p className="font-medium text-ink">3. By email</p>
                <p className="mt-1.5 text-muted">
                  Email{" "}
                  <a href={mailto} className="text-accent-text underline">
                    {privacyEmail}
                  </a>{" "}
                  from the address you use in the app, with the subject &ldquo;Account deletion
                  request&rdquo;.
                </p>
              </li>
            </ol>
          </section>

          <section aria-labelledby="deletion-request-title" id="deletion-request">
            <h2 id="deletion-request-title" className="text-h2">
              Request deletion
            </h2>
            <p className="mt-3 text-muted">
              Before we delete anything, we confirm the account is yours by replying to the
              account&apos;s email address.
            </p>
            <div className="mt-8">
              <RequestForm
                endpoint="/api/deletion"
                schema="deletion"
                fields={fields}
                submitLabel="Send deletion request"
                successTitle="Request received"
                successText="We've emailed you a confirmation with your reference. Next, we'll write to the account's email address to confirm it's yours."
                fallbackEmail={privacyEmail}
                fallbackSubject="Account deletion request"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-10 lg:col-span-5">
          <section aria-labelledby="what-happens">
            <h2 id="what-happens" className="text-h3">
              What happens next
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted">
              <li>We reply to the account&apos;s email address to confirm it&apos;s yours.</li>
              <li>
                {company.deletionWindowDays
                  ? `Once confirmed, we complete the deletion within ${company.deletionWindowDays} days.`
                  : "Once confirmed, we carry out the deletion."}
              </li>
              <li>We email you when the deletion is complete.</li>
            </ol>
          </section>

          <section aria-labelledby="what-is-deleted">
            <h2 id="what-is-deleted" className="text-h3">
              What we delete and what we keep
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
              <li>
                Deleting your account deletes your app account data. We keep app account data only
                for as long as your account is open.
              </li>
              <li>
                Enquiries you&apos;ve sent us are kept for up to 24 months after our last contact,
                unless they lead to a project.
              </li>
              <li>Project records are kept for as long as our contracts and the law require.</li>
            </ul>
            <p className="mt-4 text-sm text-muted">
              Read more in the{" "}
              <Link href="/privacy#account-deletion" className="text-accent-text underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          {subscriptionApps.length > 0 ? (
            <section aria-labelledby="subscriptions">
              <h2 id="subscriptions" className="text-h3">
                Subscriptions
              </h2>
              <p className="mt-4 text-muted">
                Deleting your account does not cancel a subscription bought through the App Store or
                Google Play ({subscriptionApps.map((app) => app.name).join(", ")}). Cancel it in
                your Apple or Google account as well.
              </p>
            </section>
          ) : null}

          <section aria-labelledby="deletion-help">
            <h2 id="deletion-help" className="text-h3">
              Need help?
            </h2>
            <p className="mt-4 text-muted">
              Visit{" "}
              <Link href="/support" className="text-accent-text underline">
                Support
              </Link>{" "}
              or email{" "}
              <a href={`mailto:${privacyEmail}`} className="text-accent-text underline">
                {privacyEmail}
              </a>
              .
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
