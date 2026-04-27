
'use client';

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseApp } from "./index";

/**
 * @fileOverview محرك إدارة إشعارات الدفع v20.0 - Background Service Registration
 * تم تحديث المحرك لضمان تسجيل Service Worker بشكل صحيح لدعم إشعارات شاشة القفل.
 */

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = getMessaging(firebaseApp);
      
      // تأكيد تسجيل Service Worker الخاص بالإشعارات
      const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const token = await getToken(messaging, { 
        vapidKey: 'BMIQpPrGZ0jNwxP2uz_qZTtRjyBCwWZhsHr_5yGoUz9OXOJd9_nryI_RPnKmR_uRFoMFsAFgUV0CerGXNAoc8XQ',
        serviceWorkerRegistration: swRegistration
      });
      
      console.log("NAMIX Push Token provisioned successfully.");
      return token;
    }
    return null;
  } catch (error) {
    console.error("FCM Token Deployment Error:", error);
    return null;
  }
}

export function onMessageListener() {
  if (typeof window === 'undefined') return;
  const messaging = getMessaging(firebaseApp);
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("[NAMIX] Foreground Message received:", payload);
      resolve(payload);
    });
  });
}
