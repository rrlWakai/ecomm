import { useMemo, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function AdminAnalyticsPage() {
  const { orders, products, customers } = useAdmin();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const revenueSeries = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders.data ?? []) {
      const d = new Date(o.created_at);
      const key = period === 'daily'
        ? d.toISOString().slice(0, 10)
        : period === 'weekly'
          ? startOfWeek(d).toISOString().slice(0, 10)
          : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) ?? 0) + Number(o.total_amount ?? 0));
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [orders.data, period]);

  const statusBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders.data ?? []) map.set(o.status, (map.get(o.status) ?? 0) + 1);
    return Array.from(map.entries());
  }, [orders.data]);

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number }>();
    for (const o of orders.data ?? []) {
      for (const item of o.order_items ?? []) {
        const key = item.product_id;
        const name = item.products?.name ?? key;
        const prev = map.get(key) ?? { name, qty: 0 };
        prev.qty += Number(item.quantity ?? 0);
        map.set(key, prev);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders.data]);

  const newVsReturning = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of orders.data ?? []) counts.set(o.user_id, (counts.get(o.user_id) ?? 0) + 1);
    let one = 0;
    let repeat = 0;
    for (const c of counts.values()) c === 1 ? one++ : repeat++;
    return { one, repeat };
  }, [orders.data]);

  const byCategory = useMemo(() => {
    const pMap = new Map((products.data ?? []).map((p: any) => [p.id, p.categories?.name ?? 'Uncategorized']));
    const map = new Map<string, number>();
    for (const o of orders.data ?? []) {
      for (const item of o.order_items ?? []) {
        const category = pMap.get(item.product_id) ?? 'Uncategorized';
        map.set(category, (map.get(category) ?? 0) + Number(item.quantity ?? 0));
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [orders.data, products.data]);

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="flex gap-2"><button className="border rounded px-2 py-1 text-sm" onClick={() => setPeriod('daily')}>Daily</button><button className="border rounded px-2 py-1 text-sm" onClick={() => setPeriod('weekly')}>Weekly</button><button className="border rounded px-2 py-1 text-sm" onClick={() => setPeriod('monthly')}>Monthly</button></div>
      <section className="bg-white border rounded p-3"><p className="font-medium">Revenue over time ({period})</p>{revenueSeries.map(([k, v]) => <div key={k} className="text-sm">{k}: PHP {v.toFixed(2)}</div>)}</section>
      <section className="bg-white border rounded p-3"><p className="font-medium">Top 5 selling products</p>{topProducts.map((p) => <div key={p.name} className="text-sm">{p.name}: {p.qty}</div>)}</section>
      <section className="bg-white border rounded p-3"><p className="font-medium">Order status breakdown</p>{statusBreakdown.map(([k, v]) => <div key={k} className="text-sm">{k}: {v}</div>)}</section>
      <section className="bg-white border rounded p-3"><p className="font-medium">New vs returning customers</p><div className="text-sm">New (1 order): {newVsReturning.one}</div><div className="text-sm">Returning (2+ orders): {newVsReturning.repeat}</div><div className="text-sm">Customer records: {(customers.data ?? []).length}</div></section>
      <section className="bg-white border rounded p-3"><p className="font-medium">Orders by category</p>{byCategory.map(([k, v]) => <div key={k} className="text-sm">{k}: {v}</div>)}</section>
    </main>
  );
}
