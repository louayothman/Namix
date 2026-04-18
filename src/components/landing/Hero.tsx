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
 * @fileOverview NAMIX HERO v33.0 - Compact Vertical Edition
 * تم تقليص المسافة العمودية السفلية لسحب المكونات التالية للأعلى.
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
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center px-6 md:px-16 font-body overflow-hidden" dir="rtl">
      
      {/* Hero Header (Corners) */}
      <HeroHeader />

      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pt-32 pb-4 md:pt-44 md:pb-8 relative z-10">
        
        {/* LEFT WING: Trust Core & Odometer */}
        <div className="flex-1 flex flex-col items-center lg:items-center space-y-12 lg:space-y-16">
           <div className="text-center space-y-4">
              {/* Trust Odometer */}
              <TrustOdometer totalCount={totalDisplayCount} />
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl md:text-5xl lg:text-5xl font-black text-[#002d4d] tracking-tight leading-none"
              >
                مُستخدِم يثقون بنا
              </motion.h2>
           </div>

           {/* Elite Stats Hub */}
           <EliteStatsHub />
        </div>

        {/* RIGHT WING: Activation Hub */}
        <div className="flex-1 flex flex-col items-center lg:items-center space-y-12 lg:space-y-14">
           {/* Activation Action Hub */}
           <ActivationActionHub isLoggedIn={isLoggedIn} />
        </div>

      </div>
    </section>
  );
}
