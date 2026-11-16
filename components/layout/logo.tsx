import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Original "F" monogram. The amber square carries over the accent from the design system.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="7" fill="var(--ink)" />
      <rect x="10" y="8" width="4.4" height="16" fill="var(--bg)" />
      <rect x="10" y="8" width="13" height="4.4" fill="var(--bg)" />
      <rect x="10" y="14.8" width="8.6" height="4.4" fill="var(--bg)" />
      <rect x="20.4" y="14.8" width="4.4" height="4.4" fill="var(--accent)" />
    </svg>
  );
}

// Shows the full legal name on two lines, so it stays readable at phone widths.
export function Logo({ className, large = false }: { className?: string; large?: boolean }) {
  const [first, second] = site.legalName.split(/ (?=Technologies)/);

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={large ? "size-10" : undefined} />
      <span className="block leading-none">
        <span
          className={cn(
            "block font-display font-semibold tracking-tight",
            large ? "text-lg" : "text-[0.9375rem]",
          )}
        >
          {first}
        </span>{" "}
        <span
          className={cn(
            "mt-1 block font-medium tracking-wide text-muted",
            large ? "text-[0.8125rem]" : "text-[0.6875rem]",
          )}
        >
          {second}
        </span>
      </span>
    </span>
  );
}
