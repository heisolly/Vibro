"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Frontend Engineer @ Stripe",
    avatar: "AR",
    avatarColor: "#C6FF3D",
    text: "Vibro completely changed how we build UI. The neural synthesis combined with instant CLI access is a game-changer. What took us 2 weeks now takes 400ms.",
    stat: "2 weeks → 400ms",
  },
  {
    name: "Sarah Chen",
    role: "Design Technologist @ Vercel",
    avatar: "SC",
    avatarColor: "#FFFFFF",
    text: "No more manually copying messy CSS or re-implementing Figma tokens. I describe what I need and Vibro synthesizes production-ready React — with the right tokens baked in.",
    stat: "0 manual tokens",
  },
  {
    name: "Marcus Johnson",
    role: "Startup Founder",
    avatar: "MJ",
    avatarColor: "#C6FF3D",
    text: "The component library is genuinely premium. We went from MVP to a $2M seed round pitch deck in one weekend. Investors thought we had a 10-person design team.",
    stat: "$2M seed raised",
  },
  {
    name: "Priya Nair",
    role: "Lead Engineer @ Linear",
    avatar: "PN",
    avatarColor: "#FFFFFF",
    text: "The Export Center is insane. I pulled a full Tailwind config, CSS vars, and a CLI install command in one click. This is what DX should feel like.",
    stat: "3 export formats",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".testimonial-heading",
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".testimonial-heading", start: "top 85%" }
      }
    );

    gsap.fromTo(".testimonial-card",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.9, stagger: 0.15, ease: "power4.out",
        scrollTrigger: { trigger: ".testimonial-grid", start: "top 85%" }
      }
    );

    gsap.to(".stats-marquee-inner", {
      x: "-50%",
      duration: 30,
      ease: "none",
      repeat: -1,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="scroll-section py-32 sm:py-48 bg-[#0D0D0D] relative overflow-hidden z-10 font-space-grotesk border-y-[4px] border-black">
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="testimonial-heading text-center mb-24">
          <div className="inline-flex items-center gap-3 bg-white text-black border-[3px] border-black px-6 py-2 text-[12px] font-[900] uppercase tracking-[0.4em] mb-10 shadow-[6px_6px_0_#C6FF3D]">
            ◈ SIGNAL_VERIFIED
          </div>
          <h2 className="text-6xl sm:text-8xl font-[1000] text-white tracking-[-0.05em] leading-[0.85] uppercase mb-8">
            Engineers <br /><span className="text-black bg-[#C6FF3D] inline-block px-4 border-[3px] border-black shadow-[10px_10px_0_rgba(255,255,255,0.1)] mt-2">Verified.</span>
          </h2>
          <p className="text-zinc-500 font-bold italic text-xl max-w-xl mx-auto uppercase tracking-tighter">
            &ldquo;Real feedback from teams shipping with the Vibro engine.&rdquo;
          </p>
        </div>

        {/* Cards Grid */}
        <div className="testimonial-grid grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card relative border-[3px] border-white/10 bg-[#151515] p-10 group hover:border-[#C6FF3D] transition-all duration-500 shadow-[10px_10px_0_rgba(0,0,0,0.5)]">
              
              {/* Corner Index */}
              <div className="absolute -top-[2px] -left-[2px] w-12 h-12 bg-black border-b-[3px] border-r-[3px] border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-500 group-hover:bg-[#C6FF3D] group-hover:text-black group-hover:border-[#C6FF3D] transition-colors">
                TR_{i+1}
              </div>

              <div className="flex items-start gap-6 mb-10 pt-4">
                <div
                  className="w-16 h-16 rounded-none flex items-center justify-center text-black font-[900] text-xl shrink-0 border-[3px] border-black shadow-[4px_4px_0_rgba(255,255,255,0.1)]"
                  style={{ backgroundColor: t.avatarColor }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-[900] text-[17px] uppercase tracking-tighter">{t.name}</p>
                  <p className="text-zinc-500 font-bold text-sm mt-0.5 italic">{t.role}</p>
                </div>
                <div className="ml-auto bg-black border-[2px] border-white/10 px-4 py-1.5 shadow-[4px_4px_0_rgba(0,0,0,1)]">
                  <span className="text-[10px] font-black text-[#C6FF3D] uppercase tracking-widest">{t.stat}</span>
                </div>
              </div>

              <p className="text-zinc-400 font-bold leading-relaxed italic text-[18px]">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="mt-10 pt-6 border-t-[2px] border-white/5 flex items-center justify-between">
                <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <div key={s} className="w-2 h-2 bg-[#C6FF3D] border border-black" />)}
                </div>
                <span className="text-[9px] font-black uppercase text-zinc-700 tracking-[0.3em]">Status: Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scrolling stats bar */}
        <div className="border-y-[3px] border-white/10 py-8 overflow-hidden bg-black/40">
          <div className="stats-marquee-inner flex gap-20 whitespace-nowrap" style={{ width: "200%" }}>
            {[...Array(2)].map((_, gi) => (
              <div key={gi} className="flex gap-20 items-center">
                {[
                  { label: "Components Synthesized", val: "2.4M+" },
                  { label: "Teams Shipping", val: "12,000+" },
                  { label: "Avg Synthesis Time", val: "400ms" },
                  { label: "Design Tokens Generated", val: "890K+" },
                  { label: "CLI Installs", val: "340K+" },
                  { label: "Uptime", val: "99.98%" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-6">
                    <div className="w-2.5 h-2.5 bg-[#C6FF3D] border-[2px] border-black" />
                    <span className="text-[12px] font-black uppercase tracking-widest text-zinc-500">{s.label}:</span>
                    <span className="text-[12px] font-black uppercase tracking-widest text-[#C6FF3D]">{s.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
