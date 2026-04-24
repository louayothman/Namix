
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

/**
 * @fileOverview شاشة الترحيب السينمائية v15.0 - Cinematic Intro Edition
 * تم إزالة كافة الحركات المورفية والفقاعات لصالح إنترو سينمائي مركز يعتمد على التبلور والوميض الضوئي.
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

  const cinematicEase = [0.19, 1, 0.22, 1]; // Power4 Out ease

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* خلفية بيضاء ناصعة صافية كلياً */}
          <div className="absolute inset-0 bg-white" />

          {/* محرك التبلور السينمائي للشعار */}
          <div className="relative flex items-center justify-center">
             
             {/* ومضة الانفجار الضوئي (Flash Flare) */}
             <motion.div 
               initial={{ opacity: 0, scale: 0 }}
               animate={{ 
                 opacity: [0, 0.8, 0], 
                 scale: [0, 2.5, 3] 
               }}
               transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
               className="absolute inset-[-100px] bg-gradient-to-r from-transparent via-blue-50 to-transparent rounded-full blur-[80px] z-0"
             />

             {/* الشعار المركزي */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, filter: "blur(30px)" }}
               animate={{ 
                 opacity: 1, 
                 scale: 1, 
                 filter: "blur(0px)" 
               }}
               transition={{ duration: 2.5, delay: 0.2, ease: cinematicEase }}
               className="relative z-10"
               dir="ltr"
             >
                <Logo size="md" hideText={false} animate={true} className="scale-125" />
             </motion.div>

             {/* خط النور الأفقي السينمائي */}
             <motion.div 
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: "240px", opacity: 0.05 }}
               transition={{ delay: 1, duration: 2, ease: cinematicEase }}
               className="absolute -bottom-12 h-[0.5px] bg-[#002d4d] rounded-full"
             />
          </div>

          {/* ظهور بيانات المستثمر بأسلوب هادئ */}
          <div className="absolute bottom-32 flex flex-col items-center gap-4 text-center">
             <AnimatePresence>
                {userName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 2.5, duration: 1.5, ease: cinematicEase }}
                    className="space-y-1"
                  >
                     <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.5em] mb-2">Authenticated Session</p>
                     <h4 className="text-lg font-black text-[#002d4d] tracking-tight">{userName}</h4>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* التوقيع الرقمي السيادي بأسلوب التباعد السينمائي (Tracking) */}
          <div className="absolute bottom-12 flex flex-col items-center gap-2">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.2 }}
               transition={{ delay: 3, duration: 2 }}
               className="flex items-center gap-6"
             >
                <div className="h-[0.5px] w-6 bg-[#002d4d]" />
                <motion.p 
                  initial={{ letterSpacing: "0.2em" }}
                  animate={{ letterSpacing: "1.2em" }}
                  transition={{ delay: 3, duration: 4, ease: "linear" }}
                  className="text-[8px] font-black uppercase text-[#002d4d] mr-[-1.2em]"
                >
                  NAMIX
                </motion.p>
                <div className="h-[0.5px] w-6 bg-[#002d4d]" />
             </motion.div>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.1 }}
               transition={{ delay: 4, duration: 1 }}
               className="text-[6px] font-bold text-gray-400 uppercase tracking-widest"
             >
               Sovereign Node v15.0.2
             </motion.p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
