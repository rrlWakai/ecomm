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
    <main className="mx-auto max-w-[1240px] px-6 py-16 md:px-10 md:py-24">
      <h1 className="text-5xl font-light tracking-tight md:text-7xl">Wishlist</h1>
      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {(wishlist.data ?? []).map((w: any) => (
          <article key={w.id}>
            <img src={w.products?.images?.[0]} className="h-[340px] w-full object-cover" />
            <div className="mt-4 border-t border-black/10 pt-4">
              <p className="text-2xl font-light tracking-tight">{w.products?.name}</p>
              <p className="mt-2 text-sm text-[#666666]">PHP {w.products?.price}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="border border-black/20 px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-black/35" onClick={() => void addItem({ productId: w.product_id, quantity: 1, price: Number(w.products?.price ?? 0), name: w.products?.name ?? 'Item', image: w.products?.images?.[0] ?? '' })}>Add to cart</button>
              <button className="border border-black/20 px-4 py-2 text-sm text-[#8a8a8a] transition-all hover:-translate-y-0.5 hover:border-black/35 hover:text-black" onClick={() => void remove(w.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
