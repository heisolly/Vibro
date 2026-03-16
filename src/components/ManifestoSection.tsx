"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINES = [
  { text: "DESIGN IS", accent: false },
  { text: "DEAD CODE.", accent: true },
  { text: "VIBRO IS", accent: false },
  { text: "THE LIVING", accent: false },
  { text: "SYSTEM.", accent: true },
];

const STATS = [
  { label: "Components in Library",       target: 124,    suffix: "+" },
  { label: "AI Syntheses Per Day",         target: 48000,  suffix: "+" },
  { label: "Avg Delivery Time",            target: 400,    suffix: "ms" },
  { label: "Engineers Shipping With Vibro",target: 12000,  suffix: "+" },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Scroll-pinned manifesto text — each line reveals as you scroll
    const lines = gsap.utils.toArray<HTMLElement>(".manifesto-line");

    lines.forEach((line, i) => {
      gsap.fromTo(line,
        { opacity: 0.1, y: 40, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: line,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.04,
        }
      );
    });

    // Animated counters
    const counters = gsap.utils.toArray<HTMLElement>(".stat-counter");
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute("data-target") || "0");
      const suffix = counter.getAttribute("data-suffix") || "";
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: { trigger: counter, start: "top 85%" },
        onUpdate: () => {
          counter.innerText = target >= 1000
            ? Math.ceil(obj.val).toLocaleString() + suffix
            : Math.ceil(obj.val) + suffix;
        },
      });
    });

    // Background text float
    gsap.to(".bg-ghost-text", {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="scroll-section relative bg-black overflow-hidden z-10">
      {/* Giant BG ghost text */}
      <div className="bg-ghost-text absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[28vw] font-[1000] text-[#ffffff03] uppercase tracking-tighter whitespace-nowrap">VIBRO</span>
      </div>

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C6FF3D]/0 via-[#C6FF3D]/60 to-[#C6FF3D]/0" />

      {/* Main manifesto */}
      <div className="py-40 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 border border-[#ffffff10] text-zinc-600 px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] mb-16">
            ∅ CORE_DOCTRINE
          </div>
          {LINES.map((line, i) => (
            <div key={i} className="manifesto-line overflow-hidden">
              <span className={`block text-[9vw] sm:text-[8rem] font-[1000] uppercase tracking-tighter leading-[0.88] ${
                line.accent ? "text-[#C6FF3D]" : "text-white"
              }`}>
                {line.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-[#ffffff08] pt-16">
          <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px] mb-10">// NETWORK_METRICS</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#ffffff08]">
            {STATS.map((s, i) => (
              <div key={i} className="bg-black p-10 group hover:bg-[#0d0d0f] transition-colors">
                <div
                  className="stat-counter text-5xl sm:text-6xl font-[1000] text-white tracking-tighter mb-3"
                  data-target={s.target}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </div>
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">{s.label}</p>
                <div className="mt-4 w-8 h-[2px] bg-[#C6FF3D]/30 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative scan line */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_2px,rgba(255,255,255,0.01)_4px)]" />
      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C6FF3D]/0 via-[#C6FF3D]/60 to-[#C6FF3D]/0" />
    </section>
  );
}
