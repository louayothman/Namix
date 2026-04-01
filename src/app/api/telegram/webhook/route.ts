
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX TELEGRAM WEBHOOK HANDLER v1.0
 * Receives updates from Telegram and processes commands.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    if (!update.message) return NextResponse.json({ ok: true });

    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();

    if (!config || !config.botToken) return NextResponse.json({ ok: true });

    const chatId = update.message.chat.id.toString();
    const text = update.message.text || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://namix.pro';

    // 1. Handle START and Account Linking
    if (text.startsWith('/start')) {
      const linkToken = text.split(' ')[1];
      
      if (linkToken) {
        // Find user with this temp token
        const userQ = query(collection(firestore, "users"), where("tempLinkToken", "==", linkToken));
        const userSnap = await getDocs(userQ);
        
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0];
          await updateDoc(doc(firestore, "users", userDoc.id), {
            telegramChatId: chatId,
            telegramUsername: update.message.from.username || "",
            tempLinkToken: null
          });

          await sendTelegramMessage(config.botToken, chatId, 
            `<b>تم ربط الحساب بنجاح! ✅</b>\n\nأهلاً بك يا ${userDoc.data().displayName} في بروتوكول ناميكس تلغرام. يمكنك الآن إدارة محفظتك وتلقي الإشعارات اللحظية هنا.`,
            generateTelegramAppKeyboard(baseUrl)
          );
          return NextResponse.json({ ok: true });
        }
      }

      await sendTelegramMessage(config.botToken, chatId, 
        `<b>أهلاً بك في منصة ناميكس السيادية 🛡️</b>\n\nناميكس هي بوابتك المتطورة لإدارة الأصول الرقمية والتداول بالذكاء الاصطناعي.\n\nيرجى استخدام الزر أدناه للدخول إلى المنصة أو تسجيل حساب جديد.`,
        generateTelegramAppKeyboard(baseUrl)
      );
    }

    // 2. Handle BALANCE command
    if (text === '/balance') {
      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      
      if (!userSnap.empty) {
        const u = userSnap.docs[0].data();
        await sendTelegramMessage(config.botToken, chatId,
          `<b>تقرير الرصيد اللحظي 📊</b>\n\n👤 المستثمر: ${u.displayName}\n💰 الرصيد المتاح: $${u.totalBalance.toLocaleString()}\n📈 إجمالي الأرباح: $${u.totalProfits.toLocaleString()}\n🚀 استثمارات نشطة: $${u.activeInvestmentsTotal.toLocaleString()}`,
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        await sendTelegramMessage(config.botToken, chatId, "يرجى ربط حسابك أولاً من إعدادات الملف الشخصي في الموقع.");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
