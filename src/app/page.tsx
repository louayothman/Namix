
"use client";

import React, { useEffect, useState } from "react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { SovereignIntro } from "@/components/landing/SovereignIntro";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بوابة ناميكس السيادية v67.0 - Sovereign Header Docking Edition
 * تم إضافة الهيدر العلوي بمركز دائري لاستقبال الشعار الدوار أثناء التمرير.
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  const { scrollY } = useScroll();
  
  // 1. Nebula Expansion - توسيع السديم الكحلي
  const nebulaScale = useTransform(scrollY, [0, 500], [1, 2.5]);
  const nebulaOpacity = useTransform(scrollY, [0, 300], [0.3, 0.9]);
  
  // 2. Logo Translation - تحويل موضع الشعار للأعلى ليستقر في منصة الهيدر
  const logoY = useTransform(scrollY, [0, 300], ["0vh", "-45.5vh"]);
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.45]);
  
  // 3. Axial Rotation - الدوران حول المركز فقط مع اتجاه التمرير
  const logoRotate = useTransform(scrollY, [0, 1000], [0, 720]);

  // 4. Header Visibility - ظهور الهيدر العلوي
  const headerOpacity = useTransform(scrollY, [150, 300], [0, 1]);
  const headerY = useTransform(scrollY, [150, 300], [-100, 0]);

  // 5. Content Visibility - تلاشي النص والظهور المتدرج للهيرو
  const introOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const heroOpacity = useTransform(scrollY, [200, 400], [0, 1]);
  const indicatorOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="relative min-h-[300vh] bg-white overflow-x-hidden font-body selection:bg-[#f9a885]/30">
      
      {/* Sovereign Header - الهيدر المطور بمنصة رسو دائرية */}
      <motion.header
        style={{ opacity: headerOpacity, y: headerY }}
        className="fixed top-0 left-0 w-full z-[100] pointer-events-none"
      >
        <div className="relative w-full h-20 bg-white shadow-2xl rounded-b-[48px] border-b border-gray-50 flex items-center justify-center pointer-events-auto">
           {/* Circular Dock - منصة الرسو الدائرية */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-inner border border-gray-50 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gray-50/50 border border-dashed border-gray-100 animate-spin-slow opacity-20" />
           </div>
        </div>
      </motion.header>

      {/* Dynamic Nebula Layer */}
      <motion.div 
        style={{ scale: nebulaScale, opacity: nebulaOpacity }}
        className="fixed top-[-15%] left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(0,45,77,0.6)_0%,transparent_70%)] z-0 pointer-events-none blur-[120px]" 
      />

      {/* Intro & Logo Orchestrator */}
      <div className="fixed inset-0 z-[110] pointer-events-none flex items-center justify-center">
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

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
