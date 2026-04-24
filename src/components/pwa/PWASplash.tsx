
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شاشة الترحيب النخبوية v13.0 - Perfect Fill Edition
 * تم ضبط الشعار ليملأ المساحة داخل إطار التحميل المستطيل بدقة هندسية ومحاذاة احترافية.
 */

const NAMIX_BLUE = "#002d4d";
const NAMIX_ORANGE = "#f9a885";

export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // تظهر فقط في وضع التطبيق المثبت (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      const session = localStorage.getItem("namix_user");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          setUserName(parsed.displayName);
        } catch (e) {}
      }

      const sessionKey = 'namix_luxury_splash_shown';
      const hasShown = sessionStorage.getItem(sessionKey);
      
      if (!hasShown) {
        setIsVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
        const timer = setTimeout(() => setIsVisible(false), 5500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const luxuryEase = [0.16, 1, 0.3, 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* 1. المحرك الضوئي العائم (Ambient Canvas) */}
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.02, 0.05, 0.02],
              x: [-15, 15, -15]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10%] bg-[radial-gradient(circle_at_center,#002d4d_0%,transparent 60%)]"
          />

          {/* 2. كتلة الهوية المركزية مع مؤشر التحميل المستطيل */}
          <div className="relative flex items-center justify-center p-12">
             
             {/* مستطيل التحميل المداري (Orbital Rect) - أبعاد متوافقة مع المحتوى */}
             <svg width="240" height="90" viewBox="0 0 240 90" className="absolute">
                {/* الإطار الخافت الثابت */}
                <rect 
                  x="2" y="2" width="236" height="86" rx="30" 
                  fill="none" 
                  stroke={NAMIX_BLUE} 
                  strokeWidth="0.5" 
                  className="opacity-5"
                />
                {/* النبضة الضوئية الدوارة */}
                <motion.rect 
                  x="2" y="2" width="236" height="86" rx="30" 
                  fill="none" 
                  stroke={NAMIX_ORANGE} 
                  strokeWidth="2"
                  strokeDasharray="80 570"
                  animate={{ strokeDashoffset: [650, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="opacity-50"
                />
             </svg>

             {/* الهوية (Logo + Name) - تم تكبيرها لتملأ المساحة داخل المستطيل */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: [0.7, 1, 0.7] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10 flex items-center justify-center h-[90px] w-[240px] px-8" 
               dir="ltr"
             >
                <Logo size="md" hideText={false} animate={false} className="mb-0" />
             </motion.div>
          </div>

          {/* 3. منطقة الترحيب الشخصي (Bottom Info) */}
          <div className="absolute bottom-24 flex flex-col items-center gap-4 text-center">
             <AnimatePresence>
                {userName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: luxuryEase }}
                    className="space-y-1"
                  >
                     <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">مرحباً بك مجدداً</p>
                     <h4 className="text-sm font-black text-[#002d4d] tracking-tight">{userName}</h4>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* 4. التوقيع المؤسساتي (Nexus ID) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
          >
             <p className="text-[7px] font-black uppercase tracking-[0.8em] text-[#002d4d] mr-[-0.8em]">
               NAMIX NEXUS V10.16
             </p>
             <div className="h-[0.5px] w-4 bg-[#002d4d] rounded-full" />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
