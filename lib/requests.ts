import { NextResponse } from "next/server";
import { z } from "zod";
import { brandedText, makeReference, mailRouting, sendEmail, type Inbox } from "@/lib/email";
import { isDisposableEmail } from "@/lib/leads/email-checks";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

type Base = { email: string; website?: string; turnstileToken?: string };

/**
 * Handles a support or privacy request end to end: rate limit, server-side validation,
 * spam trap, bot check, team notification, and an acknowledgement with a reference ID.
 * Nothing is stored: the request exists only in the two emails.
 */
export async function handleRequest<S extends z.ZodType<Base>>(
  request: Request,
  options: {
    schema: S;
    /** Prefix for reference IDs, e.g. "SUP". */
    prefix: string;
    inbox: Inbox;
    limit?: { count: number; windowMs: number };
    team: (data: z.infer<S>, reference: string) => { subject: string; text: string };
    acknowledgement: (data: z.infer<S>, reference: string) => { subject: string; lines: string[] };
  },
) {
  const { count = 5, windowMs = 10 * 60 * 1000 } = options.limit ?? {};
  const ip = clientIp(request);
  if (isRateLimited(`${options.prefix}:${ip}`, count, windowMs)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = options.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", fieldErrors: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // The spam trap is hidden from people, so a value means a bot.
  if (data.website) return NextResponse.json({ error: "invalid" }, { status: 400 });

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }
  if (isDisposableEmail(data.email)) {
    return NextResponse.json({ error: "disposable_email" }, { status: 400 });
  }

  const reference = makeReference(options.prefix);
  const team = options.team(data, reference);
  const teamResult = await sendEmail({
    inbox: options.inbox,
    subject: `${team.subject} [${reference}]`,
    text: team.text,
    replyTo: data.email,
  });

  if (teamResult === "failed") {
    console.error(`Request ${reference} could not be delivered to the ${options.inbox} inbox.`);
    return NextResponse.json({ error: "send_failed", reference }, { status: 502 });
  }

  // Acknowledge only once the team has the request.
  if (teamResult === "sent") {
    const ack = options.acknowledgement(data, reference);
    const ackResult = await sendEmail({
      to: data.email,
      subject: `${ack.subject} [${reference}]`,
      text: brandedText(ack.lines),
      replyTo: mailRouting().inboxes[options.inbox],
    });
    if (ackResult === "failed") {
      console.error(`Request ${reference}: the acknowledgement email failed.`);
    }
  }

  return NextResponse.json({ ok: true, reference });
}
