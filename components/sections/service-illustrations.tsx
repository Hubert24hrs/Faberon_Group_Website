import {
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  FileText,
  Home,
  Package,
  Split,
  User,
} from "lucide-react";
import type { ServiceSlug } from "@/content/services";
import { cn } from "@/lib/utils";

// Small interface mock-ups built from tokens. Decorative: the figures and names
// are sample UI content, not client data.

function SaasIllustration() {
  const nav = ["Overview", "Customers", "Billing", "Reports"];
  const bars = [38, 52, 44, 66, 58, 74, 62, 88, 70, 96];
  return (
    <div
      aria-hidden
      className="flex h-48 overflow-hidden rounded-t-md border border-b-0 border-line bg-bg text-[0.625rem]"
    >
      <div className="w-24 shrink-0 border-r border-line p-2.5">
        <div className="flex items-center gap-1.5 font-semibold text-ink">
          <span className="size-3 rounded-sm bg-accent" />
          Workspace
        </div>
        <ul className="mt-3 space-y-1">
          {nav.map((item, index) => (
            <li
              key={item}
              className={cn(
                "rounded-sm px-1.5 py-1",
                index === 0 ? "bg-surface-2 font-medium text-ink" : "text-muted",
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 flex-1 p-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-ink">Overview</span>
          <span className="rounded-sm border border-line px-1.5 py-0.5 text-muted">This month</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="rounded-sm border border-line p-1.5">
            <p className="text-muted">Active users</p>
            <p className="mt-0.5 text-xs font-semibold text-ink">
              2,418 <span className="text-[0.5625rem] font-medium text-success">+12%</span>
            </p>
          </div>
          <div className="rounded-sm border border-line p-1.5">
            <p className="text-muted">Revenue</p>
            <p className="mt-0.5 text-xs font-semibold text-ink">
              $18.4k <span className="text-[0.5625rem] font-medium text-success">+8%</span>
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex h-16 items-end gap-1">
          {bars.map((height, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-t-sm",
                index === bars.length - 1 ? "bg-accent" : "bg-surface-2",
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[0.5625rem] text-subtle">
          <span>Jan</span>
          <span>Oct</span>
        </div>
      </div>
    </div>
  );
}

function AgentsIllustration() {
  const steps = ["Read the request", "Check the records", "Prepare the action"];
  return (
    <div aria-hidden className="space-y-2 font-mono text-xs">
      {steps.map((step) => (
        <div
          key={step}
          className="flex items-center gap-2 rounded-sm border border-line bg-bg p-2.5 text-muted"
        >
          <Check className="size-3.5 shrink-0 text-success" strokeWidth={2} />
          {step}
        </div>
      ))}
      <div className="flex items-center gap-2 rounded-sm border border-accent bg-accent-soft p-2.5 text-accent-text">
        <Clock className="size-3.5 shrink-0" strokeWidth={2} />
        Waiting for approval
      </div>
    </div>
  );
}

function AutomationIllustration() {
  const steps = [
    { icon: FileText, title: "Form received", detail: "New enquiry" },
    { icon: Split, title: "Checked and routed", detail: "Rules, then AI" },
    { icon: Database, title: "CRM updated", detail: "Owner notified" },
  ];
  return (
    <div aria-hidden className="flex items-center text-[0.625rem]">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const active = index === 1;
        return (
          <div key={step.title} className="flex min-w-0 flex-1 items-center">
            {index > 0 ? (
              <span className="relative h-px w-3 shrink-0 bg-line-strong sm:w-5">
                <span className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-accent" />
              </span>
            ) : null}
            <div
              className={cn(
                "min-w-0 flex-1 rounded-md border p-2",
                active ? "border-accent bg-accent-soft" : "border-line-strong bg-bg",
              )}
            >
              <Icon
                className={cn("size-3.5", active ? "text-accent-text" : "text-muted")}
                strokeWidth={1.75}
              />
              <p className="mt-1.5 leading-tight font-medium text-ink">{step.title}</p>
              <p className="mt-0.5 leading-tight text-muted">{step.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileIllustration() {
  const rows = [
    { icon: Package, label: "Track order" },
    { icon: CreditCard, label: "Payments" },
  ];
  return (
    <div
      aria-hidden
      className="mx-auto h-48 w-40 overflow-hidden rounded-t-2xl border border-b-0 border-line-strong bg-bg px-2.5 pt-2 text-[0.625rem]"
    >
      <div className="flex justify-between font-mono text-[0.5625rem] text-subtle">
        <span>9:41</span>
        <span className="mt-1 h-1 w-8 rounded-full bg-surface-2" />
        <span>100%</span>
      </div>
      <p className="mt-2.5 text-muted">Good morning,</p>
      <p className="text-xs font-semibold text-ink">Ada</p>
      <div className="mt-2 rounded-md border border-accent bg-accent-soft p-2">
        <p className="font-medium text-ink">Order #2041</p>
        <p className="text-muted">Out for delivery</p>
        <div className="mt-1.5 h-1 rounded-full bg-surface-2">
          <div className="h-1 w-3/4 rounded-full bg-accent" />
        </div>
      </div>
      <ul className="mt-1.5">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <li
              key={row.label}
              className="flex items-center gap-1.5 border-b border-line py-1.5 text-ink"
            >
              <Icon className="size-3 text-muted" strokeWidth={1.75} />
              <span className="flex-1">{row.label}</span>
              <ChevronRight className="size-3 text-subtle" strokeWidth={1.75} />
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex justify-around text-subtle">
        <Home className="size-3.5 text-accent-text" strokeWidth={1.75} />
        <Package className="size-3.5" strokeWidth={1.75} />
        <User className="size-3.5" strokeWidth={1.75} />
      </div>
    </div>
  );
}

function WebsiteIllustration() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-md border border-line bg-bg text-[0.625rem]"
    >
      <div className="border-b border-line bg-surface-2 px-2.5 py-1.5">
        <div className="mx-auto w-2/3 rounded-sm bg-bg py-0.5 text-center font-mono text-[0.5625rem] text-subtle">
          yourcompany.com
        </div>
      </div>
      <div className="p-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold text-ink">
            <span className="size-2.5 rounded-sm bg-accent" />
            Brand
          </span>
          <span className="flex gap-2 text-muted">
            <span>About</span>
            <span>Services</span>
            <span>Contact</span>
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-tight font-semibold text-ink">
              Fresh coffee, delivered weekly
            </p>
            <p className="mt-1 text-muted">Roasted to order and on your doorstep.</p>
            <div className="mt-2 flex gap-1.5">
              <span className="rounded-sm bg-accent px-2 py-1 font-medium text-accent-ink">
                Get started
              </span>
              <span className="rounded-sm border border-line px-2 py-1 text-ink">Learn more</span>
            </div>
          </div>
          <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md bg-accent-soft">
            <span className="absolute -right-3 -bottom-4 size-14 rounded-full bg-accent/40" />
            <span className="absolute top-2 left-2 size-4 rounded-full bg-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MachineLearningIllustration() {
  const points = [
    [18, 58],
    [30, 50],
    [44, 54],
    [58, 42],
    [70, 46],
    [86, 34],
    [100, 38],
    [116, 26],
    [130, 30],
    [146, 18],
  ];
  return (
    <div aria-hidden>
      <svg viewBox="0 0 164 72" fill="none" className="h-auto w-full">
        <path d="M8 66h148M8 66V6" stroke="var(--line-strong)" strokeWidth="1.5" />
        <path d="M14 60 150 16" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" />
        {points.map(([x, y], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="3"
            fill={index === 7 ? "var(--accent)" : "var(--muted)"}
          />
        ))}
      </svg>
      <div className="mt-2 flex gap-4 font-mono text-[0.625rem] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-muted" />
          Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-px w-3 bg-accent" />
          Predicted
        </span>
      </div>
    </div>
  );
}

function DataIllustration() {
  const rows = [
    { source: "CRM", rows: "12,480", status: "Synced" },
    { source: "Payments", rows: "8,912", status: "Synced" },
    { source: "Web forms", rows: "1,204", status: "Running" },
    { source: "Support desk", rows: "3,377", status: "Synced" },
  ];
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-md border border-line bg-bg text-[0.625rem]"
    >
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-line bg-surface-2 px-2.5 py-1.5 font-mono text-subtle">
        <span>Source</span>
        <span>Rows</span>
        <span>Status</span>
      </div>
      {rows.map((row) => {
        const running = row.status === "Running";
        return (
          <div
            key={row.source}
            className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 border-b border-line px-2.5 py-1.5 last:border-b-0"
          >
            <span className="text-ink">{row.source}</span>
            <span className="font-mono text-muted">{row.rows}</span>
            <span
              className={cn("flex items-center gap-1", running ? "text-accent-text" : "text-muted")}
            >
              <span className={cn("size-1.5 rounded-full", running ? "bg-accent" : "bg-success")} />
              {row.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FullStackIllustration() {
  const layers = ["Interface", "API", "Database"];
  return (
    <div aria-hidden className="space-y-2 font-mono text-xs">
      {layers.map((layer, index) => (
        <div
          key={layer}
          className={
            index === 1
              ? "rounded-sm border border-accent bg-accent-soft p-2.5 text-accent-text"
              : "rounded-sm border border-line bg-bg p-2.5 text-muted"
          }
        >
          {layer}
        </div>
      ))}
    </div>
  );
}

function CloudIllustration() {
  const stages = ["Build", "Test", "Deploy", "Monitor"];
  return (
    <div aria-hidden className="flex items-center gap-1.5 font-mono text-[0.6875rem]">
      {stages.map((stage, index) => (
        <div
          key={stage}
          className={
            index === stages.length - 1
              ? "flex-1 rounded-sm border border-accent bg-accent-soft py-2.5 text-center text-accent-text"
              : "flex-1 rounded-sm border border-line bg-bg py-2.5 text-center text-muted"
          }
        >
          {stage}
        </div>
      ))}
    </div>
  );
}

export function ServiceIllustration({ slug }: { slug: ServiceSlug }) {
  switch (slug) {
    case "custom-saas":
      return <SaasIllustration />;
    case "ai-agents":
      return <AgentsIllustration />;
    case "ai-automation":
      return <AutomationIllustration />;
    case "mobile-apps":
      return <MobileIllustration />;
    case "websites":
      return <WebsiteIllustration />;
    case "machine-learning":
      return <MachineLearningIllustration />;
    case "data-solutions":
      return <DataIllustration />;
    case "full-stack-development":
      return <FullStackIllustration />;
    case "cloud-devops":
      return <CloudIllustration />;
  }
}
