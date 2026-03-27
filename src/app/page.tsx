
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarketTicker } from "@/components/landing/MarketTicker";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" />
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-normal">NAMIX SYSTEM READY</p>
    </div>
  </div>
);

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <PageLoader />;

  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/20 overflow-x-hidden relative">
      
      {/* عناصر الخلفية الثابتة للأداء العالي */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-blue-50/30 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-[#f9a885]/5 rounded-full blur-[80px]" />
      </div>

      <LandingNavbar />

      <main className="relative z-10 will-change-transform">
        <HeroSection />
        <MarketTicker />
        <FeaturesSection />
        <ProcessSection />
        <StatsSection />
        <FinalCTA />
      </main>

      <LandingFooter />

    </div>
  );
}
