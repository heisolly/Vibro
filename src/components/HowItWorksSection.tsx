"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { UploadCloud, Layers, Terminal, ArrowRight, MousePointer2 } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    num: "01",
    label: "Input",
    title: "Multimodal\nEntry.",
    desc: "Drop a URL, upload a screenshot, or type a prompt. Vibro's Visual Synthesis Protocol extracts the design DNA instantly.",
    color: "#BAFF29",
    bg: "bg-[#0a0a0b]",
    content: (
      <div className="relative w-full h-32 bg-zinc-900 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#BAFF29]/5 animate-pulse" />
        <UploadCloud className="w-8 h-8 text-[#BAFF29]" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/80 px-2 py-1 rounded-md">
           <div className="w-1 h-1 rounded-full bg-[#BAFF29]" />
           <span className="text-[7px] font-black text-white uppercase tracking-widest">Scanning_DNA</span>
        </div>
      </div>
    )
  },
  {
    num: "02",
    label: "Studio",
    title: "System\nSynthesis.",
    desc: "The engine generates a complete atomic design system. Infinite control over tokens, components, and global architecture.",
    color: "#ffffff",
    bg: "bg-[#0a0a0b]",
    content: (
      <div className="w-full h-32 bg-zinc-900 rounded-xl border border-white/10 p-4 grid grid-cols-2 gap-3">
         <div className="space-y-2">
            <div className="h-1 w-8 bg-[#BAFF29]" />
            <div className="h-1 w-12 bg-white/20" />
            <div className="h-1 w-10 bg-white/10" />
         </div>
         <div className="grid grid-cols-3 gap-1">
            {[1,2,3,4,5,6].map(i => <div key={i} className={`aspect-square rounded-sm ${i === 1 ? 'bg-[#BAFF29]' : 'bg-white/5'}`} />)}
         </div>
      </div>
    )
  },
  {
    num: "03",
    label: "Ship",
    title: "CLI-Powered\nDeployment.",
    desc: "Pull your synthesized library directly into your codebase with a single command. Production-ready React and CSS.",
    color: "#BAFF29",
    bg: "bg-black",
    content: (
      <div className="w-full h-32 bg-black rounded-xl border border-[#BAFF29]/20 p-4 font-mono text-[9px] flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <span className="text-[#BAFF29]">❯</span>
            <span className="text-white">npx vibro pull --prod</span>
         </div>
         <div className="text-zinc-500 italic">
            [1/3] Fetching tokens... <br />
            [2/3] Building library... <br />
            [3/3] Success. 
         </div>
      </div>
    )
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".hiw-badge",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2)", scrollTrigger: { trigger: ".hiw-badge", start: "top 85%" } }
    );

    gsap.fromTo(".hiw-step",
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1, stagger: 0.2, ease: "expo.out",
        scrollTrigger: { trigger: ".hiw-steps", start: "top 80%" }
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-40 bg-[#0a0a0b] relative z-10 overflow-hidden border-y border-white/5">
      {/* Background Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-32">
          <div className="hiw-badge inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Layers className="w-4 h-4 text-[#BAFF29]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">The_Synthesis_Loop</span>
          </div>
          <h2 className="text-6xl sm:text-8xl font-[1000] text-white tracking-[-0.05em] leading-[0.85] uppercase mb-10">
            Three Steps. <br /><span className="text-[#0a0a0b]" style={{ WebkitTextStroke: "2px white" }}>Beyond Engineering.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="hiw-steps grid grid-cols-1 lg:grid-cols-3 gap-10">
          {STEPS.map((step, i) => (
            <div key={i} className={`hiw-step relative border-[3px] border-white/10 ${step.bg} p-10 group hover:border-[#BAFF29]/40 transition-all duration-500`}>
              <div className="absolute -top-5 left-8 bg-[#0a0a0b] border-[2px] border-white/10 px-4 py-1 font-mono text-[10px] font-black text-[#BAFF29]">
                STEP::{step.num}
              </div>

              <div className="mb-10 w-full pt-4">
                 {step.content}
              </div>

              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">
                ◈ {step.label}
              </div>

              <h3 className="text-4xl font-[1000] text-white uppercase tracking-tighter leading-[0.9] mb-6 whitespace-pre-line">
                {step.title}
              </h3>

              <p className="font-bold leading-relaxed text-zinc-500 italic text-sm">
                {step.desc}
              </p>

              {/* Connector lines on hover */}
              <div className="absolute bottom-0 left-0 h-1 bg-[#BAFF29] w-0 group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>

        {/* Action */}
        <div className="text-center mt-32">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-4 bg-white text-black font-black text-xl uppercase tracking-[0.2em] px-14 py-7 hover:bg-[#BAFF29] transition-all group shadow-[20px_20px_0_rgba(255,255,255,0.05)]"
          >
            Initiate Synthesis <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
