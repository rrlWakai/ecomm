import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';

const statusTone: Record<string, string> = {
  pending: 'text-[#8a8a8a]',
  confirmed: 'text-[#1a1a1a]',
  processing: 'text-[#1a1a1a]',
  shipped: 'text-[#1a1a1a]',
  delivered: 'text-[#1a1a1a]',
  cancelled: 'text-[#8a8a8a]'
};

export function AccountOrdersPage() {
  const { data, isLoading, error } = useOrders();
  if (isLoading) return <main className="p-6">Loading...</main>;
  if (error) return <main className="p-6">Failed to load orders</main>;

  return (
    <main className="mx-auto max-w-[980px] px-6 py-16 md:py-24">
      <h1 className="text-5xl font-light tracking-tight md:text-7xl">My Orders</h1>
      <div className="mt-10 space-y-0 border-t border-black/10">
        {(data ?? []).map((o: any) => (
          <Link key={o.id} to={`/account/orders/${o.id}`} className="block border-b border-black/10 py-7 transition-opacity hover:opacity-70">
            <div className="flex items-center justify-between">
              <p className="text-xl font-light">{o.id}</p>
              <span className={`text-xs uppercase tracking-[0.16em] ${statusTone[o.status] ?? 'text-[#8a8a8a]'}`}>{o.status}</span>
            </div>
            <p className="mt-2 text-sm text-[#666666]">{new Date(o.created_at).toLocaleString()}</p>
            <p className="mt-1 text-sm text-[#666666]">Items: {o.order_items?.length ?? 0} | Total: PHP {o.total_amount}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
