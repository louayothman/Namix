
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview محرك الاستهداف الآلي الشامل v2.0 - 20 Category Engine
 * يقوم بتحليل دقيق لسلوك المستخدم وتصنيفه لضمان وصول التنبيه المناسب في الوقت المناسب.
 */

export async function checkAndSendAutomatedNotifications(userId: string) {
  try {
    const { firestore } = initializeFirebase();
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return;
    const user = userSnap.data();
    const now = new Date();
    const createdAt = new Date(user.createdAt);
    const lastActive = user.lastActive ? new Date(user.lastActive) : createdAt;
    
    const daysSinceSignup = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
    const daysSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 3600 * 24);
    
    // منع تكرار الإرسال الآلي (تنبيه واحد كل 12 ساعة كحد أقصى)
    const lastNotifQuery = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("isAutomated", "==", true),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const lastNotifSnap = await getDocs(lastNotifQuery);
    if (!lastNotifSnap.empty) {
      const lastSent = new Date(lastNotifSnap.docs[0].data().createdAt);
      if ((now.getTime() - lastSent.getTime()) < (1000 * 3600 * 12)) return;
    }

    let title = "";
    let message = "";
    let type = "info";
    let url = "/home";

    // منطق التصنيف الذكي لـ 20 فئة استراتيجية
    
    // 1. مستخدم جديد جداً (أقل من يوم)
    if (daysSinceSignup < 1) {
      title = "مرحباً بك في عالم ناميكس";
      message = "اكتشف كيف تولد أموالك أرباحاً استثنائية عبر مختبر العقود الذكي.";
      url = "/academy";
    } 
    // 2. مسجل وغير مودع (بعد يومين)
    else if (daysSinceSignup >= 2 && (user.totalBalance || 0) <= 0) {
      title = "ابدأ رحلتك الاستثمارية";
      message = "محفظتك جاهزة حالياً. قم بالإيداع الآن لتفعيل أول عقد استثماري لك.";
      url = "/home";
    }
    // 3. لديه رصيد ولم يستثمر
    else if ((user.totalBalance || 0) > 10 && (user.activeInvestmentsTotal || 0) === 0) {
      title = "فرصة نمو معطلة";
      message = "يتوفر رصيد في حسابك غير مستغل. تفعيل العقود يضمن لك عوائد دورية.";
      url = "/invest";
    }
    // 4. خامل لمدة 7 أيام
    else if (daysSinceActive >= 7 && daysSinceActive < 30) {
      title = "تحديثات السوق بانتظارك";
      message = "تتوفر فرص تداول جديدة اليوم. عد للمنصة لمعاينة تحليلات NAMIX AI.";
      url = "/trade";
    }
    // 5. مستخدم خامل جداً (30 يوم)
    else if (daysSinceActive >= 30) {
      title = "اشتقنا لتواجدك معنا";
      message = "نحيطك علماً بوجود تحديثات أمنية هامة تتطلب تسجيل دخولك لتأمين الحساب.";
      url = "/login";
    }
    // 6. رصيد مرتفع بدون حماية (لا يوجد PIN)
    else if ((user.totalBalance || 0) > 100 && !user.securityPin) {
      title = "تعزيز أمان المحفظة";
      message = "لحماية أصولك، يرجى تعيين رمز PIN الخاص بالخزنة في أقرب وقت.";
      url = "/settings";
    }
    // 7. مستخدم غير موثق الهوية
    else if (!user.isVerified) {
      title = "إكمال توثيق الحساب";
      message = "توثيق هويتك يمنحك صلاحيات كاملة وسحوبات أسرع للأرباح.";
      url = "/settings";
    }
    // 8. لديه أرباح شركاء غير مستلمة
    else if (user.referralEarnings > 0 && daysSinceActive > 3) {
      title = "نشاط في شبكة شركائك";
      message = "تتوفر أرباح ناتجة عن نشاط شبكتك. راجع سجل العمولات الآن.";
      url = "/ambassador";
    }
    // 9. كبار المستثمرين (Whales)
    else if ((user.totalBalance || 0) > 5000) {
      title = "مزايا كبار المستثمرين";
      message = "بصفتك مستثمراً متميزاً، نوفر لك أدوات تحليلية متقدمة في غرفة التداول.";
      url = "/trade";
    }
    // 10. مستخدم نشط (تحفيز)
    else if ((user.activeInvestmentsTotal || 0) > 0) {
      title = "استمر في النمو";
      message = "توزيع استثماراتك على أكثر من عقد يقلل المخاطر ويزيد استقرار العائد.";
      url = "/invest";
    }
    else {
      // فئات إضافية (11-20) تعتمد على التنوع
      const extraCategories = [
        { t: "أكاديمية التداول", m: "تتوفر دروس جديدة حول فهم اتجاهات السوق في الأكاديمية.", u: "/academy" },
        { t: "تذكير أمني", m: "ننصح بتغيير كلمة المرور بشكل دوري لضمان أقصى درجات الحماية.", u: "/settings" },
        { t: "فرص تقنية", m: "تم تحسين سرعة تنفيذ الأوامر في المنصة لتجربة تداول أسرع.", u: "/trade" },
        { t: "بوصلة التوجيه", m: "استخدم بوصلة التوجيه لتحديد أهدافك المالية وهندسة مسارك.", u: "/guidance" },
        { t: "دعم فني متاح", m: "فريقنا متواجد دائماً للإجابة على أي استفسار يخص حسابك.", u: "/faq" },
        { t: "سوق العملات", m: "عملة البيتكوين تشهد تحركات مثيرة؛ عاين التحليل الآن.", u: "/trade/BTCUSDT" },
        { t: "إدارة السيولة", m: "نظام التحويل الداخلي يتيح لك إرسال المبالغ لأصدقائك فوراً.", u: "/withdraw/internal" },
        { t: "إنجازات الرتب", m: "أنت قريب من بلوغ الرتبة التالية؛ حقق الشروط واحصل على الجائزة.", u: "/home" },
        { t: "تنوع المحفظة", m: "تفعيل عقود بمدد زمنية مختلفة يضمن لك تدفقاً نقدياً مستمراً.", u: "/invest" },
        { t: "نبض ناميكس", m: "تأكد من بقاء الإشعارات مفعلة لاستلام إشارات NAMIX AI فوراً.", u: "/settings" }
      ];
      const randomExtra = extraCategories[Math.floor(Math.random() * extraCategories.length)];
      title = randomExtra.t;
      message = randomExtra.m;
      url = randomExtra.u;
    }

    if (title && message) {
      await addDoc(collection(firestore, "notifications"), {
        userId,
        title,
        message,
        type,
        url,
        isRead: false,
        isAutomated: true,
        createdAt: now.toISOString()
      });
    }

  } catch (e) {
    console.error("Engagement Scan Error:", e);
  }
}
