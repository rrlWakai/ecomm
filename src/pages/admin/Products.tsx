import { FormEvent, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdmin } from '../../hooks/useAdmin';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

export function AdminProductsPage() {
  const { products, categories } = useAdmin();
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const lowStock = useMemo(() => (products.data ?? []).filter((p: any) => p.stock <= 5 && p.is_active), [products.data]);

  const createProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '');
    const payload = {
      name,
      slug: slugify(name),
      description: String(form.get('description') ?? ''),
      price: Number(form.get('price') ?? 0),
      compare_price: Number(form.get('compare_price') || 0) || null,
      stock: Number(form.get('stock') ?? 0),
      category_id: String(form.get('category_id') ?? '') || null,
      is_featured: Boolean(form.get('is_featured')),
      is_active: true,
      images: [] as string[]
    };
    const { error } = await supabase.from('products').insert(payload as any);
    if (error) setMessage(error.message);
    else {
      setMessage('Product created.');
      (e.currentTarget as HTMLFormElement).reset();
      await products.refetch();
    }
  };

  const uploadImage = async (productId: string, file?: File | null) => {
    if (!file) return;
    const path = `${productId}/${Date.now()}-${file.name}`;
    const up = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
    if (up.error) return setMessage(up.error.message);
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    const current = (products.data ?? []).find((p: any) => p.id === productId);
    const images = [...(current?.images ?? []), data.publicUrl];
    await (supabase.from('products') as any).update({ images }).eq('id', productId);
    await products.refetch();
    setMessage('Image uploaded.');
  };

  const toggleActive = async (id: string, next: boolean) => {
    await (supabase.from('products') as any).update({ is_active: next }).eq('id', id);
    await products.refetch();
  };

  const bulkDeactivate = async () => {
    if (!selected.length) return;
    await (supabase.from('products') as any).update({ is_active: false }).in('id', selected);
    setSelected([]);
    await products.refetch();
  };

  const bulkRestock = async () => {
    if (!selected.length) return;
    for (const id of selected) await (supabase.from('products') as any).update({ stock: 25 }).eq('id', id);
    setSelected([]);
    await products.refetch();
  };

  return (
    <main className="mx-auto max-w-6xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <form className="bg-white border rounded p-3 grid md:grid-cols-3 gap-2" onSubmit={createProduct}>
        <input name="name" placeholder="Name" className="border rounded p-2" required />
        <input name="price" type="number" step="0.01" placeholder="Price" className="border rounded p-2" required />
        <input name="compare_price" type="number" step="0.01" placeholder="Compare price" className="border rounded p-2" />
        <input name="stock" type="number" placeholder="Stock" className="border rounded p-2" required />
        <select name="category_id" aria-label="Product category" className="border rounded p-2"><option value="">No category</option>{(categories.data ?? []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <label className="text-sm flex items-center gap-2"><input name="is_featured" type="checkbox" /> Featured</label>
        <textarea name="description" placeholder="Description" className="border rounded p-2 md:col-span-3" />
        <button className="border rounded px-3 py-2 md:col-span-3">Create Product</button>
      </form>

      <div className="flex gap-2"><button className="border rounded px-3 py-1 text-sm" onClick={bulkDeactivate}>Deactivate Selected</button><button className="border rounded px-3 py-1 text-sm" onClick={bulkRestock}>Restock Selected</button></div>
      <p className="text-sm">Low stock items: {lowStock.length}</p>

      <div className="space-y-2">{(products.data ?? []).map((p: any) => <div key={p.id} className="bg-white border rounded p-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><input type="checkbox" aria-label={`Select ${p.name}`} checked={selected.includes(p.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id))} /><p className="font-medium">{p.name}</p>{p.stock <= 5 && <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">Low stock</span>}</div><div className="flex gap-2"><button className="border rounded px-2 py-1 text-sm" onClick={() => void toggleActive(p.id, !p.is_active)}>{p.is_active ? 'Deactivate' : 'Activate'}</button><button className="border rounded px-2 py-1 text-sm text-red-600" onClick={() => void toggleActive(p.id, false)}>Soft Delete</button></div></div><p className="text-sm">PHP {p.price} | Stock {p.stock} | {p.categories?.name ?? 'Uncategorized'}</p><div className="mt-2 flex gap-2 items-center"><input type="file" accept="image/*" aria-label="Upload product image" onChange={(e) => void uploadImage(p.id, e.target.files?.[0])} /><span className="text-xs">Images: {p.images?.length ?? 0}</span></div></div>)}</div>
      {message && <p className="text-sm">{message}</p>}
    </main>
  );
}
