
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX TELEGRAM WEBHOOK HANDLER v1.2
 * Enhanced with registration flows, multi-portal access, and account management.
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
    // نحصل على الرابط الأساسي من البيئة أو نفترض رابطاً افتراضياً
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://namix.pro';

    // 1. البحث عن المستخدم المرتبط بهذا الـ Chat ID
    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const linkedUser = !userSnap.empty ? userSnap.docs[0].data() : null;

    // 2. معالجة أمر البداية والربط
    if (text.startsWith('/start')) {
      const linkToken = text.split(' ')[1];
      
      // حالة الربط اليدوي عبر توكن مؤقت
      if (linkToken) {
        const tokenQ = query(collection(firestore, "users"), where("tempLinkToken", "==", linkToken));
        const tokenSnap = await getDocs(tokenQ);
        
        if (!tokenSnap.empty) {
          const userDoc = tokenSnap.docs[0];
          await updateDoc(doc(firestore, "users", userDoc.id), {
            telegramChatId: chatId,
            telegramUsername: update.message.from.username || "",
            tempLinkToken: null
          });

          await sendTelegramMessage(config.botToken, chatId, 
            `<b>تم ربط الهوية الرقمية بنجاح! ✅</b>\n\nأهلاً بك يا <b>${userDoc.data().displayName}</b> في قمرة نكسوس تلغرام.\n\nأصولك الآن تحت سيطرتك الكاملة، يمكنك التداول واستلام التنبيهات اللحظية هنا.`,
            generateTelegramAppKeyboard(baseUrl)
          );
          return NextResponse.json({ ok: true });
        }
      }

      // الحالة العامة: إذا كان مرتبطاً أصلاً
      if (linkedUser) {
        await sendTelegramMessage(config.botToken, chatId, 
          `<b>مرحباً بك مجدداً في ناميكس 🛡️</b>\n\nأهلاً <b>${linkedUser.displayName}</b>، قمرة القيادة جاهزة لتنفيذ أوامرك.`,
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        // إذا كان مستخدماً جديداً تماماً
        await sendTelegramMessage(config.botToken, chatId, 
          `<b>مرحباً بك في ناميكس السيادية 🚀</b>\n\nناميكس هي المنصة الرائدة لإدارة الأصول الرقمية والتداول بالذكاء الاصطناعي.\n\nيبدو أنك غير مرتبط بنظامنا حالياً، يمكنك البدء بإنشاء حسابك أو تسجيل الدخول عبر الأزرار أدناه:`,
          generateGuestKeyboard(baseUrl)
        );
      }
      return NextResponse.json({ ok: true });
    }

    // 3. معالجة أمر الرصيد (فقط للمرتبطين)
    if (text === '/balance' || text === '💰 الرصيد') {
      if (linkedUser) {
        await sendTelegramMessage(config.botToken, chatId,
          `<b>تقرير الملاءة المالية 📊</b>\n\n👤 المستثمر: ${linkedUser.displayName}\n💰 الرصيد الجاري: $${linkedUser.totalBalance.toLocaleString()}\n📈 الأرباح المحققة: $${linkedUser.totalProfits.toLocaleString()}\n🚀 حجم التشغيل: $${linkedUser.activeInvestmentsTotal.toLocaleString()}\n\n<i>تم التحديث: ${new Date().toLocaleTimeString('ar-EG')}</i>`,
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        await sendTelegramMessage(config.botToken, chatId, "يرجى تسجيل الدخول أولاً للوصول لبياناتك المالية.", generateGuestKeyboard(baseUrl));
      }
      return NextResponse.json({ ok: true });
    }

    // 4. معالجة أي نص آخر كرسالة ترحيبية أو إرشادية
    if (linkedUser) {
      await sendTelegramMessage(config.botToken, chatId, "استخدم القائمة أدناه للوصول السريع لبوابات ناميكس:", generateTelegramAppKeyboard(baseUrl));
    } else {
      await sendTelegramMessage(config.botToken, chatId, "أهلاً بك في ناميكس. يرجى استخدام القائمة للانضمام إلينا:", generateGuestKeyboard(baseUrl));
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Nexus Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
