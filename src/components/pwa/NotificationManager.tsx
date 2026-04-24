
"use client";

import React, { useEffect, useState, useRef } from "react";
import { requestNotificationPermission } from "@/firebase/messaging";
import { useFirestore } from "@/firebase";
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  getDocs,
  addDoc
} from "firebase/firestore";
import { Bell, ShieldCheck, Sparkles, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview مدير التنبيهات المطور v10.0 - Professional Trading Edition
 * لغة بسيطة وراقية، بث مباشر لشاشة القفل، ودعم إشارة الدقيقة الأولى.
 */
export function NotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const db = useFirestore();
  
  const lastNotifiedRef = useRef<Record<string, { type: string, time: number }>>({});
  const isFirstScanScheduled = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const userSession = localStorage.getItem("namix_user");
    const user = userSession ? JSON.parse(userSession) : null;

    let installTime = localStorage.getItem("namix_install_time");
    if (!installTime) {
      installTime = Date.now().toString();
      localStorage.setItem("namix_install_time", installTime);
    }

    const hasPermission = window.Notification.permission === 'granted';
    const isDismissed = localStorage.getItem("namix_notif_prompt_dismissed");

    if (!hasPermission && !isDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }

    // محرك بث الإشارات اللحظي لشاشة القفل (Push Core)
    const runMarketScan = async () => {
      try {
        const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
        const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        
        const now = Date.now();
        const lastHighTime = parseInt(localStorage.getItem("namix_last_high_signal") || now.toString());
        const minutesSinceLastHigh = (now - lastHighTime) / (1000 * 60);
        const isFirstSignalSent = localStorage.getItem("namix_first_signal_sent") === "true";
        
        // 1. تحديد عتبة الثقة (0% للإشارة الأولى، 50% كحد أدنى، 20% في حال الركود)
        let threshold = 50;
        if (!isFirstSignalSent) threshold = 0; // إرسال أول إشارة مهما كانت القوة
        else if (minutesSinceLastHigh >= 30) threshold = 20;

        for (const sym of symbols) {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          const confidence = Math.round(analysis.score * 100);

          if (confidence >= threshold && analysis.decision !== 'HOLD') {
            const lastNote = lastNotifiedRef.current[sym.id];
            const isDifferentTrend = !lastNote || lastNote.type !== analysis.decision;
            const isTimeElapsed = !lastNote || (now - lastNote.time > 1800000); 

            if (isDifferentTrend || isTimeElapsed) {
              const title = `فرصة تداول: ${analysis.decision === 'BUY' ? 'شراء' : 'بيع'} ${sym.code}`;
              const message = `توصية NAMIX AI بنسبة ثقة %${confidence}. السعر الحالي: $${analysis.agents.tech.last.toLocaleString()}`;
              const targetUrl = `/trade/${sym.id}`;
              
              // أ. التوثيق السحابي للمسجلين
              if (user) {
                await addDoc(collection(db, "notifications"), {
                  userId: user.id,
                  title,
                  message,
                  type: "success",
                  url: targetUrl,
                  isRead: false,
                  createdAt: new Date().toISOString()
                });
              }

              // ب. إطلاق إشعار Push حقيقي لشاشة القفل
              if ('serviceWorker' in navigator && window.Notification.permission === 'granted') {
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification(title, {
                  body: message,
                  icon: '/icon-192.png',
                  badge: '/icon-192.png',
                  vibrate: [200, 100, 200],
                  dir: 'rtl',
                  lang: 'ar',
                  data: { url: targetUrl },
                  tag: `signal_${sym.id}`,
                  renotify: true
                });
              }
              
              lastNotifiedRef.current[sym.id] = { type: analysis.decision, time: now };
              if (!isFirstSignalSent) localStorage.setItem("namix_first_signal_sent", "true");
              if (confidence >= 50) {
                localStorage.setItem("namix_last_high_signal", now.toString());
              }
              
              // نكتفي بإشارة واحدة في كل مسح للتركيز
              break; 
            }
          }
        }
      } catch (e) {
        console.error("Signal Reactor Error:", e);
      }
    };

    // جدولة الإشارة الأولى (بعد 60 ثانية من التثبيت)
    const timeSinceInstall = Date.now() - parseInt(installTime);
    const oneMinute = 60000;

    if (timeSinceInstall < oneMinute && !isFirstScanScheduled.current) {
      isFirstScanScheduled.current = true;
      setTimeout(runMarketScan, oneMinute - timeSinceInstall);
    } else if (timeSinceInstall >= oneMinute) {
      runMarketScan();
    }

    const signalInterval = setInterval(runMarketScan, 300000);

    return () => clearInterval(signalInterval);
  }, [db]);

  const handleGrantPermission = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      const userSession = localStorage.getItem("namix_user");
      if (userSession) {
        const user = JSON.parse(userSession);
        await updateDoc(doc(db, "users", user.id), {
          fcmTokens: arrayUnion(token),
          updatedAt: new Date().toISOString()
        });
      }
      
      // إرسال إشعار ترحيبي فوري لشاشة القفل
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('مرحباً بك في ناميكس', {
          body: 'تم تفعيل التنبيهات بنجاح. ستصلك أحدث الفرص وتحديثات حسابك هنا.',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          data: { url: '/home' }
        });
      }

      setIsSuccess(true);
      setTimeout(() => setShowPrompt(false), 3000);
    } else {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("namix_notif_prompt_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-24 left-6 right-6 md:left-auto md:right-10 md:bottom-10 z-[1500] md:w-[380px]"
          dir="rtl"
        >
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none -rotate-12">
                <Bell size={120} />
             </div>
             
             <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "h-12 w-12 rounded-[20px] flex items-center justify-center shadow-inner transition-colors duration-500",
                  isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                   {isSuccess ? (
                     <CheckCircle2 size={24} className="animate-in zoom-in duration-500" />
                   ) : (
                     <Bell size={24} className="animate-pulse" />
                   )}
                </div>
                <div className="text-right">
                   <h4 className="text-base font-black text-[#002d4d]">
                     {isSuccess ? "تم تفعيل التنبيهات" : "تفعيل التنبيهات الذكية"}
                   </h4>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">
                     {isSuccess ? "Active" : "Notifications Center"}
                   </p>
                </div>
                {!isSuccess && (
                  <button onClick={handleDismiss} className="mr-auto text-gray-300 hover:text-red-500 transition-colors">
                     <X size={18} />
                  </button>
                )}
             </div>

             <div className="relative min-h-[40px]">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div 
                      key="success-text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3"
                    >
                       <ShieldCheck size={16} className="text-emerald-500" />
                       <p className="text-[11px] font-black text-emerald-800">
                          شكراً لك، ستقوم ناميكس الآن بإخطارك بكافة الفرص وتحديثات حسابك مباشرة على شاشة جهازك.
                       </p>
                    </motion.div>
                  ) : (
                    <motion.p 
                      key="idle-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[12px] font-bold text-gray-500 leading-relaxed text-right pr-2"
                    >
                       احصل على وصول فوري لأحدث إشارات التداول، وتحديثات محفظتك اللحظية، وتنبيهات الأمان مباشرة على شاشة قفل جهازك.
                    </motion.p>
                  )}
                </AnimatePresence>
             </div>

             {!isSuccess && (
               <div className="pt-2 relative z-10">
                 <Button 
                   onClick={handleGrantPermission}
                   className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    <span>تفعيل التنبيهات</span>
                    <Sparkles size={16} className="text-[#f9a885]" />
                 </Button>
               </div>
             )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
