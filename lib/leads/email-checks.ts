// Common throwaway inbox providers. Not exhaustive: it stops casual misuse.
const disposableDomains = new Set([
  "10minutemail.com",
  "burnermail.io",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mintemail.com",
  "mohmal.com",
  "moakt.com",
  "mytemp.email",
  "sharklasers.com",
  "spamgourmet.com",
  "temp-mail.org",
  "tempail.com",
  "tempinbox.com",
  "tempmail.com",
  "tempr.email",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const freeMailDomains = new Set([
  "aol.com",
  "gmail.com",
  "gmx.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "mail.com",
  "outlook.com",
  "proton.me",
  "protonmail.com",
  "yahoo.com",
  "ymail.com",
]);

export function emailDomain(email: string) {
  return email.split("@").pop()?.toLowerCase() ?? "";
}

export function isDisposableEmail(email: string) {
  return disposableDomains.has(emailDomain(email));
}

export function isFreeMailEmail(email: string) {
  return freeMailDomains.has(emailDomain(email));
}
