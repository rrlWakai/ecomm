import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth.store';

export function useOrders() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['orders', user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', user!.id).order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    }
  });
}
