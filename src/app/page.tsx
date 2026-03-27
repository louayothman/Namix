
"use client";

import React from "react";
import { WelcomeHero } from "@/components/landing/WelcomeHero";
import { ContractHero } from "@/components/landing/ContractHero";
import { TradingHero } from "@/components/landing/TradingHero";
import { ArenaHero } from "@/components/landing/ArenaHero";
import { LandingFooter } from "@/components/landing/LandingFooter";

/**
 * @fileOverview بوابة ناميكس العالمية v25.0 - الإصدار المدمج (No Navbar Edition)
 * الصفحة الرئيسية تعتمد على دمج الهوية مباشرة في هيرو الترحيب لتوفير مساحة بصرية أنقى.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#002d4d] font-body selection:bg-[#f9a885]/30 overflow-x-hidden relative">
      <main className="relative">
        {/* تم دمج الشعار والزر الأساسي داخل WelcomeHero مباشرة بناءً على طلب المستخدم */}
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
