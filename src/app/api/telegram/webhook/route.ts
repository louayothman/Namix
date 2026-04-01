
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteField } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX NEXUS MINI-APP GATEWAY v13.0
 * محرك الربط التلقائي والتحويل الصامت للتطبيق المصغر.
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

    // 1. بروتوكول الربط التلقائي (Automatic Linking)
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
          `<b>✅ تم تفعيل الربط الاحترافي!</b>\n\nأهلاً بك يا <b>${userDoc.data().displayName}</b> في مركز ناميكس المتقدم.\n\n<i>يمكنك الآن إدارة أصولك وتنفيذ الصفقات من لوحة التحكم أدناه.</i>`,
          generateTelegramAppKeyboard(baseUrl)
        );
        return NextResponse.json({ ok: true });
      }
    }

    // 2. معالجة البدء العادي
    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? userSnap.docs[0].data() : null;

    if (text.startsWith('/start')) {
      if (user) {
        await sendTelegramMessage(botToken, chatId, 
          `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nأهلاً <b>${user.displayName}</b>، مركز التحكم الخاص بك نشط وجاهز للعمليات اللحظية.`, 
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        await sendTelegramMessage(botToken, chatId, 
          `<b>مرحباً بك في ناميكس نكسوس المطور 💎</b>\n\nبوابتك النخبوية لإدارة الأصول الرقمية والتداول الذكي. يرجى المتابعة لتوثيق دخولك.`, 
          generateGuestKeyboard(baseUrl)
        );
      }
    } else {
      // أي رسالة أخرى تذكر المستخدم بلوحة التحكم
      await sendTelegramMessage(botToken, chatId, 
        `<b>نظام التشغيل الموحد 🛡️</b>\n\nيرجى استخدام الأزرار أدناه للوصول السريع إلى الأسواق والخدمات الاستراتيجية.`,
        user ? generateTelegramAppKeyboard(baseUrl) : generateGuestKeyboard(baseUrl)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Critical Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
