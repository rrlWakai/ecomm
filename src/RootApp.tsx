import { Link, Route, Routes } from 'react-router-dom';
import { AdminGuard } from './components/admin/AdminGuard';
import { useProducts } from './hooks/useProducts';
import { ShopPage } from './pages/shop/ShopPage';
import { CartPage } from './pages/shop/CartPage';
import { CheckoutPage } from './pages/shop/CheckoutPage';
import { ConfirmationPage } from './pages/shop/ConfirmationPage';
import { AdminLoginPage } from './pages/auth/AdminLogin';
import { AccountOrdersPage } from './pages/account/Orders';
import { AccountOrderDetailPage } from './pages/account/OrderDetail';
import { AccountProfilePage } from './pages/account/Profile';
import { AccountAddressesPage } from './pages/account/Addresses';
import { AccountWishlistPage } from './pages/account/Wishlist';
import { AdminDashboardPage } from './pages/admin/Dashboard';
import { AdminOrdersPage } from './pages/admin/Orders';
import { AdminProductsPage } from './pages/admin/Products';
import { AdminCustomersPage } from './pages/admin/Customers';
import { AdminAnalyticsPage } from './pages/admin/Analytics';
import { AdminMachineLearningPage } from './pages/admin/MachineLearning';
import { useCartStore } from './stores/cart.store';

export default function RootApp() {
  const { data } = useProducts();
  const cartCount = useCartStore((s) => s.totalItems);
  const products = data ?? [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">TechElite Store</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/">Shop</Link>
            <Link to="/account/orders">My Orders</Link>
            <Link to="/account/wishlist">Wishlist</Link>
            <Link to="/account/profile">Profile</Link>
            <Link to="/cart">Cart ({cartCount})</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<ShopPage products={products} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
        <Route path="/account/orders" element={<AccountOrdersPage />} />
        <Route path="/account/orders/:id" element={<AccountOrderDetailPage />} />
        <Route path="/account/profile" element={<AccountProfilePage />} />
        <Route path="/account/addresses" element={<AccountAddressesPage />} />
        <Route path="/account/wishlist" element={<AccountWishlistPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
        <Route path="/admin/orders" element={<AdminGuard><AdminOrdersPage /></AdminGuard>} />
        <Route path="/admin/products" element={<AdminGuard><AdminProductsPage /></AdminGuard>} />
        <Route path="/admin/customers" element={<AdminGuard><AdminCustomersPage /></AdminGuard>} />
        <Route path="/admin/analytics" element={<AdminGuard><AdminAnalyticsPage /></AdminGuard>} />
        <Route path="/admin/machine-learning" element={<AdminGuard><AdminMachineLearningPage /></AdminGuard>} />
      </Routes>
    </div>
  );
}
