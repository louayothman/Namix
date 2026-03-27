
"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ContractHero } from "@/components/landing/ContractHero";
import { TradingHero } from "@/components/landing/TradingHero";
import { ArenaHero } from "@/components/landing/ArenaHero";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * @fileOverview بوابة ناميكس العالمية v20.0 - الإصدار الثلاثي
 * تم تقسيم الصفحة لثلاثة محاور استراتيجية: المختبر، التداول، والساحة.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white font-body selection:bg-[#00d1ff]/30 overflow-x-hidden relative">
      <LandingNavbar />
      
      <main className="relative">
        <ContractHero />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <TradingHero />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <ArenaHero />
      </main>

      <LandingFooter />
    </div>
  );
}
