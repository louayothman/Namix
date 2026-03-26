
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Modular Components
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * @fileOverview بوابة ناميكس العالمية v6.0 - Modular Architecture Edition
 * تم تفكيك الصفحة إلى مكونات مستقلة لسهولة الإدارة مع الحفاظ على الروح السينمائية.
 */

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem("namix_user");
    if (user) router.replace("/home");
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/20 overflow-x-hidden relative" dir="rtl">
      
      {/* 1. السديم النوراني الخلفي (Atmospheric Glow) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-5%] left-[-10%] w-[70%] h-[70%] bg-blue-50/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#f9a885]/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* 2. شريط الملاحة (Bilingual Navbar) */}
      <LandingNavbar />

      {/* 3. الهيرو السينمائي (Elite Hero) */}
      <HeroSection />

      {/* 4. نبض الأسواق اللحظي (Live Ticker) */}
      <MarketTicker />

      {/* 5. المميزات الذكية (Smart Features) */}
      <FeaturesSection />

      {/* 6. جرد الشبكة (Reliability & Stats) */}
      <StatsSection />

      {/* 7. التذييل العالمي (Global Footer) */}
      <LandingFooter />

    </div>
  );
}
