
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

/**
 * @fileOverview محرك الاستهداف السلوكي المطور v5.0 - Institutional Segmentation Matrix
 * نظام متطور يصنف المستخدمين لـ 24 فئة استراتيجية ويبث تنبيهات مخصصة لزيادة التفاعل.
 * يلتزم بقواعد التوقيت (Max 3/Day) والساعات الصامتة (12AM - 8AM).
 */

export async function checkAndSendAutomatedNotifications(userId: string) {
  try {
    const { firestore } = initializeFirebase();
    const now = new Date();
    const currentHour = now.getHours();

    // 1. بروتوكول الساعات الصامتة (Silent Hours: 12 AM - 8 AM)
    if (currentHour >= 0 && currentHour < 8) return;

    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;
    const user = userSnap.data();

    // 2. التحقق من سقف الإشعارات اليومي (Max 3/Day)
    const todayStart = new Date(now.setHours(0,0,0,0)).toISOString();
    const dailyCountQuery = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("isAutomated", "==", true),
      where("createdAt", ">=", todayStart)
    );
    const dailyCountSnap = await getDocs(dailyCountQuery);
    if (dailyCountSnap.size >= 3) return;

    // 3. جمع البيانات العميقة للتحليل السلوكي
    const [tradesSnap, transfersSnap] = await Promise.all([
      getDocs(query(collection(firestore, "trades"), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(10))),
      getDocs(query(collection(firestore, "internal_transfers"), where("fromUserId", "==", userId), limit(1)))
    ]);

    const trades = tradesSnap.docs.map(d => d.data());
    const hasTrades = trades.length > 0;
    const hasTransfers = !transfersSnap.empty;
    const createdAt = new Date(user.createdAt);
    const lastActive = user.lastActive ? new Date(user.lastActive) : createdAt;
    const daysSinceSignup = (Date.now() - createdAt.getTime()) / (1000 * 3600 * 24);
    const daysSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 3600 * 24);
    const totalBalance = user.totalBalance || 0;

    let title = "";
    let message = "";
    let url = "/home";
    let priority = "medium";

    // 4. مصفوفة التصنيف السلوكي (Dynamic Segmentation Matrix)

    // Segment 1: Inactive User
    if (daysSinceActive > 3) {
      title = "السوق يتحرك";
      message = "نشاط ملحوظ في تدفقات السيولة اليوم... هل ستترك الفرص تفوتك؟";
      url = "/trade";
    }
    // Segment 2: New User (First 48h)
    else if (daysSinceSignup < 2 && !hasTrades) {
      title = "ابدأ رحلتك المالية";
      message = "حسابك جاهز تماماً الآن — تنفيذ أول صفقة أبسط مما تتخيل.";
      url = "/academy";
    }
    // Segment 3: Drop-off (Registered, No Deposit)
    else if (totalBalance <= 0 && daysSinceSignup >= 2) {
      title = "محفظتك تنتظر التشغيل";
      message = "خطوة واحدة فقط تفصلك عن تفعيل محرك النمو الخاص بك.";
      url = "/home";
    }
    // Segment 4: Funded No Trade
    else if (totalBalance > 0 && !hasTrades) {
      title = "رصيدك جاهز للنمو";
      message = "يتوفر سيولة في حسابك غير مستغلة... أول صفقة هي الخطوة الأهم.";
      url = "/trade";
    }
    // Segment 5: Active Trader
    else if (hasTrades && trades.filter(t => (Date.now() - new Date(t.createdAt).getTime()) < 86400000).length > 5) {
      title = "ذروة التقلب السعري";
      message = "السوق الآن في حالة حركة نشطة — فرصك اليوم أكبر من المعتاد.";
      url = "/trade";
    }
    // Segment 12: Whale
    else if (totalBalance > 5000) {
      title = "امتيازات كبار المستثمرين";
      message = "بصفتك شريكاً استراتيجياً، نوفر لك تحليلات NAMIX AI المتقدمة مجاناً.";
      url = "/trade";
    }
    // Segment 16: Investment User
    else if ((user.activeInvestmentsTotal || 0) > 0) {
      const profit = (user.totalProfits || 0).toFixed(2);
      title = "تحديث أداء العقود";
      message = `عقودك النشطة تسجل نمواً مستمراً. تم تحقيق $${profit} حتى الآن.`;
      url = "/my-investments";
    }
    // Segment 24: Referral User
    else if (user.referralEarnings > 0) {
      title = "نمو في شبكة الشركاء";
      message = "تم رصد نشاط جديد في شبكتك... مكافآت الصدارة بانتظار استلامك.";
      url = "/ambassador";
    }
    // Hybrid: New + Funded
    else if (daysSinceSignup < 5 && totalBalance > 50) {
      title = "بداية استراتيجية قوية";
      message = "تمتلك سيولة ممتازة للبدء... لا تترك فرص التداول اليوم تمر دون تجربة.";
      url = "/trade";
    }
    else {
      // General Professional Tip
      title = "نصيحة ناميكس اليوم";
      message = "تنويع العقود بين قصيرة وطويلة الأمد يضمن لك استقراراً مالياً نخبويًا.";
      url = "/guidance";
    }

    // 5. تنفيذ عملية البث المسجل (سيقوم محرك الـ Push بالتقاطه)
    if (title && message) {
      await addDoc(collection(firestore, "notifications"), {
        userId,
        title,
        message,
        type: priority === 'high' ? 'warning' : 'info',
        url,
        isRead: false,
        isAutomated: true,
        createdAt: new Date().toISOString()
      });
    }

  } catch (e) {
    console.error("Behavioral Scan Error:", e);
  }
}
