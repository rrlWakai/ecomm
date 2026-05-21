export type Category = "laptops" | "phones" | "tablets" | "desktops";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  description: string;
  tagline: string;
  specs: string[];
  highlights: string[];
  images: string[];
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  status: "pending" | "processing" | "fulfilled" | "cancelled";
  total_amount: number;
  created_at: string;
}

export interface CustomerRecord {
  id: string;
  full_name: string;
  email: string;
  total_orders: number;
  total_spend: number;
  last_purchase_at: string | null;
  created_at: string;
}
