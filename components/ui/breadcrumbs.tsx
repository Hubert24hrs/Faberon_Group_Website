import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export type Crumb = { name: string; href: string };

// The last crumb is the current page and isn't a link.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={breadcrumbJsonLd(items)} />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-ink">
                    {item.name}
                  </Link>
                  <ChevronRight className="size-3.5 text-subtle" strokeWidth={1.75} aria-hidden />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
