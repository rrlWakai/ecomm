create extension if not exists "pgcrypto";

-- Reset current public commerce schema.
drop function if exists public.create_order_with_items(text, json, text, json);
drop function if exists public.decrement_product_stock(text, integer);
drop function if exists public.get_dashboard_stats();

drop table if exists public.reviews cascade;
drop table if exists public.wishlist cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.cart_items cascade;
drop table if exists public.addresses cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.admins cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id text primary key default gen_random_uuid()::text,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  is_banned boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.admins (
  id text primary key references public.profiles(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

create table public.categories (
  id text primary key default gen_random_uuid()::text,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.products (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  name text not null,
  description text,
  tagline text,
  price numeric(12,2) not null,
  compare_price numeric(12,2),
  stock int not null default 0,
  category_id text references public.categories(id) on delete set null,
  images text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.profiles(id) on delete cascade,
  full_name text,
  line1 text,
  line2 text,
  city text,
  province text,
  postal_code text,
  country text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.cart_items (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.profiles(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  quantity int not null default 1,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table public.orders (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric(12,2) not null,
  shipping_address jsonb not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  quantity int not null,
  price_at_purchase numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table public.wishlist (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.profiles(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table public.reviews (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references public.profiles(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create index on public.products (is_active);
create index on public.products (category_id);
create index on public.orders (user_id);
create index on public.order_items (order_id);
create index on public.cart_items (user_id);
create index on public.wishlist (user_id);

-- Keep publication membership idempotent even across repeated runs.
do $$
begin
  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;

  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;

  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    join pg_publication p on p.oid = pr.prpubid
    where p.pubname = 'supabase_realtime'
      and n.nspname = 'public'
      and c.relname = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end
$$;
