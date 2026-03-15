"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 pointer-events-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Logo Box */}
        <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md border-[3px] border-black rounded-3xl px-6 py-3 shadow-[6px_6px_0_rgba(0,0,0,1)]">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Stacked Hexagons */}
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12L32 19V31L20 38L8 31V19L20 12Z" fill="#000000" />
              <path d="M20 7L32 14V26L20 33L8 26V14L20 7Z" fill="#C6FF3D" stroke="#000000" strokeWidth="2.5" />
              <path d="M20 2L32 9V21L20 28L8 21V9L20 2Z" fill="#C6FF3D" stroke="#000000" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[22px] font-[900] font-poppins text-black leading-none tracking-tight">Vibro</span>
            <div className="h-1 w-full bg-[#C6FF3D] mt-0.5 rounded-full" />
          </div>
        </div>

        {/* Center: Search & Nav Cluster */}
        <div className="hidden lg:flex items-center gap-4 bg-white/80 backdrop-blur-md border-[3px] border-black rounded-[2.5rem] px-4 py-2 shadow-[8px_8px_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 bg-[#F3F3F3] rounded-full px-5 py-2.5 border-[2px] border-black/5 hover:border-black/10 transition-all">
            <Search className="w-4 h-4 text-[#888888]" />
            <input 
              type="text" 
              placeholder="A sleek portfolio..." 
              className="bg-transparent border-none outline-none text-[15px] font-poppins font-[600] w-[180px] placeholder:text-[#888888]"
            />
            <div className="bg-black/5 rounded px-1.5 py-0.5 text-[10px] font-black text-[#888888]">/</div>
          </div>

          <div className="flex items-center gap-4 px-2">
            <Link 
              href="/" 
              className="bg-black text-[#C6FF3D] px-6 py-2 rounded-full font-[800] text-[15px] font-poppins"
            >
              Home
            </Link>
            <Link href="/dashboard" className="text-[#888888] font-[700] hover:text-black transition-colors text-[15px]">Engine</Link>
            <Link href="/archives" className="text-[#888888] font-[700] hover:text-black transition-colors text-[15px]">Archives</Link>
          </div>
        </div>


        {/* Right: CTA */}
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#C6FF3D] border-[4px] border-black rounded-full px-8 py-3.5 font-[900] font-poppins text-[18px] text-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[10px_10px_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 pointer-events-auto"
          >
            Get Started
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </motion.button>
        </Link>

      </div>
    </nav>
  );
}
