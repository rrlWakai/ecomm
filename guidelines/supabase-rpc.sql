-- Helper for admin dashboard cards
create or replace function public.get_dashboard_stats()
returns table(total_revenue numeric, orders_today bigint, new_customers_week bigint, pending_orders bigint, low_stock_count bigint)
language sql
security definer
as $$
  select
    coalesce((select sum(total_amount) from orders where status != 'cancelled'), 0) as total_revenue,
    (select count(*) from orders where created_at::date = now()::date) as orders_today,
    (select count(*) from profiles where created_at >= now() - interval '7 days') as new_customers_week,
    (select count(*) from orders where status = 'pending') as pending_orders,
    (select count(*) from products where stock <= 5 and is_active = true) as low_stock_count;
$$;

-- Safe stock decrement used at checkout
create or replace function public.decrement_product_stock(p_product_id uuid, p_qty integer)
returns void
language plpgsql
as $$
begin
  update products set stock = stock - p_qty where id = p_product_id and stock >= p_qty;
  if not found then
    raise exception 'Insufficient stock for product %', p_product_id;
  end if;
end;
$$;
