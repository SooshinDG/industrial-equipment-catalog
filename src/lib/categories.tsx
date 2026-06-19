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
  /** 카탈로그 분류 코드 (라벨 플레이트·인덱스용, 예: AC·MG) */
  code: string;
  /** 비주얼 배경 클래스 (모노크롬 — 카테고리별 색 구분은 두지 않는다) */
  block: string;
  /** 아이콘/텍스트 강조 색 (모노크롬 잉크 톤) */
  accent: string;
  blurb: string;
}

// 산업 카탈로그 톤: 카테고리는 색이 아니라 코드·아이콘·라벨로 구분한다.
// (block/accent 는 단색으로 통일 — 파스텔 무지개 제거)
export const CATEGORIES: CategoryMeta[] = [
  {
    name: "공기압축기",
    slug: "air-compressor",
    icon: Wind,
    code: "AC",
    block: "bg-brand-50",
    accent: "text-brand-400",
    blurb: "스크류·피스톤·오일프리 등 현장 압축공기 솔루션",
  },
  {
    name: "모터·감속기",
    slug: "motor-gear",
    icon: Cog,
    code: "MG",
    block: "bg-brand-50",
    accent: "text-brand-400",
    blurb: "구동·감속 설비를 위한 모터와 기어 제품",
  },
  {
    name: "밸브·유체제어",
    slug: "valve-fluid",
    icon: Gauge,
    code: "VF",
    block: "bg-brand-50",
    accent: "text-brand-400",
    blurb: "유량·압력 제어를 위한 밸브와 액추에이터",
  },
  {
    name: "산업용 펌프",
    slug: "industrial-pump",
    icon: Droplets,
    code: "IP",
    block: "bg-brand-50",
    accent: "text-brand-400",
    blurb: "이송·순환·가압을 위한 산업용 펌프",
  },
  {
    name: "센서·계측기",
    slug: "sensor-instrument",
    icon: Activity,
    code: "SI",
    block: "bg-brand-50",
    accent: "text-brand-400",
    blurb: "공정 모니터링을 위한 센서와 계측 장비",
  },
];

const CATEGORY_BY_NAME = new Map(CATEGORIES.map((c) => [c.name, c]));

const FALLBACK_CATEGORY: CategoryMeta = {
  name: "기타",
  slug: "etc",
  icon: Package,
  code: "ET",
  block: "bg-brand-50",
  accent: "text-brand-400",
  blurb: "산업 현장용 장비",
};

export function getCategoryMeta(name: string): CategoryMeta {
  return CATEGORY_BY_NAME.get(name) ?? { ...FALLBACK_CATEGORY, name };
}
