import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductSceneLaptop() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-8 pt-32 pb-24 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-4">
          PERFORMANCE REDEFINED
        </h1>
        <p className="text-lg md:text-xl text-black/50 font-light">
          Built for precision and power
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="w-full max-w-5xl"
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1640551497504-ec05b9e50b50?w=1400&q=90"
          alt="MacBook Laptop"
          className="w-full h-auto object-contain"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-12 flex gap-6"
      >
        <button className="px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-black/80 transition-colors">
          Shop Now
        </button>
        <button className="px-8 py-3 border border-black/20 text-sm font-medium rounded-full hover:border-black/40 transition-colors">
          Learn More
        </button>
      </motion.div>
    </section>
  );
}
