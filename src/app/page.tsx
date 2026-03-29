
"use client";

import React, { useEffect, useState } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { SovereignIntro } from "@/components/landing/SovereignIntro";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/**
 * @fileOverview بوابة ناميكس السيادية v66.0 - Axial Rotation Engine
 * تم فصل دوران الشعار عن النص؛ يدور الشعار حول مركزه بينما يختفي النص بـ Fade.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  const { scrollY } = useScroll();
  
  // 1. Nebula Expansion - توسيع السديم الكحلي
  const nebulaScale = useTransform(scrollY, [0, 500], [1, 2]);
  const nebulaOpacity = useTransform(scrollY, [0, 300], [0.3, 0.8]);
  
  // 2. Logo Translation - تحويل موضع الشعار للأعلى
  const logoY = useTransform(scrollY, [0, 200], ["0vh", "-44vh"]);
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.5]);
  
  // 3. Axial Rotation - الدوران حول المركز فقط
  const logoRotate = useTransform(scrollY, [0, 1000], [0, 720]);

  // 4. Content Visibility - تلاشي النص والظهور المتدرج للهيرو
  const introOpacity = useTransform(scrollY, [0, 80], [1, 0]);
  const heroOpacity = useTransform(scrollY, [100, 250], [0, 1]);
  const indicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="relative min-h-[300vh] bg-white overflow-x-hidden font-body selection:bg-[#f9a885]/30">
      
      {/* Dynamic Nebula Layer */}
      <motion.div 
        style={{ scale: nebulaScale, opacity: nebulaOpacity }}
        className="fixed top-[-15%] left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.6)_0%,transparent_70%)] z-0 pointer-events-none blur-[120px]" 
      />

      {/* Intro & Logo Orchestrator */}
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <motion.div 
          style={{ 
            y: logoY, 
            scale: logoScale
          }}
          className="pointer-events-auto"
        >
          <SovereignIntro 
            introText={landingData?.introText} 
            introOpacity={introOpacity} 
            logoRotate={logoRotate}
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
        <span className="text-[7px] font-black text-[#002d4d]/20 uppercase tracking-[0.4em]">Discover More</span>
      </motion.div>

      {/* Brand Footer Signature */}
      <div className="fixed bottom-6 right-8 opacity-5 z-[100] pointer-events-none hidden md:block">
         <p className="text-[8px] font-black uppercase tracking-[1em] text-[#002d4d]">Namix Universal Network</p>
      </div>
    </div>
  );
}
