import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-black/5 px-8 py-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-sm font-medium mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><Link to="/categories/laptops" className="hover:text-black transition-colors">Laptops</Link></li>
              <li><Link to="/categories/phones" className="hover:text-black transition-colors">Phones</Link></li>
              <li><Link to="/categories/tablets" className="hover:text-black transition-colors">Tablets</Link></li>
              <li><Link to="/categories/desktops" className="hover:text-black transition-colors">Desktops</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link to="/support" className="hover:text-black transition-colors">Warranty</Link></li>
              <li><Link to="/support" className="hover:text-black transition-colors">Repairs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><Link to="/about" className="hover:text-black transition-colors">About</Link></li>
              <li><Link to="/about" className="hover:text-black transition-colors">Careers</Link></li>
              <li><Link to="/about" className="hover:text-black transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><Link to="/support" className="hover:text-black transition-colors">Privacy</Link></li>
              <li><Link to="/support" className="hover:text-black transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-black/5 text-sm text-black/40">
          <p>&copy; 2026 TechElite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
