import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type CategoryRow = Database['public']['Tables']['categories']['Row'];
type ProductWithCategory = Database['public']['Tables']['products']['Row'] & {
  categories: { name: string } | null;
};

type WishlistRow = Database['public']['Tables']['wishlist']['Row'];

export function useAdmin() {
  const dashboard = useQuery<Database['public']['Functions']['get_dashboard_stats']['Returns'][0] | null>({ queryKey: ['admin-dashboard'], queryFn: async () => (await supabase.rpc('get_dashboard_stats')).data?.[0] ?? null });
  const orders = useQuery<any[]>({ queryKey: ['admin-orders'], queryFn: async () => (await supabase.from('orders').select('*, profiles(full_name), order_items(*, products(name))').order('created_at', { ascending: false })).data ?? [] });
  const customers = useQuery<Database['public']['Tables']['profiles']['Row'][]>({ queryKey: ['admin-customers'], queryFn: async () => (await supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false })).data ?? [] });
  const products = useQuery<ProductWithCategory[]>({ queryKey: ['admin-products'], queryFn: async () => (await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })).data ?? [] });
  const categories = useQuery<CategoryRow[]>({ queryKey: ['admin-categories'], queryFn: async () => (await supabase.from('categories').select('*').order('name', { ascending: true })).data ?? [] });
  const wishlist = useQuery<WishlistRow[]>({ queryKey: ['admin-wishlist'], queryFn: async () => (await supabase.from('wishlist').select('product_id')).data ?? [] });
  return { dashboard, orders, customers, products, categories, wishlist };
}
