
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignIntro } from "@/components/landing/SovereignIntro";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * @fileOverview بوابة ناميكس السيادية v51.5
 * تحسين محرك التحويل: المركز المطلق -> الزاوية العلوية اليسرى.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  const { scrollY } = useScroll();

  // محرك تحويل الهوية: من المنتصف (50%) إلى الزاوية (أرقام ثابتة)
  const logoY = useTransform(scrollY, [0, 200], ["50%", isMobile ? "30px" : "40px"]);
  const logoX = useTransform(scrollY, [0, 200], ["50%", isMobile ? "20px" : "40px"]);
  
  // تصغير الحجم عند التمرير
  const logoScale = useTransform(scrollY, [0, 200], [isMobile ? 0.7 : 1, isMobile ? 0.4 : 0.5]);
  
  // معالجة الإزاحة: -50% في المركز إلى 0% في الزاوية
  const logoTranslateX = useTransform(scrollY, [0, 200], ["-50%", "0%"]);
  const logoTranslateY = useTransform(scrollY, [0, 200], ["-50%", "0%"]);

  const introOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const heroOpacity = useTransform(scrollY, [150, 400], [0, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-[200vh] bg-black overflow-x-hidden font-body">
      {/* 1. Nebula Layer - السديم الكحلي العلوي */}
      <div className="fixed inset-0 nebula-bg z-0" />

      {/* 2. Sovereign Identity Controller - متحكم الهوية السيادية */}
      <motion.div
        style={{
          position: "fixed",
          top: logoY,
          left: logoX,
          scale: logoScale,
          translateX: logoTranslateX,
          translateY: logoTranslateY,
        }}
        className="z-[100] pointer-events-none origin-center"
      >
        <SovereignIntro />
      </motion.div>

      {/* 3. Scroll Indicator - مؤشر التمرير */}
      <motion.div 
        style={{ opacity: introOpacity }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
      >
        <div className="w-[20px] h-[34px] rounded-full border-2 border-white/10 flex justify-center p-1 shadow-inner">
           <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="w-1 h-1 bg-[#f9a885] rounded-full shadow-[0_0_8px_#f9a885]" 
           />
        </div>
        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] mr-[-0.4em]">Scroll</span>
      </motion.div>

      {/* 4. Hero Content Section - هيرو سيكشن السيادة */}
      <motion.div 
        style={{ opacity: heroOpacity }}
        className="relative z-10 pt-[180px] min-h-screen"
      >
        <SovereignHero 
          title={landingData?.welcomeTitle || "ناميكس: السيادة الرقمية للثروة"}
          description={landingData?.welcomeDescription || "نظام استثماري متطور يجمع بين الذكاء الاصطناعي وحماية الأصول المطلقة."}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Footer System Signature */}
      <div className="fixed bottom-6 right-8 opacity-5 z-[100] pointer-events-none hidden md:block">
         <p className="text-[8px] font-black uppercase tracking-[1em] text-white">Namix Universal Network</p>
      </div>
    </div>
  );
}
