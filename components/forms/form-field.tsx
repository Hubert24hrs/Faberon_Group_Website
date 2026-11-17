import type { ReactNode } from "react";

// Shared building blocks for the site's forms (consultation, demo, support, deletion),
// so every form has the same labels, required markers, errors and spam trap.

export const inputClass =
  "mt-1.5 block w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-base text-ink transition-colors sm:text-[0.9375rem] placeholder:text-subtle aria-[invalid=true]:border-danger";

/** The visible marker on required fields. Screen readers get aria-required on the control. */
export function RequiredMark() {
  return <span className="ml-1.5 font-normal text-subtle">(required)</span>;
}

export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The spam trap. Hidden from sight and from assistive technology (no label, not
 * focusable, no autofill), so only bots fill it. The server rejects any submission
 * where it has a value.
 */
export function SpamTrap({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      {children}
    </div>
  );
}

/** Props for the spam trap input. Spread the form library's register() result after these. */
export const spamTrapInputProps = {
  id: "website",
  type: "text",
  tabIndex: -1,
  autoComplete: "off",
  "aria-hidden": true,
} as const;
