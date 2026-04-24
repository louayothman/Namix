
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
import { broadcastSignalToTelegram } from "@/app/actions/telegram-actions";

/**
 * @fileOverview مدير التنبيهات المطور v14.0 - Universal Best-Signal Broadcast
 * تم تكثيف معدل بث تلغرام كل 5 دقائق مع اختيار "أفضل" إشارة متاحة لضمان الحيوية.
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

    // محرك المسح السوقي واختيار "أفضل صفقة" للبث
    const runMarketScan = async () => {
      try {
        const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
        const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        
        if (symbols.length === 0) return;

        const now = Date.now();
        const analyses = [];

        // 1. إجراء تحليل شامل لكافة الأسواق المتاحة
        for (const sym of symbols) {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          // حساب "قوة الإشارة" بغض النظر عن الاتجاه (المسافة عن 0.5)
          const strength = Math.abs(analysis.score - 0.5);
          analyses.push({ sym, analysis, strength });
        }

        // 2. ترتيب النتائج لاختيار الأقوى (أعلى نسبة ثقة في أي اتجاه)
        const sorted = analyses.sort((a, b) => b.strength - a.strength);
        const bestOpportunity = sorted[0];

        // 3. بث "أفضل فرصة" لتلغرام (كل 5 دقائق بدون شروط ثقة)
        if (bestOpportunity && bestOpportunity.analysis.decision !== 'HOLD') {
           broadcastSignalToTelegram(bestOpportunity.analysis, bestOpportunity.sym).catch(console.error);
        }

        // 4. بروتوكول التنبيهات المتصفح (Browser Push) - يحافظ على عتبة 50% لمنع الإزعاج
        const lastHighTime = parseInt(localStorage.getItem("namix_last_high_signal") || "0");
        const minutesSinceLastHigh = lastHighTime === 0 ? 999 : (now - lastHighTime) / (1000 * 60);
        let pushThreshold = minutesSinceLastHigh >= 30 ? 0.05 : 0.15; // ثقة مخففة للـ Push

        const topPushCandidate = sorted.find(a => a.strength >= pushThreshold);
        if (topPushCandidate) {
          const { sym, analysis } = topPushCandidate;
          const confidence = Math.round(analysis.score * 100);
          
          const lastNote = lastNotifiedRef.current[sym.id];
          const isDifferentTrend = !lastNote || lastNote.type !== analysis.decision;
          const isTimeElapsed = !lastNote || (now - lastNote.time > 600000); 

          if (isDifferentTrend || isTimeElapsed) {
            const title = `تحديث السوق: ${sym.code}`;
            const message = `توصية ${analysis.decision === 'BUY' ? 'شراء' : 'بيع'} بنسبة ثقة %${confidence}.`;
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
                data: { url: targetUrl },
                tag: `signal_${sym.id}`,
                renotify: true
              });
            }
            
            lastNotifiedRef.current[sym.id] = { type: analysis.decision, time: now };
            if (confidence >= 50) localStorage.setItem("namix_last_high_signal", now.toString());
          }
        }
      } catch (e) {
        console.error("Scan Error:", e);
      }
    };

    const timeSinceInstall = Date.now() - parseInt(installTime);
    const oneMinute = 60000;

    // أول مسح بعد دقيقة واحدة من التثبيت لضمان استلام أول إشارة
    if (timeSinceInstall < oneMinute && !isFirstScanScheduled.current) {
      isFirstScanScheduled.current = true;
      setTimeout(runMarketScan, oneMinute - timeSinceInstall);
    } else {
      runMarketScan();
    }

    // جدولة البث الدوري كل 5 دقائق بالضبط (300000ms)
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
      
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('مرحباً بك في ناميكس', {
          body: 'تم تفعيل مركز التنبيهات بنجاح. ستصلك أحدث الفرص هنا.',
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
