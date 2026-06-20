-- 산업장비 카탈로그 · products 테이블 + 인덱스 + updated_at 트리거 + RLS
-- Supabase SQL Editor 또는 Supabase CLI(supabase db push)로 실행한다.
-- 멱등(idempotent)하게 작성되어 재실행해도 안전하다.

-- 1) 테이블 ---------------------------------------------------------------
create table if not exists public.products (
  product_id      text primary key,
  slug            text not null unique,
  product_name    text not null,
  category        text not null,
  manufacturer    text not null,
  model           text not null,
  use_case        text,
  main_spec_label text,
  main_spec_value text,
  sub_spec_label  text,
  sub_spec_value  text,
  voltage         text,
  power_kw        numeric,
  price_krw       bigint,
  lead_time_days  integer,
  stock_status    text,
  certification   text,
  featured        boolean not null default false,
  summary         text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 2) 인덱스 ---------------------------------------------------------------
-- slug 는 unique 제약으로 이미 인덱스가 있으나, 명시적으로도 보장한다.
create index if not exists products_slug_idx          on public.products (slug);
create index if not exists products_category_idx      on public.products (category);
create index if not exists products_manufacturer_idx  on public.products (manufacturer);
create index if not exists products_stock_status_idx  on public.products (stock_status);
create index if not exists products_featured_idx      on public.products (featured);
create index if not exists products_is_active_idx     on public.products (is_active);

-- 3) updated_at 자동 갱신 트리거 -----------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row
  execute function public.set_updated_at();

-- 4) RLS ------------------------------------------------------------------
alter table public.products enable row level security;

-- 공개 사용자(anon)와 로그인 사용자(authenticated)는 is_active=true 인 제품만 SELECT 가능.
drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
  on public.products
  for select
  to anon, authenticated
  using (is_active = true);

-- INSERT / UPDATE / DELETE 정책은 의도적으로 만들지 않는다.
-- → anon/authenticated 키로는 쓰기가 모두 거부된다.
-- 관리자 업로드는 RLS 를 우회하는 service-role(secret) 키를 사용하는
-- 서버 전용 Route Handler 에서만 수행한다(향후 체크포인트).
