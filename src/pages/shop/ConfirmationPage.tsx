import { Link, useSearchParams } from 'react-router-dom';

export function ConfirmationPage() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  return <main className="mx-auto max-w-2xl p-6"><h1 className="text-2xl font-semibold">Order Confirmed</h1><p className="mt-2">Order ID: {orderId}</p><p className="text-slate-600">Status: Pending. We'll confirm your order shortly.</p><div className="mt-4 flex gap-3"><Link to="/account/orders" className="border rounded px-3 py-2">View Orders</Link><Link to="/" className="border rounded px-3 py-2">Back to Shop</Link></div></main>;
}
