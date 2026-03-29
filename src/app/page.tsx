
"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MarketPulse } from "@/components/landing/MarketPulse";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { useMarketStore } from "@/store/use-market-store";
import { useMarketSync } from "@/hooks/use-market-sync";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useCollection } from "@/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const db = useFirestore();
  
  // جلب الإعدادات من قاعدة البيانات
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData } = useDoc(landingRef);

  const symbolsQuery = useMemoFirebase(() => query(collection(db, "trading_symbols"), where("isActive", "==", true)), [db]);
  const { data: allSymbols } = useCollection(symbolsQuery);

  // مزامنة الأسعار الحية لشريط الأنباء
  useMarketSync(allSymbols || []);

  return (
    <div className="min-h-screen bg-white font-body selection:bg-[#f9a885]/30 overflow-x-hidden" dir="rtl">
      {/* طبقة السديم الخلفية الرقيقة */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.03)_0%,transparent_70%)] blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <Hero 
          title={landingData?.welcomeTitle} 
          subtitle={landingData?.welcomeSubtitle} 
          description={landingData?.welcomeDescription} 
        />
        
        <MarketPulse symbols={allSymbols || []} />
        
        <Features />
        
        {/* قسم الدعوة للعمل (CTA) */}
        <section className="container mx-auto px-6 py-32">
          <div className="bg-[#002d4d] rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 space-y-8"
            >
              <h2 className="text-3xl md:text-6xl font-black text-white leading-tight">ابدأ رحلتك السيادية اليوم</h2>
              <p className="text-blue-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-loose">
                انضم لنخبة المستثمرين في ناميكس واستفد من أحدث تقنيات التداول والذكاء الاصطناعي.
              </p>
              <div className="pt-4">
                <a href="/login">
                  <button className="h-16 px-12 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-lg shadow-xl hover:bg-white transition-all active:scale-95">
                    فتح حساب استثماري
                  </button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
