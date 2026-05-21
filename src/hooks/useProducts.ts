import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const activeQuery = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!activeQuery.error) return activeQuery.data;

      const missingActiveColumn =
        activeQuery.error.message.toLowerCase().includes('is_active') ||
        activeQuery.error.message.toLowerCase().includes('column') ||
        activeQuery.error.code === 'PGRST204';

      if (!missingActiveColumn) throw new Error(activeQuery.error.message);

      const fallbackQuery = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fallbackQuery.error) throw new Error(fallbackQuery.error.message);
      return fallbackQuery.data;
    }
  });
}
