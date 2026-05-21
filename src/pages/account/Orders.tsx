import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';

const statusTone: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function AccountOrdersPage() {
  const { data, isLoading, error } = useOrders();
  if (isLoading) return <main className="p-4">Loading...</main>;
  if (error) return <main className="p-4">Failed to load orders</main>;

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      <div className="mt-4 space-y-2">
        {(data ?? []).map((o: any) => (
          <Link key={o.id} to={`/account/orders/${o.id}`} className="block bg-white border rounded p-3 hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="font-medium">{o.id}</p>
              <span className={`text-xs px-2 py-1 rounded-full uppercase ${statusTone[o.status] ?? 'bg-slate-100 text-slate-700'}`}>{o.status}</span>
            </div>
            <p className="text-sm">{new Date(o.created_at).toLocaleString()}</p>
            <p className="text-sm">Items: {o.order_items?.length ?? 0} | Total: PHP {o.total_amount}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
