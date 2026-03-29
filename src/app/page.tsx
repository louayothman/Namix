
"use client";

import React, { useEffect, useState } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { SovereignIntro } from "@/components/landing/SovereignIntro";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/**
 * @fileOverview بوابة ناميكس السيادية v65.0 - محرك الدوران التزامني
 * تم دمج دوران الشعار مع اتجاه التمرير (يمين أسفل، يسار أعلى) وتوسيع السديم.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  const { scrollY } = useScroll();
  
  // 1. Nebula Expansion - توسيع السديم مع التمرير
  const nebulaScale = useTransform(scrollY, [0, 500], [1, 1.8]);
  const nebulaOpacity = useTransform(scrollY, [0, 300], [0.4, 0.9]);
  
  // 2. Logo Transformation - تحويل موضع الشعار وحجمه
  const logoY = useTransform(scrollY, [0, 200], ["0vh", "-44vh"]);
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.5]);
  
  // 3. Kinetic Rotation - الدوران حول المركز (يمين عند النزول، يسار عند الصعود)
  const logoRotate = useTransform(scrollY, [0, 500], [0, 360]);

  // 4. Content Visibility
  const introOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const heroOpacity = useTransform(scrollY, [50, 200], [0, 1]);
  const indicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="relative min-h-[300vh] bg-white overflow-x-hidden font-body selection:bg-[#f9a885]/30">
      
      {/* Dynamic Nebula Layer - سديم كحلي متوسع */}
      <motion.div 
        style={{ scale: nebulaScale, opacity: nebulaOpacity }}
        className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.8)_0%,transparent_70%)] z-0 pointer-events-none blur-[100px]" 
      />

      {/* Intro & Logo Orchestrator - محرك الدوران الموحد */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <motion.div 
          style={{ 
            y: logoY, 
            scale: logoScale,
            rotate: logoRotate
          }}
          className="pointer-events-auto"
        >
          {/* الشعار فقط هو الذي يدور ويتحرك، والنص يختفي عبر introOpacity */}
          <SovereignIntro introText={landingData?.introText} introOpacity={introOpacity} />
        </motion.div>
      </div>

      {/* Main Hero Section - تظهر عند التمرير */}
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
        <div className="w-6 h-10 border-2 border-[#002d4d]/20 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-[#002d4d] rounded-full"
          />
        </div>
        <span className="text-[8px] font-black text-[#002d4d]/30 uppercase tracking-[0.3em]">Scroll Down</span>
      </motion.div>

      {/* Brand Footer Signature */}
      <div className="fixed bottom-6 right-8 opacity-5 z-[100] pointer-events-none hidden md:block">
         <p className="text-[8px] font-black uppercase tracking-[1em] text-[#002d4d]">Namix Universal Network</p>
      </div>
    </div>
  );
}
