
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteField, setDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateMainKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX NEXUS SMART GATEWAY v17.0
 * محرك الربط والتسجيل اللحظي - يسجل كافة المستخدمين في قائمة البث العام.
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

    // تسجيل chatId في قائمة المشتركين لضمان وصول الإشارات للجميع
    await setDoc(doc(firestore, "bot_subscribers", chatId), {
      chatId,
      lastInteraction: new Date().toISOString()
    }, { merge: true });

    // 1. بروتوكول الربط اللحظي (Instant Linking via Token)
    if (text.startsWith('/start ')) {
      const linkToken = text.split(' ')[1];
      const userQ = query(collection(firestore, "users"), where("tempLinkToken", "==", linkToken));
      const userSnap = await getDocs(userQ);

      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        await updateDoc(doc(firestore, "users", userDoc.id), {
          telegramChatId: chatId,
          tempLinkToken: deleteField(),
          updatedAt: new Date().toISOString()
        });

        await sendTelegramMessage(botToken, chatId, 
          `<b>✅ تم تفعيل الربط الاحترافي!</b>\n\nأهلاً بك يا <b>${userDoc.data().displayName}</b> في مركز ناميكس المتقدم.\n\n<i>محرك العمليات الخاص بك نشط وجاهز الآن.</i>`,
          generateMainKeyboard(baseUrl)
        );
        return NextResponse.json({ ok: true });
      }
    }

    // 2. معالجة أمر البدء العام
    if (text === '/start') {
      await sendTelegramMessage(botToken, chatId, 
        `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك النخبوية لإدارة الأصول الرقمية والتداول الذكي. يرجى استخدام الأزرار أدناه للوصول السريع إلى خدماتنا.`, 
        generateMainKeyboard(baseUrl)
      );
    } else {
      // رد تلقائي ذكي
      await sendTelegramMessage(botToken, chatId, 
        `<b>نظام التشغيل الموحد 🛡️</b>\n\nيرجى استخدام لوحة التحكم للوصول السريع إلى مختبر العقود والأسواق الحية.`,
        generateMainKeyboard(baseUrl)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Critical Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
