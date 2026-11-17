# Developer-account readiness plan

Branch: `feat/developer-account-readiness`. Rollout stage 1 only (the domain is not live yet).

## Discovery findings

- Next.js 16.4 App Router, React 19, TypeScript strict, Tailwind 4, React Hook Form + Zod 4, Resend. No tests and no CI in the repo.
- Origin: `lib/env.ts` resolves `NEXT_PUBLIC_SITE_URL`, then Vercel's production domain, then a hard-coded `https://faberongroups.com` fallback (to remove). Live canonical, Open Graph, sitemap and robots are all on `i-dokoai.vercel.app` today, so the audit's "mixed origins" finding no longer reproduces. Vercel has no environment variables set.
- Indexing: production sends `X-Robots-Tag: noindex` until `SITE_LAUNCHED=true` (to change: production indexable, previews not).
- Identity: `lib/site.ts` holds the name, address, phone and email. Literal "Faberon Group" strings remain in some metadata and FAQ copy, and the legal name in the leadership bio.
- "Website" after the description field is the honeypot: offscreen wrapper with `aria-hidden`, but it still has a visible-to-text `<label>`. The server silently accepts and drops filled submissions.
- Forms: every field is required on the server; no field shows a required marker. Server errors are not tied to fields.
- Stats "3+ years" and "20+ projects" are in the founder's own Leadership profile.
- Service mockups (`components/sections/service-illustrations.tsx`) show fictional data with no Sample tag. The agent panel uses `agent run · sample`.
- A branded 404 exists. Testimonials is linked in nav, footer and sitemap with no quotes. No /support or /delete-account. Privacy has `#delete-account`.

## Owner answers

- Address matches the CAC certificate exactly. Store developer name: the legal name. No response time or deletion window. Hide Testimonials links until real quotes.
- Known from earlier: domain not live, no RC number yet, title "Founder", no mailboxes yet.

## Files per workstream

- **A** `lib/env.ts` (resolution, `SITE_URL`, `SITE_HOST`, build fails without an origin), `lib/canonical-redirects.js` + `tests/canonical-redirects.test.mjs`, `next.config.js` (redirects, indexing headers), `app/robots.ts`, `lib/routes.ts`, `app/sitemap.ts`.
- **B** `config/company.ts`, `lib/site.ts` (built from the config), `lib/seo.tsx`, `content/*` copy, `components/ui/company-details.tsx`, About, Contact, footer, Terms, Privacy.
- **C** `components/forms/form-field.tsx`, `components/forms/consultation-form.tsx`, `app/api/lead/route.ts`, `components/sections/service-illustrations.tsx`, `components/layout/site-nav.ts`, `components/layout/footer.tsx`, `app/testimonials/page.tsx`.
- **D** `app/support/page.tsx`, `components/forms/support-form.tsx`, `app/api/support/route.ts`.
- **E** `app/delete-account/page.tsx`, `components/forms/deletion-form.tsx`, `app/api/deletion/route.ts`, redirect from `/data-deletion`.
- **F** `app/privacy/page.tsx`, `app/terms/page.tsx`, `content/processors.ts`.
- **G** `lib/env.server.ts`, `lib/email.ts` (sender, reply-to, routing, branded template, reference IDs), `lib/leads/notify.ts`.
- **H** `config/apps.ts`, `app/.well-known/*`, `app/app-ads.txt/route.ts`, `app/apps/page.tsx`.
- **I** `scripts/check-readiness.ts`, `scripts/e2e.mjs` (Playwright with system Chrome + axe), package scripts.
- **J** `docs/DEVELOPER_ACCOUNT_READINESS.md`.
