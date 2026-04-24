
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
 * @fileOverview مدير التنبيهات المزدوج v15.0 - Isolated Dual-Engine Architecture
 * تم فصل محرك تلغرام عن محرك شاشة القفل بالكامل ببروتوكولات معزولة ومستقلة.
 */
export function NotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const db = useFirestore();
  
  // مراجع لتتبع حالات البث لكل محرك بشكل منفصل
  const lastPushTimeRef = useRef<number>(0);
  const lastPushSymbolRef = useRef<string | null>(null);
  const isFirstPushSent = useRef(false);

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

    // ==========================================
    // 1. محرك بث تلغرام (Telegram Engine)
    // مستقل: كل 5 دقائق، أفضل فرصة، بدون عتبة ثقة
    // ==========================================
    const runTelegramBroadcast = async () => {
      try {
        const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
        const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        if (symbols.length === 0) return;

        const analyses = [];
        for (const sym of symbols) {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          const strength = Math.abs(analysis.score - 0.5);
          analyses.push({ sym, analysis, strength });
        }

        // اختيار "أفضل" إشارة متاحة في السوق حالياً
        const best = analyses.sort((a, b) => b.strength - a.strength)[0];
        if (best && best.analysis.decision !== 'HOLD') {
          await broadcastSignalToTelegram(best.analysis, best.sym);
        }
      } catch (e) {
        console.error("Telegram Broadcast Error:", e);
      }
    };

    // ==========================================
    // 2. محرك بث شاشة القفل (Push Engine)
    // مستقل: دقيقة أولى، عتبة 50%، تراجع لـ 20% بعد 30 دقيقة
    // ==========================================
    const runPushEngine = async () => {
      try {
        const now = Date.now();
        const timeSinceInstall = now - parseInt(installTime!);
        const isOneMinutePassed = timeSinceInstall >= 60000;

        // فحص إشارة "الدقيقة الأولى"
        if (isOneMinutePassed && !isFirstPushSent.current) {
          await sendFirstSignalPush();
          return;
        }

        // منطق البث المستمر لشاشة القفل
        const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
        const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        if (symbols.length === 0) return;

        const timeSinceLastPush = (now - lastPushTimeRef.current) / (1000 * 60);
        let currentThreshold = timeSinceLastPush >= 30 ? 0.05 : 0.15; // 0.15 تعادل 65% أو 35% (انحراف عن 0.5)

        const candidates = [];
        for (const sym of symbols) {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          const strength = Math.abs(analysis.score - 0.5);
          if (strength >= currentThreshold) {
            candidates.push({ sym, analysis, strength });
          }
        }

        const topPush = candidates.sort((a, b) => b.strength - a.strength)[0];
        if (topPush) {
          await executePushNotification(topPush.sym, topPush.analysis);
        }
      } catch (e) {
        console.error("Push Engine Error:", e);
      }
    };

    const sendFirstSignalPush = async () => {
      const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true), limit(1)));
      if (!symbolsSnap.empty) {
        const sym = { id: symbolsSnap.docs[0].id, ...symbolsSnap.docs[0].data() } as any;
        const analysis = await runNamix(sym.binanceSymbol || sym.code);
        await executePushNotification(sym, analysis);
        isFirstPushSent.current = true;
      }
    };

    const executePushNotification = async (sym: any, analysis: any) => {
      const confidence = Math.round(analysis.score * 100);
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
          data: { url: targetUrl },
          tag: `push_${sym.id}`,
          renotify: true
        });
      }
      lastPushTimeRef.current = Date.now();
      lastPushSymbolRef.current = sym.id;
    };

    // تشغيل المحركات في فترات زمنية معزولة
    const telegramInterval = setInterval(runTelegramBroadcast, 300000); // 5 دقائق بالتمام
    const pushInterval = setInterval(runPushEngine, 60000); // فحص حالة شاشة القفل كل دقيقة

    // تشغيل أولي فوري للمحركات
    runTelegramBroadcast();
    runPushEngine();

    return () => {
      clearInterval(telegramInterval);
      clearInterval(pushInterval);
    };
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
      
      // إرسال الإشعار الترحيبي الفوري لشاشة القفل
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('مرحباً بك في ناميكس', {
          body: 'تم تفعيل مركز التنبيهات بنجاح. ستصلك أحدث تحديثات السوق هنا.',
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

