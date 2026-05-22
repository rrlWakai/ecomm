import { motion } from "motion/react";

type LifestyleSceneDesktopProps = {
  title: string;
  subtitle: string;
  image: string;
};

export function LifestyleSceneDesktop({ title, subtitle, image }: LifestyleSceneDesktopProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center text-white max-w-4xl"
      >
        <p className="text-sm uppercase tracking-widest opacity-90 mb-6">
          Your Workspace
        </p>
        <h2 className="text-6xl md:text-8xl font-light tracking-tight mb-8">
          {title}
        </h2>
        <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed">
          {subtitle}
        </p>
      </motion.div>
    </section>
  );
}
