
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview شاشة الترحيب الفيزيائية المارثونية v4.0 - Clear Kinetic Edition
 * تنفيذ تسلسل حركي معقد بنقاء عالي: ظهور تتابعي، إزاحة متوازنة، انصهار مركزي، وسقوط في شق كوني.
 * تم إزالة تأثيرات الضبابية وإضافة اسم المنصة أسفل الأيقونة.
 */

const NAMIX_BLUE = "#002d4d";
const NAMIX_ORANGE = "#f9a885";

export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // تظهر فقط عند فتح التطبيق المثبت (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      const sessionKey = 'namix_splash_clear_shown';
      const hasShown = sessionStorage.getItem(sessionKey);
      
      if (!hasShown) {
        setIsVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
        // التسلسل السينمائي المعقد (7.5 ثوانٍ)
        const timer = setTimeout(() => setIsVisible(false), 7500);
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
          {/* Atmosphere Glow - Subtle static pulse without blur filters */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,245,249,0.8)_0%,transparent_70%)]"
          />

          <div className="relative h-64 w-64 flex flex-col items-center justify-center">
            
            <div className="relative h-20 w-20 flex items-center justify-center">
              {/* 1. النقطة الأولى: تظهر في المركز ثم تنزاح لليمين */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1, 1, 1, 0],
                  opacity: [0, 1, 1, 1, 1, 0],
                  x: [0, 0, 20, 20, 20, 10], 
                  y: [0, 0, 0, -20, -20, -10], 
                }}
                transition={{ duration: 6, times: [0, 0.1, 0.2, 0.4, 0.8, 1], ease: fluidEase }}
                className="absolute h-4 w-4 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_BLUE }}
              />

              {/* 2. النقطة الثانية: تظهر بعد إزاحة الأولى لليمين ثم تنزاح للأعلى معها */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 0, 1.2, 1, 1, 0],
                  opacity: [0, 0, 1, 1, 1, 0],
                  x: [0, 0, 0, 0, 0, 10], 
                  y: [0, 0, 0, -20, -20, -10], 
                }}
                transition={{ duration: 6, times: [0, 0.2, 0.3, 0.4, 0.8, 1], ease: fluidEase }}
                className="absolute h-4 w-4 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_ORANGE }}
              />

              {/* 3. النقطة الثالثة: تظهر في الأسفل ثم تنزاح لليمين */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 0, 0, 0, 1.2, 1, 1, 0],
                  opacity: [0, 0, 0, 0, 1, 1, 1, 0],
                  x: [0, 0, 0, 0, 0, 20, 20, 10], 
                  y: [0, 0, 0, 0, 0, 0, 0, -10], 
                }}
                transition={{ duration: 6, times: [0, 0.4, 0.5, 0.5, 0.6, 0.7, 0.8, 1], ease: fluidEase }}
                className="absolute h-4 w-4 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_ORANGE }}
              />

              {/* 4. النقطة الرابعة: تظهر بعد إزاحة الثالثة لليمين */}
              <motion.div
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 0, 0, 0, 0, 0, 1.2, 1, 0],
                  opacity: [0, 0, 0, 0, 0, 0, 1, 1, 0],
                  x: [0, 0, 0, 0, 0, 0, 0, 0, 10], 
                  y: [0, 0, 0, 0, 0, 0, 0, 0, -10], 
                }}
                transition={{ duration: 6, times: [0, 0.6, 0.7, 0.7, 0.7, 0.7, 0.8, 0.9, 1], ease: fluidEase }}
                className="absolute h-4 w-4 rounded-full shadow-lg"
                style={{ backgroundColor: NAMIX_BLUE }}
              />

              {/* 5. النقطة المدمجة النهائية: تظهر عند تلاشي الأربعة وتندفع للأسفل */}
              <motion.div
                initial={{ scale: 0, opacity: 0, y: -10, x: 10 }}
                animate={{ 
                  scale: [0, 0, 1.5, 1, 0.8],
                  opacity: [0, 0, 1, 1, 0],
                  y: [-10, -10, -10, -10, 180], 
                }}
                transition={{ duration: 7.5, times: [0, 0.8, 0.85, 0.9, 1], ease: "easeInOut" }}
                className="absolute h-6 w-6 rounded-full bg-gradient-to-br from-[#002d4d] to-[#f9a885] shadow-2xl z-20"
              />

              {/* 6. شق الفضاء (The Slit) */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: [0, 0, 100, 0],
                  opacity: [0, 0, 0.4, 0]
                }}
                transition={{ duration: 7.5, times: [0, 0.88, 0.92, 1], ease: "circOut" }}
                className="absolute top-[170px] left-1/2 -translate-x-1/2 h-[1px] bg-[#002d4d] z-10"
              />
            </div>

            {/* اسم المنصة أسفل الأيقونة */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: [0, 0, 0, 1, 1, 0],
                y: [10, 10, 10, 0, 0, -10]
              }}
              transition={{ duration: 7.5, times: [0, 0.2, 0.3, 0.4, 0.8, 0.9], ease: fluidEase }}
              className="mt-12 flex flex-col items-center gap-2"
            >
               <h2 className="text-xl font-black text-[#002d4d] tracking-[0.6em] ml-[0.6em] uppercase">NAMIX</h2>
               <div className="h-[0.5px] w-8 bg-gray-100 rounded-full" />
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
