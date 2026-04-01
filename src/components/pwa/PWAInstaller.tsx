"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  X, 
  Share, 
  PlusSquare, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { hapticFeedback } from "@/lib/haptic-engine";

/**
 * @fileOverview مُفاعل التثبيت الذكي v2.0 - محرك الزيارات المطور
 * يتحكم في ظهور التثبيت بناءً على عدد الزيارات لضمان تجربة مستخدم نخبوية.
 */

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showIosTooltip, setShowIosTooltip] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. التحقق من حالة التثبيت
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone;
    
    setIsInstalled(isStandalone);
    if (isStandalone) return;

    // 2. محرك الزيارات الذكي
    const visitKey = "namix_visit_count";
    let visits = parseInt(localStorage.getItem(visitKey) || "0");
    visits += 1;
    localStorage.setItem(visitKey, visits.toString());

    // التحقق من شرط الظهور (كل 3 زيارات)
    const shouldShowThisTime = visits % 3 === 0;

    // 3. معالجة أندرويد
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldShowThisTime) {
        setTimeout(() => setShowAndroidModal(true), 4000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. معالجة آيفون
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos && !isStandalone && shouldShowThisTime) {
      setTimeout(() => setShowIosTooltip(true), 5000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleAndroidInstall = async () => {
    hapticFeedback.medium();
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidModal(false);
      hapticFeedback.success();
    }
    setDeferredPrompt(null);
  };

  const closeModals = () => {
    hapticFeedback.light();
    setShowAndroidModal(false);
    setShowIosTooltip(false);
  };

  if (isInstalled) return null;

  return (
    <>
      <AnimatePresence>
        {showAndroidModal && (
          <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 md:p-6 pointer-events-none font-body">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-[400px] bg-white rounded-[40px] shadow-[0_30px_100px_rgba(0,45,77,0.4)] border border-gray-100 p-8 pointer-events-auto relative overflow-hidden"
              dir="rtl"
            >
              <button onClick={closeModals} className="absolute left-6 top-6 h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"><X size={16} /></button>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-[#002d4d] flex items-center justify-center shadow-xl">
                      <Download size={24} className="text-[#f9a885] animate-bounce" />
                   </div>
                   <div className="text-right">
                      <h3 className="text-lg font-black text-[#002d4d]">ثبّت تطبيق ناميكس</h3>
                      <div className="flex items-center gap-2 text-[#f9a885] font-black text-[8px] uppercase tracking-widest mt-1">
                         <Sparkles size={10} />
                         Sovereign App Node
                      </div>
                   </div>
                </div>
                <p className="text-[12px] font-bold text-gray-500 leading-loose text-right">ثبّت التطبيق الآن للوصول السريع وحماية أصولك بضغطة واحدة من شاشتك الرئيسية.</p>
                <div className="grid grid-cols-1 gap-3">
                   <Button onClick={handleAndroidInstall} className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl flex items-center justify-center gap-3 group">
                      <span>تثبيت الآن</span>
                      <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                   </Button>
                   <button onClick={closeModals} className="w-full h-10 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors">سأقوم بذلك لاحقاً</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIosTooltip && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] w-[90vw] max-w-[360px] pointer-events-none font-body" dir="rtl">
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-[#002d4d] text-white p-6 rounded-[32px] shadow-2xl relative pointer-events-auto border border-white/10">
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#002d4d]" />
              <button onClick={closeModals} className="absolute left-4 top-4 opacity-40 hover:opacity-100"><X size={14} /></button>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner"><Smartphone size={20} className="text-[#f9a885]" /></div>
                   <p className="text-sm font-black">أضف ناميكس لشاشتك</p>
                </div>
                <div className="space-y-3">
                   <p className="text-[11px] font-bold text-blue-100/70 leading-relaxed text-right">
                     اضغط على زر المشاركة <Share size={14} className="inline-block mx-1 text-[#f9a885]" /> في الأسفل ثم اختر 
                     <span className="text-white font-black mx-1">"إضافة إلى الشاشة الرئيسية"</span> 
                     <PlusSquare size={14} className="inline-block mx-1 text-[#f9a885]" /> لتجربة غامرة.
                   </p>
                </div>
                <div className="flex items-center justify-center gap-2 opacity-30 pt-1">
                   <ShieldCheck size={10} className="text-emerald-400" />
                   <span className="text-[7px] font-black uppercase tracking-widest">Authorized Safari Guide</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}