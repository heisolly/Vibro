"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { TrendingUp, Activity } from "lucide-react";

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
  { label: "Systems Synthesized", target: 48000, suffix: "+" },
  { label: "Library Components", target: 1240, suffix: "+" },
  { label: "Synthesis Latency", target: 4.2, suffix: "ms" },
  { label: "Active Engineers", target: 12000, suffix: "+" },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
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
          let val = obj.val;
          if (target % 1 !== 0) {
             counter.innerText = val.toFixed(1) + suffix;
          } else {
             counter.innerText = Math.ceil(val).toLocaleString() + suffix;
          }
        },
      });
    });

    gsap.to(".bg-ghost-text", {
      y: -120,
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
    <section ref={sectionRef} className="relative bg-[#0a0a0b] overflow-hidden z-10 py-40 border-y border-white/5">
      {/* Giant BG ghost text */}
      <div className="bg-ghost-text absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-5">
        <span className="text-[35vw] font-[1000] text-white uppercase tracking-tighter whitespace-nowrap">VIBRO</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20">
          {/* Main manifesto */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-3 border border-white/5 bg-white/5 text-zinc-600 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] mb-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              ∅ CORE_PROTOCOL
            </div>
            {LINES.map((line, i) => (
              <div key={i} className="manifesto-line overflow-hidden">
                <span className={`block text-[10vw] lg:text-[10rem] font-[1000] uppercase tracking-tighter leading-[0.82] ${
                  line.accent ? "text-[#BAFF29]" : "text-white"
                }`}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>

          {/* Side metrics with trend lines */}
          <div className="lg:col-span-4 flex flex-col justify-end">
            <div className="space-y-16">
              {STATS.map((s, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="flex-1 h-px bg-white/5 group-hover:bg-[#BAFF29]/20 transition-colors" />
                     <TrendingUp className="w-3 h-3 text-[#BAFF29] opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div
                    className="stat-counter text-4xl sm:text-7xl font-[1000] text-white tracking-[-0.05em] mb-2"
                    data-target={s.target}
                    data-suffix={s.suffix}
                  >
                    0{s.suffix}
                  </div>
                  <div className="flex items-center gap-3">
                     <Activity className="w-3 h-3 text-[#BAFF29]/40" />
                     <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[9px]">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
    </section>
  );
}
