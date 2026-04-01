
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { sendWeeklyPerformanceReport } from '@/app/actions/auth-actions';

/**
 * @fileOverview NAMIX NEXUS INTERACTIVE CORE v11.0
 * محرك المحادثة النخبوي - إصلاح حلقة التكرار وخطأ 500 واستجابة الأزرار بدقة.
 */

export async function POST(req: NextRequest) {
  // نرسل رد OK فورياً لتلغرام لمنع إعادة إرسال الطلبات (Stop Retries)
  const okResponse = NextResponse.json({ ok: true });

  try {
    const update = await req.json();
    const { firestore } = initializeFirebase();
    
    // جلب إعدادات البوت
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return okResponse;
    const botToken = config.botToken;

    // 1. معالجة الأزرار الشفافة (Inline Buttons)
    if (update.callback_query) {
      const chatId = update.callback_query.message?.chat.id.toString();
      const data = update.callback_query.data;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

      if (!chatId) return okResponse;

      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

      if (!user) return okResponse;

      if (data === 'toggle_autoinvest') {
        const newVal = !user.isAutoInvestEnabled;
        await updateDoc(doc(firestore, "users", user.id), { isAutoInvestEnabled: newVal });
        await sendTelegramMessage(botToken, chatId, `<b>${newVal ? '✅ تم تفعيل' : '⚠️ تم تعطيل'} محرك النمو التلقائي</b>\n\nسيتم استثمار الأرباح آلياً لتعظيم العائد الاستراتيجي.`);
      }

      if (data === 'manage_pin') {
        await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_pin_new' });
        await sendTelegramMessage(botToken, chatId, "<b>🔐 بروتوكول حماية المحفظة</b>\n\nيرجى إرسال <b>رمز PIN الجديد</b> (6 أرقام):");
      }

      return okResponse;
    }

    // 2. معالجة الرسائل النصية وأزرار القائمة (Keyboard)
    if (!update.message || !update.message.chat) return okResponse;
    const chatId = update.message.chat.id.toString();
    const text = update.message.text || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    const sessionRef = doc(firestore, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() : null;

    // --- أوامر البدء والربط ---
    if (text.startsWith('/start')) {
      const startParam = text.split(' ')[1];
      
      if (startParam && startParam.startsWith('LINK-')) {
        const linkQ = query(collection(firestore, "users"), where("tempLinkToken", "==", startParam));
        const linkSnap = await getDocs(linkQ);
        if (!linkSnap.empty) {
          await updateDoc(linkSnap.docs[0].ref, { telegramChatId: chatId, tempLinkToken: "" });
          await deleteDoc(sessionRef);
          await sendTelegramMessage(botToken, chatId, `<b>تم الربط الاستراتيجي بنجاح! 🎉</b>\n\nأهلاً بك <b>${linkSnap.docs[0].data().displayName}</b>. حسابك الآن مربوط بمركز العمليات المتقدم لناميكس.`, generateTelegramAppKeyboard(baseUrl));
          return okResponse;
        }
      }
      
      if (user) {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في مركز ناميكس النخبوي 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الإدارة الاحترافية المعتمدة.`, generateTelegramAppKeyboard(baseUrl));
      } else {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك المتطورة لإدارة الأصول الرقمية والتداول بالذكاء الاصطناعي بنهج نخبوي.`, generateGuestKeyboard(baseUrl));
      }
      return okResponse;
    }

    // --- معالجة الضيوف (إنشاء حساب) ---
    if (!user) {
      if (text.includes('إنشاء حساب جديد')) {
        await setDoc(sessionRef, { step: 'awaiting_email', createdAt: new Date().toISOString() });
        await sendTelegramMessage(botToken, chatId, "<b>✨ بروتوكول إنشاء حساب جديد</b>\n\nيرجى إرسال <b>بريدك الإلكتروني</b> للبدء:");
        return okResponse;
      }
      
      if (session?.step === 'awaiting_email') {
        if (!text.includes('@')) {
          await sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال بريد إلكتروني صحيح.");
          return okResponse;
        }
        await updateDoc(sessionRef, { step: 'awaiting_name', email: text });
        await sendTelegramMessage(botToken, chatId, "✅ <b>تم التحقق من البريد.</b>\n\nالآن، يرجى إرسال <b>اسمك الكامل</b> المعتمد:");
        return okResponse;
      }

      if (session?.step === 'awaiting_name') {
        const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
        await setDoc(doc(firestore, "users", userId), {
          id: userId,
          email: session.email,
          displayName: text,
          role: "user",
          totalBalance: 0,
          telegramChatId: chatId,
          createdAt: new Date().toISOString()
        });
        await deleteDoc(sessionRef);
        await sendTelegramMessage(botToken, chatId, `<b>تهانينا يا ${text}! 🎉</b>\n\nتم إنشاء هويتك الاستراتيجية بنجاح. يمكنك الآن استخدام كافة أدوات ناميكس المتقدمة.`, generateTelegramAppKeyboard(baseUrl));
        return okResponse;
      }
    }

    // --- معالجة المستثمرين الموثقين (أزرار القائمة) ---
    if (user) {
      if (text.includes('💰 الرصيد والمحفظة')) {
        await sendTelegramMessage(botToken, chatId, 
          `<b>تقرير المحفظة الاحترافي 📊</b>\n\n👤 المستثمر: ${user.displayName}\n🏦 الرصيد المتاح: <b>$${(user.totalBalance || 0).toLocaleString()}</b>\n📈 صافي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 العقود النشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          { inline_keyboard: [[{ text: "🔐 إدارة PIN", callback_data: "manage_pin" }, { text: "🔄 النمو التلقائي", callback_data: "toggle_autoinvest" }]] }
        );
        return okResponse;
      }

      if (text.includes('📊 التقارير والأداء')) {
        await sendTelegramMessage(botToken, chatId, "⏳ جاري جرد بصمتك المالية للأسبوع الماضي وتوليد التقرير الاستراتيجي...");
        await sendWeeklyPerformanceReport(user.id);
        return okResponse;
      }

      if (text.includes('🔬 مختبر العقود')) {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let msg = "<b>🔬 العقود الاستثمارية الاحترافية المتاحة:</b>\n\n";
        plansSnap.forEach(p => {
          const d = p.data();
          msg += `💎 <b>${d.title}</b>\n💰 العائد: %${d.profitPercent}\n⏱️ المدة: ${d.durationValue} ${d.durationUnit}\n\n`;
        });
        await sendTelegramMessage(botToken, chatId, msg + "<i>تفضل بزيارة المنصة عبر التطبيق المصغر لتفعيل العقود بضمان الحماية الشاملة.</i>");
        return okResponse;
      }
    }

    return okResponse;
  } catch (e) {
    console.error("Webhook Global Error:", e);
    return okResponse; // نرسل OK دائماً لتجنب تكرار الرسائل من تلغرام عند وجود خطأ برمجي
  }
}
