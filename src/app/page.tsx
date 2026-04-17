
"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SupportSheet } from "@/components/support/SupportSheet";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Activity, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import Link from "next/link";

// Dynamic Dialogs for Performance
const AboutDialog = dynamic(() => import("@/components/landing/AboutDialog").then(m => ({ default: m.AboutDialog })), { ssr: false });
const ContractLabDialog = dynamic(() => import("@/components/landing/ContractLabDialog").then(m => ({ default: m.ContractLabDialog })), { ssr: false });
const SpotTradingDialog = dynamic(() => import("@/components/landing/SpotTradingDialog").then(m => ({ default: m.SpotTradingDialog })), { ssr: false });
const FAQDialog = dynamic(() => import("@/components/landing/FAQDialog").then(m => ({ default: m.FAQDialog })), { ssr: false });
const PrivacyDialog = dynamic(() => import("@/components/landing/PrivacyDialog").then(m => ({ default: m.PrivacyDialog })), { ssr: false });
const TermsDialog = dynamic(() => import("@/components/landing/TermsDialog").then(m => ({ default: m.TermsDialog })), { ssr: false });

/**
 * @fileOverview صفحة الهبوط المحدثة v22.0 - Luxury Investment Node
 * تصميم مينيماليست يعتمد على اللغة الاحترافية الرصينة والهوية البصرية العميقة.
 */
export default function LandingPage() {
  const db = useFirestore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Dialog States
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContractLabOpen, setIsContractLabOpen] = useState(false);
  const [isSpotTradingOpen, setIsSpotTradingOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData } = useDoc(landingRef);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    setIsLoggedIn(!!session);
  }, []);

  const dashboardLink = isLoggedIn ? "/home" : "/login";

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#f9a885]/30 overflow-x-hidden flex flex-col" dir="rtl">
      
      {/* Background Atmosphere & Sovereign Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.02)_0%,transparent:70%)] blur-[100px]" />
        
        {/* Giant Sovereign Logo Aura - الختم السيادي الشفاف */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] scale-[2.5] md:scale-[5] select-none pointer-events-none">
           <Logo size="lg" hideText animate={true} />
        </div>
      </div>

      <Navbar onAboutClick={() => setIsAboutOpen(true)} />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 pb-24">
        
        {/* Central Intelligence Hub */}
        <section className="container mx-auto px-6 max-w-5xl text-center space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-12"
          >
            <div className="space-y-8 pt-4">
              {/* Badge Indicator */}
              <div className="flex items-center justify-center gap-3">
                 <div className="h-[0.5px] w-12 bg-[#002d4d]/10" />
                 <span className="text-[10px] font-black text-blue-600/60 uppercase tracking-[0.5em] mr-[-0.5em]">Global Digital Asset Standard</span>
                 <div className="h-[0.5px] w-12 bg-[#002d4d]/10" />
              </div>
              
              {/* Thick Professional Headline */}
              <h1 className="text-4xl md:text-7xl font-black text-[#002d4d] tracking-tighter leading-[1.1] max-w-4xl mx-auto">
                {landingData?.welcomeTitle || "ناميكس | المنظومة العالمية لإدارة وتداول الأصول الرقمية"}
              </h1>
              
              {/* Substantial Descriptive Copy */}
              <p className="text-gray-400 text-base md:text-xl font-medium max-w-3xl mx-auto leading-[2.2] md:leading-[2.5] opacity-90 px-4">
                {landingData?.welcomeDescription || "انضم إلى الجيل القادم من الاستثمار الذكي. ناميكس تمنحك وصولاً وميضياً للأسواق العالمية، وتجمع بين التداول الفوري المتقدم وعقود الاستثمار السيادية المؤتمتة، مدعومة بمحركات تحليل نانوية تضمن لك الشفافية المطلقة والنمو المستدام في بيئة آمنة تماماً."}
              </p>
            </div>

            {/* Tactical Execution Matrix */}
            <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-lg px-6">
              <Link href={dashboardLink} className="w-full">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-16 w-full rounded-full bg-[#002d4d] text-white font-black text-sm shadow-2xl hover:bg-[#001d33] transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
                >
                  {/* Luminescent Shimmer Effect */}
                  <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
                  
                  <span>بدء جلسة الاستثمار السيادي</span>
                  <ArrowRight className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1" />
                </motion.button>
              </Link>
            </div>

            {/* Functional Status Tickers */}
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-30 pt-10">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">Security Verified</span>
               </div>
               <div className="flex items-center gap-3">
                  <Zap size={16} className="text-[#f9a885] fill-current" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">Real-time Execution</span>
               </div>
               <div className="flex items-center gap-3">
                  <Activity size={16} className="text-blue-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#002d4d]">Institutional Pulse</span>
               </div>
            </div>
          </motion.div>
        </section>

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
      
      {/* Sovereign Dialog Matrices */}
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
