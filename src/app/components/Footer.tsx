export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-black/5 px-8 py-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <h3 className="text-sm font-medium mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><button className="hover:text-black transition-colors">Laptops</button></li>
              <li><button className="hover:text-black transition-colors">Phones</button></li>
              <li><button className="hover:text-black transition-colors">Tablets</button></li>
              <li><button className="hover:text-black transition-colors">Desktops</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><button className="hover:text-black transition-colors">Contact Us</button></li>
              <li><button className="hover:text-black transition-colors">Warranty</button></li>
              <li><button className="hover:text-black transition-colors">Repairs</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><button className="hover:text-black transition-colors">About</button></li>
              <li><button className="hover:text-black transition-colors">Careers</button></li>
              <li><button className="hover:text-black transition-colors">Press</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-black/60">
              <li><button className="hover:text-black transition-colors">Privacy</button></li>
              <li><button className="hover:text-black transition-colors">Terms</button></li>
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
