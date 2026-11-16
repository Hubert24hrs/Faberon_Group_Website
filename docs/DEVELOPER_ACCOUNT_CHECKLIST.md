# Apple and Google organisation developer accounts: website checklist

Status as of 16 November 2026. "Site" items are built and live. "Owner" items need action outside the code.

## What the website already provides

| Requirement                                          | Where                                                                                    | Status                                                                                |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Exact legal name, Faberon Group Technologies Limited | Header logo, hero, footer, copyright, About Us, Contact, Privacy, Terms, structured data | Site: done                                                                            |
| Physical street address, not a P.O. Box              | Footer, Contact, About Us, Privacy, Terms                                                | Site: done                                                                            |
| Nigerian phone number                                | Footer, Contact, About Us, legal pages, structured data                                  | Site: done                                                                            |
| Organisation email on the company domain             | info@faberongroups.com, shown site-wide                                                  | Site: done. Owner: the mailbox must exist.                                            |
| Real business description, not a placeholder         | Home, About Us, Services (nine pages), Solutions                                         | Site: done                                                                            |
| Privacy Policy covering mobile apps                  | /privacy                                                                                 | Site: done                                                                            |
| Account deletion web link (Google Play)              | /privacy#delete-account                                                                  | Site: done                                                                            |
| Terms of Service                                     | /terms                                                                                   | Site: done                                                                            |
| Working contact form                                 | /contact and /demo                                                                       | Owner: set the Resend variables. Until then the form shows the email address instead. |
| No "under construction" or placeholder pages         | Checked across all 21 routes                                                             | Site: done                                                                            |
| HTTPS                                                | Vercel issues certificates automatically                                                 | Site: done                                                                            |
| Google Search Console verification tag               | Set `GOOGLE_SITE_VERIFICATION` in Vercel                                                 | Site: ready. Owner: add the code.                                                     |

## What only the owner can do

1. **Buy faberongroups.com** and add it to the Vercel project. Apple and Google check that the website is on the organisation's own domain. The site switches its canonical links to the domain automatically.
2. **Create the info@faberongroups.com mailbox** on the domain (Google Workspace or Zoho). Apple sends enrollment email to an address on the company domain.
3. **Set Resend** (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) after verifying the domain in Resend, so enquiries arrive by email.
4. **Get the CAC Certificate of Incorporation** and check that the name on it matches "Faberon Group Technologies Limited" exactly. Then add the RC number in `lib/site.ts`.
5. **Get a D-U-N-S number** from Dun & Bradstreet with the same legal name and address as the CAC certificate and this website. Apple and Google both use it to verify the organisation.
6. **Verify the site in Google Search Console** (HTML tag method), then set `GOOGLE_SITE_VERIFICATION` and redeploy.
7. **Answer the phone line**, +234 703 028 8378, during verification. Apple and Google may call it.
8. **Have a lawyer review** the Privacy Policy and Terms.
9. **When ready to be found in search,** set `SITE_LAUNCHED=true` in Vercel and redeploy.

## Not built yet

- **Booking:** the Cal.com embed is built but hidden until `NEXT_PUBLIC_BOOKING_URL` is set.
- **AI chat assistant:** Phase 2 in `docs/UPGRADE_PLAN.md`. It needs an Anthropic API key. Neither Apple nor Google requires it.
- **Testimonials:** the page and its 3D corridor are built but switched off. Add real, approved quotes to `content/testimonials.ts` and they go live, with the menu item, automatically.
