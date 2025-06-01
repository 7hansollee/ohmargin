"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OhMarginLoading() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative flex items-center">
        <span className="text-6xl font-bold text-[#3182f6] select-none">
          Oh! 마진
        </span>
        <span className="relative w-12 h-12 flex items-center justify-start">
          {Array.from({ length: dotCount }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: i * 0.05 }}
              className="absolute left-0 top-0 text-6xl font-bold text-[#3182f6] select-none"
              style={{ left: `${i * 0.5}em` }}
            >
              .
            </motion.span>
          ))}
        </span>
      </div>
    </div>
  );
} 