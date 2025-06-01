-- 마진 상품 테이블 생성
create table if not exists public.margin_products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  margin integer not null,
  seller text not null,
  selling_price integer not null,
  shipping_fee integer not null,
  purchase_price integer not null,
  purchase_shipping_fee integer not null,
  extra_cost integer not null,
  delivery_fee integer not null,
  commission_rate numeric not null,
  vat_rate numeric not null,
  category text,
  memo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 활성화
alter table public.margin_products enable row level security;

-- 기존 정책 삭제
drop policy if exists "마진 상품은 본인만 조회 가능" on public.margin_products;
drop policy if exists "마진 상품은 본인만 생성 가능" on public.margin_products;
drop policy if exists "마진 상품은 본인만 수정 가능" on public.margin_products;
drop policy if exists "마진 상품은 본인만 삭제 가능" on public.margin_products;

-- 읽기 정책
CREATE POLICY "Users can view their own margin products"
ON margin_products
FOR SELECT
USING (auth.uid() = user_id);

-- 생성 정책
CREATE POLICY "Users can insert their own margin products"
ON margin_products
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 삭제 정책
CREATE POLICY "Users can delete their own margin products"
ON margin_products
FOR DELETE
USING (auth.uid() = user_id);

-- updated_at 자동 갱신 트리거
create or replace function public.handle_margin_product_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_margin_product_updated on public.margin_products;
create trigger on_margin_product_updated
  before update on public.margin_products
  for each row execute procedure public.handle_margin_product_updated_at(); 