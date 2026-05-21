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
