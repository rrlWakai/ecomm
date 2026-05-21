import { Search, ShoppingBag } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <span className="text-lg font-medium tracking-tight">TechElite</span>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <button className="hover:opacity-60 transition-opacity">Laptops</button>
            <button className="hover:opacity-60 transition-opacity">Phones</button>
            <button className="hover:opacity-60 transition-opacity">Tablets</button>
            <button className="hover:opacity-60 transition-opacity">Desktops</button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="hover:opacity-60 transition-opacity">
            <Search className="w-4 h-4" />
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
