/** @type {import('next').NextConfig} */

// next.config.js is CommonJS, so the shared rule builder is loaded with require.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { buildCanonicalRedirects } = require("./lib/canonical-redirects.js");

const isDev = process.env.NODE_ENV !== "production";

// Next.js injects inline bootstrap scripts, and the theme script runs inline
// to prevent a flash on load, so script-src needs 'unsafe-inline'.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://plausible.io https://challenges.cloudflare.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' https://plausible.io https://challenges.cloudflare.com${isDev ? " ws:" : ""}`,
  "frame-src https://cal.com https://app.cal.com https://calendly.com https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Production is indexable. On Vercel, preview deployments are not: Vercel adds its own
// X-Robots-Tag: noindex to them, and robots.txt disallows everything outside production.
// Production pages never send noindex.

// The canonical origin, resolved the same way as lib/env.ts (read at build time).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/data-deletion", destination: "/delete-account", permanent: true },
      // Legacy hosts to the canonical origin, only when CANONICAL_REDIRECT_ENABLED is "true".
      ...buildCanonicalRedirects({
        enabled: process.env.CANONICAL_REDIRECT_ENABLED,
        legacyHosts: process.env.LEGACY_HOSTS,
        siteUrl,
      }),
    ];
  },
};

module.exports = nextConfig;
