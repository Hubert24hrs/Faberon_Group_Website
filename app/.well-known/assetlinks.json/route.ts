import { apps } from "@/config/apps";

// Android App Links: https://developer.android.com/training/app-links/verify-android-applinks
// Served as JSON on the canonical host. 404 until an app has a package name and fingerprints.
export const dynamic = "force-static";

export function GET() {
  const statements = apps.flatMap((app) => {
    const android = app.android;
    if (!android?.packageName || !android.sha256CertFingerprints?.length) return [];
    return [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: android.packageName,
          sha256_cert_fingerprints: android.sha256CertFingerprints,
        },
      },
    ];
  });

  if (statements.length === 0) return new Response("Not found", { status: 404 });
  return Response.json(statements);
}
