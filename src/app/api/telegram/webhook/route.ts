
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc, addDoc, increment } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { sendOTPEmail } from '@/app/actions/auth-actions';
import { verifyBinanceDeposit } from '@/app/actions/binance-actions';
import { differenceInDays, parseISO, differenceInMinutes, differenceInHours, differenceInMonths } from 'date-fns';

/**
 * @fileOverview NAMIX NEXUS CONVERSATIONAL ENGINE v6.0
 * محرك المحادثة المتقدم - يدعم الشحن، السحب، التداول، والتحقق من القوانين الاستراتيجية.
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

      // 1. تنفيذ صفقات
      if (data.startsWith('exec_')) {
        const symbolId = data.split('_')[1];
        const tradeType = data.split('_')[2];
        await setDoc(doc(firestore, "telegram_sessions", chatId), { 
          step: 'awaiting_trade_amount', 
          symbolId, 
          tradeType,
          createdAt: new Date().toISOString() 
        }, { merge: true });
        await sendTelegramMessage(botToken, chatId, `<b>🚀 تنفيذ صفقة ${tradeType === 'buy' ? 'شراء 📈' : 'بيع 📉'}</b>\n\nيرجى إدخال <b>المبلغ</b> ($):`);
      }

      if (data.startsWith('dur_')) {
        const durationSeconds = parseInt(data.split('_')[1]);
        const sessionSnap = await getDoc(doc(firestore, "telegram_sessions", chatId));
        const session = sessionSnap.data();
        if (session?.step === 'awaiting_trade_duration') {
          if (user.totalBalance < session.amount) {
            await sendTelegramMessage(botToken, chatId, "❌ <b>عجز في الرصيد</b>\n\nرصيدك الحالي غير كافٍ.", {
              inline_keyboard: [[{ text: "💳 شحن الرصيد الآن", callback_data: "start_deposit" }]]
            });
            await deleteDoc(doc(firestore, "telegram_sessions", chatId));
            return NextResponse.json({ ok: true });
          }
          const symbolSnap = await getDoc(doc(firestore, "trading_symbols", session.symbolId));
          const symbolData = symbolSnap.data();
          const entryPrice = symbolData?.currentPrice || 0;
          const profitRate = 80;
          await addDoc(collection(firestore, "trades"), {
            userId: user.id, userName: user.displayName, symbolId: session.symbolId, symbolCode: symbolData?.code || "ASSET",
            tradeType: session.tradeType, amount: session.amount, entryPrice, profitRate,
            expectedProfit: (session.amount * profitRate) / 100, status: "open", result: "pending",
            startTime: new Date().toISOString(), endTime: new Date(Date.now() + durationSeconds * 1000).toISOString(), createdAt: new Date().toISOString()
          });
          await updateDoc(doc(firestore, "users", user.id), { totalBalance: increment(-session.amount) });
          await deleteDoc(doc(firestore, "telegram_sessions", chatId));
          await sendTelegramMessage(botToken, chatId, `<b>✅ تم إطلاق الصفقة!</b>\n\nالمبلغ: <b>$${session.amount}</b>\nالمدة: <b>${durationSeconds}ث</b>`, generateTelegramAppKeyboard(baseUrl));
        }
      }

      // 2. مسار الإيداع
      if (data === 'start_deposit') {
        const catsSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        const buttons = catsSnap.docs.map(doc => ([{ text: doc.data().name, callback_data: `depcat_${doc.id}` }]));
        await sendTelegramMessage(botToken, chatId, "<b>💳 مركز الشحن المتقدم</b>\n\nاختر فئة الإيداع:", { inline_keyboard: buttons });
      }

      if (data.startsWith('depcat_')) {
        const catId = data.split('_')[1];
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        const portals = catSnap.data()?.portals?.filter((p: any) => p.isActive) || [];
        const buttons = portals.map((p: any) => ([{ text: p.name, callback_data: `depportal_${catId}_${p.id}` }]));
        await sendTelegramMessage(botToken, chatId, `<b>📂 فئة: ${catSnap.data()?.name}</b>\n\nاختر بوابة الدفع:`, { inline_keyboard: buttons });
      }

      if (data.startsWith('depportal_')) {
        const [_, catId, portalId] = data.split('_');
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        const portal = catSnap.data()?.portals?.find((p: any) => p.id === portalId);
        if (portal) {
          let message = `<b>🛠️ بوابة: ${portal.name}</b>\n\n<b>📝 التعليمات:</b>\n${portal.instructions}\n\n`;
          if (portal.walletAddress) message += `<b>🏦 العنوان:</b>\n<code>${portal.walletAddress}</code>\n\n`;
          if (portal.isBinanceLinked) {
            message += `<i>⚠️ تدقيق آلي مفعل.</i>\n\nيرجى إرسال <b>رقم العملية (TXID)</b> لتوثيق الإيداع:`;
            await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_txid', catId, portalId }, { merge: true });
          } else {
            message += `يرجى إرسال <b>المبلغ ($)</b> الذي قمت بتحويله:`;
            await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_dep_amount', catId, portalId }, { merge: true });
          }
          await sendTelegramMessage(botToken, chatId, message);
        }
      }

      // 3. مسار السحب التفاعلي والذكي
      if (data === 'start_withdrawal') {
        // التحقق من القوانين قبل البدء
        const rulesSnap = await getDoc(doc(firestore, "system_settings", "withdrawal_rules"));
        const rules = rulesSnap.data();
        const now = new Date();

        // فحص المتطلبات
        if (!user.securityPin) {
          return sendTelegramMessage(botToken, chatId, "❌ <b>متطلب أمني</b>\n\nيرجى تعيين رمز PIN للخزنة من الملف الشخصي أولاً لتأمين سحوباتك.");
        }
        if (rules?.requireVerificationToWithdraw && !user.isVerified) {
          return sendTelegramMessage(botToken, chatId, "❌ <b>توثيق الهوية مطلوب</b>\n\nيجب إكمال ملفك الشخصي وتوثيق بياناتك لتفعيل سحب الأرباح.");
        }
        if (user.totalBalance < (rules?.minAccountBalance || 0)) {
          return sendTelegramMessage(botToken, chatId, `❌ <b>عجز في الرصيد</b>\n\nالحد الأدنى للبقاء في المحفظة هو $${rules?.minAccountBalance}. رصيدك الحالي غير كافٍ.`);
        }
        if ((user.totalProfits || 0) < (rules?.minTotalProfits || 0)) {
          return sendTelegramMessage(botToken, chatId, `❌ <b>متطلب أرباح</b>\n\nيجب أن يكون صافي أرباحك $${rules?.minTotalProfits} على الأقل قبل أول سحب.`);
        }

        const catsSnap = await getDocs(query(collection(firestore, "withdraw_methods"), where("isActive", "==", true)));
        const buttons = catsSnap.docs.map(doc => ([{ text: doc.data().name, callback_data: `withcat_${doc.id}` }]));
        await sendTelegramMessage(botToken, chatId, "<b>💸 مركز سحب الأرباح المتقدم</b>\n\nيرجى اختيار فئة الصرف المطلوبة:", { inline_keyboard: buttons });
      }

      if (data.startsWith('withcat_')) {
        const catId = data.split('_')[1];
        const catSnap = await getDoc(doc(firestore, "withdraw_methods", catId));
        const portals = catSnap.data()?.portals?.filter((p: any) => p.isActive) || [];
        const buttons = portals.map((p: any) => ([{ text: p.name, callback_data: `withportal_${catId}_${p.id}` }]));
        await sendTelegramMessage(botToken, chatId, `<b>📂 فئة: ${catSnap.data()?.name}</b>\n\nاختر بوابة استلام الأموال:`, { inline_keyboard: buttons });
      }

      if (data.startsWith('withportal_')) {
        const [_, catId, portalId] = data.split('_');
        const catSnap = await getDoc(doc(firestore, "withdraw_methods", catId));
        const portal = catSnap.data()?.portals?.find((p: any) => p.id === portalId);
        if (portal) {
          await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_with_amount', catId, portalId }, { merge: true });
          await sendTelegramMessage(botToken, chatId, `<b>🛠️ بوابة: ${portal.name}</b>\n\nيرجى إدخال <b>المبلغ ($)</b> المراد سحبه:`);
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

    if (text.startsWith('/start')) {
      const startParam = text.split(' ')[1];
      if (startParam && startParam.startsWith('LINK-')) {
        const linkQ = query(collection(firestore, "users"), where("tempLinkToken", "==", startParam));
        const linkSnap = await getDocs(linkQ);
        if (!linkSnap.empty) {
          await updateDoc(linkSnap.docs[0].ref, { telegramChatId: chatId, tempLinkToken: "" });
          return sendTelegramMessage(botToken, chatId, `<b>تم الربط بنجاح! 🎉</b>\n\nأهلاً بك <b>${linkSnap.docs[0].data().displayName}</b>. حسابك الآن مربوط بمركز العمليات.`, generateTelegramAppKeyboard(baseUrl));
        }
      }
      await deleteDoc(sessionRef);
      if (user) return sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في مركز ناميكس المتقدم 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الإدارة الاحترافية.`, generateTelegramAppKeyboard(baseUrl));
      return sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك المتطورة لإدارة الأصول الرقمية.`, generateGuestKeyboard(baseUrl));
    }

    // --- معالجة خطوات الإيداع ---
    if (session?.step === 'awaiting_dep_amount' && user) {
      const amt = parseFloat(text);
      if (isNaN(amt) || amt <= 0) return sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال مبلغ صحيح.");
      await setDoc(sessionRef, { step: 'awaiting_dep_proof', amount: amt }, { merge: true });
      await sendTelegramMessage(botToken, chatId, `تم تسجيل $${amt}.\n\nأرسل الآن <b>رقم العملية (TXID)</b> لإتمام الطلب:`);
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_dep_proof' && user) {
      await addDoc(collection(firestore, "deposit_requests"), {
        userId: user.id, userName: user.displayName, amount: session.amount, methodId: session.portalId, methodName: "Telegram Inflow", transactionId: text, status: "pending", createdAt: new Date().toISOString()
      });
      await deleteDoc(sessionRef);
      return sendTelegramMessage(botToken, chatId, "<b>✅ تم استلام طلب الشحن</b>\n\nسيتم الفحص الفني وتحديث رصيدك قريباً.", generateTelegramAppKeyboard(baseUrl));
    }

    // --- معالجة خطوات السحب ---
    if (session?.step === 'awaiting_with_amount' && user) {
      const amt = parseFloat(text);
      if (isNaN(amt) || amt <= 0) return sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال مبلغ صحيح.");
      const rulesSnap = await getDoc(doc(firestore, "system_settings", "withdrawal_rules"));
      const rules = rulesSnap.data();
      if (amt < (rules?.minWithdrawalAmount || 1)) return sendTelegramMessage(botToken, chatId, `❌ الحد الأدنى للسحب هو $${rules?.minWithdrawalAmount}.`);
      if (amt > user.totalBalance) return sendTelegramMessage(botToken, chatId, "❌ المبلغ يتجاوز رصيدك المتاح.");
      
      await setDoc(sessionRef, { step: 'awaiting_with_address', amount: amt }, { merge: true });
      await sendTelegramMessage(botToken, chatId, `تم تسجيل $${amt}.\n\nأرسل الآن <b>عنوان المحفظة أو الحساب</b> لاستلام الأموال:`);
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_with_address' && user) {
      await setDoc(sessionRef, { step: 'awaiting_with_pin', address: text }, { merge: true });
      await sendTelegramMessage(botToken, chatId, "أخيراً، يرجى إدخال <b>رمز PIN</b> للخزنة لتأكيد العملية:");
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_with_pin' && user) {
      if (text !== user.securityPin) return sendTelegramMessage(botToken, chatId, "❌ رمز PIN غير صحيح. حاول مجدداً:");
      const rulesSnap = await getDoc(doc(firestore, "system_settings", "withdrawal_rules"));
      const fee = (session.amount * (rulesSnap.data()?.withdrawalFee || 0)) / 100;
      
      await addDoc(collection(firestore, "withdraw_requests"), {
        userId: user.id, userName: user.displayName, amount: session.amount, fee, netAmount: session.amount - fee,
        methodId: session.portalId, methodName: "Telegram Outflow", details: { "العنوان": session.address },
        status: "pending", createdAt: new Date().toISOString()
      });
      await updateDoc(doc(firestore, "users", user.id), { totalBalance: increment(-session.amount) });
      await deleteDoc(sessionRef);
      return sendTelegramMessage(botToken, chatId, "<b>✅ تم إرسال طلب السحب بنجاح</b>\n\nسيتم تنفيذ الحوالة خلال 24 ساعة وفقاً لبروتوكولات الأمان.", generateTelegramAppKeyboard(baseUrl));
    }

    // --- معالجة إنشاء الحساب ---
    if (text === '✨ إنشاء حساب جديد') {
      await setDoc(sessionRef, { step: 'awaiting_email', createdAt: new Date().toISOString() });
      return sendTelegramMessage(botToken, chatId, "يرجى إرسال <b>البريد الإلكتروني</b> للمتابعة:");
    }

    // --- القائمة الرئيسية ---
    if (user) {
      if (text === '💰 الرصيد والمحفظة') {
        return sendTelegramMessage(botToken, chatId, 
          `<b>تقرير المركز المالي 📊</b>\n\n👤 المستثمر: ${user.displayName}\n🏦 الرصيد المتاح: <b>$${user.totalBalance.toLocaleString()}</b>\n📈 صافي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 العقود النشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          { inline_keyboard: [[{ text: "💳 شحن", callback_data: "start_deposit" }, { text: "💸 سحب", callback_data: "start_withdrawal" }]] }
        );
      } else if (text === '💳 شحن الرصيد') {
        const catsSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        const buttons = catsSnap.docs.map(doc => ([{ text: doc.data().name, callback_data: `depcat_${doc.id}` }]));
        return sendTelegramMessage(botToken, chatId, "<b>💳 مركز الشحن المتقدم</b>", { inline_keyboard: buttons });
      } else if (text === '🔬 مختبر العقود') {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let msg = "<b>🔬 العقود الاستثمارية المتاحة:</b>\n\n";
        plansSnap.forEach(p => msg += `💎 <b>${p.data().title}</b>\n💰 العائد: %${p.data().profitPercent}\n⏱️ المدة: ${p.data().durationValue} ${p.data().durationUnit}\n\n`);
        return sendTelegramMessage(botToken, chatId, msg, generateTelegramAppKeyboard(baseUrl));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
