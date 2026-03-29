
"use client";

import React, { useEffect, useState } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { SovereignIntro } from "@/components/landing/SovereignIntro";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/**
 * @fileOverview بوابة ناميكس السيادية v60.0 - الميتا-انترو الفيزيائي
 * تم دمج نظام الانترو الدائري مع محرك التمرير المتزامن والسديم المتوسع.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [introStage, setIntroStage] = useState<'animating' | 'completed'>('animating');
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  const { scrollY } = useScroll();
  
  // تحويل مساحة السديم بناءً على التمرير
  const nebulaScale = useTransform(scrollY, [0, 500], [1, 1.5]);
  const nebulaOpacity = useTransform(scrollY, [0, 300], [0.4, 0.8]);
  
  // تحويل تموضع الشعار من المركز للأعلى عند التمرير
  const logoY = useTransform(scrollY, [0, 100], ["0%", "-42vh"]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.6]);
  const contentOpacity = useTransform(scrollY, [50, 150], [0, 1]);

  // محرك إخفاء مؤشر التمرير عند البدء - تم نقله هنا للامتثال لقواعد React Hooks
  const indicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="relative min-h-[200vh] bg-white overflow-x-hidden font-body selection:bg-[#f9a885]/30">
      
      {/* 1. Dynamic Nebula Layer - سديم كحلي متوسع */}
      <motion.div 
        style={{ scale: nebulaScale, opacity: nebulaOpacity }}
        className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.8)_0%,transparent_70%)] z-0 pointer-events-none blur-[80px]" 
      />

      {/* 2. Intro & Header Controller - محرك الانترو والهيدر الموحد */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <motion.div 
          style={{ y: logoY, scale: logoScale }}
          className="pointer-events-auto"
        >
          <SovereignIntro onComplete={() => setIntroStage('completed')} />
        </motion.div>
      </div>

      {/* 3. Main Hero Section - تظهر عند التمرير */}
      <motion.main 
        style={{ opacity: contentOpacity }}
        className="relative z-10 pt-[100vh]"
      >
        <SovereignHero 
          title={landingData?.welcomeTitle || "ناميكس: السيادة الرقمية للثروة"}
          description={landingData?.welcomeDescription || "نظام استثماري متطور يجمع بين الذكاء الاصطناعي وحماية الأصول المطلقة."}
          isLoading={isLoading}
        />
      </motion.main>

      {/* 4. Scroll Indicator - يختفي عند التمرير */}
      <AnimatePresence>
        {introStage === 'completed' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ opacity: indicatorOpacity }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          >
            <div className="w-6 h-10 border-2 border-[#002d4d]/20 rounded-full flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 bg-[#002d4d] rounded-full"
              />
            </div>
            <span className="text-[8px] font-black text-[#002d4d]/30 uppercase tracking-[0.3em]">Scroll</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Footer Signature */}
      <div className="fixed bottom-6 right-8 opacity-5 z-[100] pointer-events-none hidden md:block">
         <p className="text-[8px] font-black uppercase tracking-[1em] text-[#002d4d]">Namix Universal Network</p>
      </div>
    </div>
  );
}
