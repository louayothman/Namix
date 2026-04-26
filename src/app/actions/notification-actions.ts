
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview نظام التنبيهات المركزي v10.0 - Comprehensive Push Engine
 * تم عزل كافة أنواع التنبيهات المالية والأمنية والتقنية في وظائف مستقلة.
 * تم تطهير اللغة تماماً من المصطلحات المرفوضة.
 */

/**
 * 1. تنبيهات العمليات المالية (إرسال / استلام / إيداع)
 */
export async function sendFinancialNotification(userId: string, type: 'send' | 'receive' | 'deposit', amount: number, details?: string) {
  const { firestore } = initializeFirebase();
  let title = "";
  let message = "";
  let notifType = "info";

  if (type === 'send') {
    title = "تأكيد تحويل صادر";
    message = `تم تحويل مبلغ بقيمة $${amount.toLocaleString()} بنجاح. ${details || ''}`;
  } else if (type === 'receive') {
    title = "استلام حوالة مالية";
    message = `تلقيت مبلغاً بقيمة $${amount.toLocaleString()} في حسابك الجاري.`;
    notifType = "success";
  } else {
    title = "تأكيد شحن الرصيد";
    message = `تم اعتماد إيداع بقيمة $${amount.toLocaleString()} في محفظتك بنجاح.`;
    notifType = "success";
  }

  await addDoc(collection(firestore, "notifications"), {
    userId, title, message, type: notifType, isRead: false, createdAt: new Date().toISOString()
  });
}

/**
 * 2. تنبيهات العقود الاستثمارية (تفعيل / انتهاء / أرباح)
 */
export async function sendInvestmentNotification(userId: string, type: 'activate' | 'expiry' | 'profit', planTitle: string, amount: number) {
  const { firestore } = initializeFirebase();
  let title = "";
  let message = "";

  if (type === 'activate') {
    title = "تفعيل عقد استثماري";
    message = `تم بدء تشغيل عقد ${planTitle} بقيمة $${amount.toLocaleString()}.`;
  } else if (type === 'expiry') {
    title = "اكتمال دورة الاستثمار";
    message = `انتهت مدة عقد ${planTitle}. تم تحرير رأس المال والأرباح ($${amount.toLocaleString()}) لمحفظتك.`;
  } else {
    title = "إضافة أرباح دورية";
    message = `تمت إضافة أرباح بقيمة $${amount.toLocaleString()} ناتجة عن عقد ${planTitle}.`;
  }

  await addDoc(collection(firestore, "notifications"), {
    userId, title, message, type: "success", url: "/my-investments", isRead: false, createdAt: new Date().toISOString()
  });
}

/**
 * 3. تنبيهات إشارات التداول (إشارات NAMIX AI)
 */
export async function sendAISignalNotification(userId: string, coin: string, confidence: number, decision: string) {
  const { firestore } = initializeFirebase();
  const direction = decision === 'BUY' ? "شراء" : "بيع";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "إشارة تداول ذكية",
    message: `رصد محرك التحليل فرصة ${direction} لعملة ${coin} بنسبة ثقة %${confidence}.`,
    type: "success",
    url: `/trade/${coin.toUpperCase()}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });
}

/**
 * 4. تنبيهات الأمان والوصول
 */
export async function sendSecurityNotification(userId: string, actionType: 'pin' | 'password' | 'login') {
  const { firestore } = initializeFirebase();
  let title = "تنبيه أمني هام";
  let message = "";
  
  if (actionType === 'login') message = "تم رصد تسجيل دخول جديد لحسابك من جهاز غير معروف.";
  else if (actionType === 'pin') message = "تم تحديث رمز PIN الخاص بخزنتك بنجاح.";
  else message = "تم تغيير كلمة المرور الخاصة بحسابك.";

  await addDoc(collection(firestore, "notifications"), {
    userId, title, message, type: "warning", url: "/settings", isRead: false, createdAt: new Date().toISOString()
  });
}

/**
 * 5. تنبيهات تقلبات السوق المفاجئة
 */
export async function sendMarketAlertNotification(userId: string, coin: string, change: number) {
  const { firestore } = initializeFirebase();
  const direction = change >= 0 ? "صعود" : "هبوط";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: "تنبيه تقلب سعري",
    message: `شهدت عملة ${coin} حركة ${direction} حادة بنسبة ${Math.abs(change).toFixed(2)}% خلال الدقائق الماضية.`,
    type: "info",
    url: `/trade/${coin.toUpperCase()}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });
}
