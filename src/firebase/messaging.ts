'use client';

import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { firebaseApp } from "./index";

/**
 * @fileOverview محرك إدارة إشعارات الدفع v1.2 - Push Messaging Engine
 * تم تحديث مفتاح VAPID الكامل لضمان التوافق مع معايير التشفير العالمية وتفعيل التنبيهات.
 */

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging(firebaseApp);
      // استخدام المفتاح العام الكامل (P-256) المستخرج من لوحة تحكم Firebase
      const token = await getToken(messaging, { 
        vapidKey: 'BMIQpPrGZ0jNwxP2uz_qZTtRjyBCwWZhsHr_5yGoUz9OXOJd9_nryI_RPnKmR_uRFoMFsAFgUV0CerGXNAoc8XQ' 
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
