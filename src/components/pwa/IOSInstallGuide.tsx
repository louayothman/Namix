
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Share, PlusSquare, Smartphone, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

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
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <Logo size="sm" hideText />
             </div>
             <div className="text-right">
                <p className="text-base font-black">أضف ناميكس لشاشتك</p>
                <p className="text-[7px] text-blue-200/40 font-bold uppercase tracking-widest">Apple Device Guide</p>
             </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[12px] font-bold text-blue-100/70 leading-loose text-right">
              اضغط على زر المشاركة <Share size={16} className="inline-block mx-1 text-[#f9a885]" /> في الأسفل، ثم اختر <span className="text-white font-black">"إضافة إلى الشاشة الرئيسية"</span> <PlusSquare size={16} className="inline-block mx-1 text-[#f9a885]" /> من القائمة.
            </p>
            
            <div className="pt-2 flex justify-center opacity-30 border-t border-white/10 mt-4">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-[8px] font-black mr-1.5 uppercase tracking-widest">نظام تثبيت آمن</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
