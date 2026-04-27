
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
 * @fileOverview مدير إشعارات شاشة القفل المطور v50.0 - Sovereign OS Bridge
 * يعمل كجسر استخباراتي يراقب Firestore ويطلق تنبيهات Native بأعلى مستويات التفاعل.
 */
export function PushNotificationManager() {
  const db = useFirestore();
  const processedNotifs = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const userSession = localStorage.getItem("namix_user");
    if (!userSession) return;
    const user = JSON.parse(userSession);

    // المستمع اللحظي للتنبيهات الصادرة من المحرك السلوكي أو الإداري
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc"),
      limit(15)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const notifId = change.doc.id;
          
          // حماية: تجاهل الرسائل القديمة (أكثر من دقيقة)
          const createdAt = new Date(data.createdAt).getTime();
          if (createdAt < Date.now() - 60000) {
            processedNotifs.current.add(notifId);
            return;
          }

          if (!processedNotifs.current.has(notifId)) {
            dispatchToOS(notifId, data);
            processedNotifs.current.add(notifId);
          }
        }
      });
    });

    return () => unsubscribe();
  }, [db]);

  /**
   * إرسال الإشعار لنظام تشغيل الجهاز (iOS/Android/Desktop)
   */
  const dispatchToOS = (id: string, data: any) => {
    if ('serviceWorker' in navigator && window.Notification.permission === 'granted') {
      
      // التفاعل اللمسي التكتيكي
      if (data.priority === 'high') hapticFeedback.success();
      else hapticFeedback.light();

      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(data.title, {
          body: data.message,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          image: data.imageUrl || null, 
          tag: data.tag || `namix_notif_${data.type}`,
          data: { url: data.url || '/home', id },
          vibrate: data.priority === 'high' ? [200, 100, 200] : [100],
          requireInteraction: data.priority === 'high',
          dir: 'rtl',
          lang: 'ar',
          actions: [
            { action: 'explore', title: '🔍 استعراض' },
            { action: 'close', title: 'تجاهل' }
          ]
        });

        // توثيق الاستلام في سجلات القاعدة
        updateDoc(doc(db, "notifications", id), {
          isDelivered: true,
          deliveredAt: new Date().toISOString()
        }).catch(() => {});
      });
    }
  };

  return null;
}
