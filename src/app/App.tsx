import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Cpu, Heart, Mail, MapPin, Phone, Search, Shield, ShoppingBag, X, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import * as tf from "@tensorflow/tfjs";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { promoSlides } from "./data/products";
import { normalizeCategory, useSupabaseCommerce } from "./hooks/use-supabase-commerce";
import { CommerceProvider, useCommerceStore } from "./store/commerce-store";
import type { Category, CustomerRecord, OrderRecord, Product } from "./types/catalog";

type CommerceData = ReturnType<typeof useSupabaseCommerce>;

function AppShell() {
  const location = useLocation();
  const commerce = useSupabaseCommerce();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#121212]">
      {!isAdminRoute && <Navbar products={commerce.products} />}
      <main className={isAdminRoute ? "" : "pt-16"}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Routes>
              <Route path="/" element={<LandingPage products={commerce.products} />} />
              <Route path="/products" element={<ProductsPage products={commerce.products} />} />
              <Route path="/new-arrivals" element={<CategoryLandingPage products={commerce.products} label="New Arrivals" filter="featured" />} />
              <Route path="/collections" element={<CollectionsPage products={commerce.products} />} />
              <Route path="/products/:slug" element={<ProductDetailPage products={commerce.products} />} />
              <Route path="/categories/laptops" element={<CategoryPage products={commerce.products} category="laptops" />} />
              <Route path="/categories/phones" element={<CategoryPage products={commerce.products} category="phones" />} />
              <Route path="/categories/tablets" element={<CategoryPage products={commerce.products} category="tablets" />} />
              <Route path="/categories/desktops" element={<CategoryPage products={commerce.products} category="desktops" />} />
              <Route path="/cart" element={<CartPage products={commerce.products} />} />
              <Route path="/wishlist" element={<WishlistPage products={commerce.products} />} />
              <Route path="/search" element={<SearchPage products={commerce.products} />} />
              <Route path="/about" element={<TextPage title="About" body="We design luxury consumer technology for focused creators." />} />
              <Route path="/contact" element={<TextPage title="Contact" body="Connect with a product specialist at concierge@techelite.example." />} />
              <Route path="/support" element={<TextPage title="Support" body="Priority repair, setup concierge, and enterprise support are available globally." />} />
              <Route path="/admin" element={<AdminDashboard commerce={commerce} />} />
              <Route path="/admin/products" element={<AdminProductsPage commerce={commerce} />} />
              <Route path="/admin/orders" element={<AdminOrdersPage commerce={commerce} />} />
              <Route path="/admin/customers" element={<AdminCustomersPage commerce={commerce} />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage commerce={commerce} />} />
              <Route path="/admin/machine-learning" element={<AdminMLPage commerce={commerce} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function LandingPage({ products }: { products: Product[] }) {
  const laptop = products.find((p) => p.category === "laptops") ?? products[0];
  const phone = products.find((p) => p.category === "phones") ?? products[1];
  const tablet = products.find((p) => p.category === "tablets") ?? products[2];
  const desktop = products.find((p) => p.category === "desktops") ?? products[3];
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -90]);
  if (!laptop || !phone || !tablet || !desktop) return <TextPage title="Loading" body="Preparing product scenes..." />;

  return (
    <>
      <section className="relative min-h-screen px-6 md:px-10 pt-24 pb-8 overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f4f2_55%,#e9ecef_100%)]">
        <motion.div className="max-w-6xl mx-auto" style={{ y: heroY }}>
          <p className="text-xs uppercase tracking-[0.25em] text-black/55">Laptop Hero Scene</p>
          <h1 className="mt-5 text-5xl md:text-8xl font-light tracking-tight">Performance Redefined</h1>
          <p className="mt-4 text-lg text-black/60 max-w-xl">Built for precision and power.</p>
          <div className="flex gap-4 mt-8">
            <Link to={`/products/${laptop.slug}`} className="px-7 py-3 rounded-full bg-black text-white text-sm">Shop Now</Link>
            <Link to="/about" className="px-7 py-3 rounded-full border border-black/25 text-sm">Learn More</Link>
          </div>
          <motion.img src={laptop.images[0]} alt={laptop.name} className="w-full max-w-6xl mx-auto mt-14 object-contain" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} />
        </motion.div>
      </section>
      <EditorialLine text="Technology should disappear into your workflow." />
      <section className="px-6 md:px-10 py-24">
        <div className="max-w-[1320px] mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }}>
            <p className="uppercase text-xs tracking-[0.2em] text-black/50">Phone Reveal Scene</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-light tracking-tight">Precision In Your Palm</h2>
            <p className="mt-5 text-black/60 max-w-md">An asymmetric composition engineered to keep attention on the object.</p>
            <Link to={`/products/${phone.slug}`} className="inline-flex gap-2 items-center mt-8 border-b border-black/35 pb-1 text-sm">Explore Phone <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
          <motion.div className="relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }}>
            <img src={phone.images[0]} alt={phone.name} className="w-full h-[68vh] object-cover" />
            <img src={phone.images[2]} alt={phone.name} className="absolute -bottom-12 -left-8 w-56 h-72 object-cover border border-white/50 shadow-2xl" />
          </motion.div>
        </div>
      </section>
      <EditorialLine text="Built without compromise." />
      <section className="py-28 px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="uppercase text-xs tracking-[0.2em] text-black/50">Tablet Showcase Scene</p>
          <h2 className="text-5xl md:text-7xl font-light tracking-tight mt-4">Creativity, Unbound.</h2>
          <motion.img src={tablet.images[0]} alt={tablet.name} className="mx-auto mt-16 w-full max-w-5xl" initial={{ opacity: 0.2, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
        </div>
      </section>
      <section className="relative py-24 px-6 md:px-10">
        <img src={desktop.images[1]} alt="Workspace" className="w-full h-[72vh] object-cover" />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 px-10 flex items-end pb-14">
          <h3 className="text-white text-5xl md:text-7xl font-light tracking-tight">Where Focus Lives.</h3>
        </div>
      </section>
      <ProductExplorer products={products} />
      <CampaignShowcase />
    </>
  );
}

function EditorialLine({ text }: { text: string }) {
  return <section className="py-24 px-6"><motion.p className="max-w-5xl mx-auto text-center text-3xl md:text-6xl font-light tracking-tight text-black/85" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.7 }}>{text}</motion.p></section>;
}

