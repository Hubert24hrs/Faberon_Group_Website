// End-to-end smoke tests and accessibility scans for the forms and request pages.
//
//   npm run e2e -- <base-url>        e.g. npm run e2e -- http://localhost:3000
//
// Uses the Chrome installed on this machine (no browser download) and axe-core.
// Fails on any serious or critical accessibility issue, or any broken behaviour.

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright-core";

let browser;
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const results = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.error(`${ok ? "pass" : "FAIL"}: ${name}`);
};

async function scan(page, label) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""));
  record(
    `Accessibility: ${label}`,
    serious.length === 0,
    serious.map((item) => `${item.id} (${item.nodes.length})`).join(", "),
  );
}

async function post(path, body) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}`,
    },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json().catch(() => ({})) };
}

async function requestPage(page, path, label, fill) {
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  await scan(page, `${label} page`);

  // Submitting empty shows an error summary and marks fields invalid, tied by aria-describedby.
  const submit = page.locator("form button[type=submit]").last();
  await submit.click();
  const summary = page.getByRole("alert").filter({ hasText: "Please fix the following" });
  await summary.waitFor({ timeout: 5000 });
  const invalid = await page.locator("form [aria-invalid=true]").count();
  const tied = await page
    .locator("form [aria-invalid=true][aria-describedby]")
    .evaluateAll((nodes) =>
      nodes.every((node) =>
        node
          .getAttribute("aria-describedby")
          .split(" ")
          .some((id) => document.getElementById(id)?.textContent?.trim()),
      ),
    );
  record(
    `${label}: empty submit is blocked with field errors`,
    invalid > 0 && tied,
    `${invalid} invalid fields`,
  );
  await scan(page, `${label} page with errors`);

  // Keyboard only: every form control is reachable with Tab.
  await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
  const controls = await page
    .locator(
      "form input:not([tabindex='-1']):not([type=radio]), form select, form textarea, form button[type=submit]",
    )
    .count();
  const reached = new Set();
  // Start from the top of the page, as a keyboard user would.
  for (let i = 0; i < 200 && reached.size < controls; i++) {
    await page.keyboard.press("Tab");
    const id = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.closest("form") &&
        el.matches("input,select,textarea,button") &&
        el.getAttribute("type") !== "radio"
        ? el.id || el.textContent
        : null;
    });
    if (id) reached.add(id);
  }
  record(
    `${label}: every field reachable by keyboard`,
    reached.size >= controls,
    `${reached.size}/${controls}`,
  );

  // A valid submission either succeeds, or (with email not configured) fails safely
  // and shows the email address to use instead.
  await fill(page);
  await submit.click();
  const outcome = page
    .locator("[role=status], [role=alert]")
    .filter({ hasText: /Request (sent|received)|couldn.t send/ });
  await outcome.first().waitFor({ timeout: 15000 });
  const text = (await outcome.first().textContent()) ?? "";
  const ok = /Request (sent|received)/.test(text) || /@/.test(text);
  record(
    `${label}: valid submission succeeds or shows the email fallback`,
    ok,
    text.trim().slice(0, 90),
  );
}

async function main() {
  // Server-side validation and the spam trap, for every form endpoint.
  const lead = await post("/api/lead", {
    service: "Custom SaaS",
    budget: "Not yet sure",
    company: "Test",
    message: "x".repeat(30),
  });
  record(
    "API /api/lead without name or email returns field errors",
    lead.status === 400 && !!lead.body.fieldErrors?.name && !!lead.body.fieldErrors?.email,
  );
  const leadTrap = await post("/api/lead", {
    name: "A",
    email: "a@example.org",
    service: "Custom SaaS",
    budget: "Not yet sure",
    company: "Test",
    message: "x".repeat(30),
    website: "http://spam.example",
  });
  record("API /api/lead rejects a filled spam trap", leadTrap.status === 400);
  const support = await post("/api/support", {});
  record(
    "API /api/support validates fields",
    support.status === 400 && !!support.body.fieldErrors?.email,
  );
  const supportTrap = await post("/api/support", {
    name: "A",
    email: "a@example.org",
    app: "Website or other",
    message: "x".repeat(30),
    website: "bot",
  });
  record("API /api/support rejects a filled spam trap", supportTrap.status === 400);
  const deletion = await post("/api/deletion", {
    app: "Website or other",
    email: "a@example.org",
    requestType: "account",
  });
  record(
    "API /api/deletion requires the ownership confirmation",
    deletion.status === 400 && !!deletion.body.fieldErrors?.confirmOwner,
  );
  const redirect = await fetch(`${base}/data-deletion`, { redirect: "manual" });
  record(
    "/data-deletion redirects permanently to /delete-account",
    [301, 308].includes(redirect.status) &&
      (redirect.headers.get("location") ?? "").endsWith("/delete-account"),
  );

  browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(8000);

  await requestPage(page, "/support", "Support", async (p) => {
    await p.fill("#name", "Readiness Test");
    await p.fill("#email", "readiness@example.org");
    await p.selectOption("#app", { index: 1 });
    await p.fill("#message", "This is an automated readiness test of the support form.");
  });

  await requestPage(page, "/delete-account", "Deletion", async (p) => {
    await p.selectOption("#app", { index: 1 });
    await p.fill("#email", "readiness@example.org");
    await p.check("input[name=requestType][value=account]");
    await p.check("#confirmOwner");
  });

  for (const path of ["/contact", "/demo"]) {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    await scan(page, `${path} form`);
    const markers = await page.getByText("(required)").count();
    record(`${path}: required fields are marked`, markers > 0, `${markers} on the first step`);
  }
}

main()
  .catch((error) => record("Run completed", false, error?.message ?? String(error)))
  .finally(async () => {
    await browser?.close();
    for (const result of results) {
      console.log(
        `${result.ok ? "PASS" : "FAIL"}  ${result.name}${result.detail ? `  (${result.detail})` : ""}`,
      );
    }
    const failed = results.filter((result) => !result.ok).length;
    console.log(`\n${results.length - failed} passed, ${failed} failed.`);
    process.exitCode = failed > 0 ? 1 : 0;
  });
