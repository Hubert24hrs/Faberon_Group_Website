import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { GlassDock } from "@/components/layout/glass-dock";
import { Navbar } from "@/components/layout/navbar";
import { themeScript } from "@/components/layout/theme-toggle";
import { Analytics } from "@/components/analytics/analytics";
import { clientEnv } from "@/lib/env";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/styles/globals.css";

// Headings use a single weight, so only that file is shipped.
const generalSans = localFont({
  src: "./fonts/GeneralSans-Semibold.woff2",
  weight: "600",
  style: "normal",
  variable: "--font-general-sans",
  display: "swap",
});

// Mono is only used for small labels, so it isn't worth a preload.
const geistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | Custom SaaS, AI agents and mobile apps`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.legalName,
    title: site.tagline,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.tagline,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0d11" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${geistMono.variable} ${generalSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only rounded-md bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd()} />
        <AnnouncementBar />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        {/* Room for the floating dock, so it never covers the footer. */}
        <div aria-hidden className="h-24 print:hidden" />
        <GlassDock />
        <Analytics domain={clientEnv.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} />
      </body>
    </html>
  );
}
