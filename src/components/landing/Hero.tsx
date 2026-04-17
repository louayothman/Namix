
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Logo } from "@/components/layout/Logo";

/**
 * @fileOverview NAMIX ELITE HERO v5.0 - Symmetrical Ultra-Bold Edition
 * تم تقليص المسافات وتكثيف أوزان الخطوط وتصحيح تأطير السنابل التناظري.
 */

const LaurelWreath = ({ mirrored = false, className }: { mirrored?: boolean, className?: string }) => (
  <svg 
    viewBox="0 0 940 720" 
    className={cn("w-6 h-6 md:w-10 md:h-10 shrink-0", mirrored && "scale-x-[-1]", className)} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(91.8807, -228.748)" fill="currentColor">
      <path d="m 347.08869,896.4485 c -50.26221,-34.61145 -91.99091,-4.22048 -130.20466,30.14723 49.33059,13.40184 101.57182,19.4812 130.20466,-30.14723 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 335.00813,866.65908 c -2.23026,-60.98622 -51.52064,-76.32723 -101.9037,-86.47444 18.69136,47.57924 44.99506,93.12317 101.9037,86.47444 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 257.46232,868.9652 c -47.1576,-38.73528 -91.30541,-11.97944 -132.28691,19.03596 48.0217,17.52279 99.56244,27.99525 132.28691,-19.03596 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 213.7258,840.04725 c 29.38644,-53.48545 -5.0433,-91.94969 -43.07649,-126.51721 -8.37774,50.42759 -9.17761,103.01541 43.07649,126.51721 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="M 175.56386,838.86253 C 140.86881,788.6578 91.067409,802.24915 43.139648,820.80627 c 41.356125,30.0467 88.033542,54.28182 132.424212,18.05626 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 126.55834,794.08474 c 44.8942,-41.33732 24.51179,-88.76583 -0.52771,-133.64859 -24.00593,45.13149 -41.516977,94.72472 0.52771,133.64859 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 102.70505,789.02521 c -24.512893,-55.88718 -75.990226,-52.01603 -126.572602,-42.9134 34.88637,37.36404 76.102239,70.03469 126.572602,42.9134 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="M 61.80799,734.99691 C 113.5903,702.70348 102.35828,652.31751 86.077807,603.56935 54.11764,643.46532 27.712133,688.95024 61.80799,734.99691 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 43.731844,727.44265 c -13.50183,-59.5145 -64.782452,-65.44807 -116.173584,-66.07531 27.191044,43.28729 61.484952,83.16283 116.173584,66.07531 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="M 28.353512,639.98238 C 83.492962,613.83027 78.104003,562.48953 67.51225,512.19779 31.194121,548.17207 -0.24580513,590.33455 28.353512,639.98238 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 19.164595,656.99812 c -6.339212,-60.69651 -56.552533,-72.67739 -107.50569,-79.40263 21.858519,46.20969 51.174797,89.8752 107.50569,79.40263 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="M 5.1751165,540.48644 C 64.763679,527.31633 70.982683,476.06937 71.896069,424.68233 28.458188,451.63189 -11.607558,485.70325 5.1751165,540.48644 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="M -6.4859483,585.25321 C 10.758728,526.7136 -31.112486,496.51915 -75.668597,470.90297 c 2.620999,51.05161 13.106722,102.5897 69.1826487,114.35024 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m 28.616032,425.50229 c 60.950565,3.05215 80.496728,-44.72699 94.963058,-94.04387 -49.017377,14.50674 -96.665404,36.77334 -94.963058,94.04387 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="m -10.626514,491.19264 c 36.629046,-48.8116 7.9620893,-91.74309 -24.821398,-131.32444 -15.399078,48.74424 -23.600233,100.69481 24.821398,131.32444 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="M 55.278052,338.66716 C 116.20344,335.15204 130.50209,285.54901 139.58509,234.96301 92.410592,254.6531 47.431376,281.91098 55.278052,338.66716 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
      <path d="M 16.389532,391.33338 C 62.166776,350.9762 42.814294,303.11817 18.750788,257.70462 -6.22507,302.30663 -24.804003,351.50973 16.389532,391.33338 z" style={{ fillRule: 'evenodd', stroke: '#f9a885', strokeWidth: '1px' }} />
    </g>
  </svg>
);

