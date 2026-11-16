"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { Turnstile } from "@/components/forms/turnstile";
import { Button } from "@/components/ui/button";
import { readAttribution, track } from "@/lib/analytics";
import { clientEnv } from "@/lib/env";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  budgetOptions,
  contactSchema,
  messageMaxLength,
  serviceGroups,
  serviceOptions,
  type ContactInput,
} from "@/lib/validators";

type Intent = "consultation" | "demo";
type FieldName = Exclude<keyof ContactInput, "website" | "intent">;
type Status = "idle" | "success" | "error" | "rate_limited" | "disposable" | "verification";

const steps: { title: string; fields: FieldName[] }[] = [
  { title: "What do you need?", fields: ["service"] },
  { title: "What's your budget?", fields: ["budget"] },
  { title: "Tell us about the project", fields: ["company", "message"] },
  { title: "How can we reach you?", fields: ["name", "email"] },
];

const fieldLabels: Record<FieldName, string> = {
  service: "Service of interest",
  budget: "Budget",
  company: "Company",
  message: "Project description",
  name: "Name",
  email: "Work email",
};

const emptyValues: ContactInput = {
  service: "",
  budget: "" as ContactInput["budget"],
  company: "",
  message: "",
  name: "",
  email: "",
  website: "",
};

const statusMessages: Partial<Record<Status, string>> = {
  rate_limited: "Too many requests. Please wait a few minutes and try again.",
  disposable: "Please use an email address that isn't temporary, so we can reply.",
  verification: "We couldn't verify the request. Please complete the check and try again.",
};

const inputClass =
  "mt-1.5 block w-full rounded-md border border-line-strong bg-surface px-3 py-2.5 text-[0.9375rem] text-ink transition-colors placeholder:text-subtle aria-[invalid=true]:border-danger";

function readSaved(key: string): Partial<ContactInput> | undefined {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<ContactInput>) : undefined;
  } catch {
    return undefined;
  }
}

