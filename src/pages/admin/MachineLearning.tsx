import { useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

export function AdminMachineLearningPage() {
  const { orders, customers, products, wishlist } = useAdmin();

  const classifications = useMemo(() => {
    const orderMap = new Map<string, any[]>();
    for (const o of orders.data ?? []) {
      const list = orderMap.get(o.user_id) ?? [];
      list.push(o);
      orderMap.set(o.user_id, list);
    }

    return (customers.data ?? []).map((c: any) => {
      const list = orderMap.get(c.id) ?? [];
      const orderCount = list.length;
      const spent = list.reduce((s, x) => s + Number(x.total_amount ?? 0), 0);
      const last = list.length ? new Date(list[0].created_at) : null;
      const days = last ? (Date.now() - last.getTime()) / 86400000 : 999;
      let label = 'Regular';
      let score = 60;
      if (spent > 5000 || orderCount >= 5) { label = 'VIP Customer'; score = 94; }
      else if (orderCount >= 2 && days > 60) { label = 'At-Risk Customer'; score = 83; }
      else if (orderCount >= 2 && days <= 30) { label = 'Predicted Repeat Buyer'; score = 88; }
      return { id: c.id, name: c.full_name ?? 'Unnamed', label, score, last: last ? last.toISOString().slice(0, 10) : 'No orders' };
    });
  }, [orders.data, customers.data]);

  const bestCampaign = useMemo(() => {
    const orderByCat = new Map<string, number>();
    const wishlistByCat = new Map<string, number>();
    const productCategory = new Map((products.data ?? []).map((p: any) => [p.id, p.categories?.name ?? 'Uncategorized']));

    for (const w of wishlist.data ?? []) {
      const cat = productCategory.get(w.product_id) ?? 'Uncategorized';
      wishlistByCat.set(cat, (wishlistByCat.get(cat) ?? 0) + 1);
    }

    for (const o of orders.data ?? []) {
      for (const item of o.order_items ?? []) {
        const cat = productCategory.get(item.product_id) ?? 'Uncategorized';
        orderByCat.set(cat, (orderByCat.get(cat) ?? 0) + Number(item.quantity ?? 0));
      }
    }

    const allCats = new Set([...orderByCat.keys(), ...wishlistByCat.keys()]);
    let best = 'No category data';
    let bestScore = -Infinity;
    for (const cat of allCats) {
      const w = wishlistByCat.get(cat) ?? 0;
      const o = orderByCat.get(cat) ?? 0;
      const score = w - o;
      if (score > bestScore) { bestScore = score; best = cat; }
    }
    return best;
  }, [orders.data, products.data, wishlist.data]);

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Machine Learning</h1>
      <div className="bg-white border rounded p-3"><p className="font-medium">Best Campaign Opportunity</p><p className="text-sm">{bestCampaign}</p></div>
      <div className="bg-white border rounded p-3">
        <p className="font-medium">Customer Classification</p>
        <div className="mt-2 space-y-2">{classifications.map((c) => <div key={c.id} className="text-sm border rounded p-2"><p className="font-medium">{c.name}</p><p>{c.label} | Confidence: {c.score}% | Last order: {c.last}</p></div>)}</div>
      </div>
    </main>
  );
}
