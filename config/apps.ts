// Apps published under the company's own name. Pages, the support and deletion
// pages, the privacy policy and the app-link files read from this list. While it is
// empty, every page still reads correctly at company level and the app-specific
// parts render nothing.

export type PublishedApp = {
  slug: string;
  name: string;
  shortDescription: string;
  ios?: {
    appStoreId?: string;
    bundleId?: string;
    /** Apple Developer Team ID, e.g. "ABCDE12345". */
    teamId?: string;
    storeUrl?: string;
  };
  android?: {
    packageName?: string;
    /** SHA-256 signing certificate fingerprints, colon-separated hex. */
    sha256CertFingerprints?: string[];
    storeUrl?: string;
  };
  supportEmail?: string;
  /** Where deletion lives in the app, e.g. "Settings > Account > Delete account". */
  inAppDeletionPath?: string;
  hasSubscriptions: boolean;
  /** App-specific privacy notes, shown in the privacy policy under the app's name. */
  dataNotes?: string;
};

export const apps: PublishedApp[] = [];

/** The contents of /app-ads.txt. Null serves a 404. */
export const appAdsTxt: string | null = null;
