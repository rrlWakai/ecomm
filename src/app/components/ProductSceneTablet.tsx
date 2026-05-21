import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductSceneTablet() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-8 py-32 bg-neutral-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-20"
      >
        <p className="text-sm uppercase tracking-widest text-black/40 mb-4">iPad Pro</p>
        <h2 className="text-5xl md:text-7xl font-light tracking-tight">
          Creativity, unbound.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="w-full max-w-4xl"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1660100970784-a1cc183a91b7?w=1200&q=90"
          alt="iPad Tablet"
          className="w-full h-auto object-contain"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-16 text-lg md:text-xl text-black/60 font-light text-center max-w-2xl"
      >
        The most advanced display we've ever created.
        <br />
        Designed without distraction.
      </motion.p>
    </section>
  );
}
