import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { products, promoSlides } from "./data/products";
import { CommerceProvider, useCommerceStore } from "./store/commerce-store";
import type { Category, Product } from "./types/catalog";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

function AppShell() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/categories/laptops" element={<CategoryPage category="laptops" />} />
              <Route path="/categories/phones" element={<CategoryPage category="phones" />} />
              <Route path="/categories/tablets" element={<CategoryPage category="tablets" />} />
              <Route path="/categories/desktops" element={<CategoryPage category="desktops" />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<TextPage title="About" body="TechElite creates precision devices for people doing meaningful work." />} />
              <Route path="/contact" element={<TextPage title="Contact" body="Reach us at support@techelite.example for product and order support." />} />
              <Route path="/support" element={<TextPage title="Support" body="Warranty, repairs, and service options are available globally." />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function LandingPage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [promoIdx, setPromoIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const phones = products.filter((p) => p.category === "phones");
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -60]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((p) => (p + 1) % phones.length);
      setPromoIdx((p) => (p + 1) % promoSlides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [phones.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setHeroIdx((p) => (p + 1) % phones.length);
      if (e.key === "ArrowLeft") setHeroIdx((p) => (p - 1 + phones.length) % phones.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phones.length]);
  return (
    <>
      <section className="min-h-screen px-6 py-16 flex flex-col justify-center items-center">
        <motion.h1 className="text-5xl md:text-7xl font-light tracking-tight text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {"Performance Redefined".split("").map((c, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>{c}</motion.span>
          ))}
        </motion.h1>
        <motion.img src={products[0].images[0]} alt={products[0].name} style={{ y: heroY }} className="max-w-4xl w-full mt-12 object-contain" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} />
        <button className="mt-10 px-8 py-3 rounded-full bg-black text-white text-sm" onClick={() => navigate(`/products/${products[0].slug}`)}>Explore Product</button>
      </section>

      <section className="px-6 py-20 bg-neutral-50">
        <h2 className="text-4xl font-light mb-10">Smartphones</h2>
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div key={heroIdx} initial={{ opacity: 0.2, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-8 items-center" onTouchStart={(e) => setTouchStart(e.changedTouches[0].clientX)} onTouchEnd={(e) => { const diff = touchStart - e.changedTouches[0].clientX; if (diff > 30) setHeroIdx((p) => (p + 1) % phones.length); if (diff < -30) setHeroIdx((p) => (p - 1 + phones.length) % phones.length); }}>
                <img src={phones[heroIdx].images[0]} alt={phones[heroIdx].name} className="w-full h-[420px] object-cover rounded-3xl" />
                <div>
                  <h3 className="text-3xl">{phones[heroIdx].name}</h3>
                  <p className="text-black/60 mt-3">{phones[heroIdx].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex gap-3">
              <button className="p-2 border rounded-full" onClick={() => setHeroIdx((p) => (p - 1 + phones.length) % phones.length)}><ChevronLeft /></button>
              <button className="p-2 border rounded-full" onClick={() => setHeroIdx((p) => (p + 1) % phones.length)}><ChevronRight /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <h2 className="text-4xl font-light mb-8">Featured Story</h2>
        <div className="grid gap-8">
          {products.filter((p) => p.featured).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="grid md:grid-cols-2 gap-8 items-center">
              <img src={p.images[1]} alt={p.name} className="rounded-2xl h-[320px] w-full object-cover" />
              <div>
                <p className="text-sm text-black/60">{p.tagline}</p>
                <h3 className="text-3xl mt-1">{p.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 bg-black text-white">
        <AnimatePresence mode="wait">
          <motion.div key={promoIdx} initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <img src={promoSlides[promoIdx].image} alt={promoSlides[promoIdx].title} className="rounded-3xl w-full h-[360px] object-cover" />
            <div>
              <h3 className="text-4xl font-light">{promoSlides[promoIdx].title}</h3>
              <p className="mt-3 text-white/70">{promoSlides[promoIdx].subtitle}</p>
              <div className="mt-6 h-1 bg-white/15"><motion.div className="h-full bg-white" animate={{ width: `${((promoIdx + 1) / promoSlides.length) * 100}%` }} /></div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="max-w-6xl mx-auto mt-6 flex gap-3">
          <button className="p-2 border border-white/40 rounded-full" onClick={() => setPromoIdx((p) => (p - 1 + promoSlides.length) % promoSlides.length)}><ChevronLeft /></button>
          <button className="p-2 border border-white/40 rounded-full" onClick={() => setPromoIdx((p) => (p + 1) % promoSlides.length)}><ChevronRight /></button>
        </div>
      </section>
    </>
  );
}

function ProductGrid({ list }: { list: Product[] }) {
  const { addToCart, wishlist, toggleWishlist } = useCommerceStore();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map((product) => (
        <motion.article key={product.id} whileHover={{ y: -4 }} className="group border border-black/10 rounded-2xl p-4">
          <Link to={`/products/${product.slug}`}>
            <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-56 object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.03]" />
          </Link>
          <div className="mt-4 flex items-start justify-between">
            <div><h3 className="text-lg">{product.name}</h3><p className="text-sm text-black/60">${product.price}</p></div>
            <button onClick={() => toggleWishlist(product.id)}><Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-black" : ""}`} /></button>
          </div>
          <button className="mt-4 w-full py-2 bg-black text-white rounded-full text-sm" onClick={() => addToCart(product.id)}>Add to Cart</button>
        </motion.article>
      ))}
    </div>
  );
}

