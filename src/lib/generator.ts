// ─── Dynamic Prompt Generator ──────────────────────────────────────────────────
// Generates thousands of prompt combinations from user-selected options.

export interface GeneratorOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface GeneratorSelections {
  component: string;
  framework: string;
  style: string;
  theme: string;
  animation: string;
}

// ─── Components ────────────────────────────────────────────────────────────────

export const components: GeneratorOption[] = [
  { id: "landing-page", label: "Landing Page", icon: "🚀", description: "Full hero, features, CTA sections" },
  { id: "dashboard", label: "Dashboard", icon: "📊", description: "Analytics, charts, stats overview" },
  { id: "pricing-table", label: "Pricing Table", icon: "💰", description: "Tiered pricing with comparison" },
  { id: "login-page", label: "Login Page", icon: "🔐", description: "Auth form with social sign-in" },
  { id: "signup-page", label: "Sign Up Page", icon: "📝", description: "Registration with validation" },
  { id: "navbar", label: "Navigation Bar", icon: "🧭", description: "Responsive nav with dropdowns" },
  { id: "hero-section", label: "Hero Section", icon: "⭐", description: "Bold intro with CTA" },
  { id: "footer", label: "Footer", icon: "📌", description: "Links, social, newsletter" },
  { id: "blog-layout", label: "Blog Layout", icon: "📰", description: "Article grid with sidebar" },
  { id: "portfolio", label: "Portfolio", icon: "🎨", description: "Project showcase gallery" },
  { id: "contact-form", label: "Contact Form", icon: "✉️", description: "Multi-field form with map" },
  { id: "product-card", label: "Product Card", icon: "🛒", description: "E-commerce item display" },
  { id: "testimonials", label: "Testimonials", icon: "💬", description: "Review cards & carousel" },
  { id: "faq-section", label: "FAQ Section", icon: "❓", description: "Collapsible accordion" },
  { id: "modal-dialog", label: "Modal / Dialog", icon: "🪟", description: "Overlay with actions" },
  { id: "sidebar", label: "Sidebar", icon: "📂", description: "Collapsible nav sidebar" },
  { id: "settings-page", label: "Settings Page", icon: "⚙️", description: "Form with tabs & toggles" },
  { id: "onboarding-flow", label: "Onboarding Flow", icon: "🎯", description: "Multi-step wizard" },
  { id: "checkout-page", label: "Checkout Page", icon: "💳", description: "Cart summary & payment" },
  { id: "404-page", label: "404 Page", icon: "🔍", description: "Creative not-found page" },
];

// ─── Frameworks ────────────────────────────────────────────────────────────────

export const frameworks: GeneratorOption[] = [
  { id: "html-tailwind", label: "HTML + Tailwind CSS", icon: "🌊", description: "Pure HTML with Tailwind CDN" },
  { id: "react-tailwind", label: "React + Tailwind", icon: "⚛️", description: "React components with Tailwind" },
  { id: "nextjs", label: "Next.js + Tailwind", icon: "▲", description: "Next.js App Router components" },
  { id: "vue-tailwind", label: "Vue + Tailwind", icon: "💚", description: "Vue 3 SFC with Tailwind" },
  { id: "html-css", label: "HTML + CSS", icon: "🎨", description: "Vanilla HTML with custom CSS" },
  { id: "svelte", label: "Svelte + Tailwind", icon: "🔥", description: "Svelte components with Tailwind" },
];

// ─── Styles ────────────────────────────────────────────────────────────────────

export const styles: GeneratorOption[] = [
  { id: "minimal", label: "Minimal", icon: "✨", description: "Clean lines, lots of whitespace" },
  { id: "glassmorphism", label: "Glassmorphism", icon: "🪟", description: "Frosted glass, blur, transparency" },
  { id: "neomorphism", label: "Neomorphism", icon: "🫧", description: "Soft shadows, embossed surfaces" },
  { id: "brutalist", label: "Brutalist", icon: "🏗️", description: "Raw, bold, unconventional layouts" },
  { id: "gradient-rich", label: "Gradient Rich", icon: "🌈", description: "Vibrant gradients throughout" },
  { id: "flat", label: "Flat Design", icon: "📐", description: "No shadows, solid colors, crisp" },
  { id: "retro", label: "Retro / Vintage", icon: "📻", description: "Nostalgic colors, pixel-ish feel" },
  { id: "corporate", label: "Corporate", icon: "🏢", description: "Professional, trustworthy, polished" },
];

