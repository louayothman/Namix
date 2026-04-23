
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
  ChevronLeft,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview محرك تثبيت التطبيق v3.0 - Professional Access Hub
 * يدير ظهور نوافذ التثبيت لنظامي أندرويد وآيفون بلغة استثمارية رصينة.
 */
export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showIosTooltip, setShowIosTooltip] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // التحقق من وضع التشغيل (تطبيق أم متصفح)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsInstalled(isStandalone);
    
    if (isStandalone) return;

    // محرك الظهور الذكي: يظهر بعد 3 زيارات لضمان عدم إزعاج المستخدم
    const visits = parseInt(localStorage.getItem("namix_access_count") || "0") + 1;
    localStorage.setItem("namix_access_count", visits.toString());
    const shouldShow = visits >= 2;

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (shouldShow) {
        // تأخير بسيط لإعطاء مساحة للمستخدم للاطلاع على الصفحة
        setTimeout(() => setShowAndroidModal(true), 5000);
      }
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);

    // اكتشاف أجهزة آبل وإظهار الدليل المخصص
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIos && !isStandalone && shouldShow) {
      setTimeout(() => setShowIosTooltip(true), 6000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidModal(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      {/* 1. نافذة التثبيت لأجهزة أندرويد والحاسوب */}
      <AnimatePresence>
        {showAndroidModal && (
          <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]">
            <motion.div 
              initial={{ y: 100, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 100, opacity: 0 }} 
              className="w-full max-w-[420px] bg-white rounded-[44px] shadow-2xl border border-gray-100 p-10 relative overflow-hidden" 
              dir="rtl"
            >
              <button onClick={() => setShowAndroidModal(false)} className="absolute left-8 top-8 text-gray-300 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div className="flex items-center gap-5">
                   <div className="h-16 w-16 rounded-[22px] bg-[#002d4d] flex items-center justify-center text-[#f9a885] shadow-xl">
                      <Download size={28} />
                   </div>
                   <div className="text-right">
                      <h3 className="text-xl font-black text-[#002d4d]">نظام الوصول السريع</h3>
                      <div className="flex items-center gap-2 text-[#f9a885] font-black text-[9px] uppercase tracking-widest mt-1">
                        <Sparkles size={10} />
                        Professional Trading App
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[13px] font-bold text-gray-500 leading-[2.2] text-right">
                     ثبّت تطبيق ناميكس الآن للحصول على وصول فوري ومؤمن لأصولك، واستقبال إشارات تداول ذكية مباشرة على شاشة القفل.
                   </p>
                   
                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-1.5">
                         <Zap size={14} className="text-orange-400" />
                         <span className="text-[9px] font-black text-[#002d4d]">سرعة فائقة</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-1.5">
                         <Activity size={14} className="text-blue-500" />
                         <span className="text-[9px] font-black text-[#002d4d]">تنبيهات حية</span>
                      </div>
                   </div>
                </div>

                <div className="pt-2">
                   <Button onClick={handleInstall} className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group">
                      <span>تثبيت التطبيق الآن</span>
                      <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
                   </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. دليل التثبيت الذكي لمستخدمي آيفون */}
      <AnimatePresence>
        {showIosTooltip && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[2000] w-[92vw] max-w-[380px] pointer-events-none" dir="rtl">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 20, opacity: 0 }} 
              className="bg-[#002d4d] text-white p-8 rounded-[40px] shadow-2xl relative pointer-events-auto border border-white/5"
            >
              <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#002d4d]" />
              <button onClick={() => setShowIosTooltip(false)} className="absolute left-6 top-6 opacity-30 hover:opacity-100 transition-opacity"><X size={18} /></button>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Smartphone size={20} className="text-[#f9a885]" />
                   </div>
                   <p className="text-base font-black">أضف ناميكس لشاشتك</p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-[12px] font-bold text-blue-100/70 leading-loose text-right">
                    اضغط على زر المشاركة <Share size={16} className="inline-block mx-1 text-[#f9a885]" /> في الأسفل، ثم اختر <span className="text-white font-black">"إضافة إلى الشاشة الرئيسية"</span> <PlusSquare size={16} className="inline-block mx-1 text-[#f9a885]" /> من القائمة.
                  </p>
                  
                  <div className="pt-2 flex justify-center opacity-30 border-t border-white/10 mt-4">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span className="text-[8px] font-black mr-1.5 uppercase tracking-widest">آلية تثبيت آمنة</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
