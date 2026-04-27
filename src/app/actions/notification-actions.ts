
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

/**
 * @fileOverview نظام التنبيهات الاستراتيجي v20.0 - 20 Advanced Features Payload
 * تم تحديث المحرك لدعم الصور، الأولويات، والبيانات الوصفية المتقدمة لشاشات القفل.
 */

interface PushOptions {
  priority?: 'low' | 'medium' | 'high';
  tag?: string;
  image?: string;
  url?: string;
  expiresInSeconds?: number;
}

/**
 * 1. تنبيهات العمليات المالية المتقدمة
 */
export async function sendFinancialNotification(userId: string, type: 'send' | 'receive' | 'deposit', amount: number, options?: PushOptions) {
  const { firestore } = initializeFirebase();
  let title = "";
  let message = "";
  let iconType = "success";

  if (type === 'send') {
    title = "تأكيد تحويل صادر";
    message = `تم خصم مبلغ بقيمة $${amount.toLocaleString()} من محفظتك.`;
    iconType = "info";
  } else if (type === 'receive') {
    title = "استلام سيولة جديدة";
    message = `تلقيت مبلغاً بقيمة $${amount.toLocaleString()} بنجاح.`;
  } else {
    title = "شحن الرصيد المعتمد";
    message = `تمت إضافة مبلغ $${amount.toLocaleString()} إلى رصيدك الجاري.`;
  }

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title,
    message,
    type: iconType,
    url: options?.url || "/home",
    priority: options?.priority || "high",
    tag: `finance_${type}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    // ميزات متقدمة للحاوية
    metadata: {
      amount,
      currency: "USD",
      timestamp: Date.now()
    }
  });
}

/**
 * 2. تنبيهات إشارات NAMIX AI المرئية
 */
export async function sendAISignalNotification(userId: string, coin: string, confidence: number, decision: string, chartImg?: string) {
  const { firestore } = initializeFirebase();
  const direction = decision === 'BUY' ? "شراء" : "بيع";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: `إشارة ذكية: ${coin}`,
    message: `فرصة ${direction} بنسبة ثقة %${confidence}. حلل المحرك نبض السيولة الآن.`,
    type: "success",
    imageUrl: chartImg || null, // ميزة الصورة الغنية
    url: `/trade/${coin.toUpperCase()}`,
    priority: "medium",
    tag: `signal_${coin}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    // ميزة التدمير الذاتي للإشارة (Expiration)
    expiresAt: new Date(Date.now() + 300000).toISOString() // تنتهي بعد 5 دقائق
  });
}

/**
 * 3. تنبيهات الأمان السيادي
 */
export async function sendSecurityNotification(userId: string, actionType: 'pin' | 'password' | 'login') {
  const { firestore } = initializeFirebase();
  let title = "بروتوكول أمان نشط";
  let message = "";
  
  if (actionType === 'login') message = "تم رصد دخول جديد لحسابك. هل كنت أنت؟";
  else if (actionType === 'pin') message = "تم تحديث رمز PIN الخاص بالخزنة بنجاح.";
  else message = "تنبيه: تم تغيير كلمة مرور الحساب فوراً.";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title,
    message,
    type: "warning",
    url: "/settings",
    priority: "high",
    tag: "security_alert",
    isRead: false,
    createdAt: new Date().toISOString()
  });
}

/**
 * 4. تنبيهات الرتب والنجاح (Gamification)
 */
export async function sendAchievementNotification(userId: string, tierName: string, reward?: number) {
  const { firestore } = initializeFirebase();
  
  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: `تهانينا! بلوغ رتبة ${tierName}`,
    message: reward ? `لقد تم حقن مكافأة استحقاق بقيمة $${reward} في محفظتك.` : `أنت الآن ضمن فئة ${tierName} المعتمدة.`,
    type: "success",
    url: "/profile",
    priority: "high",
    tag: "achievement",
    isRead: false,
    createdAt: new Date().toISOString()
  });
}
