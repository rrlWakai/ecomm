create extension if not exists "pgcrypto";

-- Full reset: drop dependent routines first, then tables.
drop function if exists public.decrement_product_stock(text, integer);
drop function if exists public.get_dashboard_stats();

drop table if exists public.orders cascade;
drop table if exists public.customers cascade;
drop table if exists public.products cascade;

create table public.products (
  id text primary key default gen_random_uuid()::text,
  slug text unique not null,
  name text not null,
  category text not null check (category in ('laptops', 'phones', 'tablets', 'desktops')),
  brand text not null default 'TechElite',
  price numeric(12,2) not null,
  description text not null,
  tagline text not null,
  specs text[] not null default '{}',
  highlights text[] not null default '{}',
  images text[] not null default '{}',
  featured boolean not null default false,
  stock int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.customers (
  id text primary key default gen_random_uuid()::text,
  full_name text not null,
  email text unique not null,
  total_orders int not null default 0,
  total_spend numeric(12,2) not null default 0,
  last_purchase_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.orders (
  id text primary key default gen_random_uuid()::text,
  customer_id text not null references public.customers(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  status text not null check (status in ('pending', 'processing', 'fulfilled', 'cancelled')) default 'pending',
  total_amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);

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
      and c.relname = 'customers'
  ) then
    alter publication supabase_realtime add table public.customers;
  end if;
end
$$;
