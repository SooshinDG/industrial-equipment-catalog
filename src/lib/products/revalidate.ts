import "server-only";

import { revalidatePath } from "next/cache";

/**
 * 제품 카탈로그 관련 공개 경로의 캐시를 무효화한다.
 * 향후 관리자 업로드 Route Handler가 데이터 반영 후 호출할 공통 함수.
 * (이번 체크포인트에서는 정의만 하고 어디서도 호출하지 않는다)
 *
 * 갱신 대상:
 *  - /              홈(추천 제품)
 *  - /products      목록
 *  - /products/[slug] 모든 제품 상세
 *  - /sitemap.xml   사이트맵
 */
export function revalidateProductCatalog(): void {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/sitemap.xml");
}
