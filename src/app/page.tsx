
"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { WelcomeHero } from "@/components/landing/WelcomeHero";
import { ContractHero } from "@/components/landing/ContractHero";
import { TradingHero } from "@/components/landing/TradingHero";
import { ArenaHero } from "@/components/landing/ArenaHero";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * @fileOverview بوابة ناميكس العالمية v17.0 - إصدار النقاء الرباعي
 * تم تحديث الهيكلية لتشمل 4 أقسام هيرو تبدأ بالترحيب والتعريف الشامل.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/30 overflow-x-hidden relative">
      <LandingNavbar />
      
      <main className="relative">
        <WelcomeHero />
        <div className="h-px w-full bg-gray-50" />
        <ContractHero />
        <div className="h-px w-full bg-gray-50" />
        <TradingHero />
        <div className="h-px w-full bg-gray-50" />
        <ArenaHero />
      </main>

      <LandingFooter />
    </div>
  );
}
