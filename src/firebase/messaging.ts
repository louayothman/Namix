'use client';

import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { firebaseApp } from "./index";

/**
 * @fileOverview محرك إدارة إشعارات الدفع v1.1 - Push Messaging Engine
 * تم تحديث مفتاح VAPID المعتمد لتمكين تسجيل الأجهزة بشكل مؤمن وحل أخطاء التوثيق.
 */

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging(firebaseApp);
      // استخدام المفتاح المعتمد من لوحة تحكم Firebase لضمان التوافق مع معيار P-256
      const token = await getToken(messaging, { 
        vapidKey: 'olhOpQSARBtzM4X5TyeLkhMtJvOxAR89mCCy3CUBNy4' 
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
}

export function onMessageListener() {
  if (typeof window === 'undefined') return;
  const messaging = getMessaging(firebaseApp);
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}
