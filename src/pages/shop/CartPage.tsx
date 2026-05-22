import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cart.store';

export function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem } = useCartStore();
  return (
    <main className="mx-auto max-w-[980px] px-6 py-16 md:py-24">
      <h1 className="text-5xl font-light tracking-tight md:text-7xl">Cart</h1>
      <div className="mt-10 border-t border-black/10">
        {items.map((i) => (
          <div key={i.productId} className="grid gap-6 border-b border-black/10 py-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-2xl font-light">{i.name}</p>
              <p className="mt-2 text-sm text-[#666666]">PHP {i.price}</p>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <button onClick={() => void updateQuantity(i.productId, i.quantity - 1)} className="border border-black/20 px-3 py-1">-</button>
              <span>{i.quantity}</span>
              <button onClick={() => void updateQuantity(i.productId, i.quantity + 1)} className="border border-black/20 px-3 py-1">+</button>
              <button onClick={() => void removeItem(i.productId)} className="text-[#8a8a8a] hover:text-black">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex items-end justify-between gap-4 border-t border-black/10 pt-8">
        <p className="text-lg text-[#666666]">Total</p>
        <p className="text-3xl font-light tracking-tight">PHP {totalPrice.toFixed(2)}</p>
      </div>
      <Link className="mt-8 inline-block border border-black bg-black px-7 py-3 text-sm text-white transition-opacity hover:opacity-85" to="/checkout">Proceed to Shipping</Link>
    </main>
  );
}
