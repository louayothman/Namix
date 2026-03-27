
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
import { ChevronLeft } from "lucide-react";

/**
 * @fileOverview بوابة ناميكس الموحدة v9.0 - إصدار النقاء المعماري
 * تم دمج الهوية مباشرة في الصفحة مع خلفية موحدة باللون #7D8E9E.
 * تحديث: إزالة الميلان من الشعار، تصغير العناصر، وتعديل الزر ليصبح أكثر تفاعلية بدون ظلال.
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
    <div className="min-h-screen bg-[#7D8E9E] text-white font-body selection:bg-[#f9a885]/20 overflow-x-hidden relative text-[13px]">
      
      {/* Header Section - Integrated Architecture */}
      <header className="w-full px-8 py-10 flex items-center justify-between relative z-50 overflow-hidden">
        {/* Angular semi-transparent background icon - Smaller & Rotated */}
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-[0.06] rotate-[-12deg] pointer-events-none select-none">
           <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-white" />
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-[#f9a885]" />
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-[#f9a885]" />
              <div className="h-32 w-32 md:h-48 md:w-48 rounded-full bg-white" />
           </div>
        </div>

        {/* Logo Identity - Re-aligned & Non-Italic */}
        <div className="flex items-center gap-2 relative z-10" dir="ltr">
           <div className="grid grid-cols-2 gap-1 mr-1">
              <div className="h-2 w-2 rounded-full bg-white shadow-lg shadow-white/10" />
              <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
              <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
              <div className="h-2 w-2 rounded-full bg-white shadow-lg shadow-white/10" />
           </div>
           <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white leading-none select-none uppercase">
             NAMIX
           </h1>
        </div>

        {/* Call to Action Button - Vivid & Interaction Focused (No Shadow) */}
        <div className="relative z-10">
          <Link href={isLoggedIn ? "/home" : "/login"}>
            <Button className="h-12 px-8 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-[13px] transition-all active:scale-95 border-none shadow-none group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                {isLoggedIn ? "متابعة الاستخدام" : "انضم الآن"}
                <motion.div 
                  className="inline-block ml-2"
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.div>
              </span>
              {/* Subtle Shimmer Overlay on Hover */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
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
