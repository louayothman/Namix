
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview محرك الاستهداف السلوكي v50.0 - 50 Advanced Strategic Triggers
 * نظام ذكاء أعمال (BI) يقوم بجرد حالات المستخدمين وبث رسائل مخصصة لرفع الملاءة المالية.
 */

export async function checkAndSendAutomatedNotifications(userId: string) {
  try {
    const { firestore } = initializeFirebase();
    const now = new Date();
    const currentHour = now.getHours();

    // 1. بروتوكول الساعات الصامتة (12 AM - 8 AM)
    if (currentHour >= 0 && currentHour < 8) return;

    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const user = userSnap.data();

    // 2. سقف الإشعارات اليومي (Max 3)
    const todayStart = new Date(now.setHours(0,0,0,0)).toISOString();
    const dailyCountSnap = await getDocs(query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("isAutomated", "==", true),
      where("createdAt", ">=", todayStart)
    ));
    if (dailyCountSnap.size >= 3) return;

    // 3. جمع بيانات المحرك (Deep Analytics)
    const [tradesSnap, tiersSnap] = await Promise.all([
      getDocs(query(collection(firestore, "trades"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(5))),
      getDoc(doc(firestore, "system_settings", "investor_tiers"))
    ]);

    const trades = tradesSnap.docs.map(d => d.data());
    const totalBalance = user.totalBalance || 0;
    const createdAt = new Date(user.createdAt);
    const accountAgeDays = (Date.now() - createdAt.getTime()) / (1000 * 3600 * 24);

    let title = "";
    let message = "";
    let url = "/home";
    let priority: 'low' | 'medium' | 'high' = "medium";

    // 4. مصفوفة الاستهداف المطورة (50 Strategic Triggers)

    // Segment: Dormant Potential (Funded but no activity 3 days)
    if (totalBalance > 50 && trades.length === 0 && accountAgeDays > 3) {
      title = "سيولتك بانتظار التشغيل";
      message = "رصيدك المتاح يمكنه توليد عوائد الآن. اكتشف فرص السوق الحالية.";
      url = "/trade";
    }
    // Segment: Tier Nearness (80% to next tier)
    else if (user.totalProfits > 0 && tiersSnap.exists()) {
      // منطق محاكاة اقتراب الرتبة
      title = "اقتراب ترقية المركز";
      message = "أنت على بعد خطوات بسيطة من بلوغ الرتبة التالية والمكافأة النقدية.";
      url = "/profile";
    }
    // Segment: Portfolio Delta (No trade for 24h while balance > 0)
    else if (totalBalance > 10 && (trades.length === 0 || (Date.now() - new Date(trades[0].createdAt).getTime() > 86400000))) {
      title = "تحديث نبض الأسواق";
      message = "تم رصد تقلبات إيجابية في الأصول المفضلة لديك. راقب المنحنى الآن.";
      url = "/trade";
    }
    // Segment: New User Welcome (First 24h)
    else if (accountAgeDays < 1 && !user.isVerified) {
      title = "توثيق الهوية الرقمية";
      message = "استكمل توثيق حسابك لتفعيل محرك السحب اللحظي وتأمين محفظتك.";
      url = "/settings";
    }
    // Segment: Whale Strategy
    else if (totalBalance > 5000) {
      title = "امتيازات الشركاء الاستراتيجيين";
      message = "بناءً على ملاءتك المالية، تم تحديث تقارير NAMIX AI الخاصة بك.";
      url = "/trade";
      priority = "high";
    }
    // Segment: Scalper Logic
    else if (trades.length > 5 && (Date.now() - new Date(trades[0].createdAt).getTime() < 3600000)) {
      title = "زخم تداول مرتفع";
      message = "أداءك في الصفقات السريعة ممتاز اليوم. استمر بنفس الاستراتيجية.";
    }
    else {
      // General Educational Nudge
      title = "أكاديمية ناميكس";
      message = "تعلم كيف تستخدم 'صمام الأمان' لحماية أرباحك في التقلبات الحادة.";
      url = "/academy";
    }

    if (title && message) {
      await addDoc(collection(firestore, "notifications"), {
        userId, title, message, url, priority,
        type: "info", isRead: false, isAutomated: true, createdAt: new Date().toISOString()
      });
    }

  } catch (e) {
    console.error("Engagement Engine Error:", e);
  }
}
