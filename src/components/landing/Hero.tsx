
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";

/**
 * AnimatedDigit - محرك الخانة الرقمية المنزلقة
 */
function AnimatedDigit({ digit, colorClass = "text-[#fbc02d]" }: { digit: string, colorClass?: string }) {
  const isNumber = !isNaN(parseInt(digit));
  if (!isNumber) return <span className={cn("inline-block px-0.5", colorClass)}>{digit}</span>;

  const num = parseInt(digit);

  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden inline-flex flex-col leading-none">
      <motion.div
        animate={{ y: `-${num * 10}%` }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        className="flex flex-col items-center w-full h-[1000%] absolute top-0 left-0"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className={cn("h-[10%] flex items-center justify-center font-black", colorClass)}>
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/**
 * LaurelWreath - أيقونة إكليل الغار الذهبي الفخم المعاد تصميمها
 */
const LaurelWreath = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-10 h-10 md:w-14 md:h-14", className)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M30 85C20 75 12 55 12 40C12 25 20 10 30 5" 
      stroke="#fbc02d" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      opacity="0.6" 
    />
    {/* أوراق الغار التفصيلية */}
    {[15, 30, 45, 60, 75].map((y, i) => (
      <path 
        key={i}
        d={`M12 ${y}C8 ${y-5} 5 ${y-15} 12 ${y-10}`} 
        stroke="#fbc02d" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    ))}
  </svg>
);

export function Hero() {
  const db = useFirestore();
  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users } = useCollection(usersQuery);
  
  const baseCount = 2314548; 
  const totalDisplayCount = useMemo(() => {
    const realUsers = users?.length || 0;
    return (baseCount + realUsers).toLocaleString();
  }, [users]);

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-6 md:px-12 font-body overflow-hidden" dir="rtl">
      
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-14 md:space-y-20 py-12 relative z-10">
        
        {/* 1. Large Dynamic Number & Title */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-[110px] font-black tabular-nums tracking-tighter flex items-center justify-center h-[1.1em] overflow-hidden drop-shadow-[0_10px_20px_rgba(251,192,45,0.1)]"
            dir="ltr"
          >
            {totalDisplayCount.split("").map((char, i) => (
              <AnimatedDigit key={i} digit={char} />
            ))}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-2xl md:text-5xl font-black text-[#002d4d] tracking-tight"
          >
            مُستخدِم يثقون بنا
          </motion.h2>
        </div>

        {/* 2. Professional Ranking Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="w-full flex items-center justify-center gap-8 md:gap-24"
        >
           {/* Badge Left: أصول العملاء */}
           <div className="flex items-center gap-2 md:gap-5 group">
              <LaurelWreath className="group-hover:rotate-6 transition-transform duration-700" />
              <div className="space-y-0.5 text-center">
                 <p className="text-2xl md:text-4xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[10px] md:text-[12px] font-bold text-gray-400 uppercase tracking-tight">أصول العملاء</p>
              </div>
              <LaurelWreath className="scale-x-[-1] group-hover:-rotate-6 transition-transform duration-700" />
           </div>

           {/* Badge Right: حجم التداول */}
           <div className="flex items-center gap-2 md:gap-5 group">
              <LaurelWreath className="group-hover:rotate-6 transition-transform duration-700" />
              <div className="space-y-0.5 text-center">
                 <p className="text-2xl md:text-4xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[10px] md:text-[12px] font-bold text-gray-400 uppercase tracking-tight">حجم التداول</p>
              </div>
              <LaurelWreath className="scale-x-[-1] group-hover:-rotate-6 transition-transform duration-700" />
           </div>
        </motion.div>

        {/* 3. CTA & Reward Strip */}
        <div className="space-y-10 w-full flex flex-col items-center">
           <Link href="/login" className="w-full max-w-[360px]">
             <motion.button 
               whileHover={{ scale: 1.02, y: -4 }}
               whileTap={{ scale: 0.98 }}
               className="h-20 w-full rounded-[28px] bg-[#fbc02d] text-[#002d4d] font-black text-xl md:text-2xl shadow-[0_20px_50px_rgba(251,192,45,0.25)] hover:bg-[#ffca28] transition-all flex items-center justify-center gap-4 relative overflow-hidden group outline-none"
             >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <span className="relative z-10">سجل الآن مجاناً</span>
               <ChevronLeft className="h-6 w-6 relative z-10 group-hover:-translate-x-1 transition-transform" strokeWidth={4} />
             </motion.button>
           </Link>

           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="flex items-center gap-3 bg-gray-50/50 px-8 py-3 rounded-full border border-gray-100 shadow-sm"
           >
              <Gift className="h-5 w-5 text-[#fbc02d] animate-bounce" />
              <p className="text-xs md:text-base font-black text-[#002d4d]">
                مُكافأة استثمارية تصل إلى <span className="text-[#fbc02d] font-black">$100</span> عند التسجيل اليوم
              </p>
           </motion.div>

           <div className="flex items-center gap-3 opacity-20 select-none pt-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#002d4d] mr-[-0.5em]">Verified Global Node</p>
           </div>
        </div>

      </div>

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,192,45,0.03)_0%,transparent_75%)]" />
      </div>
    </section>
  );
}
