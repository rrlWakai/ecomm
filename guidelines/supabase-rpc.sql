-- Helper for admin dashboard cards
create or replace function public.get_dashboard_stats()
returns table(total_revenue numeric, orders_today bigint, new_customers_week bigint, pending_orders bigint, low_stock_count bigint)
language sql
security definer
as $$
  select
    coalesce((select sum(total_amount) from orders where status != 'cancelled'), 0) as total_revenue,
    (select count(*) from orders where created_at::date = now()::date) as orders_today,
    (select count(*) from profiles where role = 'customer' and created_at >= now() - interval '7 days') as new_customers_week,
    (select count(*) from orders where status = 'pending') as pending_orders,
    (select count(*) from products where stock <= 5 and is_active = true) as low_stock_count;
$$;

-- Safe stock decrement used at checkout
create or replace function public.decrement_product_stock(p_product_id text, p_qty integer)
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

-- Atomic order creation with line items and stock validation
create or replace function public.create_order_with_items(
  p_user_id text,
  p_shipping_address json,
  p_notes text,
  p_items json
)
returns table(id text, user_id text, status text, total_amount numeric, shipping_address json, notes text, created_at timestamptz)
language plpgsql
security definer
as $$
declare
  created_order_id text := gen_random_uuid()::text;
  product_item json;
  product_id text;
  qty int;
  item_price numeric;
begin
  insert into orders (id, user_id, status, total_amount, shipping_address, notes)
  values (created_order_id, p_user_id, 'pending', 0, p_shipping_address, p_notes);

  for product_item in select * from json_array_elements(p_items)
  loop
    product_id := product_item->> 'product_id';
    qty := (product_item->> 'quantity')::int;
    item_price := (product_item->> 'price_at_purchase')::numeric;

    update products set stock = stock - qty where id = product_id and stock >= qty;
    if not found then
      raise exception 'Insufficient stock for product %', product_id;
    end if;

    insert into order_items (order_id, product_id, quantity, price_at_purchase)
    values (created_order_id, product_id, qty, item_price);
  end loop;

  update orders
  set total_amount = (
    select coalesce(sum(price_at_purchase * quantity), 0) from order_items where order_id = created_order_id
  )
  where id = created_order_id;

  return query select id, user_id, status, total_amount, shipping_address, notes, created_at from orders where id = created_order_id;
end;
$$;
