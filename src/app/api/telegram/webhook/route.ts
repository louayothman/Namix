
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteField } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX NEXUS SMART GATEWAY v16.0
 * محرك الربط اللحظي الموحد - تم حذف إشارات بوابة الساحة.
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
          generateTelegramAppKeyboard(baseUrl)
        );
        return NextResponse.json({ ok: true });
      }
    }

    // 2. التحقق من وجود حساب مربوط مسبقاً
    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? userSnap.docs[0].data() : null;

    if (text === '/start') {
      if (user) {
        await sendTelegramMessage(botToken, chatId, 
          `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nأهلاً <b>${user.displayName}</b>، محفظتك الاستراتيجية تحت الإدارة الاحترافية الموحدة.`, 
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        await sendTelegramMessage(botToken, chatId, 
          `<b>مرحباً بك في ناميكس نكسوس المطور 💎</b>\n\nبوابتك النخبوية لإدارة الأصول الرقمية والتداول الذكي. يرجى المتابعة لتوثيق دخولك عبر التطبيق المصغر.`, 
          generateGuestKeyboard(baseUrl)
        );
      }
    } else {
      // الرد التلقائي لتذكير المستخدم بلوحة التحكم
      await sendTelegramMessage(botToken, chatId, 
        `<b>نظام التشغيل الموحد 🛡️</b>\n\nيرجى استخدام الأزرار أدناه للوصول السريع إلى مختبر العقود والأسواق الحية.`,
        user ? generateTelegramAppKeyboard(baseUrl) : generateGuestKeyboard(baseUrl)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Critical Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
