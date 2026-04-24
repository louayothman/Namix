
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
import { NotificationPrompt } from "./NotificationPrompt";
import { runNamix } from "@/lib/namix-orchestrator";

/**
 * @fileOverview مدير إشعارات شاشة القفل v2.0 - Smart Listener Architecture
 * تم تحديث المحرك ليصبح مستمعاً ذكياً لسجل الإشعارات في قاعدة البيانات،
 * مما يتيح بث كافة أنواع التنبيهات (مالية، أمنية، استهدافية) فوراً لشاشة القفل.
 */
export function PushNotificationManager() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const db = useFirestore();
  
  const lastPushTimeRef = useRef<number>(0);
  const isFirstPushSent = useRef(false);
  const processedNotifs = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const userSession = localStorage.getItem("namix_user");
    const user = userSession ? JSON.parse(userSession) : null;

    if (!user) return;

    // 1. بروتوكول طلب الإذن الأولي
    const isDismissed = localStorage.getItem("namix_notif_prompt_dismissed");
    if (window.Notification.permission !== 'granted' && !isDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 8000);
      return () => clearTimeout(timer);
    }

    // 2. مستمع الإشعارات اللحظي (Global Listener)
    // هذا الجزء مسؤول عن تحويل أي سجل إشعار في Firestore إلى Push حقيقي
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const notifId = change.doc.id;
          
          // منع تكرار إرسال إشعارات قديمة عند بدء الاتصال
          const createdAt = new Date(data.createdAt).getTime();
          if (createdAt < Date.now() - 30000) {
            processedNotifs.current.add(notifId);
            return;
          }

          if (!processedNotifs.current.has(notifId)) {
            triggerSystemPush(data.title, data.message, data.url || '/home');
            processedNotifs.current.add(notifId);
          }
        }
      });
    });

    // 3. محرك إشارات التداول والتقلبات (Background Market Watcher)
    const runMarketWatcher = async () => {
      try {
        const now = Date.now();
        const symbolsSnap = await getDocs(query(collection(db, "trading_symbols"), where("isActive", "==", true)));
        const symbols = symbolsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        if (symbols.length === 0) return;

        // اختيار أفضل إشارة تداول بناءً على عتبات الثقة
        const candidates = [];
        for (const sym of symbols) {
          const analysis = await runNamix(sym.binanceSymbol || sym.code);
          const strength = Math.abs(analysis.score - 0.5);
          
          // عتبة 50% (قوة 0.15) كافتراضي، تنخفض عند الركود
          const timeSinceLastPush = (now - lastPushTimeRef.current) / (1000 * 60);
          const threshold = timeSinceLastPush >= 20 ? 0.05 : 0.15;

          if (strength >= threshold) {
            candidates.push({ sym, analysis, strength });
          }
        }

        if (candidates.length > 0) {
          const top = candidates.sort((a, b) => b.strength - a.strength)[0];
          // الإضافة لـ Firestore ستطلق الـ Listener أعلاه آلياً
          // لا حاجة لاستدعاء triggerSystemPush هنا لمنع التكرار
        }
      } catch (e) {
        console.error("Market Watcher Error:", e);
      }
    };

    const triggerSystemPush = (title: string, message: string, url: string) => {
      if ('serviceWorker' in navigator && window.Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification(title, {
            body: message,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            data: { url },
            tag: `namix_push_${Date.now()}`,
            renotify: true
          });
        });
      }
      lastPushTimeRef.current = Date.now();
    };

    const interval = setInterval(runMarketWatcher, 60000);
    runMarketWatcher();

    return () => {
      unsubscribe();
      clearInterval(interval);
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
      
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification('مرحباً بك في ناميكس', {
          body: 'تم تفعيل التنبيهات الذكية بنجاح. ستصلك كافة التحديثات المالية هنا.',
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
