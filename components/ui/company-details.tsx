import { formatAddress, site, telHref } from "@/lib/site";

// The registered company details app store and D-U-N-S reviewers look for.
export function CompanyDetails() {
  const { email, phone, whatsapp, hours } = site.contact;
  const rows = [
    { label: "Registered name", value: site.legalName },
    ...(site.registrationNumber ? [{ label: "RC number", value: site.registrationNumber }] : []),
    { label: "Office address", value: formatAddress(site.contact.address) },
    ...(email ? [{ label: "Email", value: email, href: `mailto:${email}` }] : []),
    ...(phone ? [{ label: "Phone", value: phone, href: telHref(phone) }] : []),
    ...(whatsapp
      ? [
          {
            label: "WhatsApp",
            value: whatsapp,
            href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
          },
        ]
      : []),
    ...(hours ? [{ label: "Hours", value: hours }] : []),
  ];

  return (
    <dl className="divide-y divide-line">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-4">
          <dt className="font-mono text-xs text-subtle sm:pt-1">{row.label}</dt>
          <dd>
            {"href" in row && row.href ? (
              <a href={row.href} className="hover:text-accent-text">
                {row.value}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