function ProductsPage() {
  return <section className="px-6 py-16 max-w-[1200px] mx-auto"><h1 className="text-4xl font-light mb-8">All Products</h1><ProductGrid list={products} /></section>;
}

function CategoryPage({ category }: { category: Category }) {
  const [brand, setBrand] = useState("all");
  const [maxPrice, setMaxPrice] = useState(4000);
  const filtered = products.filter((p) => p.category === category).filter((p) => (brand === "all" ? true : p.brand === brand)).filter((p) => p.price <= maxPrice);
  const brands = ["all", ...new Set(products.filter((p) => p.category === category).map((p) => p.brand))];
  return (
    <section className="px-6 py-16 max-w-[1200px] mx-auto">
      <h1 className="text-4xl font-light mb-8 capitalize">{category}</h1>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select className="border rounded-full px-4 py-2" value={brand} onChange={(e) => setBrand(e.target.value)}>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <label className="text-sm">Max Price: ${maxPrice}</label>
        <input type="range" min={500} max={4000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
      </div>
      <ProductGrid list={filtered} />
    </section>
  );
}

function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const { addToCart } = useCommerceStore();
  const [active, setActive] = useState(0);
  if (!product) return <Navigate to="/products" replace />;
  return (
    <section className="px-6 py-16 max-w-[1200px] mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <motion.img key={active} src={product.images[active]} alt={product.name} className="w-full h-[460px] object-cover rounded-2xl" initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} />
          <div className="mt-4 flex gap-3">{product.images.map((img, i) => <button key={img} onClick={() => setActive(i)}><img src={img} alt="" className={`w-20 h-16 object-cover rounded-lg ${i === active ? "ring-2 ring-black" : ""}`} /></button>)}</div>
        </div>
        <div>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-light">{product.name}</motion.h1>
          <p className="text-2xl mt-4">${product.price}</p>
          <p className="mt-4 text-black/65">{product.description}</p>
          <ul className="mt-6 space-y-2 text-sm">{product.specs.map((s) => <li key={s}>• {s}</li>)}</ul>
          <button className="mt-8 px-8 py-3 rounded-full bg-black text-white" onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
      </div>
      <div className="mt-20 grid md:grid-cols-3 gap-8">
        {product.highlights.map((h) => <motion.div key={h} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 border border-black/10 rounded-2xl">{h}</motion.div>)}
      </div>
    </section>
  );
}

function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCommerceStore();
  const rows = cart.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId)! })).filter((i) => i.product);
  const total = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);
  return (
    <section className="px-6 py-16 max-w-[900px] mx-auto">
      <h1 className="text-4xl font-light mb-8">Cart</h1>
      <div className="space-y-4">
        {rows.map((row) => (
          <motion.div key={row.productId} layout className="p-4 border border-black/10 rounded-xl flex items-center justify-between gap-4">
            <div><p>{row.product.name}</p><p className="text-sm text-black/60">${row.product.price}</p></div>
            <div className="flex items-center gap-2">
              <button className="px-2 border" onClick={() => updateQuantity(row.productId, row.quantity - 1)}>-</button>
              <span>{row.quantity}</span>
              <button className="px-2 border" onClick={() => updateQuantity(row.productId, row.quantity + 1)}>+</button>
              <button className="ml-3 text-sm" onClick={() => removeFromCart(row.productId)}>Remove</button>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-xl">Total: ${total}</p>
    </section>
  );
}

function WishlistPage() {
  const { wishlist } = useCommerceStore();
  return <section className="px-6 py-16 max-w-[1200px] mx-auto"><h1 className="text-4xl font-light mb-8">Wishlist</h1><ProductGrid list={products.filter((p) => wishlist.includes(p.id))} /></section>;
}

function SearchPage() {
  const { query, setQuery } = useCommerceStore();
  const filtered = useMemo(() => products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <section className="px-6 py-16 max-w-[1200px] mx-auto">
      <h1 className="text-4xl font-light mb-8">Search</h1>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands, categories..." className="w-full mb-8 border border-black/20 rounded-full px-5 py-3" />
      <motion.div layout><ProductGrid list={filtered} /></motion.div>
    </section>
  );
}

function TextPage({ title, body }: { title: string; body: string }) {
  return <section className="px-6 py-24 max-w-3xl mx-auto"><h1 className="text-5xl font-light">{title}</h1><p className="mt-6 text-lg text-black/70">{body}</p></section>;
}

export default function App() {
  return (
    <BrowserRouter>
      <CommerceProvider>
        <AppShell />
      </CommerceProvider>
    </BrowserRouter>
  );
}
