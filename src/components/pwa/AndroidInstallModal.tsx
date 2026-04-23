
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Download, ShieldCheck, Sparkles, ChevronLeft, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

interface AndroidInstallModalProps {
  onClose: () => void;
  onInstall: () => void;
}

export function AndroidInstallModal({ onClose, onInstall }: AndroidInstallModalProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
      <motion.div 
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: 100, opacity: 0 }} 
        className="w-full max-w-[420px] bg-white rounded-[44px] shadow-2xl border border-gray-100 p-10 relative overflow-hidden" 
        dir="rtl"
      >
        <button onClick={onClose} className="absolute left-8 top-8 text-gray-300 hover:text-red-500 transition-colors">
          <X size={20} />
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-5">
             <div className="h-16 w-16 rounded-[22px] bg-[#002d4d] flex items-center justify-center shadow-xl">
                <Logo size="sm" lightText hideText />
             </div>
             <div className="text-right">
                <h3 className="text-xl font-black text-[#002d4d]">تثبيت تطبيق ناميكس</h3>
                <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-widest mt-1">
                  <Sparkles size={10} />
                  Android Access System
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <p className="text-[13px] font-bold text-gray-500 leading-[2.2] text-right">
               ثبّت التطبيق الآن للحصول على وصول فوري ومؤمن لأصولك، واستقبال إشارات تداول ذكية مباشرة على شاشة القفل.
             </p>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-1.5 shadow-inner">
                   <Zap size={14} className="text-orange-400" />
                   <span className="text-[9px] font-black text-[#002d4d]">سرعة فائقة</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-1.5 shadow-inner">
                   <Activity size={14} className="text-blue-500" />
                   <span className="text-[9px] font-black text-[#002d4d]">تنبيهات حية</span>
                </div>
             </div>
          </div>

          <div className="pt-2">
             <Button onClick={onInstall} className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group">
                <span>تثبيت التطبيق الآن</span>
                <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
             </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
