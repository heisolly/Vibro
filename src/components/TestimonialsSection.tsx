"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Quote, CheckCircle2 } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Frontend Engineer @ Stripe",
    avatar: "AR",
    avatarColor: "#BAFF29",
    text: "Vibro completely changed how we build UI. The neural synthesis combined with instant CLI access is a game-changer. What took us 2 weeks now takes 4ms.",
    stat: "2 weeks → 4ms",
  },
  {
    name: "Sarah Chen",
    role: "Design Technologist @ Vercel",
    avatar: "SC",
    avatarColor: "#ffffff",
    text: "No more manually copying messy CSS or re-implementing Figma tokens. I describe what I need and Vibro synthesizes production-ready React — with the right tokens baked in.",
    stat: "0 manual tokens",
  },
  {
    name: "Marcus Johnson",
    role: "Startup Founder",
    avatar: "MJ",
    avatarColor: "#BAFF29",
    text: "The component library is genuinely premium. We went from MVP to a $2M seed round pitch deck in one weekend. Investors thought we had a 10-person design team.",
    stat: "$2M seed raised",
  },
  {
    name: "Priya Nair",
    role: "Lead Engineer @ Linear",
    avatar: "PN",
    avatarColor: "#ffffff",
    text: "The Export Center is insane. I pulled a full Tailwind config, CSS vars, and a CLI install command in one click. This is what DX should feel like.",
    stat: "3 export formats",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".testimonial-card",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.9, stagger: 0.15, ease: "expo.out",
        scrollTrigger: { trigger: ".testimonial-grid", start: "top 85%" }
      }
    );

    gsap.to(".stats-marquee-inner", {
      x: "-50%",
      duration: 40,
      ease: "none",
      repeat: -1,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-40 bg-[#0a0a0b] relative overflow-hidden z-10 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center mb-32">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            ◈ FEEDBACK_LOOP
          </div>
          <h2 className="text-6xl sm:text-[10rem] font-[1000] text-white tracking-[-0.07em] leading-[0.8] uppercase mb-10 italic">
            Engineered <br /><span className="text-[#0a0a0b]" style={{ WebkitTextStroke: "3px white" }}>Trust.</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="testimonial-grid grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card relative border-2 border-white/5 bg-[#0e0e0f] p-12 group hover:border-[#BAFF29]/40 transition-all duration-700 rounded-[2.5rem] overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Quote className="w-24 h-24 text-white" />
              </div>

              <div className="flex items-start justify-between mb-10 relative z-10">
                <div className="flex items-center gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#0a0a0b] font-black text-xl shrink-0"
                    style={{ backgroundColor: t.avatarColor }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-black text-lg uppercase tracking-tight">{t.name}</p>
                    <p className="text-zinc-600 font-bold text-xs mt-0.5 italic">{t.role}</p>
                  </div>
                </div>
                <div className="border border-[#BAFF29]/20 bg-[#BAFF29]/5 px-4 py-1.5 rounded-full flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-[#BAFF29] animate-pulse" />
                   <span className="text-[10px] font-black text-[#BAFF29] uppercase tracking-widest">{t.stat}</span>
                </div>
              </div>

              <p className="text-zinc-400 font-bold leading-relaxed italic text-lg relative z-10 max-w-lg">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Scrolling stats bar */}
        <div className="border-y border-white/5 py-10 overflow-hidden relative">
          <div className="stats-marquee-inner flex gap-20 whitespace-nowrap" style={{ width: "200%" }}>
            {[...Array(2)].map((_, gi) => (
              <div key={gi} className="flex gap-20 items-center">
                {[
                  { label: "Systems Synthesized", val: "48K+" },
                  { label: "Teams Shipping", val: "12,000+" },
                  { label: "Design DNA Mapped", val: "890K+" },
                  { label: "Protocol Latency", val: "4.2ms" },
                  { label: "Active Deployments", val: "1.2M+" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <CheckCircle2 className="w-4 h-4 text-[#BAFF29]" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600">{s.label}:</span>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white">{s.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
