// Builds the Next.js redirect rules that send legacy hosts (for example the old
// vercel.app address) to the canonical origin with a permanent 308.
// Plain CommonJS so next.config.js can use it and node:test can test it directly.

/** Escape a hostname for use inside a regular expression. */
function escapeHost(host) {
  return host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {{ enabled?: string, legacyHosts?: string, siteUrl?: string }} options
 *   enabled: the CANONICAL_REDIRECT_ENABLED value; only the exact string "true" turns rules on.
 *   legacyHosts: comma-separated hostnames (LEGACY_HOSTS).
 *   siteUrl: the canonical origin, e.g. "https://example.com".
 * @returns {Array<{ source: string, has: Array<{ type: "host", value: string }>, destination: string, permanent: true }>}
 */
function buildCanonicalRedirects({ enabled, legacyHosts, siteUrl }) {
  if (enabled !== "true" || !siteUrl) return [];

  let origin;
  try {
    origin = new URL(siteUrl);
  } catch {
    return [];
  }
  const siteHost = origin.host.toLowerCase();

  const hosts = [
    ...new Set(
      (legacyHosts ?? "")
        .split(",")
        .map((host) => host.trim().toLowerCase())
        .filter((host) => /^[a-z0-9.-]+(:\d+)?$/.test(host)),
    ),
  ];

  return (
    hosts
      // Redirecting the canonical host to itself would loop.
      .filter((host) => host !== siteHost)
      .map((host) => ({
        source: "/:path*",
        // Anchored, so only this exact host matches. Preview hosts such as
        // project-git-branch-team.vercel.app never match a production host.
        has: [{ type: "host", value: `^${escapeHost(host)}$` }],
        // Next.js carries the query string over to the destination.
        destination: `${origin.origin}/:path*`,
        permanent: true,
      }))
  );
}

module.exports = { buildCanonicalRedirects, escapeHost };
