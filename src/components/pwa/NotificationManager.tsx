
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
import { NotificationPrompt } from "./NotificationPrompt";
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview مدير التنبيهات المطور v11.0 - Professional Instant Push
 * تبسيط المنطق، بث ترحيبي فوري، ودعم إشارة الدقيقة الأولى.
 */
export function NotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        
        // تحديد عتبة الثقة (0% للإشارة الأولى، 50% كحد أدنى، 20% في حال الركود)
        let threshold = 50;
        if (!isFirstSignalSent) threshold = 0; 
        else if (minutesSinceLastHigh >= 30) threshold = 20;

        for (const sym of symbols) {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          const confidence = Math.round(analysis.score * 100);

          if (confidence >= threshold && analysis.decision !== 'HOLD') {
            const lastNote = lastNotifiedRef.current[sym.id];
            const isDifferentTrend = !lastNote || lastNote.type !== analysis.decision;
            const isTimeElapsed = !lastNote || (now - lastNote.time > 1800000); 

            if (isDifferentTrend || isTimeElapsed) {
              const title = `توصية تداول: ${analysis.decision === 'BUY' ? 'شراء' : 'بيع'} ${sym.code}`;
              const message = `نسبة الثقة %${confidence}. السعر: $${analysis.agents.tech.last.toLocaleString()}`;
              const targetUrl = `/trade/${sym.id}`;
              
              if (user) {
                await addDoc(collection(db, "notifications"), {
                  userId: user.id, title, message, type: "success", url: targetUrl, isRead: false, createdAt: new Date().toISOString()
                });
              }

              if ('serviceWorker' in navigator && window.Notification.permission === 'granted') {
                const reg = await navigator.serviceWorker.ready;
                reg.showNotification(title, {
                  body: message,
                  icon: '/icon-192.png',
                  badge: '/icon-192.png',
                  vibrate: [200, 100, 200],
                  dir: 'rtl',
                  data: { url: targetUrl },
                  tag: `signal_${sym.id}`,
                  renotify: true
                });
              }
              
              lastNotifiedRef.current[sym.id] = { type: analysis.decision, time: now };
              if (!isFirstSignalSent) localStorage.setItem("namix_first_signal_sent", "true");
              if (confidence >= 50) localStorage.setItem("namix_last_high_signal", now.toString());
              break; 
            }
          }
        }
      } catch (e) {}
    };

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
    setIsLoading(true);
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
          body: 'تم تفعيل التنبيهات بنجاح. ستصلك أحدث الفرص وتحديثات محفظتك هنا.',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          data: { url: '/home' }
        });
      }

      setIsSuccess(true);
      setTimeout(() => {
        setShowPrompt(false);
        setIsLoading(false);
      }, 3000);
    } else {
      setShowPrompt(false);
      setIsLoading(false);
    }
  };

  return (
    <NotificationPrompt 
      isVisible={showPrompt}
      isSuccess={isSuccess}
      isLoading={isLoading}
      onClose={() => { setShowPrompt(false); localStorage.setItem("namix_notif_prompt_dismissed", "true"); }}
      onConfirm={handleGrantPermission}
    />
  );
}
