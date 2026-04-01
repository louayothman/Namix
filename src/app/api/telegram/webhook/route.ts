
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';

/**
 * @fileOverview NAMIX TELEGRAM WEBHOOK HANDLER v1.5
 * المطور لمعالجة الضيوف، إنشاء الحسابات، والربط التلقائي.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    
    // التحقق من وجود رسالة نصية
    if (!update.message || !update.message.text) {
      return NextResponse.json({ ok: true });
    }

    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();

    // إذا لم يتم تهيئة التوكن في الإعدادات، لا نفعل شيئاً
    if (!config || !config.botToken) {
      return NextResponse.json({ ok: true });
    }

    const chatId = update.message.chat.id.toString();
    const text = update.message.text;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://namix.pro');

    // 1. البحث عن مستخدم مرتبط بهذا الـ Chat ID
    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const linkedUser = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    // 2. معالجة أمر البداية والربط (/start)
    if (text.startsWith('/start')) {
      const parts = text.split(' ');
      const linkToken = parts.length > 1 ? parts[1] : null;
      
      // حالة الربط عبر توكن مؤقت (Existing User Linking)
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

      // الحالة العامة: إذا كان المستخدم مرتبطاً بالفعل
      if (linkedUser) {
        await sendTelegramMessage(config.botToken, chatId, 
          `<b>مرحباً بك مجدداً في ناميكس 🛡️</b>\n\nأهلاً <b>${linkedUser.displayName}</b>، قمرة القيادة جاهزة لتنفيذ أوامرك.`,
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        // حالة الضيف (Guest/New User)
        await sendTelegramMessage(config.botToken, chatId, 
          `<b>مرحباً بك في ناميكس السيادية 🚀</b>\n\nناميكس هي المنصة الرائدة لإدارة الأصول الرقمية والتداول بالذكاء الاصطناعي.\n\nيبدو أنك لا تملك حساباً مرتبطاً حتى الآن. يمكنك البدء بإنشاء حسابك الاستثماري الجديد أو تسجيل الدخول فوراً عبر الأزرار أدناه:`,
          generateGuestKeyboard(baseUrl)
        );
      }
      return NextResponse.json({ ok: true });
    }

    // 3. معالجة الأوامر التفاعلية للمرتبطين
    if (linkedUser) {
      if (text === '💰 الرصيد' || text === '/balance') {
        await sendTelegramMessage(config.botToken, chatId,
          `<b>تقرير الملاءة المالية 📊</b>\n\n👤 المستثمر: ${linkedUser.displayName}\n💰 الرصيد الجاري: $${linkedUser.totalBalance.toLocaleString()}\n📈 الأرباح المحققة: $${(linkedUser.totalProfits || 0).toLocaleString()}\n🚀 حجم التشغيل: $${(linkedUser.activeInvestmentsTotal || 0).toLocaleString()}\n\n<i>تم التحديث: ${new Date().toLocaleTimeString('ar-EG')}</i>`,
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        await sendTelegramMessage(config.botToken, chatId, 
          "استخدم القائمة أدناه للوصول السريع لبوابات ناميكس أو تحديث بياناتك:", 
          generateTelegramAppKeyboard(baseUrl)
        );
      }
    } else {
      // رد افتراضي للضيوف في حال أرسلوا رسائل عشوائية
      await sendTelegramMessage(config.botToken, chatId, 
        "أهلاً بك. يرجى استخدام القائمة للانضمام لشبكة ناميكس والبدء في نمو أصولك:", 
        generateGuestKeyboard(baseUrl)
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Nexus Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
