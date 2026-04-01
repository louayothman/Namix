
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc, addDoc, increment, orderBy, limit } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { verifyBinanceDeposit } from '@/app/actions/binance-actions';
import { sendWeeklyPerformanceReport } from '@/app/actions/auth-actions';

/**
 * @fileOverview NAMIX NEXUS INTERACTIVE CORE v9.5
 * محرك المحادثة المطور - إصلاح خطأ الاستجابة وتصحيح منطق الربط.
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

    // 1. معالجة الأزرار الشفافة (Callback Queries)
    if (update.callback_query) {
      const chatId = update.callback_query.message?.chat.id.toString();
      const data = update.callback_query.data;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

      if (!chatId) return NextResponse.json({ ok: true });

      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

      if (!user) return NextResponse.json({ ok: true });

      // تنفيذ صفقات التداول
      if (data.startsWith('exec_')) {
        const symbolId = data.split('_')[1];
        const tradeType = data.split('_')[2];
        await setDoc(doc(firestore, "telegram_sessions", chatId), { 
          step: 'awaiting_trade_amount', 
          symbolId, 
          tradeType,
          createdAt: new Date().toISOString() 
        }, { merge: true });
        await sendTelegramMessage(botToken, chatId, `<b>🚀 بروتوكول تنفيذ ${tradeType === 'buy' ? 'شراء 📈' : 'بيع 📉'}</b>\n\nيرجى إرسال <b>المبلغ</b> ($):`);
      }

      // إدارة الأمان (PIN)
      if (data === 'manage_pin') {
        await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_pin_new' });
        await sendTelegramMessage(botToken, chatId, "<b>🔐 بروتوكول حماية الخزنة</b>\n\nيرجى إرسال <b>رمز PIN الجديد</b> (6 أرقام):");
      }

      // إدارة النمو التلقائي
      if (data === 'toggle_autoinvest') {
        const newVal = !user.isAutoInvestEnabled;
        await updateDoc(doc(firestore, "users", user.id), { isAutoInvestEnabled: newVal });
        await sendTelegramMessage(botToken, chatId, `<b>${newVal ? '✅ تم تفعيل' : '⚠️ تم تعطيل'} محرك النمو التلقائي</b>\n\nسيتم إعادة استثمار أرباح العقود المكتملة آلياً.`);
      }

      // بدء عملية الإيداع
      if (data === 'start_deposit') {
        const catsSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        const buttons = catsSnap.docs.map(doc => ([{ text: doc.data().name, callback_data: `depcat_${doc.id}` }]));
        await sendTelegramMessage(botToken, chatId, "<b>💳 مركز شحن الرصيد المتقدم</b>\n\nاختر فئة الإيداع المفضلة:", { inline_keyboard: buttons });
      }

      return NextResponse.json({ ok: true });
    }

    // 2. معالجة الرسائل النصية
    if (!update.message || !update.message.chat) return NextResponse.json({ ok: true });
    const chatId = update.message.chat.id.toString();
    const text = update.message.text || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    const sessionRef = doc(firestore, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() : null;

    // أوامر البدء والربط
    if (text.startsWith('/start')) {
      const startParam = text.split(' ')[1];
      if (startParam && startParam.startsWith('LINK-')) {
        const linkQ = query(collection(firestore, "users"), where("tempLinkToken", "==", startParam));
        const linkSnap = await getDocs(linkQ);
        if (!linkSnap.empty) {
          await updateDoc(linkSnap.docs[0].ref, { telegramChatId: chatId, tempLinkToken: "" });
          await sendTelegramMessage(botToken, chatId, `<b>تم الربط الاستراتيجي بنجاح! 🎉</b>\n\nأهلاً بك <b>${linkSnap.docs[0].data().displayName}</b>. حسابك الآن مربوط بمركز العمليات المتقدم لناميكس.`, generateTelegramAppKeyboard(baseUrl));
          return NextResponse.json({ ok: true });
        }
      }
      
      await deleteDoc(sessionRef);
      if (user) {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في مركز ناميكس المتقدم 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الإدارة الاحترافية.`, generateTelegramAppKeyboard(baseUrl));
      } else {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك المتطورة لإدارة الأصول الرقمية والتداول بالذكاء الاصطناعي.`, generateGuestKeyboard(baseUrl));
      }
      return NextResponse.json({ ok: true });
    }

    // معالجة مدخلات الجلسة (الحالات)
    if (session) {
      if (session.step === 'awaiting_trade_amount') {
        const amt = parseFloat(text);
        if (isNaN(amt) || amt <= 0) {
          await sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال مبلغ صحيح.");
          return NextResponse.json({ ok: true });
        }
        await updateDoc(sessionRef, { step: 'awaiting_trade_duration', amount: amt });
        const buttons = [[{ text: "30 ثانية", callback_data: "dur_30" }, { text: "60 ثانية", callback_data: "dur_60" }], [{ text: "5 دقائق", callback_data: "dur_300" }]];
        await sendTelegramMessage(botToken, chatId, "⏱️ اختر مدة الصفقة:", { inline_keyboard: buttons });
        return NextResponse.json({ ok: true });
      }
      
      if (session.step === 'awaiting_pin_new' && user) {
        if (text.length !== 6 || isNaN(parseInt(text))) {
          await sendTelegramMessage(botToken, chatId, "❌ يجب أن يتكون الرمز من 6 أرقام.");
          return NextResponse.json({ ok: true });
        }
        await updateDoc(doc(firestore, "users", user.id), { securityPin: text });
        await deleteDoc(sessionRef);
        await sendTelegramMessage(botToken, chatId, "✅ <b>تم تحديث رمز PIN بنجاح!</b>\nتم تأمين عملياتك المالية بالرمز الجديد.");
        return NextResponse.json({ ok: true });
      }
    }

    // القائمة الرئيسية (أزرار Keyboard)
    if (user) {
      if (text.includes('💰 الرصيد والمحفظة')) {
        await sendTelegramMessage(botToken, chatId, 
          `<b>تقرير المحفظة المتقدم 📊</b>\n\n👤 المستثمر: ${user.displayName}\n🏦 الرصيد المتاح: <b>$${user.totalBalance.toLocaleString()}</b>\n📈 صافي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 العقود النشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          { inline_keyboard: [[{ text: "💳 شحن", callback_data: "start_deposit" }, { text: "💸 سحب", callback_data: "start_withdrawal" }], [{ text: "🔐 إدارة PIN", callback_data: "manage_pin" }, { text: "🔄 النمو التلقائي", callback_data: "toggle_autoinvest" }]] }
        );
        return NextResponse.json({ ok: true });
      }
      
      if (text.includes('📊 التقارير والأداء')) {
        await sendTelegramMessage(botToken, chatId, "⏳ جاري تحليل بصمتك المالية للأسبوع الماضي...");
        await sendWeeklyPerformanceReport(user.id);
        return NextResponse.json({ ok: true });
      }

      if (text.includes('📊 الأسواق الحية')) {
        const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true), limit(5)));
        let msg = "<b>📊 نبض الأسواق اللحظي:</b>\n\n";
        const buttons = symbolsSnap.docs.map(s => ([{ text: `🚀 تداول ${s.data().code} ($${s.data().currentPrice})`, callback_data: `exec_${s.id}_buy` }]));
        await sendTelegramMessage(botToken, chatId, msg, { inline_keyboard: buttons });
        return NextResponse.json({ ok: true });
      }

      if (text.includes('🔬 مختبر العقود')) {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let msg = "<b>🔬 العقود الاستثمارية المتاحة:</b>\n\n";
        plansSnap.forEach(p => {
          const pData = p.data();
          msg += `💎 <b>${pData.title}</b>\n💰 العائد: %${pData.profitPercent}\n⏱️ المدة: ${pData.durationValue} ${pData.durationUnit}\n\n`;
        });
        await sendTelegramMessage(botToken, chatId, msg + "<i>تفضل بزيارة المنصة لتفعيل العقود بضمان الحماية الشاملة.</i>");
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook Global Error:", e);
    return NextResponse.json({ ok: true }, { status: 200 }); // Always return 200 to Telegram
  }
}
