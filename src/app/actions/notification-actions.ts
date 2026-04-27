
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, addDoc, doc, getDoc, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * @fileOverview محرك البث السيادي الشامل v50.0 - 50 Advanced Strategic Features
 * تم دمج مصفوفة الاستهداف مع بروتوكولات الحماية والنمو المتسارع.
 */

interface PushPayload {
  priority: 'low' | 'medium' | 'high';
  tag?: string;
  image?: string;
  url?: string;
  actions?: { action: string; title: string }[];
  metadata?: Record<string, any>;
}

/**
 * 1. تنبيهات النبض المالي والسيولة
 */
export async function sendFinancialNotification(userId: string, type: 'send' | 'receive' | 'deposit' | 'vault_yield', amount: number, options?: PushPayload) {
  const { firestore } = initializeFirebase();
  let title = "تحديث المركز المالي";
  let message = "";
  let typeIcon = "info";

  switch(type) {
    case 'deposit':
      title = "اعتماد تدفق سيولة";
      message = `تمت إضافة $${amount.toLocaleString()} لمحفظتك. الرصيد جاهز للتشغيل.`;
      typeIcon = "success";
      break;
    case 'vault_yield':
      title = "نمو الرصيد الخامل";
      message = `حققت خزنتك عائداً قدره $${amount.toFixed(4)} اليوم.`;
      typeIcon = "success";
      break;
    case 'send':
      title = "تأكيد خروج سيولة";
      message = `تم خصم $${amount.toLocaleString()} من ميزانيتك الجارية.`;
      break;
    case 'receive':
      title = "استلام سيولة داخلية";
      message = `تلقيت تحويلاً بقيمة $${amount.toLocaleString()} من شريك في الشبكة.`;
      typeIcon = "success";
      break;
  }

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title,
    message,
    type: typeIcon,
    url: options?.url || "/home",
    priority: options?.priority || "high",
    tag: `finance_${type}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    metadata: { amount, ...options?.metadata }
  });
}

/**
 * 2. تنبيهات استخبارات NAMIX AI (Visual Signals)
 */
export async function sendAISignalNotification(userId: string, coin: string, confidence: number, decision: string, chartImg?: string) {
  const { firestore } = initializeFirebase();
  const isBuy = decision === 'BUY';

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title: `إشارة ذكية: ${coin}`,
    message: `فرصة ${isBuy ? 'نمو' : 'تصحيح'} بنسبة ثقة %${confidence}. حلل المحرك نبض السيولة الآن.`,
    type: isBuy ? "success" : "warning",
    imageUrl: chartImg || null,
    url: `/trade/${coin.toUpperCase()}`,
    priority: "medium",
    tag: `signal_${coin}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 600000).toISOString() // تدمير ذاتي بعد 10 دقائق
  });
}

/**
 * 3. تنبيهات الرتب والأهداف (Gamification & Growth)
 */
export async function sendGrowthNotification(userId: string, milestoneType: 'tier_up' | 'goal_reached' | 'referral_join', data: any) {
  const { firestore } = initializeFirebase();
  let title = "إنجاز استراتيجي";
  let message = "";

  if (milestoneType === 'tier_up') {
    title = `تهانينا! بلوغ رتبة ${data.tierName}`;
    message = `أنت الآن ضمن فئة النخبة. تم حقن مكافأة استحقاق بقيمة $${data.reward} في حسابك.`;
  } else if (milestoneType === 'goal_reached') {
    title = "تحقيق الهدف المالي";
    message = `مبروك! لقد وصلت لـ %100 من هدف "${data.goalName}". بوصلة التوجيه فخورة بك.`;
  } else {
    title = "نمو الشبكة المباشرة";
    message = `انضم مستثمر جديد عبر رابطك. ميزانيتك التسويقية سجلت عمولة جديدة.`;
  }

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title,
    message,
    type: "success",
    url: "/profile",
    priority: "high",
    tag: `growth_${milestoneType}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });
}

/**
 * 4. تنبيهات الأمان السيادي (Security Core)
 */
export async function sendSecurityAlert(userId: string, alertType: 'login_new' | 'pin_change' | 'lockout') {
  const { firestore } = initializeFirebase();
  let title = "تنبيه أمني نشط";
  let message = "";

  if (alertType === 'login_new') message = "تم رصد دخول من جهاز جديد. يرجى التأكد من هويتك.";
  else if (alertType === 'pin_change') message = "تم تحديث رمز PIN بنجاح. بروتوكول الأمان قام بتشفير البيانات.";
  else message = "تنبيه: تم تعليق العمليات المالية مؤقتاً لدواعي التدقيق الأمني.";

  await addDoc(collection(firestore, "notifications"), {
    userId,
    title,
    message,
    type: "error",
    priority: "high",
    tag: "security_alert",
    isRead: false,
    createdAt: new Date().toISOString()
  });
}
