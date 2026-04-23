
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

/**
 * @fileOverview شاشة الترحيب السينمائية v1.0 - Cinematic Splash Node
 * تظهر عند فتح التطبيق المثبت فقط لإعطاء طابع التطبيقات الأصلية.
 */
export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // تظهر فقط في وضع Standalone (التطبيق المثبت)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    if (isStandalone) {
      // إظهار الشاشة فقط عند الفتح الأول للجلسة
      const sessionKey = 'namix_splash_shown';
      const hasShown = sessionStorage.getItem(sessionKey);
      
      if (!hasShown) {
        setIsVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
        const timer = setTimeout(() => setIsVisible(false), 3000);
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
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Background Ambient Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,#f1f5f9_0%,transparent_70%)]"
          />

          <div className="relative flex flex-col items-center gap-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Logo size="lg" animate={true} />
            </motion.div>

            <div className="flex flex-col items-center gap-4">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: 140 }}
                 transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                 className="h-[1.5px] bg-[#002d4d] rounded-full overflow-hidden"
               >
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-full bg-gradient-to-r from-transparent via-[#f9a885] to-transparent"
                  />
               </motion.div>
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 0.3 }}
                 transition={{ delay: 1, duration: 1 }}
                 className="text-[9px] font-black uppercase tracking-[0.6em] text-[#002d4d] ml-[0.6em]"
               >
                 جاري المزامنة
               </motion.p>
            </div>
          </div>

          <div className="absolute bottom-12 text-center opacity-10">
             <p className="text-[7px] font-black uppercase tracking-widest">Namix Financial Infrastructure v1.0</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
