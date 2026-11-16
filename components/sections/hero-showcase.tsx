"use client";

import dynamic from "next/dynamic";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { AgentConsole } from "./agent-console";

// WebGL code loads after the page has painted, so it never delays the headline.
const HighlightsCarousel = dynamic(
  () => import("./highlights-carousel").then((mod) => mod.HighlightsCarousel),
  {
    ssr: false,
    loading: () => <div className="aspect-[5/4] min-h-[420px] w-full bg-surface" />,
  },
);

const tabs = [
  { id: "highlights", label: "Highlights" },
  { id: "demo", label: "Agent demo" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function HeroShowcase() {
  const [active, setActive] = useState<TabId>("highlights");
  const baseId = useId();

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = active === "highlights" ? "demo" : "highlights";
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Showcase"
        onKeyDown={onKeyDown}
        className="mb-3 inline-flex rounded-md border border-line bg-surface p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-sm px-3 py-1.5 text-[0.8125rem] transition-colors",
              active === tab.id ? "bg-surface-2 font-medium text-ink" : "text-muted hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`${baseId}-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
      >
        {active === "highlights" ? (
          <div className="overflow-hidden rounded-lg border border-line-strong">
            <HighlightsCarousel />
          </div>
        ) : (
          <AgentConsole />
        )}
      </div>
    </div>
  );
}
