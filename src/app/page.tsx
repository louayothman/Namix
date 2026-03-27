
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Modular Components
import { HeroSection1 } from "@/components/landing/HeroSection1";
import { HeroSection2 } from "@/components/landing/HeroSection2";
import { HeroSection3 } from "@/components/landing/HeroSection3";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * @fileOverview بوابة ناميكس الموحدة v8.0 - إصدار النقاء المعماري
 * تم دمج الهوية مباشرة في الصفحة مع خلفية موحدة باللون #7D8E9E.
 */

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#7D8E9E] text-white font-body selection:bg-[#f9a885]/20 overflow-x-hidden relative">
      
      {/* Header Section - Integrated */}
      <header className="w-full px-8 py-10 flex items-center justify-between relative z-50 overflow-hidden">
        {/* Large semi-transparent background icon behind logo area */}
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-[0.08] pointer-events-none select-none">
           <div className="grid grid-cols-2 gap-6 md:gap-10">
              <div className="h-40 w-40 md:h-64 md:w-64 rounded-full bg-white" />
              <div className="h-40 w-40 md:h-64 md:w-64 rounded-full bg-[#f9a885]" />
              <div className="h-40 w-40 md:h-64 md:w-64 rounded-full bg-[#f9a885]" />
              <div className="h-40 w-40 md:h-64 md:w-64 rounded-full bg-white" />
           </div>
        </div>

        {/* Logo Identity */}
        <div className="flex items-center gap-4 relative z-10" dir="ltr">
           <div className="grid grid-cols-2 gap-1.5 mr-4">
              <div className="h-2.5 w-2.5 rounded-full bg-white shadow-lg" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885] shadow-lg" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#f9a885] shadow-lg" />
              <div className="h-2.5 w-2.5 rounded-full bg-white shadow-lg" />
           </div>
           <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white italic leading-none select-none">
             NAMIX
           </h1>
        </div>

        {/* Call to Action Button */}
        <div className="relative z-10">
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <Button className="h-14 px-10 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-sm shadow-2xl transition-all active:scale-95 border-none group">
              {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}
              <motion.div 
                className="inline-block ml-2"
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>
            </Button>
          </Link>
        </div>
      </header>

      <HeroSection1 />
      
      <div className="relative z-50">
        <MarketTicker />
      </div>

      <HeroSection2 />

      <HeroSection3 />

      <FeaturesSection />

      <StatsSection />

      <LandingFooter />

    </div>
  );
}

import { ChevronLeft } from "lucide-react";
