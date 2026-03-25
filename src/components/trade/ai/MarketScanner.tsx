
"use client";

import { motion } from "framer-motion";
import { Radar, Cpu, Activity, ShieldCheck } from "lucide-react";

/**
 * @fileOverview ماسح البيانات الاستخباراتي - NAMIX AI Visualizer
 * يحاكي عمليات المسح الميداني للبيانات عبر حركات دورانية ونبضية.
 */
export function MarketScanner() {
  return (
    <div className="relative h-40 w-full flex items-center justify-center overflow-hidden bg-[#002d4d] rounded-[40px] shadow-2xl">
      {/* شعاع الرادار المطور */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute h-[300%] w-[300%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(249,168,133,0.05)_180deg,rgba(249,168,133,0.2)_360deg)] rounded-full"
      />

      {/* دوائر النبض */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 2, opacity: [0, 0.1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i }}
          className="absolute h-20 w-20 border border-[#f9a885] rounded-full"
        />
      ))}

      {/* الرموز التقنية المركزية */}
      <div className="relative z-10 flex flex-col items-center gap-3">
         <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner">
            <Cpu className="h-8 w-8 text-[#f9a885] animate-pulse" />
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[8px] font-black text-blue-200/60 uppercase tracking-[0.4em]">Data Stream Active</span>
         </div>
      </div>

      {/* قراءات جانبية مشفرة */}
      <div className="absolute top-6 left-8 opacity-20">
         <div className="flex flex-col gap-1">
            {[1, 2, 3].map(i => <div key={i} className="h-0.5 w-8 bg-white rounded-full" />)}
         </div>
      </div>
    </div>
  );
}
