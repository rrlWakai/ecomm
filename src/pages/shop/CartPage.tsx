import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cart.store';

export function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem } = useCartStore();
  return <main className="mx-auto max-w-4xl p-4"><h1 className="text-2xl font-semibold">Cart</h1>{items.map((i) => <div key={i.productId} className="bg-white border rounded p-3 my-3 flex justify-between"><div><p>{i.name}</p><p className="text-sm">PHP {i.price}</p></div><div className="flex items-center gap-2"><button onClick={() => void updateQuantity(i.productId, i.quantity - 1)}>-</button><span>{i.quantity}</span><button onClick={() => void updateQuantity(i.productId, i.quantity + 1)}>+</button><button onClick={() => void removeItem(i.productId)} className="text-red-600">Remove</button></div></div>)}<p className="text-lg">Total: PHP {totalPrice.toFixed(2)}</p><Link className="inline-block mt-3 border rounded px-4 py-2" to="/checkout">Proceed to Shipping</Link></main>;
}
