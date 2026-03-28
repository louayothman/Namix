
"use client";

import React from "react";
import { WelcomeHero } from "@/components/landing/WelcomeHero";
import { ProtocolStats } from "@/components/landing/ProtocolStats";
import { ServiceEcosystem } from "@/components/landing/ServiceEcosystem";
import { TechInfrastucture } from "@/components/landing/TechInfrastucture";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * @fileOverview بوابة ناميكس العالمية v41.0 - الإصدار النخبوي (Dark Prop Style)
 * تم دمج الفلسفة البصرية لـ Prop Trading مع وظائف ناميكس الحقيقية.
 */
export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white font-body selection:bg-[#2669E3]/30 overflow-x-hidden relative">
      {/* Sovereign Progress Rail */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#2669E3] origin-right z-[1000] shadow-[0_0_15px_#2669E3]"
        style={{ scaleX }}
      />

      {/* Cyber Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <main className="relative z-10">
        <WelcomeHero />
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2669E3]/5 to-transparent pointer-events-none" />
          <ProtocolStats />
          <ServiceEcosystem />
          <TechInfrastucture />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
