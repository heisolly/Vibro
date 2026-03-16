"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Upload, Cpu, Sliders, Download, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    num: "01",
    icon: Upload,
    label: "Describe or Upload",
    title: "Start With\nAny Input.",
    desc: "Type what you want to build in plain English, or upload a screenshot of any UI — a homepage, dashboard, app, or anything else.",
    detail: '"Dark FinTech dashboard with stat cards, sidebar nav, data charts"',
    detail2: "or drag + drop any UI screenshot →",
    bg: "bg-white",
    darkCard: false,
  },
  {
    num: "02",
    icon: Cpu,
    label: "AI Extracts + Generates",
    title: "Full System\nCreated.",
    desc: "Vibro analyzes your input and builds a complete, editable design system: colors, typography, spacing, border radius, shadows, component styles, and light/dark themes.",
    detail: "↳ Colors · Typography · Spacing · Radius · Shadows · Light/Dark",
    detail2: "31 tokens · 8 components · 2 themes",
    bg: "bg-[#0D0D0D]",
    darkCard: true,
  },
  {
    num: "03",
    icon: Sliders,
    label: "Edit Visually",
    title: "Customize\nEvery Token.",
    desc: "Open any component in the visual editor. Change text, swap colors, edit spacing, switch variants. Preview at Desktop, Tablet, and Mobile viewports in real-time.",
    detail: "Library → Editor → Component → Responsive Preview",
    detail2: "No code required",
    bg: "bg-white",
    darkCard: false,
  },
  {
    num: "04",
    icon: Download,
    label: "Export Anywhere",
    title: "Ship to\nAny Stack.",
    desc: "Export as detailed AI-ready prompts, structured JSON tokens, or install directly into your code editor with one CLI command. Zero copy-paste friction.",
    detail: "npx vibro-cli install --system fintech-dark --format css-vars,tailwind",
    detail2: "Cursor · VS Code · Next.js · Vercel · GitHub",
    bg: "bg-[#C6FF3D]",
    darkCard: false,
    accent: true,
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".hiw-badge", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: ".hiw-badge", start: "top 85%" } });
    gsap.fromTo(".hiw-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".hiw-title", start: "top 85%" } });
    gsap.fromTo(".hiw-step", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", scrollTrigger: { trigger: ".hiw-steps", start: "top 80%" } });
  }, { scope: sectionRef });

  return (
    <section id="features" ref={sectionRef} className="scroll-section py-32 sm:py-56 bg-[#FFFCF2] relative z-10 overflow-hidden font-space-grotesk border-y-[4px] border-black">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-28">
          <div className="hiw-badge inline-flex items-center gap-3 bg-black px-6 py-2 mb-8 shadow-[6px_6px_0_#C6FF3D] border-[2px] border-black">
            <Cpu className="w-4 h-4 text-[#C6FF3D]" />
            <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-[#C6FF3D]">Core Workflow</span>
          </div>
          <h2 className="hiw-title text-6xl sm:text-8xl font-[1000] text-black tracking-[-0.05em] leading-[0.85] uppercase mb-8">
            Four Steps.<br /><span className="text-black bg-[#C6FF3D] inline-block px-4 border-[3px] border-black shadow-[10px_10px_0_rgba(0,0,0,1)] mt-2">Real Results.</span>
          </h2>
          <p className="text-zinc-600 font-[700] italic text-xl max-w-2xl mx-auto uppercase tracking-tighter">
            "From raw idea or UI screenshot to a full, editable design system in under 60 seconds."
          </p>
        </div>

        {/* Steps */}
        <div className="hiw-steps relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className={`hiw-step relative border-[4px] border-black ${step.bg} ${step.darkCard ? "shadow-[8px_8px_0_#C6FF3D]" : step.accent ? "shadow-[8px_8px_0_rgba(0,0,0,1)]" : "shadow-[8px_8px_0_rgba(0,0,0,1)]"} p-8 group hover:-translate-y-2 transition-all duration-300 rounded-none`}>
                {/* Step number badge */}
                <div className="absolute -top-5 left-6">
                  <div className={`w-10 h-10 border-[3px] border-black flex items-center justify-center font-[900] text-[13px] shadow-[3px_3px_0_rgba(0,0,0,1)] ${step.accent ? "bg-black text-[#C6FF3D]" : "bg-[#C6FF3D] text-black"}`}>
                    {step.num}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-8 mt-5">
                  <div className={`w-14 h-14 border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0_rgba(0,0,0,1)] ${step.darkCard ? "bg-[#C6FF3D]" : step.accent ? "bg-black" : "bg-black"}`}>
                    <step.icon className={`w-7 h-7 ${step.darkCard || step.accent ? (step.darkCard ? "text-black" : "text-[#C6FF3D]") : "text-[#C6FF3D]"}`} />
                  </div>
                </div>

                {/* Label */}
                <div className={`text-[10px] font-[900] uppercase tracking-[0.4em] mb-3 ${step.darkCard ? "text-[#C6FF3D]" : step.accent ? "text-black/60" : "text-zinc-400"}`}>
                  # {step.label}
                </div>

                {/* Title */}
                <h3 className={`text-[2rem] font-[1000] uppercase tracking-tighter leading-[0.9] mb-6 whitespace-pre-line ${step.darkCard ? "text-white" : "text-black"}`}>
                  {step.title}
                </h3>

                {/* Desc */}
                <p className={`font-bold leading-relaxed mb-6 text-[13px] ${step.darkCard ? "text-zinc-400" : step.accent ? "text-black/70" : "text-zinc-600"}`}>
                  {step.desc}
                </p>

                {/* Code/Detail box */}
                <div className={`border-[2px] p-4 font-mono text-[10px] leading-relaxed mb-3 ${step.darkCard ? "border-zinc-800 bg-zinc-900 text-[#C6FF3D]" : step.accent ? "border-black/20 bg-black/10 text-black" : "border-black bg-white text-zinc-600 shadow-[3px_3px_0_rgba(0,0,0,0.08)]"}`}>
                  {step.detail}
                </div>

                {/* Sub-detail */}
                <p className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${step.darkCard ? "text-zinc-700" : step.accent ? "text-black/40" : "text-zinc-400"}`}>
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  {step.detail2}
                </p>

                {/* Arrow connector */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-[28px] top-20 w-12 h-12 bg-[#C6FF3D] border-[3px] border-black items-center justify-center z-20 shadow-[3px_3px_0_rgba(0,0,0,1)]">
                    <ArrowRight className="w-5 h-5 text-black stroke-[3]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-28">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-4 bg-black text-[#C6FF3D] font-[900] text-xl uppercase tracking-widest px-12 py-5 border-[3px] border-black shadow-[10px_10px_0_#C6FF3D] hover:shadow-[14px_14px_0_#C6FF3D] hover:-translate-y-1 transition-all group"
          >
            Start Building Free <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