// ─── Themes ────────────────────────────────────────────────────────────────────

export const themes: GeneratorOption[] = [
  { id: "dark", label: "Dark", icon: "🌙", description: "Dark backgrounds, light text" },
  { id: "light", label: "Light", icon: "☀️", description: "White backgrounds, dark text" },
  { id: "dark-indigo", label: "Dark Indigo", icon: "💜", description: "Dark with indigo/purple accents" },
  { id: "dark-emerald", label: "Dark Emerald", icon: "💚", description: "Dark with green/emerald accents" },
  { id: "dark-rose", label: "Dark Rose", icon: "🌹", description: "Dark with rose/pink accents" },
  { id: "light-blue", label: "Light Blue", icon: "💙", description: "Light with blue accents" },
  { id: "light-amber", label: "Light Amber", icon: "🔶", description: "Light with warm amber tones" },
  { id: "monochrome", label: "Monochrome", icon: "⬛", description: "Black, white, and grays only" },
];

// ─── Animations ────────────────────────────────────────────────────────────────

export const animations: GeneratorOption[] = [
  { id: "none", label: "None", icon: "⏹️", description: "Static, no animations" },
  { id: "subtle", label: "Subtle", icon: "💫", description: "Fade-in on scroll, soft hovers" },
  { id: "moderate", label: "Moderate", icon: "✨", description: "Slide-ins, scale transitions, hover lifts" },
  { id: "rich", label: "Rich", icon: "🎬", description: "Stagger reveals, parallax, micro-interactions" },
  { id: "cinematic", label: "Cinematic", icon: "🎥", description: "Full-page transitions, 3D transforms, particles" },
];

// ─── Template Engine ───────────────────────────────────────────────────────────

