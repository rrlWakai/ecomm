import { useAdmin } from '../../hooks/useAdmin';

export function AdminDashboardPage() {
  const { dashboard } = useAdmin();
  const stats = dashboard.data;
  return <main className="mx-auto max-w-6xl p-4"><h1 className="text-2xl font-semibold">Admin Dashboard</h1><div className="grid md:grid-cols-5 gap-3 mt-4">{[{k:'Revenue',v:stats?.total_revenue ?? 0},{k:'Orders Today',v:stats?.orders_today ?? 0},{k:'New Customers (7d)',v:stats?.new_customers_week ?? 0},{k:'Pending Orders',v:stats?.pending_orders ?? 0},{k:'Low Stock',v:stats?.low_stock_count ?? 0}].map((x)=><div key={x.k} className="bg-white border rounded p-3"><p className="text-xs text-slate-500">{x.k}</p><p className="text-xl font-semibold">{x.v}</p></div>)}</div></main>;
}
