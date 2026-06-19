# Claude Code 작업 지시서

당신은 숙련된 Next.js 풀스택 개발자다.
현재 저장소를 먼저 점검하고, 기존 파일이 있다면 불필요하게 덮어쓰지 말고 현재 구조에 맞춰 작업한다.
빈 저장소라면 Next.js App Router, TypeScript, Tailwind CSS 기반으로 프로젝트를 생성한다.

## 프로젝트
가상의 B2B 산업장비 유통사 '에어메이트 산업솔루션'의 제품 검색 카탈로그를 제작한다.
제공된 `industrial_equipment_products.csv`의 40개 제품을 사용한다.
이 사이트는 크몽 포트폴리오 시연용이므로 실제 기업이나 실제 제품으로 오해되지 않도록 모든 페이지 하단에 '본 사이트의 제품과 데이터는 포트폴리오 시연용 가상 정보입니다.'를 표시한다.

## 기술 요구사항
- Next.js 최신 안정 버전 App Router
- TypeScript
- Tailwind CSS
- lucide-react 사용 가능
- CSV는 서버 측에서 파싱해 타입 안전한 데이터로 변환
- 외부 이미지 API나 불안정한 원격 이미지는 사용하지 않음
- 제품 이미지는 카테고리별 아이콘, CSS 패턴, 컬러 블록으로 표현
- Vercel 배포 가능
- ESLint 및 TypeScript 오류 0개
- 모바일 우선 반응형
- 접근 가능한 폼 라벨, 키보드 포커스, 충분한 색 대비

## 데이터 필드
CSV의 다음 컬럼을 모두 타입으로 정의한다.
product_id, slug, product_name, category, manufacturer, model, use_case,
main_spec_label, main_spec_value, sub_spec_label, sub_spec_value,
voltage, power_kw, price_krw, lead_time_days, stock_status,
certification, featured, summary

숫자와 boolean은 파싱 시 올바른 타입으로 변환한다.
잘못된 행이 있으면 앱 전체가 실패하지 않도록 검증하고 개발 환경에서 경고를 표시한다.

## 사이트 구조

### 1. 홈 `/`
- 헤더: 로고, 제품 찾기, 회사 소개, 견적 문의
- 히어로 문구: '산업 현장에 맞는 장비를 더 빠르게 찾으세요'
- 통합 검색창
- 카테고리 5개 바로가기
- 추천 제품 6개
- 서비스 장점 3개: 데이터 기반 검색, 명확한 사양, 빠른 견적 상담
- 하단 CTA

### 2. 제품 목록 `/products`
- 검색어를 URL query string과 동기화
- 필터: 카테고리, 전압, 재고상태, 가격대
- 정렬: 추천순, 낮은 가격순, 높은 가격순, 빠른 납기순, 이름순
- 선택된 필터를 칩 형태로 표시하고 개별 해제와 전체 초기화 제공
- 검색 결과 개수 표시
- 데스크톱은 사이드 필터, 모바일은 필터 드로어
- 페이지네이션은 12개 단위
- 결과가 없을 때 빈 상태와 필터 초기화 버튼 제공
- 제품 카드는 제품명, 카테고리, 모델, 핵심 사양 2개, 가격, 납기, 재고상태를 표시

### 3. 제품 상세 `/products/[slug]`
- 동적 메타데이터 생성
- 제품명, 모델, 제조사, 카테고리
- 카테고리 기반 비주얼
- 주요 사양 표
- 가격과 예상 납기
- 재고 상태 배지
- 용도와 설명
- 견적 문의 버튼
- 같은 카테고리 추천 제품 4개
- 존재하지 않는 slug는 not-found 처리

### 4. 회사 소개 `/about`
- 가상의 회사 소개
- 취급 분야
- 진행 절차: 제품 탐색, 상담, 견적, 납품
- 실제 회사로 오해되지 않도록 데모 안내

### 5. 견적 문의
- `/inquiry` 페이지 또는 접근성 있는 모달 중 더 적합한 방식 선택
- 회사명, 담당자명, 연락처, 이메일, 관심 제품, 수량, 문의내용
- 클라이언트 검증
- 실제 전송 대신 성공 화면과 localStorage 임시 저장
- '실제 문의는 전송되지 않는 데모입니다.' 명시

## UX 세부사항
- 가격은 한국 원화 형식으로 표시
- 납기는 '영업일 기준 N일' 형식
- 재고상태별 배지 스타일 구분
- featured가 true인 상품은 추천 배지
- 검색은 제품명, 모델, 용도, 제조사를 대상으로 수행
- 필터·정렬·페이지는 URL에 유지해 새로고침과 공유가 가능해야 함
- 필터 변경 시 페이지를 1로 초기화
- 상단에 현재 경로를 알 수 있는 breadcrumb 제공
- 모바일에서 카드와 필터 사용성이 좋아야 함

## 디자인
- 전체 분위기: 전문적, 단정함, 산업용 B2B
- 기본 색상: slate/navy
- 강조 색상: amber
- 흰색 배경과 옅은 회색 구획
- 과한 glassmorphism, neon, 거대한 그라데이션 사용 금지
- 영문 대문자 남용 금지
- 한국어 가독성 우선
- 카드마다 불필요하게 그림자를 강하게 쓰지 않음

## SEO 및 품질
- 루트 metadata
- 제품 상세 동적 metadata
- sitemap.ts
- robots.ts
- 의미 있는 heading 구조
- 404 페이지
- loading 상태 또는 skeleton
- README에 실행 방법, 데이터 교체 방법, 배포 방법 작성
- CSV 컬럼 설명을 README에 포함

## 작업 방식
1. 현재 저장소 구조 확인
2. 구현 계획을 간단히 제시
3. 기반 프로젝트와 데이터 파서 구현
4. 홈과 공통 레이아웃 구현
5. 제품 목록과 필터·정렬·URL 상태 구현
6. 상세 페이지와 SEO 구현
7. 문의 폼과 나머지 페이지 구현
8. 반응형·접근성·오류 상태 점검
9. npm run lint 및 npm run build 실행
10. 오류가 있으면 수정 후 다시 검증
11. 변경 파일과 구현 기능을 요약

가능하면 각 주요 단계가 정상 동작한 후 다음 커밋을 생성한다.
- feat: initialize industrial catalog
- feat: add csv product data layer
- feat: build catalog search and filters
- feat: add product detail and inquiry
- chore: finalize responsive seo and docs

사용자의 기존 Git 이력을 변경하는 rebase, reset --hard, force push는 하지 않는다.
완료 후 실행 명령과 Vercel 배포 절차를 알려준다.