function ProductExplorer({ products }: { products: Product[] }) {
  const categories: Category[] = ["laptops", "phones", "tablets", "desktops"];
  const [activeCategory, setActiveCategory] = useState<Category>("laptops");
  const items = useMemo(() => products.filter((p) => p.category === activeCategory), [activeCategory, products]);
  const active = items[0];
  if (!active) return null;
  return (
    <section className="px-6 md:px-10 py-28 bg-[#151515] text-white">
      <div className="max-w-[1320px] mx-auto">
        <h3 className="text-4xl md:text-6xl font-light tracking-tight">Product Explorer Experience</h3>
        <div className="flex gap-5 mt-8 overflow-x-auto pb-3">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`text-sm uppercase tracking-[0.2em] pb-1 ${activeCategory === category ? "border-b border-white" : "text-white/55"}`}>{category}</button>)}</div>
        <LayoutGroup><AnimatePresence mode="wait"><motion.div key={active.id} className="mt-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center" initial={{ opacity: 0.2, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5 }}><motion.img layoutId="explorer-image" src={active.images[0]} alt={active.name} className="w-full h-[62vh] object-cover" /><div><p className="text-xs uppercase tracking-[0.2em] text-white/60">{active.category}</p><h4 className="text-4xl md:text-6xl font-light mt-4">{active.name}</h4><p className="mt-4 text-white/70">{active.description}</p><Link to={`/products/${active.slug}`} className="inline-block mt-8 px-6 py-2.5 border border-white/40 rounded-full text-sm">Discover</Link></div></motion.div></AnimatePresence></LayoutGroup>
      </div>
    </section>
  );
}

