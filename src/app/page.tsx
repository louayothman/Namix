"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureBento } from "@/components/landing/FeatureBento";
import { StatsPulse } from "@/components/landing/StatsPulse";
import { ActionCore } from "@/components/landing/ActionCore";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { MarketTicker } from "@/components/landing/MarketTicker";

/**
 * @fileOverview بوابة ناميكس العالمية v10.0 - إصدار "الغسق الرقمي"
 * تصميم غريب، فريد، وفخم جداً يعتمد على التباين العالي والنقاء المعماري.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#001a2d] text-white font-body selection:bg-[#f9a885]/30 overflow-x-hidden relative">
      
      {/* Dynamic Mesh Background - High Performance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#f9a885]/5 rounded-full blur-[100px]" />
      </div>

      {/* Entry Reveal Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 will-change-transform"
      >
        <LandingHeader />
        
        <main>
          <HeroSection />
          <MarketTicker />
          <FeatureBento />
          <StatsPulse />
          <ActionCore />
        </main>

        <LandingFooter />
      </motion.div>

    </div>
  );
}