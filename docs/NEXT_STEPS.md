# What to do next

Status on 20 November 2026: the website is live at **https://faberongroups.com** (the old i-dokoai.vercel.app address and www.faberongroups.com forward to it), and **info@faberongroups.com** works in Zoho Mail. Everything is on GitHub (`Hubert24hrs/Faberon_Group_Website`, branch `main`).

What's left mainly waits on the **CAC documents**. Do the steps below in order. The detailed version of every step is in [DEVELOPER_ACCOUNT_READINESS.md](./DEVELOPER_ACCOUNT_READINESS.md).

To pick this up later, open the project in Claude Code and say: "Read docs/NEXT_STEPS.md and continue from step N."

---

## 1. CAC registration

Done (20 November 2026):

- The website now matches the CAC status report: FABERON GROUP TECHNOLOGIES LIMITED, **RC 10021233**, private company limited by shares, registered office **House 5, Gate3, Zion Court Estate, Prince Samuel Adedoyin Street, Ikate, Ikate, Lagos State, Nigeria**.
- The RC number is set in Vercel (`NEXT_PUBLIC_COMPANY_RC_NUMBER=10021233`).

Still to do:

1. **Fix the email on the CAC record.** The status report shows `info@faberongroup.com` (missing "s"). faberongroup.com belongs to someone else, so ask CAC to update the company email to **info@faberongroups.com** (a change of particulars on the CAC portal, or through your accredited agent).
2. Request a **D-U-N-S number** using Apple's free lookup: https://developer.apple.com/enroll/duns-lookup/. Enter exactly: legal name FABERON GROUP TECHNOLOGIES LIMITED; address House 5, Gate3, Zion Court Estate, Prince Samuel Adedoyin Street, Ikate, Lagos State, Nigeria; email info@faberongroups.com; phone +234 703 028 8378. Keep the CAC documents ready; Dun & Bradstreet may call. Allow up to 30 days.
3. When the D-U-N-S number arrives, ask Claude to add it to `config/company.ts`.

## 2. Domain and website: done (20 November 2026)

- faberongroups.com is registered at Namecheap. DNS stays at Namecheap: `A @` and `A www` point to Vercel (`76.76.21.21`).
- Vercel serves the site with HTTPS. In Vercel production: `NEXT_PUBLIC_SITE_URL=https://faberongroups.com`, `CANONICAL_REDIRECT_ENABLED=true`, `LEGACY_HOSTS=i-dokoai.vercel.app,www.faberongroups.com`.
- Readiness check: `npm run check:readiness -- https://faberongroups.com --legacy i-dokoai.vercel.app` passed 30 of 30.

## 3. Company email

Done (20 November 2026):

- Zoho Mail, Forever Free plan. The domain is verified and **info@faberongroups.com** is created. Sign in at https://mail.zoho.com.
- In Namecheap: Mail Settings is **Custom MX** (`mx.zoho.com` 10, `mx2.zoho.com` 20, `mx3.zoho.com` 50), plus SPF `v=spf1 include:zohomail.com ~all` and DKIM on `zmail._domainkey`. Zoho shows all records verified.
- The Forever Free plan has no IMAP or POP: use the Zoho Mail website or the Zoho Mail app on your phone.

Still to do:

1. Send a test email to info@faberongroups.com from another account, and reply to it, to confirm both directions work.
2. Recommended: in Zoho Mail admin, add a user in your own name, e.g. **hubert@faberongroups.com**, for your Apple Account (the free plan allows 5 users).
3. Optional: aliases **support@** and **privacy@** on the info@ user.
4. So the website's forms send email: create a Resend account, add `faberongroups.com`, and add the DNS records Resend shows in Namecheap. Resend uses its own records on a `send` subdomain, so they don't clash with Zoho. When Resend says "verified", set in Vercel and redeploy:
   - `RESEND_API_KEY` (from Resend)
   - `EMAIL_FROM` = `Faberon Group <no-reply@faberongroups.com>`
   - `EMAIL_REPLY_TO` = `info@faberongroups.com`
   - `LEADS_NOTIFY_EMAIL` = `info@faberongroups.com`
5. Test: send a request from https://faberongroups.com/support and check that both emails arrive.

## 4. When step 1 is done (and info@ is tested): enroll

Re-read the official pages first, because the rules change.

- **Apple Developer Program:** https://developer.apple.com/programs/enroll/
  Website: https://faberongroups.com · Work email: your @faberongroups.com address · D-U-N-S from step 1.
- **Google Play Console (organisation):** https://support.google.com/googleplay/android-developer/answer/13628312
  Website: https://faberongroups.com · Organisation phone: +234 703 028 8378.
  Note: Google shows your legal name, D-U-N-S number, address, developer email and developer phone publicly.

Fill in the consistency sheet in DEVELOPER_ACCOUNT_READINESS.md (section 3) before you start. Every form must match the CAC certificate exactly.

## 5. Later, when you publish an app

Ask Claude to add the app to `config/apps.ts`. The support page, deletion page, privacy policy, footer, `/apps` and the app-link files then update by themselves. Use these URLs in the store listings:

- Privacy policy: https://faberongroups.com/privacy
- Support: https://faberongroups.com/support
- Account deletion: https://faberongroups.com/delete-account

## Other open items

- Have a lawyer review the Privacy Policy and Terms.
- Decide how long server logs are kept, and add it to the Privacy Policy.
- Decide whether the home page highlights ("3" years, "20" projects) should say they are the founder's own track record.
- Optional: a Cal.com booking link (`NEXT_PUBLIC_BOOKING_URL`), Google Search Console (`GOOGLE_SITE_VERIFICATION`), Plausible analytics.
- The AI chat assistant (Phase 2 in UPGRADE_PLAN.md) needs an Anthropic API key when you want it.
