import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = location.pathname === '/';

  const brandHeaderClass = isHome
    ? 'bg-transparent border-transparent'
    : 'bg-[#f5f5f3]/90 border-black/10 backdrop-blur-xl';

  return (
    <div className="min-h-screen bg-[#f5f5f3] text-[#111111]">
      <header className={`sticky top-0 z-40 border-b transition-colors duration-500 ${brandHeaderClass}`}>
        <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-6 md:px-10">
          <Link to="/" className="text-sm tracking-[0.24em] uppercase">TechElite</Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <NavLink to="/" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">Shop</NavLink>
            <NavLink to="/" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">Categories</NavLink>
            <NavLink to="/" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">Collections</NavLink>
            <NavLink to="/" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">About</NavLink>
          </nav>

          <div className="hidden items-center gap-5 text-sm md:flex">
            <Link to="/" aria-label="Search" className="hover:opacity-70 transition-opacity"><Search className="h-4 w-4" /></Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <User className="h-4 w-4" />
                <span>Orders</span>
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 mt-3 w-48 border border-black/10 bg-[#fafaf8] p-3"
                  >
                    <Link to="/account/orders" onClick={() => setAccountOpen(false)} className="block py-2 text-sm hover:opacity-70">My Orders</Link>
                    <Link to="/account/wishlist" onClick={() => setAccountOpen(false)} className="block py-2 text-sm hover:opacity-70">Wishlist</Link>
                    <Link to="/account/profile" onClick={() => setAccountOpen(false)} className="block py-2 text-sm hover:opacity-70">Profile</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/cart" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity">
              <ShoppingBag className="h-4 w-4" />
              <span>Cart ({cartCount})</span>
            </Link>
            <Link to="/admin" className="text-xs tracking-[0.12em] uppercase text-[#666] hover:opacity-70">Admin</Link>
          </div>

          <button type="button" onClick={() => setMobileOpen((open) => !open)} className="md:hidden" aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="border-t border-black/10 bg-[#fafaf8] px-6 py-4 md:hidden"
            >
              <div className="flex flex-col gap-3 text-sm">
                <Link to="/" onClick={() => setMobileOpen(false)}>Shop</Link>
                <Link to="/account/orders" onClick={() => setMobileOpen(false)}>My Orders</Link>
                <Link to="/account/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</Link>
                <Link to="/account/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
