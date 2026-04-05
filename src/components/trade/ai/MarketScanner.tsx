"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

/**
 * @fileOverview بروتوكول معايرة التشغيل v4.0 - Central Odometer Sync
 * يعرض أيقونة الدرع مع حلقة نانوية، وتحتها نص NAMIX AI وعداد الوكلاء في سطر واحد.
 */
export function MarketScanner() {
  const [index, setIndex] = useState(0);
  const agentNames = [
    "Agent_Alpha: SYNCING",
    "Agent_Beta: CALIBRATING",
    "Agent_Gamma: ANALYZING",
    "Agent_Delta: READY",
    "Node_Secure: VERIFIED"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % agentNames.length);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-16 flex flex-col items-center justify-center font-body select-none gap-6">
      
      {/* 1. الحلقة النانوية والدرع المركزي */}
      <div className="relative h-16 w-16 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[1px] border-dashed border-[#f9a885]/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1 rounded-full border-t-[1.5px] border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        />
        <ShieldCheck size={24} className="text-[#002d4d] animate-pulse" />
      </div>

      {/* 2. النص المدمج في سطر واحد */}
      <div className="flex items-center gap-3 bg-gray-50/50 px-6 py-2 rounded-full border border-gray-100 shadow-inner">
        
        {/* الثابت: NAMIX AI (يسار في العرض ولكن يمين في RTL) */}
        <h2 className="text-sm font-black text-[#f9a885] tracking-tighter uppercase whitespace-nowrap">NAMIX AI</h2>
        
        <div className="h-3 w-px bg-gray-200" />

        {/* المتغير: عداد الوكلاء (نانوي) */}
        <div className="h-4 overflow-hidden relative min-w-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center justify-start"
            >
              <span className="text-[8px] font-black text-[#002d4d] uppercase tracking-[0.1em] opacity-40 whitespace-nowrap">
                {agentNames[index]}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
