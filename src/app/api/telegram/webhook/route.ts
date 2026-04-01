
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { sendWeeklyPerformanceReport, sendOTPEmail } from '@/app/actions/auth-actions';

/**
 * @fileOverview NAMIX NEXUS INTERACTIVE CORE v10.0
 * المحرك المركزي المطور - حل كافة مشاكل الاستجابة، التدفق التفاعلي، وإنشاء الحساب بـ OTP.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const { firestore } = initializeFirebase();
    
    // جلب إعدادات البوت من القاعدة
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });
    const botToken = config.botToken;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

    // 1. معالجة العمليات الخلفية (Callback Queries)
    if (update.callback_query) {
      const chatId = update.callback_query.message?.chat.id.toString();
      const data = update.callback_query.data;
      if (!chatId) return NextResponse.json({ ok: true });

      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

      if (!user) return NextResponse.json({ ok: true });

      if (data === 'manage_pin') {
        await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'AWAITING_PIN_NEW' }, { merge: true });
        await sendTelegramMessage(botToken, chatId, "<b>🔐 بروتوكول حماية المحفظة</b>\n\nيرجى إرسال <b>رمز PIN الجديد</b> (6 أرقام) لتأمين عملياتك:");
      }

      if (data.startsWith('activate_plan_')) {
        const planId = data.replace('activate_plan_', '');
        const planSnap = await getDoc(doc(firestore, "investment_plans", planId));
        if (planSnap.exists()) {
          const plan = planSnap.data();
          await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'AWAITING_PLAN_AMOUNT', planId, planTitle: plan.title }, { merge: true });
          await sendTelegramMessage(botToken, chatId, `<b>🔬 تفعيل عقد: ${plan.title}</b>\n\nيرجى إرسال مبلغ الاستثمار المطلوب ($):\n<i>الحد الأدنى: $${plan.min}</i>`);
        }
      }

      return NextResponse.json({ ok: true });
    }

    // 2. معالجة الرسائل النصية
    if (!update.message || !update.message.chat) return NextResponse.json({ ok: true });
    const chatId = update.message.chat.id.toString();
    const text = (update.message.text || "").trim();

    // جلب بيانات المستثمر والجلسة
    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    const sessionRef = doc(firestore, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() : null;

    // --- أوامر البدء (Start) ---
    if (text.startsWith('/start')) {
      const startParam = text.split(' ')[1];
      if (startParam && startParam.startsWith('LINK-')) {
        const linkQ = query(collection(firestore, "users"), where("tempLinkToken", "==", startParam));
        const linkSnap = await getDocs(linkQ);
        if (!linkSnap.empty) {
          await updateDoc(linkSnap.docs[0].ref, { telegramChatId: chatId, tempLinkToken: "" });
          await deleteDoc(sessionRef);
          await sendTelegramMessage(botToken, chatId, `<b>تم الربط الاحترافي بنجاح! 🎉</b>\n\nأهلاً بك المستثمر <b>${linkSnap.docs[0].data().displayName}</b>. حسابك الآن مربوط بمركز العمليات المتقدم لناميكس.`, generateTelegramAppKeyboard());
          return NextResponse.json({ ok: true });
        }
      }
      
      if (user) {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في مركز ناميكس المتقدم 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الإدارة الاحترافية المعتمدة.`, generateTelegramAppKeyboard());
      } else {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك المتقدمة لإدارة الأصول الرقمية والتداول بالذكاء الاصطناعي بنهج نخبوي.`, generateGuestKeyboard());
      }
      return NextResponse.json({ ok: true });
    }

    // --- رحلة إنشاء الحساب بـ OTP (تفاعلية بالكامل) ---
    if (!user) {
      if (text === '✨ إنشاء حساب جديد') {
        await setDoc(sessionRef, { step: 'REG_EMAIL', createdAt: new Date().toISOString() });
        await sendTelegramMessage(botToken, chatId, "<b>✨ بروتوكول إنشاء حساب نخبوي</b>\n\nيرجى إرسال <b>بريدك الإلكتروني</b> للبدء:");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_EMAIL') {
        if (!text.includes('@')) return sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال بريد إلكتروني صحيح.");
        
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await sendOTPEmail(text, otpCode);
        await updateDoc(sessionRef, { step: 'REG_OTP', email: text, otp: otpCode });
        await sendTelegramMessage(botToken, chatId, "📩 <b>تم إرسال رمز التحقق!</b>\n\nيرجى إدخال الرمز المكون من 6 أرقام الواصل لبريدك لتأمين الهوية:");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_OTP') {
        if (text !== session.otp) return sendTelegramMessage(botToken, chatId, "❌ الرمز غير صحيح. يرجى التأكد والمحاولة مجدداً.");
        await updateDoc(sessionRef, { step: 'REG_NAME' });
        await sendTelegramMessage(botToken, chatId, "✅ <b>تم التحقق من الهوية الرقمية.</b>\n\nالآن، يرجى إرسال <b>اسمك الكامل</b> المعتمد في المنصة:");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_NAME') {
        await updateDoc(sessionRef, { step: 'REG_PASS', fullName: text });
        await sendTelegramMessage(botToken, chatId, "🛡️ <b>تم تثبيت الاسم.</b>\n\nالخطوة الأخيرة: اختر <b>كلمة مرور</b> قوية لحسابك:");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_PASS') {
        const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
        await setDoc(doc(firestore, "users", userId), {
          id: userId,
          email: session.email,
          displayName: session.fullName,
          password: text,
          role: "user",
          totalBalance: 0,
          telegramChatId: chatId,
          createdAt: new Date().toISOString()
        });
        await deleteDoc(sessionRef);
        await sendTelegramMessage(botToken, chatId, `<b>تهانينا يا ${session.fullName}! 🎉</b>\n\nتم إنشاء هويتك الاستراتيجية بنجاح. يمكنك الآن إدارة أصولك بذكاء.`, generateTelegramAppKeyboard());
        return NextResponse.json({ ok: true });
      }
    }

    // --- أوامر المستثمرين (اللوحة الرئيسية) ---
    if (user) {
      if (text === '📊 الأسواق الحية') {
        const symSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true), limit(8)));
        let msg = "<b>📈 نبض الأسواق اللحظي:</b>\n\n";
        symSnap.forEach(s => {
          const d = s.data();
          msg += `• <b>${d.code}</b>: <code>$${d.currentPrice?.toLocaleString()}</code>\n`;
        });
        await sendTelegramMessage(botToken, chatId, msg + "\n<i>يتم التحديث لحظياً عبر بروتوكول ناميكس المتقدم.</i>");
        return NextResponse.json({ ok: true });
      }

      if (text === '🔬 مختبر العقود') {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let msg = "<b>🔬 المفاعل الاستثماري: العقود المتاحة</b>\n\n";
        const buttons = [];
        plansSnap.forEach(p => {
          const d = p.data();
          msg += `💎 <b>${d.title}</b>\n💰 العائد: %${d.profitPercent} | ⏱️ المدة: ${d.durationValue} ${d.durationUnit}\n\n`;
          buttons.push([{ text: `🚀 تفعيل ${d.title}`, callback_data: `activate_plan_${p.id}` }]);
        });
        await sendTelegramMessage(botToken, chatId, msg, { inline_keyboard: buttons });
        return NextResponse.json({ ok: true });
      }

      if (text === '💰 الرصيد والمحفظة') {
        await sendTelegramMessage(botToken, chatId, 
          `<b>تقرير المحفظة الاحترافي 📊</b>\n\n👤 المستثمر: ${user.displayName}\n🏦 الرصيد المتاح: <b>$${(user.totalBalance || 0).toLocaleString()}</b>\n📈 صافي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 العقود النشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          { inline_keyboard: [[{ text: "🔐 إدارة PIN", callback_data: "manage_pin" }]] }
        );
        return NextResponse.json({ ok: true });
      }

      if (text === '📊 التقارير والأداء') {
        await sendTelegramMessage(botToken, chatId, "⏳ جاري جرد بصمتك المالية وتوليد التقرير الاستراتيجي...");
        await sendWeeklyPerformanceReport(user.id);
        return NextResponse.json({ ok: true });
      }

      if (text === '💳 شحن الرصيد') {
        const catSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        let msg = "<b>💳 بروتوكول شحن السيولة</b>\n\nاختر فئة الإيداع المطلوبة:";
        const buttons = [];
        catSnap.forEach(c => buttons.push([{ text: c.data().name, callback_data: `dep_cat_${c.id}` }]));
        await sendTelegramMessage(botToken, chatId, msg, { inline_keyboard: buttons });
        return NextResponse.json({ ok: true });
      }

      if (text === '📤 سحب الأرباح') {
        // فحص الملاءة الاستباقي
        if (!user.isVerified) {
          return sendTelegramMessage(botToken, chatId, "⚠️ <b>التوثيق مطلوب</b>\n\nيرجى إكمال توثيق هويتك من المنصة لتفعيل بروتوكول السحب.");
        }
        if (!user.securityPin) {
          return sendTelegramMessage(botToken, chatId, "⚠️ <b>رمز الحماية مفقود</b>\n\nيرجى تعيين رمز PIN من إعدادات المحفظة أولاً.");
        }
        await sendTelegramMessage(botToken, chatId, "<b>📤 طلب سحب أرباح</b>\n\nيرجى إرسال المبلغ المراد سحبه ($):");
        await setDoc(sessionRef, { step: 'AWAITING_WITHDRAW_AMOUNT' }, { merge: true });
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Critical Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
