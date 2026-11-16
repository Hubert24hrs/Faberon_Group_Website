import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="dot-grid border-b border-line">
      <div className="site-container pt-16 pb-14 sm:pt-24 sm:pb-20">
        {breadcrumbs ? (
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-h1">{title}</h1>
        {lead ? <p className="mt-5 max-w-2xl text-lead text-muted">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}
