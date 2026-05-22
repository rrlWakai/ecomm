import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { shippingSchema } from "../../lib/zod-schemas";
import { useCartStore } from "../../stores/cart.store";
import { useAuthStore } from "../../stores/auth.store";
import { supabase } from "../../lib/supabase";

export function CheckoutPage() {
  const nav = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, profile } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return setError("Please login first.");
    if (profile?.is_banned)
      return setError("Your account is blocked from checkout.");
    const formData = new FormData(e.currentTarget);
    const payload = shippingSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!payload.success)
      return setError(
        payload.error.issues[0]?.message ?? "Invalid shipping details",
      );

    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("stock,price")
        .eq("id", item.productId)
        .single();
      if (!product || product.stock < item.quantity)
        return setError("One or more items are out of stock.");
    }

    const orderRows = items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
      price_at_purchase: i.price,
    }));
    const { data: order, error: orderErr } = await supabase.rpc(
      "create_order_with_items" as any,
      {
        p_user_id: user.id,
        p_shipping_address: payload.data,
        p_notes: payload.data.notes ?? null,
        p_items: orderRows,
      },
    );
    if (orderErr || !order?.[0])
      return setError(orderErr?.message ?? "Order failed");
    await clearCart();
    nav(`/checkout/confirmation?orderId=${order[0].id}`);
  };

  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold">Shipping Details</h1>
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input
            name="full_name"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="Full name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Address line 1
          </span>
          <input
            name="line1"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="Address line 1"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Address line 2
          </span>
          <input
            name="line2"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="Address line 2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">City</span>
          <input
            name="city"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="City"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Province</span>
          <input
            name="province"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="Province"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Postal code
          </span>
          <input
            name="postal_code"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="Postal code"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Country</span>
          <input
            name="country"
            defaultValue="PH"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="Country"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Order notes
          </span>
          <textarea
            name="notes"
            className="mt-2 w-full rounded border border-slate-300 p-2"
            placeholder="Order notes"
          />
        </label>
        <button className="border rounded px-4 py-2">Place Order</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </main>
  );
}
