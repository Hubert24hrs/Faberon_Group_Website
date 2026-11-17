// Developer-account readiness check.
//
//   npm run check:readiness -- <base-url> [--legacy <host>] [--canonical-host <host>]
//
// Fetches the live site and checks what Apple and Google reviewers look at: every key page
// loads, the site uses one origin, the company details match config/company.ts, the sitemap
// and robots.txt are consistent, and nothing is marked noindex. Prints a table and exits
// non-zero if any check fails. Warnings don't fail the run.

import { company, rcLabel } from "../config/company.ts";

type Outcome = "PASS" | "FAIL" | "WARN";
type Result = { check: string; outcome: Outcome; detail: string };

const results: Result[] = [];
const record = (check: string, ok: boolean, detail = "", warnOnly = false) =>
  results.push({ check, outcome: ok ? "PASS" : warnOnly ? "WARN" : "FAIL", detail });

// ---------------------------------------------------------------------------
// Arguments

const args = process.argv.slice(2);
const flag = (name: string) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const baseArg = args.find(
  (arg, index) => !arg.startsWith("--") && !args[index - 1]?.startsWith("--"),
);
if (!baseArg) {
  console.error(
    "Usage: npm run check:readiness -- <base-url> [--legacy <host>] [--canonical-host <host>]",
  );
  process.exit(2);
}
const base = new URL(baseArg);
const origin = base.origin;
const expectedHost = flag("--canonical-host") ?? base.host;
const legacyHost = flag("--legacy");
const isLocal = ["localhost", "127.0.0.1"].includes(base.hostname);

const requiredPaths = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/support",
  "/delete-account",
];

// ---------------------------------------------------------------------------
// Helpers

type Page = { url: string; status: number; html: string; headers: Headers };
const cache = new Map<string, Page>();

async function get(url: string, init: RequestInit = {}): Promise<Page> {
  const cached = cache.get(url);
  if (cached && !init.redirect) return cached;
  const response = await fetch(url, { redirect: "follow", ...init });
  const text = await response.text();
  const page = { url, status: response.status, html: text, headers: response.headers };
  if (!init.redirect) cache.set(url, page);
  return page;
}

const decode = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function attr(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1] ? decode(match[1]) : undefined;
}

const canonicalOf = (html: string) => attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
const metaRobotsOf = (html: string) => attr(html, /<meta[^>]+name="robots"[^>]+content="([^"]+)"/);
const ogImagesOf = (html: string) =>
  [
    ...html.matchAll(
      /<meta[^>]+(?:property|name)="(?:og:image|twitter:image)"[^>]+content="([^"]+)"/g,
    ),
  ].map((match) => decode(match[1] ?? ""));

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

/** Visible text outside <script>/<style> and outside elements marked data-sample="true". */
function visibleText(html: string) {
  const body = html.slice(html.indexOf("<body"));
  const stack: { tag: string; hidden: boolean }[] = [];
  let text = "";
  let last = 0;
  for (const match of body.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g)) {
    const hidden = stack.some((item) => item.hidden);
    if (!hidden) text += ` ${body.slice(last, match.index)}`;
    last = (match.index ?? 0) + match[0].length;
    const [, closing, rawTag, rest = ""] = match;
    const tag = (rawTag ?? "").toLowerCase();
    if (closing) {
      const at = stack.map((item) => item.tag).lastIndexOf(tag);
      if (at >= 0) stack.length = at;
    } else if (!VOID.has(tag) && !rest.trim().endsWith("/")) {
      const skip = tag === "script" || tag === "style" || /data-sample="true"/.test(rest);
      stack.push({ tag, hidden: skip });
    }
  }
  return decode(text.replace(/\s+/g, " "));
}

const hostOf = (url: string) => {
  try {
    return new URL(url, origin).host;
  } catch {
    return "";
  }
};

// ---------------------------------------------------------------------------
// Checks

