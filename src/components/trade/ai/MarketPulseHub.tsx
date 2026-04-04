
"use client";

import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة
 */
function AnimatedDigit({ digit, colorClass = "text-[#002d4d]" }: { digit: string, colorClass?: string }) {
  const isNumber = !isNaN(parseInt(digit)) && isFinite(Number(digit));
  if (!isNumber) return <span className={cn("inline-block px-0.5 select-none", colorClass)}>{digit}</span>;
  const num = parseInt(digit);
  return (
    <div className="relative h-[1.2em] w-[0.6em] overflow-hidden inline-flex flex-col select-none pointer-events-none align-baseline leading-none">
      <motion.div
        animate={{ y: `-${num * 10}%` }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="flex flex-col items-center w-full h-[1000%] absolute top-0 left-0"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className={cn("h-[10%] flex items-center justify-center font-black w-full", colorClass)}>
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

interface MarketPulseHubProps {
  price: number | null;
  turbulence: number;
}

export function MarketPulseHub({ price, turbulence }: MarketPulseHubProps) {
  // توليد مسار سائل مجهري يتغير مع نبض السعر
  const liquidPath = useMemo(() => {
    const points = Array.from({ length: 8 }).map((_, i) => 
      `${i * 14},${15 + Math.sin(Date.now() / 400 + i) * (3 + turbulence / 12)}`
    ).join(' L ');
    return `M 0,20 L ${points}`;
  }, [turbulence, price]);

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/50 rounded-[24px] border border-gray-100 shadow-inner group font-body tracking-normal" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-sm relative overflow-hidden">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(59,130,246,0.05)_180deg,transparent_360deg)]"
           />
           <Waves size={16} className="text-blue-500 relative z-10 animate-pulse" />
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-[#002d4d] leading-none tracking-normal">نبض الأسواق</p>
           <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest mt-1 tracking-normal">Live Pulse</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
         {/* الرسم البياني السائل المجهري */}
         <div className="h-6 w-12 relative overflow-hidden opacity-30 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 40" className="h-full w-full">
               <motion.path
                 d={liquidPath}
                 fill="none"
                 stroke="#3b82f6"
                 strokeWidth="2.5"
                 strokeLinecap="round"
                 animate={{ d: liquidPath }}
                 transition={{ duration: 0.4 }}
               />
            </svg>
         </div>

         <div className="h-6 w-px bg-gray-200" />

         {/* العداد السعري الميكانيكي بفاصلتين */}
         <div className="text-right">
            <p className="text-[6px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1 tracking-normal">Price</p>
            <div className="flex items-center text-[15px] font-black text-[#002d4d] tabular-nums tracking-tighter h-[1.2em] leading-none" dir="ltr">
               <span className="text-[10px] mr-0.5 opacity-30">$</span>
               {price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split("").map((char, i) => (
                 <AnimatedDigit key={i} digit={char} />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
