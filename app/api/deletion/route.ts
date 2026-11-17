import { company } from "@/config/company";
import { handleRequest } from "@/lib/requests";
import { deletionRequestTypes, deletionSchema } from "@/lib/validators";

// Account and data deletion requests. Lower limit than support: these are rare.
export async function POST(request: Request) {
  return handleRequest(request, {
    schema: deletionSchema,
    prefix: "DEL",
    inbox: "privacy",
    limit: { count: 3, windowMs: 30 * 60 * 1000 },
    team: (data, reference) => ({
      subject: `Deletion request: ${data.app}`,
      text: [
        `Reference: ${reference}`,
        `App: ${data.app}`,
        `Account email: ${data.email}`,
        `Username: ${data.username || "not given"}`,
        `Request: ${deletionRequestTypes[data.requestType]}`,
        "The requester confirmed the account is theirs.",
        "",
        data.details || "No further details.",
        "",
        "Before deleting anything, confirm ownership by replying to the account's email address.",
      ].join("\n"),
    }),
    acknowledgement: (data, reference) => ({
      subject: `We've received your deletion request | ${company.shortName}`,
      lines: [
        "Hello,",
        "",
        `${company.storeDeveloperName} has received your request: ${deletionRequestTypes[data.requestType].toLowerCase()} (${data.app}).`,
        "",
        `Your reference is ${reference}.`,
        "",
        "What happens next:",
        "1. We reply to this email address to confirm the account is yours. We don't delete anything before that.",
        company.deletionWindowDays
          ? `2. Once confirmed, we complete the deletion within ${company.deletionWindowDays} days.`
          : "2. Once confirmed, we carry out the deletion.",
        "3. We email you when the deletion is complete.",
        "",
        "If you didn't make this request, reply to this email to let us know.",
      ],
    }),
  });
}
