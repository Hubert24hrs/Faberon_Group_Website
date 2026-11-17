import { apps } from "@/config/apps";

// Apple app site association: https://developer.apple.com/documentation/xcode/supporting-associated-domains
// Served as JSON, without a file extension or redirect, on the canonical host.
// 404 until an app has both a Team ID and a bundle ID.
export const dynamic = "force-static";

export function GET() {
  const identified = apps.flatMap((app) =>
    app.ios?.teamId && app.ios.bundleId
      ? [{ appID: `${app.ios.teamId}.${app.ios.bundleId}`, linkPaths: app.ios.linkPaths ?? [] }]
      : [],
  );

  if (identified.length === 0) return new Response("Not found", { status: 404 });

  const linked = identified.filter((app) => app.linkPaths.length > 0);
  return Response.json({
    applinks: {
      details: linked.map((app) => ({
        appIDs: [app.appID],
        components: app.linkPaths.map((path) => ({ "/": path })),
      })),
    },
    webcredentials: { apps: identified.map((app) => app.appID) },
  });
}