const componentDetails: Record<string, { task: string; sections: string }> = {
  "landing-page": {
    task: "Create a complete landing page",
    sections: `SECTIONS
1. Hero section with headline, sub-headline, CTA buttons, and hero image/illustration placeholder
2. Logos/trust bar with 5 partner logos (use placeholder SVGs)
3. Features grid — 6 feature cards with icon, title, and description
4. How it works — 3-step process with icons and connectors
5. Testimonials — 3 testimonial cards with avatar, name, role, and quote
6. CTA banner — final call-to-action with email input
7. Footer with links, social icons, and copyright`,
  },
  dashboard: {
    task: "Create an analytics dashboard",
    sections: `SECTIONS
1. Top bar with search, notifications bell, and user avatar
2. Sidebar navigation with icons, labels, and active state
3. Stats row — 4 KPI cards (revenue, users, orders, growth) with sparkline indicators
4. Main chart — large area/line chart placeholder (use a styled container with sample data points)
5. Recent activity table — 8 rows with status badges
6. Secondary chart — donut/pie chart with legend
7. Quick actions panel with icon buttons`,
  },
  "pricing-table": {
    task: "Create a pricing table section",
    sections: `SECTIONS
1. Section header with headline, sub-text, and monthly/yearly toggle switch
2. 3 pricing tiers (Free, Pro, Enterprise) as cards side by side
3. Each card: plan name, price, billing period, feature list (8+ items with check/cross icons), CTA button
4. "Most Popular" badge on the middle card
5. Feature comparison table below the cards
6. FAQ section — 4 pricing-related questions with accordion
7. Money-back guarantee badge`,
  },
  "login-page": {
    task: "Create a login / sign-in page",
    sections: `SECTIONS
1. Split layout — left: decorative panel with illustration/pattern, right: login form
2. Logo and welcome heading
3. Email and password inputs with labels and validation states
4. "Remember me" checkbox and "Forgot password?" link
5. Primary sign-in button
6. Divider with "or continue with"
7. Social login buttons (Google, GitHub, Apple)
8. "Don't have an account? Sign up" link at bottom`,
  },
  "signup-page": {
    task: "Create a registration / sign-up page",
    sections: `SECTIONS
1. Split layout — left: form side, right: decorative panel with feature highlights
2. Logo and "Create your account" heading
3. Full name, email, password, confirm password inputs with validation
4. Password strength meter
5. Terms & conditions checkbox
6. Primary "Create Account" button
7. Social signup buttons (Google, GitHub)
8. "Already have an account? Sign in" link`,
  },
  navbar: {
    task: "Create a responsive navigation bar",
    sections: `FEATURES
1. Logo on the left
2. Navigation links (Home, Features, Pricing, About, Contact) with hover effects
3. Dropdown mega menu for "Features" with grid layout of items
4. Search button/bar
5. CTA button on the right (e.g., "Get Started")
6. Mobile hamburger menu with animated toggle
7. Mobile slide-out panel with all nav items
8. Sticky on scroll with background blur effect`,
  },
  "hero-section": {
    task: "Create a hero section",
    sections: `FEATURES
1. Full-width hero container with decorative background (gradient blobs, grid pattern, or particles)
2. Eyebrow badge/pill above the headline (e.g., "New: Feature X is here")
3. Large bold headline (H1) with gradient text on keyword
4. Supporting paragraph text
5. Two CTA buttons (primary filled + secondary outlined)
6. Hero image, mockup, or illustration placeholder below/beside the text
7. Trust indicators — logos or "Trusted by X+ companies"
8. Optional floating stats badges`,
  },
  footer: {
    task: "Create a website footer",
    sections: `SECTIONS
1. 4-column grid layout
2. Column 1: Logo, description, social media icon links
3. Column 2: Product links (Features, Pricing, Integrations, Changelog)
4. Column 3: Company links (About, Blog, Careers, Press)
5. Column 4: Newsletter signup with email input and subscribe button
6. Bottom bar with copyright and legal links (Privacy, Terms)
7. Language/region selector`,
  },
  "blog-layout": {
    task: "Create a blog layout page",
    sections: `SECTIONS
1. Header with blog title and search bar
2. Featured/hero post with large image, title, excerpt, author, and date
3. Category filter pills (All, Technology, Design, Business, etc.)
4. Post grid — 6 article cards in 3-column layout with image, category tag, title, excerpt, author avatar, date
5. Sidebar with popular posts list, newsletter signup, and tag cloud
6. Pagination with page numbers
7. Footer`,
  },
  portfolio: {
    task: "Create a portfolio showcase page",
    sections: `SECTIONS
1. Hero with name, title, short bio, and profile image
2. Filter bar with category tabs (All, Web, Mobile, Branding, etc.)
3. Project grid — 6 project cards with hover overlay showing title and "View Project" link
4. Featured project — large showcase section with screenshots, description, tech stack tags
5. Skills section with progress bars or tag pills
6. Contact section with form or links
7. Footer with social links`,
  },
  "contact-form": {
    task: "Create a contact form page",
    sections: `SECTIONS
1. Split layout — left: contact form, right: contact info & map placeholder
2. Form fields: name, email, phone (optional), subject dropdown, message textarea
3. File attachment button
4. Submit button with loading state
5. Contact info cards — email, phone, address with icons
6. Embedded map placeholder (styled container)
7. Office hours display
8. Social media links`,
  },
  "product-card": {
    task: "Create an e-commerce product page/card section",
    sections: `SECTIONS
1. Product image gallery with thumbnail strip and main image
2. Product title, rating stars, review count
3. Price with original price strikethrough and discount badge
4. Color/size variant selectors
5. Quantity picker and "Add to Cart" button
6. Product description tabs (Details, Specifications, Reviews)
7. Related products grid — 4 mini product cards
8. Sticky add-to-cart bar on mobile`,
  },
  testimonials: {
    task: "Create a testimonials section",
    sections: `FEATURES
1. Section heading and subtext
2. 3 featured testimonial cards with: avatar, name, role, company, star rating, quote text
3. Carousel/slider with navigation arrows and dots
4. Large quote icon decoration
5. Company logo under each testimonial
6. Video testimonial placeholder card
7. Aggregate rating summary (e.g., "4.9/5 from 2,000+ reviews")`,
  },
  "faq-section": {
    task: "Create an FAQ section",
    sections: `FEATURES
1. Section heading with subtext
2. Category tabs (General, Billing, Technical, etc.)
3. 8 collapsible accordion items with smooth expand/collapse animation
4. Each item: question text, answer text, expand/collapse icon that rotates
5. Search/filter input at the top
6. "Still have questions?" CTA with contact link
7. Two-column layout on desktop, single column on mobile`,
  },
  "modal-dialog": {
    task: "Create a modal/dialog component showcase",
    sections: `FEATURES
1. Trigger buttons for different modal types
2. Basic modal — title, description, action buttons (Cancel, Confirm)
3. Confirmation dialog — warning icon, destructive action styling
4. Form modal — inputs inside modal with submit
5. Full-screen modal for mobile
6. Backdrop overlay with blur and click-to-close
7. Smooth open/close animation (scale + fade)
8. Keyboard support (Escape to close, focus trap)`,
  },
  sidebar: {
    task: "Create a collapsible sidebar navigation",
    sections: `FEATURES
1. Logo/brand at the top
2. Navigation items with icons and labels
3. Nested sub-menus that expand/collapse
4. Active state indicator (left border or background highlight)
5. User profile section at the bottom with avatar and name
6. Collapse/expand toggle button (icon-only mode when collapsed)
7. Badge/count indicators on menu items (e.g., notifications)
8. Mobile overlay mode with backdrop`,
  },
  "settings-page": {
    task: "Create a settings page",
    sections: `SECTIONS
1. Settings header with page title and breadcrumb
2. Left sidebar tabs (Profile, Account, Notifications, Security, Billing)
3. Profile section — avatar upload, name, email, bio textarea
4. Account section — language selector, timezone, delete account
5. Notifications section — toggle switches for email, push, SMS
6. Security section — change password form, two-factor auth toggle, active sessions
7. Save/Cancel buttons sticky at bottom`,
  },
  "onboarding-flow": {
    task: "Create a multi-step onboarding flow",
    sections: `FEATURES
1. Progress stepper/indicator at the top (Step 1 of 4)
2. Step 1: Welcome screen with illustration and "Get Started" button
3. Step 2: User info form (name, role, company)
4. Step 3: Preference selection (grid of selectable cards)
5. Step 4: Completion screen with confetti and dashboard link
6. Navigation buttons (Back, Next, Skip)
7. Smooth transitions between steps (slide animation)
8. Form validation on each step before proceeding`,
  },
  "checkout-page": {
    task: "Create an e-commerce checkout page",
    sections: `SECTIONS
1. Progress indicator (Cart → Shipping → Payment → Review)
2. Order summary sidebar — item list with images, quantities, subtotal, tax, total
3. Shipping form — address fields with autocomplete
4. Payment form — card number, expiry, CVC with formatting
5. Promo code input with apply button
6. Place order button with total amount
7. Trust badges (secure checkout, money-back guarantee)
8. Mobile: order summary as collapsible at top`,
  },
  "404-page": {
    task: "Create a creative 404 Not Found page",
    sections: `FEATURES
1. Large "404" display with creative styling (gradient text, glitch effect, or illustration)
2. "Page not found" headline and description
3. Search bar to help find content
4. Suggested links (Home, Popular pages)
5. "Go Back" and "Go Home" buttons
6. Decorative illustration or animation
7. Consistent with site header/footer`,
  },
};

