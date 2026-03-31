
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ChevronLeft, Sparkles, Zap } from "lucide-react";
import { SafeInvestmentGuide } from "./SafeInvestmentGuide";

/**
 * @fileOverview زر تفعيل دليل الاستثمار الآمن v1.0
 * مكون معزول يظهر في حال فراغ قائمة الاستثمارات.
 */
export function SafeInvestmentTrigger() {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="px-4 pb-4 font-body" dir="rtl">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setGuideOpen(true)}
        className="w-full p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between relative overflow-hidden active:scale-95"
      >
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:rotate-12 transition-transform duration-1000">
          <ShieldCheck size={80} className="text-[#002d4d]" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-[20px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
            <ShieldCheck size={22} />
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
               <h4 className="text-[13px] font-black text-[#002d4d] tracking-normal">دليل الاستثمار الآمن؟</h4>
               <Sparkles size={10} className="text-[#f9a885] animate-pulse" />
            </div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-normal mt-0.5">Safe Growth Protocol</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="hidden sm:flex flex-col items-end opacity-40">
              <span className="text-[7px] font-black uppercase text-[#002d4d]">Assets Status</span>
              <span className="text-[9px] font-black text-emerald-600">INACTIVE</span>
           </div>
           <div className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
           </div>
        </div>
      </motion.button>

      <SafeInvestmentGuide open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}
