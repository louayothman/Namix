
"use client";

import React, { useEffect, useRef } from "react";
import { useFirestore } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  limit,
  updateDoc,
  doc
} from "firebase/firestore";
import { hapticFeedback } from "@/lib/haptic-engine";

/**
 * @fileOverview مدير إشعارات شاشة القفل المطور v20.0
 * يعمل كجسر بين Firestore ونظام الإشعارات Native مع ميزات التتبع والتفاعلية.
 */
export function PushNotificationManager() {
  const db = useFirestore();
  const processedNotifs = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const userSession = localStorage.getItem("namix_user");
    if (!userSession) return;
    const user = JSON.parse(userSession);

    // 1. المستمع اللحظي للتنبيهات (Real-time Beacon)
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const notifId = change.doc.id;
          
          // بروتوكول الأمان: تجاهل الإشعارات القديمة عند بدء التشغيل
          const createdAt = new Date(data.createdAt).getTime();
          if (createdAt < Date.now() - 60000) {
            processedNotifs.current.add(notifId);
            return;
          }

          if (!processedNotifs.current.has(notifId)) {
            triggerEnhancedPush(notifId, data);
            processedNotifs.current.add(notifId);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [db]);

  /**
   * إطلاق تنبيه النظام المطور (Enhanced OS Native Push)
   */
  const triggerEnhancedPush = (id: string, data: any) => {
    if ('serviceWorker' in navigator && window.Notification.permission === 'granted') {
      
      // التفاعل اللمسي (Haptic Feedback) بناءً على النوع
      if (data.type === 'success') hapticFeedback.success();
      else if (data.type === 'warning') hapticFeedback.error();
      else hapticFeedback.light();

      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(data.title, {
          body: data.message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          image: data.imageUrl || null, // ميزة الصور الغنية
          tag: data.tag || `namix_${data.type}`,
          data: { url: data.url || '/home', id },
          vibrate: data.priority === 'high' ? [200, 100, 200] : [100],
          requireInteraction: data.priority === 'high', // ميزة البقاء لحين التفاعل
          dir: 'rtl',
          lang: 'ar',
          actions: [
            { action: 'explore', title: '🔍 استعراض' },
            { action: 'mark_read', title: 'تمت القراءة' }
          ]
        });

        // ميزة Read Receipt: توثيق إرسال التنبيه للجهاز
        updateDoc(doc(db, "notifications", id), {
          isDelivered: true,
          deliveredAt: new Date().toISOString()
        }).catch(() => {});
      });
    }
  };

  return null;
}