// Prefill from links such as /contact?service=Mobile%20app&budget=Not%20yet%20sure.
function readPrefill(): Partial<ContactInput> {
  const params = new URLSearchParams(window.location.search);
  const prefill: Partial<ContactInput> = {};
  const service = params.get("service");
  const budget = params.get("budget");
  const message = params.get("message");
  const company = params.get("company");
  if (service && serviceOptions.includes(service)) prefill.service = service;
  if (budget && (budgetOptions as readonly string[]).includes(budget)) {
    prefill.budget = budget as ContactInput["budget"];
  }
  if (message) prefill.message = message.slice(0, messageMaxLength);
  if (company) prefill.company = company.slice(0, 160);
  return prefill;
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: FieldError;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

export function ConsultationForm({
  intent = "consultation",
  nextSteps,
}: {
  intent?: Intent;
  nextSteps: string[];
}) {
  const storageKey = `faberon-form-${intent}`;
  const turnstileSiteKey = clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [showSummary, setShowSummary] = useState(false);
  const [token, setToken] = useState<string>();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    trigger,
    subscribe,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: emptyValues,
  });
  const message = useWatch({ control, name: "message" }) ?? "";

  useEffect(() => {
    const saved = readSaved(storageKey);
    const prefill = readPrefill();
    if (saved || Object.keys(prefill).length > 0) {
      reset({ ...emptyValues, ...saved, ...prefill, website: "" });
    }
  }, [reset, storageKey]);

  // Autosave to the session, so a reload or a wrong turn doesn't lose the brief.
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => {
          try {
            sessionStorage.setItem(storageKey, JSON.stringify({ ...values, website: undefined }));
          } catch {
            // Storage can be blocked; the form still works.
          }
        },
      }),
    [subscribe, storageKey],
  );

  const current = steps[step]!;
  const isLast = step === steps.length - 1;
  const stepErrors = current.fields.filter((field) => errors[field]);

  function moveTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function showErrors() {
    setShowSummary(true);
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  async function goNext() {
    if (!(await trigger(current.fields))) {
      showErrors();
      return;
    }
    setShowSummary(false);
    track("Form step", { intent, step: step + 2 });
    moveTo(step + 1);
  }

  function goBack() {
    setShowSummary(false);
    moveTo(step - 1);
  }

  async function onSubmit(values: ContactInput) {
    if (turnstileSiteKey && !token) {
      setStatus("verification");
      return;
    }
    setStatus("idle");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          intent,
          page: window.location.pathname,
          attribution: readAttribution(),
          turnstileToken: token,
        }),
      });
      if (response.ok) {
        track("Lead submitted", { intent, service: values.service, budget: values.budget });
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          // Nothing to clear.
        }
        reset(emptyValues);
        setStep(0);
        setStatus("success");
        return;
      }
      const { error } = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(
        response.status === 429
          ? "rate_limited"
          : error === "disposable_email"
            ? "disposable"
            : error === "verification_failed"
              ? "verification"
              : "error",
      );
    } catch {
      setStatus("error");
    }
  }

  // A final submit can surface errors from an earlier step, e.g. restored data.
  function onInvalid(invalid: Partial<Record<keyof ContactInput, unknown>>) {
    const first = steps.findIndex((item) => item.fields.some((field) => invalid[field]));
    if (first >= 0 && first !== step) setStep(first);
    showErrors();
  }

  function aria(name: FieldName, describedBy: string[] = []) {
    const ids = [...describedBy, ...(errors[name] ? [`${name}-error`] : [])];
    return {
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": ids.length > 0 ? ids.join(" ") : undefined,
    };
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-lg border border-line bg-surface p-6 sm:p-8">
        <CircleCheck className="size-6 text-success" strokeWidth={1.75} aria-hidden />
        <h2 className="mt-4 text-h3">Thanks, we have your request</h2>
        <p className="mt-2 text-muted">Here&apos;s what happens next:</p>
        <ol className="mt-4 space-y-3">
          {nextSteps.map((item, index) => (
            <li key={item} className="grid grid-cols-[2rem_1fr]">
              <span className="pt-0.5 font-mono text-xs text-subtle">{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-accent-text hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  const failure =
    status === "error"
      ? `That didn't send. Please try again shortly${
          site.contact.email ? `, or email ${site.contact.email}` : ""
        }.`
      : statusMessages[status];

  return (
    <form
      id="form"
      onSubmit={(event) => void handleSubmit(onSubmit, onInvalid)(event)}
      noValidate
      className="rounded-lg border border-line bg-surface p-6 sm:p-8"
    >
      <ol aria-label="Form progress" className="grid grid-cols-4 gap-1.5">
        {steps.map((item, index) => (
          <li
            key={item.title}
            aria-current={index === step ? "step" : undefined}
            className={cn("h-1 rounded-full", index <= step ? "bg-accent" : "bg-surface-2")}
          >
            <span className="sr-only">
              {item.title}
              {index < step ? " (done)" : ""}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 font-mono text-xs text-subtle">
        Step {step + 1} of {steps.length}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-h3 outline-none">
        {current.title}
      </h2>

      {showSummary && stepErrors.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-md border border-danger p-4 text-sm outline-none"
        >
          <p className="font-medium text-danger">Please fix the following:</p>
          <ul className="mt-2 space-y-1">
            {stepErrors.map((field) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() => setFocus(field)}
                  className="text-left text-danger underline"
                >
                  {fieldLabels[field]}: {errors[field]?.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {step === 0 ? (
          <Field id="service" label="Service of interest" error={errors.service}>
            <select
              id="service"
              className={inputClass}
              {...aria("service")}
              {...register("service")}
            >
              <option value="" disabled>
                Choose one
              </option>
              {serviceGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
        ) : null}

        {step === 1 ? (
          <fieldset aria-describedby={errors.budget ? "budget-error" : undefined}>
            <legend className="text-sm font-medium">Budget (USD)</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {budgetOptions.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-line-strong px-3 py-2.5 text-[0.9375rem] has-checked:border-accent has-checked:bg-accent-soft"
                >
                  <input
                    type="radio"
                    value={option}
                    className="accent-[var(--accent)]"
                    {...register("budget")}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.budget ? (
              <p id="budget-error" className="mt-1.5 text-sm text-danger">
                {errors.budget.message}
              </p>
            ) : null}
          </fieldset>
        ) : null}

        {step === 2 ? (
          <>
            <Field id="company" label="Company or organisation" error={errors.company}>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                className={inputClass}
                {...aria("company")}
                {...register("company")}
              />
            </Field>
            <Field
              id="message"
              label="What do you need built?"
              hint="A few sentences on the problem, who it's for, and any deadline."
              error={errors.message}
            >
              <textarea
                id="message"
                rows={6}
                maxLength={messageMaxLength}
                className={cn(inputClass, "resize-y")}
                {...aria("message", ["message-hint", "message-count"])}
                {...register("message")}
              />
              <p id="message-count" className="mt-1 text-right font-mono text-xs text-subtle">
                {message.length.toLocaleString()} / {messageMaxLength.toLocaleString()}
              </p>
            </Field>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Name" error={errors.name}>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={inputClass}
                  {...aria("name")}
                  {...register("name")}
                />
              </Field>
              <Field id="email" label="Work email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  {...aria("email")}
                  {...register("email")}
                />
              </Field>
            </div>
            <Turnstile siteKey={turnstileSiteKey} onToken={setToken} />
            <p className="text-sm text-muted">
              We use these details only to reply to your request. See our{" "}
              <Link href="/privacy" className="text-accent-text underline">
                Privacy Policy
              </Link>
              .
            </p>
          </>
        ) : null}
      </div>

      {/* Honeypot, kept off-screen rather than display:none so bots still fill it. */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {failure ? (
        <p role="alert" className="mt-5 text-sm text-danger">
          {failure}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={goBack}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {isLast ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Sending"
              : intent === "demo"
                ? "Request a demo"
                : "Request a consultation"}
          </Button>
        ) : (
          <Button type="button" onClick={goNext}>
            Continue
          </Button>
        )}
      </div>
    </form>
  );
}
