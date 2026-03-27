
"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ContractHero } from "@/components/landing/ContractHero";
import { TradingHero } from "@/components/landing/TradingHero";
import { ArenaHero } from "@/components/landing/ArenaHero";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * @fileOverview بوابة ناميكس العالمية v16.0 - إصدار النقاء الرقمي
 * تم توحيد الصفحة بخلفية بيضاء صلبة وثلاثة محاور استراتيجية للنمو.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/30 overflow-x-hidden relative">
      <LandingNavbar />
      
      <main className="relative">
        <ContractHero />
        <div className="h-px w-full bg-gray-100" />
        <TradingHero />
        <div className="h-px w-full bg-gray-100" />
        <ArenaHero />
      </main>

      <LandingFooter />
    </div>
  );
}
