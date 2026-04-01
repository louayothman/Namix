
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc, addDoc, increment, orderBy, limit } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { verifyBinanceDeposit } from '@/app/actions/binance-actions';
import { sendWeeklyPerformanceReport } from '@/app/actions/auth-actions';

/**
 * @fileOverview NAMIX NEXUS INTERACTIVE CORE v8.0
 * محرك المحادثة النخبوي - يدعم التقارير الأسبوعية، العمليات المالية، والتداول المكثف.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });
    const botToken = config.botToken;

    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id.toString();
      const data = update.callback_query.data;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

      if (!user) return NextResponse.json({ ok: true });

      // 1. تنفيذ صفقات التداول
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

      if (data.startsWith('dur_')) {
        const durationSeconds = parseInt(data.split('_')[1]);
        const sessionSnap = await getDoc(doc(firestore, "telegram_sessions", chatId));
        const session = sessionSnap.data();
        if (session?.step === 'awaiting_trade_duration') {
          if (user.totalBalance < session.amount) {
            await sendTelegramMessage(botToken, chatId, "❌ <b>عجز في السيولة</b>\n\nرصيدك الحالي غير كافٍ.", {
              inline_keyboard: [[{ text: "💳 شحن الرصيد الآن", callback_data: "start_deposit" }]]
            });
            await deleteDoc(doc(firestore, "telegram_sessions", chatId));
            return NextResponse.json({ ok: true });
          }
          const symbolSnap = await getDoc(doc(firestore, "trading_symbols", session.symbolId));
          const symbolData = symbolSnap.data();
          const entryPrice = symbolData?.currentPrice || 0;
          const globalTradeSnap = await getDoc(doc(firestore, "system_settings", "trading_global"));
          const profitRate = globalTradeSnap.data()?.defaultProfitRate || 80;

          await addDoc(collection(firestore, "trades"), {
            userId: user.id, userName: user.displayName, symbolId: session.symbolId, symbolCode: symbolData?.code || "ASSET",
            tradeType: session.tradeType, amount: session.amount, entryPrice, profitRate,
            expectedProfit: (session.amount * profitRate) / 100, status: "open", result: "pending",
            startTime: new Date().toISOString(), endTime: new Date(Date.now() + durationSeconds * 1000).toISOString(), createdAt: new Date().toISOString()
          });
          await updateDoc(doc(firestore, "users", user.id), { totalBalance: increment(-session.amount) });
          await deleteDoc(doc(firestore, "telegram_sessions", chatId));
          await sendTelegramMessage(botToken, chatId, `<b>✅ تم إطلاق الصفقة بنجاح!</b>\n\nالمبلغ: <b>$${session.amount}</b>\nالمدة: <b>${durationSeconds}ث</b>\n\n<i>سيصلك إشعار فوري بالنتيجة فور التنفيذ.</i>`, generateTelegramAppKeyboard(baseUrl));
        }
      }

      // 2. إدارة الأمان (PIN)
      if (data === 'manage_pin') {
        await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_pin_new' });
        await sendTelegramMessage(botToken, chatId, "<b>🔐 بروتوكول حماية الخزنة</b>\n\nيرجى إرسال <b>رمز PIN الجديد</b> (6 أرقام):");
      }

      // 3. إدارة النمو التلقائي
      if (data === 'toggle_autoinvest') {
        const newVal = !user.isAutoInvestEnabled;
        await updateDoc(doc(firestore, "users", user.id), { isAutoInvestEnabled: newVal });
        await sendTelegramMessage(botToken, chatId, `<b>${newVal ? '✅ تم تفعيل' : '⚠️ تم تعطيل'} محرك النمو التلقائي</b>\n\nسيتم ${newVal ? 'إعادة استثمار' : 'تجميد'} أرباح العقود الناضجة آلياً.`);
      }

      // 4. مسار الإيداع التفاعلي
      if (data === 'start_deposit') {
        const catsSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        const buttons = catsSnap.docs.map(doc => ([{ text: doc.data().name, callback_data: `depcat_${doc.id}` }]));
        await sendTelegramMessage(botToken, chatId, "<b>💳 مركز شحن الرصيد المتقدم</b>\n\nاختر فئة الإيداع المفضلة:", { inline_keyboard: buttons });
      }

      if (data.startsWith('depcat_')) {
        const catId = data.split('_')[1];
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        const portals = catSnap.data()?.portals?.filter((p: any) => p.isActive) || [];
        const buttons = portals.map((p: any) => ([{ text: p.name, callback_data: `depportal_${catId}_${p.id}` }]));
        await sendTelegramMessage(botToken, chatId, `<b>📂 فئة: ${catSnap.data()?.name}</b>\n\nاختر بوابة الإيداع المعتمدة:`, { inline_keyboard: buttons });
      }

      if (data.startsWith('depportal_')) {
        const [_, catId, portalId] = data.split('_');
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        const portal = catSnap.data()?.portals?.find((p: any) => p.id === portalId);
        if (portal) {
          let message = `<b>🛠️ بوابة: ${portal.name}</b>\n\n<b>📝 بروتوكول التعليمات:</b>\n${portal.instructions}\n\n`;
          if (portal.walletAddress) message += `<b>🏦 عنوان الاستلام:</b>\n<code>${portal.walletAddress}</code>\n\n`;
          if (portal.isBinanceLinked) {
            message += `<i>⚠️ تدقيق آلي مفعل عبر Binance API.</i>\n\nيرجى إرسال <b>رقم العملية (TXID)</b> لتوثيق الشحن:`;
            await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_txid', catId, portalId }, { merge: true });
          } else {
            message += `يرجى إرسال <b>المبلغ المطلوب ($)</b>:`;
            await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_dep_amount', catId, portalId }, { merge: true });
          }
          await sendTelegramMessage(botToken, chatId, message);
        }
      }

      return NextResponse.json({ ok: true });
    }

    if (!update.message || !update.message.chat) return NextResponse.json({ ok: true });
    const chatId = update.message.chat.id.toString();
    const text = update.message.text || "";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";
    const sessionRef = doc(firestore, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() : null;
    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    // --- معالجة الأوامر الأساسية ---
    if (text.startsWith('/start')) {
      const startParam = text.split(' ')[1];
      if (startParam && startParam.startsWith('LINK-')) {
        const linkQ = query(collection(firestore, "users"), where("tempLinkToken", "==", startParam));
        const linkSnap = await getDocs(linkQ);
        if (!linkSnap.empty) {
          await updateDoc(linkSnap.docs[0].ref, { telegramChatId: chatId, tempLinkToken: "" });
          return sendTelegramMessage(botToken, chatId, `<b>تم الربط الاستراتيجي بنجاح! 🎉</b>\n\nأهلاً بك <b>${linkSnap.docs[0].data().displayName}</b>. حسابك الآن مربوط بمركز العمليات النخبوي لناميكس.`, generateTelegramAppKeyboard(baseUrl));
        }
      }
      await deleteDoc(sessionRef);
      if (user) return sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في مركز ناميكس المتقدم 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الإدارة الاحترافية.`, generateTelegramAppKeyboard(baseUrl));
      return sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك المتطورة لإدارة الأصول الرقمية.`, generateGuestKeyboard(baseUrl));
    }

    // --- القائمة الرئيسية للمستثمرين ---
    if (user) {
      if (text === '💰 الرصيد والمحفظة') {
        return sendTelegramMessage(botToken, chatId, 
          `<b>تقرير المحفظة المتقدم 📊</b>\n\n👤 المستثمر: ${user.displayName}\n🏦 الرصيد المتاح: <b>$${user.totalBalance.toLocaleString()}</b>\n📈 صافي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 العقود النشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          { inline_keyboard: [[{ text: "💳 شحن", callback_data: "start_deposit" }, { text: "💸 سحب", callback_data: "start_withdrawal" }], [{ text: "🔐 إدارة PIN", callback_data: "manage_pin" }]] }
        );
      } else if (text === '📊 التقارير والأداء') {
        await sendTelegramMessage(botToken, chatId, "⏳ <b>جاري جرد البيانات الاستراتيجية...</b>\nيرجى الانتظار لحظات ريثما نقوم بتحليل بصمتك المالية للأسبوع الماضي.");
        const res = await sendWeeklyPerformanceReport(user.id);
        if (!res.success) await sendTelegramMessage(botToken, chatId, "❌ <b>عذراً</b>\nحدث خطأ أثناء محاولة جلب التقرير. يرجى المحاولة لاحقاً.");
        return NextResponse.json({ ok: true });
      } else if (text === '📊 الأسواق الحية') {
        const symbolsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true), limit(5)));
        let msg = "<b>📊 نبض الأسواق اللحظي:</b>\n\n";
        const buttons = symbolsSnap.docs.map(s => ([{ text: `🚀 تداول ${s.data().code} ($${s.data().currentPrice})`, callback_data: `exec_${s.id}_buy` }]));
        return sendTelegramMessage(botToken, chatId, msg, { inline_keyboard: buttons });
      } else if (text === '🔬 مختبر العقود') {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let msg = "<b>🔬 العقود الاستثمارية المتاحة:</b>\n\n";
        plansSnap.forEach(p => msg += `💎 <b>${p.data().title}</b>\n💰 العائد: %${p.data().profitPercent}\n⏱️ المدة: ${p.data().durationValue} ${p.data().durationUnit}\n\n`);
        return sendTelegramMessage(botToken, chatId, msg + "<i>تفضل بزيارة المنصة لتفعيل العقود بضمان الحماية الشاملة.</i>", generateTelegramAppKeyboard(baseUrl));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
