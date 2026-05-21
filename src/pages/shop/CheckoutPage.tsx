import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shippingSchema } from '../../lib/zod-schemas';
import { useCartStore } from '../../stores/cart.store';
import { useAuthStore } from '../../stores/auth.store';
import { supabase } from '../../lib/supabase';

export function CheckoutPage() {
  const nav = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, profile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return setError('Please login first.');
    if (profile?.is_banned) return setError('Your account is blocked from checkout.');
    const formData = new FormData(e.currentTarget);
    const payload = shippingSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!payload.success) return setError(payload.error.issues[0]?.message ?? 'Invalid shipping details');

    for (const item of items) {
      const { data: product } = await supabase.from('products').select('stock,price').eq('id', item.productId).single();
      if (!product || product.stock < item.quantity) return setError('One or more items are out of stock.');
    }

    const { data: order, error: orderErr } = await supabase.from('orders').insert({ user_id: user.id, total_amount: totalPrice, shipping_address: payload.data, notes: payload.data.notes ?? null, status: 'pending' }).select().single();
    if (orderErr || !order) return setError(orderErr?.message ?? 'Order failed');

    const orderRows = items.map((i) => ({ order_id: order.id, product_id: i.productId, quantity: i.quantity, price_at_purchase: i.price }));
    await supabase.from('order_items').insert(orderRows);
    for (const item of items) await supabase.rpc('decrement_product_stock' as any, { p_product_id: item.productId, p_qty: item.quantity });
    await clearCart();
    nav(`/checkout/confirmation?orderId=${order.id}`);
  };

  return <main className="mx-auto max-w-2xl p-4"><h1 className="text-2xl font-semibold">Shipping Details</h1><form onSubmit={onSubmit} className="space-y-2 mt-4"><input name="full_name" className="border rounded p-2 w-full" placeholder="Full name" /><input name="line1" className="border rounded p-2 w-full" placeholder="Address line 1" /><input name="line2" className="border rounded p-2 w-full" placeholder="Address line 2" /><input name="city" className="border rounded p-2 w-full" placeholder="City" /><input name="province" className="border rounded p-2 w-full" placeholder="Province" /><input name="postal_code" className="border rounded p-2 w-full" placeholder="Postal code" /><input name="country" defaultValue="PH" className="border rounded p-2 w-full" /><textarea name="notes" className="border rounded p-2 w-full" placeholder="Order notes" /><button className="border rounded px-4 py-2">Place Order</button>{error && <p className="text-sm text-red-600">{error}</p>}</form></main>;
}
