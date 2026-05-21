import { FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';

export function AccountOrderDetailPage() {
  const { id } = useParams();
  const { data, refetch } = useOrders();
  const user = useAuthStore((s) => s.user);
  const order = useMemo(() => (data ?? []).find((x: any) => x.id === id), [data, id]);
  const [reviewItem, setReviewItem] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!order) return <main className="p-4">Order not found.</main>;

  const cancelOrder = async () => {
    if (order.status !== 'pending') return;
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id);
    await refetch();
  };

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reviewItem || !user) return;
    const form = new FormData(e.currentTarget);
    const rating = Number(form.get('rating'));
    const comment = String(form.get('comment') ?? '');
    const { error } = await supabase.from('reviews').upsert({ user_id: user.id, product_id: reviewItem, rating, comment });
    if (!error) {
      setMessage('Review saved.');
      setReviewItem(null);
    } else {
      setMessage(error.message);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-4">
      <Link to="/account/orders" className="text-sm underline">Back to orders</Link>
      <h1 className="mt-2 text-2xl font-semibold">Order {order.id}</h1>
      <p className="text-sm uppercase mt-1">Status: {order.status}</p>
      <div className="mt-4 bg-white border rounded p-3">
        <p className="font-medium">Shipping Address</p>
        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(order.shipping_address, null, 2)}</pre>
        {order.notes && <p className="text-sm mt-2">Notes: {order.notes}</p>}
      </div>
      <div className="mt-4 space-y-2">
        {order.order_items?.map((item: any) => (
          <div key={item.id} className="bg-white border rounded p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{item.products?.name ?? item.product_id}</p>
              <p className="text-sm">Qty: {item.quantity} | Price: PHP {item.price_at_purchase}</p>
            </div>
            {order.status === 'delivered' && <button className="border rounded px-3 py-1 text-sm" onClick={() => setReviewItem(item.product_id)}>Leave review</button>}
          </div>
        ))}
      </div>
      {order.status === 'pending' && <button className="mt-4 border rounded px-3 py-2 text-red-600" onClick={cancelOrder}>Cancel Order</button>}
      {reviewItem && (
        <form className="mt-4 bg-white border rounded p-3 space-y-2" onSubmit={submitReview}>
          <p className="font-medium">Review Product</p>
          <input name="rating" type="number" min={1} max={5} className="border rounded p-2 w-full" placeholder="Rating 1-5" required />
          <textarea name="comment" className="border rounded p-2 w-full" placeholder="Comment" />
          <button className="border rounded px-3 py-1">Save Review</button>
        </form>
      )}
      {message && <p className="mt-3 text-sm">{message}</p>}
    </main>
  );
}
