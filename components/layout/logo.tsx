import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// The Faberon Group logo, redrawn from the supplied artwork. Brand colours are
// fixed so the mark looks the same in both themes.
export const logoColors = { navy: "#0A2038", cream: "#F3F1E4", gold: "#D5A63A" };

export const logoShapes = {
  letter: "292,216 752,216 692,344 428,344 428,808 292,808",
  bar: "428,448 660,448 608,572 428,572",
  peak: "680,681 760,808 600,808",
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden className={cn("size-8 shrink-0", className)}>
      <rect width="1024" height="1024" rx="236" fill={logoColors.navy} />
      <polygon points={logoShapes.letter} fill={logoColors.cream} />
      <polygon points={logoShapes.bar} fill={logoColors.gold} />
      <polygon points={logoShapes.peak} fill={logoColors.gold} />
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
