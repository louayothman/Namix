
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { sendTelegramMessage, generateMainKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX NEXUS GATEWAY v22.0 - Precision Multi-Channel Bridge
 * محرك البوابة السيادي - تم تحسين الاستجابة للرصيد ونظام الاشتراك التلقائي.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const { firestore } = initializeFirebase();
    
    // 1. جلب إعدادات البوت
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });
    
    const botToken = config.botToken;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

    if (!update.message || !update.message.chat) return NextResponse.json({ ok: true });
    
    const chatId = update.message.chat.id.toString();
    const rawText = update.message.text || "";
    const text = rawText.trim();

    // 2. تسجيل المشترك تلقائياً في قناة البث المستقلة (Omni-Channel Lead Capture)
    // هذا يضمن وصول الإشارات والنتائج للجميع بغض النظر عن حالة تسجيل الدخول.
    await setDoc(doc(firestore, "bot_subscribers", chatId), {
      chatId,
      lastInteraction: new Date().toISOString(),
      isActive: true
    }, { merge: true });

    // 3. محرك معالجة الأوامر المطور (Nexus Routing Engine)
    
    // أمر البدء
    if (text.startsWith('/start')) {
      await sendTelegramMessage(botToken, chatId, 
        `<b>Welcome to Namix Nexus 🚀 مرحباً بك في ناميكس</b>\n\nElite Digital Asset Management Protocol.\nبوابتك النخبوية لإدارة الأصول والتداول الذكي.\n\n<i>Use the control panel below. استعمل لوحة التحكم أدناه.</i>`, 
        generateMainKeyboard(baseUrl)
      );
    } 
    // أمر الرصيد - تم تحسين البحث عن المستخدم المرتبط بمعرف تلغرام
    else if (text.includes('الرصيد') || text.includes('Balance')) {
      // البحث عن المستثمر الذي يملك حقل telegramChatId مطابق
      const q = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(q);
      
      if (!userSnap.empty) {
        const u = userSnap.docs[0].data();
        await sendTelegramMessage(botToken, chatId, 
          `<b>📊 Identity Snapshot / ملخص الهوية</b>\n\nInvestor: <b>${u.displayName}</b>\nBalance: <b>$${u.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>\nActive Yield: <b>$${u.totalProfits?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>\n\n<i>Live Data Synced via Namix Secure Node.</i>`,
          generateMainKeyboard(baseUrl)
        );
      } else {
        await sendTelegramMessage(botToken, chatId, 
          `<b>⚠️ Sync Required / المزامنة مطلوبة</b>\n\nOpen the app to link your financial identity.\nافتح التطبيق المصغر ليتم ربط هويتك المالية بصمت تلقائياً.`,
          generateMainKeyboard(baseUrl)
        );
      }
    }
    // أمر المساعدة
    else if (text.includes('مساعدة') || text.includes('Help')) {
      await sendTelegramMessage(botToken, chatId, 
        `<b>📚 Support Guide / دليل المساعدة</b>\n\n1. <b>Signals:</b> Received automatically every 2 mins.\n2. <b>Trading:</b> Click Execute to open Mini App.\n3. <b>Yield:</b> Join Contract Lab for automated growth.\n\n<i>Direct human support available inside the app.</i>`,
        generateMainKeyboard(baseUrl)
      );
    }
    // الرد الافتراضي الذكي
    else {
      await sendTelegramMessage(botToken, chatId, 
        `<b>Nexus Command Center / مركز العمليات</b>\n\nExplore markets and manage your portfolio below.\nاستكشف الأسواق وأدر محفظتك عبر الأزرار أدناه.`,
        generateMainKeyboard(baseUrl)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Critical Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
