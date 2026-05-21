import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "../types/catalog";

interface CommerceContextValue {
  cart: CartItem[];
  wishlist: string[];
  query: string;
  setQuery: (value: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  cartCount: number;
}

const CommerceContext = createContext<CommerceContextValue | null>(null);
const CART_KEY = "premium_cart_v1";
const WISHLIST_KEY = "premium_wishlist_v1";

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const persistedCart = localStorage.getItem(CART_KEY);
    const persistedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (persistedCart) setCart(JSON.parse(persistedCart));
    if (persistedWishlist) setWishlist(JSON.parse(persistedWishlist));
  }, []);

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)), [wishlist]);

  const value = useMemo<CommerceContextValue>(
    () => ({
      cart,
      wishlist,
      query,
      setQuery,
      addToCart: (productId) => {
        setCart((prev) => {
          const existing = prev.find((item) => item.productId === productId);
          if (existing) return prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item));
          return [...prev, { productId, quantity: 1 }];
        });
      },
      removeFromCart: (productId) => setCart((prev) => prev.filter((item) => item.productId !== productId)),
      updateQuantity: (productId, quantity) =>
        setCart((prev) =>
          quantity <= 0 ? prev.filter((item) => item.productId !== productId) : prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        ),
      toggleWishlist: (productId) =>
        setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId])),
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    }),
    [cart, query, wishlist]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerceStore() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerceStore must be used inside CommerceProvider");
  return context;
}
