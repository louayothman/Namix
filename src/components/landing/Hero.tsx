
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
 * @fileOverview NAMIX ELITE HERO v18.0 - Professional Alignment Edition
 * تم تصحيح لون العداد للبرتقالي، ومعالجة تداخل السنابل، وضبط لمعان النص العلوي.
 * تم نقل العداد والإحصائيات للجناح الأيسر في الشاشات الكبيرة.
 */

const LaurelWreath = ({ mirrored = false, className }: { mirrored?: boolean, className?: string }) => (
  <svg 
    viewBox="0 0 940 720" 
    className={cn("w-10 h-10 md:w-16 md:h-16 shrink-0", mirrored && "scale-x-[-1]", className)} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(91.8807, -228.748)" fill="currentColor">
      <path d="m 347.08869,896.4485 c -50.26221,-34.61145 -91.99091,-4.22048 -130.20466,30.14723 49.33059,13.40184 101.57182,19.4812 130.20466,-30.14723 z" fillOpacity="1" />
      <path d="m 335.00813,866.65908 c -2.23026,-60.98622 -51.52064,-76.32723 -101.9037,-86.47444 18.69136,47.57924 44.99506,93.12317 101.9037,86.47444 z" fillOpacity="1" />
      <path d="m 257.46232,868.9652 c -47.1576,-38.73528 -91.30541,-11.97944 -132.28691,19.03596 48.0217,17.52279 99.56244,27.99525 132.28691,-19.03596 z" fillOpacity="1" />
      <path d="m 213.7258,840.04725 c 29.38644,-53.48545 -5.0433,-91.94969 -43.07649,-126.51721 -8.37774,50.42759 -9.17761,103.01541 43.07649,126.51721 z" fillOpacity="1" />
      <path d="M 175.56386,838.86253 C 140.86881,788.6578 91.067409,802.24915 43.139648,820.80627 c 41.356125,30.0467 88.033542,54.28182 132.424212,18.05626 z" fillOpacity="1" />
      <path d="m 126.55834,794.08474 c 44.8942,-41.33732 24.51179,-88.76583 -0.52771,-133.64859 -24.00593,45.13149 -41.516977,94.72472 0.52771,133.64859 z" fillOpacity="1" />
      <path d="m 102.70505,789.02521 c -24.512893,-55.88718 -75.990226,-52.01603 -126.572602,-42.9134 34.88637,37.36404 76.102239,70.03469 126.572602,42.9134 z" fillOpacity="1" />
      <path d="M 61.80799,734.99691 C 113.5903,702.70348 102.35828,652.31751 86.077807,603.56935 54.11764,643.46532 27.712133,688.95024 61.80799,734.99691 z" fillOpacity="1" />
      <path d="m 43.731844,727.44265 c -13.50183,-59.5145 -64.782452,-65.44807 -116.173584,-66.07531 27.191044,43.28729 61.484952,83.16283 116.173584,66.07531 z" fillOpacity="1" />
      <path d="M 28.353512,639.98238 C 83.492962,613.83027 78.104003,562.48953 67.51225,512.19779 31.194121,548.17207 -0.24580513,590.33455 28.353512,639.98238 z" fillOpacity="1" />
      <path d="m 19.164595,656.99812 c -6.339212,-60.69651 -56.552533,-72.67739 -107.50569,-79.40263 21.858519,46.20969 51.174797,89.8752 107.50569,79.40263 z" fillOpacity="1" />
      <path d="M 28.616032,425.50229 c 60.950565,3.05215 80.496728,-44.72699 94.963058,-94.04387 -49.017377,14.50674 -96.665404,36.77334 -94.963058,94.04387 z" fillOpacity="1" />
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
      
      {/* 1. Top Header - Pure Minimalism */}
      <div className="absolute top-10 left-0 right-0 px-8 md:px-16 flex items-center justify-between z-50">
         <div className="flex items-center gap-3">
            <Logo size="sm" animate={true} />
         </div>
         <Link href="/login">
            <button className="relative px-6 py-2 outline-none group">
              <motion.span 
                animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="text-[11px] md:text-xs font-black uppercase tracking-widest bg-gradient-to-r from-[#002d4d] via-[#f9a885] to-[#002d4d] bg-[length:400%_auto] bg-clip-text text-transparent"
              >
                دخول
              </motion.span>
            </button>
         </Link>
      </div>

      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-[#8899AA]/15 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-[#f9a885]/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24 py-24 md:py-32 relative z-10">
        
        {/* LEFT WING: Counter and Stats (Sovereign Hub) */}
        <div className="flex-1 flex flex-col items-center space-y-12 lg:space-y-16">
           <div className="text-center space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-7xl md:text-[110px] lg:text-[130px] font-black tabular-nums tracking-tighter flex items-center justify-center h-[1.1em] overflow-hidden drop-shadow-[0_20px_50px_rgba(249,168,133,0.15)]"
                dir="ltr"
              >
                {totalDisplayCount.split("").map((char, i) => (
                  <AnimatedDigit key={i} digit={char} colorClass="text-[#f9a885]" />
                ))}
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl md:text-5xl lg:text-5xl font-black text-[#002d4d] tracking-tight leading-none"
              >
                مُستخدِم يثقون بنا
              </motion.h2>
           </div>

           {/* Symmetrical Stats Hub - Centered in Wing */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-row items-center justify-center gap-2 md:gap-16 flex-nowrap overflow-x-auto scrollbar-none py-4"
           >
              {[
                { label: "أصول العملاء", id: "assets" },
                { label: "حجم التداول", id: "volume" },
                { label: "الاستثمارات", id: "invest" }
              ].map((stat) => (
                <div key={stat.id} className="flex items-center gap-0 group shrink-0">
                   <LaurelWreath mirrored className="text-[#f9a885] -mx-2 md:-mx-4 transition-transform duration-700 group-hover:rotate-[-5deg]" />
                   <div className="space-y-0 text-center px-1 min-w-max relative z-10">
                      <p className="text-xl md:text-5xl font-black text-[#002d4d] leading-none">No.1</p>
                      <p className="text-[6px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-2">{stat.label}</p>
                   </div>
                   <LaurelWreath className="text-[#f9a885] -mx-2 md:-mx-4 transition-transform duration-700 group-hover:rotate-[5deg]" />
                </div>
              ))}
           </motion.div>
        </div>

        {/* RIGHT WING: Rewards and CTA (Active Engagement) */}
        <div className="flex-1 flex flex-col items-center lg:items-center space-y-12 lg:space-y-14">
           <div className="space-y-10 w-full flex flex-col items-center">
              {/* Reward Node */}
              <div className="flex items-center gap-3">
                <Gift className="h-6 w-6 md:h-8 md:w-8 text-[#f9a885]" />
                <p className="text-base md:text-xl lg:text-2xl font-black text-[#002d4d] tracking-normal">
                  مكافأة تصل الى <span className="text-[#f9a885] font-black">100$</span> عند التسجيل
                </p>
              </div>

              <Link href={isLoggedIn ? "/home" : "/login"} className="w-full max-w-[320px] md:max-w-[400px]">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-16 md:h-20 w-full rounded-[32px] md:rounded-[48px] bg-[#f9a885] text-[#002d4d] font-black text-lg md:text-xl shadow-2xl transition-all flex items-center justify-center relative overflow-hidden group outline-none"
                >
                  {/* Left-Anchored Back Arrow */}
                  <motion.div 
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-6 inset-y-0 flex items-center justify-start opacity-[0.1] pointer-events-none"
                  >
                    <ChevronLeft size={70} strokeWidth={4} className="md:size-[80px]" />
                  </motion.div>
                  
                  <span className="relative z-10">{isLoggedIn ? "متابعة الاستخدام" : "سجل الآن مجاناً"}</span>
                </motion.button>
              </Link>
           </div>

           <div className="flex items-center justify-center gap-3 opacity-20 select-none">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#002d4d] mr-[-0.4em]">Verified Institution Hub v18.0</p>
           </div>
        </div>

      </div>
    </section>
  );
}
