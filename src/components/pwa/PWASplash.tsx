
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شاشة الترحيب السينمائية v14.0 - Liquid Fusion Edition
 * تم تطوير المحرك ليعطي شعوراً بالسائل المورفي مع ومضات سينمائية وتجاوز تام لصفحة الهبوط.
 */

const NAMIX_BLUE = "#002d4d";
const NAMIX_ORANGE = "#f9a885";

export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
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
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* 1. السائل المورفي (Liquid Ambient Blobs) */}
          <div className="absolute inset-0 z-0">
             <motion.div 
               animate={{ 
                 scale: [1, 1.2, 0.9, 1.1, 1],
                 x: [-20, 20, -10, 30, -20],
                 y: [10, -30, 20, -10, 10],
                 borderRadius: ["40% 60% 70% 30% / 40% 40% 60% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 40% 60% 60%"]
               }}
               transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[80px]"
             />
             <motion.div 
               animate={{ 
                 scale: [1.1, 0.8, 1.2, 0.9, 1.1],
                 x: [30, -20, 40, -10, 30],
                 y: [-20, 10, -10, 30, -20],
                 borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "40% 60% 70% 30% / 40% 40% 60% 60%", "60% 40% 30% 70% / 60% 30% 70% 40%"]
               }}
               transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#f9a885]/10 blur-[100px]"
             />
          </div>

          {/* 2. كتلة الهوية المركزية مع مفاعل التبلور */}
          <div className="relative flex items-center justify-center p-12">
             
             {/* مستطيل التحميل المداري السائل */}
             <svg width="260" height="100" viewBox="0 0 240 90" className="absolute scale-[1.1] md:scale-[1.2]">
                <rect 
                  x="2" y="2" width="236" height="86" rx="30" 
                  fill="none" 
                  stroke={NAMIX_BLUE} 
                  strokeWidth="0.5" 
                  className="opacity-5"
                />
                <motion.rect 
                  x="2" y="2" width="236" height="86" rx="30" 
                  fill="none" 
                  stroke={NAMIX_ORANGE} 
                  strokeWidth="2.5"
                  strokeDasharray="100 550"
                  animate={{ strokeDashoffset: [650, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  className="opacity-40"
                />
             </svg>

             {/* التبلور السينمائي للشعار */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
               animate={{ 
                 opacity: 1, 
                 scale: [0.8, 1.05, 1], 
                 filter: ["blur(20px)", "blur(0px)", "blur(0px)"] 
               }}
               transition={{ duration: 3, ease: luxuryEase }}
               className="relative z-10 flex items-center justify-center h-[90px] w-[240px] px-8" 
               dir="ltr"
             >
                <Logo size="md" hideText={false} animate={true} className="mb-0" />
                
                {/* ومضة الانصهار النهائية */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 0.4, 0], scale: [0, 2.5] }}
                  transition={{ delay: 2.5, duration: 1.5 }}
                  className="absolute inset-0 bg-white rounded-full blur-3xl"
                />
             </motion.div>
          </div>

          {/* 3. الظهور التدريجي لبيانات المستثمر */}
          <div className="absolute bottom-28 flex flex-col items-center gap-4 text-center">
             <AnimatePresence>
                {userName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 1.8, duration: 1.5, ease: luxuryEase }}
                    className="space-y-1"
                  >
                     <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">مرحباً بك مجدداً</p>
                     <h4 className="text-base font-black text-[#002d4d] tracking-tight">{userName}</h4>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* 4. التوقيع الرقمي السيادي */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 3, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center gap-2"
          >
             <div className="flex items-center gap-4">
                <div className="h-[0.5px] w-8 bg-[#002d4d]" />
                <p className="text-[8px] font-black uppercase tracking-[1em] text-[#002d4d] mr-[-1em]">
                  NAMIX NEXUS
                </p>
                <div className="h-[0.5px] w-8 bg-[#002d4d]" />
             </div>
             <p className="text-[6px] font-bold text-gray-400 uppercase tracking-widest">Sovereign Identity Protocol v10.2</p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
