import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { buildCanonicalRedirects } = require("../lib/canonical-redirects.js");

const siteUrl = "https://example.test";

test("emits no rule when the flag is off or not exactly 'true'", () => {
  for (const enabled of [undefined, "", "false", "TRUE", "1", "yes"]) {
    assert.deepEqual(
      buildCanonicalRedirects({ enabled, legacyHosts: "old.vercel.app", siteUrl }),
      [],
    );
  }
});

test("redirects each legacy host permanently to the same path on the site", () => {
  const rules = buildCanonicalRedirects({
    enabled: "true",
    legacyHosts: "i-dokoai.vercel.app, www.example.test",
    siteUrl,
  });
  assert.equal(rules.length, 2);
  assert.deepEqual(rules[0], {
    source: "/:path*",
    has: [{ type: "host", value: "^i-dokoai\\.vercel\\.app$" }],
    destination: "https://example.test/:path*",
    permanent: true,
  });
});

test("skips a legacy host equal to the site host, so there is no loop", () => {
  const rules = buildCanonicalRedirects({
    enabled: "true",
    legacyHosts: "example.test,old.vercel.app",
    siteUrl,
  });
  assert.deepEqual(
    rules.map((rule) => rule.has[0].value),
    ["^old\\.vercel\\.app$"],
  );
});

test("host patterns are anchored, so preview deployment hosts never match", () => {
  const [rule] = buildCanonicalRedirects({
    enabled: "true",
    legacyHosts: "i-dokoai.vercel.app",
    siteUrl,
  });
  const pattern = new RegExp(rule.has[0].value);
  assert.ok(pattern.test("i-dokoai.vercel.app"));
  assert.ok(!pattern.test("i-doko-abc123-team.vercel.app"));
  assert.ok(!pattern.test("i-dokoai-git-feature-team.vercel.app"));
  assert.ok(!pattern.test("i-dokoaixvercel.app"), "dots are escaped");
});

test("ignores blanks, duplicates and malformed hosts", () => {
  const rules = buildCanonicalRedirects({
    enabled: "true",
    legacyHosts: " , old.vercel.app,OLD.vercel.app, https://bad/path ",
    siteUrl,
  });
  assert.equal(rules.length, 1);
});

test("emits nothing without a valid site origin", () => {
  assert.deepEqual(buildCanonicalRedirects({ enabled: "true", legacyHosts: "old.vercel.app" }), []);
  assert.deepEqual(
    buildCanonicalRedirects({
      enabled: "true",
      legacyHosts: "old.vercel.app",
      siteUrl: "not a url",
    }),
    [],
  );
});
