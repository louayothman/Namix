
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview نظام التنبيهات المتقدم v7.0
 * تم تحديث اللغة لتكون رسمية تماماً وإزالة قيود الثقة الصلبة لدعم محرك الإشارات الديناميكي.
 */

/**
 * وظيفة إرسال تنبيه تغير سعري مفاجئ (أكبر من 2%)
 */
export async function sendPriceDeviationNotification(userId: string, coin: string, price: number, change: number) {
  if (Math.abs(change) < 2) return { success: false, reason: "التغير أقل من العتبة المحددة" };

  const { firestore } = initializeFirebase();
  const direction = change >= 0 ? "صعود" : "هبوط";
  
  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "تنبيه حركة سعرية",
    message: `سجلت عملة ${coin} حركة ${direction} بنسبة ${Math.abs(change).toFixed(2)} في المئة. السعر الحالي هو ${price.toLocaleString()} دولار.`,
    type: "info",
    url: `/trade/${coin.toUpperCase()}USDT`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}

/**
 * وظيفة إرسال إشارة تداول (تم تحرير العتبة لدعم المحرك الذكي)
 */
export async function sendAISignalNotification(userId: string, coin: string, confidence: number, decision: string) {
  // تم إزالة التحقق من الثقة هنا لأن المحرك الخلفي (NotificationManager) يديرها ديناميكياً (20% أو 50%)
  const { firestore } = initializeFirebase();
  const typeLabel = decision === 'BUY' ? "شراء" : "بيع";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "إشارة تداول ذكية",
    message: `رصد نظام التحليل فرصة ${typeLabel} لعملة ${coin} بنسبة ثقة بلغت ${confidence} في المئة.`,
    type: "success",
    url: `/trade/${coin.toUpperCase()}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}

/**
 * وظيفة إرسال الملخص المالي اليومي
 */
export async function sendDailySummaryNotification(userId: string) {
  const { firestore } = initializeFirebase();
  const today = new Date();
  today.setHours(0,0,0,0);

  const tradesQuery = query(
    collection(firestore, "trades"),
    where("userId", "==", userId),
    where("createdAt", ">=", today.toISOString())
  );
  
  const snap = await getDocs(tradesQuery);
  const totalTrades = snap.size;
  const wins = snap.docs.filter(d => d.data().result === 'win').length;
  const totalProfit = snap.docs.reduce((sum, d) => sum + (d.data().profit || 0), 0);

  if (totalTrades === 0) return { success: false, reason: "لا يوجد نشاط اليوم" };

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "تقرير الأداء اليومي",
    message: `أتممت اليوم ${totalTrades} عمليات تداول، بنسبة نجاح بلغت ${Math.round((wins/totalTrades)*100)} في المئة. صافي الأرباح المحققة هو ${totalProfit.toFixed(2)} دولار.`,
    type: "info",
    url: "/profile",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}

/**
 * تنبيهات الأمان وتحديث البيانات
 */
export async function sendSecurityNotification(userId: string, actionType: 'pin' | 'password' | 'login') {
  const { firestore } = initializeFirebase();
  let message = "";
  
  if (actionType === 'login') message = "تم تسجيل دخول جديد لحسابك من جهاز غير معروف.";
  else if (actionType === 'pin') message = "تم تحديث رمز التعريف الشخصي الخاص بالخزنة بنجاح.";
  else message = "تم تغيير كلمة المرور الخاصة بحسابك.";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "تنبيه أمني",
    message,
    type: "warning",
    url: "/settings",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}
