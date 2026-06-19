import type { Product } from "./types";

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "featured", label: "추천순" },
  { value: "price-asc", label: "낮은 가격순" },
  { value: "price-desc", label: "높은 가격순" },
  { value: "lead-time", label: "빠른 납기순" },
  { value: "name", label: "이름순" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PRICE_RANGES = [
  { value: "under-3m", label: "300만원 미만", min: 0, max: 3_000_000 },
  { value: "3m-7m", label: "300만~700만원", min: 3_000_000, max: 7_000_000 },
  { value: "7m-12m", label: "700만~1200만원", min: 7_000_000, max: 12_000_000 },
  {
    value: "over-12m",
    label: "1200만원 이상",
    min: 12_000_000,
    max: Infinity,
  },
] as const;

export type PriceRangeValue = (typeof PRICE_RANGES)[number]["value"];

export interface CatalogQuery {
  q: string;
  category: string;
  voltage: string;
  stock: string;
  price: string;
  sort: SortValue;
  page: number;
}

function isSortValue(value: string): value is SortValue {
  return SORT_OPTIONS.some((o) => o.value === value);
}

/** URLSearchParams(또는 Next searchParams)를 정규화된 쿼리로 변환 */
export function parseCatalogQuery(
  params: Record<string, string | string[] | undefined>,
): CatalogQuery {
  const get = (key: string): string => {
    const v = params[key];
    return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
  };

  const sortRaw = get("sort");
  const pageRaw = Number.parseInt(get("page"), 10);

  return {
    q: get("q"),
    category: get("category"),
    voltage: get("voltage"),
    stock: get("stock"),
    price: get("price"),
    sort: isSortValue(sortRaw) ? sortRaw : "featured",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
  };
}

function matchesSearch(product: Product, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  // 검색 대상: 제품명, 모델, 용도, 제조사
  return [
    product.productName,
    product.model,
    product.useCase,
    product.manufacturer,
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

function matchesPrice(product: Product, priceValue: string): boolean {
  if (!priceValue) return true;
  const range = PRICE_RANGES.find((r) => r.value === priceValue);
  if (!range) return true;
  return product.priceKrw >= range.min && product.priceKrw < range.max;
}

function sortProducts(products: Product[], sort: SortValue): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceKrw - b.priceKrw);
    case "price-desc":
      return sorted.sort((a, b) => b.priceKrw - a.priceKrw);
    case "lead-time":
      return sorted.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    case "name":
      return sorted.sort((a, b) =>
        a.productName.localeCompare(b.productName, "ko"),
      );
    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.productName.localeCompare(b.productName, "ko");
      });
  }
}

export interface CatalogResult {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

/** 필터 → 정렬 → 페이지네이션을 순수 함수로 적용 */
export function queryCatalog(
  products: Product[],
  query: CatalogQuery,
): CatalogResult {
  const filtered = products.filter(
    (p) =>
      matchesSearch(p, query.q) &&
      (!query.category || p.category === query.category) &&
      (!query.voltage || p.voltage === query.voltage) &&
      (!query.stock || p.stockStatus === query.stock) &&
      matchesPrice(p, query.price),
  );

  const sorted = sortProducts(filtered, query.sort);
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  return { items, total, page, pageCount, pageSize: PAGE_SIZE };
}

export interface ActiveFilterChip {
  key: keyof CatalogQuery;
  label: string;
  value: string;
}

/** 현재 적용된 필터를 칩 표시용 목록으로 변환 */
export function getActiveChips(query: CatalogQuery): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (query.q) chips.push({ key: "q", label: `검색: ${query.q}`, value: query.q });
  if (query.category)
    chips.push({ key: "category", label: query.category, value: query.category });
  if (query.voltage)
    chips.push({ key: "voltage", label: query.voltage, value: query.voltage });
  if (query.stock)
    chips.push({ key: "stock", label: query.stock, value: query.stock });
  if (query.price) {
    const range = PRICE_RANGES.find((r) => r.value === query.price);
    if (range)
      chips.push({ key: "price", label: range.label, value: query.price });
  }
  return chips;
}

export function hasActiveFilters(query: CatalogQuery): boolean {
  return Boolean(
    query.q || query.category || query.voltage || query.stock || query.price,
  );
}

/**
 * 현재 쿼리에 일부 값을 덮어써서 /products URL을 만든다.
 * 기본값(featured 정렬, page 1, 빈 값)은 URL에서 생략해 깔끔하게 유지한다.
 * 서버·클라이언트 양쪽에서 사용하는 순수 함수.
 */
export function buildCatalogHref(
  query: CatalogQuery,
  overrides: Partial<CatalogQuery> = {},
): string {
  const merged = { ...query, ...overrides };
  const sp = new URLSearchParams();

  if (merged.q) sp.set("q", merged.q);
  if (merged.category) sp.set("category", merged.category);
  if (merged.voltage) sp.set("voltage", merged.voltage);
  if (merged.stock) sp.set("stock", merged.stock);
  if (merged.price) sp.set("price", merged.price);
  if (merged.sort && merged.sort !== "featured") sp.set("sort", merged.sort);
  if (merged.page > 1) sp.set("page", String(merged.page));

  const qs = sp.toString();
  return qs ? `/products?${qs}` : "/products";
}