const frameworkDetails: Record<string, { name: string; stack: string; output: string }> = {
  "html-tailwind": {
    name: "HTML + Tailwind CSS",
    stack: `TECH STACK
- HTML5
- Tailwind CSS (via CDN: <script src="https://cdn.tailwindcss.com"></script>)
- JavaScript (vanilla, inline)`,
    output: "Return a single, complete, self-contained HTML file. All styling via Tailwind CDN, all JS inline within <script> tags.",
  },
  "react-tailwind": {
    name: "React + Tailwind CSS",
    stack: `TECH STACK
- React 18+ (functional components, hooks)
- Tailwind CSS (utility classes)
- TypeScript`,
    output: "Return a complete React component file (.tsx). Use functional components with hooks. Include all sub-components in the same file. Tailwind classes for all styling.",
  },
  nextjs: {
    name: "Next.js + Tailwind CSS",
    stack: `TECH STACK
- Next.js 14+ (App Router)
- React Server Components where appropriate, "use client" where interactivity is needed
- Tailwind CSS
- TypeScript`,
    output: "Return a Next.js page component (.tsx). Use App Router conventions. Mark interactive components with 'use client'. Tailwind classes for styling.",
  },
  "vue-tailwind": {
    name: "Vue 3 + Tailwind CSS",
    stack: `TECH STACK
- Vue 3 (Composition API, <script setup>)
- Tailwind CSS (utility classes)
- TypeScript`,
    output: "Return a Vue 3 Single File Component (.vue). Use <script setup lang='ts'>, <template>, and <style> sections. Tailwind classes for styling.",
  },
  "html-css": {
    name: "HTML + Custom CSS",
    stack: `TECH STACK
- HTML5
- Custom CSS (embedded in <style> tag)
- JavaScript (vanilla, inline)`,
    output: "Return a single, complete HTML file with embedded <style> and <script> tags. No external dependencies.",
  },
  svelte: {
    name: "Svelte + Tailwind CSS",
    stack: `TECH STACK
- Svelte 4+ (reactive declarations, stores)
- Tailwind CSS (utility classes)
- TypeScript`,
    output: "Return a Svelte component file (.svelte). Use reactive declarations and Svelte stores for state. Tailwind classes for styling.",
  },
};

