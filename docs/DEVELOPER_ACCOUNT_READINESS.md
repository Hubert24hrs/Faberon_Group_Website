# Apple and Google developer accounts: owner checklist

This is the step-by-step list for enrolling **Faberon Group Technologies Limited** in the Apple Developer Program and opening a Google Play Console organisation account. Work through it from top to bottom.

Store rules change. Before you apply, re-read the official pages linked in section 4. If they say something different from this document, follow the official page.

The company's details on the website all come from one file, `config/company.ts`. Settings that change between stages are environment variables in Vercel: **Project → Settings → Environment Variables**. After changing one, redeploy: **Deployments → the latest production deployment → ⋯ → Redeploy**.

To check the live site at any stage, open a terminal in the project folder and run the command given for that stage. It prints a table and ends with "0 failed" when everything is right.

---

## 1. Moving the website to faberongroups.com

### Stage 1: now, before the domain exists (done)

The site runs at https://i-dokoai.vercel.app and is consistent with itself there.

| Variable                     | Value                       |
| ---------------------------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL`       | leave empty                 |
| `CANONICAL_REDIRECT_ENABLED` | leave empty (means "false") |

Check:

```bash
npm run check:readiness -- https://i-dokoai.vercel.app
```

### Stage 2: after you buy faberongroups.com

1. Buy the domain.
2. In Vercel, open **Project → Settings → Domains**, add `faberongroups.com`, and follow Vercel's DNS instructions. Vercel will also offer to add `www.faberongroups.com` and redirect one to the other: accept it. That apex and www redirect is handled by Vercel, not by the website code.
3. Wait until https://faberongroups.com opens the site with a padlock.
4. Set this variable for **Production**, then redeploy:

| Variable               | Value                       |
| ---------------------- | --------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://faberongroups.com` |

Check:

```bash
npm run check:readiness -- https://faberongroups.com
```

### Stage 3: after stage 2 shows "0 failed"

Make the old address forward permanently to the new one. Set these for **Production**, then redeploy:

| Variable                     | Value                 |
| ---------------------------- | --------------------- |
| `CANONICAL_REDIRECT_ENABLED` | `true`                |
| `LEGACY_HOSTS`               | `i-dokoai.vercel.app` |

Check:

```bash
npm run check:readiness -- https://faberongroups.com --legacy i-dokoai.vercel.app
```

**Only after this passes, enter https://faberongroups.com as the website in the Apple and Google forms.**

---

## 2. Mailboxes

1. Create the mailbox **info@faberongroups.com** with an email host such as Google Workspace or Zoho Mail. The host shows you the exact mailbox (MX) DNS records to add at your domain registrar. Add exactly those.
2. Send a test email to info@ from another account and confirm it arrives. Apple and Google send verification codes by email, so this must work before you apply.
3. Recommended: a mailbox in your own name on the company domain (for example `hubert@faberongroups.com`) for your Apple Account. Apple asks for a work email on the organisation's domain.
4. Recommended: aliases **support@** and **privacy@** that deliver to info@. Then add them to `config/company.ts` (`emails.support`, `emails.privacy`) and set `SUPPORT_NOTIFY_EMAIL` and `PRIVACY_NOTIFY_EMAIL` in Vercel.
5. Google says the developer email must be an official address, not a generic or personal one. Decide which address you will show publicly on Google Play.

### Website email (forms)

The contact, demo, support and deletion forms send email through Resend. Until this is set up, the forms show visitors an email address to use instead.

1. Create a Resend account and add the domain `faberongroups.com`. Resend shows the exact DNS records for sending (SPF and DKIM). Add exactly those at your registrar, then wait until Resend shows the domain as verified.
2. Set these in Vercel, then redeploy:

| Variable               | Value                                        |
| ---------------------- | -------------------------------------------- |
| `RESEND_API_KEY`       | from Resend                                  |
| `EMAIL_FROM`           | `Faberon Group <no-reply@faberongroups.com>` |
| `EMAIL_REPLY_TO`       | `info@faberongroups.com`                     |
| `LEADS_NOTIFY_EMAIL`   | `info@faberongroups.com`                     |
| `SUPPORT_NOTIFY_EMAIL` | optional, defaults to `LEADS_NOTIFY_EMAIL`   |
| `PRIVACY_NOTIFY_EMAIL` | optional, defaults to `LEADS_NOTIFY_EMAIL`   |

3. Send yourself a request from https://faberongroups.com/support and confirm both the team email and the acknowledgement arrive.

---

## 3. Consistency sheet

Reviewers compare these documents. **Every entry must match exactly, letter for letter, including punctuation.** Fill in each cell from the document itself.

| Item               | CAC certificate | Dun & Bradstreet record | Website                                                                                         | Apple form | Google form |
| ------------------ | --------------- | ----------------------- | ----------------------------------------------------------------------------------------------- | ---------- | ----------- |
| Legal name         |                 |                         | Faberon Group Technologies Limited                                                              |            |             |
| Registered address |                 |                         | House 5, Gate 3, Zion Court Estate, Prince Samuel Adedoyin Street, Ikate, Lekki, Lagos, Nigeria |            |             |
| Phone              |                 |                         | +234 703 028 8378                                                                               |            |             |
| Website            |                 |                         | https://faberongroups.com (after stage 3)                                                       |            |             |
| Email              |                 |                         | info@faberongroups.com                                                                          |            |             |

