
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { sendTelegramMessage, generateMainKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX NEXUS GATEWAY v19.0
 * محرك البث والوصول المباشر مع دعم أوامر الرصيد والمساعدة.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const { firestore } = initializeFirebase();
    
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });
    
    const botToken = config.botToken;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

    if (!update.message || !update.message.chat) return NextResponse.json({ ok: true });
    const chatId = update.message.chat.id.toString();
    const text = (update.message.text || "").trim().toLowerCase();

    // تسجيل chatId في قائمة المشتركين لضمان وصول الإشارات للجميع
    await setDoc(doc(firestore, "bot_subscribers", chatId), {
      chatId,
      lastInteraction: new Date().toISOString()
    }, { merge: true });

    // معالجة الأوامر المباشرة
    if (text.startsWith('/start')) {
      await sendTelegramMessage(botToken, chatId, 
        `<b>Welcome to Namix Nexus 🚀 مرحباً بك في ناميكس</b>\n\nYour gateway to elite asset management and AI trading.\nبوابتك النخبوية لإدارة الأصول والتداول الذكي.\n\n<i>Use the control panel below. استعمل لوحة التحكم أدناه.</i>`, 
        generateMainKeyboard(baseUrl)
      );
    } 
    else if (text === '/balance' || text === '📊 الرصيد') {
      // البحث عن مستخدم مرتبط بهذا الـ chatId
      const q = query(collection(firestore, "users"), where("telegramChatId", "==", chatId), limit(1));
      const userSnap = await getDocs(q);
      
      if (!userSnap.empty) {
        const u = userSnap.docs[0].data();
        await sendTelegramMessage(botToken, chatId, 
          `<b>📊 Identity Snapshot / ملخص الهوية</b>\n\nInvestor: <b>${u.displayName}</b>\nBalance: <b>$${u.totalBalance?.toLocaleString()}</b>\nActive Yield: <b>$${u.totalProfits?.toLocaleString()}</b>\n\n<i>Synced via Namix Secure Node.</i>`
        );
      } else {
        await sendTelegramMessage(botToken, chatId, 
          `<b>⚠️ Access Pending / المزامنة مطلوبة</b>\n\nYour account is not synced yet. Open the app to sync automatically.\nحسابك غير مزامنه حالياً. افتح التطبيق المصغر ليتم الربط صامتاً.`,
          generateMainKeyboard(baseUrl)
        );
      }
    }
    else if (text === '/help' || text === '❓ مساعدة') {
      await sendTelegramMessage(botToken, chatId, 
        `<b>📚 Support Guide / دليل المساعدة</b>\n\n1. <b>Signals:</b> Received automatically every 2 mins.\n2. <b>Trading:</b> Click Execute to open Mini App.\n3. <b>Security:</b> Ensure your Vault PIN is active.\n\n<i>Direct human support available in the app.</i>`,
        generateMainKeyboard(baseUrl)
      );
    }
    else {
      // رد تلقائي ذكي يحافظ على بقاء لوحة التحكم
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
