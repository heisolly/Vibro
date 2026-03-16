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
    avatarColor: "#3B5FFF",
    text: "No more manually copying messy CSS or re-implementing Figma tokens. I describe what I need and Vibro synthesizes production-ready React — with the right tokens baked in.",
    stat: "0 manual tokens",
  },
  {
    name: "Marcus Johnson",
    role: "Startup Founder",
    avatar: "MJ",
    avatarColor: "#ff4444",
    text: "The component library is genuinely premium. We went from MVP to a $2M seed round pitch deck in one weekend. Investors thought we had a 10-person design team.",
    stat: "$2M seed raised",
  },
  {
    name: "Priya Nair",
    role: "Lead Engineer @ Linear",
    avatar: "PN",
    avatarColor: "#a855f7",
    text: "The Export Center is insane. I pulled a full Tailwind config, CSS vars, and a CLI install command in one click. This is what DX should feel like.",
    stat: "3 export formats",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Heading reveal
    gsap.fromTo(".testimonial-heading",
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: ".testimonial-heading", start: "top 85%" }
      }
    );

    // Cards stagger
    gsap.fromTo(".testimonial-card",
      { y: 50, opacity: 0, scale: 0.96 },
      {
        y: 0, opacity: 1, scale: 1,
        duration: 0.9, stagger: 0.15, ease: "back.out(1.2)",
        scrollTrigger: { trigger: ".testimonial-grid", start: "top 85%" }
      }
    );

    // Marquee for stats
    gsap.to(".stats-marquee-inner", {
      x: "-50%",
      duration: 30,
      ease: "none",
      repeat: -1,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="scroll-section py-32 sm:py-48 bg-[#050506] relative overflow-hidden z-10">
      {/* BG accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C6FF3D]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C6FF3D]/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C6FF3D]/3 blur-[200px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="testimonial-heading text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 text-[#C6FF3D] px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            ◈ SIGNAL_VERIFIED
          </div>
          <h2 className="text-6xl sm:text-8xl font-[1000] text-white tracking-[-0.05em] leading-[0.85] uppercase mb-6">
            Architects <br /><span className="text-[#C6FF3D] [-webkit-text-stroke:2px_white]">Speak.</span>
          </h2>
          <p className="text-zinc-500 font-bold italic text-xl max-w-xl mx-auto">
            &ldquo;Real feedback from teams shipping with the Vibro engine.&rdquo;
          </p>
        </div>

        {/* Cards Grid */}
        <div className="testimonial-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card relative border border-[#ffffff08] bg-[#0d0d0f] p-10 group hover:border-[#C6FF3D]/20 transition-all duration-500">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent group-hover:from-[#C6FF3D]/0 group-hover:via-[#C6FF3D]/60 group-hover:to-[#C6FF3D]/0 transition-all duration-700" />

              <div className="flex items-start gap-5 mb-8">
                <div
                  className="w-14 h-14 rounded-sm flex items-center justify-center text-black font-black text-lg shrink-0 border-[3px] border-black"
                  style={{ backgroundColor: t.avatarColor }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-widest">{t.name}</p>
                  <p className="text-zinc-600 font-bold text-xs mt-0.5 italic">{t.role}</p>
                </div>
                <div className="ml-auto border border-[#C6FF3D]/20 bg-[#C6FF3D]/5 px-3 py-1">
                  <span className="text-[9px] font-black text-[#C6FF3D] uppercase tracking-widest">{t.stat}</span>
                </div>
              </div>

              <p className="text-zinc-400 font-bold leading-relaxed italic text-[15px]">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Corner decoration */}
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C6FF3D]/20 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          ))}
        </div>

        {/* Scrolling stats bar */}
        <div className="border-y border-[#ffffff08] py-5 overflow-hidden">
          <div className="stats-marquee-inner flex gap-16 whitespace-nowrap" style={{ width: "200%" }}>
            {[...Array(2)].map((_, gi) => (
              <div key={gi} className="flex gap-16 items-center">
                {[
                  { label: "Components Synthesized", val: "2.4M+" },
                  { label: "Teams Shipping", val: "12,000+" },
                  { label: "Avg Synthesis Time", val: "400ms" },
                  { label: "Design Tokens Generated", val: "890K+" },
                  { label: "CLI Installs", val: "340K+" },
                  { label: "Export Formats", val: "3" },
                  { label: "Uptime", val: "99.98%" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600">{s.label}:</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#C6FF3D]">{s.val}</span>
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
