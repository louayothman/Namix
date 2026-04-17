
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
    <div className="relative h-[1.1em] w-[0.65em] overflow-hidden inline-flex flex-col leading-none">
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
 * LaurelWreath - أيقونة السنبلة الرسمية المرفقة
 */
const LaurelWreath = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 940 720" className={cn("w-12 h-12 md:w-20 md:h-20", className)} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(91.8807, -228.748)" fill="#fbc02d">
      <path d="m 347.08869,896.4485 c -50.26221,-34.61145 -91.99091,-4.22048 -130.20466,30.14723 49.33059,13.40184 101.57182,19.4812 130.20466,-30.14723 z" />
      <path d="m 335.00813,866.65908 c -2.23026,-60.98622 -51.52064,-76.32723 -101.9037,-86.47444 18.69136,47.57924 44.99506,93.12317 101.9037,86.47444 z" />
      <path d="m 257.46232,868.9652 c -47.1576,-38.73528 -91.30541,-11.97944 -132.28691,19.03596 48.0217,17.52279 99.56244,27.99525 132.28691,-19.03596 z" />
      <path d="m 213.7258,840.04725 c 29.38644,-53.48545 -5.0433,-91.94969 -43.07649,-126.51721 -8.37774,50.42759 -9.17761,103.01541 43.07649,126.51721 z" />
      <path d="M 175.56386,838.86253 C 140.86881,788.6578 91.067409,702.24915 43.139648,820.80627 c 41.356125,30.0467 88.033542,54.28182 132.424212,18.05626 z" />
      <path d="m 126.55834,794.08474 c 44.8942,-41.33732 24.51179,-88.76583 -0.52771,-133.64859 -24.00593,45.13149 -41.516977,94.72472 0.52771,133.64859 z" />
      <path d="m 102.70505,789.02521 c -24.512893,-55.88718 -75.990226,-52.01603 -126.572602,-42.9134 34.88637,37.36404 76.102239,70.03469 126.572602,42.9134 z" />
      <path d="M 61.80799,734.99691 C 113.5903,702.70348 102.35828,652.31751 86.077807,603.56935 54.11764,643.46532 27.712133,688.95024 61.80799,734.99691 z" id="path2820-2" />
      <path d="m 43.731844,727.44265 c -13.50183,-59.5145 -64.782452,-65.44807 -116.173584,-66.07531 27.191044,43.28729 61.484952,83.16283 116.173584,66.07531 z" id="path2826-4" />
      <path d="M 28.353512,639.98238 C 83.492962,613.83027 78.104003,562.48953 67.51225,512.19779 31.194121,548.17207 -0.24580513,590.33455 28.353512,639.98238 z" id="path2832-5" />
      <path d="m 19.164595,656.99812 c -6.339212,-60.69651 -56.552533,-72.67739 -107.50569,-79.40263 21.858519,46.20969 51.174797,89.8752 107.50569,79.40263 z" id="path2838-5" />
      <path d="M 5.1751165,540.48644 C 64.763679,527.31633 70.982683,476.06937 71.896069,424.68233 28.458188,451.63189 -11.607558,485.70325 5.1751165,540.48644 z" id="path2844-1" />
      <path d="M -6.4859483,585.25321 C 10.758728,526.7136 -31.112486,496.51915 -75.668597,470.90297 c 2.620999,51.05161 13.106722,102.5897 69.1826487,114.35024 z" id="path2850-7" />
      <path d="m 28.616032,425.50229 c 60.950565,3.05215 80.496728,-44.72699 94.963058,-94.04387 -49.017377,14.50674 -96.665404,36.77334 -94.963058,94.04387 z" id="path2856-1" />
      <path d="m -10.626514,491.19264 c 36.629046,-48.8116 7.9620893,-91.74309 -24.821398,-131.32444 -15.399078,48.74424 -23.600233,100.69481 24.821398,131.32444 z" id="path2862-1" />
      <path d="M 55.278052,338.66716 C 116.20344,335.15204 130.50209,285.54901 139.58509,234.96301 92.410592,254.6531 47.431376,281.91098 55.278052,338.66716 z" id="path2868-5" />
      <path d="M 16.389532,391.33338 C 62.166776,350.9762 42.814294,303.11817 18.750788,257.70462 -6.22507,302.30663 -24.804003,351.50973 16.389532,391.33338 z" id="path2874-2" />
    </g>
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
      
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center space-y-14 md:space-y-20 py-12 relative z-10">
        
        {/* 1. Large Dynamic Number & Title */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-[115px] font-black tabular-nums tracking-tighter flex items-center justify-center h-[1.1em] overflow-hidden drop-shadow-[0_10px_20px_rgba(251,192,45,0.1)]"
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

        {/* 2. Professional Ranking Badges with Laurel Wreaths */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="w-full flex items-center justify-center gap-10 md:gap-32"
        >
           {/* Badge Left: حجم التداول */}
           <div className="flex items-center gap-2 md:gap-4 group">
              <LaurelWreath className="group-hover:rotate-6 transition-transform duration-700" />
              <div className="space-y-0 text-center">
                 <p className="text-2xl md:text-5xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[10px] md:text-[14px] font-bold text-gray-400 uppercase tracking-tight mt-1">حجم التداول</p>
              </div>
              <LaurelWreath className="scale-x-[-1] group-hover:-rotate-6 transition-transform duration-700" />
           </div>

           {/* Badge Right: أصول العملاء */}
           <div className="flex items-center gap-2 md:gap-4 group">
              <LaurelWreath className="group-hover:rotate-6 transition-transform duration-700" />
              <div className="space-y-0 text-center">
                 <p className="text-2xl md:text-5xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[10px] md:text-[14px] font-bold text-gray-400 uppercase tracking-tight mt-1">أصول العملاء</p>
              </div>
              <LaurelWreath className="scale-x-[-1] group-hover:-rotate-6 transition-transform duration-700" />
           </div>
        </motion.div>

        {/* 3. CTA & Reward Strip */}
        <div className="space-y-12 w-full flex flex-col items-center">
           <Link href="/login" className="w-full max-w-[380px]">
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
             className="flex items-center gap-4 bg-gray-50/50 px-10 py-4 rounded-full border border-gray-100 shadow-sm"
           >
              <Gift className="h-6 w-6 text-[#fbc02d] animate-bounce" />
              <p className="text-sm md:text-lg font-black text-[#002d4d]">
                مكافأة استثمارية تصل إلى <span className="text-[#fbc02d] font-black">$100</span> عند التسجيل اليوم
              </p>
           </motion.div>

           <div className="flex items-center justify-center gap-3 opacity-20 select-none pt-4">
              <ShieldCheck size={16} className="text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#002d4d] mr-[-0.5em]">Verified Global Node</p>
           </div>
        </div>

      </div>

      {/* Gray-Blue Radial Background Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(136,153,170,0.04)_0%,transparent_75%)]" />
      </div>
    </section>
  );
}
