import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../stores/cart.store';
import { useAuthStore } from '../../stores/auth.store';

type Product = { id: string; name: string; price: number; images: string[]; stock: number };

export function ShopPage({ products }: { products: Product[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  const addWishlist = async (productId: string) => {
    if (!user) return;
    await supabase.from('wishlist').upsert({ user_id: user.id, product_id: productId }, { onConflict: 'user_id,product_id' });
  };

  return <main className="mx-auto max-w-6xl p-4 grid md:grid-cols-3 gap-4">{products.map((p) => <article key={p.id} className="bg-white border rounded-lg p-3"><img src={p.images?.[0]} className="h-44 w-full object-cover rounded" /><h3 className="mt-2 font-medium">{p.name}</h3><p className="text-sm">PHP {p.price}</p><p className="text-xs text-slate-500">Stock: {p.stock}</p><div className="mt-2 grid grid-cols-2 gap-2"><button className="w-full border rounded py-1" onClick={() => void addItem({ productId: p.id, quantity: 1, price: Number(p.price), name: p.name, image: p.images?.[0] ?? '' })}>Add to cart</button><button className="w-full border rounded py-1" onClick={() => void addWishlist(p.id)} disabled={!user}>Save</button></div></article>)}</main>;
}
