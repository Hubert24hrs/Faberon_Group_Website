# What to do next

Status on 17 November 2026: the website is finished for now and live at https://i-dokoai.vercel.app. Everything is on GitHub (`Hubert24hrs/Faberon_Group_Website`, branch `main`).

The work left waits on three things from you: the **CAC documents**, the **domain** and the **company email**. Do the steps below in order as each one becomes available. The detailed version of every step is in [DEVELOPER_ACCOUNT_READINESS.md](./DEVELOPER_ACCOUNT_READINESS.md).

To pick this up later, open the project in Claude Code and say: "Read docs/NEXT_STEPS.md and continue from step N."

---

## 1. When the CAC registration and documents arrive

1. Check the **exact** company name and registered address on the certificate against the website:
   - Faberon Group Technologies Limited
   - House 5, Gate 3, Zion Court Estate, Prince Samuel Adedoyin Street, Ikate, Lekki, Lagos, Nigeria
     If anything differs by even one character, it must be corrected in `config/company.ts` (ask Claude to do it).
2. Add the RC number: in Vercel, **Project → Settings → Environment Variables**, add `NEXT_PUBLIC_COMPANY_RC_NUMBER` with the number (digits only), then redeploy. It appears in the footer, About, Contact, Terms, Privacy and the search data.
3. Request a **D-U-N-S number** using Apple's free lookup: https://developer.apple.com/enroll/duns-lookup/. Use the same name and address as the certificate. Keep the CAC documents ready; Dun & Bradstreet may call. Allow up to 30 days.
4. When the D-U-N-S number arrives, ask Claude to add it to `config/company.ts`.

## 2. When you buy faberongroups.com

1. Buy the domain.
2. In Vercel, **Project → Settings → Domains**, add `faberongroups.com` (and accept the `www` redirect Vercel offers). Follow Vercel's DNS instructions at your registrar.
3. When https://faberongroups.com opens the site with a padlock, set `NEXT_PUBLIC_SITE_URL` = `https://faberongroups.com` in Vercel and redeploy.
4. Run the check (or ask Claude to): `npm run check:readiness -- https://faberongroups.com`
5. When it says "0 failed", set `CANONICAL_REDIRECT_ENABLED` = `true` and `LEGACY_HOSTS` = `i-dokoai.vercel.app`, redeploy, and run:
   `npm run check:readiness -- https://faberongroups.com --legacy i-dokoai.vercel.app`

## 3. When you set up the company email

1. Create the mailbox **info@faberongroups.com** (Google Workspace or Zoho Mail) and add the mail (MX) records they give you at your registrar. Send it a test email.
2. Create a mailbox in your own name, e.g. **hubert@faberongroups.com**, for your Apple Account.
3. Optional: aliases **support@** and **privacy@** that deliver to info@.
4. So the website's forms send email: create a Resend account, add the domain, add the DNS records Resend shows, wait for "verified", then set in Vercel and redeploy:
   - `RESEND_API_KEY` (from Resend)
   - `EMAIL_FROM` = `Faberon Group <no-reply@faberongroups.com>`
   - `EMAIL_REPLY_TO` = `info@faberongroups.com`
   - `LEADS_NOTIFY_EMAIL` = `info@faberongroups.com`
5. Test: send a request from https://faberongroups.com/support and check that both emails arrive.

## 4. When steps 1 to 3 are done: enroll

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
