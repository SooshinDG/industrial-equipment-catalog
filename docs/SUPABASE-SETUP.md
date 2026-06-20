# Supabase 데이터 전환 설정 (체크포인트 1)

이 프로젝트는 제품 데이터를 **저장소 내 CSV** 또는 **Supabase** 중에서 읽을 수 있습니다.
출처는 환경변수 `PRODUCT_DATA_SOURCE` 로 명시적으로 선택합니다. 잘못된 값이면 조용히 넘어가지 않고
개발 환경에서 명확한 오류를 던집니다.

UI·검색·필터·정렬·페이지네이션·문의 화면은 데이터 출처와 무관하게 동일하게 동작합니다.

---

## 1. 환경변수

`.env.example` 참고. 실제 값이 담긴 `.env.local` / `.env` 는 커밋하지 않습니다(.gitignore 처리됨).

| 변수 | 용도 | 노출 |
| --- | --- | --- |
| `PRODUCT_DATA_SOURCE` | `csv` 또는 `supabase` (미설정 시 `csv`) | 서버 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 브라우저 가능 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 공개(anon/publishable) 키 | 브라우저 가능 |
| `SUPABASE_SECRET_KEY` | 서버 전용 secret(service-role) 키 | **서버 전용** |

구형 키명도 자동 인식합니다.

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 대신 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY` 대신 `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **secret/service-role 키는 절대 브라우저에 노출하면 안 됩니다.** `NEXT_PUBLIC_` 접두사로
> 두거나 클라이언트 컴포넌트에서 import 하지 마세요. 이 키를 쓰는 `src/lib/supabase/admin.ts` 는
> `server-only` 로 보호되어 브라우저 번들에 포함되면 빌드가 실패합니다.

---

## 2. Supabase 프로젝트 생성 후 절차

1. supabase.com 에서 프로젝트 생성 → Project Settings > API 에서 URL/키 확인.
2. 위 환경변수를 `.env.local`(로컬) 및 Vercel(배포)에 설정.
3. SQL 마이그레이션 실행 (아래 3).
4. 40개 제품 시드 (아래 4).
5. `PRODUCT_DATA_SOURCE=supabase` 로 전환해 실행 (아래 6).

---

## 3. SQL 마이그레이션 실행

파일: `supabase/migrations/20260620081629_create_product_catalog.sql`

- **방법 A (SQL Editor)**: Supabase 대시보드 > SQL Editor 에 파일 내용을 붙여넣고 실행.
- **방법 B (CLI)**: `supabase db push` (Supabase CLI + 프로젝트 link 필요).

생성 내용: `products` 테이블(현재 CSV의 모든 컬럼 + `is_active`/`created_at`/`updated_at`),
인덱스(slug·category·manufacturer·stock_status·featured·is_active), `updated_at` 자동 갱신 트리거,
RLS(공개는 `is_active=true` 행만 SELECT, 쓰기 불가).

---

## 4. 기존 40개 데이터 시드

CSV(`data/products.csv`)를 단일 출처로 사용하는 업서트 스크립트:

```bash
# 페이로드만 검증 (DB 접속 없음) — 40개/카테고리 8개 확인
npx tsx scripts/seed-products.ts --dry-run

# 실제 업서트 (product_id 기준, 재실행 안전). .env.local 자동 로드
npx tsx scripts/seed-products.ts
```

`product_id`·`slug`·가격·재고 상태·납기·`featured`·최종 사양 값이 CSV 그대로 반영됩니다.
시드 후 Supabase에서 제품 40개 / 카테고리별 8개를 확인하세요:

```sql
select count(*) from products where is_active = true;            -- 40
select category, count(*) from products group by category;       -- 각 8
```

---

## 5. 로컬 실행 — CSV 모드

```bash
# .env.local 에 PRODUCT_DATA_SOURCE=csv (또는 미설정)
npm run dev
```

Supabase 연결 없이도 동작합니다. 빌드도 동일하게 CSV로 가능합니다:

```bash
PRODUCT_DATA_SOURCE=csv npm run build
```

---

## 6. 로컬 실행 — Supabase 모드

```bash
# .env.local 에 PRODUCT_DATA_SOURCE=supabase + URL/키 설정, 마이그레이션·시드 완료 후
npm run dev
```

마이그레이션/시드가 안 된 상태에서 supabase 모드로 실행하면, 페이지 조회 시
"제품 조회 실패" 오류가 표시됩니다(조용한 CSV fallback 없음). 먼저 3·4를 완료하세요.

---

## 7. Vercel 환경변수

Project Settings > Environment Variables 에 설정 (Production/Preview/Development):

- `PRODUCT_DATA_SOURCE` = `supabase` (또는 `csv`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_SECRET_KEY` (또는 `SUPABASE_SERVICE_ROLE_KEY`) — **서버 전용, 노출 금지**

> supabase 모드로 배포하려면 빌드 전에 마이그레이션·시드가 완료되어 있어야 합니다.
> (`generateStaticParams`·`sitemap` 은 DB 미접속 시에도 빌드가 깨지지 않도록 방어 처리되어 있으나,
> 페이지 렌더에는 시드된 데이터가 필요합니다.)

---

## 8. 데이터 흐름

```
[UI 페이지/sitemap]  →  @/lib/products (공개 API)  →  getProductRepository()
                                                         │  PRODUCT_DATA_SOURCE
                                          ┌──────────────┴───────────────┐
                                       csv-repository              supabase-repository
                                     data/products.csv          products 테이블(RLS, anon read)
```

향후 관리자 업로드는 인증을 거친 **서버 전용 Route Handler + secret 키**로 처리하고,
반영 후 `revalidateProductCatalog()`(`src/lib/products/revalidate.ts`)로
`/`, `/products`, `/products/[slug]`, `/sitemap.xml` 캐시를 무효화합니다.
(이번 체크포인트에서는 함수만 준비, 호출/엔드포인트 없음)
