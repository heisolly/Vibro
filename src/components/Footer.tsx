"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".footer-item", {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 98%",
        toggleActions: "play none none reverse",
      },
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.out",
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative z-20 bg-black py-10 border-t-[3.5px] border-black overflow-hidden">
      {/* Subtle Grainy Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left: Brand */}
          <div className="footer-item flex items-center gap-6">
            <Link href="/" className="flex items-center gap-4 text-xl font-black text-white uppercase tracking-tighter hover:scale-105 transition-transform">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black border-2 border-white/20 shadow-[3px_3px_0_rgba(184,247,36,0.5)] overflow-hidden p-1">
                <Image 
                  src="/logo.png" 
                  alt="Vibro Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
              </div>
              <span>VIBRO<span className="text-[#b8f724]">.</span></span>
            </Link>
            <div className="hidden sm:block h-8 w-px bg-white/10" />
            <p className="hidden sm:block text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Neural_Synthesis_v4</p>
          </div>

          {/* Center: Simplified Links */}
          <div className="footer-item flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {['Archives', 'Protocols', 'Laboratory', 'Manifesto'].map((label) => (
              <Link 
                key={label} 
                href={`/${label.toLowerCase()}`}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#b8f724] transition-colors"
                aria-label={`View ${label}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Operational Status & Legal */}
          <div className="footer-item flex items-center gap-8">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#b8f724] animate-pulse" />
              <span className="text-[9px] font-black text-[#b8f724] uppercase tracking-widest">Systems_Optimal</span>
            </div>
            
            <div className="h-4 w-px bg-white/10 hidden lg:block" />
            
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] hidden lg:block">
              &copy; {new Date().getFullYear()} VIBRO_LABS
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

