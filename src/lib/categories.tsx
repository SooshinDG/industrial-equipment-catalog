import {
  Wind,
  Cog,
  Gauge,
  Droplets,
  Activity,
  Package,
  type LucideIcon,
} from "lucide-react";

/**
 * 카테고리별 비주얼 메타데이터.
 * 외부 이미지를 사용하지 않고 아이콘 + CSS 컬러 블록으로 제품 이미지를 대체한다.
 * CSV의 category 값(한국어)을 키로 사용한다.
 */
export interface CategoryMeta {
  /** CSV category 값과 동일 */
  name: string;
  /** URL/필터에 쓰는 안정적인 식별자 */
  slug: string;
  icon: LucideIcon;
  /** Tailwind gradient/배경 클래스 (컬러 블록 비주얼용) */
  block: string;
  /** 아이콘/텍스트 강조 색 */
  accent: string;
  blurb: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: "공기압축기",
    slug: "air-compressor",
    icon: Wind,
    block: "bg-gradient-to-br from-sky-100 to-brand-100",
    accent: "text-sky-700",
    blurb: "스크류·피스톤·오일프리 등 현장 압축공기 솔루션",
  },
  {
    name: "모터·감속기",
    slug: "motor-gear",
    icon: Cog,
    block: "bg-gradient-to-br from-amber-100 to-brand-100",
    accent: "text-amber-700",
    blurb: "구동·감속 설비를 위한 모터와 기어 제품",
  },
  {
    name: "밸브·유체제어",
    slug: "valve-fluid",
    icon: Gauge,
    block: "bg-gradient-to-br from-emerald-100 to-brand-100",
    accent: "text-emerald-700",
    blurb: "유량·압력 제어를 위한 밸브와 액추에이터",
  },
  {
    name: "산업용 펌프",
    slug: "industrial-pump",
    icon: Droplets,
    block: "bg-gradient-to-br from-cyan-100 to-brand-100",
    accent: "text-cyan-700",
    blurb: "이송·순환·가압을 위한 산업용 펌프",
  },
  {
    name: "센서·계측기",
    slug: "sensor-instrument",
    icon: Activity,
    block: "bg-gradient-to-br from-violet-100 to-brand-100",
    accent: "text-violet-700",
    blurb: "공정 모니터링을 위한 센서와 계측 장비",
  },
];

const CATEGORY_BY_NAME = new Map(CATEGORIES.map((c) => [c.name, c]));

const FALLBACK_CATEGORY: CategoryMeta = {
  name: "기타",
  slug: "etc",
  icon: Package,
  block: "bg-gradient-to-br from-brand-100 to-brand-50",
  accent: "text-brand-600",
  blurb: "산업 현장용 장비",
};

export function getCategoryMeta(name: string): CategoryMeta {
  return CATEGORY_BY_NAME.get(name) ?? { ...FALLBACK_CATEGORY, name };
}
