import { motion } from 'motion/react';

type EditorialSceneProps = {
  title: string;
  subtitle: string;
};

export function EditorialScene({ title, subtitle }: EditorialSceneProps) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-8 py-32 bg-neutral-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-3xl"
      >
        <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
          {title}
        </h2>
        <p className="mt-8 text-lg md:text-xl text-black/50 font-light">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
