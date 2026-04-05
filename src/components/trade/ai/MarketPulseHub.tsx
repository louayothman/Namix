"use client";

import { motion } from "framer-motion";
import { Waves, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect, useRef } from "react";

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة
 */
function AnimatedDigit({ digit, colorClass = "text-[#f9a885]" }: { digit: string, colorClass?: string }) {
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
  const [isUp, setIsUp] = useState(true);
  const prevPriceRef = useRef<number | null>(null);

  useEffect(() => {
    if (price !== null && prevPriceRef.current !== null) {
      if (price > prevPriceRef.current) setIsUp(true);
      else if (price < prevPriceRef.current) setIsUp(false);
    }
    prevPriceRef.current = price;
  }, [price]);

  const liquidPath = useMemo(() => {
    const points = Array.from({ length: 10 }).map((_, i) => 
      `${i * 12},${15 + Math.sin(Date.now() / 300 + i) * (4 + turbulence / 10)}`
    ).join(' L ');
    return `M 0,20 L ${points}`;
  }, [turbulence, price]);

  const statusColor = isUp ? "text-emerald-500" : "text-red-500";

  return (
    <div className="relative flex items-center justify-between px-5 py-3 bg-gray-50/40 rounded-[32px] border border-gray-100 shadow-inner group font-body tracking-normal overflow-hidden" dir="rtl">
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-12">
         <Waves size={100} className="text-[#002d4d]" />
      </div>

      <div className="relative z-10 space-y-0.5 text-right">
         <p className="text-[11px] font-black text-[#002d4d] leading-none tracking-normal">نبض الأسواق</p>
         <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none tracking-normal mt-1">Live Pulse</p>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-8 overflow-hidden pointer-events-none">
         <svg viewBox="0 0 100 40" className="h-full w-full">
            <motion.path
              d={liquidPath}
              fill="none"
              stroke={isUp ? "#10b981" : "#ef4444"}
              strokeWidth="3"
              strokeLinecap="round"
              animate={{ d: liquidPath }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="transition-colors duration-500"
            />
         </svg>
      </div>

      <div className="relative z-10 text-left pl-1">
         <div className="flex flex-col items-start">
            <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1 tracking-normal">Price Stream</p>
            <div className="flex items-center gap-1.5" dir="ltr">
               <motion.div 
                  animate={{ y: isUp ? [-2, 2, -2] : [2, -2, 2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className={cn("shrink-0", statusColor)}
               >
                  {isUp ? <ChevronUp size={16} strokeWidth={4} /> : <ChevronDown size={16} strokeWidth={4} />}
               </motion.div>

               <div className="flex items-center text-[16px] font-black tabular-nums tracking-tighter h-[1.2em] leading-none">
                  <span className={cn("text-[10px] mr-0.5 opacity-40 select-none", statusColor)}>$</span>
                  {price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split("").map((char, i) => (
                    <AnimatedDigit key={i} digit={char} colorClass={statusColor} />
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
