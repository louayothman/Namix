
"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2 } from "lucide-react";

// Lazy loading for high-end performance
const LandingNavbar = lazy(() => import("@/components/landing/LandingNavbar").then(m => ({ default: m.LandingNavbar })));
const HeroSection = lazy(() => import("@/components/landing/HeroSection").then(m => ({ default: m.HeroSection })));
const MarketTicker = lazy(() => import("@/components/landing/MarketTicker").then(m => ({ default: m.MarketTicker })));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection").then(m => ({ default: m.FeaturesSection })));
const ProcessSection = lazy(() => import("@/components/landing/ProcessSection").then(m => ({ default: m.ProcessSection })));
const StatsSection = lazy(() => import("@/components/landing/StatsSection").then(m => ({ default: m.StatsSection })));
const FinalCTA = lazy(() => import("@/components/landing/FinalCTA").then(m => ({ default: m.FinalCTA })));
const LandingFooter = lazy(() => import("@/components/landing/LandingFooter").then(m => ({ default: m.LandingFooter })));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" />
      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Synchronizing Excellence...</p>
    </div>
  </div>
);

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <PageLoader />;

  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/20 overflow-x-hidden relative">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-blue-50/40 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-[#f9a885]/5 rounded-full blur-[120px]" 
        />
      </div>

      <Suspense fallback={null}>
        <LandingNavbar />
      </Suspense>

      <main className="relative z-10">
        <Suspense fallback={<PageLoader />}>
          <HeroSection />
          <MarketTicker />
          <FeaturesSection />
          <ProcessSection />
          <StatsSection />
          <FinalCTA />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <LandingFooter />
      </Suspense>

    </div>
  );
}
