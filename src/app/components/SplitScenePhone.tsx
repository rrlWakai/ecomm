import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function SplitScenePhone() {
  return (
    <section className="min-h-screen flex items-center px-8 md:px-16 py-24 bg-white">
      <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-black/40">iPhone Series</p>
            <h2 className="text-5xl md:text-7xl font-light tracking-tight">
              Speed meets clarity.
            </h2>
          </div>
          <p className="text-lg md:text-xl text-black/60 font-light leading-relaxed max-w-md">
            Every detail refined for seamless interaction.
            Pure performance in your hand.
          </p>
          <button className="text-sm font-medium hover:opacity-60 transition-opacity flex items-center gap-2">
            Learn More
            <span className="text-lg">→</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758348844311-30248208fa02?w=800&q=90"
            alt="iPhone Smartphone"
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
