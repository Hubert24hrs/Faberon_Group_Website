"use client";

import { CircleCheck } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import {
  Field,
  inputClass,
  RequiredMark,
  SpamTrap,
  spamTrapInputProps,
} from "@/components/forms/form-field";
import { Turnstile } from "@/components/forms/turnstile";
import { Button } from "@/components/ui/button";
import { clientEnv } from "@/lib/env";
import { cn } from "@/lib/utils";
import { deletionSchema, supportSchema } from "@/lib/validators";

// Schemas are looked up by name: server pages can't pass a schema object to a client component.
const schemas = { support: supportSchema, deletion: deletionSchema } satisfies Record<
  string,
  z.ZodType
>;

// A single-page request form (support, account deletion). Validated in the browser
// with the same Zod schema the server uses, with errors tied to each field.

type Common = { name: string; label: string; required?: boolean; hint?: string };

export type FieldSpec =
  | (Common & { kind: "text" | "email"; autoComplete?: string })
  | (Common & { kind: "textarea"; maxLength: number; rows?: number })
  | (Common & { kind: "select"; options: readonly string[] })
  | (Common & { kind: "radio"; options: readonly { value: string; label: string }[] })
  | (Common & { kind: "checkbox" });

type Status =
  "idle" | "submitting" | "success" | "failed" | "rate_limited" | "disposable" | "verification";

const statusMessages: Partial<Record<Status, string>> = {
  rate_limited: "Too many requests. Please wait a few minutes and try again.",
  disposable: "Please use an email address that isn't temporary, so we can reply.",
  verification: "We couldn't verify the request. Please complete the check and try again.",
};

