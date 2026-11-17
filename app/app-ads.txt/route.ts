import { appAdsTxt } from "@/config/apps";

// app-ads.txt for in-app advertising. 404 until a value is set in config/apps.ts.
export const dynamic = "force-static";

export function GET() {
  if (!appAdsTxt) return new Response("Not found", { status: 404 });
  return new Response(appAdsTxt, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
