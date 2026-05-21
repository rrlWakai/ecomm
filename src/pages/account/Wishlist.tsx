import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { useCartStore } from '../../stores/cart.store';

export function AccountWishlistPage() {
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  const wishlist = useQuery({
    queryKey: ['wishlist', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => (await supabase.from('wishlist').select('id, product_id, products(*)').eq('user_id', user!.id).order('created_at', { ascending: false })).data ?? []
  });

  if (!user) return <main className="p-4">Please login to view wishlist.</main>;

  const remove = async (id: string) => {
    await supabase.from('wishlist').delete().eq('id', id);
    await wishlist.refetch();
  };

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      <div className="mt-4 grid md:grid-cols-3 gap-3">
        {(wishlist.data ?? []).map((w: any) => (
          <article key={w.id} className="bg-white border rounded p-3">
            <img src={w.products?.images?.[0]} className="h-40 w-full object-cover rounded" />
            <p className="mt-2 font-medium">{w.products?.name}</p>
            <p className="text-sm">PHP {w.products?.price}</p>
            <div className="mt-2 flex gap-2">
              <button className="border rounded px-3 py-1 text-sm" onClick={() => void addItem({ productId: w.product_id, quantity: 1, price: Number(w.products?.price ?? 0), name: w.products?.name ?? 'Item', image: w.products?.images?.[0] ?? '' })}>Add to cart</button>
              <button className="border rounded px-3 py-1 text-sm text-red-600" onClick={() => void remove(w.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