export function RequestForm({
  endpoint,
  schema,
  fields,
  submitLabel,
  successTitle,
  successText,
  fallbackEmail,
  fallbackSubject,
}: {
  endpoint: string;
  schema: keyof typeof schemas;
  fields: FieldSpec[];
  submitLabel: string;
  successTitle: string;
  successText: string;
  /** Shown if sending fails, so the request can still be made. */
  fallbackEmail: string;
  fallbackSubject: string;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [token, setToken] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const turnstileSiteKey = clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const labels = Object.fromEntries(fields.map((field) => [field.name, field.label]));

  function readValues(form: HTMLFormElement) {
    const data = new FormData(form);
    const values: Record<string, unknown> = { website: data.get("website") ?? "" };
    for (const field of fields) {
      values[field.name] =
        field.kind === "checkbox" ? data.get(field.name) === "on" : (data.get(field.name) ?? "");
    }
    return values;
  }

  function validate(values: Record<string, unknown>) {
    const result = (schemas[schema] as z.ZodType).safeParse(values);
    if (result.success) return {};
    const fieldErrors = z.flattenError(result.error).fieldErrors as Record<
      string,
      string[] | undefined
    >;
    return Object.fromEntries(
      Object.entries(fieldErrors)
        .filter(([name, messages]) => name in labels && messages?.length)
        .map(([name, messages]) => [name, messages![0]!]),
    );
  }

  function showSummary(next: Record<string, string>) {
    setErrors(next);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitted(true);
    const values = readValues(form);
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      showSummary(found);
      return;
    }
    if (turnstileSiteKey && !token) {
      setStatus("verification");
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        reference?: string;
        fieldErrors?: Record<string, string[]>;
      };
      setReference(body.reference ?? null);
      if (response.ok) {
        form.reset();
        setSubmitted(false);
        setStatus("success");
        requestAnimationFrame(() => resultRef.current?.focus());
        return;
      }
      const serverErrors = Object.fromEntries(
        Object.entries(body.fieldErrors ?? {})
          .filter(([name, messages]) => name in labels && messages?.length)
          .map(([name, messages]) => [name, messages[0]!]),
      );
      if (Object.keys(serverErrors).length > 0) {
        setStatus("idle");
        showSummary(serverErrors);
        return;
      }
      setStatus(
        response.status === 429
          ? "rate_limited"
          : body.error === "disposable_email"
            ? "disposable"
            : body.error === "verification_failed"
              ? "verification"
              : "failed",
      );
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch {
      setStatus("failed");
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }

  // After the first submit, errors update as the visitor fixes them.
  function onChange() {
    if (submitted && formRef.current) setErrors(validate(readValues(formRef.current)));
  }

  if (status === "success") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="rounded-lg border border-line bg-surface p-6 outline-none sm:p-8"
      >
        <CircleCheck className="size-6 text-success" strokeWidth={1.75} aria-hidden />
        <h3 className="mt-4 text-h3">{successTitle}</h3>
        <p className="mt-2 text-muted">{successText}</p>
        {reference ? (
          <p className="mt-4 text-sm">
            Your reference: <span className="font-mono text-ink">{reference}</span>
          </p>
        ) : null}
      </div>
    );
  }

  const errorList = Object.entries(errors);
  const mailto = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
    reference ? `${fallbackSubject} (${reference})` : fallbackSubject,
  )}`;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onChange={onChange} className="relative">
      {errorList.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 rounded-md border border-danger p-4 text-sm outline-none"
        >
          <p className="font-medium text-danger">Please fix the following:</p>
          <ul className="mt-2 space-y-1">
            {errorList.map(([name, message]) => (
              <li key={name}>
                <a href={`#${name}`} className="text-danger underline">
                  {labels[name]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-5">
        {fields.map((field) => {
          const error = errors[field.name];
          const describedBy =
            [field.hint ? `${field.name}-hint` : null, error ? `${field.name}-error` : null]
              .filter(Boolean)
              .join(" ") || undefined;
          const a11y = {
            id: field.name,
            name: field.name,
            "aria-required": field.required ? true : undefined,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
          };

          if (field.kind === "radio") {
            return (
              <fieldset key={field.name} aria-describedby={describedBy}>
                <legend className="text-sm font-medium">
                  {field.label}
                  {field.required ? <RequiredMark /> : null}
                </legend>
                <div
                  role="radiogroup"
                  aria-required={field.required ? true : undefined}
                  aria-invalid={error ? true : undefined}
                  aria-label={field.label}
                  className="mt-2 grid gap-2"
                >
                  {field.options.map((option, index) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer items-center gap-3 rounded-md border border-line-strong px-3 py-2.5 text-[0.9375rem] has-checked:border-accent has-checked:bg-accent-soft"
                    >
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        id={index === 0 ? field.name : undefined}
                        className="accent-[var(--accent)]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {error ? (
                  <p id={`${field.name}-error`} className="mt-1.5 text-sm text-danger">
                    {error}
                  </p>
                ) : null}
              </fieldset>
            );
          }

          if (field.kind === "checkbox") {
            return (
              <div key={field.name}>
                <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem]">
                  <input type="checkbox" {...a11y} className="mt-1 size-4 accent-[var(--accent)]" />
                  <span>
                    {field.label}
                    {field.required ? <RequiredMark /> : null}
                  </span>
                </label>
                {error ? (
                  <p id={`${field.name}-error`} className="mt-1.5 text-sm text-danger">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          }

          return (
            <Field
              key={field.name}
              id={field.name}
              label={field.label}
              hint={field.hint}
              error={error}
              required={field.required}
            >
              {field.kind === "textarea" ? (
                <textarea
                  {...a11y}
                  rows={field.rows ?? 6}
                  maxLength={field.maxLength}
                  className={cn(inputClass, "resize-y")}
                />
              ) : field.kind === "select" ? (
                <select {...a11y} defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  {...a11y}
                  type={field.kind}
                  autoComplete={field.autoComplete}
                  className={inputClass}
                />
              )}
            </Field>
          );
        })}
      </div>

      <SpamTrap>
        <input {...spamTrapInputProps} name="website" />
      </SpamTrap>

      <div className="mt-5">
        <Turnstile siteKey={turnstileSiteKey} onToken={setToken} />
      </div>

      {status === "failed" || statusMessages[status] ? (
        <div
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 text-sm text-danger outline-none"
        >
          {status === "failed" ? (
            <p>
              We couldn&apos;t send your request just now. Please email{" "}
              <a href={mailto} className="underline">
                {fallbackEmail}
              </a>{" "}
              instead{reference ? `, quoting ${reference}` : ""}.
            </p>
          ) : (
            <p>{statusMessages[status]}</p>
          )}
        </div>
      ) : null}

      <Button type="submit" className="mt-6" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : submitLabel}
      </Button>
    </form>
  );
}
