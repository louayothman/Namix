
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

/**
 * @fileOverview شاشة الترحيب السينمائية v16.0 - Energy Pulse & Trading Bars Edition
 * يتضمن الإنترو نبضاً طاقياً يدور حول الشعار مرتين ثم ينزلق ليشكل أعمدة التداول.
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
        const timer = setTimeout(() => setIsVisible(false), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const cinematicEase = [0.19, 1, 0.22, 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* محرك التبلور السينمائي للشعار */}
          <div className="relative flex flex-col items-center justify-center">
             
             {/* ومضة الانفجار الضوئي (Flash Flare) */}
             <motion.div 
               initial={{ opacity: 0, scale: 0 }}
               animate={{ 
                 opacity: [0, 0.6, 0], 
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

             {/* مفاعل الخط الطاقي المداري (Energy Frame) */}
             <div className="absolute inset-[-30px] md:inset-[-40px] z-20 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" className="overflow-visible">
                   {/* مسار الإطار المستطيل مستدير الزوايا */}
                   <rect 
                     x="10" y="10" width="180" height="100" rx="40" 
                     className="stroke-gray-50/50" strokeWidth="0.5" 
                   />
                   
                   {/* الخط الطاقي المتحرك */}
                   <motion.rect
                     x="10" y="10" width="180" height="100" rx="40"
                     stroke="#f9a885"
                     strokeWidth="1.5"
                     strokeLinecap="round"
                     initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                     animate={{ 
                       pathLength: [0, 0.3, 0.3],
                       pathOffset: [0, 1, 2],
                       opacity: [0, 1, 1, 0],
                       y: [0, 0, 80] // ينزل للأسفل بعد دورتين
                     }}
                     transition={{ 
                       duration: 4, 
                       times: [0, 0.2, 0.8, 1],
                       ease: "easeInOut",
                       delay: 0.8
                     }}
                   />
                </svg>
             </div>

             {/* أعمدة التداول (تظهر بعد نزول الخط الطاقي) */}
             <div className="absolute -bottom-16 flex items-end gap-1.5 h-10">
                {[
                  { delay: 4.2, height: 12, color: "bg-emerald-400" },
                  { delay: 4.3, height: 24, color: "bg-emerald-500" },
                  { delay: 4.4, height: 16, color: "bg-emerald-400" }
                ].map((bar, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: bar.height, opacity: 0.4 }}
                    transition={{ delay: bar.delay, duration: 0.8, ease: cinematicEase }}
                    className={cn("w-1 rounded-full", bar.color)}
                  />
                ))}
             </div>
          </div>

          {/* ظهور بيانات المستثمر */}
          <div className="absolute bottom-32 flex flex-col items-center gap-4 text-center">
             <AnimatePresence>
                {userName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 3, duration: 1.5, ease: cinematicEase }}
                    className="space-y-1"
                  >
                     <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.5em] mb-2">Authenticated Session</p>
                     <h4 className="text-lg font-black text-[#002d4d] tracking-tight">{userName}</h4>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* التوقيع الرقمي السيادي */}
          <div className="absolute bottom-12 flex flex-col items-center gap-2">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.2 }}
               transition={{ delay: 3.5, duration: 2 }}
               className="flex items-center gap-6"
             >
                <div className="h-[0.5px] w-6 bg-[#002d4d]" />
                <motion.p 
                  initial={{ letterSpacing: "0.2em" }}
                  animate={{ letterSpacing: "1.2em" }}
                  transition={{ delay: 3.5, duration: 4, ease: "linear" }}
                  className="text-[8px] font-black uppercase text-[#002d4d] mr-[-1.2em]"
                >
                  NAMIX
                </motion.p>
                <div className="h-[0.5px] w-6 bg-[#002d4d]" />
             </motion.div>
             <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.1 }}
               transition={{ delay: 4.5, duration: 1 }}
               className="text-[6px] font-bold text-gray-400 uppercase tracking-widest"
             >
               Sovereign Node v16.0.0
             </motion.p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { cn } from "@/lib/utils";
