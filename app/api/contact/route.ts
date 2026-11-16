import { NextResponse } from "next/server";
import { sendTeamEmail } from "@/lib/email";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  if (isRateLimited(`contact:${clientIp(request)}`, LIMIT, WINDOW_MS)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { name, email, company, service, budget, message, intent, website } = parsed.data;
  const requestType = intent === "demo" ? "Demo request" : "Consultation request";

  // Bots get a normal response, so they don't learn the field is a trap.
  if (website) return NextResponse.json({ ok: true });

  const result = await sendTeamEmail({
    subject: `${requestType}: ${company}`,
    replyTo: email,
    text: [
      `Request type: ${requestType}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      `Service: ${service}`,
      `Budget: ${budget}`,
      "",
      message,
    ].join("\n"),
  });

  if (result === "failed") {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
