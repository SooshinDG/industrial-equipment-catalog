import Link from "next/link";
import { Factory } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";
import { CATEGORIES } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-brand-200 bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* 브랜드 */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-brand-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-900 text-white">
                <Factory className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold">{SITE.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-500">
              공장 자동화와 설비 유지보수 고객을 위한 산업용 장비·부품 검색
              카탈로그입니다.
            </p>
          </div>

          {/* 바로가기 */}
          <nav aria-label="푸터 메뉴" className="md:col-span-3">
            <h2 className="eyebrow">바로가기</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-brand-600 hover:text-brand-900"
                >
                  홈
                </Link>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-600 hover:text-brand-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 취급 카테고리 */}
          <nav aria-label="취급 카테고리" className="md:col-span-4">
            <h2 className="eyebrow">취급 카테고리</h2>
            <ul className="mt-3 space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-900"
                  >
                    <span className="num text-[11px] text-brand-400">
                      {category.code}
                    </span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-brand-200 pt-6 text-xs text-brand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-medium text-brand-600">데모 안내</span>{" "}
            {SITE.demoNotice}
          </p>
          <p className="num">© {SITE.name}. Portfolio demo.</p>
        </div>
      </div>
    </footer>
  );
}
