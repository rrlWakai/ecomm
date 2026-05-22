import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './auth.store';

const GUEST_KEY = 'guest_cart';

export type CartLine = { productId: string; quantity: number; price: number; name: string; image: string };

type CartState = {
  items: CartLine[];
  totalItems: number;
  totalPrice: number;
  hydrate: () => void;
  syncFromDb: () => Promise<void>;
  mergeOnLogin: () => Promise<void>;
  addItem: (item: CartLine) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const totals = (items: CartLine[]) => ({ totalItems: items.reduce((s, i) => s + i.quantity, 0), totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0) });

export const useCartStore = create<CartState>((set, get) => ({
  items: [], totalItems: 0, totalPrice: 0,
  hydrate: () => {
    const raw = localStorage.getItem(GUEST_KEY);
    const items = raw ? (JSON.parse(raw) as CartLine[]) : [];
    set({ items, ...totals(items) });
  },
  syncFromDb: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const { data } = await supabase.from('cart_items').select('quantity, products(id,name,price,images)').eq('user_id', user.id);
    const items = (data ?? []).map((row: any) => ({ productId: row.products.id, quantity: row.quantity, price: Number(row.products.price), name: row.products.name, image: row.products.images?.[0] ?? '' }));
    set({ items, ...totals(items) });
  },
  mergeOnLogin: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    const guest = JSON.parse(localStorage.getItem(GUEST_KEY) ?? '[]') as CartLine[];
    for (const line of guest) {
      const { data: existing } = await supabase.from('cart_items').select('*').eq('user_id', user.id).eq('product_id', line.productId).maybeSingle();
      if (!existing) await supabase.from('cart_items').insert({ user_id: user.id, product_id: line.productId, quantity: line.quantity });
      else await supabase.from('cart_items').update({ quantity: existing.quantity + line.quantity }).eq('id', existing.id);
    }
    localStorage.removeItem(GUEST_KEY);
    await get().syncFromDb();
  },
  addItem: async (item) => {
    const user = useAuthStore.getState().user;
    const current = get().items;
    const next = current.some((i) => i.productId === item.productId)
      ? current.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i)
      : [...current, item];
    set({ items: next, ...totals(next) });
    if (!user) localStorage.setItem(GUEST_KEY, JSON.stringify(next));
    else await supabase.from('cart_items').upsert({ user_id: user.id, product_id: item.productId, quantity: next.find((x) => x.productId === item.productId)?.quantity ?? 1 }, { onConflict: 'user_id,product_id' });
  },
  removeItem: async (productId) => {
    const user = useAuthStore.getState().user;
    const next = get().items.filter((i) => i.productId !== productId);
    set({ items: next, ...totals(next) });
    if (!user) localStorage.setItem(GUEST_KEY, JSON.stringify(next));
    else await supabase.from('cart_items').delete().eq('user_id', user.id).eq('product_id', productId);
  },
  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) return get().removeItem(productId);
    const user = useAuthStore.getState().user;
    const next = get().items.map((i) => i.productId === productId ? { ...i, quantity } : i);
    set({ items: next, ...totals(next) });
    if (!user) localStorage.setItem(GUEST_KEY, JSON.stringify(next));
    else await supabase.from('cart_items').update({ quantity }).eq('user_id', user.id).eq('product_id', productId);
  },
  clearCart: async () => {
    const user = useAuthStore.getState().user;
    set({ items: [], totalItems: 0, totalPrice: 0 });
    localStorage.removeItem(GUEST_KEY);
    if (user) await supabase.from('cart_items').delete().eq('user_id', user.id);
  }
}));
