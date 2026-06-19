import { getCategoryMeta } from "@/lib/categories";

interface CategoryVisualProps {
  category: string;
  /** 큰 비주얼(상세) 또는 카드 썸네일 */
  size?: "card" | "hero";
  className?: string;
}

/**
 * 외부 이미지 없이 카테고리 아이콘 + CSS 컬러 블록 + 도트 패턴으로
 * 제품 비주얼을 표현한다.
 */
export function CategoryVisual({
  category,
  size = "card",
  className = "",
}: CategoryVisualProps) {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;
  const iconSize = size === "hero" ? "h-20 w-20" : "h-10 w-10";

  return (
    <div
      role="img"
      aria-label={`${category} 카테고리 이미지`}
      className={`relative flex items-center justify-center overflow-hidden ${meta.block} ${className}`}
    >
      {/* 옅은 도트 패턴 (장식, 스크린리더 무시) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          color: "rgba(31,42,61,0.18)",
        }}
      />
      <Icon
        className={`relative ${iconSize} ${meta.accent}`}
        aria-hidden="true"
        strokeWidth={1.5}
      />
    </div>
  );
}
