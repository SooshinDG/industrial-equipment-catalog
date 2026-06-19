import Link from "next/link";
import { Factory } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-100 bg-brand-50">
      <div className="container-page py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 text-brand-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-800 text-white">
                <Factory className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold">{SITE.name}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-500">
              공장 자동화와 설비 유지보수 고객을 위한 산업용 장비·부품 검색
              카탈로그입니다.
            </p>
          </div>

          <nav aria-label="푸터 메뉴">
            <h2 className="text-sm font-semibold text-brand-700">바로가기</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-brand-500 hover:text-brand-800"
                >
                  홈
                </Link>
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-500 hover:text-brand-800"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-brand-200 pt-6">
          <p className="rounded-md bg-accent-50 px-4 py-3 text-sm font-medium text-accent-800">
            {SITE.demoNotice}
          </p>
          <p className="mt-4 text-xs text-brand-400">
            © {SITE.name}. 포트폴리오 시연용 가상 사이트입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
