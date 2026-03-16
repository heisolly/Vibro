"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import GridBackground from "@/components/GridBackground";

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

/**
 * ManifestoSection - Brutalist Sharp Edition
 * High contrast dark mode with sharp edges.
 */
export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>(".manifesto-line");

    lines.forEach((line, i) => {
      gsap.fromTo(line,
        { opacity: 0.1, y: 40 },
        {
          opacity: 1, y: 0,
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

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="scroll-section relative bg-[#0D0D0D] overflow-hidden z-10 font-space-grotesk border-y-[4px] border-black">
      
      {/* ── GHOST GRID ── */}
      <GridBackground forceTheme="dark" />

      <div className="py-40 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-24">
          <div className="inline-flex items-center gap-3 bg-white text-black border-[3px] border-black px-6 py-2 text-[12px] font-[900] uppercase tracking-[0.4em] mb-16 shadow-[6px_6px_0_#C6FF3D]">
            ◈ CORE_DOCTRINE
          </div>
          {LINES.map((line, i) => (
            <div key={i} className="manifesto-line overflow-hidden mb-2">
              <span className={`block text-[8vw] sm:text-[9.5rem] font-[1000] uppercase tracking-[-0.04em] leading-[0.82] ${
                line.accent ? "text-black bg-[#C6FF3D] inline-block px-6 border-[4px] border-black shadow-[12px_12px_0_rgba(255,255,255,0.1)]" : "text-white"
              }`}>
                {line.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-32 pt-24 border-t-[4px] border-white/10">
          <p className="text-[#C6FF3D] font-[900] uppercase tracking-[0.5em] text-[12px] mb-12 lg:text-center">// NETWORK_SYNTHESIS_METRICS</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="bg-[#151515] p-10 border-[3px] border-white/5 hover:border-[#C6FF3D] transition-colors relative group shadow-[10px_10px_0_rgba(0,0,0,1)]">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-black border-[2px] border-white/10 flex items-center justify-center font-black text-[10px] text-zinc-500">
                    S_{i+1}
                </div>
                <div
                  className="stat-counter text-6xl sm:text-7xl font-[1000] text-white tracking-tighter mb-4"
                  data-target={s.target}
                  data-suffix={s.suffix}
                >
                  0{s.suffix}
                </div>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-[11px] leading-tight">{s.label}</p>
                <div className="mt-6 w-full h-[3px] bg-white/5 group-hover:bg-[#C6FF3D] transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
