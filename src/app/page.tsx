
"use client";

import React, { useEffect, useState } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { SovereignIntro } from "@/components/landing/SovereignIntro";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بوابة ناميكس السيادية v100.0 - Quantum Horizon Edition
 * تم إلغاء نظام الرسو الميكانيكي واستبداله بانتقال "التكثيف السائل" لضمان دقة التموضع.
 * الهوية تبدأ في المركز وتنزلق للزاوية العلوية لتتحول لهيدر زجاجي عائم.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  const { scrollY } = useScroll();
  
  // 1. Nebula Expansion - السديم يتوسع ليوفر خلفية للهيرو
  const nebulaScale = useTransform(scrollY, [0, 500], [1, 2.5]);
  const nebulaOpacity = useTransform(scrollY, [0, 400], [0.2, 0.95]);
  
  // 2. Header Visibility - الهيدر الزجاجي يظهر بتلاشي نقي
  const headerOpacity = useTransform(scrollY, [100, 250], [0, 1]);
  const headerBlur = useTransform(scrollY, [100, 250], [0, 12]);

  // 3. Logo Orchestration - تحويل الهوية من المركز للزاوية
  // يبدأ في منتصف الشاشة وينتهي في الزاوية العلوية اليمنى (Header Position)
  const logoX = useTransform(scrollY, [0, 300], ["0%", "38vw"]);
  const logoY = useTransform(scrollY, [0, 300], ["0vh", "-44vh"]);
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.45]);
  
  // 4. Content Logic
  const introOpacity = useTransform(scrollY, [0, 80], [1, 0]);
  const heroOpacity = useTransform(scrollY, [200, 400], [0, 1]);
  const indicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="relative min-h-[300vh] bg-white overflow-x-hidden font-body selection:bg-[#f9a885]/30">
      
      {/* Dynamic Nebula Layer - الخلفية الكونية المتغيرة */}
      <motion.div 
        style={{ scale: nebulaScale, opacity: nebulaOpacity }}
        className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[160%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.7)_0%,transparent_75%)] z-0 pointer-events-none blur-[140px]" 
      />

      {/* Floating Glass Header - هيدر عائم زجاجي بدون حواف */}
      <motion.header
        style={{ 
          opacity: headerOpacity,
          backdropFilter: `blur(12px)`,
          WebkitBackdropFilter: `blur(12px)`
        }}
        className="fixed top-0 left-0 w-full h-20 bg-white/50 z-[100] border-b border-white/10 pointer-events-none"
      >
        <div className="container mx-auto h-full flex items-center justify-between px-8">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <div className="flex items-center gap-6 opacity-40">
              <div className="h-px w-12 bg-blue-900/20" />
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#002d4d]">Namix Sovereign Hub</span>
           </div>
        </div>
      </motion.header>

      {/* Identity Orchestrator - محرك الهوية المركزية المتحركة */}
      <div className="fixed inset-0 z-[110] pointer-events-none flex items-center justify-center">
        <motion.div 
          style={{ 
            x: logoX,
            y: logoY, 
            scale: logoScale
          }}
          className="pointer-events-auto"
        >
          <SovereignIntro 
            introText={landingData?.introText} 
            introOpacity={introOpacity} 
            scrollY={scrollY}
          />
        </motion.div>
      </div>

      {/* Main Hero Section */}
      <motion.main 
        style={{ opacity: heroOpacity }}
        className="relative z-10 pt-[100vh]"
      >
        <SovereignHero 
          title={landingData?.welcomeTitle || "ناميكس: السيادة الرقمية للثروة"}
          description={landingData?.welcomeDescription || "نظام استثماري متطور يجمع بين الذكاء الاصطناعي وحماية الأصول المطلقة."}
          isLoading={isLoading}
        />
      </motion.main>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity: indicatorOpacity }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 border-2 border-[#002d4d]/10 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 bg-[#002d4d]/40 rounded-full"
          />
        </div>
        <span className="text-[7px] font-black text-[#002d4d]/20 uppercase tracking-[0.4em]">Scroll to Enter</span>
      </motion.div>

      {/* Brand Footer Signature */}
      <div className="fixed bottom-6 right-8 opacity-5 z-[100] pointer-events-none hidden md:block">
         <p className="text-[8px] font-black uppercase tracking-[1em] text-[#002d4d]">Namix Universal Network</p>
      </div>
    </div>
  );
}
