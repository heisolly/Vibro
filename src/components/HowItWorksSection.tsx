"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MessageSquare, Cpu, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    num: "01",
    icon: MessageSquare,
    label: "Describe",
    title: "Speak\nYour Intent.",
    desc: "Type a plain-English prompt or drop a screenshot. No Figma. No design specs. Just describe what you want to build.",
    detail: "\"Dark glassmorphic dashboard with stat cards, sidebar nav, and a top search bar\"",
    color: "#C6FF3D",
    bg: "bg-white",
    border: "border-black",
    shadow: "shadow-[10px_10px_0_#C6FF3D]",
  },
  {
    num: "02",
    icon: Cpu,
    label: "Synthesize",
    title: "Neural\nMapping.",
    desc: "Vibro's AI engine extracts design tokens, generates component trees, applies your design system rules, and maps to production React.",
    detail: "↳ Token extraction → Component graph → Layout synthesis → Code output",
    color: "#3B5FFF",
    bg: "bg-black",
    border: "border-[#3B5FFF]",
    shadow: "shadow-[10px_10px_0_rgba(59,95,255,0.3)]",
  },
  {
    num: "03",
    icon: Download,
    label: "Ship",
    title: "Deploy\nInstantly.",
    desc: "Pull the generated system via CLI, copy as a structured AI prompt, or export JSON tokens. One command and you're live.",
    detail: "npx vibro-cli install --system my-system --format css-vars,tailwind",
    color: "#C6FF3D",
    bg: "bg-white",
    border: "border-black",
    shadow: "shadow-[10px_10px_0_#C6FF3D]",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".hiw-badge",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: ".hiw-badge", start: "top 85%" } }
    );
    gsap.fromTo(".hiw-title",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".hiw-title", start: "top 85%" } }
    );

    // Steps animate in with stagger
    gsap.fromTo(".hiw-step",
      { y: 80, opacity: 0, rotateX: 8 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 1, stagger: 0.2, ease: "expo.out",
        scrollTrigger: { trigger: ".hiw-steps", start: "top 80%" }
      }
    );

    // Connector line draw
    gsap.fromTo(".hiw-connector",
      { scaleX: 0 },
      {
        scaleX: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: ".hiw-steps", start: "top 70%" }
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="scroll-section py-32 sm:py-56 bg-[#FAFAF8] relative z-10 overflow-hidden">
      {/* BG grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="hiw-badge inline-flex items-center gap-3 bg-black px-5 py-2 mb-8 shadow-[6px_6px_0_#C6FF3D]">
            <Cpu className="w-4 h-4 text-[#C6FF3D]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C6FF3D]">How_Synthesis_Works</span>
          </div>
          <h2 className="hiw-title text-6xl sm:text-8xl font-[1000] text-black tracking-[-0.05em] leading-[0.85] uppercase mb-8">
            Three Steps. <br /><span className="text-white [-webkit-text-stroke:2px_black]">Zero Bloat.</span>
          </h2>
          <p className="text-zinc-500 font-bold italic text-xl max-w-2xl mx-auto">
            &ldquo;From raw idea to production-ready React component in under a minute.&rdquo;
          </p>
        </div>

        {/* Steps */}
        <div className="hiw-steps relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[88px] left-[16.66%] right-[16.66%] h-[3px] bg-black hiw-connector origin-left" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className={`hiw-step relative border-[4px] ${step.border} ${step.bg} ${step.shadow} p-10 group hover:-translate-y-2 transition-all duration-300`} style={{ perspective: "800px" }}>
                {/* Step number */}
                <div className="absolute -top-5 left-8">
                  <div className={`w-10 h-10 border-[3px] border-black flex items-center justify-center font-black text-[11px] bg-white z-10 relative`}>
                    {step.num}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-8 mt-4">
                  <div
                    className="w-16 h-16 border-[3px] border-black flex items-center justify-center"
                    style={{ backgroundColor: step.color }}
                  >
                    <step.icon className="w-8 h-8 text-black" />
                  </div>
                </div>

                <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${step.bg === "bg-black" ? "text-[#3B5FFF]" : "text-zinc-400"}`}>
                  ◈ {step.label}
                </div>

                <h3 className={`text-4xl font-[1000] uppercase tracking-tighter leading-[0.9] mb-6 whitespace-pre-line ${step.bg === "bg-black" ? "text-white" : "text-black"}`}>
                  {step.title}
                </h3>

                <p className={`font-bold leading-relaxed mb-8 ${step.bg === "bg-black" ? "text-zinc-400" : "text-zinc-500"} italic`}>
                  {step.desc}
                </p>

                <div className={`border p-4 font-mono text-[10px] leading-relaxed ${step.bg === "bg-black" ? "border-[#ffffff10] text-[#3B5FFF]/80 bg-[#080809]" : "border-black/10 text-zinc-500 bg-zinc-50"}`}>
                  {step.detail}
                </div>

                {/* Arrow between steps */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-[28px] top-20 w-12 h-12 bg-[#C6FF3D] border-[3px] border-black items-center justify-center z-20">
                    <ArrowRight className="w-5 h-5 text-black" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-4 bg-black text-[#C6FF3D] font-black text-lg uppercase tracking-widest px-12 py-6 border-[3px] border-black shadow-[8px_8px_0_#C6FF3D] hover:shadow-[12px_12px_0_#C6FF3D] hover:-translate-y-1 transition-all"
          >
            Start Synthesizing Now <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </section>
  );
}
