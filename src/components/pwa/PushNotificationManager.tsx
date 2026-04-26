
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
 * @fileOverview مدير إشعارات شاشة القفل v2.0 - Smart Listener Architecture
 * يعمل كـ "رادار" يستمع لسجل الإشعارات في قاعدة البيانات ويحولها فوراً لتنبيهات OS.
 * يضمن وصول الإشعارات طالما أن التطبيق مفتوح في متصفح أي مستخدم آخر أو في الخلفية.
 */
export function PushNotificationManager() {
  const db = useFirestore();
  const processedNotifs = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const userSession = localStorage.getItem("namix_user");
    if (!userSession) return;
    const user = JSON.parse(userSession);

    // 1. بروتوكول طلب الإذن (يظهر مرة واحدة)
    if (window.Notification.permission === 'default') {
      const isDismissed = localStorage.getItem("namix_notif_prompt_dismissed");
      if (!isDismissed) {
        // نترك لـ PWAInstaller إظهار النافذة الجميلة، هنا فقط نراقب الإذن
      }
    }

    // 2. المستمع اللحظي لسجل الإشعارات (The Reactor)
    // هذا الجزء هو المسؤول عن "سحر" التنبيهات: أي تغيير في Firestore سيتحول لـ Push
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
          
          // منع إرسال إشعارات قديمة (أكثر من دقيقة) عند بدء الاتصال
          const createdAt = new Date(data.createdAt).getTime();
          if (createdAt < Date.now() - 60000) {
            processedNotifs.current.add(notifId);
            return;
          }

          // التحقق من عدم تكرار الإشعار في الجلسة الحالية
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
          data: { url },
          tag: `namix_push_${Date.now()}`, // لضمان عدم تكدس الإشعارات المتشابهة
          renotify: true
        });
      });
    }
  };

  return null; // مكون وظيفي يعمل في الخلفية
}
