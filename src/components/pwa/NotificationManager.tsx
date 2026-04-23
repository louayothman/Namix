
"use client";

import React, { useEffect, useState } from "react";
import { requestNotificationPermission, onMessageListener } from "@/firebase/messaging";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { Bell, ShieldCheck, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview مدير التنبيهات الذكي v1.1 - Smart Alert Node
 * نافذة شاملة لتمكين الإشعارات الفورية بأسلوب مهني ومبسط.
 */
export function NotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const db = useFirestore();

  useEffect(() => {
    const userSession = localStorage.getItem("namix_user");
    if (!userSession) return;

    const hasPermission = 'Notification' in window && Notification.permission === 'granted';
    const isDismissed = localStorage.getItem("namix_notif_prompt_dismissed");

    if (!hasPermission && !isDismissed) {
      // إظهار الطلب بعد فترة وجيزة لضمان جاهزية المستثمر
      const timer = setTimeout(() => setShowPrompt(true), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

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
        toast({
          title: "تم تفعيل التنبيهات",
          description: "ستصلك الآن تحديثات السوق وتطورات الحساب فوراً."
        });
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
                <div className="h-12 w-12 rounded-[20px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                   <Bell size={24} className="animate-pulse" />
                </div>
                <div className="text-right">
                   <h4 className="text-base font-black text-[#002d4d]">التنبيهات الفورية</h4>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Live Activity Monitor</p>
                </div>
                <button onClick={handleDismiss} className="mr-auto text-gray-300 hover:text-red-500 transition-colors">
                   <X size={18} />
                </button>
             </div>

             <p className="text-[12px] font-bold text-gray-500 leading-relaxed text-right pr-2">
                ابقَ على اتصال دائم مع تحركات السوق وتطورات محفظتك الاستثمارية فور حدوثها لضمان سرعة الاستجابة والنمو.
             </p>

             <div className="pt-2">
                <Button 
                  onClick={handleGrantPermission}
                  className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                   <span>تفعيل التنبيهات الذكية</span>
                   <Sparkles size={16} className="text-[#f9a885]" />
                </Button>
             </div>

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
