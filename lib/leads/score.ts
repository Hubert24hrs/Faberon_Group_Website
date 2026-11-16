import { isFreeMailEmail } from "./email-checks";
import type { LeadInput } from "@/lib/validators";

export type LeadTier = "hot" | "warm" | "cold";

const budgetPoints: Record<string, number> = {
  "Under $10,000": 1,
  "$10,001 to $25,000": 2,
  "$25,001 to $100,000": 3,
  "$100,001 or more": 4,
  "Not yet sure": 1,
};

const coreServices = new Set(["Custom SaaS", "AI agents", "AI automation", "Mobile app"]);

// A rough priority signal for the team, not a judgement of the enquiry.
export function scoreLead(lead: LeadInput) {
  const reasons: string[] = [];
  let score = budgetPoints[lead.budget] ?? 1;
  reasons.push(`Budget: ${lead.budget}`);

  if (coreServices.has(lead.service)) {
    score += 1;
    reasons.push("Core service");
  }
  if (!isFreeMailEmail(lead.email)) {
    score += 1;
    reasons.push("Company email domain");
  }
  if (lead.intent === "demo") {
    score += 1;
    reasons.push("Asked for a demo");
  }
  if (lead.message.length >= 200) {
    score += 1;
    reasons.push("Detailed brief");
  }

  const tier: LeadTier = score >= 6 ? "hot" : score >= 4 ? "warm" : "cold";
  return { score, tier, reasons };
}