function CampaignShowcase() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const timer = setInterval(() => setIdx((prev) => (prev + 1) % promoSlides.length), 4800); return () => clearInterval(timer); }, []);
  return <section className="py-24 px-6 md:px-10 bg-[#0f1114] text-white"><div className="max-w-[1320px] mx-auto"><p className="uppercase text-xs tracking-[0.2em] text-white/60">Featured Collections</p><AnimatePresence mode="wait"><motion.div key={promoSlides[idx].title} initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-end"><img src={promoSlides[idx].image} alt={promoSlides[idx].title} className="w-full h-[62vh] object-cover" /><div><h3 className="text-4xl md:text-6xl font-light tracking-tight">{promoSlides[idx].title}</h3><p className="mt-4 text-white/70">{promoSlides[idx].subtitle}</p><div className="flex gap-2 mt-8">{promoSlides.map((slide, dotIdx) => <button key={slide.title} onClick={() => setIdx(dotIdx)} className={`h-1.5 rounded-full transition-all ${dotIdx === idx ? "w-10 bg-white" : "w-5 bg-white/35"}`} aria-label={`Go to ${slide.title}`} />)}</div></div></motion.div></AnimatePresence></div></section>;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart, toggleWishlist, wishlist } = useCommerceStore();
  const isSaved = wishlist.includes(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
    >
      <div className="relative overflow-hidden">
        <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/90 text-black transition-colors hover:bg-black hover:text-white"
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-black" : ""}`} />
        </button>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-2xl font-light tracking-tight">{product.name}</h3>
          <p className="mt-2 text-sm text-black/60">{product.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={`/products/${product.slug}`} className="rounded-full border border-black/20 px-4 py-2 text-sm transition-colors hover:bg-black hover:text-white">
            View
          </Link>
          <button onClick={() => addToCart(product.id)} className="rounded-full bg-black px-4 py-2 text-sm text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProductsPage({ products }: { products: Product[] }) {
  const categories: (Category | "all")[] = ["all", "laptops", "phones", "tablets", "desktops"];
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
  const filtered = useMemo(() => (activeFilter === "all" ? products : products.filter((product) => product.category === activeFilter)), [activeFilter, products]);

  return (
    <section className="py-20 px-6 md:px-10 max-w-[1320px] mx-auto">
      <div className="mb-10">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight">All Products</h1>
        <p className="mt-4 text-black/60">The complete TechElite collection.</p>
      </div>
      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveFilter(category)}
            className={`rounded-full px-5 py-2 text-sm transition ${activeFilter === category ? "bg-black text-white" : "border border-black/20 text-black/70 hover:bg-black/5"}`}
          >
            {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

function CategoryPage({ products, category }: { products: Product[]; category: Category }) {
  const filtered = useMemo(() => products.filter((product) => product.category === category), [category, products]);

  return (
    <section className="py-20 px-6 md:px-10 max-w-[1320px] mx-auto">
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-black/50">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>•</span>
          <Link to="/products" className="hover:text-black">Products</Link>
          <span>•</span>
          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
        </div>
        <h1 className="mt-4 text-5xl md:text-7xl font-light tracking-tight">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
        <p className="mt-4 text-black/60">A focused selection of TechElite devices in the {category} category.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProductDetailPage({ products }: { products: Product[] }) {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [active, setActive] = useState(0);
  const { addToCart, toggleWishlist, wishlist } = useCommerceStore();

  if (!product) return <Navigate to="/products" replace />;

  return (
    <section className="px-6 md:px-10 py-20 max-w-[1320px] mx-auto">
      <h1 className="text-5xl md:text-8xl font-light tracking-tight">{product.name}</h1>
      <p className="mt-5 max-w-2xl text-black/60">{product.description}</p>
      <motion.img key={product.images[active]} src={product.images[active]} alt={product.name} className="w-full mt-12 h-[66vh] object-cover" initial={{ opacity: 0.2 }} animate={{ opacity: 1 }} />
      <div className="flex flex-wrap gap-4 mt-5">
        {product.images.map((_, i) => (
          <button key={i} type="button" onClick={() => setActive(i)} className={`text-xs uppercase tracking-[0.2em] ${active === i ? "text-black" : "text-black/45"}`}>
            Frame {i + 1}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-10 mt-14">
        <div>
          <p className="text-3xl font-light">${product.price.toFixed(2)}</p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <button onClick={() => addToCart(product.id)} className="px-7 py-3 rounded-full bg-black text-white text-sm">
              Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product.id)} className="px-6 py-3 rounded-full border border-black/25 text-sm">
              {wishlist.includes(product.id) ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        <ul className="space-y-2 text-black/70">
          {product.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CartPage({ products }: { products: Product[] }) {
  const { cart, updateQuantity, removeFromCart } = useCommerceStore();
  const rows = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId)! }))
    .filter((i) => i.product);
  const total = rows.reduce((sum, row) => sum + row.product.price * row.quantity, 0);

  if (rows.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-light tracking-tight">Your Cart</h1>
        <div className="mt-20 flex flex-col items-center justify-center gap-6 rounded-3xl border border-black/10 bg-white p-16 text-center">
          <ShoppingBag className="h-16 w-16 opacity-20" />
          <p className="text-xl font-light">Your cart is empty</p>
          <Link to="/products" className="rounded-full border border-black/25 px-5 py-2 text-sm">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-light tracking-tight">Your Cart</h1>
      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {rows.map((row) => (
              <motion.div key={row.productId} layout exit={{ opacity: 0, x: -20 }} className="overflow-hidden rounded-3xl border border-black/10 bg-white p-5">
                <div className="flex gap-4">
                  <img src={row.product.images[0]} alt={row.product.name} className="h-20 w-20 rounded-3xl object-cover" />
                  <div className="min-w-0 grow">
                    <p className="text-lg font-medium">{row.product.name}</p>
                    <p className="text-sm text-black/50">{row.product.tagline}</p>
                    <p className="mt-3 text-sm font-medium">${row.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center rounded-full border border-black/10 bg-[#fafafa] px-3 py-2">
                    <button type="button" onClick={() => updateQuantity(row.productId, row.quantity - 1)} className="text-sm text-black/70">
                      −
                    </button>
                    <span className="mx-4 text-sm font-medium">{row.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(row.productId, row.quantity + 1)} className="text-sm text-black/70">
                      +
                    </button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(row.productId)} className="text-sm text-black/60 hover:text-black transition-colors">
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <aside className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.2em] text-black/50">Order Summary</p>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between text-sm text-black/60">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-black/60">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="h-px bg-black/5" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => {}} className="mt-4 w-full rounded-full bg-black py-3 text-sm text-white">
            Proceed to Checkout
          </button>
          <Link to="/products" className="mt-4 block text-center text-sm text-black/70 hover:opacity-80 transition-opacity">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}

function WishlistPage({ products }: { products: Product[] }) {
  const { wishlist, addToCart, toggleWishlist } = useCommerceStore();
  const saved = products.filter((product) => wishlist.includes(product.id));

  if (saved.length === 0) {
    return (
      <section className="py-20 px-6 md:px-10 max-w-[1320px] mx-auto">
        <h1 className="text-5xl font-light tracking-tight">Saved Items</h1>
        <div className="mt-16 flex flex-col items-center justify-center gap-6 rounded-3xl border border-black/10 bg-white p-16 text-center">
          <Heart className="h-16 w-16 opacity-20" />
          <p className="text-xl font-light">Nothing saved yet.</p>
          <Link to="/products" className="rounded-full border border-black/25 px-5 py-2 text-sm">
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 md:px-10 max-w-[1320px] mx-auto">
      <h1 className="text-5xl font-light tracking-tight">Saved Items</h1>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {saved.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="group overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
          >
            <div className="relative overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-light">{product.name}</h3>
                  <p className="text-sm text-black/50">{product.tagline}</p>
                </div>
                <button onClick={() => toggleWishlist(product.id)} className="rounded-full border border-black/10 p-2 text-black/70" aria-label="Remove from wishlist">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => { addToCart(product.id); toggleWishlist(product.id); }} className="rounded-full bg-black px-4 py-3 text-sm text-white">
                  Move to Cart
                </button>
                <Link to={`/products/${product.slug}`} className="rounded-full border border-black/25 px-4 py-3 text-center text-sm">
                  View
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function SearchPage({ products }: { products: Product[] }) {
  const navigate = useNavigate();
  const { query, setQuery } = useCommerceStore();
  const [selected, setSelected] = useState(0);
  const filtered = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.brand} ${product.category} ${product.tagline}`.toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );

  useEffect(() => setSelected(0), [query]);

  return (
    <section className="py-20 px-6 md:px-10 max-w-6xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-light tracking-tight">Search</h1>
      <div className="relative mt-10">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
            if (e.key === "ArrowUp") setSelected((prev) => Math.max(prev - 1, 0));
            if (e.key === "Enter" && filtered[selected]) navigate(`/products/${filtered[selected].slug}`);
          }}
          placeholder="Search products"
          className="w-full rounded-[28px] border border-black/10 bg-white px-12 py-5 text-xl outline-none focus:border-black/20"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-black/10 bg-white p-14 text-center">
          <p className="text-xl font-light">No results found.</p>
          <p className="mt-3 text-sm text-black/60">Try another keyword or browse our product collection.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {filtered.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => navigate(`/products/${product.slug}`)}
              className={`group flex w-full items-center gap-4 overflow-hidden rounded-[28px] border p-4 transition ${selected === index ? "bg-black text-white" : "bg-white text-black"}`}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className={`h-14 w-14 rounded-3xl object-cover ${selected === index ? "border border-white/20" : "border border-black/10"}`}
              />
              <div className="grow">
                <p className="text-lg font-medium">{product.name}</p>
                <p className={`mt-1 text-sm ${selected === index ? "text-white/70" : "text-black/60"}`}>{product.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.2em] ${selected === index ? "border-white/20 text-white/70" : "border-black/10 text-black/50"}`}>
                    {product.category}
                  </span>
                  <span className={`rounded-full border px-2 py-1 text-[11px] uppercase tracking-[0.2em] ${selected === index ? "border-white/20 text-white/70" : "border-black/10 text-black/50"}`}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function TextPage({ title, body }: { title: string; body: string }) {
  if (title === "About") return <AboutPage />;
  if (title === "Contact") return <ContactPage />;

  return (
    <section className="px-6 py-28 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-light tracking-tight">{title}</h1>
      <p className="mt-8 text-lg text-black/65 max-w-2xl">{body}</p>
    </section>
  );
}

function AboutPage() {
  const pillars = [
    {
      icon: Cpu,
      title: "Sculpted Performance",
      description: "Every product is designed to reduce friction and keep focus firmly on the task at hand."
    },
    {
      icon: Zap,
      title: "Confident Power",
      description: "Advanced hardware configurations for creators who demand precise responsiveness."
    },
    {
      icon: Shield,
      title: "Dependable Craft",
      description: "Durable materials and intelligent software that support long-term productivity."
    }
  ];

  return (
    <section className="px-6 md:px-10 py-24">
      <div className="max-w-[1320px] mx-auto">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-light tracking-tight">We build technology that disappears into your life.</h1>
          <p className="mt-6 text-lg text-black/65">TechElite creates premium tools that feel effortless and remain quietly dependable throughout the day.</p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-3xl border border-black/10 bg-white p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-medium">{pillar.title}</h3>
                <p className="mt-3 text-sm text-black/60">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <p className="text-3xl md:text-5xl font-light italic text-black/70">"Precision is not an extra feature — it is the foundation of everything we build."</p>
        </div>

        <div className="mt-24 overflow-hidden rounded-[32px] border border-black/10 bg-black">
          <motion.div className="flex whitespace-nowrap text-sm uppercase tracking-[0.3em] text-white" animate={{ x: [0, -50, -100] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
            <span className="px-10">TechElite · Precision · Performance · Focus ·</span>
            <span className="px-10">TechElite · Precision · Performance · Focus ·</span>
            <span className="px-10">TechElite · Precision · Performance · Focus ·</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
  };

  return (
    <section className="px-6 md:px-10 py-24">
      <div className="max-w-[1320px] mx-auto grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="text-5xl md:text-8xl font-light tracking-tight">Contact</h1>
          <p className="mt-5 text-lg text-black/65 max-w-2xl">Reach our team for product questions, custom orders, or support.</p>
          <div className="mt-12 space-y-6 rounded-[32px] bg-white p-8 border border-black/10">
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-black/70" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-black/60">concierge@techelite.example</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-black/70" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-black/60">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-black/70" />
              <div>
                <p className="font-medium">Office</p>
                <p className="text-sm text-black/60">1488 Elm Street, San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/10 bg-white p-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-3xl bg-[#ecfdf5] p-8 text-center text-black/80">
                <p className="text-2xl font-medium">Message sent ✓</p>
                <p className="mt-3 text-sm">Thanks for reaching out, someone will be in touch shortly.</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-4">
                <input required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Name" className="w-full border-b border-black/20 bg-transparent pb-3 text-sm outline-none placeholder:text-black/35" />
                <input required type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" className="w-full border-b border-black/20 bg-transparent pb-3 text-sm outline-none placeholder:text-black/35" />
                <input required value={form.subject} onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))} placeholder="Subject" className="w-full border-b border-black/20 bg-transparent pb-3 text-sm outline-none placeholder:text-black/35" />
                <textarea required value={form.message} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} placeholder="Message" rows={5} className="w-full border-b border-black/20 bg-transparent pb-3 text-sm outline-none placeholder:text-black/35" />
                <button type="submit" disabled={status === "loading"} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60">
                  {status === "loading" ? <span className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" /> : null}
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function CategoryLandingPage({ products, label, filter }: { products: Product[]; label: string; filter: "featured" | Category }) {
  const filtered = useMemo(
    () => (filter === "featured" ? products.filter((product) => product.featured) : products.filter((product) => product.category === filter)),
    [filter, products]
  );

  return (
    <section className="py-20 px-6 md:px-10 max-w-[1320px] mx-auto">
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight">{label}</h1>
        <p className="mt-4 text-black/60">Discover the latest TechElite essentials curated for every workflow.</p>
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-black/10 bg-white p-16 text-center text-black/60">No products available right now.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

function CollectionsPage({ products }: { products: Product[] }) {
  const navigate = useNavigate();
  const categories: Category[] = ["laptops", "phones", "tablets", "desktops"];
  const collectionCards = categories.map((category) => ({
    category,
    image: products.find((product) => product.category === category)?.images[0] ?? "https://via.placeholder.com/800",
    label: category.charAt(0).toUpperCase() + category.slice(1)
  }));

  return (
    <section className="py-20">
      <div className="max-w-[1320px] mx-auto grid gap-6 lg:grid-cols-2 px-6 md:px-10">
        {collectionCards.map((collection) => (
          <motion.button
            key={collection.category}
            type="button"
            onClick={() => navigate(`/categories/${collection.category}`)}
            whileHover={{ scale: 1.02 }}
            className="group relative h-[70vh] overflow-hidden rounded-[32px] text-left"
          >
            <img src={collection.image} alt={collection.label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <p className="text-4xl font-light text-white">{collection.label}</p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white">
                Browse Collection <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

const adminNav = [
  { label: "Dashboard", path: "/admin" },
  { label: "Products", path: "/admin/products" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Customers", path: "/admin/customers" },
  { label: "Analytics", path: "/admin/analytics" },
  { label: "Machine Learning", path: "/admin/machine-learning" }
];

function statusTone(status: string) {
  if (status === "fulfilled" || status === "success") return "bg-[#dcfce7] text-[#16a34a]";
  if (status === "processing" || status === "warning") return "bg-[#fef9c3] text-[#ca8a04]";
  if (status === "cancelled" || status === "danger") return "bg-[#fee2e2] text-[#dc2626]";
  return "bg-[#f3f4f6] text-[#374151]";
}

function AdminLayout({ title, children, commerce }: { title: string; children: ReactNode; commerce: CommerceData }) {
  const location = useLocation();
  return (
    <section className="min-h-screen grid lg:grid-cols-[220px_1fr] bg-[#f8f9fa] text-[#111827] font-[Inter,_system-ui,_-apple-system,_sans-serif]">
      <aside className="bg-[#f4f5f7] min-h-screen px-5 py-6 border-r border-[#e5e7eb]">
        <p className="text-lg font-semibold text-[#111827]">Admin</p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.08em] text-[#9ca3af]">Admin {commerce.mode === "supabase" ? "Live" : "Fallback"}</p>
        <div className="mt-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block text-sm px-3 py-2 rounded-md font-medium ${location.pathname === item.path ? "bg-[#e5e7eb] text-[#111827]" : "text-[#6b7280] hover:bg-[#eceef1]"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </aside>
      <div className="p-8 md:p-10">
        <header className="pt-8 mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">{title}</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Manage your {title.toLowerCase()} data and workflows.</p>
          {commerce.error && <p className="mt-2 text-sm text-[#dc2626]">{commerce.error}</p>}
          {commerce.loading && <p className="mt-2 text-sm text-[#6b7280]">Syncing admin data from Supabase...</p>}
        </header>
        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}

function AdminDashboard({ commerce }: { commerce: CommerceData }) {
  return (
    <AdminLayout title="Dashboard" commerce={commerce}>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {[{ label: "Revenue", value: `$${commerce.stats.revenue.toLocaleString()}` }, { label: "Orders", value: commerce.stats.orders.toLocaleString() }, { label: "Customers", value: commerce.stats.customers.toLocaleString() }].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
            <p className="text-[#6b7280] text-[11px] uppercase tracking-[0.05em]">{kpi.label}</p>
            <p className="text-[28px] font-bold mt-2 text-[#111827]">{kpi.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

function AdminProductsPage({ commerce }: { commerce: CommerceData }) {
  const [form, setForm] = useState({ name: "", slug: "", category: "laptops", brand: "TechElite", price: "999", description: "", tagline: "", featured: false, images: "", specs: "", highlights: "" });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <AdminLayout title="Products" commerce={commerce}>
      <form className="grid md:grid-cols-2 gap-3 bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5" onSubmit={async (e) => {
        e.preventDefault();
        setFeedback(null);
        setError(null);
        const createRes = await commerce.createProduct({ name: form.name, slug: form.slug, category: normalizeCategory(form.category), brand: form.brand, price: Number(form.price), description: form.description, tagline: form.tagline || form.name, featured: form.featured, images: form.images.split(",").map((v) => v.trim()).filter(Boolean), specs: form.specs.split(",").map((v) => v.trim()).filter(Boolean), highlights: form.highlights.split(",").map((v) => v.trim()).filter(Boolean) });
        if (!createRes.ok) {
          setError(createRes.error ?? "Failed to create product.");
          return;
        }
        setFeedback("Product created.");
        setForm({ name: "", slug: "", category: "laptops", brand: "TechElite", price: "999", description: "", tagline: "", featured: false, images: "", specs: "", highlights: "" });
      }}>
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Category" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Brand" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Tagline" value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Images (comma-separated URLs)" value={form.images} onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))} />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Specs (comma-separated)" value={form.specs} onChange={(e) => setForm((p) => ({ ...p, specs: e.target.value }))} />
        <input className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm md:col-span-2 focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" placeholder="Highlights (comma-separated)" value={form.highlights} onChange={(e) => setForm((p) => ({ ...p, highlights: e.target.value }))} />
        <button className="bg-[#111827] hover:bg-[#374151] text-white py-2 px-4 text-sm rounded-lg">Create Product</button>
      </form>
      {feedback && <p className="text-sm text-[#16a34a]">{feedback}</p>}
      {error && <p className="text-sm text-[#dc2626]">{error}</p>}
      <div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f9fafb]">
            <tr>
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Product</th>
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Category</th>
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Price</th>
              <th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Status</th>
              <th className="text-right px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
        {commerce.products.map((item) => (
          <tr key={item.id} className="border-t border-[#f3f4f6] hover:bg-[#f9fafb]">
            <td className="px-4 py-3"><p className="font-medium">{item.name}</p></td>
            <td className="px-4 py-3 text-sm text-[#6b7280]">{item.category}</td>
            <td className="px-4 py-3 text-sm">${item.price}</td>
            <td className="px-4 py-3"><span className={`inline-flex rounded-full px-[10px] py-[2px] text-xs ${item.featured ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f3f4f6] text-[#374151]"}`}>{item.featured ? "Featured" : "Standard"}</span></td>
            <td className="px-4 py-3">
              <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 border border-[#e5e7eb] rounded-md text-sm text-[#374151]" onClick={async () => {
                setFeedback(null);
                setError(null);
                const updateRes = await commerce.updateProduct(item.id, { featured: !item.featured });
                if (!updateRes.ok) {
                  setError(updateRes.error ?? "Failed to update product.");
                  return;
                }
                setFeedback(`${item.name} updated.`);
              }}>{item.featured ? "Unfeature" : "Feature"}</button>
              <button className="px-3 py-1 border border-[#e5e7eb] rounded-md text-sm text-[#374151]" onClick={async () => {
                setFeedback(null);
                setError(null);
                const deleteRes = await commerce.deleteProduct(item.id);
                if (!deleteRes.ok) {
                  setError(deleteRes.error ?? "Failed to delete product.");
                  return;
                }
                setFeedback(`${item.name} deleted.`);
              }}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function AdminOrdersPage({ commerce }: { commerce: CommerceData }) {
  const statuses: OrderRecord["status"][] = ["pending", "processing", "fulfilled", "cancelled"];
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return <AdminLayout title="Orders" commerce={commerce}>{message && <p className="text-sm text-[#16a34a]">{message}</p>}{error && <p className="text-sm text-[#dc2626]">{error}</p>}<div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto"><table className="w-full"><thead className="bg-[#f9fafb]"><tr><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Order</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Customer</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Total</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Status</th><th className="text-right px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Update</th></tr></thead><tbody>{commerce.orders.map((order) => <tr key={order.id} className="border-t border-[#f3f4f6] hover:bg-[#f9fafb]"><td className="px-4 py-3 text-sm font-medium">{order.id}</td><td className="px-4 py-3 text-sm"><p>{order.customer_name}</p><p className="text-[#6b7280]">{order.customer_email}</p></td><td className="px-4 py-3 text-sm">${order.total_amount}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-[10px] py-[2px] text-xs ${statusTone(order.status)}`}>{order.status}</span></td><td className="px-4 py-3 text-right"><select aria-label="Order status" className="border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" value={order.status} onChange={async (e) => { setMessage(null); setError(null); const result = await commerce.updateOrder(order.id, { status: e.target.value as OrderRecord["status"] }); if (!result.ok) { setError(result.error ?? "Failed to update order."); return; } setMessage(`Order ${order.id} updated.`); }}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></AdminLayout>;
}

function AdminCustomersPage({ commerce }: { commerce: CommerceData }) {
  return <AdminLayout title="Customers" commerce={commerce}><div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto"><table className="w-full"><thead className="bg-[#f9fafb]"><tr><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Name</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Email</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Orders</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Spend</th><th className="text-right px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Action</th></tr></thead><tbody>{commerce.customers.map((customer) => <CustomerRow key={customer.id} customer={customer} onSave={(input) => commerce.updateCustomer(customer.id, input)} />)}</tbody></table></div></AdminLayout>;
}

function CustomerRow({ customer, onSave }: { customer: CustomerRecord; onSave: (input: Partial<CustomerRecord>) => Promise<{ ok: boolean; error?: string }>; }) {
  const [spend, setSpend] = useState(String(customer.total_spend));
  const [orders, setOrders] = useState(String(customer.total_orders));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return <tr className="border-t border-[#f3f4f6] hover:bg-[#f9fafb]"><td className="px-4 py-3 text-sm font-medium">{customer.full_name}</td><td className="px-4 py-3 text-sm text-[#6b7280]">{customer.email}</td><td className="px-4 py-3"><input aria-label="Total orders" className="w-24 border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" value={orders} onChange={(e) => setOrders(e.target.value)} /></td><td className="px-4 py-3"><input aria-label="Total spend" className="w-28 border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" value={spend} onChange={(e) => setSpend(e.target.value)} /></td><td className="px-4 py-3 text-right"><button className="px-3 py-1 border border-[#e5e7eb] rounded-md text-sm text-[#374151]" onClick={async () => { setMessage(null); setError(null); const result = await onSave({ total_orders: Number(orders), total_spend: Number(spend) }); if (!result.ok) { setError(result.error ?? "Failed to update customer."); return; } setMessage("Saved."); }}>Save</button>{message && <p className="mt-1 text-xs text-[#16a34a]">{message}</p>}{error && <p className="mt-1 text-xs text-[#dc2626]">{error}</p>}</td></tr>;
}

function AdminAnalyticsPage({ commerce }: { commerce: CommerceData }) {
  const data = commerce.orders.slice(0, 8).map((order) => ({ month: new Date(order.created_at).toLocaleString("en-US", { month: "short" }), revenue: order.total_amount }));
  return <AdminLayout title="Analytics" commerce={commerce}><div className="h-80 bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid stroke="#f3f4f6" /><XAxis dataKey="month" stroke="#9ca3af" /><YAxis stroke="#9ca3af" /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="#eef2ff" /></AreaChart></ResponsiveContainer></div></AdminLayout>;
}

function AdminMLPage({ commerce }: { commerce: CommerceData }) {
  const [insights, setInsights] = useState<{ id: string; segment: string; repeatPurchaseConfidence: number }[]>([]);
  useEffect(() => {
    let active = true;
    const run = async () => {
      await tf.ready();
      const x = tf.tensor2d(commerce.customers.map((c) => [c.total_orders, c.total_spend / 100, c.last_purchase_at ? (Date.now() - new Date(c.last_purchase_at).getTime()) / 86400000 : 300]));
      const w = tf.tensor2d([[0.35], [0.28], [-0.32]]);
      const s = tf.sigmoid(x.matMul(w)).mul(100);
      const conf = Array.from(await s.data());
      x.dispose();
      w.dispose();
      s.dispose();
      if (!active) return;
      setInsights(commerce.customers.map((c, i) => ({ id: c.id, repeatPurchaseConfidence: Math.round(conf[i] ?? 0), segment: (c.last_purchase_at && (Date.now() - new Date(c.last_purchase_at).getTime()) / 86400000 > 120) ? "At Risk Customer" : c.total_spend > 3500 ? "VIP Customer" : "Regular Customer" })));
    };
    if (commerce.customers.length) void run();
    return () => { active = false; };
  }, [commerce.customers]);
  const vip = insights.filter((i) => i.segment === "VIP Customer").length;
  const atRisk = insights.filter((i) => i.segment === "At Risk Customer").length;
  const repeat = insights.filter((i) => i.repeatPurchaseConfidence > 75).length;
  return <AdminLayout title="Machine Learning" commerce={commerce}><div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-4">{[{ k: "VIP Customers", v: vip }, { k: "Predicted Repeat Buyers", v: repeat }, { k: "At Risk Customers", v: atRisk }, { k: "Best Campaign Opportunity", v: "Creator Collection" }].map((box) => <div key={box.k} className={`${box.k === "Best Campaign Opportunity" ? "bg-[#eef2ff]" : "bg-white"} rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5`}><p className="text-[11px] text-[#6b7280] uppercase tracking-[0.05em]">{box.k}</p><p className={`text-[28px] mt-2 font-bold ${box.k === "Best Campaign Opportunity" ? "text-[#4f46e5]" : "text-[#111827]"}`}>{box.v}</p></div>)}</div><div className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5"><p className="text-[#111827] mb-3 font-medium">Customer Classification</p><div className="overflow-x-auto"><table className="w-full"><thead className="bg-[#f9fafb]"><tr><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Customer</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Segment</th><th className="text-left px-4 py-3 text-[11px] uppercase tracking-[0.05em] text-[#6b7280] font-semibold">Confidence</th></tr></thead><tbody>{insights.map((i) => <tr key={i.id} className="border-t border-[#f3f4f6] hover:bg-[#f9fafb]"><td className="px-4 py-3 text-sm">{i.id}</td><td className="px-4 py-3 text-sm"><span className={`inline-flex rounded-full px-[10px] py-[2px] text-xs ${i.segment === "VIP Customer" ? "bg-[#dcfce7] text-[#16a34a]" : i.segment === "At Risk Customer" ? "bg-[#fee2e2] text-[#dc2626]" : "bg-[#f3f4f6] text-[#374151]"}`}>{i.segment}</span></td><td className="px-4 py-3 text-sm">{i.repeatPurchaseConfidence}%</td></tr>)}</tbody></table></div></div></AdminLayout>;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CommerceProvider>
        <AppShell />
      </CommerceProvider>
    </BrowserRouter>
  );
}
