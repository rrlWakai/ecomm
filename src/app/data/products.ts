import type { Product } from "../types/catalog";

export const products: Product[] = [
  {
    id: "laptop-aurora-x14",
    slug: "aurora-x14",
    name: "Aurora X14",
    category: "laptops",
    brand: "TechElite",
    price: 1999,
    tagline: "Performance Redefined",
    description: "Ultra-thin productivity laptop tuned for creators and engineers.",
    specs: ["MZ-4 Neural Core", "14.2-inch Liquid Retina", "22-hour battery", "1.28kg"],
    highlights: ["Powerful M-Series Performance", "All-Day Battery Life", "Retina-Level Clarity"],
    images: [
      "https://images.unsplash.com/photo-1640551497504-ec05b9e50b50?w=1400&q=90",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1400&q=90",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=1400&q=90"
    ],
    featured: true
  },
  {
    id: "phone-noir-1",
    slug: "noir-1",
    name: "Noir One",
    category: "phones",
    brand: "TechElite",
    price: 1099,
    tagline: "Precision In Your Palm",
    description: "Flagship camera, titanium frame, and cinematic OLED display.",
    specs: ["6.7-inch OLED", "Triple camera", "A19 Pro chip", "5G + Wi-Fi 7"],
    highlights: ["Studio-Grade Camera", "Adaptive OLED Brightness", "Titanium Build"],
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&q=90",
      "https://images.unsplash.com/photo-1510557880182-3f8e507fa0f9?w=1400&q=90",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1400&q=90"
    ],
    featured: true
  },
  {
    id: "tablet-airtab-pro",
    slug: "airtab-pro",
    name: "AirTab Pro",
    category: "tablets",
    brand: "TechElite",
    price: 1299,
    tagline: "Sketch. Cut. Ship.",
    description: "Creator-first tablet built for illustration, editing, and review.",
    specs: ["13-inch display", "Pen latency 2ms", "16GB RAM", "1TB storage"],
    highlights: ["Low-Latency Pen Input", "Desktop-Class Apps", "Ultra Wide Color"],
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1400&q=90",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1400&q=90",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1400&q=90"
    ]
  },
  {
    id: "desktop-forge-station",
    slug: "forge-station",
    name: "Forge Station",
    category: "desktops",
    brand: "TechElite",
    price: 3499,
    tagline: "Build Without Limits",
    description: "A modular desktop crafted for simulation, design, and post-production.",
    specs: ["48-core GPU", "3D vapor cooling", "128GB unified memory", "10Gb ethernet"],
    highlights: ["Extreme Multicore Speed", "Silent Thermal Envelope", "Expandable Modules"],
    images: [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=1400&q=90",
      "https://images.unsplash.com/photo-1593640408182-31c228c4c4c1?w=1400&q=90",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1400&q=90"
    ]
  }
];

export const promoSlides = [
  { title: "New Collection", subtitle: "Precision devices designed for deep work.", image: products[0].images[0] },
  { title: "Ultra Performance Series", subtitle: "Desktop-class power in minimal forms.", image: products[3].images[0] },
  { title: "Back To School Deals", subtitle: "Creator bundles for students and educators.", image: products[2].images[1] },
  { title: "Creator Edition", subtitle: "Color-true displays and studio-grade cameras.", image: products[1].images[1] }
];
