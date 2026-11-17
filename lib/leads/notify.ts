import { brandedText, mailRouting, sendEmail } from "@/lib/email";
import { serverEnv } from "@/lib/env.server";
import { site } from "@/lib/site";
import type { LeadInput } from "@/lib/validators";
import { activeCrmAdapters } from "./crm";
import type { LeadTier } from "./score";

export type LeadRecord = Omit<LeadInput, "website" | "turnstileToken"> & {
  requestType: string;
  score: number;
  tier: LeadTier;
  reasons: string[];
  receivedAt: string;
};

const nextSteps = {
  consultation: [
    "We read your request and reply by email.",
    "We arrange a consultation to understand the work.",
    "If it's a fit, we send a proposal with scope and price.",
  ],
  demo: [
    "We read your request and reply by email.",
    "We schedule a live demo around your use case.",
    "If it's a fit, we send a proposal with scope and price.",
  ],
};

function internalSummary(lead: LeadRecord) {
  const attribution = lead.attribution ?? {};
  return [
    `Request type: ${lead.requestType}`,
    `Priority: ${lead.tier} (score ${lead.score}: ${lead.reasons.join(", ")})`,
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company}`,
    `Service: ${lead.service}`,
    `Budget: ${lead.budget}`,
    "",
    lead.message,
    "",
    `Page: ${lead.page ?? "unknown"}`,
    `Landing page: ${attribution.landingPage ?? "unknown"}`,
    `Referrer: ${attribution.referrer ?? "direct"}`,
    `UTM: ${
      [attribution.utmSource, attribution.utmMedium, attribution.utmCampaign]
        .filter(Boolean)
        .join(" / ") || "none"
    }`,
  ].join("\n");
}

function visitorConfirmation(lead: LeadRecord) {
  const steps = nextSteps[lead.intent ?? "consultation"];
  return brandedText([
    `Hello ${lead.name},`,
    "",
    `Thank you for contacting ${site.legalName}. We've received your ${lead.requestType.toLowerCase()} about ${lead.service}.`,
    "",
    "What happens next:",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "You can reply to this email if you'd like to add anything.",
  ]);
}

async function postToSlack(lead: LeadRecord) {
  const url = serverEnv().SLACK_WEBHOOK_URL;
  if (!url) return "skipped" as const;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `New ${lead.requestType.toLowerCase()} (${lead.tier}): ${lead.name}, ${lead.company}, ${lead.service}, ${lead.budget}`,
      }),
    });
    return response.ok ? ("sent" as const) : ("failed" as const);
  } catch {
    return "failed" as const;
  }
}

// Returns true when at least one internal channel accepted the lead.
export async function deliverLead(lead: LeadRecord) {
  const [teamEmail, slack, ...crm] = await Promise.all([
    sendEmail({
      subject: `[${lead.tier.toUpperCase()}] ${lead.requestType}: ${lead.company}`,
      text: internalSummary(lead),
      replyTo: lead.email,
    }),
    postToSlack(lead),
    ...activeCrmAdapters().map((adapter) => adapter.createLead(lead)),
  ]);

  const delivered =
    teamEmail !== "failed" || slack === "sent" || crm.some((accepted) => accepted === true);

  // Only confirm to the visitor once the team actually has the request.
  if (delivered && teamEmail === "sent") {
    await sendEmail({
      to: lead.email,
      subject: `We've received your request | ${site.name}`,
      text: visitorConfirmation(lead),
      replyTo: mailRouting().replyTo,
    });
  }

  return delivered;
}
