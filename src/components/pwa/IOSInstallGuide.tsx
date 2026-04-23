
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Share, PlusSquare, ShieldCheck, Zap, Activity, Target } from "lucide-react";
import Image from "next/image";

interface IOSInstallGuideProps {
  onClose: () => void;
}

export function IOSInstallGuide({ onClose }: IOSInstallGuideProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] w-[92vw] max-w-[380px]" dir="rtl">
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: 20, opacity: 0 }} 
        className="bg-[#002d4d] text-white p-8 rounded-[40px] shadow-2xl relative border border-white/5"
      >
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#002d4d]" />
        <button onClick={onClose} className="absolute left-6 top-6 opacity-30 hover:opacity-100 transition-opacity">
          <X size={18} />
        </button>
        
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 flex items-center justify-center transition-transform">
                <Image 
                  src="/icon-192.png" 
                  alt="Namix" 
                  width={48} 
                  height={48} 
                  className="object-contain"
                  data-ai-hint="app icon"
                />
             </div>
             <div className="text-right">
                <p className="text-base font-black">تثبيت تطبيق ناميكس</p>
                <p className="text-[7px] text-blue-200/40 font-bold uppercase tracking-widest">Apple Device Guide</p>
             </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid gap-3">
               <div className="flex items-center gap-3">
                  <Zap size={14} className="text-orange-400" />
                  <span className="text-[10px] font-bold text-blue-100/60">وصول سريع لمركز التداول الفوري.</span>
               </div>
               <div className="flex items-center gap-3">
                  <Activity size={14} className="text-blue-400" />
                  <span className="text-[10px] font-bold text-blue-100/60">إشارات تحليلية مباشرة على جهازك.</span>
               </div>
            </div>

            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 text-right">
               <p className="text-[11px] font-bold text-white/90 leading-loose">
                اضغط على <span className="text-[#f9a885] font-black">زر المشاركة</span> <Share size={14} className="inline-block mx-1" /> في الأسفل، ثم اختر <span className="text-[#f9a885] font-black">"إضافة إلى الشاشة الرئيسية"</span> <PlusSquare size={14} className="inline-block mx-1" />.
               </p>
            </div>
            
            <div className="pt-2 flex justify-center opacity-30 border-t border-white/10">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-[8px] font-black mr-1.5 uppercase tracking-widest">نظام تثبيت آمن</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
