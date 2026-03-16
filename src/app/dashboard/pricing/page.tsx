"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Check, Zap, ArrowRight, Sun, Moon, Hexagon, Layers, Paintbrush, Code2, CreditCard, Settings2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";

const TIERS = [
  {
    id: "free",
    name: "Starter",
    price: "$0",
    description: "For individuals exploring AI design generation.",
    features: ["5 AI Syntheses per month", "Access to public components", "Basic token export", "Community support"],
    cta: "Current Plan",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For professionals building scalable design systems.",
    features: ["Unlimited AI Syntheses", "Private component library", "Advanced JSON/CLI export", "Theme customization", "Priority API access"],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For teams requiring advanced control and security.",
    features: ["Custom model training", "SSO integration", "Dedicated success manager", "White-label exports", "24/7 Phone Support"],
    cta: "Contact Sales",
    highlight: false,
  }
];

function DarkPricing({ handleLogout, toggleTheme }: any) {
  return (
    <div className="min-h-screen bg-[#050506] text-white font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-[#ffffff0a] bg-[#050506] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-black border border-[#ffffff15] rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D]/50 transition-all shadow-[0_0_20px_rgba(198,255,61,0.1)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing", active: true },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/30 bg-[#C6FF3D]/5" : "border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05]"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-[#C6FF3D]" : "text-zinc-600 group-hover:text-[#C6FF3D]"}`} />
              <span className="absolute left-[75px] bg-black border border-[#ffffff15] text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] rounded-sm group-hover:translate-x-0 translate-x-[-10px] transition-all">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <button onClick={toggleTheme} title="Switch to Light Mode" className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-[#ffffff10] hover:bg-[#ffffff05] transition-all text-zinc-600 hover:text-[#C6FF3D]">
            <Sun className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[64px] px-10 pt-10 pb-20">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-12 text-center md:text-left">
            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-1">
              <Link href="/dashboard" className="hover:text-zinc-400 transition-colors">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-[#C6FF3D]">Pricing</span>
            </p>
            <h1 className="text-3xl font-black text-white tracking-tight mt-2 mb-4">Subscription Plans</h1>
            <p className="text-zinc-500 max-w-lg text-sm font-medium">Power up your design system generation with increased limits, advanced exports, and premium support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div key={tier.id} className={`relative flex flex-col border ${tier.highlight ? "border-[#C6FF3D]/50 bg-[#C6FF3D]/5 shadow-[0_0_30px_rgba(198,255,61,0.05)]" : "border-[#ffffff10] bg-[#080809] hover:border-[#ffffff20] transition-colors"}`}>
                {tier.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C6FF3D] text-black text-[9px] font-black tracking-widest uppercase px-3 py-1 flex items-center gap-1 shadow-[0_0_10px_rgba(198,255,61,0.3)]">
                    <Zap className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className="p-8 border-b border-[#ffffff0a] flex-1">
                  <h3 className="text-lg font-black text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black tracking-tighter text-white">{tier.price}</span>
                    {tier.period && <span className="text-zinc-500 font-bold text-sm tracking-wide">{tier.period}</span>}
                  </div>
                  <p className="text-zinc-400 text-sm h-10">{tier.description}</p>
                </div>
                <div className="p-8 pb-10">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Includes</p>
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-0.5 ${tier.highlight ? "bg-[#C6FF3D]/20 text-[#C6FF3D]" : "bg-[#ffffff10] text-zinc-400"}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={`text-sm ${tier.highlight ? "text-zinc-200" : "text-zinc-400"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full h-12 flex items-center justify-center transition-all ${tier.highlight ? "bg-[#C6FF3D] text-black font-black uppercase tracking-widest hover:bg-white text-xs shadow-[0_0_20px_rgba(198,255,61,0.2)]" : "bg-[#ffffff05] border border-[#ffffff10] text-white font-bold hover:bg-[#ffffff10] text-xs"}`}>
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function LightPricing({ handleLogout, toggleTheme }: any) {
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-black font-sans flex selection:bg-[#C6FF3D] selection:text-black">
      <aside className="fixed left-0 top-0 h-full z-30 hidden md:flex flex-col border-r border-black/5 bg-[#F6F7F3] w-[64px] items-center py-8">
        <Link href="/dashboard" className="mb-12 group">
          <div className="w-10 h-10 bg-white border border-black/5 rounded-sm flex items-center justify-center p-2 group-hover:border-[#C6FF3D] transition-all shadow-[0_0_20px_rgba(198,255,61,0.3)]">
            <Image src="/logo.png" alt="Vibro" width={24} height={24} className="object-contain filter invert" />
          </div>
        </Link>
        <nav className="flex flex-col gap-6">
          {[
            { icon: Hexagon, label: "New Project", href: "/dashboard" },
            { icon: Layers, label: "Library", href: "/dashboard/library" },
            { icon: Paintbrush, label: "Studio", href: "/dashboard/studio" },
            { icon: Code2, label: "Export", href: "/dashboard/export" },
            { icon: CreditCard, label: "Pricing", href: "/dashboard/pricing", active: true },
            { icon: Settings2, label: "Settings", href: "/dashboard/settings" },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`w-11 h-11 flex items-center justify-center border transition-all group relative ${item.active ? "border-[#C6FF3D]/50 bg-[#C6FF3D]/10 text-black" : "border-transparent hover:border-black/5 hover:bg-black/5"}`}>
              <item.icon className={`w-5 h-5 ${item.active ? "text-black" : "text-zinc-400 group-hover:text-black"}`} />
              <span className="absolute left-[75px] bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-[5px_5px_0_#C6FF3D] rounded-sm group-hover:translate-x-0 translate-x-[-10px] transition-all">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pb-4 flex flex-col items-center gap-3">
          <button onClick={toggleTheme} title="Switch to Dark Mode" className="w-11 h-11 flex items-center justify-center border border-transparent hover:border-black/5 hover:bg-black/5 transition-all text-zinc-400 hover:text-black">
            <Moon className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[64px] px-10 pt-10 pb-20">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-12 text-center md:text-left">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">
              <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-black font-bold border-b-2 border-[#C6FF3D]">Pricing</span>
            </p>
            <h1 className="text-3xl font-black text-black tracking-tight mt-2 mb-4">Subscription Plans</h1>
            <p className="text-zinc-600 max-w-lg text-sm font-medium">Power up your design system generation with increased limits, advanced exports, and premium support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div key={tier.id} className={`relative flex flex-col border ${tier.highlight ? "border-[#C6FF3D] bg-white shadow-[10px_10px_0_#000000] z-10 scale-105" : "border-black/10 bg-white hover:border-black/20 hover:shadow-md transition-all"}`}>
                {tier.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C6FF3D] text-black text-[9px] font-black tracking-widest uppercase px-3 py-1 flex items-center gap-1 border border-black shadow-[2px_2px_0_#000]">
                    <Zap className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className="p-8 border-b border-black/5 flex-1">
                  <h3 className="text-lg font-black text-black mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black tracking-tighter text-black">{tier.price}</span>
                    {tier.period && <span className="text-zinc-500 font-bold text-sm tracking-wide">{tier.period}</span>}
                  </div>
                  <p className="text-zinc-600 text-sm h-10">{tier.description}</p>
                </div>
                <div className="p-8 pb-10 bg-[#fbfbfb]">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">Includes</p>
                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 rounded-full p-0.5 ${tier.highlight ? "bg-[#C6FF3D] text-black border border-black shadow-[1px_1px_0_#000]" : "bg-black/5 text-zinc-500"}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={`text-sm ${tier.highlight ? "text-black font-semibold" : "text-zinc-600"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full h-12 flex items-center justify-center transition-all ${tier.highlight ? "bg-black text-[#C6FF3D] font-black uppercase tracking-widest hover:bg-[#C6FF3D] hover:text-black border border-black shadow-[3px_3px_0_#000] active:translate-y-1 active:shadow-none text-xs" : "bg-white border text-black font-black uppercase tracking-widest hover:bg-black/5 text-xs shadow-sm"}`}>
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function PricingPageContent() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  if (theme === "light") {
    return <LightPricing handleLogout={handleLogout} toggleTheme={toggleTheme} />;
  }

  return <DarkPricing handleLogout={handleLogout} toggleTheme={toggleTheme} />;
}

export default function PricingRoute() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#050506]">
        <div className="w-8 h-8 rounded-full border-t border-[#C6FF3D] animate-spin" />
      </div>
    }>
      <PricingPageContent />
    </Suspense>
  );
}
