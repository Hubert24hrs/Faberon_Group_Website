# Upgrade plan

This plan maps the enterprise upgrade brief (groups A to H) onto this codebase. Each phase ships on its own branch (`feat/<phase>`), keeps the site deployable, and is checked with type-check, lint and build before it's committed.

## Baseline (16 November 2026)

**Stack.** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4 with design tokens in `styles/globals.css`, Framer Motion, React Hook Form and Zod, Resend, deployed on Vercel. No second UI library will be added.

**Checks.** Type-check and lint were green. The build was blocked by a moderate Next.js advisory (GHSA-mfr8-8qww-v76h, fixed in 16.4.6). The site doesn't use the affected cache API, but Next.js was upgraded to 16.4.6 anyway.

**Lighthouse, mobile, live site:**

| Page                  | Performance | Accessibility | Best practices | SEO |
| --------------------- | ----------- | ------------- | -------------- | --- |
| `/`                   | 69          | 100           | 100            | 63  |
| `/services/ai-agents` | 90          | 100           | 100            | 66  |
| `/contact`            | 84          | 100           | 96             | 66  |

SEO was low by design while every page sent `noindex` (since 17 November 2026 production is indexable). The home page's 2 s blocking time was measured while a build ran on the same machine, so it needs re-measuring.

## Audit corrections

Several gaps in the brief's audit are already in place. The plan builds on them rather than replacing them.

| Brief says                                  | Actual state                                                                                                                                                                                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Agent-run panel is static                   | It plays step by step, has three tasks, and Approve and Send back work. Phase 4 adds pause and replay controls and an audit log.                                                                                         |
| No sitemap, robots or structured data       | `app/sitemap.ts`, `app/robots.ts`, and Organization, Service and FAQPage JSON-LD exist. Phase 1 adds ProfessionalService and BreadcrumbList.                                                                             |
| No dark mode                                | Dark and light themes exist, follow the system preference, persist the choice, and don't flash on load.                                                                                                                  |
| Forms have no validation or spam protection | Zod validation, inline errors, a honeypot, rate limiting and a success state exist. Phase 1 adds multi-step, autosave, error summaries, Turnstile, scoring and attribution.                                              |
| Domain inconsistency                        | All absolute URLs already come from one constant, `site.url`, driven by `NEXT_PUBLIC_SITE_URL`. The live preview points at faberongroups.com because that will be the production domain. Phase 1 validates the variable. |

## Decisions

1. **Content Security Policy without nonces.** Nonces force every page to render per request, which removes static HTML and CDN caching and works against the performance targets. The CSP stays strict on sources, keeps `'unsafe-inline'` for scripts only, and adds Turnstile's domain. To revisit if a security review requires nonces.
2. **No consent banner while analytics is cookieless.** Plausible sets no cookies and collects no personal data, so it needs no consent under GDPR or ePrivacy. It still respects Do Not Track and Global Privacy Control. A "Cookie preferences" link explains this. A banner component is only needed if a cookie-setting tool is added.
3. **Assistant knowledge without a vector database (proposal for Phase 2).** The site's content is about 15,000 tokens. Passing the curated knowledge base in full, with prompt caching, is more accurate than vector retrieval at this size, cheaper to run, and needs no database. Each section carries a page and anchor, so answers can still cite sources. Postgres is then only needed to store conversations and leads, which can wait until it's required. This needs the owner's agreement, because the brief specifies pgvector.
4. **Leads without a database in Phase 1.** Leads go to email, Slack and an optional CRM webhook. A database adapter slots in when Postgres is provisioned.

## Phases

### Phase 1: Foundation and quick wins (`feat/foundation`)

- `lib/env.ts`: Zod-validated environment variables for server and client.
- SEO: ProfessionalService JSON-LD with address, phone and email; BreadcrumbList and visible breadcrumbs on service pages; a site logo in Organization data.
- Security headers: add Cross-Origin-Opener-Policy and allow Turnstile in the CSP.
- Analytics: load Plausible only if configured and DNT or GPC is off; a `track()` helper; CTA and form-step events.
- Forms (group C core): a multi-step form (need, budget, details, contact), session autosave, an error summary, a character counter, prefill from validated query parameters, UTM and referrer capture, a disposable-email check, optional Turnstile, lead scoring, a visitor confirmation email, internal notification, an optional Slack webhook, and a CRM adapter interface. New `/api/lead`; `/api/contact` stays as an alias.
- FAQ sections with FAQPage data on `/contact`, `/about`, `/solutions` and every service page, including equity partnership and white-label answers that link to a prefilled form.

### Phase 2: AI Concierge (`feat/ai-assistant`), blocked on owner input

Knowledge files in `content/knowledge`, a build script, `/api/chat` with streaming, tools (navigate, recommend, prefill, capture lead, handoff, company info), guardrails, a lazily loaded chat UI, and an eval harness with a golden set of 60 or more questions.

Needs: `ANTHROPIC_API_KEY`, Vercel KV or Upstash for rate limits, and a decision on decision 3.

### Phase 3: Trust and proof (`feat/trust-proof`)

`/security`, `/how-we-work`, `/pricing-and-engagement` with an estimator, case-study and testimonial components behind flags, the leadership and team grid, `/careers` behind a flag, and a booking widget.

### Phase 4: Interactive and content (`feat/interactive-content`)

Hero console controls, the AI agent sandbox, the "What should I build?" quiz, the ROI calculator, a command palette, the mega-menu grouping, insights with MDX and RSS, a resources hub and the newsletter.

### Phase 5: Hardening (`feat/hardening`)

PWA manifest, global readiness (hours in the visitor's time zone, WhatsApp, currency toggle, accessibility statement, map), Playwright and axe tests, Lighthouse CI, Sentry, and the docs (`ARCHITECTURE.md`, `CONTENT_GUIDE.md`, `RUNBOOK.md`, `ASSISTANT_KNOWLEDGE_GUIDE.md`).

## Accounts the owner needs

| Service                                | Used for                                  | Phase |
| -------------------------------------- | ----------------------------------------- | ----- |
| Domain (faberongroups.com) and mailbox | Production URL, info@ email               | Now   |
| Resend (with a verified domain)        | Lead and confirmation emails              | 1     |
| Cloudflare Turnstile                   | Bot protection on forms and chat          | 1     |
| Slack incoming webhook (optional)      | Lead and handoff alerts                   | 1     |
| Plausible (optional)                   | Analytics                                 | 1     |
| Anthropic API key                      | AI assistant                              | 2     |
| Vercel KV or Upstash Redis             | Shared rate limits                        | 2     |
| Postgres (Neon, Supabase or Vercel)    | Conversations and leads, only if required | 2     |
| Cal.com                                | Booking widget                            | 3     |
| Sentry                                 | Error tracking                            | 5     |
