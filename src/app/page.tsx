
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Modular Components
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection1 } from "@/components/landing/HeroSection1";
import { HeroSection2 } from "@/components/landing/HeroSection2";
import { HeroSection3 } from "@/components/landing/HeroSection3";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * @fileOverview بوابة ناميكس الموحدة v4.0 - إصدار الاندماج النوراني
 * تم تحويل شريط الملاحة ليكون مدمجاً بالكامل في بنية الصفحة.
 */

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    if (user) {
      // Logic remained but destination updated to /home as per architecture
      router.replace("/home");
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/20 overflow-x-hidden relative">
      
      {/* سديم نوراني خلفي هادئ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-5%] left-[-10%] w-[70%] h-[70%] bg-blue-50/20 rounded-full blur-[120px]" 
        />
      </div>

      {/* شريط الملاحة المدمج (غير ثابت) */}
      <LandingNavbar />

      <HeroSection1 />
      
      <MarketTicker />

      <HeroSection2 />

      <HeroSection3 />

      <FeaturesSection />

      <StatsSection />

      <LandingFooter />

    </div>
  );
}
