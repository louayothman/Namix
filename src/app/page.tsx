"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";

/**
 * @fileOverview صفحة الهبوط العالمية v15.0 - إصدار "النقاء المظلم"
 * تم إعادة الهيكلة لتصبح بسيطة، هادئة، وفخمة جداً بناءً على التصميم المعتمد.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white font-body selection:bg-[#00d1ff]/30 overflow-x-hidden relative">
      {/* Global Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <LandingNavbar />
        
        <main>
          <HeroSection />
        </main>
      </div>
    </div>
  );
}