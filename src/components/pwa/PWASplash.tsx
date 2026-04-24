
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

/**
 * @fileOverview شاشة الترحيب المينيماليست v20.0 - Personalized Minimalist Edition
 * تم تبسيط الشاشة تماماً لتركز على الهوية واسم المستخدم بأسلوب سينمائي هادئ ونقي.
 */

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

      const sessionKey = 'namix_minimal_splash_shown';
      const hasShown = sessionStorage.getItem(sessionKey);
      
      if (!hasShown) {
        setIsVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
        
        // توقيت الانتهاء المعتمد
        const closeTimer = setTimeout(() => setIsVisible(false), 4500);
        return () => clearTimeout(closeTimer);
      }
    }
  }, []);

  const smoothEasing = [0.16, 1, 0.3, 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* 1. النواة المركزية - الشعار يتبلور بنعومة */}
          <div className="relative flex flex-col items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
               transition={{ duration: 2, ease: smoothEasing }}
               className="relative z-20"
               dir="ltr"
             >
                <Logo size="md" hideText={false} animate={true} className="scale-110" />
             </motion.div>
          </div>

          {/* 2. ظهور اسم المستثمر بأسلوب هادئ */}
          <div className="absolute bottom-32 w-full px-10 text-center">
             <AnimatePresence>
                {userName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 1.2, ease: smoothEasing }}
                    className="space-y-1"
                  >
                     <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-2">Welcome Back</p>
                     <h4 className="text-xl font-black text-[#002d4d] tracking-tight">{userName}</h4>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* 3. التوقيع النانوي السيادي */}
          <div className="absolute bottom-12 flex flex-col items-center gap-3">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.15 }}
               transition={{ delay: 2.2, duration: 1.5 }}
               className="flex items-center gap-5"
             >
                <div className="h-[0.5px] w-5 bg-[#002d4d]" />
                <div className="grid grid-cols-2 gap-1 scale-[0.6]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                </div>
                <div className="h-[0.5px] w-5 bg-[#002d4d]" />
             </motion.div>
             <p className="text-[6px] font-bold text-gray-300 uppercase tracking-[0.6em] opacity-40">Operational Protocol v20.0</p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
