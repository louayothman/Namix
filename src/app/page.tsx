
"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { SupportSheet } from "@/components/support/SupportSheet";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

// Dynamic Dialogs for Performance
const AboutDialog = dynamic(() => import("@/components/landing/AboutDialog").then(m => ({ default: m.AboutDialog })), { ssr: false });
const ContractLabDialog = dynamic(() => import("@/components/landing/ContractLabDialog").then(m => ({ default: m.ContractLabDialog })), { ssr: false });
const SpotTradingDialog = dynamic(() => import("@/components/landing/SpotTradingDialog").then(m => ({ default: m.SpotTradingDialog })), { ssr: false });
const FAQDialog = dynamic(() => import("@/components/landing/FAQDialog").then(m => ({ default: m.FAQDialog })), { ssr: false });
const PrivacyDialog = dynamic(() => import("@/components/landing/PrivacyDialog").then(m => ({ default: m.PrivacyDialog })), { ssr: false });
const TermsDialog = dynamic(() => import("@/components/landing/TermsDialog").then(m => ({ default: m.TermsDialog })), { ssr: false });

/**
 * @fileOverview بوابة ناميكس الاستثمارية v29.0 - Full Minimalism
 * تم حذف الشريط العلوي (Navbar) للتركيز المطلق على الهيرو.
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
      
      {/* Background Atmosphere - Sovereign Subtle Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.01)_0%,transparent_70%)] blur-[100px]" />
        
        {/* Giant Logo Aura - العلامة المائية السيادية */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] scale-[2.5] md:scale-[5] select-none pointer-events-none">
           <Logo size="lg" hideText animate={true} />
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <Hero />
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
      <FAQDialog open={isFAQOpen} onOpenChange={isFAQOpen} onContactClick={() => setIsSupportOpen(true)} />
      <PrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
      <TermsDialog open={isTermsOpen} onOpenChange={setIsTermsOpen} />
      <SupportSheet open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
}
