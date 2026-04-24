
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview شاشة الترحيب الفيزيائية v4.1 - Kinetic Formation Edition
 * تم إزالة جزء الاختفاء (السقوط في الشق) والتركيز على تشكيل الشعار وبقائه بنقاء عالٍ.
 */

const NAMIX_BLUE = "#002d4d";
const NAMIX_ORANGE = "#f9a885";

export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // تظهر فقط عند فتح التطبيق المثبت (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      const sessionKey = 'namix_splash_static_shown';
      const hasShown = sessionStorage.getItem(sessionKey);
      
      if (!hasShown) {
        setIsVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
        // مدة العرض 6.5 ثانية تكفي للتشكيل والوميض الترحيبي
        const timer = setTimeout(() => setIsVisible(false), 6500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // ثوابت الحركة الفيزيائية
  const fluidEase = [0.16, 1, 0.3, 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* Atmosphere Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,245,249,0.8)_0%,transparent_70%)]"
          />

          <div className="relative h-64 w-64 flex flex-col items-center justify-center">
            
            <div className="relative h-24 w-24 flex items-center justify-center">
              {/* 1. النقطة الأولى: زرقاء (أعلى يمين المصفوفة النهائية) */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: [0, 1, 1],
                  x: [0, 0, 16, 16], 
                  y: [0, 0, 0, -16], 
                }}
                transition={{ 
                  duration: 5, 
                  times: [0, 0.1, 0.3, 0.6], 
                  ease: fluidEase 
                }}
                className="absolute h-5 w-5 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_BLUE }}
              />

              {/* 2. النقطة الثانية: برتقالية (أعلى يسار المصفوفة النهائية) */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 0, 1.2, 1],
                  opacity: [0, 0, 1, 1],
                  x: [0, 0, 0, -16], 
                  y: [0, 0, 0, -16], 
                }}
                transition={{ 
                  duration: 5, 
                  times: [0, 0.3, 0.4, 0.6], 
                  ease: fluidEase 
                }}
                className="absolute h-5 w-5 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_ORANGE }}
              />

              {/* 3. النقطة الثالثة: برتقالية (أسفل يمين المصفوفة النهائية) */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 0, 0, 0, 1.2, 1],
                  opacity: [0, 0, 0, 0, 1, 1],
                  x: [0, 0, 0, 0, 0, 16], 
                  y: [0, 0, 0, 0, 16, 16], 
                }}
                transition={{ 
                  duration: 5.5, 
                  times: [0, 0.6, 0.7, 0.7, 0.8, 0.9], 
                  ease: fluidEase 
                }}
                className="absolute h-5 w-5 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_ORANGE }}
              />

              {/* 4. النقطة الرابعة: زرقاء (أسفل يسار المصفوفة النهائية) */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: -16, y: 16 }}
                animate={{ 
                  scale: [0, 0, 0, 0, 0, 1.2, 1],
                  opacity: [0, 0, 0, 0, 0, 1, 1],
                }}
                transition={{ 
                  duration: 6, 
                  times: [0, 0.7, 0.8, 0.8, 0.8, 0.9, 1], 
                  ease: fluidEase 
                }}
                className="absolute h-5 w-5 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_BLUE }}
              />

              {/* ومضة تشكيل الهوية - تظهر عند اكتمال الأربعة */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 0, 2.5, 0], 
                  opacity: [0, 0, 0.4, 0] 
                }}
                transition={{ 
                  duration: 6, 
                  times: [0, 0.85, 0.92, 1], 
                  ease: "easeOut" 
                }}
                className="absolute inset-[-60px] bg-blue-50 rounded-full blur-2xl"
              />
            </div>

            {/* اسم المنصة أسفل الأيقونة */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0, 0, 0, 1],
                y: [10, 10, 10, 0]
              }}
              transition={{ duration: 4, times: [0, 0.2, 0.3, 1], ease: fluidEase }}
              className="mt-16 flex flex-col items-center gap-3"
            >
               <h2 className="text-2xl font-black text-[#002d4d] tracking-[0.6em] ml-[0.6em] uppercase">NAMIX</h2>
               <div className="h-[0.5px] w-12 bg-gray-100 rounded-full" />
            </motion.div>
          </div>

          {/* Sovereign Bottom Mark */}
          <div className="absolute bottom-16 flex flex-col items-center gap-4 opacity-5">
             <p className="text-[7px] font-black uppercase tracking-[1em] text-[#002d4d] mr-[-1em]">AUTHENTIC ACCESS</p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
