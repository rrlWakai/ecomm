import { useCallback, useEffect, useMemo, useState } from "react";
import { products as fallbackProducts } from "../data/products";
import { hasSupabaseEnv, supabase } from "../data/supabase";
import type { Category, CustomerRecord, OrderRecord, Product } from "../types/catalog";

type ProductInput = Omit<Product, "id"> & { id?: string };
type OrderUpdateInput = Partial<Pick<OrderRecord, "status">>;
type CustomerUpdateInput = Partial<Pick<CustomerRecord, "full_name" | "email" | "total_orders" | "total_spend" | "last_purchase_at">>;

type RawProduct = Omit<Product, "price" | "specs" | "highlights" | "images" | "featured"> & {
  price: number | string;
  specs: unknown;
  highlights: unknown;
  images: unknown;
  featured?: boolean | null;
};

type RawOrder = Omit<OrderRecord, "total_amount"> & { total_amount: number | string };
type RawCustomer = Omit<CustomerRecord, "total_orders" | "total_spend"> & {
  total_orders: number | string;
  total_spend: number | string;
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? "")).map((item) => item.trim()).filter(Boolean);
}

function normalizeProductRow(row: RawProduct): Product {
  return {
    ...row,
    category: normalizeCategory(row.category),
    price: toNumber(row.price),
    specs: toStringArray(row.specs),
    highlights: toStringArray(row.highlights),
    images: toStringArray(row.images),
    featured: Boolean(row.featured)
  };
}

function normalizeOrderRow(row: RawOrder): OrderRecord {
  return {
    ...row,
    total_amount: toNumber(row.total_amount)
  };
}

function normalizeCustomerRow(row: RawCustomer): CustomerRecord {
  return {
    ...row,
    total_orders: Math.max(0, Math.floor(toNumber(row.total_orders))),
    total_spend: toNumber(row.total_spend)
  };
}

const fallbackOrders: OrderRecord[] = [
  { id: "ord-1001", customer_id: "c-01", customer_name: "Avery Stone", customer_email: "avery@example.com", status: "processing", total_amount: 2499, created_at: "2026-05-19T11:00:00Z" },
  { id: "ord-1002", customer_id: "c-02", customer_name: "Mila Hart", customer_email: "mila@example.com", status: "pending", total_amount: 1099, created_at: "2026-05-20T08:30:00Z" }
];

const fallbackCustomers: CustomerRecord[] = [
  { id: "c-01", full_name: "Avery Stone", email: "avery@example.com", total_orders: 5, total_spend: 6298, last_purchase_at: "2026-05-19T11:00:00Z", created_at: "2025-08-10T10:00:00Z" },
  { id: "c-02", full_name: "Mila Hart", email: "mila@example.com", total_orders: 2, total_spend: 1698, last_purchase_at: "2026-05-20T08:30:00Z", created_at: "2026-01-12T13:30:00Z" }
];

export function useSupabaseCommerce() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [orders, setOrders] = useState<OrderRecord[]>(fallbackOrders);
  const [customers, setCustomers] = useState<CustomerRecord[]>(fallbackCustomers);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"supabase" | "fallback">("fallback");
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    if (!supabase || !hasSupabaseEnv) {
      setMode("fallback");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMode("supabase");
    setError(null);

    const [productsRes, ordersRes, customersRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("customers").select("*").order("created_at", { ascending: false })
    ]);

    if (productsRes.error || ordersRes.error || customersRes.error) {
      setError(productsRes.error?.message ?? ordersRes.error?.message ?? customersRes.error?.message ?? "Failed loading Supabase tables.");
      setMode("fallback");
      setProducts(fallbackProducts);
      setOrders(fallbackOrders);
      setCustomers(fallbackCustomers);
      setLoading(false);
      return;
    }

    setProducts(((productsRes.data as RawProduct[]) ?? []).map(normalizeProductRow));
    setOrders(((ordersRes.data as RawOrder[]) ?? []).map(normalizeOrderRow));
    setCustomers(((customersRes.data as RawCustomer[]) ?? []).map(normalizeCustomerRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    const client = supabase;
    if (!client || mode !== "supabase") return;
    const channel = client
      .channel("commerce-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => void loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => void loadAll())
      .on("postgres_changes", { event: "*", schema: "public", table: "customers" }, () => void loadAll())
      .subscribe();
    return () => { void client.removeChannel(channel); };
  }, [loadAll, mode]);

  const createProduct = useCallback(async (input: ProductInput) => {
    if (!supabase || mode !== "supabase") {
      const temp: Product = { id: crypto.randomUUID(), ...input };
      setProducts((prev) => [temp, ...prev]);
      return { ok: true };
    }
    const { error: createErr } = await supabase.from("products").insert(input);
    if (createErr) return { ok: false, error: createErr.message };
    return { ok: true };
  }, [mode]);

  const updateProduct = useCallback(async (id: string, input: Partial<ProductInput>) => {
    if (!supabase || mode !== "supabase") {
      setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)));
      return { ok: true };
    }
    const { error: updateErr } = await supabase.from("products").update(input).eq("id", id);
    if (updateErr) return { ok: false, error: updateErr.message };
    return { ok: true };
  }, [mode]);

  const deleteProduct = useCallback(async (id: string) => {
    if (!supabase || mode !== "supabase") {
      setProducts((prev) => prev.filter((item) => item.id !== id));
      return { ok: true };
    }
    const { error: deleteErr } = await supabase.from("products").delete().eq("id", id);
    if (deleteErr) return { ok: false, error: deleteErr.message };
    return { ok: true };
  }, [mode]);

  const updateOrder = useCallback(async (id: string, input: OrderUpdateInput) => {
    if (!supabase || mode !== "supabase") {
      setOrders((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)));
      return { ok: true };
    }
    const { error: updateErr } = await supabase.from("orders").update(input).eq("id", id);
    if (updateErr) return { ok: false, error: updateErr.message };
    return { ok: true };
  }, [mode]);

  const updateCustomer = useCallback(async (id: string, input: CustomerUpdateInput) => {
    if (!supabase || mode !== "supabase") {
      setCustomers((prev) => prev.map((item) => (item.id === id ? { ...item, ...input } : item)));
      return { ok: true };
    }
    const { error: updateErr } = await supabase.from("customers").update(input).eq("id", id);
    if (updateErr) return { ok: false, error: updateErr.message };
    return { ok: true };
  }, [mode]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, row) => sum + row.total_amount, 0);
    return { revenue, orders: orders.length, customers: customers.length };
  }, [customers.length, orders]);

  return {
    products,
    orders,
    customers,
    loading,
    mode,
    error,
    stats,
    loadAll,
    createProduct,
    updateProduct,
    deleteProduct,
    updateOrder,
    updateCustomer
  };
}

export function normalizeCategory(input: string): Category {
  const normalized = input.toLowerCase();
  if (normalized === "laptops" || normalized === "phones" || normalized === "tablets" || normalized === "desktops") {
    return normalized;
  }
  return "laptops";
}
