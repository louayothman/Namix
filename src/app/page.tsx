
"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MarketPulse } from "@/components/landing/MarketPulse";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { AboutDialog } from "@/components/landing/AboutDialog";
import { ContractLabDialog } from "@/components/landing/ContractLabDialog";
import { SpotTradingDialog } from "@/components/landing/SpotTradingDialog";
import { AdventureArenaDialog } from "@/components/landing/AdventureArenaDialog";
import { FAQDialog } from "@/components/landing/FAQDialog";
import { PrivacyDialog } from "@/components/landing/PrivacyDialog";
import { TermsDialog } from "@/components/landing/TermsDialog";
import { SupportSheet } from "@/components/support/SupportSheet";
import { useMarketSync } from "@/hooks/use-market-sync";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { Sparkles, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const db = useFirestore();
  const [particles, setParticles] = useState<{ top: string; left: string; duration: number; delay: number }[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  
  // Dialog States
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContractLabOpen, setIsContractLabOpen] = useState(false);
  const [isSpotTradingOpen, setIsSpotTradingOpen] = useState(false);
  const [isArenaOpen, setIsArenaOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData } = useDoc(landingRef);

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), where("isActive", "==", true)), [db]);
  const { data: allSymbols } = useCollection(symbolsQuery);

  useMarketSync(allSymbols || []);

  useEffect(() => {
    // Check login status
    const session = localStorage.getItem("namix_user");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setIsLoggedIn(true);
        setUserRole(parsed.role === 'admin' ? 'admin' : 'user');
      } catch (e) {
        setIsLoggedIn(false);
      }
    }

    // Generate particles client-side only to avoid hydration mismatch
    const generated = [...Array(8)].map((_, i) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 6 + i,
      delay: i * 0.7
    }));
    setParticles(generated);
  }, []);

  const dashboardLink = isLoggedIn ? (userRole === 'admin' ? "/admin" : "/home") : "/login";

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#f9a885]/30 overflow-x-hidden" dir="rtl">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.03)_0%,transparent_70%)] blur-[120px]" />
      </div>

      <Navbar onAboutClick={() => setIsAboutOpen(true)} />

      <main className="relative z-10">
        <Hero 
          title={landingData?.welcomeTitle} 
          description={landingData?.welcomeDescription} 
          ctaLink={dashboardLink}
        />
        
        < MarketPulse symbols={allSymbols || []} />
        
        <Features />
        
        <section className="container mx-auto px-6 py-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative"
          >
            {/* Main Interactive CTA Container */}
            <div className="bg-[#002d4d] rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_50px_100px_-20px_rgba(0,45,77,0.5)]">
              
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                    rotate: [0, 90, 180, 270, 360]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500 rounded-full blur-[120px]" 
                />
                <motion.div 
                  animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.05, 0.15, 0.05],
                    rotate: [360, 270, 180, 90, 0]
                  }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#f9a885] rounded-full blur-[120px]" 
                />
                
                {/* Floating Micro-particles */}
                {particles.map((p, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -60, 0],
                      x: [0, i % 2 === 0 ? 30 : -30, 0],
                      opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{ 
                      duration: p.duration, 
                      repeat: Infinity,
                      delay: p.delay
                    }}
                    className="absolute h-1 w-1 bg-white rounded-full"
                    style={{ 
                      top: p.top, 
                      left: p.left 
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 space-y-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md mb-4"
                >
                  <Sparkles size={14} className="text-[#f9a885]" />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Join The Growth Engine</span>
                </motion.div>

                <div className="space-y-6">
                  <h2 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                    ابدأ رحلتك <span className="text-[#f9a885] drop-shadow-[0_0_15px_rgba(249,168,133,0.3)]">الاحترافية</span> اليوم
                  </h2>
                  <p className="text-blue-100/60 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-loose">
                    انضم لرواد المستثمرين في ناميكس واستفد من أحدث تقنيات التحليل والذكاء الاصطناعي المتقدمة.
                  </p>
                </div>

                <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
                  <a href={dashboardLink} className="w-full md:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-20 px-12 w-full md:w-auto rounded-full bg-[#f9a885] text-[#002d4d] font-black text-xl shadow-[0_20px_50px_rgba(249,168,133,0.3)] hover:bg-white transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-full group-hover/btn:translate-x-[-300%] transition-transform duration-1000" />
                      <span>{isLoggedIn ? "لوحة القيادة" : "فتح حساب استثماري"}</span>
                      <ArrowRight className="h-6 w-6 rotate-180 transition-transform group-hover/btn:-translate-x-2" />
                    </motion.button>
                  </a>
                  
                  <div className="flex items-center gap-8 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-400" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-[#f9a885]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Automated</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-16 -left-16 opacity-[0.04] pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
                <Zap size={350} strokeWidth={1} className="text-white" />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer 
        onAboutClick={() => setIsAboutOpen(true)} 
        onContractLabClick={() => setIsContractLabOpen(true)} 
        onSpotTradingClick={() => setIsSpotTradingOpen(true)}
        onArenaClick={() => setIsArenaOpen(true)}
        onFAQClick={() => setIsFAQOpen(true)}
        onPrivacyClick={() => setIsPrivacyOpen(true)}
        onTermsClick={() => setIsTermsOpen(true)}
        onSupportClick={() => setIsSupportOpen(true)}
      />
      
      <AboutDialog open={isAboutOpen} onOpenChange={setIsAboutOpen} />
      <ContractLabDialog open={isContractLabOpen} onOpenChange={setIsContractLabOpen} />
      <SpotTradingDialog open={isSpotTradingOpen} onOpenChange={setIsSpotTradingOpen} />
      <AdventureArenaDialog open={isArenaOpen} onOpenChange={setIsArenaOpen} />
      <FAQDialog open={isFAQOpen} onOpenChange={setIsFAQOpen} onContactClick={() => setIsSupportOpen(true)} />
      <PrivacyDialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen} />
      <TermsDialog open={isTermsOpen} onOpenChange={setIsTermsOpen} />
      <SupportSheet open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
}
