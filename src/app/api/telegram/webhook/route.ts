
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateMainKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX NEXUS GATEWAY v18.0
 * محرك البث والوصول المباشر - يلغي كافة حواجز الدخول التقليدية.
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
    const text = (update.message.text || "").trim();

    // تسجيل chatId في قائمة المشتركين لضمان وصول إشارات التداول للجميع فوراً
    await setDoc(doc(firestore, "bot_subscribers", chatId), {
      chatId,
      lastInteraction: new Date().toISOString()
    }, { merge: true });

    // معالجة أمر البدء العام - عرض لوحة التحكم مباشرة دون أسئلة
    if (text.startsWith('/start')) {
      await sendTelegramMessage(botToken, chatId, 
        `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك النخبوية لإدارة الأصول الرقمية والتداول الذكي. يرجى استخدام لوحة التحكم أدناه للوصول الفوري لكافة الخدمات.`, 
        generateMainKeyboard(baseUrl)
      );
    } else {
      // رد تلقائي ذكي يحافظ على بقاء لوحة التحكم
      await sendTelegramMessage(botToken, chatId, 
        `<b>مركز العمليات الموحد 🛡️</b>\n\nيمكنك دائماً استخدام الأزرار أدناه للانتقال السريع بين الأسواق والمحفظة.`,
        generateMainKeyboard(baseUrl)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Critical Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
