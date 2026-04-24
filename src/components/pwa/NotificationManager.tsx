
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
  getDocs 
} from "firebase/firestore";
import { Bell, ShieldCheck, Sparkles, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview مدير التنبيهات ومحرك الإشارات v3.0 - Intelligent Signal Reactor
 * تم إضافة "مفاعل إشارات السوق" الذي يقوم بمسح الأسواق المتاحة وتوليد تنبيهات بناءً على قواعد الثقة (20/50).
 */
export function NotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastHighConfidenceTime, setLastHighConfidenceTime] = useState<number>(Date.now());
  const lastNotifiedRef = useRef<Record<string, { type: string, time: number }>>({});
  
  const db = useFirestore();

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (!userSession) return;
    const user = JSON.parse(userSession);

    // 1. طلب الإذن وإدارة الظهور
    const hasPermission = 'Notification' in window && Notification.permission === 'granted';
    const isDismissed = localStorage.getItem("namix_notif_prompt_dismissed");

    if (!hasPermission && !isDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 8000);
      return () => clearTimeout(timer);
    }

    // 2. محرك المراقبة اللحظي (Live Notification Observer)
    if (hasPermission) {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.id),
        where("isRead", "==", false),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            const isRecent = new Date().getTime() - new Date(data.createdAt).getTime() < 30000;
            
            if (isRecent && 'serviceWorker' in navigator) {
              const registration = await navigator.serviceWorker.ready;
              registration.showNotification(data.title, {
                body: data.message,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                dir: 'rtl',
                lang: 'ar',
                data: { url: data.url || '/notifications' },
                tag: change.doc.id,
                renotify: true
              });
            }
          }
        });
      });

      // 3. مفاعل إشارات السوق (Market Signal Reactor)
      // يقوم بالمسح الدوري كل 5 دقائق لجميع الأسواق المفتوحة
      const runMarketScan = async () => {
        try {
          const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
          const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
          
          const now = Date.now();
          const minutesSinceLastHigh = (now - lastHighConfidenceTime) / (1000 * 60);
          
          // القاعدة: إذا مضى 30 دقيقة بدون إشارة > 50%، ننزل لثقة 20%
          const threshold = minutesSinceLastHigh >= 30 ? 20 : 50;

          for (const sym of symbols) {
            const analysis = await runNamix(sym.binanceSymbol || sym.code);
            const confidence = Math.round(analysis.score * 100);

            if (confidence >= threshold && analysis.decision !== 'HOLD') {
              // منع تكرار الإرسال لنفس العملة في فترات متقاربة
              const lastNote = lastNotifiedRef.current[sym.id];
              const isDifferentTrend = !lastNote || lastNote.type !== analysis.decision;
              const isTimeElapsed = !lastNote || (now - lastNote.time > 1800000); // 30 دقيقة راحة لنفس الرمز

              if (isDifferentTrend || isTimeElapsed) {
                // إرسال الإشعار عبر الأكشن المعتمد
                const { sendAISignalNotification } = await import("@/app/actions/notification-actions");
                await sendAISignalNotification(user.id, sym.code, confidence, analysis.decision);
                
                // تحديث السجلات المحلية
                lastNotifiedRef.current[sym.id] = { type: analysis.decision, time: now };
                if (confidence > 50) {
                  setLastHighConfidenceTime(now);
                }
              }
            }
          }
        } catch (e) {
          console.error("Signal Reactor Fail:", e);
        }
      };

      const signalInterval = setInterval(runMarketScan, 300000); // كل 5 دقائق
      runMarketScan(); // إطلاق أولي

      return () => {
        unsubscribe();
        clearInterval(signalInterval);
      };
    }
  }, [db, lastHighConfidenceTime]);

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
        
        setIsSuccess(true);
        setTimeout(() => setShowPrompt(false), 3000);
        return;
      }
    }
    setShowPrompt(false);
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
                     {isSuccess ? "تم تفعيل التنبيهات" : "التنبيهات الفورية"}
                   </h4>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">
                     {isSuccess ? "Sync Active" : "Live Activity Monitor"}
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
                          نظام الإشعارات مفعل الآن. ستصلك تحديثات السوق وتطورات الحساب فوراً.
                       </p>
                    </motion.div>
                  ) : (
                    <motion.p 
                      key="idle-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[12px] font-bold text-gray-500 leading-relaxed text-right pr-2"
                    >
                       ابقَ على اتصال دائم مع تحركات السوق وتطورات محفظتك الاستثمارية فور حدوثها لضمان سرعة الاستجابة والنمو.
                    </motion.p>
                  )}
                </AnimatePresence>
             </div>

             <AnimatePresence>
                {!isSuccess && (
                  <motion.div 
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <Button 
                      onClick={handleGrantPermission}
                      className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                       <span>تفعيل التنبيهات الذكية</span>
                       <Sparkles size={16} className="text-[#f9a885]" />
                    </Button>
                  </motion.div>
                )}
             </AnimatePresence>

             <div className="flex items-center justify-center gap-2 opacity-20">
                <ShieldCheck size={10} className="text-emerald-500" />
                <p className="text-[7px] font-black uppercase tracking-widest text-[#002d4d]">Secure Messaging System</p>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
