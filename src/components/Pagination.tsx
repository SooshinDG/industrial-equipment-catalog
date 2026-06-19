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

  return (
    <nav
      aria-label="페이지 탐색"
      className="mt-10 flex items-center justify-between gap-3 border-t border-brand-200 pt-5"
    >
      <PageArrow
        href={buildCatalogHref(query, { page: page - 1 })}
        disabled={page <= 1}
        label="이전 페이지"
        dir="prev"
      />

      {/* 카탈로그 인덱스형 페이지 번호 (둥근 버튼 반복 대신 밑줄 강조) */}
      <ol className="flex items-center gap-1">
        {pages.map((p) => {
          const isCurrent = p === page;
          return (
            <li key={p}>
              <Link
                href={buildCatalogHref(query, { page: p })}
                scroll={false}
                aria-current={isCurrent ? "page" : undefined}
                className={`num inline-flex h-10 min-w-10 items-center justify-center border-b-2 px-2 text-sm transition-colors ${
                  isCurrent
                    ? "border-accent-500 font-semibold text-brand-900"
                    : "border-transparent text-brand-500 hover:text-brand-900"
                }`}
              >
                {String(p).padStart(2, "0")}
              </Link>
            </li>
          );
        })}
      </ol>

      <PageArrow
        href={buildCatalogHref(query, { page: page + 1 })}
        disabled={page >= pageCount}
        label="다음 페이지"
        dir="next"
      />
    </nav>
  );
}

function PageArrow({
  href,
  disabled,
  label,
  dir,
}: {
  href: string;
  disabled: boolean;
  label: string;
  dir: "prev" | "next";
}) {
  const text = dir === "prev" ? "이전" : "다음";
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  const inner =
    dir === "prev" ? (
      <>
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span>{text}</span>
      </>
    ) : (
      <>
        <span>{text}</span>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </>
    );

  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-10 cursor-not-allowed items-center gap-1 rounded-md border border-brand-100 px-3 text-sm font-medium text-brand-200"
      >
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      className="inline-flex h-10 items-center gap-1 rounded-md border border-brand-300 px-3 text-sm font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
    >
      {inner}
    </Link>
  );
}
