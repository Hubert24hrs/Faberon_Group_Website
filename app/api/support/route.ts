import { company } from "@/config/company";
import { handleRequest } from "@/lib/requests";
import { supportSchema } from "@/lib/validators";

export async function POST(request: Request) {
  return handleRequest(request, {
    schema: supportSchema,
    prefix: "SUP",
    inbox: "support",
    team: (data, reference) => ({
      subject: `Support request: ${data.app}`,
      text: [
        `Reference: ${reference}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `About: ${data.app}`,
        `Device and OS: ${data.device || "not given"}`,
        "",
        data.message,
      ].join("\n"),
    }),
    acknowledgement: (data, reference) => ({
      subject: `We've received your support request | ${company.shortName}`,
      lines: [
        `Hello ${data.name},`,
        "",
        `Thank you for contacting ${company.legalName} support. We've received your request about ${data.app}.`,
        "",
        `Your reference is ${reference}. Please quote it if you write to us about this request.`,
        "",
        "We'll reply to this email address. You can reply to this email if you'd like to add anything.",
      ],
    }),
  });
}
