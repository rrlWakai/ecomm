import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    }
  });
}
