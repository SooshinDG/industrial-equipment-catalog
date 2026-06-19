"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";

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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // 드로어 열림 시 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        // ESC로 닫을 때도 포커스를 필터 버튼으로 복귀
        triggerRef.current?.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    // 열리면 닫기 버튼으로 포커스 이동
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // 닫은 뒤 포커스를 필터 버튼으로 복귀
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
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
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="필터"
        >
          <div
            className="absolute inset-0 bg-brand-900/40"
            onClick={close}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-brand-200 px-4 py-3">
              <div className="flex items-baseline gap-2">
                <h2 className="text-base font-semibold text-brand-900">필터</h2>
                {activeCount > 0 && (
                  <span className="num text-xs text-brand-400">
                    {activeCount}개 적용
                  </span>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-500 hover:bg-brand-50"
                aria-label="필터 닫기"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

            <div className="flex items-center gap-3 border-t border-brand-200 p-4">
              <Link
                href="/products"
                scroll={false}
                onClick={close}
                className="btn-secondary flex-1"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                초기화
              </Link>
              <button type="button" onClick={close} className="btn-primary flex-1">
                결과 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
