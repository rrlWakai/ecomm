import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { useCartStore } from '../../stores/cart.store';

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  category?: string;
  description?: string;
  tagline?: string;
  featured?: boolean;
};

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`px-6 md:px-10 ${className}`}>{children}</section>;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value);
}

export function ShopPage({ products }: { products: Product[] }) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.25], [0, -72]);
  const cinematicScale = useTransform(scrollYProgress, [0.08, 0.35], [1.02, 1]);

  const laptop = products.find((p) => p.category === 'laptops') ?? products[0];
  const phone = products.find((p) => p.category === 'phones') ?? products[1] ?? products[0];
  const tablet = products.find((p) => p.category === 'tablets') ?? products[2] ?? products[0];
  const desktop = products.find((p) => p.category === 'desktops') ?? products[3] ?? products[0];

  const explorerProducts = useMemo(() => products.slice(0, 4), [products]);
  const spotlight = useMemo(() => products.find((p) => p.featured) ?? products[0], [products]);

  const addWishlist = async (productId: string) => {
    if (!user) return;
    await supabase.from('wishlist').upsert({ user_id: user.id, product_id: productId }, { onConflict: 'user_id,product_id' });
  };

  const addProductToCart = async (product: Product) => {
    await addItem({
      productId: product.id,
      quantity: 1,
      price: Number(product.price),
      name: product.name,
      image: product.images?.[0] ?? ''
    });
  };

  const buyNow = async (product: Product) => {
    await addProductToCart(product);
    navigate('/checkout');
  };

  return (
    <main className="bg-[#f4f4f2] text-[#141414]">
      <SectionShell className="pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.28em] text-black/45">Laptop And Icon</p>
            <h1 className="mt-6 max-w-5xl text-[56px] leading-[0.92] tracking-[-0.03em] md:text-[96px]">Performance Redefined.</h1>
            <p className="mt-5 max-w-2xl text-[18px] text-black/58 md:text-[22px]">
              Luxury technology for modern living.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button type="button" className="rounded-full bg-black px-7 py-3 text-[13px] tracking-[0.04em] text-white transition-opacity hover:opacity-85" onClick={() => laptop && void buyNow(laptop)}>
                Shop Collection
              </button>
              <button type="button" className="rounded-full border border-black/20 px-7 py-3 text-[13px] tracking-[0.04em] transition-colors hover:border-black/45" onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}>
                Explore Products
              </button>
            </div>
          </Reveal>
          <motion.div style={{ y: heroParallax }} className="mt-14 overflow-hidden bg-[#ecedec] p-4 md:p-8">
            <img src={laptop?.images?.[0]} alt={laptop?.name ?? 'Laptop hero'} className="h-[420px] w-full object-cover md:h-[710px]" />
          </motion.div>
        </div>
      </SectionShell>

      <SectionShell className="bg-[#e9e9e7] py-20 md:py-28">
        <div className="mx-auto max-w-[1480px]">
          <Reveal>
            <p className="mx-auto max-w-4xl text-center text-[44px] leading-[1.04] tracking-[-0.02em] text-[#4c4c4c] md:text-[64px]">
              Technology should disappear into your workflow.
            </p>
          </Reveal>
          <motion.div style={{ scale: cinematicScale }} className="mt-14 overflow-hidden">
            <img src={desktop?.images?.[0] ?? laptop?.images?.[0]} alt="Immersive product showcase" className="h-[360px] w-full object-cover md:h-[720px]" />
          </motion.div>
        </div>
      </SectionShell>

      <SectionShell className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[0.78fr_1.22fr] md:items-end md:gap-14">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.26em] text-black/45">Phone Series Scene</p>
            <h2 className="mt-6 text-[44px] leading-[0.96] tracking-[-0.02em] md:text-[64px]">Precision In Your Palm</h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-black/60 md:text-[18px]">
              {phone?.tagline ?? phone?.description ?? 'An optimized composition engineered to stay discreet while you move fast.'}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" className="inline-flex items-center gap-2 border-b border-black/35 pb-1 text-[13px] tracking-[0.04em]" onClick={() => phone && void addProductToCart(phone)}>
                Add Phone <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" className="text-[13px] tracking-[0.04em] text-black/55 hover:text-black" onClick={() => phone && void buyNow(phone)}>
                Buy Now
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative">
              <img src={phone?.images?.[0]} alt={phone?.name ?? 'Phone'} className="h-[420px] w-full object-cover md:h-[600px]" />
              <img src={phone?.images?.[1] ?? phone?.images?.[0]} alt={`${phone?.name ?? 'Phone'} detail`} className="absolute -bottom-10 left-4 h-44 w-32 border border-black/10 object-cover shadow-[0_20px_50px_rgba(0,0,0,0.18)] md:-bottom-14 md:left-10 md:h-56 md:w-44" />
            </div>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell className="bg-[#ececea] py-20 md:py-28">
        <div className="mx-auto max-w-[1320px] text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.28em] text-black/45">Tablet Showcase Scene</p>
            <h2 className="mt-6 text-[46px] leading-[0.97] tracking-[-0.02em] md:text-[72px]">Creativity, Unbound.</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <img src={tablet?.images?.[0]} alt={tablet?.name ?? 'Tablet'} className="mx-auto mt-12 h-[440px] w-full max-w-[900px] object-cover md:h-[760px]" />
          </Reveal>
        </div>
      </SectionShell>

      <section className="relative h-[340px] overflow-hidden bg-[#7f8286] md:h-[470px]">
        <img src={desktop?.images?.[1] ?? desktop?.images?.[0]} alt={desktop?.name ?? 'Desktop'} className="h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute bottom-10 left-6 md:bottom-14 md:left-10">
          <Reveal>
            <h2 className="text-[44px] leading-none tracking-[-0.02em] text-white md:text-[64px]">Where Focus Lives.</h2>
          </Reveal>
        </div>
      </section>

      <SectionShell className="bg-[#07090d] py-18 text-white md:py-24">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h3 className="text-[40px] leading-[0.98] tracking-[-0.02em] md:text-[58px]">Premium Product Explorer</h3>
          </Reveal>
          <div className="mt-12 space-y-20">
            {explorerProducts.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 0.05}>
                <article className={`grid gap-8 md:items-center ${idx % 2 === 0 ? 'md:grid-cols-[1.08fr_0.92fr]' : 'md:grid-cols-[0.92fr_1.08fr] md:[&>*:first-child]:order-2'}`}>
                  <img src={product.images?.[0]} alt={product.name} className="h-[280px] w-full object-cover md:h-[420px]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">{product.category ?? 'Collection'}</p>
                    <h4 className="mt-5 text-[38px] leading-[0.98] tracking-[-0.02em] md:text-[54px]">{product.name}</h4>
                    <p className="mt-4 max-w-md text-[16px] text-white/70 md:text-[18px]">{product.tagline ?? product.description ?? 'Crafted for creators, engineered for speed.'}</p>
                    <p className="mt-7 text-[22px] tracking-[-0.01em]">{formatPrice(product.price)}</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <button type="button" className="rounded-full border border-white/35 px-5 py-2 text-[13px] tracking-[0.04em] transition-opacity hover:opacity-80" onClick={() => void addProductToCart(product)}>Add to Cart</button>
                      <button type="button" className="rounded-full bg-white px-5 py-2 text-[13px] tracking-[0.04em] text-black transition-opacity hover:opacity-85" onClick={() => void buyNow(product)}>Buy Now</button>
                      <button type="button" className="rounded-full border border-white/20 px-5 py-2 text-[13px] tracking-[0.04em] text-white/70 transition-colors hover:text-white disabled:opacity-50" disabled={!user} onClick={() => void addWishlist(product.id)}>Save</button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionShell>

      {spotlight && (
        <SectionShell className="bg-[#090f1a] py-18 text-white md:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <Reveal>
              <img src={spotlight.images?.[1] ?? spotlight.images?.[0]} alt={spotlight.name} className="h-[300px] w-full object-cover md:h-[500px]" />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">New Collection Spotlight</p>
              <h3 className="mt-5 text-[42px] leading-[0.96] tracking-[-0.02em] md:text-[64px]">{spotlight.name}</h3>
              <p className="mt-4 text-[16px] text-white/70 md:text-[18px]">{spotlight.description ?? spotlight.tagline ?? 'Distinctive devices for people who value craft and momentum.'}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="rounded-full bg-white px-6 py-2 text-[13px] tracking-[0.04em] text-black transition-opacity hover:opacity-85" onClick={() => void buyNow(spotlight)}>Shop Featured</button>
                <button type="button" className="rounded-full border border-white/35 px-6 py-2 text-[13px] tracking-[0.04em] transition-opacity hover:opacity-80" onClick={() => void addProductToCart(spotlight)}>Add to Cart</button>
              </div>
            </Reveal>
          </div>
        </SectionShell>
      )}

      <SectionShell className="bg-[#f7f7f5] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-3">
          {[
            { title: 'Fast Delivery', body: 'Priority dispatch with tracked premium handling across key cities.' },
            { title: 'Warranty', body: 'Comprehensive device protection with direct service escalation.' },
            { title: 'Premium Support', body: 'Concierge setup and expert support whenever work cannot wait.' }
          ].map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.05}>
              <article className="border-t border-black/15 pt-6">
                <h4 className="text-[30px] leading-none tracking-[-0.02em] md:text-[42px]">{item.title}</h4>
                <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-black/62 md:text-[18px]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionShell>

      <footer className="border-t border-black/10 px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-[1240px] gap-8 text-sm text-[#666666] md:grid-cols-4">
          <div><p className="mb-3 text-[#1a1a1a]">Shop</p><p>Laptops</p><p>Phones</p><p>Tablets</p><p>Desktops</p></div>
          <div><p className="mb-3 text-[#1a1a1a]">Support</p><p>Contact Us</p><p>Warranty</p><p>Repairs</p></div>
          <div><p className="mb-3 text-[#1a1a1a]">Company</p><p>About</p><p>Careers</p><p>Press</p></div>
          <div><p className="mb-3 text-[#1a1a1a]">Legal</p><p>Privacy</p><p>Terms</p></div>
        </div>
        <p className="mx-auto mt-10 max-w-[1240px] text-xs text-[#8a8a8a]">© 2026 TechElite. All rights reserved.</p>
      </footer>
    </main>
  );
}
