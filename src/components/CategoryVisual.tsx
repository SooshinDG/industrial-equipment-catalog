import { getCategoryMeta } from "@/lib/categories";

interface CategoryVisualProps {
  category: string;
  /** 큰 비주얼(상세) 또는 카드 썸네일 */
  size?: "card" | "hero";
  className?: string;
}

/**
 * 외부 제품 사진 없이 "기술 도면 시트" 느낌으로 카테고리 비주얼을 표현한다.
 * - 단색 블루프린트 그리드 + 도면 프레임
 * - 좌상단 분류 코드 라벨 플레이트
 * - 절제된 크기의 카테고리 아이콘(라인 드로잉)
 * 카테고리 구분은 색이 아니라 코드와 아이콘으로 한다. 장식이 제품 정보를
 * 압도하지 않도록 아이콘을 과하게 키우지 않는다.
 */
export function CategoryVisual({
  category,
  size = "card",
  className = "",
}: CategoryVisualProps) {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;
  const isHero = size === "hero";
  const iconSize = isHero ? "h-12 w-12" : "h-8 w-8";
  const gridSize = isHero ? "28px 28px" : "18px 18px";

  return (
    <div
      role="img"
      aria-label={`${category} 기술 도면 이미지`}
      className={`relative flex flex-col overflow-hidden bg-brand-50 ${className}`}
    >
      {/* 블루프린트 그리드 (단색 장식, 스크린리더 무시) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(31,42,61,0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(31,42,61,0.05) 1px, transparent 1px)",
          backgroundSize: gridSize,
        }}
      />
      {/* 도면 프레임 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 border border-brand-200/70"
      />

      {/* 좌상단 분류 코드 라벨 플레이트 */}
      <div className="relative flex items-center justify-between px-3 pt-3">
        <span className="num text-[10px] font-medium text-brand-400">
          {meta.code}
        </span>
        <span className="num text-[10px] text-brand-300">REF</span>
      </div>

      {/* 중앙 아이콘 — 라인 드로잉 톤 */}
      <div className="relative flex flex-1 items-center justify-center py-4">
        <Icon
          className={`${iconSize} ${meta.accent}`}
          aria-hidden="true"
          strokeWidth={1.25}
        />
      </div>
    </div>
  );
}
