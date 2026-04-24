
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview شاشة الترحيب السينمائية المحدثة v2.0 - Identity Convergence Edition
 * تم حذف كافة النصوص وخطوط التحميل والاعتماد على تجربة بصرية سينمائية نقية.
 */
export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // تظهر فقط عند فتح التطبيق المثبت (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      const sessionKey = 'namix_splash_shown';
      const hasShown = sessionStorage.getItem(sessionKey);
      
      if (!hasShown) {
        setIsVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
        const timer = setTimeout(() => setIsVisible(false), 4500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* Atmosphere Glow - هالات بصرية سينمائية */}
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
              rotate: [0, 45, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,245,249,0.5)_0%,transparent_70%)]"
          />

          <div className="relative flex items-center justify-center">
            
            {/* المركز الضوئي - Core Reactor */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.1, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
               <div className="h-40 w-40 rounded-full bg-[#002d4d]/[0.02] blur-3xl" />
            </motion.div>

            {/* مصفوفة الهوية السينمائية - Convergence Dots */}
            <div className="relative z-10 grid grid-cols-2 gap-4 md:gap-6">
              {[
                { delay: 0, x: -50, y: -50, color: "#002d4d" },
                { delay: 0.2, x: 50, y: -50, color: "#f9a885" },
                { delay: 0.4, x: -50, y: 50, color: "#f9a885" },
                { delay: 0.6, x: 50, y: 50, color: "#002d4d" }
              ].map((dot, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: dot.x, y: dot.y, scale: 0 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{ 
                    delay: dot.delay, 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1],
                    scale: { type: "spring", stiffness: 200, damping: 20 }
                  }}
                  className="h-4 w-4 md:h-6 md:w-6 rounded-full shadow-2xl"
                  style={{ backgroundColor: dot.color }}
                />
              ))}
            </div>

            {/* ومضة الصدمة التكتيكية - Interaction Pulse */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 2], opacity: [0, 0.15, 0] }}
              transition={{ delay: 1.8, duration: 1.5, ease: "easeOut" }}
              className="absolute inset-[-40px] border border-[#002d4d] rounded-full blur-[1px]"
            />
          </div>

          {/* التوقيع الفخم في الأسفل - Sovereign Mark */}
          <div className="absolute bottom-16 flex flex-col items-center gap-5">
             <motion.div 
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: 100, opacity: 0.1 }}
               transition={{ delay: 2, duration: 1.5, ease: "easeInOut" }}
               className="h-[0.5px] bg-[#002d4d] rounded-full"
             />
             <motion.p 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 0.2, y: 0 }}
               transition={{ delay: 2.5, duration: 1 }}
               className="text-[8px] font-black uppercase tracking-[0.8em] text-[#002d4d] mr-[-0.8em]"
             >
               Namix Experience
             </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
