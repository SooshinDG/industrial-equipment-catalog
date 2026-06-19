"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface MobileFilterDrawerProps {
  /** 적용된 필터 개수 (버튼 배지용) */
  activeCount: number;
  children: React.ReactNode;
}

export function MobileFilterDrawer({
  activeCount,
  children,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  // 드로어 열림 시 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary w-full"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        필터
        {activeCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1.5 text-xs font-semibold text-brand-900">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="필터">
          <div
            className="absolute inset-0 bg-brand-900/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-brand-100 px-4 py-3">
              <h2 className="text-base font-semibold text-brand-800">필터</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-500 hover:bg-brand-50"
                aria-label="필터 닫기"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
            <div className="border-t border-brand-100 p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                결과 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