function AnimatedDigit({ digit, colorClass = "text-[#f9a885]" }: { digit: string, colorClass?: string }) {
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
          <div key={n} className={cn("h-[10%] flex items-center justify-center font-black", colorClass)}>{n}</div>
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const db = useFirestore();
  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users } = useCollection(usersQuery);
  const [mounted, setMounted] = useState(false);
  
  const baseCount = 2314548; 
  const totalDisplayCount = useMemo(() => {
    const realUsers = users?.length || 0;
    return (baseCount + realUsers).toLocaleString();
  }, [users]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-12 font-body overflow-hidden" dir="rtl">
      
      {/* 1. Symmetrical Minimalist Header */}
      <div className="absolute top-8 left-0 right-0 px-8 md:px-16 flex items-center justify-between z-50">
         <h1 className="text-xl font-black text-[#002d4d] tracking-[0.2em] uppercase select-none">NAMIX</h1>
         <Link href="/login">
            <button className="text-[11px] font-black text-[#002d4d] hover:text-[#f9a885] transition-colors uppercase tracking-widest outline-none">دخول</button>
         </Link>
      </div>

      {/* Background Atmosphere - Slate Blue & Orange Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-[#8899AA]/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-[#f9a885]/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center space-y-16 py-12 relative z-10">
        
        {/* 2. Dynamic User Counter - Ultra Bold */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-[140px] font-black tabular-nums tracking-tighter flex items-center justify-center h-[1.1em] overflow-hidden drop-shadow-[0_20px_40px_rgba(249,168,133,0.2)]"
            dir="ltr"
          >
            {totalDisplayCount.split("").map((char, i) => (
              <AnimatedDigit key={i} digit={char} />
            ))}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl md:text-5xl font-black text-[#002d4d] tracking-tight"
          >
            مُستخدِم يثقون بنا
          </motion.h2>
        </div>

        {/* 3. Framed Stats Hub - Tight Spacing & Symmetrical */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16"
        >
           {/* Stat 1: Framed Client Assets */}
           <div className="flex items-center gap-0.5 group">
              <LaurelWreath className="text-[#f9a885] transition-transform duration-700 group-hover:rotate-[-5deg]" />
              <div className="space-y-0 text-center px-3 md:px-5">
                 <p className="text-xl md:text-4xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-1 whitespace-nowrap">أصول العملاء</p>
              </div>
              <LaurelWreath mirrored className="text-[#f9a885] transition-transform duration-700 group-hover:rotate-[5deg]" />
           </div>

           {/* Central Animated Identity */}
           <div className="shrink-0 flex items-center justify-center">
              <Logo size="sm" hideText animate={true} className="scale-125 md:scale-150" />
           </div>

           {/* Stat 2: Framed Trading Volume */}
           <div className="flex items-center gap-0.5 group">
              <LaurelWreath className="text-[#f9a885] transition-transform duration-700 group-hover:rotate-[-5deg]" />
              <div className="space-y-0 text-center px-3 md:px-5">
                 <p className="text-xl md:text-4xl font-black text-[#002d4d] leading-none">No.1</p>
                 <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-1 whitespace-nowrap">حجم التداول</p>
              </div>
              <LaurelWreath mirrored className="text-[#f9a885] transition-transform duration-700 group-hover:rotate-[5deg]" />
           </div>
        </motion.div>

        {/* 4. CTA & Reward Matrix */}
        <div className="flex flex-col items-center gap-6 w-full">
           
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="flex flex-col items-center gap-4"
           >
              <div className="flex items-center gap-2.5 bg-gray-50 px-8 py-3 rounded-full border border-gray-100 shadow-inner">
                <Sparkles className="h-4 w-4 text-[#f9a885] animate-pulse" />
                <p className="text-sm md:text-base font-black text-[#002d4d]">
                  مكافأة استثمارية تصل إلى <span className="text-[#f9a885] font-black">$100</span> عند التسجيل اليوم
                </p>
              </div>

              <Link href="/login" className="w-full max-w-[300px] mt-2">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-14 w-full rounded-[20px] bg-[#f9a885] text-[#002d4d] font-black text-base shadow-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group outline-none"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10">سجل الآن مجاناً</span>
                  <ChevronLeft className="h-5 w-5 relative z-10 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                </motion.button>
              </Link>
           </motion.div>

           <div className="flex items-center justify-center gap-3 opacity-20 select-none pt-4">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[#002d4d] mr-[-0.5em]">Verified Global Asset Node</p>
           </div>
        </div>

      </div>
    </section>
  );
}

