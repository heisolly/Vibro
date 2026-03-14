import { Category, Prompt } from "./types";

// ─── Categories ────────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "1",
    name: "Landing Pages",
    slug: "landing-pages",
    icon: "🚀",
    description: "Modern SaaS, startup, and product landing page prompts",
    count: 6,
  },
  {
    id: "2",
    name: "Navigation",
    slug: "navigation",
    icon: "🧭",
    description: "Navbars, mega menus, sidebars, and breadcrumbs",
    count: 5,
  },
  {
    id: "3",
    name: "Dashboards",
    slug: "dashboards",
    icon: "📊",
    description: "Admin panels, analytics dashboards, and data views",
    count: 4,
  },
  {
    id: "4",
    name: "E-commerce",
    slug: "ecommerce",
    icon: "🛒",
    description: "Product pages, carts, checkout flows, and storefronts",
    count: 4,
  },
  {
    id: "5",
    name: "Authentication",
    slug: "authentication",
    icon: "🔐",
    description: "Login, signup, forgot password, and OTP pages",
    count: 4,
  },
  {
    id: "6",
    name: "Forms",
    slug: "forms",
    icon: "📝",
    description: "Contact forms, multi-step wizards, and survey layouts",
    count: 3,
  },
  {
    id: "7",
    name: "Pricing",
    slug: "pricing",
    icon: "💰",
    description: "Pricing tables, comparison cards, and plan selectors",
    count: 3,
  },
  {
    id: "8",
    name: "Animations",
    slug: "animations",
    icon: "✨",
    description: "Scroll animations, hover effects, and micro-interactions",
    count: 3,
  },
  {
    id: "9",
    name: "Blog & Content",
    slug: "blog",
    icon: "📰",
    description: "Blog layouts, article pages, and content grids",
    count: 3,
  },
  {
    id: "10",
    name: "Portfolio",
    slug: "portfolio",
    icon: "🎨",
    description: "Personal portfolios, agency sites, and showcase pages",
    count: 3,
  },
];

// ─── Prompts ───────────────────────────────────────────────────────────────────

