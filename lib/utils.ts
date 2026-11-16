import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function absoluteUrl(path: string, base: string) {
  return new URL(path, base).toString();
}

/**
 * For a link to the page you're already on, such as Home on the homepage: instead of
 * doing nothing, go back to the top of the page and drop any #section from the address.
 * Returns true when it handled the click. Modified clicks (new tab, etc.) are left alone.
 */
export function backToTopIfCurrent(
  event: {
    preventDefault(): void;
    metaKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
    button: number;
  },
  href: string,
) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return false;
  }
  if (href !== window.location.pathname) return false;
  event.preventDefault();
  if (window.location.hash) window.history.replaceState(window.history.state, "", href);
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
  // Just after the click, so a menu that is closing has released its scroll lock first.
  window.setTimeout(() => window.scrollTo({ top: 0, behavior }), 0);
  return true;
}
