export interface MarketplaceComponent {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number | "Free";
  rating: number;
  reviews: number;
  tags: string[];
  frameworks: ("react" | "nextjs" | "vue" | "svelte" | "html")[];
}

export const marketplaceComponents: MarketplaceComponent[] = [
  {
    id: "neon-auth-01",
    name: "Neon Protocol Auth",
    category: "Login Page",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400&h=300",
    price: "Free",
    rating: 4.9,
    reviews: 128,
    tags: ["Brutalist", "Neon", "Animated"],
    frameworks: ["react", "nextjs", "html"],
  },
  {
    id: "glass-dashboard-02",
    name: "Spectra Workspace",
    category: "Dashboard",
    image: "https://images.unsplash.com/photo-1551288049-bbda48658a7d?auto=format&fit=crop&q=80&w=400&h=300",
    price: 19,
    rating: 4.8,
    reviews: 85,
    tags: ["Glassmorphism", "Analytics", "SaaS"],
    frameworks: ["react", "nextjs", "vue"],
  },
  {
    id: "minimal-hero-03",
    name: "Zenith Hero",
    category: "Hero Sections",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&h=300",
    price: "Free",
    rating: 5.0,
    reviews: 210,
    tags: ["Minimal", "Clean", "SEO"],
    frameworks: ["react", "nextjs", "svelte", "html"],
  },
  {
    id: "brutal-nav-04",
    name: "Architect Nav",
    category: "Navbars",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400&h=300",
    price: "Free",
    rating: 4.7,
    reviews: 56,
    tags: ["Brutalist", "Sticky", "Mega Menu"],
    frameworks: ["nextjs", "html"],
  },
  {
    id: "gradient-pricing-05",
    name: "Vibrant Tiers",
    category: "Pricing Table",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400&h=300",
    price: 12,
    rating: 4.9,
    reviews: 42,
    tags: ["Gradient", "Conversion", "Toggle"],
    frameworks: ["react", "nextjs"],
  },
  {
    id: "dark-emerald-cards-06",
    name: "Emerald Grid",
    category: "Cards",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400&h=300",
    price: "Free",
    rating: 4.6,
    reviews: 94,
    tags: ["Dark", "Emerald", "Grid"],
    frameworks: ["react", "nextjs", "vue", "svelte"],
  }
];