export const prompts: Prompt[] = [
  // ── Landing Pages ──────────────────────────────────────────────
  {
    id: "lp-1",
    title: "Modern SaaS Landing Page",
    slug: "modern-saas-landing-page",
    categoryId: "1",
    categorySlug: "landing-pages",
    description:
      "A full-featured SaaS landing page with hero, features, pricing, testimonials, and FAQ.",
    promptText: `ROLE
You are an expert frontend developer specializing in modern web design.

TASK
Create a modern SaaS landing page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript (vanilla)

SECTIONS
1. Hero section with headline, sub-headline, CTA button, and hero image/illustration placeholder
2. Logos/trust bar with 5 partner logos (use placeholder SVGs)
3. Features grid — 6 feature cards with icon, title, and description
4. How it works — 3-step horizontal timeline
5. Pricing section — 3-tier pricing cards (Free, Pro, Enterprise) with toggle for monthly/yearly
6. Testimonials — 3 testimonial cards with avatar, name, role, and quote
7. FAQ accordion — 5 collapsible questions
8. CTA banner — final call-to-action with email input
9. Footer with links, social icons, and copyright

STYLE
- Clean, minimal, modern SaaS aesthetic
- Soft shadows, rounded corners (lg/xl)
- Gradient accents (indigo → purple)
- Smooth scroll-reveal animations on each section (use IntersectionObserver)
- Fully responsive (mobile-first)
- Dark/light feel — white background, dark text

OUTPUT
Return a single, complete, self-contained HTML file. All CSS via Tailwind CDN, all JS inline.`,
    previewImage: "/previews/saas-landing.svg",
    tags: ["saas", "landing", "hero", "pricing", "testimonials", "responsive"],
    featured: true,
    createdAt: "2026-01-15",
  },
  {
    id: "lp-2",
    title: "Startup Launch Page",
    slug: "startup-launch-page",
    categoryId: "1",
    categorySlug: "landing-pages",
    description:
      "A bold, single-page startup launch page with waitlist signup and countdown.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a startup launch / coming-soon page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

FEATURES
1. Full-screen hero with bold headline and animated gradient background
2. Countdown timer (days, hours, minutes, seconds) — set to 30 days from now
3. Email waitlist form with validation
4. Social proof counter ("1,247 people already signed up")
5. Feature preview — 3 cards showing upcoming features
6. Social links (Twitter, LinkedIn, GitHub)
7. Footer with copyright

STYLE
- Dark theme (gray-900 background, white text)
- Neon accent color (cyan/emerald glow)
- Bold typography
- Subtle floating particle animation in background (CSS only)
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/startup-launch.svg",
    tags: ["startup", "launch", "countdown", "waitlist", "dark-theme"],
    featured: true,
    createdAt: "2026-01-20",
  },
  {
    id: "lp-3",
    title: "Mobile App Landing Page",
    slug: "mobile-app-landing-page",
    categoryId: "1",
    categorySlug: "landing-pages",
    description:
      "A landing page designed to promote a mobile application with app store links.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a mobile app landing page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Hero with phone mockup placeholder, headline, description, App Store & Google Play buttons
2. Features — alternating left/right sections (3 features) with phone mockup and text
3. Stats section — 4 animated counters (Downloads, Users, Rating, Countries)
4. Screenshots carousel — horizontal scroll of 5 phone screenshots (use placeholder images)
5. Testimonials — user reviews with star ratings
6. Download CTA — final section with download buttons
7. Footer

STYLE
- Light, vibrant, modern
- Primary color: blue-600 with purple accents
- Rounded corners, soft shadows
- Smooth animations on scroll
- Mobile-first responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/mobile-app.svg",
    tags: ["mobile", "app", "landing", "download", "showcase"],
    featured: false,
    createdAt: "2026-02-01",
  },
  {
    id: "lp-4",
    title: "AI Product Landing Page",
    slug: "ai-product-landing-page",
    categoryId: "1",
    categorySlug: "landing-pages",
    description:
      "A futuristic landing page for an AI/ML product with animated elements.",
    promptText: `ROLE
You are an expert frontend developer with a passion for futuristic design.

TASK
Create a landing page for an AI/ML product.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Hero with animated gradient mesh background, headline "The Future of AI is Here", demo CTA
2. Product demo section with terminal-style animation showing AI processing text
3. Features — 4 cards with icons: Speed, Accuracy, Security, Scalability
4. Integration logos bar
5. Pricing — 3 tiers
6. Code example section — syntax-highlighted code block showing API usage
7. CTA and footer

STYLE
- Dark futuristic theme (gray-950 / black)
- Accent colors: cyan, purple, pink gradients
- Glowing effects on hover
- Animated gradient borders
- Monospace font for code sections
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/ai-product.svg",
    tags: ["ai", "ml", "futuristic", "dark", "tech", "landing"],
    featured: true,
    createdAt: "2026-02-10",
  },
  {
    id: "lp-5",
    title: "Agency Portfolio Landing",
    slug: "agency-portfolio-landing",
    categoryId: "1",
    categorySlug: "landing-pages",
    description: "A creative agency landing page with project showcase and team section.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a creative agency portfolio landing page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Hero — full-screen with video background placeholder, agency name, tagline
2. Services — 4 service cards with hover animations
3. Portfolio grid — 6 project cards with image, title, category (masonry-style layout)
4. About / stats — company info with animated counters
5. Team — 4 team member cards with photo placeholder, name, role, social links
6. Client logos
7. Contact form
8. Footer

STYLE
- Elegant, bold, high-contrast
- Black & white with one accent color (orange or coral)
- Large typography
- Smooth page transitions feel
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/agency.svg",
    tags: ["agency", "portfolio", "creative", "team", "services"],
    featured: false,
    createdAt: "2026-02-15",
  },
  {
    id: "lp-6",
    title: "Newsletter / Blog Landing",
    slug: "newsletter-blog-landing",
    categoryId: "1",
    categorySlug: "landing-pages",
    description: "Clean landing page for a newsletter or blog with subscription CTA.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a newsletter/blog subscription landing page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Hero with large headline, description, email subscribe form
2. Featured articles — 3 article cards with image, title, excerpt, date
3. Topics/categories pills
4. Social proof — "Join 10,000+ readers"
5. Benefits — why subscribe (3 items with icons)
6. Recent issues preview
7. Footer with unsubscribe note

STYLE
- Clean, editorial, minimal
- Serif headings, sans-serif body
- Warm background (cream/warm-gray)
- Subtle borders, no harsh shadows
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/newsletter.svg",
    tags: ["newsletter", "blog", "subscription", "editorial", "minimal"],
    featured: false,
    createdAt: "2026-02-20",
  },

  // ── Navigation ─────────────────────────────────────────────────
  {
    id: "nav-1",
    title: "Glassmorphism Navbar",
    slug: "glassmorphism-navbar",
    categoryId: "2",
    categorySlug: "navigation",
    description:
      "A modern glassmorphism navigation bar with blur effect and mobile menu.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a modern glassmorphism navigation bar.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

REQUIREMENTS
- Transparent blurred background (backdrop-blur, bg-white/10)
- Fixed/sticky position at top
- Logo on the left
- Navigation links on the right (Home, Features, Pricing, About, Contact)
- Active link indicator
- CTA button ("Get Started") on far right
- Responsive hamburger menu for mobile
- Smooth slide-down mobile menu with animation
- Subtle border-bottom (white/20)

STYLE
- Glassmorphism aesthetic
- Works on both light and dark backgrounds
- Smooth transitions on hover
- Modern SaaS style

OUTPUT
Return a single complete HTML file with a sample hero section behind the navbar to demonstrate the glass effect.`,
    previewImage: "/previews/glass-navbar.svg",
    tags: ["navbar", "glassmorphism", "responsive", "sticky", "blur"],
    featured: true,
    createdAt: "2026-01-10",
  },
  {
    id: "nav-2",
    title: "Mega Menu Navbar",
    slug: "mega-menu-navbar",
    categoryId: "2",
    categorySlug: "navigation",
    description:
      "A feature-rich mega menu with categorized links, images, and CTAs.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a navbar with a mega menu dropdown.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

REQUIREMENTS
- Main nav links: Products, Solutions, Resources, Pricing, Company
- "Products" triggers a mega menu with:
  - 3 columns of categorized links (Analytics, Automation, Integration — 4 links each)
  - Featured product card with image placeholder
  - "View all products" link
- Smooth open/close animation (fade + slide down)
- Close on click outside or Escape key
- Responsive: collapses to hamburger with accordion sub-menus on mobile
- Accessible: proper aria attributes, keyboard navigation

STYLE
- Clean, enterprise SaaS style
- White background mega menu with subtle shadow
- Hover highlights on links
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/mega-menu.svg",
    tags: ["navbar", "mega-menu", "dropdown", "enterprise", "accessible"],
    featured: false,
    createdAt: "2026-01-12",
  },
  {
    id: "nav-3",
    title: "Animated Sidebar Nav",
    slug: "animated-sidebar-nav",
    categoryId: "2",
    categorySlug: "navigation",
    description:
      "A collapsible sidebar navigation with icons, tooltips, and smooth transitions.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create an animated collapsible sidebar navigation.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

REQUIREMENTS
- Sidebar on the left side of the page
- Collapsed state: shows only icons (width 64px)
- Expanded state: shows icons + labels (width 256px)
- Toggle button to expand/collapse with smooth animation
- Navigation items: Dashboard, Analytics, Users, Products, Orders, Settings
- Each item has an SVG icon and label
- Active item highlighted
- Tooltip on hover when collapsed
- User avatar and name at bottom
- Responsive: overlay sidebar on mobile with backdrop

STYLE
- Dark sidebar (gray-900) with light text
- Subtle hover backgrounds
- Smooth width transition (300ms ease)
- Modern dashboard style

OUTPUT
Return a single complete HTML file with a sample main content area.`,
    previewImage: "/previews/sidebar-nav.svg",
    tags: ["sidebar", "navigation", "collapsible", "dashboard", "animated"],
    featured: false,
    createdAt: "2026-01-18",
  },
  {
    id: "nav-4",
    title: "Sticky Navbar with Scroll Effect",
    slug: "sticky-scroll-navbar",
    categoryId: "2",
    categorySlug: "navigation",
    description:
      "A navbar that changes appearance on scroll — transparent to solid.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a sticky navbar that transforms on scroll.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

REQUIREMENTS
- Initially transparent with white text (over a hero image)
- On scroll (past 100px): background becomes solid white, text turns dark, adds shadow
- Smooth transition between states (300ms)
- Logo changes color on scroll too
- Navigation links: Home, About, Services, Portfolio, Contact
- CTA button
- Responsive hamburger menu
- Active section highlighting as user scrolls (scroll spy)

STYLE
- Elegant, professional
- Smooth transitions
- Works with hero section background image

OUTPUT
Return a single complete HTML file with multiple sections to demonstrate scroll spy.`,
    previewImage: "/previews/sticky-navbar.svg",
    tags: ["navbar", "sticky", "scroll", "transparent", "scroll-spy"],
    featured: false,
    createdAt: "2026-02-05",
  },
  {
    id: "nav-5",
    title: "Bottom Tab Navigation (Mobile)",
    slug: "bottom-tab-navigation",
    categoryId: "2",
    categorySlug: "navigation",
    description:
      "A mobile bottom tab navigation bar with icons and active state.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a mobile bottom tab navigation bar.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

REQUIREMENTS
- Fixed at bottom of viewport
- 5 tabs: Home, Search, Add (center, elevated), Notifications, Profile
- Center tab has a floating action button style (elevated, larger, accent color)
- Active tab shows filled icon + accent color + label
- Inactive tabs show outline icon + gray
- Smooth scale animation on tap
- Badge on Notifications tab (red dot with number)
- Hide on scroll down, show on scroll up
- Safe area padding for iOS

STYLE
- iOS/Android native feel
- White background, subtle top border
- Rounded icons
- Max width 480px, centered

OUTPUT
Return a single complete HTML file with sample page content.`,
    previewImage: "/previews/bottom-tab.svg",
    tags: ["mobile", "navigation", "bottom-tab", "app", "responsive"],
    featured: false,
    createdAt: "2026-02-12",
  },

  // ── Dashboards ─────────────────────────────────────────────────
  {
    id: "dash-1",
    title: "Analytics Dashboard",
    slug: "analytics-dashboard",
    categoryId: "3",
    categorySlug: "dashboards",
    description:
      "A comprehensive analytics dashboard with charts, stats, and data tables.",
    promptText: `ROLE
You are an expert frontend developer specializing in dashboard UIs.

TASK
Create an analytics dashboard page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript
- Chart.js (via CDN) for charts

LAYOUT
- Sidebar navigation (collapsible) on the left
- Top header bar with search, notifications bell, user avatar
- Main content area

MAIN CONTENT SECTIONS
1. Greeting header: "Good morning, Alex" with date
2. Stats row — 4 cards: Total Revenue ($45,231), Users (2,350), Orders (1,247), Conversion (3.2%)
   - Each with icon, value, percentage change indicator (green up / red down)
3. Revenue chart — line chart showing last 12 months
4. Traffic sources — doughnut chart (Direct, Organic, Social, Referral)
5. Recent orders table — columns: Order ID, Customer, Product, Amount, Status (badge), Date
   - 8 rows of sample data
6. Top products — horizontal bar chart

STYLE
- Light theme with white cards on gray-50 background
- Rounded-xl cards with subtle shadows
- Color-coded status badges (Completed=green, Pending=yellow, Cancelled=red)
- Responsive (cards stack on mobile)

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/analytics-dash.svg",
    tags: ["dashboard", "analytics", "charts", "table", "admin"],
    featured: true,
    createdAt: "2026-01-25",
  },
  {
    id: "dash-2",
    title: "Project Management Dashboard",
    slug: "project-management-dashboard",
    categoryId: "3",
    categorySlug: "dashboards",
    description: "A Kanban-style project management dashboard with task cards.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a project management / Kanban dashboard.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

LAYOUT
- Top navbar with project name, search, filters, user avatar
- Main content: horizontal Kanban board

KANBAN COLUMNS
1. To Do (4 cards)
2. In Progress (3 cards)
3. In Review (2 cards)
4. Done (3 cards)

EACH TASK CARD
- Title
- Description (truncated)
- Priority badge (High=red, Medium=yellow, Low=green)
- Assignee avatar(s)
- Due date
- Subtask progress bar
- Tags/labels

FEATURES
- Drag and drop feel (visual only is fine)
- "Add task" button in each column
- Column task count
- Horizontal scroll on mobile

STYLE
- Clean, modern, Trello/Linear inspired
- Soft shadows, rounded corners
- Color-coded priorities
- Gray-50 background
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/kanban-dash.svg",
    tags: ["dashboard", "kanban", "project", "tasks", "management"],
    featured: false,
    createdAt: "2026-02-01",
  },
  {
    id: "dash-3",
    title: "CRM Dashboard",
    slug: "crm-dashboard",
    categoryId: "3",
    categorySlug: "dashboards",
    description:
      "A customer relationship management dashboard with pipeline view.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a CRM dashboard.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript
- Chart.js (via CDN)

SECTIONS
1. Top stats: Total Contacts, Active Deals, Revenue This Month, Win Rate
2. Sales pipeline — horizontal funnel/stages: Lead → Qualified → Proposal → Negotiation → Closed
   - Show count and value at each stage
3. Recent activities feed — timeline with icons (call, email, meeting, deal)
4. Revenue chart — bar chart by month
5. Top deals table — 5 rows with deal name, company, value, stage, probability
6. Upcoming tasks list

STYLE
- Professional, clean
- Blue primary color scheme
- Card-based layout
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/crm-dash.svg",
    tags: ["dashboard", "crm", "sales", "pipeline", "business"],
    featured: false,
    createdAt: "2026-02-08",
  },
  {
    id: "dash-4",
    title: "Dark Mode Admin Dashboard",
    slug: "dark-admin-dashboard",
    categoryId: "3",
    categorySlug: "dashboards",
    description:
      "A sleek dark-themed admin dashboard with sidebar navigation and widgets.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a dark mode admin dashboard.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript
- Chart.js (via CDN)

LAYOUT
- Dark sidebar with logo, nav items, user info
- Dark top bar with search, notification bell, theme toggle
- Main content on dark background

SECTIONS
1. Stat cards (4) with gradient backgrounds
2. Line + area chart for visitor analytics
3. Pie chart for browser usage
4. Data table with sorting indicators (Users list)
5. Activity log
6. Server status cards with progress bars

STYLE
- Full dark theme: backgrounds gray-900/950, cards gray-800
- Accent color: emerald/cyan
- Glowing subtle effects on active items
- Smooth hover transitions
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/dark-admin.svg",
    tags: ["dashboard", "admin", "dark-mode", "dark", "analytics"],
    featured: false,
    createdAt: "2026-02-18",
  },

  // ── E-commerce ─────────────────────────────────────────────────
  {
    id: "ec-1",
    title: "Product Page",
    slug: "ecommerce-product-page",
    categoryId: "4",
    categorySlug: "ecommerce",
    description:
      "A detailed e-commerce product page with gallery, options, and reviews.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create an e-commerce product detail page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Breadcrumb navigation
2. Product gallery — main image + 4 thumbnail images, click to switch
3. Product info:
   - Title, brand
   - Star rating (4.5/5) with review count
   - Price ($129.99) with strikethrough original ($179.99), discount badge
   - Color selector (3 swatches)
   - Size selector (S, M, L, XL)
   - Quantity +/- input
   - "Add to Cart" and "Buy Now" buttons
   - Wishlist icon button
4. Tabs: Description, Specifications (table), Reviews (3 reviews with rating)
5. Related products — 4 product cards
6. Footer

STYLE
- Clean, modern e-commerce style
- White background
- Responsive (gallery stacks on mobile)
- Smooth image transitions

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/product-page.svg",
    tags: ["ecommerce", "product", "gallery", "cart", "reviews"],
    featured: true,
    createdAt: "2026-01-28",
  },
  {
    id: "ec-2",
    title: "Shopping Cart & Checkout",
    slug: "shopping-cart-checkout",
    categoryId: "4",
    categorySlug: "ecommerce",
    description:
      "A two-step shopping cart and checkout flow with order summary.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a shopping cart and checkout page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

LAYOUT
Two-column layout: cart/form on left, order summary on right.

CART PAGE
- Cart items (3 items): image, title, variant, price, quantity selector, remove button
- Coupon code input
- Continue to checkout button

CHECKOUT FORM
- Contact info: email, phone
- Shipping address: name, address, city, state, zip, country dropdown
- Shipping method selector (Standard free, Express $9.99)
- Payment: card number, expiry, CVV (styled inputs, not functional)
- Order summary sidebar: items, subtotal, shipping, tax, total
- "Place Order" button

STYLE
- Clean, trustworthy, e-commerce standard
- Step indicator at top (Cart → Shipping → Payment)
- Form validation visual feedback
- Responsive (single column on mobile)

OUTPUT
Return a single complete HTML file with JavaScript for step navigation.`,
    previewImage: "/previews/cart-checkout.svg",
    tags: ["ecommerce", "cart", "checkout", "form", "payment"],
    featured: false,
    createdAt: "2026-02-03",
  },
  {
    id: "ec-3",
    title: "Product Grid with Filters",
    slug: "product-grid-filters",
    categoryId: "4",
    categorySlug: "ecommerce",
    description:
      "A product listing page with sidebar filters and sorting options.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a product listing/shop page with filters.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

LAYOUT
- Left sidebar: filters
- Right: product grid

SIDEBAR FILTERS
- Search input
- Category checkboxes (Electronics, Clothing, Accessories, Home)
- Price range slider
- Brand checkboxes
- Rating filter (stars)
- Color swatches
- "Clear all" button

TOP BAR
- Result count ("Showing 24 products")
- Sort dropdown (Popular, Price Low-High, Price High-Low, Newest)
- Grid/List view toggle

PRODUCT GRID
- 8 product cards (4x2 grid on desktop)
- Each card: image, title, price, rating stars, "Add to cart" button
- Hover effect: scale up, show quick-view button

STYLE
- Clean, minimal e-commerce
- Responsive (filters become slide-out drawer on mobile)
- Filter button to show mobile filter panel

OUTPUT
Return a single complete HTML file with JS for filter toggling and view switching.`,
    previewImage: "/previews/product-grid.svg",
    tags: ["ecommerce", "products", "filters", "grid", "shop"],
    featured: false,
    createdAt: "2026-02-14",
  },
  {
    id: "ec-4",
    title: "E-commerce Storefront",
    slug: "ecommerce-storefront",
    categoryId: "4",
    categorySlug: "ecommerce",
    description:
      "A complete e-commerce homepage with hero banner, categories, and featured products.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a complete e-commerce storefront homepage.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Announcement bar (free shipping, sale info)
2. Header with logo, search bar, cart icon with count, user icon
3. Category navigation bar
4. Hero banner slider (3 slides) with auto-play
5. Category cards grid (6 categories with images)
6. Featured products row (4 products)
7. Promotional banner (two-column with image)
8. New arrivals (4 products)
9. Newsletter signup
10. Footer with columns: Shop, Support, Company, Social links

STYLE
- Modern, clean e-commerce (like Shopify themes)
- White background, minimal accents
- Professional product card design
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/storefront.svg",
    tags: ["ecommerce", "storefront", "homepage", "shop", "banner"],
    featured: false,
    createdAt: "2026-02-22",
  },

  // ── Authentication ─────────────────────────────────────────────
  {
    id: "auth-1",
    title: "Modern Login Page",
    slug: "modern-login-page",
    categoryId: "5",
    categorySlug: "authentication",
    description:
      "A sleek login page with social login options and form validation.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a modern login page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

LAYOUT
Split screen: left side illustration/brand, right side login form.

LEFT SIDE
- Brand gradient background (indigo → purple)
- Logo and app name
- Tagline
- Abstract illustration or pattern

RIGHT SIDE — LOGIN FORM
- "Welcome back" heading
- "Sign in to your account" subtext
- Social login buttons: Google, GitHub, Apple
- Divider "or continue with email"
- Email input with icon
- Password input with show/hide toggle icon
- "Remember me" checkbox + "Forgot password?" link
- "Sign In" button (full width, gradient)
- "Don't have an account? Sign up" link

VALIDATION
- Required field indicators
- Email format validation
- Password minimum length (8 chars)
- Error messages below inputs (red)
- Success state on valid input (green border)

STYLE
- Modern, clean, trustworthy
- Smooth input focus animations
- Loading state on button click
- Responsive (stack vertically on mobile, hide left panel)

OUTPUT
Return a single complete HTML file with JS for validation and toggle.`,
    previewImage: "/previews/login.svg",
    tags: ["auth", "login", "form", "social-login", "validation"],
    featured: true,
    createdAt: "2026-01-22",
  },
  {
    id: "auth-2",
    title: "Sign Up with Steps",
    slug: "signup-with-steps",
    categoryId: "5",
    categorySlug: "authentication",
    description:
      "A multi-step registration form with progress indicator.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a multi-step signup/registration page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

STEPS
Step 1 — Account:
- Full name
- Email
- Password + confirm password
- Password strength indicator

Step 2 — Profile:
- Avatar upload area (drag & drop zone)
- Username
- Bio textarea
- Location dropdown

Step 3 — Preferences:
- Interests (checkbox grid: Design, Development, Marketing, Business, etc.)
- Email notification toggles
- Terms & conditions checkbox

FEATURES
- Progress bar at top showing current step (1/3, 2/3, 3/3)
- Step indicators (circles with numbers)
- Previous / Next / Submit buttons
- Validation per step before proceeding
- Smooth slide animation between steps
- Success page after submission with confetti effect

STYLE
- Clean, modern
- Card centered on a subtle gradient background
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/signup-steps.svg",
    tags: ["auth", "signup", "multi-step", "registration", "wizard"],
    featured: false,
    createdAt: "2026-02-06",
  },
  {
    id: "auth-3",
    title: "OTP Verification Page",
    slug: "otp-verification-page",
    categoryId: "5",
    categorySlug: "authentication",
    description:
      "An OTP code input page with auto-focus, resend timer, and validation.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create an OTP (One-Time Password) verification page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

FEATURES
- Lock/shield icon at top
- "Verify your email" heading
- "We sent a code to user@email.com" subtext
- 6 individual digit input boxes
- Auto-focus next input on entry
- Auto-submit when all 6 digits entered
- Backspace goes to previous input
- Paste support (paste 6 digits and auto-fill all boxes)
- "Resend code" link with 60-second countdown timer
- "Verify" button
- Error state: shake animation + red borders on wrong code
- Success state: green check animation

STYLE
- Centered card layout
- Clean and focused
- Large, spaced input boxes
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/otp.svg",
    tags: ["auth", "otp", "verification", "security", "input"],
    featured: false,
    createdAt: "2026-02-11",
  },
  {
    id: "auth-4",
    title: "Forgot Password Flow",
    slug: "forgot-password-flow",
    categoryId: "5",
    categorySlug: "authentication",
    description:
      "Complete forgot/reset password flow with email input and new password form.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a forgot password / reset password flow.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

PAGES (as steps in one file)
Step 1 — Forgot Password:
- "Forgot your password?" heading
- Description text
- Email input
- "Send Reset Link" button
- "Back to login" link

Step 2 — Check Email:
- Email sent illustration/icon
- "Check your email" heading
- "We sent a reset link to your@email.com"
- "Open email app" button
- "Didn't receive? Resend" link

Step 3 — Reset Password:
- "Set new password" heading
- New password input with show/hide
- Confirm password input
- Password requirements checklist (8+ chars, uppercase, number, special char)
- Real-time validation as user types
- "Reset Password" button

Step 4 — Success:
- Green checkmark animation
- "Password reset successful"
- "Back to login" button

STYLE
- Centered card, clean
- Smooth transitions between steps
- Responsive

OUTPUT
Return a single complete HTML file with JS for step navigation and validation.`,
    previewImage: "/previews/forgot-password.svg",
    tags: ["auth", "password", "reset", "forgot", "flow"],
    featured: false,
    createdAt: "2026-02-16",
  },

  // ── Forms ──────────────────────────────────────────────────────
  {
    id: "form-1",
    title: "Contact Form with Map",
    slug: "contact-form-map",
    categoryId: "6",
    categorySlug: "forms",
    description:
      "A contact page with a styled form, contact info cards, and embedded map.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a contact page with form and contact information.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

LAYOUT
Two columns: contact info on left, form on right.

LEFT SIDE
- "Get in touch" heading
- Description paragraph
- Contact info cards:
  - Email (with icon)
  - Phone (with icon)
  - Address (with icon)
- Social media links
- Office hours
- Map placeholder (gray rectangle with "Map" text)

RIGHT SIDE — FORM
- Name input
- Email input
- Phone input
- Subject dropdown (General, Support, Sales, Partnership)
- Message textarea
- File attachment button
- "Send Message" button
- Success toast notification on submit

VALIDATION
- Required fields
- Email format
- Phone format
- Minimum message length

STYLE
- Professional, trustworthy
- Clean input styles with floating labels
- Responsive (stacks on mobile)

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/contact-form.svg",
    tags: ["form", "contact", "map", "validation", "business"],
    featured: false,
    createdAt: "2026-02-04",
  },
  {
    id: "form-2",
    title: "Multi-Step Survey Form",
    slug: "multi-step-survey-form",
    categoryId: "6",
    categorySlug: "forms",
    description:
      "An interactive multi-step survey/questionnaire with progress tracking.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a multi-step survey form.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

STEPS
Step 1: Personal Info (name, email, age range dropdown)
Step 2: Rating (rate 5 items on 1-5 scale using clickable stars)
Step 3: Multiple Choice (3 questions with radio buttons)
Step 4: Feedback (textarea for open feedback + file upload)
Step 5: Review & Submit (summary of all answers)

FEATURES
- Progress bar with step labels
- Previous / Next navigation
- Step validation before proceeding
- Review page shows all answers with edit buttons per section
- Animated transitions between steps
- Confetti on successful submission
- Response saved in localStorage

STYLE
- Friendly, approachable
- Card centered on gradient background
- Large, easy-to-click inputs
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/survey-form.svg",
    tags: ["form", "survey", "multi-step", "questionnaire", "wizard"],
    featured: false,
    createdAt: "2026-02-09",
  },
  {
    id: "form-3",
    title: "Job Application Form",
    slug: "job-application-form",
    categoryId: "6",
    categorySlug: "forms",
    description:
      "A comprehensive job application form with file upload and validation.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a job application form page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
Header:
- Job title: "Senior Frontend Developer"
- Company, location, salary range, job type badges

Form Fields:
- Personal: First name, Last name, Email, Phone, LinkedIn URL, Portfolio URL
- Experience: Current company, Current role, Years of experience (dropdown), Notice period
- Resume upload: Drag & drop zone with file type validation (.pdf, .doc)
- Cover letter: Rich textarea
- Skills: Tag input (type and press Enter to add skill tags)
- Availability: Start date picker, Willing to relocate (toggle)
- "Submit Application" button

FEATURES
- Form validation with inline error messages
- File upload with progress bar simulation
- Skill tags that can be removed with X button
- Character count on textarea
- Auto-save draft to localStorage

STYLE
- Professional, clean
- Responsive
- Well-spaced sections with dividers

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/job-form.svg",
    tags: ["form", "job", "application", "upload", "validation"],
    featured: false,
    createdAt: "2026-02-19",
  },

  // ── Pricing ────────────────────────────────────────────────────
  {
    id: "price-1",
    title: "Three-Tier Pricing Table",
    slug: "three-tier-pricing-table",
    categoryId: "7",
    categorySlug: "pricing",
    description:
      "A classic three-tier pricing table with monthly/yearly toggle and feature comparison.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a three-tier pricing table section.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

FEATURES
- Monthly / Yearly toggle switch (yearly shows discounted prices)
- 3 pricing cards side by side:

  Free ($0/mo):
  - 1 Project, 5GB Storage, Community Support, Basic Analytics
  - "Get Started" button (outline)

  Pro ($29/mo, $290/yr — "Save 17%"):
  - 10 Projects, 50GB Storage, Priority Support, Advanced Analytics, Custom Domain, API Access
  - "Start Free Trial" button (filled, primary)
  - "Most Popular" badge (highlighted card, slightly elevated)

  Enterprise ($99/mo, $990/yr):
  - Unlimited Projects, 500GB Storage, 24/7 Support, Full Analytics, Custom Domain, API, SSO, Audit Logs
  - "Contact Sales" button (filled, dark)

- Feature comparison table below the cards
- FAQ section about pricing

STYLE
- Clean, modern SaaS pricing
- Middle card highlighted (border, shadow, scale)
- Smooth toggle animation with price change
- Responsive (cards stack on mobile)

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/pricing-table.svg",
    tags: ["pricing", "table", "saas", "toggle", "comparison"],
    featured: true,
    createdAt: "2026-01-30",
  },
  {
    id: "price-2",
    title: "Pricing with Calculator",
    slug: "pricing-calculator",
    categoryId: "7",
    categorySlug: "pricing",
    description:
      "An interactive pricing page with usage-based calculator and slider.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create an interactive pricing page with a usage calculator.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

FEATURES
- Range slider: "How many users do you need?" (10 to 10,000)
- Price updates dynamically based on slider value
- Per-user and total price display
- Volume discount tiers shown
- Feature checklist that changes based on tier
- "Start Free Trial" CTA
- Comparison table
- Enterprise "Contact us" option for 10,000+

STYLE
- Modern, interactive
- Animated price counter
- Smooth slider
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/pricing-calc.svg",
    tags: ["pricing", "calculator", "interactive", "slider", "dynamic"],
    featured: false,
    createdAt: "2026-02-13",
  },
  {
    id: "price-3",
    title: "Gradient Pricing Cards",
    slug: "gradient-pricing-cards",
    categoryId: "7",
    categorySlug: "pricing",
    description: "Eye-catching pricing cards with gradient backgrounds and animations.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create pricing cards with gradient designs.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

FEATURES
- 3 pricing cards on dark background
- Each card has a unique gradient border/accent:
  - Basic: blue gradient
  - Pro: purple gradient
  - Enterprise: orange/gold gradient
- Animated gradient border effect on hover
- Glowing shadow matching card color on hover
- Feature list with check/x icons
- Monthly/yearly toggle
- "Popular" badge with shimmer animation
- Floating particles in background (CSS)

STYLE
- Dark theme (gray-950)
- Vibrant gradient accents
- Glassmorphism card backgrounds
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/gradient-pricing.svg",
    tags: ["pricing", "gradient", "dark", "animated", "glassmorphism"],
    featured: false,
    createdAt: "2026-02-21",
  },

  // ── Animations ─────────────────────────────────────────────────
  {
    id: "anim-1",
    title: "Scroll Reveal Animations",
    slug: "scroll-reveal-animations",
    categoryId: "8",
    categorySlug: "animations",
    description:
      "A page showcasing various scroll-triggered reveal animations.",
    promptText: `ROLE
You are an expert frontend developer specializing in CSS animations.

TASK
Create a page demonstrating various scroll-reveal animations.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript (IntersectionObserver)

ANIMATION TYPES TO DEMONSTRATE
1. Fade in from bottom
2. Fade in from left / right (alternating)
3. Scale up from center
4. Slide in with rotation
5. Staggered children (cards appearing one after another)
6. Counter animation (numbers counting up)
7. Progress bar fill animation
8. Text reveal (letter by letter)
9. Image parallax scroll effect
10. Sticky section with horizontal scroll

EACH SECTION
- Title describing the animation
- Visual demonstration
- Elements that animate when scrolled into view
- Reusable CSS classes

STYLE
- Clean showcase page
- Each section clearly separated
- Smooth 60fps animations
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/scroll-reveal.svg",
    tags: ["animation", "scroll", "reveal", "css", "intersection-observer"],
    featured: false,
    createdAt: "2026-02-07",
  },
  {
    id: "anim-2",
    title: "Hover Effect Cards",
    slug: "hover-effect-cards",
    categoryId: "8",
    categorySlug: "animations",
    description:
      "A collection of creative hover effects for cards and buttons.",
    promptText: `ROLE
You are an expert frontend developer specializing in CSS animations.

TASK
Create a showcase of creative hover effects for cards.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- CSS custom styles
- JavaScript (minimal)

HOVER EFFECTS TO INCLUDE
1. Card tilt 3D effect (follow mouse position)
2. Border gradient animation on hover
3. Image zoom with overlay text reveal
4. Card flip (front/back)
5. Shine/glare sweep effect
6. Magnetic button effect (cursor attraction)
7. Morphing shape background
8. Stacked cards that spread on hover
9. Color shift gradient background
10. Glassmorphism reveal

LAYOUT
- Grid of cards, each demonstrating one effect
- Label below each card describing the effect
- Light background to showcase effects

STYLE
- Clean, gallery-style layout
- Smooth 60fps transitions
- Responsive grid

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/hover-cards.svg",
    tags: ["animation", "hover", "cards", "css", "3d", "effects"],
    featured: false,
    createdAt: "2026-02-17",
  },
  {
    id: "anim-3",
    title: "Animated Hero Section",
    slug: "animated-hero-section",
    categoryId: "8",
    categorySlug: "animations",
    description:
      "A hero section with animated gradient background, floating elements, and typing effect.",
    promptText: `ROLE
You are an expert frontend developer specializing in animations.

TASK
Create an eye-catching animated hero section.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

ANIMATIONS
1. Animated gradient background (slowly shifting colors)
2. Floating geometric shapes (circles, squares) with random drift
3. Typing effect on the headline (type, delete, retype different words)
4. Fade-in and slide-up for subtitle and CTA buttons
5. Particle effect in background (small dots moving slowly)
6. Mouse parallax — elements move slightly based on cursor position
7. CTA button with pulse/glow animation
8. Scroll-down indicator with bounce animation

CONTENT
- Headline: "Build [Beautiful/Modern/Amazing] Websites" (typing effect cycles words)
- Subtitle: descriptive text
- Two CTA buttons: "Get Started" and "Watch Demo"
- Trusted by logos row with fade-in

STYLE
- Dark hero (gray-950) with vibrant accent colors
- Full viewport height
- Layered depth effect
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/animated-hero.svg",
    tags: ["animation", "hero", "gradient", "typing", "parallax"],
    featured: false,
    createdAt: "2026-02-24",
  },

  // ── Blog & Content ─────────────────────────────────────────────
  {
    id: "blog-1",
    title: "Blog Homepage",
    slug: "blog-homepage",
    categoryId: "9",
    categorySlug: "blog",
    description: "A clean blog homepage with featured post, grid layout, and sidebar.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a blog homepage.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Header with logo, nav links (Home, Categories, About, Subscribe), search icon
2. Featured post — large hero card with image, category badge, title, excerpt, author, date
3. Post grid — 6 post cards (3x2) with image, category, title, excerpt, author avatar, date, read time
4. Sidebar:
   - Search input
   - Categories list with post count
   - Popular posts (5 items, compact)
   - Newsletter subscribe form
   - Tags cloud
5. Pagination (Previous / 1 2 3 ... / Next)
6. Footer

STYLE
- Clean, editorial, readable
- White background, good typography hierarchy
- Category color coding
- Hover effects on cards
- Responsive (sidebar below content on mobile)

OUTPUT
Return a single complete HTML file with sample blog data.`,
    previewImage: "/previews/blog-home.svg",
    tags: ["blog", "content", "articles", "editorial", "grid"],
    featured: false,
    createdAt: "2026-02-02",
  },
  {
    id: "blog-2",
    title: "Article Page",
    slug: "blog-article-page",
    categoryId: "9",
    categorySlug: "blog",
    description: "A beautifully formatted blog article page with table of contents.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a blog article/post page.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Article header: category badge, title, subtitle, author (avatar + name + date), read time, share buttons
2. Featured image (full width)
3. Table of contents sidebar (sticky, highlights active section on scroll)
4. Article content with rich typography:
   - Headings (h2, h3)
   - Paragraphs with good line height
   - Blockquote with left border
   - Code block with syntax highlighting style
   - Bullet list and numbered list
   - Image with caption
   - Callout/info box
5. Tags at bottom
6. Author bio card
7. Related articles (3 cards)
8. Comments section (3 sample comments with reply)

STYLE
- Maximum readability (max-width 720px for content)
- Beautiful typography (serif for headings option)
- Sticky TOC on desktop
- Social share floating bar
- Responsive

OUTPUT
Return a single complete HTML file with sample article content.`,
    previewImage: "/previews/blog-article.svg",
    tags: ["blog", "article", "content", "typography", "toc"],
    featured: false,
    createdAt: "2026-02-10",
  },
  {
    id: "blog-3",
    title: "Documentation Page",
    slug: "documentation-page",
    categoryId: "9",
    categorySlug: "blog",
    description: "A technical documentation page with sidebar navigation and code examples.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a documentation/docs page layout.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

LAYOUT
Three columns: left sidebar nav, center content, right "on this page" TOC.

LEFT SIDEBAR
- Search input
- Collapsible sections: Getting Started, Components, API Reference, Guides
- Each section has 3-5 links
- Active link highlighted
- Scrollable

CENTER CONTENT
- Breadcrumb
- Page title + description
- Code examples with copy button and language tabs (HTML/React/Vue)
- Props/parameter table
- Info/warning/tip callout boxes
- "Previous / Next" page navigation at bottom

RIGHT SIDEBAR
- "On this page" links (scroll spy)
- "Edit this page" link
- "Report issue" link

STYLE
- Clean docs style (inspired by Tailwind/Next.js docs)
- Monospace for code
- Good spacing and typography
- Responsive (sidebars become drawers on mobile)

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/docs-page.svg",
    tags: ["docs", "documentation", "technical", "code", "api"],
    featured: false,
    createdAt: "2026-02-23",
  },

  // ── Portfolio ──────────────────────────────────────────────────
  {
    id: "port-1",
    title: "Developer Portfolio",
    slug: "developer-portfolio",
    categoryId: "10",
    categorySlug: "portfolio",
    description: "A minimal developer portfolio with projects, skills, and contact.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a developer portfolio website.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Hero: name, title ("Full Stack Developer"), short bio, CTA buttons (Download CV, Contact Me), social links
2. About: photo placeholder, longer bio, tech stack icons grid
3. Skills: progress bars or skill cards with proficiency levels
4. Projects: 6 project cards with:
   - Screenshot placeholder
   - Title, description
   - Tech tags
   - Live demo + GitHub links
   - Filter by category (All, Web, Mobile, Design)
5. Experience: timeline with company, role, duration, description
6. Testimonials: 3 client testimonials
7. Contact form with social links
8. Footer

STYLE
- Clean, modern, developer-focused
- Dark or light theme toggle
- Smooth scroll navigation
- Section reveal animations
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/dev-portfolio.svg",
    tags: ["portfolio", "developer", "personal", "projects", "resume"],
    featured: false,
    createdAt: "2026-02-05",
  },
  {
    id: "port-2",
    title: "Creative Agency Portfolio",
    slug: "creative-agency-portfolio",
    categoryId: "10",
    categorySlug: "portfolio",
    description: "A bold creative agency portfolio with full-screen sections.",
    promptText: `ROLE
You are an expert frontend developer with a flair for creative design.

TASK
Create a creative agency portfolio site.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Full-screen hero with large text animation, video background placeholder
2. Services: 4 service cards with hover reveal animations
3. Portfolio: filterable masonry grid (8 projects) with category tabs (Branding, Web, App, Print)
4. Process: 4-step horizontal process with icons and connectors
5. Team: 4 team cards with photo, name, role — hover shows social links
6. Clients: logo carousel auto-scroll
7. Awards/Recognition section
8. Contact: split screen with form and office info

STYLE
- Bold, high-contrast, editorial
- Large typography
- Black and white with one accent color
- Cursor custom effects (optional)
- Smooth page-wide animations
- Responsive

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/agency-portfolio.svg",
    tags: ["portfolio", "agency", "creative", "bold", "animation"],
    featured: false,
    createdAt: "2026-02-15",
  },
  {
    id: "port-3",
    title: "Photographer Portfolio",
    slug: "photographer-portfolio",
    categoryId: "10",
    categorySlug: "portfolio",
    description: "A visual-first photographer portfolio with lightbox gallery.",
    promptText: `ROLE
You are an expert frontend developer.

TASK
Create a photographer portfolio website.

TECH STACK
- HTML
- Tailwind CSS (via CDN)
- JavaScript

SECTIONS
1. Minimal header: name/logo + hamburger menu
2. Full-screen hero: large background image with name and specialty
3. Gallery grid: masonry layout with 12 photos (use placeholder images)
   - Filter tabs: All, Portrait, Landscape, Street, Wedding
   - Click opens lightbox with prev/next navigation
   - Smooth zoom-in animation on click
4. About: photo + bio + awards
5. Services & pricing: 3 packages
6. Instagram feed row (6 images)
7. Contact form
8. Footer

STYLE
- Minimal, photo-focused
- White/near-white background so photos pop
- Minimal text, maximum visual impact
- Smooth transitions
- Responsive masonry grid

OUTPUT
Return a single complete HTML file.`,
    previewImage: "/previews/photo-portfolio.svg",
    tags: ["portfolio", "photographer", "gallery", "lightbox", "visual"],
    featured: false,
    createdAt: "2026-02-25",
  },
];
