-- 사용자 프로필 테이블 생성
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 활성화
alter table public.profiles enable row level security;

-- 기존 정책 삭제
drop policy if exists "프로필은 본인만 조회 가능" on public.profiles;
drop policy if exists "프로필은 본인만 수정 가능" on public.profiles;

-- 프로필 조회 정책
create policy "프로필은 본인만 조회 가능"
  on public.profiles for select
  using ( auth.uid() = id );

-- 프로필 수정 정책
create policy "프로필은 본인만 수정 가능"
  on public.profiles for update
  using ( auth.uid() = id );

-- 새 사용자 가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger as $$
declare
  _email text;
  _full_name text;
begin
  -- 디버깅을 위한 로그
  raise notice 'New user created with id: %', new.id;
  
  -- 이메일과 이름 추출
  _email := new.email;
  _full_name := coalesce(new.raw_user_meta_data->>'full_name', '');
  
  -- 디버깅을 위한 로그
  raise notice 'Email: %, Full Name: %', _email, _full_name;
  
  -- 프로필 생성
  insert into public.profiles (id, email, full_name)
  values (new.id, _email, _full_name);
  
  return new;
exception
  when unique_violation then
    raise notice 'Profile already exists for user: %', new.id;
    return new;
  when foreign_key_violation then
    raise notice 'Foreign key violation for user: %', new.id;
    return new;
  when others then
    raise notice 'Error in handle_new_user: %', SQLERRM;
    raise notice 'Error detail: %', SQLSTATE;
    return new;
end;
$$ language plpgsql security definer;

-- 트리거 생성
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 프로필 업데이트 시 updated_at 자동 갱신
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- 기존 사용자들의 프로필이 없다면 생성
insert into public.profiles (id, email, full_name)
select 
  id,
  email,
  coalesce(raw_user_meta_data->>'full_name', '')
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing; 