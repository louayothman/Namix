
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { ShieldCheck, Cpu, Database } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview شاشة الترحيب التقنية v18.0 - Blockchain Matrix Loading
 * تم تصميم مُفاعل تحميل مستطيل يحيط بالهوية مع جزيئات بيانات تحاكي البلوكشين.
 */

export function PWASplash() {
  const [isVisible, setIsVisible] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

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
        
        // محرك التقدم الرقمي
        const timer = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(timer);
              return 100;
            }
            return prev + 1;
          });
        }, 30);

        const closeTimer = setTimeout(() => setIsVisible(false), 5500);
        return () => {
          clearInterval(timer);
          clearTimeout(closeTimer);
        };
      }
    }
  }, []);

  const cinematicEase = [0.19, 1, 0.22, 1];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(30px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[3000] bg-white flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none"
        >
          {/* 1. النواة المركزية - الشعار */}
          <div className="relative flex flex-col items-center justify-center">
             
             {/* ومضة التبلور */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 2, ease: cinematicEase }}
               className="relative z-20"
               dir="ltr"
             >
                <Logo size="md" hideText={false} animate={true} className="scale-125" />
             </motion.div>

             {/* 2. مُفاعل التحميل المستطيل (Technical Frame) */}
             <div className="absolute inset-[-40px] md:inset-[-60px] z-10">
                <svg width="100%" height="100%" viewBox="0 0 300 180" fill="none" className="overflow-visible">
                   {/* الزوايا التقنية (Corner Brackets) */}
                   <path d="M 20 40 L 20 20 L 40 20" stroke="#002d4d" strokeWidth="1" opacity="0.2" />
                   <path d="M 260 40 L 260 20 L 280 20" stroke="#002d4d" strokeWidth="1" opacity="0.2" />
                   <path d="M 20 140 L 20 160 L 40 160" stroke="#002d4d" strokeWidth="1" opacity="0.2" />
                   <path d="M 260 140 L 260 160 L 280 160" stroke="#002d4d" strokeWidth="1" opacity="0.2" />

                   {/* إطار المسار الخافت */}
                   <rect x="25" y="25" width="250" height="130" rx="20" stroke="#002d4d" strokeWidth="0.5" opacity="0.05" />

                   {/* شعاع المسح (Scanline) */}
                   <motion.line
                     x1="30" x2="270"
                     y1="30" y2="30"
                     stroke="#f9a885"
                     strokeWidth="0.5"
                     animate={{ y1: [30, 150, 30], y2: [30, 150, 30], opacity: [0, 0.4, 0] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   />

                   {/* جزيئات التحميل (Blockchain Data Blocks) */}
                   <g>
                      {Array.from({ length: 12 }).map((_, i) => {
                        const isFilled = (progress / 100) * 12 > i;
                        return (
                          <motion.rect
                            key={i}
                            x={40 + i * 19}
                            y="145"
                            width="14"
                            height="3"
                            rx="1.5"
                            initial={{ opacity: 0.05, fill: "#002d4d" }}
                            animate={isFilled ? { opacity: 1, fill: "#f9a885", scaleY: [1, 1.5, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          />
                        );
                      })}
                   </g>
                </svg>
             </div>

             {/* بيانات الحالة نانوية */}
             <div className="absolute -bottom-24 w-full flex items-center justify-center gap-6 opacity-30">
                <div className="flex items-center gap-1.5">
                   <Cpu size={8} />
                   <span className="text-[7px] font-black uppercase tracking-widest">Core Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Database size={8} />
                   <span className="text-[7px] font-black uppercase tracking-widest">Blocks Synced</span>
                </div>
             </div>
          </div>

          {/* ظهور اسم المستثمر */}
          <div className="absolute bottom-32">
             <AnimatePresence>
                {userName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 1, ease: cinematicEase }}
                    className="text-center"
                  >
                     <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-2">Authenticated Session</p>
                     <h4 className="text-lg font-black text-[#002d4d] tracking-tight">{userName}</h4>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* التوقيع السيادي */}
          <div className="absolute bottom-12 flex flex-col items-center gap-2">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.2 }}
               transition={{ delay: 3, duration: 2 }}
               className="flex items-center gap-6"
             >
                <div className="h-[0.5px] w-6 bg-[#002d4d]" />
                <p className="text-[8px] font-black uppercase text-[#002d4d] tracking-[1.2em] mr-[-1.2em]">NAMIX</p>
                <div className="h-[0.5px] w-6 bg-[#002d4d]" />
             </motion.div>
             <p className="text-[6px] font-bold text-gray-400 uppercase tracking-widest opacity-20">Sovereign Protocol v18.0.0</p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
