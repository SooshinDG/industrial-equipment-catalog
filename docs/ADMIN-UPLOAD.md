# 관리자 스프레드시트 업로드 (체크포인트 2)

관리자가 .xlsx/.xls/.csv 파일로 제품 데이터를 미리보기 후 Supabase 에 반영하는 콘솔입니다.
공개 사이트(홈·목록·상세·문의)의 디자인과 기능은 변경되지 않습니다.

## 화면
- `/admin/login` — Supabase 이메일·비밀번호 로그인
- `/admin/products` — 데이터 상태 + 업로드/미리보기/반영

## 1. 관리자 계정 생성 (코드에서 자동 생성하지 않음)
Supabase 대시보드에서 직접 생성합니다.
1. Authentication > Users > **Add user** → 이메일/비밀번호 입력(Email confirm 체크).
2. 또는 Authentication > Providers > Email 활성화 후 초대.
3. 생성한 이메일을 아래 `ADMIN_EMAILS` 에 추가.

## 2. ADMIN_EMAILS 설정
쉼표로 여러 관리자를 지정합니다(대소문자 무시).
```
ADMIN_EMAILS=admin1@example.com,admin2@example.com
```
- 세션이 있어도 이메일이 목록에 없으면 관리자 페이지·API 모두 거부됩니다.
- 접근 판단은 **서버(미들웨어 + 페이지 + API)** 에서 다시 검사하며, 클라이언트 UI 에만 의존하지 않습니다.

## 3. Vercel 환경변수
체크포인트 1 변수(`PRODUCT_DATA_SOURCE`, `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`)에 더해:
- `ADMIN_EMAILS`

> `SUPABASE_SECRET_KEY`(service-role)는 **서버 전용**입니다. 브라우저/`NEXT_PUBLIC_` 노출 금지.
> 관리자 반영 API 만 secret 키로 RLS 를 우회해 쓰기를 수행합니다.

## 4. 지원 파일·제한
- 형식: `.xlsx`, `.xls`, `.csv`
- 최대 5MB, 최대 3,000 데이터 행
- 첫 번째 행 = 컬럼명, 기본은 첫 시트(여러 시트면 선택 가능)
- 브라우저 1차 분석 + **서버 재분석/재검증**(클라이언트 수치 불신)

## 5. 컬럼 규칙
필수: `product_id, slug, product_name, category, manufacturer, model, price_krw, stock_status`
선택: `use_case, main_spec_label, main_spec_value, sub_spec_label, sub_spec_value, voltage,
power_kw, lead_time_days, certification, featured, summary, is_active`

검사: 필수 컬럼/값 누락, product_id·slug 파일 내 중복, DB 의 다른 product_id 가 쓰는 slug,
숫자/boolean 형식, 음수 가격/납기, 허용 안 되는 재고 상태, 빈 행, 최대 행 초과,
헤더 공백/BOM.

- boolean 허용: `true/false`, `TRUE/FALSE`, `1/0`, `yes/no`, `예/아니오`
- 재고 상태 허용값: `재고 있음`, `주문 생산`, `입고 예정` (코드 상수 `STOCK_STATUSES`)

## 6. 신규·수정·비공개 규칙
- 미리보기에서 product_id 기준으로 **신규/수정(+변경 필드)/변경 없음/오류** 분류
- 반영은 **product_id upsert**: 신규 INSERT, 기존 UPDATE
- **파일에 없는 기존 제품은 삭제되지 않고 유지** (업로드로 DELETE 하지 않음)
- 삭제가 필요하면 파일에서 `is_active=false` 로 **비공개** 처리
- `created_at` 유지, `updated_at` 는 DB 트리거로 갱신
- 오류가 하나라도 있으면 **반영 버튼 비활성화**, 전체 요청 실패(일부 반영 없음)
- 단일 bulk upsert(단일 문) 로 **원자적**으로 반영

## 7. 반영 후
성공 시 `revalidateProductCatalog()` 로 `/`, `/products`, `/products/[slug]`, `/sitemap.xml`
캐시를 무효화합니다. 신규 slug 는 재배포 없이 첫 요청에서 열립니다.

## 8. 오류 해결
- "필수 컬럼 … 없습니다": 헤더 행에 해당 컬럼명을 추가
- "가격이 숫자가 아닙니다 / 음수": 숫자(정수, 0 이상)로 수정
- "boolean 형식이 아닙니다": 허용 표기 사용
- "허용되지 않는 재고 상태": 위 허용값 중 하나로 수정
- "slug … 다른 제품이 사용 중": 해당 제품의 product_id 를 맞추거나 slug 변경
- "파일이 너무 큽니다 / 행 초과": 5MB·3,000행 이내로 분할

## 9. 검수 후 데이터 복원
`sample-data/valid-import.csv` 로 반영을 테스트했다면 원래 40개 상태로 복원:
```sql
update public.products set price_krw = 10320000 where product_id = 'EQ-AC-001';
delete from public.products where product_id = 'TEST-NEW-001';
-- 또는 비공개로 두려면: update public.products set is_active=false where product_id='TEST-NEW-001';
```
