"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

interface OverlayCardProps {
  children: ReactNode;
  className?: string;
  initialX?: number;
  initialY?: number;
  rotation?: number;
}

export default function OverlayCard({ 
  children, 
  className = "", 
  initialX = 0, 
  initialY = 0,
  rotation = 0
}: OverlayCardProps) {
  const [duration, setDuration] = useState(3);

  useEffect(() => {
    setDuration(3 + Math.random() * 2);
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, rotate: rotation, opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [initialY - 10, initialY + 10, initialY - 10], // Floating animation
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: {
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}

      whileHover={{ scale: 1.03, zIndex: 50 }}
      whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 100 }}
      className={`
        absolute z-20 bg-white border-[3.5px] border-black 
        rounded-2xl p-4 shadow-[8px_8px_0_rgba(0,0,0,1)] cursor-grab

        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
