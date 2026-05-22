import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCommerceStore } from "../store/commerce-store";
import type { Product } from "../types/catalog";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/categories/laptops", label: "Laptops" },
  { to: "/categories/phones", label: "Phones" },
  { to: "/categories/tablets", label: "Tablets" },
  { to: "/categories/desktops", label: "Desktops" },
];

export function Navbar({ products }: { products: Product[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount, wishlist, setQuery, cart, removeFromCart } =
    useCommerceStore();
  const navigate = useNavigate();
  const preview = cart.slice(0, 3);
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((product) => product.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all ${scrolled ? "bg-white/75 backdrop-blur-xl border-black/10" : "bg-transparent border-transparent"}`}
    >
      <motion.div
        className="origin-left h-0.5 bg-black"
        style={{ scaleX: progressScale }}
      />
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-lg font-medium tracking-tight">
          TechElite
        </NavLink>
        <div className="hidden md:flex items-center gap-8 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative pb-1 transition-opacity ${isActive ? "opacity-100" : "opacity-65 hover:opacity-100"}`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute left-0 right-0 -bottom-0.5 h-px bg-black"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setQuery("");
              navigate("/search");
            }}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <NavLink to="/wishlist" className="relative" aria-label="Wishlist">
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] px-1 rounded-full bg-black text-white">
                {wishlist.length}
              </span>
            )}
          </NavLink>
          <button
            className="relative"
            aria-label="Cart preview"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] px-1 rounded-full bg-black text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm uppercase tracking-[0.2em] text-black/50">
                  Menu
                </p>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-lg">
                {links.map((link, idx) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="block"
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-[360px] bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.2em] text-black/50">
                  Cart
                </p>
                <button onClick={() => setCartOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {preview.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-black/10 py-14 text-center">
                    <ShoppingBag className="w-8 h-8 opacity-30" />
                    <p className="text-sm text-black/60">Your cart is empty</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {preview.map((item) => {
                      const product = products.find(
                        (product) => product.id === item.productId,
                      );
                      if (!product) return null;
                      return (
                        <motion.div
                          key={item.productId}
                          layout
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-3 rounded-3xl border border-black/10 bg-[#fafafa] p-3"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 rounded-2xl object-cover"
                          />
                          <div className="min-w-0 grow">
                            <p className="text-sm font-medium truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-black/50">
                              ${product.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <span className="rounded-full bg-black/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
                            {item.quantity}
                          </span>
                          <button
                            className="text-xs text-black/50"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            Remove
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
              <div className="mt-6 border-t border-black/10 pt-4">
                <p className="text-sm text-black/50">Total</p>
                <p className="mt-1 text-2xl font-semibold">
                  ${cartTotal.toFixed(2)}
                </p>
                <button
                  className="mt-6 w-full rounded-full bg-black text-white py-2.5 text-sm"
                  onClick={() => {
                    setCartOpen(false);
                    navigate("/cart");
                  }}
                >
                  Open Cart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