const styleDetails: Record<string, string> = {
  minimal: `- Clean, minimal aesthetic with generous whitespace
- Subtle borders and dividers (1px, low-opacity)
- Simple shadows (sm/md), rounded corners (lg)
- Limited color palette — mostly neutrals with one accent
- Typography-focused hierarchy`,
  glassmorphism: `- Frosted glass effect (backdrop-blur, semi-transparent backgrounds)
- rgba backgrounds with low opacity (0.1–0.3)
- Subtle light borders (white/10–20%)
- Layered card depth with glass panels
- Soft, diffused shadows behind glass elements`,
  neomorphism: `- Soft, embossed/debossed surfaces using dual shadows
- Background-colored elements that appear pushed in or out
- Rounded corners (xl/2xl)
- Minimal use of borders — depth from shadows only
- Pastel or muted tones`,
  brutalist: `- Raw, intentionally "ugly" but striking aesthetic
- Bold, oversized typography (sometimes monospace)
- Thick borders (2-4px solid)
- Harsh contrasts, no gradients or soft shadows
- Asymmetric layouts, overlapping elements
- No rounded corners — sharp edges`,
  "gradient-rich": `- Vibrant gradient backgrounds, buttons, and text
- Multi-color gradients using modern palettes (purple → blue → teal)
- Gradient borders using background-clip tricks
- Glowing elements with colored shadows matching gradients
- Smooth color transitions on hover`,
  flat: `- Completely flat — no shadows, no gradients
- Solid, vivid colors from a modern palette
- Clear geometric shapes
- Strong color contrast for hierarchy
- Clean iconography and crisp edges`,
  retro: `- Vintage/nostalgic color palette (warm browns, oranges, cream, olive)
- Serif or slab-serif typography
- Pixel-art or hand-drawn style icons
- Borders and dividers, no blur effects
- Textured backgrounds (paper, grain)
- Badge and stamp-style UI elements`,
  corporate: `- Professional, trustworthy appearance
- Navy/slate blue primary with clean whites
- Conservative spacing, structured grids
- Subtle shadows and well-defined card boundaries
- Sans-serif typography (system fonts)
- Consistent, predictable layout patterns`,
};

