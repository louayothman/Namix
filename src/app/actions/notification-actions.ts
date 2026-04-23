
'use server';

/**
 * @fileOverview محرك بث التنبيهات الشامل v5.0 - Sovereign Multi-Channel Engine
 * يدير إرسال كافة أنواع إشعارات الدفع المبرمجة للمنصة.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * الوظيفة المركزية لإرسال إشعار Push (تتطلب تكوين FCM Server Key في الإنتاج)
 */
async function sendPush(token: string, title: string, body: string, url: string = '/home') {
  // ملاحظة: في بيئة Firebase Studio، نقوم بمحاكاة البث اللحظي. 
  // برمجياً، يتم استدعاء FCM v1 API باستخدام Service Account المعتمد.
  console.log(`[Push Sent to ${token}]: ${title} - ${body} (Target: ${url})`);
  return { success: true };
}

/**
 * تنبيه نبض الأسعار الدوري
 */
export async function sendPricePulseNotification(token: string, coin: string, price: number, change: number) {
  const isUp = change >= 0;
  const title = `نبض السعر: ${coin}`;
  const body = `سعر ${coin} الآن هو $${price.toLocaleString()} (${isUp ? '📈 صعود' : '📉 هبوط'} %${Math.abs(change).toFixed(2)})`;
  return await sendPush(token, title, body, `/trade/${coin.toUpperCase()}USDT`);
}

/**
 * تنبيه إشارات NAMIX AI فائقة الثقة
 */
export async function sendAISignalAlert(token: string, coin: string, confidence: number, bias: string) {
  const title = `إشارة نمو استثنائية: ${coin}`;
  const body = `رصد NAMIX AI فرصة ${bias === 'Long' ? 'شراء' : 'بيع'} مؤكدة بنسبة ثقة %${confidence}.`;
  return await sendPush(token, title, body, `/trade/${coin.toUpperCase()}`);
}

/**
 * تنبيهات التدفق المالي (إيداع/تحويل)
 */
export async function sendFinancialAlert(token: string, type: 'deposit' | 'transfer', amount: number) {
  const title = type === 'deposit' ? "تأكيد إيداع الرصيد" : "استلام تحويل مالي";
  const body = `تم إضافة مبلغ بقيمة $${amount.toLocaleString()} إلى محفظتك بنجاح.`;
  return await sendPush(token, title, body, type === 'deposit' ? '/my-deposits' : '/home');
}

/**
 * تنبيه نضوج العقود الاستثمارية
 */
export async function sendMaturationAlert(token: string, planTitle: string, totalReturn: number) {
  const title = "اكتمال دورة الاستثمار 💰";
  const body = `انتهت مدة عقد ${planTitle}. تم تحرير $${totalReturn.toLocaleString()} لمحفظتك الجارية.`;
  return await sendPush(token, title, body, '/my-investments');
}

/**
 * تنبيهات بوصلة التوجيه (الأهداف المالية)
 */
export async function sendGoalMilestoneAlert(token: string, goalName: string, progress: number) {
  const title = "اقتربت من الهدف! 🎯";
  const body = `حققت %${progress} من هدفك (${goalName}). أنت على بعد خطوة واحدة من النجاح.`;
  return await sendPush(token, title, body, '/guidance');
}

/**
 * تنبيهات الأمان السيادية
 */
export async function sendSecurityAlert(token: string, type: 'pin' | 'password' | 'login') {
  const title = "تنبيه أمني: ناميكس";
  const body = type === 'login' ? "تم تسجيل دخول جديد لحسابك." : `تم تحديث ${type === 'pin' ? 'رمز PIN' : 'كلمة المرور'} بنجاح.`;
  return await sendPush(token, title, body, '/settings');
}

/**
 * تنبيهات نظام الشركاء
 */
export async function sendAmbassadorAlert(token: string, type: 'new_referral' | 'commission', data?: any) {
  const title = type === 'new_referral' ? "شريك جديد في شبكتك" : "استلام عمولة صدارة";
  const body = type === 'new_referral' ? "انضم مستثمر جديد عبر رابط الإحالة الخاص بك." : `استلمت عمولة بقيمة $${data?.amount} من نشاط شبكتك.`;
  return await sendPush(token, title, body, '/ambassador');
}
