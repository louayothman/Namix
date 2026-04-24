
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview نظام التنبيهات المتقدم v8.0 - Comprehensive Push Matrix
 * تم تحديث اللغة لتكون رسمية تماماً ودعم كافة فئات الإشعارات المطلوبة.
 */

/**
 * إرسال تنبيه حركة سعرية مفاجئة (تقلب السوق)
 */
export async function sendPriceDeviationNotification(userId: string, coin: string, price: number, change: number) {
  if (Math.abs(change) < 2) return { success: false };

  const { firestore } = initializeFirebase();
  const direction = change >= 0 ? "صعود" : "هبوط";
  
  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "تنبيه تقلب السوق",
    message: `سجلت عملة ${coin} حركة ${direction} حادة بنسبة ${Math.abs(change).toFixed(2)}%. السعر الحالي: $${price.toLocaleString()}.`,
    type: "info",
    url: `/trade/${coin.toUpperCase()}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}

/**
 * إرسال إشارة تداول ذكية
 */
export async function sendAISignalNotification(userId: string, coin: string, confidence: number, decision: string) {
  const { firestore } = initializeFirebase();
  const typeLabel = decision === 'BUY' ? "شراء" : "بيع";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "إشارة تداول ذكية",
    message: `رصد محرك NAMIX AI فرصة ${typeLabel} لعملة ${coin} بنسبة ثقة %${confidence}.`,
    type: "success",
    url: `/trade/${coin.toUpperCase()}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}

/**
 * إرسال ملخص الأداء المالي
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

  if (totalTrades === 0) return { success: false };

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "ملخص النشاط اليومي",
    message: `أتممت اليوم ${totalTrades} عمليات، بنسبة نجاح %${Math.round((wins/totalTrades)*100)}. صافي الأرباح: $${totalProfit.toFixed(2)}.`,
    type: "info",
    url: "/profile",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}

/**
 * تنبيهات الأمان والوصول
 */
export async function sendSecurityNotification(userId: string, actionType: 'pin' | 'password' | 'login' | 'device') {
  const { firestore } = initializeFirebase();
  let message = "";
  
  if (actionType === 'login') message = "تم رصد تسجيل دخول جديد لحسابك.";
  else if (actionType === 'device') message = "تم ربط جهاز جديد بهويتك الرقمية.";
  else if (actionType === 'pin') message = "تم تحديث رمز PIN الخاص بالخزنة بنجاح.";
  else message = "تم تغيير كلمة المرور الخاصة بحسابك.";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "تنبيه أمني هام",
    message,
    type: "warning",
    url: "/settings",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}

/**
 * إشعارات انتهاء الخطط وتوزيع الأرباح
 */
export async function sendInvestmentExpiryNotification(userId: string, planTitle: string, amount: number) {
  const { firestore } = initializeFirebase();
  
  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "اكتمال دورة الاستثمار",
    message: `انتهت مدة عقد ${planTitle} بنجاح. تم تحرير مبلغ $${amount.toLocaleString()} إلى محفظتك الجارية.`,
    type: "success",
    url: "/my-investments",
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return { success: true };
}
