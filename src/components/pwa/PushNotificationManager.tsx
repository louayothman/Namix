
"use client";

import React, { useEffect, useRef } from "react";
import { requestNotificationPermission } from "@/firebase/messaging";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  limit
} from "firebase/firestore";

/**
 * @fileOverview مدير إشعارات شاشة القفل v3.0 - Intelligent Behavior Sync
 * يعمل كـ "رادار" يستمع لسجل الإشعارات في قاعدة البيانات ويحولها فوراً لتنبيهات OS.
 * تم دمج منطق استلام الإشعارات المؤتمتة الناتجة عن تحليل سلوك المستخدم.
 */
export function PushNotificationManager() {
  const db = useFirestore();
  const processedNotifs = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const userSession = localStorage.getItem("namix_user");
    if (!userSession) return;
    const user = JSON.parse(userSession);

    // 1. المستمع اللحظي لسجل الإشعارات (The Behavior Reactor)
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
          
          // منع إرسال إشعارات قديمة (أكثر من دقيقتين) لتجنب الإزعاج عند فتح التطبيق
          const createdAt = new Date(data.createdAt).getTime();
          if (createdAt < Date.now() - 120000) {
            processedNotifs.current.add(notifId);
            return;
          }

          if (!processedNotifs.current.has(notifId)) {
            triggerNativePush(data.title, data.message, data.url || '/home');
            processedNotifs.current.add(notifId);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [db]);

  /**
   * إطلاق تنبيه النظام (OS Native Push)
   */
  const triggerNativePush = (title: string, message: string, url: string) => {
    if ('serviceWorker' in navigator && window.Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body: message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          dir: 'rtl',
          lang: 'ar',
          data: { url },
          tag: `namix_push_${Date.now()}`,
          renotify: true,
          vibrate: [100, 50, 100]
        });
      });
    }
  };

  return null;
}
