"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-[100] px-12 py-10 flex items-center justify-between pointer-events-none">

      {/* Container to handle events while the nav itself is transparent */}
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-dash-neon)] border-[3px] border-black rounded-xl flex items-center justify-center overflow-hidden">
            <div className="flex flex-col gap-1 w-6">
              <div className="h-1 bg-black rounded-full" />
              <div className="h-1 bg-black rounded-full" />
              <div className="h-1 bg-black rounded-full" />
            </div>
          </div>
          <span className="text-[28px] font-black font-poppins tracking-tighter text-black">Vibro.</span>
        </div>

        {/* Center: Search & Nav Links */}
        <div className="flex items-center gap-12">
          {/* Search Bar */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-[var(--color-dash-light-gray)] border-[3px] border-transparent focus-within:border-black rounded-full px-5 py-2.5 w-64 shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Ask Vibro: 'A sleek portfolio...'" 
                className="bg-transparent border-none outline-none text-[14px] font-inter font-semibold w-full placeholder:text-gray-400"
              />
              <div className="w-4 h-4 rounded bg-gray-200" /> {/* Command/Icon indicator */}
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="px-6 py-2.5 rounded-full border-[3.5px] border-black bg-black text-white font-bold font-inter text-[16px] shadow-[4px_4px_0_rgba(0,0,0,1)] hover:scale-105 transition-transform">
              Home
            </Link>
            <Link href="/browse" className="text-[var(--color-dash-gray)] font-bold font-inter text-[16px] hover:text-black transition-colors">
              Browse
            </Link>
            <Link href="/generator" className="text-[var(--color-dash-gray)] font-bold font-inter text-[16px] hover:text-black transition-colors">
              Generator
            </Link>
            <Link href="/console" className="text-[var(--color-dash-gray)] font-bold font-inter text-[16px] hover:text-black transition-colors">
              Console
            </Link>
          </div>
        </div>


        {/* Right: Sign Up */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[var(--color-dash-neon)] border-[3px] border-black rounded-full px-8 py-4 font-black font-inter text-[16px] uppercase tracking-wide shadow-[6px_6px_0_rgba(0,0,0,1)]"
        >
          Sign up for free
        </motion.button>
      </div>
    </nav>
  );
}
