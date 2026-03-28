
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { SovereignIntro } from "@/components/landing/SovereignIntro";
import { SovereignHero } from "@/components/landing/SovereignHero";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * @fileOverview بوابة ناميكس السيادية v54.0 - Magnetic Orbit Edition
 * محرك فيزيائي: انتقال قوسي (Curved Path) من المركز للزاوية مع ارتداد مرن (Elastic Snap).
 */
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const db = useFirestore();
  
  const landingRef = useMemoFirebase(() => doc(db, "system_settings", "landing_page"), [db]);
  const { data: landingData, isLoading } = useDoc(landingRef);

  const { scrollY } = useScroll();

  // مصفوفة التحويل القوسي: نستخدم زنبرك (Spring) لإضافة فيزياء حقيقية وارتداد
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 20 });

  // تحويل Y: يبدأ من 50% وينتهي عند الزاوية
  const logoY = useTransform(smoothScrollY, [0, 300], ["50%", isMobile ? "40px" : "60px"]);
  
  // تحويل X: يبدأ من 50% وينتهي عند الزاوية
  // لخلق مسار قوسي، نقوم بتغيير توقيت X عن Y قليلاً
  const logoX = useTransform(smoothScrollY, [0, 350], ["50%", isMobile ? "20px" : "60px"]);
  
  const logoTranslateX = useTransform(smoothScrollY, [0, 300], ["-50%", "0%"]);
  const logoTranslateY = useTransform(smoothScrollY, [0, 300], ["-50%", "0%"]);

  // تصغير الحجم بفيزياء مرنة
  const logoScale = useTransform(smoothScrollY, [0, 300], [isMobile ? 0.7 : 1, isMobile ? 0.35 : 0.45]);
  
  // شفافية الثقب الرقمي (يختفي عند التمرير)
  const portalOpacity = useTransform(smoothScrollY, [0, 200], [1, 0]);
  const introOpacity = useTransform(smoothScrollY, [0, 100], [1, 0]);
  
  // ظهور محتوى الهيرو
  const heroOpacity = useTransform(smoothScrollY, [150, 400], [0, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-[200vh] bg-black overflow-x-hidden font-body selection:bg-[#f9a885]/30">
      {/* 1. Global Nebula Layer */}
      <div className="fixed inset-0 nebula-bg z-0 pointer-events-none" />

      {/* 2. Magnetic Orbit Identity & Portal Cluster */}
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
        <SovereignIntro portalOpacity={portalOpacity} />
      </motion.div>

      {/* 3. Scroll Indicator */}
      <motion.div 
        style={{ opacity: introOpacity }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
      >
        <div className="w-[22px] h-[36px] rounded-full border-2 border-white/10 flex justify-center p-1.5 shadow-inner">
           <motion.div 
             animate={{ y: [0, 12, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="w-1 h-1 bg-[#f9a885] rounded-full shadow-[0_0_8px_#f9a885]" 
           />
        </div>
        <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.4em] mr-[-0.4em]">Scroll</span>
      </motion.div>

      {/* 4. Main Hero Section */}
      <motion.div 
        style={{ opacity: heroOpacity }}
        className="relative z-10 pt-[40vh] min-h-screen"
      >
        <SovereignHero 
          title={landingData?.welcomeTitle || "ناميكس: السيادة الرقمية للثروة"}
          description={landingData?.welcomeDescription || "نظام استثماري متطور يجمع بين الذكاء الاصطناعي وحماية الأصول المطلقة."}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Brand Footer Signature */}
      <div className="fixed bottom-6 right-8 opacity-5 z-[100] pointer-events-none hidden md:block">
         <p className="text-[8px] font-black uppercase tracking-[1em] text-white">Namix Universal Network</p>
      </div>
    </div>
  );
}
