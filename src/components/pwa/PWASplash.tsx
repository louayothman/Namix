
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview شاشة الترحيب المينيماليست الفاخرة v6.0 - Luxury Identity Pulse
 * تصميم نقي يعتمد على اسم المنصة والأيقونة النابضة مع خلفية متحركة انسيابية.
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
            className="absolute inset-[-10%] bg-[radial-gradient(circle_at_center,#002d4d_0%,transparent 60%)] opacity-[0.04]"
          />
          
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [30, -30, 30],
              y: [30, -30, 30]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-[-10%] bg-[radial-gradient(circle_at_bottom_left,#f9a885_0%,transparent 50%)] opacity-[0.02]"
          />

          {/* 2. كتلة الهوية المركزية (Identity Core) */}
          <div className="relative flex items-center gap-5" dir="ltr">
            
            {/* الأيقونة النابضة (جهة اليسار في LTR) */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: 1
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 1, delay: 0.2 }
              }}
              className="relative flex items-center justify-center shrink-0"
            >
              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_BLUE }} />
                <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_ORANGE }} />
                <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_ORANGE }} />
                <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: NAMIX_BLUE }} />
              </div>
              
              {/* هالة النبض الخفيفة */}
              <motion.div 
                animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 bg-blue-400 rounded-full blur-lg -z-10"
              />
            </motion.div>

            {/* اسم المنصة (Typography) */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1.5, ease: luxuryEase }}
            >
               <h2 className="text-3xl md:text-4xl font-black text-[#002d4d] tracking-[0.2em] uppercase">
                 NAMIX
               </h2>
            </motion.div>

          </div>

          {/* 3. بصمة النقاء السفلية */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 2, duration: 1.5 }}
            className="absolute bottom-16 flex flex-col items-center gap-3"
          >
             <div className="h-px w-8 bg-[#002d4d] rounded-full" />
             <p className="text-[7px] font-black uppercase tracking-[0.8em] text-[#002d4d] mr-[-0.8em]">
               SECURED GATEWAY
             </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
