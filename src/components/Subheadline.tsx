"use client";

import { motion } from "framer-motion";

export default function Subheadline() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="max-w-[900px] mx-auto text-center mt-12 px-12"
    >
      <p className="text-[22px] font-[600] font-inter text-[#818a91] leading-[1.6] tracking-tight">
        Transform your <span className="text-black font-[800]">visual ideas</span> into{" "}
        <span className="inline-block bg-black text-[#C6FF3D] font-black italic px-3 py-0.5 rounded-md mx-1">
          production-grade
        </span>{" "}
        React components instantly.
        <br />
        Optimized for{" "}
        <span className="relative inline-block text-black font-[800]">
          performance
          <span className="absolute -bottom-1 left-0 w-full h-[5px] bg-[#C6FF3D] -z-10" />
        </span>{" "}
        and high-velocity shipping.
      </p>

    </motion.div>

  );
}
