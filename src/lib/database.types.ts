export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; avatar_url: string | null; phone: string | null; role: 'customer' | 'admin'; is_banned: boolean; created_at: string };
        Insert: { id: string; full_name?: string | null; avatar_url?: string | null; phone?: string | null; role?: 'customer' | 'admin'; is_banned?: boolean; created_at?: string };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      admins: { Row: { id: string; email: string; created_at: string; last_login: string | null }; Insert: { id: string; email: string; created_at?: string; last_login?: string | null }; Update: Partial<Database['public']['Tables']['admins']['Insert']> };
      categories: { Row: { id: string; name: string; slug: string; created_at: string }; Insert: { id?: string; name: string; slug: string; created_at?: string }; Update: Partial<Database['public']['Tables']['categories']['Insert']> };
      products: { Row: { id: string; name: string; slug: string; description: string | null; tagline: string | null; price: number; compare_price: number | null; stock: number; category_id: string | null; images: string[]; is_featured: boolean; is_active: boolean; created_at: string }; Insert: { id?: string; name: string; slug: string; description?: string | null; tagline?: string | null; price: number; compare_price?: number | null; stock?: number; category_id?: string | null; images?: string[]; is_featured?: boolean; is_active?: boolean; created_at?: string }; Update: Partial<Database['public']['Tables']['products']['Insert']> };
      addresses: { Row: { id: string; user_id: string; full_name: string | null; line1: string | null; line2: string | null; city: string | null; province: string | null; postal_code: string | null; country: string | null; is_default: boolean; created_at: string }; Insert: { id?: string; user_id: string; full_name?: string | null; line1?: string | null; line2?: string | null; city?: string | null; province?: string | null; postal_code?: string | null; country?: string | null; is_default?: boolean; created_at?: string }; Update: Partial<Database['public']['Tables']['addresses']['Insert']> };
      cart_items: { Row: { id: string; user_id: string; product_id: string; quantity: number; created_at: string }; Insert: { id?: string; user_id: string; product_id: string; quantity?: number; created_at?: string }; Update: Partial<Database['public']['Tables']['cart_items']['Insert']> };
      orders: { Row: { id: string; user_id: string; status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; total_amount: number; shipping_address: Json; notes: string | null; created_at: string }; Insert: { id?: string; user_id: string; status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; total_amount: number; shipping_address: Json; notes?: string | null; created_at?: string }; Update: Partial<Database['public']['Tables']['orders']['Insert']> };
      order_items: { Row: { id: string; order_id: string; product_id: string; quantity: number; price_at_purchase: number; created_at: string }; Insert: { id?: string; order_id: string; product_id: string; quantity: number; price_at_purchase: number; created_at?: string }; Update: Partial<Database['public']['Tables']['order_items']['Insert']> };
      wishlist: { Row: { id: string; user_id: string; product_id: string; created_at: string }; Insert: { id?: string; user_id: string; product_id: string; created_at?: string }; Update: Partial<Database['public']['Tables']['wishlist']['Insert']> };
      reviews: { Row: { id: string; user_id: string; product_id: string; rating: number; comment: string | null; created_at: string }; Insert: { id?: string; user_id: string; product_id: string; rating: number; comment?: string | null; created_at?: string }; Update: Partial<Database['public']['Tables']['reviews']['Insert']> };
    };
    Views: Record<string, never>;
    Functions: {
      get_dashboard_stats: { Args: Record<string, never>; Returns: { total_revenue: number; orders_today: number; new_customers_week: number; pending_orders: number; low_stock_count: number }[] };
      create_order_with_items: { Args: { p_user_id: string; p_shipping_address: Json; p_notes: string | null; p_items: Json }; Returns: { id: string; user_id: string; status: string; total_amount: number; shipping_address: Json; notes: string | null; created_at: string }[] };
    };
    Enums: Record<string, never>;
  };
};
