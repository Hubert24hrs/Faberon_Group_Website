# Faberon Group Technologies Limited website

Corporate website for Faberon Group Technologies Limited, built with Next.js (App Router), TypeScript, Tailwind CSS and Framer Motion.

**Picking this up again?** Start with [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md).

## Run it locally

Requires Node.js 22 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The site runs at http://localhost:3000. In development, the contact form works without email set up: submissions succeed and no email is sent.

## Scripts

| Command                            | What it does                                     |
| ---------------------------------- | ------------------------------------------------ |
| `npm run dev`                      | Starts the development server                    |
| `npm run build`                    | Creates a production build                       |
| `npm run start`                    | Runs the production build                        |
| `npm run lint`                     | Runs ESLint                                      |
| `npm run typecheck`                | Runs the TypeScript compiler                     |
| `npm run format`                   | Formats the code with Prettier                   |
| `npm test`                         | Runs the unit tests                              |
| `npm run e2e -- <url>`             | Form and accessibility tests in Chrome           |
| `npm run check:readiness -- <url>` | Developer-account readiness check of a live site |

## Environment variables

All are listed in `.env.example`. Never commit real values.

| Variable                        | Needed for          | Notes                                                                 |
| ------------------------------- | ------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Canonical origin    | Empty on Vercel uses the production domain; required for local builds |
| `CANONICAL_REDIRECT_ENABLED`    | Old-address forward | `true` makes `LEGACY_HOSTS` 308 to the canonical origin               |
| `LEGACY_HOSTS`                  | Old-address forward | Comma-separated hosts                                                 |
| `NEXT_PUBLIC_COMPANY_RC_NUMBER` | Company details     | CAC number; hidden everywhere while empty                             |
| `RESEND_API_KEY`                | Forms               | From your Resend account                                              |
| `EMAIL_FROM`, `EMAIL_REPLY_TO`  | Forms               | Sender and reply-to; fall back to the older `CONTACT_*` variables     |
| `LEADS_NOTIFY_EMAIL`            | Forms               | Contact and demo inbox; falls back to `CONTACT_TO_EMAIL`              |
| `SUPPORT_NOTIFY_EMAIL`          | Support form        | Optional; falls back to the leads inbox                               |
| `PRIVACY_NOTIFY_EMAIL`          | Deletion form       | Optional; falls back to the leads inbox                               |
| `NEXT_PUBLIC_BOOKING_URL`       | Booking embed       | Optional. A full `cal.com` or `calendly.com` URL                      |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`  | Analytics           | Optional. Analytics stays off while this is empty                     |

In production, the forms show visitors an email address to use instead until Resend and a sender are configured.

## Deploy to Vercel

1. Import this GitHub repository into Vercel. It detects Next.js automatically.
2. Add the environment variables under Project Settings.
3. Deploy, then connect the domain under Project Settings, Domains.

Production is indexable; preview deployments are not. For moving to the company domain, follow `docs/DEVELOPER_ACCOUNT_READINESS.md`.

## Update the content

Content lives in typed files, so most updates are a single-file edit.

| What to change                                        | Where                     |
| ----------------------------------------------------- | ------------------------- |
| Legal name, RC number, address, email, phone, socials | `config/company.ts`       |
| Services                                              | `content/services.ts`     |
| Audiences, process, values, FAQ, tech stack           | `content/company.ts`      |
| Hero console sample runs                              | `content/agent-runs.ts`   |
| Case studies                                          | `content/case-studies.ts` |
| Insights posts                                        | `content/insights.ts`     |

### Turn on hidden sections

Work, Insights and the newsletter field are built but switched off. Fields left empty in `lib/site.ts` stay hidden too, so nothing appears half-finished.

1. Add real content to `content/case-studies.ts` or `content/insights.ts`.
2. Set `work`, `insights` or `newsletter` to `true` under `features` in `lib/site.ts`.

Each section then appears in the navigation, footer and sitemap. Only add verified projects and results.

## Project structure

```
app/         Routes, metadata, API routes, fonts
components/  ui, layout, sections, forms, motion
content/     Site copy and structured content
lib/         Site config, validation, email, SEO
styles/      Global CSS and design tokens
```

## Fonts

General Sans is self-hosted from `app/fonts` and comes from [Fontshare](https://www.fontshare.com/fonts/general-sans), free under the ITF Free Font License. Geist Sans and Geist Mono come from the `geist` package.
