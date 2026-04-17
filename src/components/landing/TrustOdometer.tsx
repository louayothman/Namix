
"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة
 */
function AnimatedDigit({ digit }: { digit: string }) {
  const isNumber = !isNaN(parseInt(digit));
  if (!isNumber) return <span className="inline-block px-0.5 text-[#f9a885]">{digit}</span>;
  const num = parseInt(digit);
  return (
    <div className="relative h-[1.1em] w-[0.65em] overflow-hidden inline-flex flex-col leading-none">
      <motion.div
        animate={{ y: `-${num * 10}%` }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="flex flex-col items-center w-full h-[1000%] absolute top-0 left-0"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-[10%] flex items-center justify-center font-black text-[#f9a885]">{n}</div>
        ))}
      </motion.div>
    </div>
  );
}

interface TrustOdometerProps {
  totalCount: string;
}

export function TrustOdometer({ totalCount }: TrustOdometerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-7xl md:text-[110px] lg:text-[130px] font-black tabular-nums tracking-tighter flex items-center justify-center h-[1.1em] overflow-hidden drop-shadow-[0_20px_50px_rgba(249,168,133,0.15)]"
      dir="ltr"
    >
      {totalCount.split("").map((char, i) => (
        <AnimatedDigit key={i} digit={char} />
      ))}
    </motion.div>
  );
}
