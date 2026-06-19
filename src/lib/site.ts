export const SITE = {
  name: "에어메이트 산업솔루션",
  shortName: "에어메이트",
  description:
    "공장 자동화와 설비 유지보수를 위한 산업용 장비·부품을 검색하고 비교할 수 있는 B2B 카탈로그입니다.",
  tagline: "산업 현장에 맞는 장비를 더 빠르게 찾으세요",
  // 포트폴리오 시연용 가상 사이트이므로 실제 도메인이 아닙니다.
  url: "https://airmate-industrial-catalog.example.com",
  demoNotice: "본 사이트의 제품과 데이터는 포트폴리오 시연용 가상 정보입니다.",
} as const;

export const NAV_LINKS = [
  { href: "/products", label: "제품 찾기" },
  { href: "/about", label: "회사 소개" },
  { href: "/inquiry", label: "견적 문의" },
] as const;
