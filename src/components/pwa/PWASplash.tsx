
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview شاشة الترحيب المينيماليست الفاخرة v5.0 - Luxury Identity Bloom
 * تصميم نقي يعتمد على المساحات البيضاء، التوازن البصري، وحركات الظهور الهادئة.
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
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* Subtle Ambient Aura */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#002d4d_0%,transparent 70%)]"
          />

          <div className="relative flex flex-col items-center gap-12">
            
            {/* The Logo Bloom - 2x2 Grid Formation */}
            <div className="relative h-12 w-12 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { color: NAMIX_BLUE, delay: 0.1 },
                  { color: NAMIX_ORANGE, delay: 0.2 },
                  { color: NAMIX_ORANGE, delay: 0.3 },
                  { color: NAMIX_BLUE, delay: 0.4 }
                ].map((dot, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: dot.delay, 
                      duration: 1.2, 
                      ease: luxuryEase 
                    }}
                    className="h-4 w-4 rounded-full shadow-sm"
                    style={{ backgroundColor: dot.color }}
                  />
                ))}
              </div>
              
              {/* Central Identity Pulse */}
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 1.5], opacity: [0, 0.1, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
              />
            </div>

            {/* Typography Reveal - Wide Tracking to Tight */}
            <motion.div
              initial={{ opacity: 0, y: 10, letterSpacing: "1em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.6em" }}
              transition={{ 
                delay: 0.6, 
                duration: 2, 
                ease: luxuryEase 
              }}
              className="flex flex-col items-center gap-4"
            >
               <h2 className="text-2xl font-black text-[#002d4d] ml-[0.6em] uppercase select-none">
                 NAMIX
               </h2>
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "40px" }}
                 transition={{ delay: 1.2, duration: 1.5 }}
                 className="h-[0.5px] bg-gray-100 rounded-full" 
               />
            </motion.div>
          </div>

          {/* Bottom Branding Mark */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1.8, duration: 1.5 }}
            className="absolute bottom-16 flex flex-col items-center gap-2"
          >
             <p className="text-[7px] font-black uppercase tracking-[0.8em] text-[#002d4d] mr-[-0.8em]">
               AUTHENTIC ACCESS
             </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