If anything on the website differs from the CAC certificate, change `config/company.ts` and redeploy, rather than changing what you type into the forms.

---

## 4. What each store asks for at enrollment

### Apple Developer Program (organisation)

Source: https://developer.apple.com/programs/enroll/

- An Apple Account with two-factor authentication, in your legal first and last name. Apple says an alias or company name in the name fields will cause a delay.
- You must have legal binding authority for the company, for example as owner or founder.
- The company must be a legal entity. Apple does not accept DBAs, fictitious business names, trade names or branches.
- A D-U-N-S Number (see section 5).
- A work email address associated with the company's domain: use your @faberongroups.com address.
- A website that is publicly available and functional, on a domain associated with the company: enter **https://faberongroups.com**. Social media pages and minimal-content sites are not accepted.
- The company name becomes the seller name on the App Store. The membership fee is 99 USD a year.

### Google Play Console (organisation)

Sources: https://support.google.com/googleplay/android-developer/answer/13628312 and https://support.google.com/googleplay/android-developer/answer/13634885

- A D-U-N-S Number is required. The legal name and address in your Google payments profile must exactly match your Dun & Bradstreet record.
- Organisation website: **https://faberongroups.com**.
- Organisation phone: the public business number from the website, **+234 703 028 8378**. Google says this one is not shown to users.
- A contact name, contact email and contact phone, and a developer email and developer phone. All are verified with one-time codes and must keep working.
- **Shown publicly on Google Play:** your legal name, D-U-N-S number, legal address, developer email and developer phone.

---

## 5. D-U-N-S Number

1. Look the company up with Apple's tool: https://developer.apple.com/enroll/duns-lookup/. If it isn't found, request a free number through the same tool.
2. Have ready: the legal name, headquarters address, mailing address and work contact details, and the CAC registration documents. Dun & Bradstreet may call to ask about the business.
3. Timing: Apple says Dun & Bradstreet takes up to 5 business days, and Apple then needs up to 2 more business days to receive it. Google says the process can take up to 30 days. Plan for the longer wait.
4. Use the same legal name and address as on the CAC certificate and the website.

---

## 6. URLs for each app listing later

Enter these in App Store Connect and Google Play Console for every app:

| Field                                  | URL                                                |
| -------------------------------------- | -------------------------------------------------- |
| Privacy policy                         | https://faberongroups.com/privacy                  |
| Support URL                            | https://faberongroups.com/support                  |
| Account deletion (Google Play)         | https://faberongroups.com/delete-account           |
| Deletion section of the privacy policy | https://faberongroups.com/privacy#account-deletion |
| Marketing URL                          | https://faberongroups.com                          |

When an app is ready, add it to `config/apps.ts` (name, store links, package name, bundle ID and Team ID, the in-app deletion path, and whether it has subscriptions). The support, deletion and privacy pages, the footer, `/apps` and the app-link files then update by themselves.

---

## 7. Open items

| Item                      | What's needed                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Domain                    | Buy faberongroups.com, then stages 2 and 3 above.                                                                                                                                                                  |
| Mailboxes                 | info@ (required before applying), your own work address, support@ and privacy@ aliases.                                                                                                                            |
| Website email             | Resend account, domain verification and the variables in section 2. Until then the forms show visitors an email address instead.                                                                                   |
| RC number                 | Set `NEXT_PUBLIC_COMPANY_RC_NUMBER` in Vercel to the number on the CAC certificate, then redeploy. It then shows in the footer, About, Contact, Terms, Privacy and structured data.                                |
| D-U-N-S Number            | Section 5. Once issued, add it to `config/company.ts` (`dunsNumber`).                                                                                                                                              |
| Stats wording             | The home page highlights show "3" years and "20" projects. These are the founder's own track record (from idokohubert.com). Decide whether to label them as such, for example "Projects delivered by our founder". |
| Response time             | Not published. Add `supportResponseTime` in `config/company.ts` if you want one shown.                                                                                                                             |
| Deletion window           | Not published. Add `deletionWindowDays` in `config/company.ts` if you want one shown.                                                                                                                              |
| Server log retention      | The Privacy Policy mentions server logs (IP addresses) but doesn't say how long they are kept. Decide, and add it to the policy.                                                                                   |
| Spam protection provider  | If you turn on Cloudflare Turnstile, add Cloudflare to the processor list in `content/processors.ts`.                                                                                                              |
| Legal review              | Have a lawyer review the Privacy Policy and Terms.                                                                                                                                                                 |
| Search Console (optional) | Set `GOOGLE_SITE_VERIFICATION` to the HTML-tag code from Google Search Console, then redeploy.                                                                                                                     |
