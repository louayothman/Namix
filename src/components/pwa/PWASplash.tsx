
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview شاشة الترحيب المينيماليست الفاخرة v7.0 - Ghost Pulse Identity
 * تصميم نقي يركز على الهوية المركزية مع نبض شفافية وتوقيع تقني سفلي.
 */

const NAMIX_BLUE = "#002d4d";
const NAMIX_ORANGE = "#f9a885";

export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // تظهر فقط في وضع التطبيق المثبت (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      const sessionKey = 'namix_luxury_splash_shown';
      const hasShown = sessionStorage.getItem(sessionKey);
      
      if (!hasShown) {
        setIsVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
        // مدة العرض 5 ثوانٍ تعطي شعوراً بالفخامة والهدوء
        const timer = setTimeout(() => setIsVisible(false), 5000);
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
          {/* 1. المحرك الضوئي المتحرك (Ambient Moving Background) */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [-20, 20, -20],
              y: [-20, 20, -20]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-[-10%] bg-[radial-gradient(circle_at_center,#002d4d_0%,transparent 60%)] opacity-[0.03]"
          />

          {/* 2. كتلة الهوية المركزية (Identity Core) - Ghost Pulse Animation */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              opacity: [0.4, 1, 0.4],
              scale: 1
            }}
            transition={{ 
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 1.5, ease: luxuryEase }
            }}
            className="relative flex items-center gap-3" 
            dir="ltr"
          >
            {/* الأيقونة النانوية (جهة اليسار في LTR) */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className="grid grid-cols-2 gap-1">
                <div className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_BLUE }} />
                <div className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_ORANGE }} />
                <div className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_ORANGE }} />
                <div className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_BLUE }} />
              </div>
            </div>

            {/* اسم المنصة (Minimalist Typography) */}
            <h2 className="text-xl md:text-2xl font-black text-[#002d4d] tracking-[0.15em] uppercase leading-none">
              NAMIX
            </h2>
          </motion.div>

          {/* 3. التوقيع التقني المجهري (Nexus Signature) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute bottom-12 flex flex-col items-center gap-2"
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
