"use client";

import { motion } from "framer-motion";

export default function Subheadline() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="max-w-[1000px] mx-auto text-center mt-12 px-12"
    >
      <p className="text-[24px] font-bold font-inter text-[var(--color-dash-gray)] leading-relaxed tracking-tight">
        Transform your <span className="text-black font-extrabold">visual ideas</span> into{" "}
        <span className="text-[var(--color-dash-neon)] italic font-black bg-black px-2 py-0.5 rounded ml-1 mr-1">
          production-grade
        </span>{" "}
        React components instantly. Optimized for{" "}
        <span className="text-black font-black underline decoration-[4px] decoration-[var(--color-dash-neon)] underline-offset-[6px]">
          performance
        </span>{" "}
        and high-velocity shipping.
      </p>
    </motion.div>
  );
}
