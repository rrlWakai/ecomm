import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCommerceStore } from "../store/commerce-store";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/categories/laptops", label: "Laptops" },
  { to: "/categories/phones", label: "Phones" },
  { to: "/categories/tablets", label: "Tablets" },
  { to: "/categories/desktops", label: "Desktops" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount, wishlist, setQuery, cart, removeFromCart } = useCommerceStore();
  const navigate = useNavigate();
  const preview = cart.slice(0, 3);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all ${scrolled ? "bg-white/75 backdrop-blur-xl border-black/10" : "bg-transparent border-transparent"}`}>
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-lg font-medium tracking-tight">TechElite</NavLink>
        <div className="hidden md:flex items-center gap-8 text-sm">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `relative pb-1 transition-opacity ${isActive ? "opacity-100" : "opacity-65 hover:opacity-100"}`}>
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && <motion.span layoutId="active-nav" className="absolute left-0 right-0 -bottom-0.5 h-px bg-black" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { setQuery(""); navigate("/search"); }} aria-label="Search"><Search className="w-4 h-4" /></button>
          <NavLink to="/wishlist" className="relative" aria-label="Wishlist"><Heart className="w-4 h-4" />{wishlist.length > 0 && <span className="absolute -top-2 -right-2 text-[10px] px-1 rounded-full bg-black text-white">{wishlist.length}</span>}</NavLink>
          <button className="relative" aria-label="Cart preview" onClick={() => setCartOpen(true)}><ShoppingBag className="w-4 h-4" />{cartCount > 0 && <span className="absolute -top-2 -right-2 text-[10px] px-1 rounded-full bg-black text-white">{cartCount}</span>}</button>
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="w-4 h-4" /></button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/10">
            <div className="max-w-[1320px] mx-auto px-6 py-8">
              <div className="flex justify-end"><button onClick={() => setOpen(false)} aria-label="Close menu"><X className="w-5 h-5" /></button></div>
              <div className="mt-4 grid gap-4 text-lg">
                {links.map((link, idx) => (
                  <motion.div key={link.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <NavLink to={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cartOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
            <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} transition={{ duration: 0.3 }} className="absolute right-0 top-0 h-full w-[360px] bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.2em] text-black/50">Cart</p>
                <button onClick={() => setCartOpen(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="mt-6 space-y-4">
                {preview.map((item) => (
                  <div key={item.productId} className="border-b border-black/10 pb-3 flex items-center justify-between">
                    <p className="text-sm">{item.productId}</p>
                    <button className="text-xs text-black/50" onClick={() => removeFromCart(item.productId)}>Remove</button>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full rounded-full bg-black text-white py-2.5 text-sm" onClick={() => { setCartOpen(false); navigate("/cart"); }}>Open Cart</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
