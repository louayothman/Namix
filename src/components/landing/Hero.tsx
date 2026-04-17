
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
 * LaurelWreath - أيقونة إكليل الغار الذهبي المخصصة
 */
const LaurelWreath = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-12 h-12 md:w-16 md:h-16", className)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 85C25 75 15 60 15 45C15 30 25 15 35 15" stroke="#fbc02d" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    <path d="M65 85C75 75 85 60 85 45C85 30 75 15 65 15" stroke="#fbc02d" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    {[25, 40, 55, 70].map((y, i) => (
      <React.Fragment key={i}>
        <circle cx="18" cy={y} r="3" fill="#fbc02d" />
        <circle cx="82" cy={y} r="3" fill="#fbc02d" />
      </React.Fragment>
    ))}
  </svg>
);

export function Hero() {
  const db = useFirestore();
  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users } = useCollection(usersQuery);
  
  const baseCount = 2314548; // الرقم الأساسي المطلوب
  const totalDisplayCount = useMemo(() => {
    const realUsers = users?.length || 0;
    return (baseCount + realUsers).toLocaleString();
  }, [users]);

  return (
    <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center px-6 md:px-12 font-body overflow-hidden" dir="rtl">
      
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-12 md:space-y-16 py-12 relative z-10">
        
        {/* 1. Large Dynamic Number & Trust Text */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl font-black tabular-nums tracking-tighter flex items-center justify-center h-[1.1em] overflow-hidden"
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
            className="text-3xl md:text-5xl font-black text-[#002d4d] tracking-tight"
          >
            مُستخدِم يثقون بنا
          </motion.h2>
        </div>

        {/* 2. Ranking Badges Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="w-full flex items-center justify-center gap-4 md:gap-16"
        >
           {/* Badge Left */}
           <div className="flex items-center gap-2 md:gap-6 group">
              <LaurelWreath className="group-hover:rotate-12 transition-transform duration-700" />
              <div className="space-y-0.5">
                 <p className="text-xl md:text-3xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-tight">أصول العملاء</p>
              </div>
              <LaurelWreath className="scale-x-[-1] group-hover:-rotate-12 transition-transform duration-700" />
           </div>

           {/* Badge Right */}
           <div className="flex items-center gap-2 md:gap-6 group">
              <LaurelWreath className="group-hover:rotate-12 transition-transform duration-700" />
              <div className="space-y-0.5">
                 <p className="text-xl md:text-3xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-tight">حجم التداول</p>
              </div>
              <LaurelWreath className="scale-x-[-1] group-hover:-rotate-12 transition-transform duration-700" />
           </div>
        </motion.div>

        {/* 3. Reward & Action Section */}
        <div className="space-y-8 w-full flex flex-col items-center">
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="flex items-center gap-3 bg-gray-50/50 px-6 py-2.5 rounded-full border border-gray-100 shadow-sm"
           >
              <Gift className="h-5 w-5 text-[#fbc02d] animate-bounce" />
              <p className="text-xs md:text-base font-black text-[#002d4d]">
                مُكافأة تصل إلى <span className="text-[#fbc02d]">$100</span> اليوم فقط
              </p>
           </motion.div>

           <Link href="/login" className="w-full max-w-[340px]">
             <motion.button 
               whileHover={{ scale: 1.02, y: -4 }}
               whileTap={{ scale: 0.96 }}
               className="h-20 w-full rounded-[24px] bg-[#fbc02d] text-[#002d4d] font-black text-xl md:text-2xl shadow-2xl shadow-yellow-500/20 hover:bg-[#ffca28] transition-all flex items-center justify-center gap-4 relative overflow-hidden group outline-none"
             >
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <span className="relative z-10">إنشاء حساب</span>
               <ChevronLeft className="h-6 w-6 relative z-10 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
             </motion.button>
           </Link>

           <div className="flex items-center gap-3 opacity-20 select-none pt-4">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#002d4d] mr-[-0.4em]">Verified Security Node</p>
           </div>
        </div>

      </div>

      {/* Decorative Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,192,45,0.02)_0%,transparent_70%)]" />
      </div>
    </section>
  );
}
