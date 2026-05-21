import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../hooks/useAdmin';

const statuses = ['pending','confirmed','processing','shipped','delivered','cancelled'];

export function AdminOrdersPage() {
  const { orders } = useAdmin();
  return <main className="mx-auto max-w-6xl p-4"><h1 className="text-2xl font-semibold">Orders</h1><div className="mt-4 space-y-2">{(orders.data ?? []).map((o: any) => <div key={o.id} className="bg-white border rounded p-3 flex justify-between items-center"><div><p className="font-medium">{o.id}</p><p className="text-sm">{o.profiles?.full_name ?? 'Customer'} - PHP {o.total_amount}</p></div><select value={o.status} onChange={async (e) => { await supabase.from('orders').update({ status: e.target.value as any }).eq('id', o.id); await orders.refetch(); }} className="border rounded p-2 text-sm">{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>)}</div></main>;
}
