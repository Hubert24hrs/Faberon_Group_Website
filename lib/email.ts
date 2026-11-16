import { Resend } from "resend";
import { serverEnv } from "@/lib/env.server";

type Outgoing = { to?: string; subject: string; text: string; replyTo?: string };

export type SendResult = "sent" | "skipped" | "failed";

// Plain text only, so visitor input can't inject markup into the email.
// Without a `to`, the email goes to the team inbox.
export async function sendEmail({ to, subject, text, replyTo }: Outgoing): Promise<SendResult> {
  const env = serverEnv();
  const recipient = to ?? env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL;

  if (!env.RESEND_API_KEY || !recipient || !from) {
    // Lets the form be tested locally. Production must report the failure.
    if (process.env.NODE_ENV !== "production") return "skipped";
    console.error("Email is not configured: set the RESEND and CONTACT variables.");
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
