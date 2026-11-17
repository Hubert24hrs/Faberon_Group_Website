import { Resend } from "resend";
import { company, rcLabel } from "@/config/company";
import { SITE_URL } from "@/lib/env";
import { serverEnv } from "@/lib/env.server";

export type SendResult = "sent" | "skipped" | "failed";

/** Which inbox a team notification goes to. */
export type Inbox = "leads" | "support" | "privacy";

type Outgoing = { to?: string; inbox?: Inbox; subject: string; text: string; replyTo?: string };

/**
 * Where mail comes from and goes to. Each value falls back to today's working variable:
 * EMAIL_FROM to CONTACT_FROM_EMAIL, LEADS_NOTIFY_EMAIL to CONTACT_TO_EMAIL, and the
 * support and privacy inboxes to the leads inbox.
 */
export function mailRouting() {
  const env = serverEnv();
  const leads = env.LEADS_NOTIFY_EMAIL ?? env.CONTACT_TO_EMAIL;
  return {
    from: env.EMAIL_FROM ?? env.CONTACT_FROM_EMAIL,
    replyTo: env.EMAIL_REPLY_TO ?? leads,
    inboxes: {
      leads,
      support: env.SUPPORT_NOTIFY_EMAIL ?? leads,
      privacy: env.PRIVACY_NOTIFY_EMAIL ?? leads,
    } satisfies Record<Inbox, string | undefined>,
  };
}

/** A short reference people can quote, e.g. "SUP-20261117-7KQ2XM". */
export function makeReference(prefix: string) {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((byte) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[byte % 32])
    .join("");
  return `${prefix}-${date}-${random}`;
}

/** The branded plain-text layout every outgoing email uses, with company details. */
export function brandedText(lines: string[]) {
  return [
    ...lines,
    "",
    "—",
    company.legalName,
    ...(rcLabel() ? [rcLabel() as string] : []),
    company.registeredAddress.formatted,
    [company.emails.general, company.phone.display].join(" · "),
    SITE_URL,
  ].join("\n");
}

// Plain text only, so visitor input can't inject markup into the email.
// Without a `to`, the email goes to the team inbox for `inbox` (leads by default).
export async function sendEmail({
  to,
  inbox = "leads",
  subject,
  text,
  replyTo,
}: Outgoing): Promise<SendResult> {
  const env = serverEnv();
  const routing = mailRouting();
  const recipient = to ?? routing.inboxes[inbox];
  const from = routing.from;

  if (!env.RESEND_API_KEY || !recipient || !from) {
    // Lets the forms be tested locally. Production must report the failure.
    if (process.env.NODE_ENV !== "production") return "skipped";
    console.error(
      "Email is not configured: set RESEND_API_KEY and the sender and inbox variables.",
    );
    return "failed";
  }

  try {
    const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
      from,
      to: recipient,
      subject,
      text,
      replyTo,
    });
    if (error) {
      console.error("Resend rejected the email:", error.name);
      return "failed";
    }
    return "sent";
  } catch {
    console.error("Resend request failed.");
    return "failed";
  }
}

export function sendTeamEmail(message: Omit<Outgoing, "to">) {
  return sendEmail(message);
}
