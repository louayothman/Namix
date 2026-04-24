
"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { MarketPulse } from "@/components/landing/MarketPulse";
import { SupportSheet } from "@/components/support/SupportSheet";

// Dynamic Dialogs for Performance
const AboutDialog = dynamic(() => import("@/components/landing/AboutDialog").then(m => ({ default: m.AboutDialog })), { ssr: false });
const ContractLabDialog = dynamic(() => import("@/components/landing/ContractLabDialog").then(m => ({ default: m.ContractLabDialog })), { ssr: false });
const SpotTradingDialog = dynamic(() => import("@/components/landing/SpotTradingDialog").then(m => ({ default: m.SpotTradingDialog })), { ssr: false });
const FAQDialog = dynamic(() => import("@/components/landing/FAQDialog").then(m => ({ default: m.FAQDialog })), { ssr: false });
const PrivacyDialog = dynamic(() => import("@/components/landing/PrivacyDialog").then(m => ({ default: m.PrivacyDialog })), { ssr: false });
const TermsDialog = dynamic(() => import("@/components/landing/TermsDialog").then(m => ({ default: m.TermsDialog })), { ssr: false });

/**
 * @fileOverview بوابة ناميكس الاستثمارية v38.0 - Pure White Edition
 * تم إزالة الخلفية الدورانية لضمان مظهر أبيض ناصع ونقي تماماً.
 */
export default function LandingPage() {
  const router = useRouter();
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
    const userSession = localStorage.getItem("namix_user");
    const hasUser = !!userSession;
    setIsLoggedIn(hasUser);

    // محرك التوجيه الذكي للتطبيق المثبت
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone && hasUser) {
      try {
        const parsed = JSON.parse(userSession);
        if (parsed.role === 'admin') {
          router.replace("/admin");
        } else {
          router.replace("/home");
        }
      } catch (e) {
        console.error("Redirect Engine Error");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen font-body selection:bg-[#f9a885]/30 overflow-x-hidden flex flex-col bg-white" dir="rtl">
      
      <main className="relative z-10 flex-1 flex flex-col bg-transparent">
        <Hero />
        <div className="-mt-8 md:-mt-16 relative z-20">
          <MarketPulse />
        </div>
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
      <ContractLabDialog open={isContractLabOpen} onOpenChange={setIsContractLabOpen} />
      <SpotTradingDialog open={isSpotTradingOpen} onOpenChange={setIsSpotTradingOpen} />
      <FAQDialog open={isFAQOpen} onOpenChange={setIsFAQOpen} onContactClick={() => setIsSupportOpen(true)} />
      <PrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
      <TermsDialog open={isTermsOpen} onOpenChange={setIsTermsOpen} />
      <SupportSheet open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
}
