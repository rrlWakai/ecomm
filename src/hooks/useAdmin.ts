import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useAdmin() {
  const dashboard = useQuery({ queryKey: ['admin-dashboard'], queryFn: async () => (await supabase.rpc('get_dashboard_stats')).data?.[0] ?? null });
  const orders = useQuery({ queryKey: ['admin-orders'], queryFn: async () => (await supabase.from('orders').select('*, profiles(full_name), order_items(*, products(name))').order('created_at', { ascending: false })).data ?? [] });
  const customers = useQuery({ queryKey: ['admin-customers'], queryFn: async () => (await supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false })).data ?? [] });
  const products = useQuery({ queryKey: ['admin-products'], queryFn: async () => (await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })).data ?? [] });
  const categories = useQuery({ queryKey: ['admin-categories'], queryFn: async () => (await supabase.from('categories').select('*').order('name', { ascending: true })).data ?? [] });
  const wishlist = useQuery({ queryKey: ['admin-wishlist'], queryFn: async () => (await supabase.from('wishlist').select('product_id')).data ?? [] });
  return { dashboard, orders, customers, products, categories, wishlist };
}
