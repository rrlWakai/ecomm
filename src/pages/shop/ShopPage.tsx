import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { EditorialScene } from '../../app/components/EditorialScene';
import { LifestyleSceneDesktop } from '../../app/components/LifestyleSceneDesktop';
import { ProductSceneTablet } from '../../app/components/ProductSceneTablet';
import { SplitScenePhone } from '../../app/components/SplitScenePhone';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../stores/cart.store';
import { useAuthStore } from '../../stores/auth.store';

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  category?: string;
  description?: string;
  tagline?: string;
};

export function ShopPage({ products }: { products: Product[] }) {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const laptop = products.find((p) => p.category === 'laptops') ?? products[0];
  const phone = products.find((p) => p.category === 'phones') ?? products[1] ?? products[0];
  const tablet = products.find((p) => p.category === 'tablets') ?? products[2] ?? products[0];
  const desktop = products.find((p) => p.category === 'desktops') ?? products[3] ?? products[0];

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
    <main className="bg-[#f5f5f3]">
      <section className="px-6 pb-12 pt-24 md:px-10 md:pb-20 md:pt-28">
        <div className="mx-auto max-w-[1240px]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a8a]">Laptop Hero Scene</p>
          <h1 className="mt-3 max-w-4xl text-5xl font-light leading-[0.92] tracking-tight text-[#1a1a1a] md:text-[84px]">Performance Redefined</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#666666] md:text-base">
            {laptop?.tagline ?? laptop?.description ?? 'Built for precision and power.'}
          </p>
          <div className="mt-6 flex gap-3">
            <button className="rounded-full bg-black px-5 py-2 text-xs text-white transition-opacity hover:opacity-85" onClick={() => laptop && void buyNow(laptop)}>Buy Now</button>
            <button className="rounded-full border border-black/20 px-5 py-2 text-xs text-[#1a1a1a] transition-colors hover:border-black/40" onClick={() => window.scrollTo({ top: 1500, behavior: 'smooth' })}>Learn More</button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.95 }}
            className="mt-10 bg-[#efefed] p-4 md:p-7"
          >
            <img src={laptop?.images?.[0]} className="h-[430px] w-full object-cover md:h-[650px]" />
          </motion.div>
        </div>
      </section>

      <EditorialScene title="Technology should disappear into your workflow." subtitle="Not the other way around." />

      {phone && (
        <SplitScenePhone
          title="Precision In Your Palm"
          subtitle={phone.tagline ?? phone.description ?? 'Every detail refined for seamless interaction.'}
          image={phone.images?.[0] ?? ''}
          onLearnMore={() => void addProductToCart(phone)}
        />
      )}

      <EditorialScene title="Built without compromise." subtitle="Every material and curve is intentionally engineered." />

      {tablet && (
        <ProductSceneTablet
          eyebrow="Tablet Showcase Scene"
          title="Creativity, Unbound."
          description={tablet.tagline ?? tablet.description ?? 'Designed without distraction.'}
          image={tablet.images?.[0] ?? ''}
        />
      )}

      {desktop && (
        <LifestyleSceneDesktop
          title="Where Focus Lives."
          subtitle={desktop.tagline ?? desktop.description ?? 'Precision-engineered displays for the work that matters.'}
          image={desktop.images?.[0] ?? ''}
        />
      )}

      <section className="bg-[#080b12] px-6 py-16 text-white md:px-10 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <h3 className="text-4xl font-light tracking-tight md:text-5xl">Product Explorer Experience</h3>
          <div className="mt-2 flex gap-4 text-[10px] uppercase tracking-[0.18em] text-white/60">
            <span>Laptops</span><span>Phones</span><span>Tablets</span><span>Desktops</span>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
            <img src={laptop?.images?.[0]} className="h-[240px] w-full object-cover md:h-[310px]" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Laptops</p>
              <p className="mt-2 text-4xl font-light tracking-tight">{laptop?.name}</p>
              <p className="mt-2 max-w-md text-sm text-white/65">{laptop?.tagline ?? laptop?.description ?? 'Ultra-thin productivity engineered for creators and engineers.'}</p>
              <div className="mt-5 flex gap-2">
                <button className="border border-white/30 px-4 py-2 text-sm transition-opacity hover:opacity-80" onClick={() => laptop && void addProductToCart(laptop)}>Add to Cart</button>
                <button className="border border-white/30 px-4 py-2 text-sm transition-opacity hover:opacity-80" onClick={() => laptop && void buyNow(laptop)}>Buy Now</button>
                <button className="border border-white/30 px-4 py-2 text-sm transition-opacity hover:opacity-80 disabled:opacity-45" onClick={() => laptop && void addWishlist(laptop.id)} disabled={!user}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f3] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 md:grid-cols-3">
            {products.slice(0, 3).map((p, idx) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: idx * 0.03 }}
                className="group"
              >
                <img src={p.images?.[0]} className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" />
                <div className="mt-4 border-t border-black/10 pt-4">
                  <h4 className="text-3xl font-light tracking-tight">{p.name}</h4>
                  <p className="mt-2 text-sm text-[#666666]">PHP {p.price}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="border border-black/20 px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-black/35" onClick={() => void addProductToCart(p)}>Add to Cart</button>
                    <button className="border border-black/20 px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-black/35" onClick={() => void buyNow(p)}>Buy Now</button>
                    <button className="border border-black/20 px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-black/35 disabled:opacity-40" onClick={() => void addWishlist(p.id)} disabled={!user}>Save</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

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
