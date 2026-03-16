"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * Navbar - Brutalist Sharp Edition
 * Redesigned with sharp edges, high contrast, and hard shadows.
 */
export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 pointer-events-none font-space-grotesk">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Logo Box (Brutalist Sharp) */}
        <div className="flex items-center gap-6 bg-white border-[3px] border-black rounded-none px-6 py-3 shadow-[6px_6px_0_rgba(0,0,0,1)]">
          <div className="relative w-8 h-8 flex items-center justify-center bg-[#C6FF3D] border-[2px] border-black p-1 shadow-[3px_3px_0_rgba(0,0,0,1)]">
            <img src="/logo.png" alt="Vibro Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center">
            <span className="text-[22px] font-[900] text-black uppercase tracking-[-0.03em]">Vibro</span>
            <div className="w-2 h-2 bg-[#C6FF3D] border border-black ml-1" />
          </div>
        </div>

        {/* Center: Nav Cluster (Brutalist Capsules) */}
        <div className="hidden lg:flex items-center gap-6 bg-white border-[3px] border-black rounded-none px-2 py-2 shadow-[8px_8px_0_rgba(0,0,0,1)]">
          {/* Search Cluster (Sharp) */}
          <div className="flex items-center gap-2 bg-[#F3F3F3] rounded-none px-5 py-2.5 border-[2px] border-black">
            <Search className="w-4 h-4 text-black" />
            <input 
              type="text" 
              placeholder="A sleek portfolio..." 
              className="bg-transparent border-none outline-none text-[15px] font-[700] w-[180px] placeholder:text-zinc-500 uppercase tracking-tight"
            />
            <div className="bg-black text-[#C6FF3D] rounded-none px-2 py-0.5 text-[10px] font-black border border-black">/</div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-2 px-2">
            <Link 
              href="/" 
              className="bg-black text-[#C6FF3D] px-6 py-2.5 rounded-none font-[900] text-[14px] uppercase border-[2px] border-black"
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="text-black font-[800] hover:bg-black hover:text-[#C6FF3D] px-4 py-2 transition-all text-[14px] uppercase rounded-none"
            >
              Engine
            </Link>
            <Link 
              href="/archives" 
              className="text-black font-[800] hover:bg-black hover:text-[#C6FF3D] px-4 py-2 transition-all text-[14px] uppercase rounded-none"
            >
              Archives
            </Link>
          </div>
        </div>

        {/* Right: CTA (Neobrutalist Sharp) */}
        <Link href="/dashboard">
          <motion.button
            whileHover={{ translateX: -4, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#C6FF3D] border-[4px] border-black rounded-none px-8 py-3.5 font-[900] text-[18px] text-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[10px_10px_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 pointer-events-auto uppercase tracking-tighter"
          >
            Get Started
            <ChevronRight className="w-5 h-5 stroke-[4]" />
          </motion.button>
        </Link>

      </div>
    </nav>
  );
}
