import { NextResponse } from "next/server";
import { isDisposableEmail } from "@/lib/leads/email-checks";
import { deliverLead } from "@/lib/leads/notify";
import { scoreLead } from "@/lib/leads/score";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { leadSchema } from "@/lib/validators";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(`lead:${ip}`, LIMIT, WINDOW_MS)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { website, turnstileToken, ...lead } = parsed.data;

  // Bots get a normal response, so they don't learn the field is a trap.
  if (website) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ error: "verification_failed" }, { status: 400 });
  }
  if (isDisposableEmail(lead.email)) {
    return NextResponse.json({ error: "disposable_email" }, { status: 400 });
  }

  const { score, tier, reasons } = scoreLead(parsed.data);
  const delivered = await deliverLead({
    ...lead,
    requestType: lead.intent === "demo" ? "Demo request" : "Consultation request",
    score,
    tier,
    reasons,
    receivedAt: new Date().toISOString(),
  });

  if (!delivered) {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
