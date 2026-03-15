"use client";

import { motion } from "framer-motion";

export default function CompilingBadge() {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, x: -50 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: [0, -8, 0] 
      }}
      transition={{
        opacity: { duration: 0.5, delay: 1 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      className="absolute bottom-12 left-12 z-[60] bg-black text-white px-6 py-3 rounded-full border-[3.5px] border-black flex items-center gap-3 shadow-[6px_6px_0_rgba(0,0,0,1)] cursor-grab hover:scale-105 transition-transform"
    >
      <motion.div 
        animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }} 
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-3 h-3 rounded-full bg-[#FFB13A] shadow-[0_0_10px_#FFB13A]" 
      />
      <span className="text-[16px] font-black font-inter tracking-tight">Compiling...</span>
    </motion.div>

  );
}
