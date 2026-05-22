import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

const paymentMethods = ["Visa", "Mastercard", "PayPal", "Apple Pay"];

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="bg-neutral-50 border-t border-black/5">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-lg font-medium tracking-tight">
              TechElite
            </Link>
            <p className="text-sm text-black/50 mt-2 max-w-[200px]">
              Precision-engineered technology for focused creators.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-black/70 hover:bg-black/5 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li>
                <Link
                  to="/categories/laptops"
                  className="hover:text-black transition-colors"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/phones"
                  className="hover:text-black transition-colors"
                >
                  Phones
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/tablets"
                  className="hover:text-black transition-colors"
                >
                  Tablets
                </Link>
              </li>
              <li>
                <Link
                  to="/categories/desktops"
                  className="hover:text-black transition-colors"
                >
                  Desktops
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-black transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-black transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-black transition-colors"
                >
                  Repairs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li>
                <Link
                  to="/about"
                  className="hover:text-black transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-black transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-black transition-colors"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li>
                <Link
                  to="/support"
                  className="hover:text-black transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="hover:text-black transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-black/5 py-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <h2 className="text-xl font-light tracking-tight">
                Stay in the loop.
              </h2>
              <p className="mt-3 text-black/60 max-w-xl">
                Get product updates, drops, and editorial stories delivered to
                your inbox.
              </p>
            </div>
            <div>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-3xl border border-black/10 bg-white p-6 text-center text-sm text-black/70"
                  >
                    You're on the list.
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 sm:flex-row"
                  >
                    <label className="sr-only" htmlFor="footer-email">
                      Email address
                    </label>
                    <input
                      id="footer-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none focus:border-black/20 focus:ring-2 focus:ring-black/5"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-black px-6 py-3 text-sm text-white transition-colors hover:bg-[#111111]"
                    >
                      Subscribe
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-black/40">
          <p>© 2026 TechElite. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-full border border-black/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-black/40"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
