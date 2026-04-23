
"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Zap, Activity, Sparkles, ChevronLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
             <div className="h-16 w-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image 
                  src="/icon-192.png" 
                  alt="Namix App" 
                  width={64} 
                  height={64}
                  className="object-contain"
                  data-ai-hint="app icon"
                />
             </div>
             <div className="text-right">
                <h3 className="text-xl font-black text-[#002d4d]">تثبيت نظام ناميكس</h3>
                <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-widest mt-1">
                  <Sparkles size={10} />
                  Android Access System
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <p className="text-[13px] font-bold text-gray-500 leading-[2.2] text-right">
               احصل على وصول فوري ومؤمن لأصولك الاستثمارية عبر تثبيت التطبيق الرسمي للمنصة.
             </p>
             
             <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                   <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-orange-400"><Zap size={18} /></div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-[#002d4d]">سرعة فائقة في التنفيذ</p>
                      <p className="text-[9px] text-gray-400 font-bold">معالجة أوامر وميضية عبر التطبيق.</p>
                   </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                   <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-500"><Activity size={18} /></div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-[#002d4d]">تنبيهات إشارات NAMIX AI</p>
                      <p className="text-[9px] text-gray-400 font-bold">استلام توصيات التداول مباشرة على شاشتك.</p>
                   </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                   <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500"><ShieldCheck size={18} /></div>
                   <div className="text-right">
                      <p className="text-[11px] font-black text-[#002d4d]">تأمين الدخول الحيوي</p>
                      <p className="text-[9px] text-gray-400 font-bold">حماية المحفظة ببصمة الوجه والأصبع.</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-2">
             <Button onClick={onInstall} className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group">
                <span>تثبيت التطبيق المعتمد</span>
                <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
             </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
