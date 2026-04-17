
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { ShieldCheck } from "lucide-react";
import { HeroHeader } from "./HeroHeader";
import { TrustOdometer } from "./TrustOdometer";
import { EliteStatsHub } from "./EliteStatsHub";
import { ActivationActionHub } from "./ActivationActionHub";
import { motion } from "framer-motion";

/**
 * @fileOverview NAMIX RECONSTRUCTED HERO v30.0 - Modular Sovereign Architecture
 * Rebuilt from scratch with split wings: Left Wing (Trust & Stats), Right Wing (Execution).
 */

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
      
      {/* 1. COMPONENT: Hero Header (Corners) */}
      <HeroHeader />

      {/* Background Atmosphere - Gray Blue Aura */}
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
        
        {/* LEFT WING (Large Screens): Trust Core & Odometer */}
        <div className="flex-1 flex flex-col items-center lg:items-center space-y-12 lg:space-y-16">
           <div className="text-center space-y-4">
              {/* 2. COMPONENT: Trust Odometer */}
              <TrustOdometer totalCount={totalDisplayCount} />
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl md:text-5xl lg:text-5xl font-black text-[#002d4d] tracking-tight leading-none"
              >
                مُستخدِم يثقون بنا
              </motion.h2>
           </div>

           {/* 3. COMPONENT: Elite Stats Hub */}
           <EliteStatsHub />
        </div>

        {/* RIGHT WING (Large Screens): Activation Hub */}
        <div className="flex-1 flex flex-col items-center lg:items-center space-y-12 lg:space-y-14">
           {/* 4. COMPONENT: Activation Action Hub */}
           <ActivationActionHub isLoggedIn={isLoggedIn} />

           <div className="flex items-center justify-center gap-3 opacity-20 select-none">
              <ShieldCheck size={14} className="text-emerald-500" />
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#002d4d] mr-[-0.4em]">Verified Institution Hub v30.0</p>
           </div>
        </div>

      </div>
    </section>
  );
}
