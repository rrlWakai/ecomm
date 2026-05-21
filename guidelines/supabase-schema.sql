create extension if not exists "pgcrypto";

create table if not exists public.products (
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
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id text primary key default gen_random_uuid()::text,
  full_name text not null,
  email text unique not null,
  total_orders int not null default 0,
  total_spend numeric(12,2) not null default 0,
  last_purchase_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key default gen_random_uuid()::text,
  customer_id text not null references public.customers(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  status text not null check (status in ('pending', 'processing', 'fulfilled', 'cancelled')) default 'pending',
  total_amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);

alter publication supabase_realtime add table public.products;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.customers;
