import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

function normalizeProduct(product: any) {
  return {
    ...product,
    category: product.categories?.name ?? product.category,
    featured: product.is_featured ?? false,
    tagline: product.tagline ?? product.description ?? undefined
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const activeQuery = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!activeQuery.error) return (activeQuery.data ?? []).map(normalizeProduct);

      const fallbackQuery = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fallbackQuery.error) throw new Error(fallbackQuery.error.message);

      const categoriesResult = await supabase.from('categories').select('id,name');
      const categoryMap = new Map<string, string>(
        (categoriesResult.data ?? []).map((category: any) => [category.id, category.name]),
      );

      return (fallbackQuery.data ?? []).map((product: any) => {
        if (!product.categories && product.category_id) {
          product.categories = { name: categoryMap.get(product.category_id) ?? undefined };
        }
        return normalizeProduct(product);
      });
    }
  });
}
