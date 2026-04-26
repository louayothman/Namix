
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview محرك الاستهداف السلوكي المطور v3.0 - 20 Behavioral Categories
 * يقوم بتحليل دقيق لحالة المستثمر وتوليد تنبيهات موجهة لتعزيز التفاعل.
 * تم تطهير اللغة تماماً من المصطلحات العسكرية.
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
    
    // منع تكرار الإرسال الآلي (تنبيه واحد كل 12 ساعة كحد أقصى لضمان عدم الإزعاج)
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

    // --- مصفوفة الاستهداف الذكي (20 فئة استراتيجية) ---
    
    // 1. ترحيب المستثمر الجديد
    if (daysSinceSignup < 1) {
      title = "مرحباً بك في ناميكس";
      message = "اكتشف كيف يولد نظامنا أرباحاً استثنائية عبر مختبر العقود الذكي.";
      url = "/academy";
    } 
    // 2. مسجل ولم يقم بالإيداع بعد (بعد 48 ساعة)
    else if (daysSinceSignup >= 2 && (user.totalBalance || 0) <= 0) {
      title = "ابدأ رحلتك المالية";
      message = "محفظتك جاهزة حالياً. قم بشحن رصيدك لتفعيل أول عقد استثماري لك.";
      url = "/home";
    }
    // 3. رصيد متوفر بدون استثمار نشط
    else if ((user.totalBalance || 0) > 10 && (user.activeInvestmentsTotal || 0) === 0) {
      title = "فرصة نمو معطلة";
      message = "يتوفر رصيد في حسابك غير مستغل. تفعيل العقود يضمن لك عوائد دورية منتظمة.";
      url = "/invest";
    }
    // 4. مستخدم خامل لمدة أسبوع
    else if (daysSinceActive >= 7 && daysSinceActive < 30) {
      title = "تحديثات السوق بانتظارك";
      message = "تتوفر فرص تداول جديدة اليوم. عاين التحليلات الفنية المحدثة في غرفة التداول.";
      url = "/trade";
    }
    // 5. غياب طويل (30 يوم) - تذكير أمني
    else if (daysSinceActive >= 30) {
      title = "اشتقنا لتواجدك معنا";
      message = "نحيطك علماً بوجود تحديثات أمنية هامة تتطلب تسجيل دخولك لتأمين الحساب.";
      url = "/login";
    }
    // 6. رصيد مرتفع بدون حماية (لا يوجد PIN)
    else if ((user.totalBalance || 0) > 100 && !user.securityPin) {
      title = "تأمين المحفظة الجارية";
      message = "لحماية أصولك، يرجى تعيين رمز PIN الخاص بالخزنة في أقرب وقت.";
      url = "/settings";
    }
    // 7. هوية غير موثقة (KYC)
    else if (!user.isVerified) {
      title = "توثيق الهوية الرقمية";
      message = "توثيق هويتك يمنحك صلاحيات كاملة وسحوبات أسرع للأرباح المحققة.";
      url = "/settings";
    }
    // 8. أرباح شركاء معلقة
    else if (user.referralEarnings > 0 && daysSinceActive > 3) {
      title = "نشاط في شبكة شركائك";
      message = "تتوفر أرباح ناتجة عن نشاط شبكتك. راجع سجل العمولات الآن.";
      url = "/ambassador";
    }
    // 9. كبار المستثمرين (Whales) - أدوات حصرية
    else if ((user.totalBalance || 0) > 5000) {
      title = "مزايا كبار المستثمرين";
      message = "بصفتك مستثمراً متميزاً، نوفر لك أدوات تحليلية متقدمة في واجهة التداول.";
      url = "/trade";
    }
    // 10. تحفيز تنوع المحفظة
    else if ((user.activeInvestmentsTotal || 0) > 0 && (user.activeInvestmentsTotal || 0) < 500) {
      title = "عزز نمو أصولك";
      message = "توزيع استثماراتك على أكثر من عقد يقلل المخاطر ويزيد استقرار العائد الإجمالي.";
      url = "/invest";
    }
    else {
      // فئات إضافية (11-20) تعتمد على التنوع المعرفي والأمني
      const extraCategories = [
        { t: "دروس تعليمية جديدة", m: "أضفنا محتوى جديداً حول فهم اتجاهات السوق في الأكاديمية.", u: "/academy" },
        { t: "تذكير بسلامة الحساب", m: "ننصح بتغيير كلمة المرور بشكل دوري لضمان أقصى درجات الحماية.", u: "/settings" },
        { t: "تحسينات في الأداء", m: "تم رفع سرعة معالجة الأوامر في المنصة لتجربة تداول أسرع.", u: "/trade" },
        { t: "بوصلة التوجيه", m: "استخدم بوصلة التوجيه لتحديد أهدافك المالية ورسم مسار نموك.", u: "/guidance" },
        { t: "فريق الدعم متاح", m: "فريقنا متواجد دائماً للإجابة على أي استفسار يخص محفظتك.", u: "/faq" },
        { t: "سوق العملات المشفرة", m: "عملة البيتكوين تشهد تحركات مثيرة؛ عاين التحليل الفني الآن.", u: "/trade" },
        { t: "إدارة السيولة السريعة", m: "نظام التحويل الداخلي يتيح لك إرسال المبالغ لأصدقائك فوراً.", u: "/withdraw" },
        { t: "إنجازات الرتب", m: "أنت قريب من بلوغ الرتبة التالية؛ حقق الشروط واحصل على جائزتك.", u: "/home" },
        { t: "تنوع قنوات الاستثمار", m: "تفعيل عقود بمدد زمنية مختلفة يضمن لك تدفقاً نقدياً مستمراً.", u: "/invest" },
        { t: "إشعارات النظام", m: "تأكد من بقاء التنبيهات مفعلة لاستلام إشارات التداول اللحظية.", u: "/settings" }
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
