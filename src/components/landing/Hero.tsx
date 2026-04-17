
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Gift, ShieldCheck, Sparkles, Hash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Logo } from "@/components/layout/Logo";

/**
 * @fileOverview NAMIX ELITE HERO v12.0 - Precision Background Edition
 * تم تصغير السهم الخلفي وتثبيت التوازن التناظري للأوسمة والجناحين.
 */

const LaurelWreath = ({ mirrored = false, className }: { mirrored?: boolean, className?: string }) => (
  <svg 
    viewBox="0 0 940 720" 
    className={cn("w-8 h-8 md:w-12 md:h-12 shrink-0", mirrored && "scale-x-[-1]", className)} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(91.8807, -228.748)" fill="currentColor">
      <path d="m 347.08869,896.4485 c -50.26221,-34.61145 -91.99091,-4.22048 -130.20466,30.14723 49.33059,13.40184 101.57182,19.4812 130.20466,-30.14723 z" />
      <path d="m 335.00813,866.65908 c -2.23026,-60.98622 -51.52064,-76.32723 -101.9037,-86.47444 18.69136,47.57924 44.99506,93.12317 101.9037,86.47444 z" />
      <path d="m 257.46232,868.9652 c -47.1576,-38.73528 -91.30541,-11.97944 -132.28691,19.03596 48.0217,17.52279 99.56244,27.99525 132.28691,-19.03596 z" />
      <path d="m 213.7258,840.04725 c 29.38644,-53.48545 -5.0433,-91.94969 -43.07649,-126.51721 -8.37774,50.42759 -9.17761,103.01541 43.07649,126.51721 z" />
      <path d="M 175.56386,838.86253 C 140.86881,788.6578 91.067409,802.24915 43.139648,820.80627 c 41.356125,30.0467 88.033542,54.28182 132.424212,18.05626 z" />
      <path d="m 126.55834,794.08474 c 44.8942,-41.33732 24.51179,-88.76583 -0.52771,-133.64859 -24.00593,45.13149 -41.516977,94.72472 0.52771,133.64859 z" />
      <path d="m 102.70505,789.02521 c -24.512893,-55.88718 -75.990226,-52.01603 -126.572602,-42.9134 34.88637,37.36404 76.102239,70.03469 126.572602,42.9134 z" />
      <path d="M 61.80799,734.99691 C 113.5903,702.70348 102.35828,652.31751 86.077807,603.56935 54.11764,643.46532 27.712133,688.95024 61.80799,734.99691 z" />
      <path d="m 43.731844,727.44265 c -13.50183,-59.5145 -64.782452,-65.44807 -116.173584,-66.07531 27.191044,43.28729 61.484952,83.16283 116.173584,66.07531 z" />
      <path d="M 28.353512,639.98238 C 83.492962,613.83027 78.104003,562.48953 67.51225,512.19779 31.194121,548.17207 -0.24580513,590.33455 28.353512,639.98238 z" />
      <path d="m 19.164595,656.99812 c -6.339212,-60.69651 -56.552533,-72.67739 -107.50569,-79.40263 21.858519,46.20969 51.174797,89.8752 107.50569,79.40263 z" />
      <path d="M 5.1751165,540.48644 C 64.763679,527.31633 70.982683,476.06937 71.896069,424.68233 28.458188,451.63189 -11.607558,485.70325 5.1751165,540.48644 z" />
      <path d="M -6.4859483,585.25321 C 10.758728,526.7136 -31.112486,496.51915 -75.668597,470.90297 c 2.620999,51.05161 13.106722,102.5897 69.1826487,114.35024 z" />
      <path d="m 28.616032,425.50229 c 60.950565,3.05215 80.496728,-44.72699 94.963058,-94.04387 -49.017377,14.50674 -96.665404,36.77334 -94.963058,94.04387 z" />
      <path d="m -10.626514,491.19264 c 36.629046,-48.8116 7.9620893,-91.74309 -24.821398,-131.32444 -15.399078,48.74424 -23.600233,100.69481 24.821398,131.32444 z" />
      <path d="M 55.278052,338.66716 C 116.20344,335.15204 130.50209,285.54901 139.58509,234.96301 92.410592,254.6531 47.431376,281.91098 55.278052,338.66716 z" />
      <path d="M 16.389532,391.33338 C 62.166776,350.9762 42.814294,303.11817 18.750788,257.70462 -6.22507,302.30663 -24.804003,351.50973 16.389532,391.33338 z" />
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const baseCount = 2314548; 
  const totalDisplayCount = useMemo(() => {
    const realUsers = users?.length || 0;
    return (baseCount + realUsers).toLocaleString();
  }, [users]);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-16 font-body overflow-hidden" dir="rtl">
      
      {/* 1. Corner Header */}
      <div className="absolute top-10 left-0 right-0 px-8 md:px-16 flex items-center justify-between z-50">
         <div className="flex items-center gap-3">
            <Logo size="sm" animate={true} />
         </div>
         <Link href="/login">
            <button className="relative overflow-hidden text-[11px] md:text-xs font-black text-[#002d4d] hover:text-[#f9a885] transition-all uppercase tracking-widest outline-none px-6 py-2.5 rounded-full bg-white/40 border border-white/10 backdrop-blur-xl group">
              <motion.div 
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-25deg] pointer-events-none"
              />
              <span className="relative z-10">دخول</span>
            </button>
         </Link>
      </div>

      {/* Background Atmosphere */}
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

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row-reverse items-center lg:justify-between gap-12 lg:gap-20 py-24 md:py-32 relative z-10">
        
        {/* RIGHT WING: Counter and Stats */}
        <div className="flex-1 flex flex-col items-center lg:items-end space-y-10 lg:space-y-12">
           <div className="text-center lg:text-right space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-6xl md:text-[100px] lg:text-[140px] font-black tabular-nums tracking-tighter flex items-center justify-center lg:justify-end h-[1.1em] overflow-hidden drop-shadow-[0_20px_50px_rgba(249,168,133,0.3)]"
                dir="ltr"
              >
                {totalDisplayCount.split("").map((char, i) => (
                  <AnimatedDigit key={i} digit={char} />
                ))}
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl md:text-5xl lg:text-6xl font-black text-[#002d4d] tracking-tight leading-none"
              >
                مُستخدِم يثقون بنا
              </motion.h2>
           </div>

           {/* Symmetrical Stats Hub - Optimized for Single Row */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-row items-center justify-center lg:justify-end gap-2 md:gap-8 flex-nowrap overflow-x-auto scrollbar-none py-4"
           >
              {[
                { label: "أصول العملاء", id: "assets" },
                { label: "حجم التداول", id: "volume" },
                { label: "الاستثمارات", id: "invest" }
              ].map((stat) => (
                <div key={stat.id} className="flex items-center gap-0.5 group shrink-0">
                   <LaurelWreath mirrored className="text-[#f9a885] transition-transform duration-700 group-hover:rotate-[-5deg]" />
                   <div className="space-y-0 text-center px-1">
                      <p className="text-xs md:text-xl lg:text-2xl font-black text-[#002d4d] leading-none">No.1</p>
                      <p className="text-[6px] md:text-[8px] font-black text-gray-400 uppercase tracking-tighter mt-1 whitespace-nowrap">{stat.label}</p>
                   </div>
                   <LaurelWreath className="text-[#f9a885] transition-transform duration-700 group-hover:rotate-[5deg]" />
                </div>
              ))}
           </motion.div>
        </div>

        {/* LEFT WING: Rewards and CTA */}
        <div className="flex-1 flex flex-col items-center lg:items-start space-y-10 lg:space-y-12">
           <div className="space-y-8 w-full flex flex-col items-center lg:items-start">
              {/* Clean Reward Node */}
              <div className="flex items-center gap-3 lg:pr-4">
                <Gift className="h-5 w-5 md:h-7 md:w-7 text-[#f9a885]" />
                <p className="text-sm md:text-xl lg:text-2xl font-black text-[#002d4d] tracking-normal">
                  مكافأة تصل الى <span className="text-[#f9a885] font-black">100$</span> عند التسجيل
                </p>
              </div>

              <Link href={isLoggedIn ? "/home" : "/login"} className="w-full max-w-[340px] md:max-w-[420px]">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-16 md:h-20 w-full rounded-[28px] md:rounded-[40px] bg-[#f9a885] text-[#002d4d] font-black text-lg md:text-xl shadow-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group outline-none"
                >
                  {/* Giant Background Arrow - Refined size to 80 */}
                  <motion.div 
                    animate={{ x: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-6 md:left-10 opacity-[0.08] pointer-events-none"
                  >
                    <ChevronLeft size={80} strokeWidth={4} />
                  </motion.div>
                  
                  <span className="relative z-10">{isLoggedIn ? "متابعة الاستخدام" : "سجل الآن مجاناً"}</span>
                </motion.button>
              </Link>
           </div>

           <div className="flex items-center justify-center lg:justify-start gap-3 opacity-20 select-none lg:pr-6">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#002d4d] mr-[-0.4em]">Verified Institution Node v12.0</p>
           </div>
        </div>

      </div>
    </section>
  );
}
