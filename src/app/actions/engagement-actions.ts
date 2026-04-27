
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview محرك الاستهداف السلوكي v51.0 - Marketing & SEO Boost
 * تم تحديث المحرك لدعم تنبيهات "ساعات النمو" (Yield Boost) والربط مع الصفحات العامة.
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

    // 3. التحقق من "ساعات تعزيز العائد" (Yield Boost Hour)
    const globalConfig = await getDoc(doc(firestore, "system_settings", "trading_global"));
    if (globalConfig.exists() && globalConfig.data().isBoostActive) {
       await addDoc(collection(firestore, "notifications"), {
         userId,
         title: "مضاعف الأرباح نشط الآن ⚡",
         message: "بدأت 'ساعة النمو'؛ أرباح التداول مضاعفة الآن لفترة محدودة. لا تفوت الفرصة.",
         url: "/trade",
         priority: "high",
         type: "success",
         isRead: false,
         isAutomated: true,
         createdAt: new Date().toISOString()
       });
       return; // نكتفي بهذا الإشعار القوي حالياً
    }

    // 4. جمع بيانات المحرك (Deep Analytics)
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

    // 5. مصفوفة الاستهداف المطورة (SEO & Value Driven)

    // Segment: Goal Nearness (SEO Prophet Influence)
    if (user.totalProfits > 0 && totalBalance > 100) {
      title = "محرك الأهداف يحلل تقدمك";
      message = "أنت تقترب من هدفك المالي بنسبة كبيرة. اطلع على خطة الوصول النهائية.";
      url = "/guidance";
    }
    // Segment: Market Insight (AI Prophet Influence)
    else if (totalBalance > 10) {
      title = "إشارة ذكاء اصطناعي جديدة";
      message = "رصد محرك التحليل نبضاً إيجابياً في الأسواق العالمية. اطلع على التقرير العام.";
      url = "/market/BTCUSDT";
    }
    else {
      title = "أكاديمية ناميكس الحديثة";
      message = "اكتشف أحدث دروس التداول الاحترافي لتعزيز مهاراتك الفنية.";
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
