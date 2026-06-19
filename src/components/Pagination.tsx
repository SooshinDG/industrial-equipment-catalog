import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCatalogHref, type CatalogQuery } from "@/lib/catalog";

interface PaginationProps {
  query: CatalogQuery;
  page: number;
  pageCount: number;
}

export function Pagination({ query, page, pageCount }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= pageCount;

  return (
    <nav
      aria-label="페이지 탐색"
      className="mt-10 flex items-center justify-center gap-1"
    >
      <PageArrow
        href={buildCatalogHref(query, { page: page - 1 })}
        disabled={prevDisabled}
        label="이전 페이지"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </PageArrow>

      {pages.map((p) => {
        const isCurrent = p === page;
        return (
          <Link
            key={p}
            href={buildCatalogHref(query, { page: p })}
            scroll={false}
            aria-current={isCurrent ? "page" : undefined}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors ${
              isCurrent
                ? "bg-brand-800 text-white"
                : "text-brand-600 hover:bg-brand-50"
            }`}
          >
            {p}
          </Link>
        );
      })}

      <PageArrow
        href={buildCatalogHref(query, { page: page + 1 })}
        disabled={nextDisabled}
        label="다음 페이지"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </PageArrow>
    </nav>
  );
}

function PageArrow({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-200"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-600 hover:bg-brand-50"
    >
      {children}
    </Link>
  );
}
