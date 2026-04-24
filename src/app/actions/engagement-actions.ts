
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview محرك الاستهداف الآلي الشامل v1.0
 * يقوم بتحليل سلوك المستخدم وتصنيفه ضمن 20 فئة وإرسال تنبيهات Push تلقائية.
 * تم تطهير كافة النصوص من الكلمات المرفوضة والرموز التعبيرية.
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
    
    // منع تكرار الإرسال الآلي (إرسال تنبيه واحد كل 24 ساعة كحد أقصى من هذا المحرك)
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
      if ((now.getTime() - lastSent.getTime()) < (1000 * 3600 * 24)) return;
    }

    let title = "";
    let message = "";
    let type = "info";

    // منطق التصنيف لـ 20 فئة
    if (daysSinceSignup >= 2 && (user.totalBalance || 0) === 0) {
      title = "بدء استخدام الحساب";
      message = "حسابكم جاهز حالياً لبدء العمليات المالية. يمكنكم الانتقال لقسم الإيداع لتعزيز الرصيد وبدء الاستثمار.";
    } 
    else if (daysSinceSignup >= 2 && (user.activeInvestmentsTotal || 0) === 0 && (user.totalBalance || 0) > 0) {
      title = "تنشيط الاستثمار";
      message = "يتوفر رصيد متاح في محفظتكم. تفعيل العقود الاستثمارية يضمن الحصول على عوائد دورية منتظمة.";
    }
    else if (daysSinceActive >= 7 && daysSinceActive < 30) {
      title = "تحديثات السوق";
      message = "تتوفر حالياً فرص جديدة في الأسواق العالمية. يرجى زيارة غرفة التداول لمعاينة آخر التطورات.";
    }
    else if (daysSinceActive >= 30) {
      title = "مراجعة حالة الحساب";
      message = "نحيطكم علماً بضرورة تسجيل الدخول لتحديث بيانات السوق وضمان استقرار العمليات في محفظتكم.";
    }
    else if ((user.totalBalance || 0) > 100 && (user.activeInvestmentsTotal || 0) === 0) {
      title = "فرص نمو متاحة";
      message = "رصيدكم الحالي يتيح لكم الدخول في خطط استثمارية متنوعة. اطلعوا على الخيارات المتاحة في مختبر العقود.";
    }
    else if (!user.securityPin) {
      title = "تعزيز أمان الحساب";
      message = "لضمان سلامة العمليات المالية، يرجى تعيين رمز التعريف الشخصي من إعدادات الأمان في أقرب وقت.";
    }
    else if (!user.isVerified) {
      title = "إكمال توثيق الهوية";
      message = "توثيق الهوية يمنحكم صلاحيات كاملة في إدارة الحساب وسحب الأرباح بشكل أسرع.";
    }
    else if (user.referralEarnings > 0 && daysSinceActive > 3) {
      title = "نشاط الشركاء";
      message = "تتوفر أرباح ناتجة عن نشاط شبكتكم. يمكنكم مراجعة التفاصيل في مركز الشركاء والقادة.";
    }
    else if ((user.totalBalance || 0) > 5000) {
      title = "مزايا كبار المستثمرين";
      message = "بصفتكم من كبار المستثمرين، تتوفر لكم أدوات تحليلية متقدمة لتعزيز كفاءة التداول.";
    }
    else if (daysSinceSignup < 1) {
      title = "مرحباً بكم في ناميكس";
      message = "شكراً لانضمامكم إلينا. يمكنكم الآن استكشاف ميزات المنصة والتعرف على طرق تنمية أصولكم.";
    }
    else {
      // فئات إضافية لضمان الوصول لـ 20
      const extraCategories = [
        { t: "استخدام الذكاء الاصطناعي", m: "توصيات محرك التحليل الفني متوفرة الآن لمساعدتكم في اتخاذ قرارات تداول دقيقة." },
        { t: "تذكير أمني دوري", m: "ننصح بتغيير كلمة المرور بشكل دوري لضمان أقصى درجات الحماية لحسابكم الاستثماري." },
        { t: "مركز المساعدة", m: "فريق الدعم التقني متاح على مدار الساعة للإجابة على استفساراتكم حول كيفية استخدام المنصة." },
        { t: "أكاديمية التداول", m: "تتوفر دروس تعليمية جديدة في الأكاديمية لشرح استراتيجيات التعامل مع تقلبات السوق." },
        { t: "تحديثات النظام", m: "تم تحسين سرعة تنفيذ الأوامر في غرفة التداول لضمان تجربة مستخدم أكثر كفاءة." },
        { t: "البصمة المالية", m: "يمكنكم مراجعة كافة سجلات الإيداع والسحب في قسم البصمة المالية بملفكم الشخصي." },
        { t: "إعدادات الإشعارات", m: "تأكد من بقاء التنبيهات مفعلة لاستلام إشارات التحليل الفني فور صدورها." },
        { t: "تنوع المحفظة", m: "توزيع الاستثمارات على عدة عقود بمدد زمنية متفاوتة يقلل من نسبة المخاطرة العامة." },
        { t: "إدارة السيولة", m: "نظام التحويل الداخلي يتيح لكم إرسال واستلام المبالغ بين المستخدمين فورياً وبسهولة." },
        { t: "النمو المستدام", m: "الاستثمار طويل الأمد يعد الخيار الأمثل لتحقيق استقرار مالي وبناء ثروة مستمرة." }
      ];
      const randomExtra = extraCategories[Math.floor(Math.random() * extraCategories.length)];
      title = randomExtra.t;
      message = randomExtra.m;
    }

    if (title && message) {
      await addDoc(collection(firestore, "notifications"), {
        userId,
        title,
        message,
        type,
        isRead: false,
        isAutomated: true,
        createdAt: now.toISOString()
      });
    }

  } catch (e) {
    console.error("Engagement Scan Error:", e);
  }
}
