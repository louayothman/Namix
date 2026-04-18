"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { MarketPulse } from "@/components/landing/MarketPulse";
import { SupportSheet } from "@/components/support/SupportSheet";
import { MarketPulseBackground } from "@/components/landing/MarketPulseBackground";

// Dynamic Dialogs for Performance
const AboutDialog = dynamic(() => import("@/components/landing/AboutDialog").then(m => ({ default: m.AboutDialog })), { ssr: false });
const ContractLabDialog = dynamic(() => import("@/components/landing/ContractLabDialog").then(m => ({ default: m.ContractLabDialog })), { ssr: false });
const SpotTradingDialog = dynamic(() => import("@/components/landing/SpotTradingDialog").then(m => ({ default: m.SpotTradingDialog })), { ssr: false });
const FAQDialog = dynamic(() => import("@/components/landing/FAQDialog").then(m => ({ default: m.FAQDialog })), { ssr: false });
const PrivacyDialog = dynamic(() => import("@/components/landing/PrivacyDialog").then(m => ({ default: m.PrivacyDialog })), { ssr: false });
const TermsDialog = dynamic(() => import("@/components/landing/TermsDialog").then(m => ({ default: m.TermsDialog })), { ssr: false });

/**
 * @fileOverview بوابة ناميكس الاستثمارية v34.0 - Neural Clarity Edition
 * تم تطهير الصفحة من الشعار الشبحي لضمان بروز خلفية النيورون الملونة.
 */
export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Dialog States
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContractLabOpen, setIsContractLabOpen] = useState(false);
  const [isSpotTradingOpen, setIsSpotTradingOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  useEffect(() => {
    const user = localStorage.getItem("namix_user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#f9a885]/30 overflow-x-hidden flex flex-col" dir="rtl">
      
      {/* 1. النواة المركزية: خلفية النيورون الرقمية الملونة */}
      <MarketPulseBackground />

      <main className="relative z-10 flex-1 flex flex-col">
        <Hero />
        <MarketPulse />
      </main>

      <Footer 
        onAboutClick={() => setIsAboutOpen(true)} 
        onContractLabClick={() => setIsContractLabOpen(true)} 
        onSpotTradingClick={() => setIsSpotTradingOpen(true)}
        onArenaClick={() => {}} 
        onFAQClick={() => setIsFAQOpen(true)}
        onPrivacyClick={() => setIsPrivacyOpen(true)}
        onTermsClick={() => setIsTermsOpen(true)}
        onSupportClick={() => setIsSupportOpen(true)}
      />
      
      {/* Dialog Matrices */}
      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
      <ContractLabDialog open={isContractLabOpen} onOpenChange={isContractLabOpen} />
      <SpotTradingDialog open={isSpotTradingOpen} onOpenChange={setIsSpotTradingOpen} />
      <FAQDialog open={isFAQOpen} onOpenChange={isFAQOpen} onContactClick={() => setIsSupportOpen(true)} />
      <PrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
      <TermsDialog open={isTermsOpen} onOpenChange={setIsTermsOpen} />
      <SupportSheet open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
}
