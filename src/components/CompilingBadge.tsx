"use client";

import { motion } from "framer-motion";

export default function CompilingBadge() {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: [0, -5, 0] 
      }}
      transition={{
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      className="absolute bottom-12 left-12 z-30 bg-[#222] text-white px-4 py-2 rounded-full border-[3px] border-black flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] cursor-grab"
    >
      <motion.div 
        animate={{ scale: [1, 1.3, 1] }} 
        transition={{ duration: 1, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-[var(--color-dash-orange)]" 
      />
      <span className="text-[14px] font-bold font-inter tracking-tight">Compiling...</span>
    </motion.div>
  );
}
