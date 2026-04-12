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

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showIosTooltip, setShowIosTooltip] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(isStandalone);
    if (isStandalone) return;

    const visits = parseInt(localStorage.getItem("namix_visit_count") || "0") + 1;
    localStorage.setItem("namix_visit_count", visits.toString());
    const shouldShow = visits % 3 === 0;

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldShow) setTimeout(() => setShowAndroidModal(true), 4000);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos && !isStandalone && shouldShow) setTimeout(() => setShowIosTooltip(true), 5000);

    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowAndroidModal(false);
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      <AnimatePresence>
        {showAndroidModal && (
          <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 pointer-events-none">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="w-full max-w-[400px] bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 pointer-events-auto relative overflow-hidden" dir="rtl">
              <button onClick={() => setShowAndroidModal(false)} className="absolute left-6 top-6 text-gray-300"><X size={16} /></button>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-[#002d4d] flex items-center justify-center text-[#f9a885] shadow-xl"><Download size={24} /></div>
                   <div className="text-right">
                      <h3 className="text-lg font-normal text-[#002d4d]">تثبيت تطبيق ناميكس</h3>
                      <div className="flex items-center gap-2 text-[#f9a885] font-normal text-[9px] uppercase mt-1"><Sparkles size={10} />نظام الوصول السريع</div>
                   </div>
                </div>
                <p className="text-[12px] font-normal text-gray-500 leading-loose text-right">ثبّت التطبيق الآن للوصول السريع وحماية أصولك بضغطة واحدة من شاشتك الرئيسية.</p>
                <div className="grid grid-cols-1 gap-3">
                   <Button onClick={handleInstall} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-normal text-sm shadow-xl flex items-center justify-center gap-3">
                      <span>تثبيت الآن</span>
                      <ChevronLeft size={18} />
                   </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIosTooltip && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[2000] w-[90vw] max-w-[360px] pointer-events-none" dir="rtl">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-[#002d4d] text-white p-6 rounded-[32px] shadow-2xl relative pointer-events-auto">
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#002d4d]" />
              <button onClick={() => setShowIosTooltip(false)} className="absolute left-4 top-4 opacity-40"><X size={14} /></button>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <Smartphone size={20} className="text-[#f9a885]" />
                   <p className="text-sm font-normal">أضف ناميكس لشاشتك</p>
                </div>
                <p className="text-[11px] font-normal text-blue-100/70 leading-relaxed text-right">اضغط على زر المشاركة <Share size={14} className="inline-block mx-1" /> ثم اختر <span className="text-white font-normal">"إضافة إلى الشاشة الرئيسية"</span> <PlusSquare size={14} className="inline-block mx-1" />.</p>
                <div className="flex justify-center opacity-30"><ShieldCheck size={10} /><span className="text-[8px] mr-1 uppercase">دليل التثبيت الآمن</span></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}