const themeDetails: Record<string, string> = {
  dark: `- Dark background (#0a0a0a / gray-950), light text (gray-100)
- Cards: slightly lighter dark (gray-900/800)
- Borders: white with low opacity (white/10)
- Accent: indigo-500 or blue-500
- Muted text: gray-400/500`,
  light: `- White/light background (#ffffff / gray-50), dark text (gray-900)
- Cards: white with subtle shadow
- Borders: gray-200
- Accent: indigo-600 or blue-600
- Muted text: gray-500/600`,
  "dark-indigo": `- Dark background (#09090b), light text
- Primary accent: indigo-500, secondary: purple-500
- Gradient accents: indigo → purple
- Glowing elements with indigo shadow
- Borders: indigo-500/20`,
  "dark-emerald": `- Dark background (#09090b), light text
- Primary accent: emerald-500, secondary: teal-500
- Gradient accents: emerald → teal
- Glowing elements with emerald shadow
- Borders: emerald-500/20`,
  "dark-rose": `- Dark background (#09090b), light text
- Primary accent: rose-500, secondary: pink-500
- Gradient accents: rose → pink
- Glowing elements with rose shadow
- Borders: rose-500/20`,
  "light-blue": `- Light background (white/slate-50), dark text
- Primary accent: blue-600, secondary: sky-500
- Soft blue tints on backgrounds (blue-50)
- Clean blue borders and button fills
- Headers with blue gradients`,
  "light-amber": `- Warm light background (amber-50/orange-50), dark text
- Primary accent: amber-600, secondary: orange-500
- Warm-toned cards and surfaces
- Amber borders and highlights
- Inviting, energetic palette`,
  monochrome: `- Pure black, white, and grays only
- Background: #000 or #fff depending on section
- Strong contrast between elements
- No color accents — hierarchy via size, weight, spacing
- Borders: solid gray`,
};

const animationDetails: Record<string, string> = {
  none: `- No animations or transitions
- Static layout, instant state changes
- Focus on content and structure only`,
  subtle: `- Fade-in on scroll using IntersectionObserver (opacity 0 → 1)
- Soft hover transitions on buttons and links (150-200ms)
- Smooth color/background transitions on interactive elements
- No movement animations — opacity only`,
  moderate: `- Scroll reveal: fade + slide up (translateY 20px → 0) with IntersectionObserver
- Button hover: slight scale (1.02) and shadow increase
- Card hover: lift effect (translateY -4px) with shadow
- Stagger delay on grid items (each card 100ms later)
- Smooth transitions on all interactive states (300ms ease)`,
  rich: `- Staggered scroll reveals with varied directions (up, left, right)
- Parallax-like depth on background elements
- Micro-interactions: button press scale (0.97), input focus glow
- Number counters that animate to their values
- Image hover: zoom with overlay
- Loading skeleton states as placeholders
- Hover ripple effects on buttons`,
  cinematic: `- Full-page entrance animations with choreographed sequence
- 3D perspective transforms on cards (rotateX/Y on hover)
- Particle or floating dot background animation (CSS-only)
- Text reveal with clip-path or letter-by-letter
- Scroll-linked parallax on multiple layers
- Magnetic cursor effects on buttons
- Page transition animations (fade/slide between views)
- Animated gradient backgrounds that slowly shift`,
};

// ─── Generate Prompt ───────────────────────────────────────────────────────────

export function generatePrompt(selections: GeneratorSelections): {
  title: string;
  prompt: string;
  description: string;
} {
  const comp = componentDetails[selections.component];
  const fw = frameworkDetails[selections.framework];
  const styleName = styles.find((s) => s.id === selections.style)?.label ?? selections.style;
  const themeName = themes.find((t) => t.id === selections.theme)?.label ?? selections.theme;
  const animName = animations.find((a) => a.id === selections.animation)?.label ?? selections.animation;
  const compName = components.find((c) => c.id === selections.component)?.label ?? selections.component;

  const title = `${styleName} ${compName} — ${themeName} Theme`;
  const description = `A ${styleName.toLowerCase()} ${compName.toLowerCase()} built with ${fw.name}, featuring a ${themeName.toLowerCase()} color theme and ${animName.toLowerCase()} animations.`;

  const prompt = `ROLE
You are an expert frontend developer specializing in modern, production-quality web design.

TASK
${comp.task}.

${fw.stack}

${comp.sections}

VISUAL STYLE
${styleDetails[selections.style]}

COLOR THEME
${themeDetails[selections.theme]}

ANIMATIONS
${animationDetails[selections.animation]}

REQUIREMENTS
- Fully responsive (mobile-first approach)
- Semantic HTML with proper accessibility (ARIA labels, alt text, keyboard navigation)
- Clean, well-structured code with comments for major sections
- Pixel-perfect spacing, consistent sizing
- All placeholder content should be realistic (real-looking names, text, numbers)
- Use placeholder images via https://placehold.co or inline SVGs for icons

OUTPUT
${fw.output}`;

  return { title, prompt, description };
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export function getTotalCombinations(): number {
  return components.length * frameworks.length * styles.length * themes.length * animations.length;
}
