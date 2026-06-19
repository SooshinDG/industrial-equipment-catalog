# 에어메이트 산업솔루션 — 산업장비 검색 카탈로그

가상의 B2B 산업장비 유통사 **에어메이트 산업솔루션**의 제품 검색 카탈로그입니다.
공기압축기·펌프·모터·밸브·센서 등 40개 제품을 검색·필터·정렬하고, 제품 상세와
견적 문의까지 연결되는 공개형 카탈로그를 구현했습니다.

> 본 사이트의 제품과 데이터는 포트폴리오 시연용 가상 정보입니다.
> 실제 기업·제품·거래와 무관하며 견적 문의는 전송되지 않는 데모입니다.

## 기술 스택

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS 3**
- **lucide-react** 아이콘
- 외부 이미지 API 없이 카테고리 아이콘 + CSS 컬러 블록으로 제품 비주얼 표현
- CSV를 **서버 측에서 파싱**해 타입 안전한 데이터로 변환

## 주요 기능

- 홈: 통합 검색, 카테고리 바로가기, 추천 제품, 서비스 장점, CTA
- 제품 목록 `/products`
  - 제품명·모델·용도·제조사 통합 검색 (URL `q` 동기화)
  - 카테고리·전압·재고상태·가격대 필터, 5종 정렬
  - 선택 필터 칩(개별/전체 해제), 결과 개수, 12개 단위 페이지네이션
  - 데스크톱 사이드 필터 / 모바일 필터 드로어, 빈 상태 처리
  - 필터·정렬·페이지 상태를 URL에 유지 → 새로고침·공유 가능
- 제품 상세 `/products/[slug]`: 동적 메타데이터, 사양 표, 재고 배지,
  견적 문의 버튼, 같은 카테고리 추천 4개, 잘못된 slug는 404 처리
- 회사 소개 `/about`: 취급 분야, 진행 절차(탐색→상담→견적→납품)
- 견적 문의 `/inquiry`: 클라이언트 검증, localStorage 임시 저장, 성공 화면
- SEO: 루트/상세 메타데이터, `sitemap.xml`, `robots.txt`, 404, 로딩 스켈레톤
- 모바일 우선 반응형, 접근성(폼 라벨, 키보드 포커스, 색 대비, skip link)

## 실행 방법

요구 사항: Node.js 18.18 이상 (개발은 Node 20+ 권장)

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 빌드 결과 실행
npm run lint     # ESLint 검사
```

## 데이터 교체 방법

제품 데이터는 `data/products.csv` 한 파일로 관리됩니다.

1. `data/products.csv`를 같은 컬럼 구조로 교체하거나 행을 추가/수정합니다.
2. 첫 줄은 반드시 헤더(아래 컬럼명)여야 합니다.
3. `slug`는 제품마다 고유해야 하며 상세 페이지 URL(`/products/[slug]`)이 됩니다.
4. 숫자(`power_kw`, `price_krw`, `lead_time_days`)와 `featured`(true/false)는
   파싱 단계에서 자동으로 올바른 타입으로 변환됩니다.
5. 잘못된 행이 있어도 앱 전체가 실패하지 않으며, 개발 모드(`npm run dev`)
   콘솔에 경고가 표시되고 해당 행은 건너뜁니다.
6. 데이터 변경 후 개발 서버는 자동 반영되며, 배포 시에는 다시 빌드합니다.

별도의 데이터베이스나 환경 변수는 필요하지 않습니다.

### CSV 컬럼 설명

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `product_id` | string | 제품 고유 식별자 (예: `EQ-AC-001`) |
| `slug` | string | URL용 고유 슬러그 (상세 페이지 경로) |
| `product_name` | string | 제품명 |
| `category` | string | 카테고리 (공기압축기·모터·감속기·밸브·유체제어·산업용 펌프·센서·계측기) |
| `manufacturer` | string | 제조사 |
| `model` | string | 모델명 |
| `use_case` | string | 주요 용도/적용 분야 |
| `main_spec_label` | string | 핵심 사양 1 라벨 (예: 토출량) |
| `main_spec_value` | string | 핵심 사양 1 값 (예: 4.5 ㎥/min) |
| `sub_spec_label` | string | 핵심 사양 2 라벨 (예: 최대 압력) |
| `sub_spec_value` | string | 핵심 사양 2 값 (예: 8 bar) |
| `voltage` | string | 전압 (예: 24V DC, 220/380V) |
| `power_kw` | number | 정격 출력(kW) |
| `price_krw` | number | 가격(원) — 화면에서는 원화 형식으로 표시 |
| `lead_time_days` | number | 납기(영업일) — '영업일 기준 N일'로 표시 |
| `stock_status` | enum | 재고 상태: `재고 있음` / `주문 생산` / `입고 예정` |
| `certification` | string | 인증 (예: ISO 9001, 해당 없음) |
| `featured` | boolean | 추천 제품 여부 (`true`/`false`) |
| `summary` | string | 제품 요약 설명 (콤마 포함 시 따옴표로 감쌈) |

> `stock_status`에 정의되지 않은 값이 들어오면 개발 모드에서 경고 후
> `주문 생산`으로 대체됩니다.

## 배포 방법 (Vercel)

1. 이 프로젝트를 GitHub 저장소에 푸시합니다.
2. [Vercel](https://vercel.com)에서 **New Project → Import**로 저장소를 선택합니다.
   - 프로젝트 루트가 `industrial_catalog_demo` 폴더가 되도록 Root Directory를 지정합니다.
3. 프레임워크는 자동으로 **Next.js**로 감지됩니다. 별도 환경 변수는 없습니다.
   - Build Command: `next build` (기본값)
   - Output: 자동
4. **Deploy**를 누르면 빌드 후 배포 URL이 생성됩니다.

CLI로 배포하려면:

```bash
npm i -g vercel
vercel          # 미리보기 배포
vercel --prod   # 프로덕션 배포
```

## 프로젝트 구조

```
data/products.csv          제품 데이터 (단일 소스)
src/lib/                   타입·CSV 파서·데이터 로딩·필터/정렬·포맷터
src/components/            UI 컴포넌트 (카드·필터·검색·폼 등)
src/app/                   App Router 페이지 (홈·목록·상세·소개·문의·SEO)
```
