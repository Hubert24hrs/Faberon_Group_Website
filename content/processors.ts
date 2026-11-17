// Service providers that process personal data for us, only on our instructions.
// The Privacy Policy renders its list from here, so keep it accurate when a provider changes.
export type Processor = { name: string; purpose: string };

export const processors: Processor[] = [
  { name: "Vercel", purpose: "website hosting" },
  { name: "Resend", purpose: "delivering form emails" },
  { name: "Cal.com", purpose: "booking where it's enabled" },
  { name: "Apple and Google", purpose: "app distribution" },
];

/** "A for x, B for y, and C for z" */
export function processorSentence(list: Processor[] = processors) {
  const parts = list.map((item) => `${item.name} for ${item.purpose}`);
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")}, and ${parts.at(-1)}`;
}
