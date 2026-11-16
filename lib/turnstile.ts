import { serverEnv } from "@/lib/env.server";

// Passes when Turnstile isn't configured, so local and preview builds keep working.
export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = serverEnv().TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