async function main() {
  console.log(`Readiness check for ${origin} (canonical host ${expectedHost})\n`);

  // 1. Key pages load.
  for (const path of requiredPaths) {
    const page = await get(`${origin}${path}`);
    record(`200 ${path}`, page.status === 200, `status ${page.status}`);
  }

  // 2. Unknown pages return a real 404.
  const missing = await get(`${origin}/readiness-${Date.now().toString(36)}`);
  record("Unknown path returns 404", missing.status === 404, `status ${missing.status}`);

  // 3. Sitemap.
  const sitemap = await get(`${origin}/sitemap.xml`);
  const sitemapUrls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1] ?? "",
  );
  record(
    "sitemap.xml loads",
    sitemap.status === 200 && sitemapUrls.length > 0,
    `${sitemapUrls.length} URLs`,
  );
  const offHost = sitemapUrls.filter((url) => hostOf(url) !== expectedHost);
  record(
    "Sitemap URLs are on the canonical host",
    offHost.length === 0,
    offHost.slice(0, 3).join(", "),
  );
  for (const path of ["/support", "/delete-account"]) {
    record(
      `Sitemap lists ${path}`,
      sitemapUrls.some((url) => new URL(url).pathname === path),
    );
  }

  // Every page we check: required pages plus everything in the sitemap, fetched from the base URL.
  const paths = [
    ...new Set([...requiredPaths, ...sitemapUrls.map((url) => new URL(url).pathname)]),
  ];
  const pages: Page[] = [];
  for (const path of paths) pages.push(await get(`${origin}${path}`));

  const notOk = pages.filter((page) => page.status !== 200);
  record(
    "Every sitemap URL returns 200",
    notOk.length === 0,
    notOk.map((page) => page.url).join(", "),
  );

  // 4. Canonical links.
  const badCanonical = pages.filter((page) => {
    const canonical = canonicalOf(page.html);
    return !canonical || hostOf(canonical) !== expectedHost;
  });
  record(
    "Every page's canonical is on the canonical host",
    badCanonical.length === 0,
    badCanonical
      .slice(0, 3)
      .map((page) => `${new URL(page.url).pathname} -> ${canonicalOf(page.html) ?? "none"}`)
      .join("; "),
  );

  // 5. Indexing: no production page may be noindex, and no noindex page may be in the sitemap.
  const noindex = pages.filter(
    (page) =>
      /noindex/i.test(page.headers.get("x-robots-tag") ?? "") ||
      /noindex/i.test(metaRobotsOf(page.html) ?? ""),
  );
  record(
    "No sitemap page is noindex (header or tag)",
    noindex.length === 0,
    noindex.map((page) => new URL(page.url).pathname).join(", "),
  );

  // 6. robots.txt.
  const robots = await get(`${origin}/robots.txt`);
  const disallowAll = /^Disallow:\s*\/\s*$/im.test(robots.html);
  const sitemapLine = robots.html.match(/^Sitemap:\s*(\S+)/im)?.[1];
  record(
    "robots.txt allows the site",
    robots.status === 200 && !disallowAll,
    disallowAll ? "Disallow: /" : "",
  );
  record(
    "robots.txt points to the sitemap on the canonical host",
    !!sitemapLine && hostOf(sitemapLine) === expectedHost && sitemapLine.endsWith("/sitemap.xml"),
    sitemapLine ?? "no Sitemap line",
  );

  // 7. Social images.
  const home = await get(`${origin}/`);
  const images = ogImagesOf(home.html);
  record("Home page has Open Graph images", images.length > 0, `${images.length} found`);
  for (const image of images) {
    const onHost = hostOf(image) === expectedHost;
    const fetched = await fetch(new URL(new URL(image).pathname + new URL(image).search, origin));
    const isImage = fetched.ok && (fetched.headers.get("content-type") ?? "").startsWith("image/");
    record(
      `Social image ${new URL(image).pathname}`,
      onHost && isImage,
      `${hostOf(image)}, ${fetched.status}`,
    );
  }

  // 8. Legacy host must not appear anywhere.
  if (legacyHost) {
    const leaking = pages.filter((page) => page.html.includes(legacyHost));
    record(
      `Legacy host ${legacyHost} appears nowhere`,
      leaking.length === 0,
      leaking.map((page) => new URL(page.url).pathname).join(", "),
    );
  }

  // 9. Company details in the raw HTML (no JavaScript).
  const facts = {
    "legal name": company.legalName,
    address: company.registeredAddress.formatted,
    phone: company.phone.display,
    email: company.emails.general,
  };
  for (const path of ["/", "/contact"]) {
    const html = decode((await get(`${origin}${path}`)).html);
    const absent = Object.entries(facts).filter(([, value]) => !html.includes(value));
    record(
      `Company details in raw HTML of ${path}`,
      absent.length === 0,
      absent.map(([name]) => `missing ${name}`).join(", "),
    );
  }
  const rc = rcLabel();
  if (rc) record("Footer shows the RC number", decode(home.html).includes(rc), rc);

  // 10. Every mailto uses the company email domain.
  const emailDomain = company.emails.general.split("@")[1] ?? "";
  const mailtos = new Set(
    pages.flatMap((page) =>
      [...page.html.matchAll(/href="mailto:([^"?]+)/g)].map((match) => decode(match[1] ?? "")),
    ),
  );
  const foreign = [...mailtos].filter((address) => address.split("@")[1] !== emailDomain);
  record(`Every mailto is on ${emailDomain}`, foreign.length === 0, foreign.join(", "));

  // 11. No placeholder text outside sample-tagged mockups.
  const placeholder = /\b(lorem|todo|coming soon|yourcompany)\b/i;
  const withPlaceholder = pages.filter((page) => placeholder.test(visibleText(page.html)));
  record(
    "No placeholder text (lorem, TODO, coming soon, yourcompany)",
    withPlaceholder.length === 0,
    withPlaceholder
      .map(
        (page) =>
          `${new URL(page.url).pathname}: "${visibleText(page.html).match(placeholder)?.[0]}"`,
      )
      .join(", "),
  );

  // 12. HTTPS.
  if (isLocal) {
    record("HTTPS enforced", true, "skipped for a local URL", true);
  } else {
    const insecure = await fetch(`http://${base.host}/`, { redirect: "manual" }).catch(() => null);
    const location = insecure?.headers.get("location") ?? "";
    record(
      "HTTP redirects to HTTPS",
      !!insecure &&
        insecure.status >= 300 &&
        insecure.status < 400 &&
        location.startsWith("https://"),
      insecure ? `${insecure.status} -> ${location || "none"}` : "no response",
    );
    record(
      "HSTS header present",
      !!home.headers.get("strict-transport-security"),
      home.headers.get("strict-transport-security") ?? "missing",
      true,
    );
  }

  // 13. Legacy host redirects.
  if (legacyHost) {
    for (const path of ["/", "/about?x=1", "/privacy"]) {
      const response = await fetch(`https://${legacyHost}${path}`, { redirect: "manual" }).catch(
        () => null,
      );
      const location = response?.headers.get("location") ?? "";
      const expected = `${origin}${path === "/" ? "" : path}`;
      record(
        `Legacy ${path} returns 308 to the canonical host`,
        response?.status === 308 && (location === expected || location === `${origin}${path}`),
        response ? `${response.status} -> ${location || "none"}` : "no response",
      );
    }
  }
}

main()
  .catch((error: unknown) => {
    record("Run completed", false, error instanceof Error ? error.message : String(error));
  })
  .finally(() => {
    const width = Math.max(...results.map((result) => result.check.length));
    for (const result of results) {
      console.log(
        `${result.outcome.padEnd(4)}  ${result.check.padEnd(width)}  ${result.detail}`.trimEnd(),
      );
    }
    const failed = results.filter((result) => result.outcome === "FAIL").length;
    const warned = results.filter((result) => result.outcome === "WARN").length;
    console.log(
      `\n${results.length - failed - warned} passed, ${failed} failed, ${warned} warnings.`,
    );
    process.exitCode = failed > 0 ? 1 : 0;
  });
