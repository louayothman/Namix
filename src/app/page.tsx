
"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SupportSheet } from "@/components/support/SupportSheet";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Zap, Activity } from "lucide-react";
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
 * @fileOverview صفحة الهبوط السيادية v20.0 - Sovereign Minimalism
 * تصميم نقي، سريع، وموجه للنخبة؛ تم استئصال كافة المكونات المزدحمة والتركيز على جوهر العلامة التجارية.
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
      
      {/* Background Atmosphere - Ultra Light */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.02)_0%,transparent_70%)] blur-[100px]" />
      </div>

      <Navbar onAboutClick={() => setIsAboutOpen(true)} />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 pb-20">
        
        {/* Central Identity Section */}
        <section className="container mx-auto px-6 max-w-4xl text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-10"
          >
            {/* Morphic Logo Shield */}
            <div className="relative group">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-40px] border border-dashed border-gray-100 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative z-10 scale-[2.2] md:scale-[2.8] drop-shadow-2xl">
                <Logo size="lg" hideText animate={true} />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-center gap-3">
                 <div className="h-[0.5px] w-8 bg-blue-500/20" />
                 <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.4em] mr-[-0.4em]">Sovereign Protocol</span>
                 <div className="h-[0.5px] w-8 bg-blue-500/20" />
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black text-[#002d4d] tracking-tighter leading-[1.1]">
                {landingData?.welcomeTitle || "ناميكس: الاقتصاد الرقمي المُعاد هندسته"}
              </h1>
              
              <p className="text-gray-400 text-base md:text-xl font-medium max-w-2xl mx-auto leading-loose opacity-80">
                {landingData?.welcomeDescription || "بروتوكول إدارة أصول رقمية متقدم، يوفر حماية سيادية وعوائد استراتيجية للنخبة عبر محركات الذكاء الاصطناعي."}
              </p>
            </div>

            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-5 w-full max-w-md">
              <Link href={dashboardLink} className="w-full">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-16 w-full rounded-full bg-[#002d4d] text-white font-black text-sm shadow-2xl hover:bg-[#001d33] transition-all flex items-center justify-center gap-4 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
                  <span>ابدأ رحلة النمو</span>
                  <ArrowRight className="h-5 w-5 rotate-180 transition-transform group-hover:-translate-x-1" />
                </motion.button>
              </Link>
              
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="h-16 w-full rounded-full bg-white border border-gray-100 text-[#002d4d] font-black text-sm shadow-sm hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span>ميثاق المنصة</span>
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </button>
            </div>

            <div className="flex items-center gap-10 opacity-20 pt-10">
               <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#f9a885] fill-current" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Flash execution</span>
               </div>
               <div className="flex items-center gap-2">
                  <Activity size={14} className="text-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Real-time Sync</span>
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
