
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * @fileOverview بروتوكول معايرة التشغيل v6.0 - Sovereign Pulse Capsule
 * تصميم كبسولة مدمجة تمتلئ بلون التقدم الرمادي الأزرق مع عداد وكلاء نانوي.
 */
export function MarketScanner() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const agentNames = [
    "Agent_Alpha: SYNCING",
    "Agent_Beta: CALIBRATING",
    "Agent_Gamma: ANALYZING",
    "Agent_Delta: READY",
    "Node_Secure: VERIFIED"
  ];

  useEffect(() => {
    // محرك تقليب أسماء الوكلاء
    const agentTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % agentNames.length);
    }, 700);

    // محرك ملء الكبسولة (يتوافق مع الـ 3.5 ثواني في الحاوية الرئيسية)
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1;
      });
    }, 35); 

    return () => {
      clearInterval(agentTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="w-full py-10 flex items-center justify-center font-body select-none">
      
      {/* كبسولة النبض السيادية */}
      <div className="relative h-11 w-full max-w-[280px] bg-gray-50 rounded-full border border-gray-100 shadow-inner overflow-hidden flex items-center px-5">
        
        {/* شريط التقدم الخلفي (الرمادي الأزرق) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
          className="absolute inset-y-0 left-0 bg-[#8899AA] opacity-10"
        />

        {/* سطر النصوص الموحد */}
        <div className="relative z-10 w-full flex items-center gap-3" dir="ltr">
          
          {/* الجانب الأيسر: الهوية الثابتة */}
          <h2 className="text-[11px] font-black text-[#f9a885] tracking-tighter uppercase whitespace-nowrap">
            NAMIX AI
          </h2>
          
          <div className="h-3 w-px bg-gray-200 shrink-0 opacity-50" />

          {/* الجانب الأيمن: عداد الوكلاء المتغير (Odometer Style) */}
          <div className="h-4 overflow-hidden relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-start"
              >
                <span className="text-[7px] font-black text-[#002d4d] uppercase tracking-widest opacity-40 whitespace-nowrap">
                  {agentNames[index]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* نسبة مئوية نانوية أقصى اليمين */}
          <div className="shrink-0">
             <span className="text-[8px] font-black text-[#002d4d] opacity-20 tabular-nums">
               %{progress}
             </span>
          </div>
        </div>

        {/* ومضة التقدم الأمامية */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none"
        />
      </div>

    </div>
  );
}
