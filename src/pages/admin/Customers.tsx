import { useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../hooks/useAdmin';

export function AdminCustomersPage() {
  const { customers, orders } = useAdmin();
  const [selected, setSelected] = useState<string | null>(null);

  const orderMap = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const o of orders.data ?? []) {
      const list = m.get(o.user_id) ?? [];
      list.push(o);
      m.set(o.user_id, list);
    }
    return m;
  }, [orders.data]);

  const toggleBan = async (id: string, is_banned: boolean) => {
    await supabase.from('profiles').update({ is_banned: !is_banned }).eq('id', id);
    await customers.refetch();
  };

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="space-y-2">{(customers.data ?? []).map((c: any) => { const list = orderMap.get(c.id) ?? []; const spent = list.reduce((s, x) => s + Number(x.total_amount ?? 0), 0); return <div key={c.id} className="bg-white border rounded p-3"><div className="flex justify-between items-center"><div><p className="font-medium">{c.full_name ?? 'Unnamed customer'}</p><p className="text-sm">{c.id}</p><p className="text-sm">Orders: {list.length} | Total spent: PHP {spent.toFixed(2)} | Joined: {new Date(c.created_at).toLocaleDateString()}</p></div><div className="flex gap-2"><button className="border rounded px-2 py-1 text-sm" onClick={() => setSelected((prev) => prev === c.id ? null : c.id)}>View Orders</button><button className="border rounded px-2 py-1 text-sm" onClick={() => void toggleBan(c.id, c.is_banned)}>{c.is_banned ? 'Unban' : 'Ban'}</button></div></div>{selected === c.id && <div className="mt-3 border-t pt-3 space-y-2">{list.map((o) => <div key={o.id} className="text-sm">{o.id} - {o.status} - PHP {o.total_amount}</div>)}{list.length === 0 && <p className="text-sm">No orders yet.</p>}</div>}</div>; })}</div>
    </main>
  );
}
