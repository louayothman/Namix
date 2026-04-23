
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Layout, Sparkles, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DesktopInstallModalProps {
  onClose: () => void;
  onInstall: () => void;
}

export function DesktopInstallModal({ onClose, onInstall }: DesktopInstallModalProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="w-full max-w-[460px] bg-white rounded-[48px] shadow-2xl border border-gray-100 p-12 relative overflow-hidden" 
        dir="rtl"
      >
        <button onClick={onClose} className="absolute left-10 top-10 text-gray-300 hover:text-red-500 transition-colors">
          <X size={20} />
        </button>

        <div className="space-y-10">
          <div className="flex items-center gap-6">
             <div className="h-20 w-20 rounded-[28px] bg-white overflow-hidden flex items-center justify-center shadow-2xl border border-gray-50">
                <Image 
                  src="/icon-512.png" 
                  alt="Namix App" 
                  width={80} 
                  height={80}
                  className="object-cover"
                  data-ai-hint="app icon"
                />
             </div>
             <div className="text-right">
                <h3 className="text-2xl font-black text-[#002d4d]">نسخة سطح المكتب</h3>
                <div className="flex items-center gap-2 text-[#f9a885] font-black text-[10px] uppercase tracking-widest mt-1">
                  <Sparkles size={12} />
                  Desktop Experience Node
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <p className="text-sm font-bold text-gray-500 leading-[2.2] text-right">
               حول متصفحك إلى محطة تداول احترافية. تثبيت ناميكس كبرنامج مستقل يمنحك سرعة أعلى في تحليل الرسوم البيانية واستقراراً أكبر في الاتصال بالشبكة.
             </p>
             
             <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center gap-4 shadow-inner">
                <Layout className="text-blue-500 shrink-0" size={24} />
                <p className="text-[11px] font-bold text-blue-800/60 leading-relaxed">تجرية عرض واسعة النطاق محسنة لشاشات التداول الكبيرة.</p>
             </div>
          </div>

          <div className="pt-2">
             <Button onClick={onInstall} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all group">
                <span>تثبيت نسخة الحاسوب</span>
                <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-1" />
             </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
