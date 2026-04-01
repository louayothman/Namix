
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc, addDoc, increment } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { sendOTPEmail } from '@/app/actions/auth-actions';
import { verifyBinanceDeposit } from '@/app/actions/binance-actions';

/**
 * @fileOverview NAMIX NEXUS CONVERSATIONAL ENGINE v5.0
 * محرك المحادثة المتقدم - يدعم الشحن التفاعلي، التداول، وإنشاء الحسابات.
 * تم تطهير كافة النصوص من مصطلحات "السيادة".
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });
    const botToken = config.botToken;

    // --- معالجة الـ Callback Queries (أزرار التفاعل) ---
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id.toString();
      const data = update.callback_query.data;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

      if (!user) return NextResponse.json({ ok: true });

      // 1. تنفيذ صفقات من إشارات
      if (data.startsWith('exec_')) {
        const symbolId = data.split('_')[1];
        const tradeType = data.split('_')[2];
        await setDoc(doc(firestore, "telegram_sessions", chatId), { 
          step: 'awaiting_trade_amount', 
          symbolId, 
          tradeType,
          createdAt: new Date().toISOString() 
        }, { merge: true });
        
        await sendTelegramMessage(botToken, chatId, `<b>🚀 بدء تنفيذ صفقة ${tradeType === 'buy' ? 'شراء 📈' : 'بيع 📉'}</b>\n\nيرجى إرسال <b>المبلغ</b> الذي ترغب بالتداول به ($):`);
      }

      // 2. اختيار مدة الصفقة
      if (data.startsWith('dur_')) {
        const durationSeconds = parseInt(data.split('_')[1]);
        const sessionSnap = await getDoc(doc(firestore, "telegram_sessions", chatId));
        const session = sessionSnap.data();

        if (session?.step === 'awaiting_trade_duration') {
          if (user.totalBalance < session.amount) {
            await sendTelegramMessage(botToken, chatId, "❌ <b>عجز في الرصيد</b>\n\nرصيدك الحالي غير كافٍ. هل ترغب في شحن محفظتك الآن؟", {
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
            userId: user.id,
            userName: user.displayName,
            symbolId: session.symbolId,
            symbolCode: symbolData?.code || "ASSET",
            tradeType: session.tradeType,
            amount: session.amount,
            entryPrice,
            profitRate,
            expectedProfit: (session.amount * profitRate) / 100,
            status: "open",
            result: "pending",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + durationSeconds * 1000).toISOString(),
            createdAt: new Date().toISOString()
          });

          await updateDoc(doc(firestore, "users", user.id), { totalBalance: increment(-session.amount) });
          await deleteDoc(doc(firestore, "telegram_sessions", chatId));
          await sendTelegramMessage(botToken, chatId, `<b>✅ تم إطلاق الصفقة بنجاح!</b>\n\nالمبلغ: <b>$${session.amount}</b>\nالمدة: <b>${durationSeconds} ثانية</b>\n\n<i>سيتم إخطارك بالنتيجة فور الإغلاق.</i>`, generateTelegramAppKeyboard(baseUrl));
        }
      }

      // 3. بدء مسار شحن الرصيد التفاعلي
      if (data === 'start_deposit') {
        const catsSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        const buttons = catsSnap.docs.map(doc => ([{ text: doc.data().name, callback_data: `depcat_${doc.id}` }]));
        
        await sendTelegramMessage(botToken, chatId, "<b>💳 مركز شحن الرصيد المتقدم</b>\n\nيرجى اختيار فئة الإيداع المطلوبة:", { inline_keyboard: buttons });
      }

      // 4. اختيار الفئة -> عرض البوابات
      if (data.startsWith('depcat_')) {
        const catId = data.split('_')[1];
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        if (catSnap.exists()) {
          const portals = catSnap.data().portals?.filter((p: any) => p.isActive) || [];
          const buttons = portals.map((p: any) => ([{ text: p.name, callback_data: `depportal_${catId}_${p.id}` }]));
          await sendTelegramMessage(botToken, chatId, `<b>📂 فئة: ${catSnap.data().name}</b>\n\nاختر بوابة الدفع المناسبة لك:`, { inline_keyboard: buttons });
        }
      }

      // 5. اختيار البوابة -> عرض التعليمات وطلب البيانات
      if (data.startsWith('depportal_')) {
        const [_, catId, portalId] = data.split('_');
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        const portal = catSnap.data()?.portals?.find((p: any) => p.id === portalId);
        
        if (portal) {
          let message = `<b>🛠️ بوابة: ${portal.name}</b>\n\n<b>📝 التعليمات:</b>\n${portal.instructions}\n\n`;
          if (portal.walletAddress) {
            message += `<b>🏦 العنوان:</b>\n<code>${portal.walletAddress}</code>\n\n`;
          }
          
          if (portal.isBinanceLinked) {
            message += `<i>⚠️ هذه البوابة مرتبطة بنظام التدقيق الآلي.</i>\n\nيرجى إرسال <b>رقم العملية (TXID)</b> الآن لتوثيق الإيداع فوراً:`;
            await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_txid', catId, portalId }, { merge: true });
          } else {
            message += `يرجى إرسال <b>المبلغ ($)</b> الذي قمت بتحويله الآن:`;
            await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'awaiting_dep_amount', catId, portalId }, { merge: true });
          }
          await sendTelegramMessage(botToken, chatId, message);
        }
      }

      return NextResponse.json({ ok: true });
    }

    // --- معالجة الرسائل النصية ---
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
          await sendTelegramMessage(botToken, chatId, `<b>تم الربط بنجاح! 🎉</b>\n\nأهلاً بك يا <b>${linkSnap.docs[0].data().displayName}</b>. حسابك الآن مربوط بمركز العمليات اللحظي.`, generateTelegramAppKeyboard(baseUrl));
          return NextResponse.json({ ok: true });
        }
      }
      await deleteDoc(sessionRef);
      if (user) {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في مركز ناميكس المتقدم 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الإدارة الاحترافية. استخدم القائمة أدناه للتحكم:`, generateTelegramAppKeyboard(baseUrl));
      } else {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nبوابتك المتطورة لإدارة الأصول الرقمية. يمكنك البدء بإنشاء حسابك أو ربط حسابك الحالي:`, generateGuestKeyboard(baseUrl));
      }
      return NextResponse.json({ ok: true });
    }

    // --- معالجة خطوات الشحن النصية ---
    if (session?.step === 'awaiting_dep_amount' && user) {
      const amt = parseFloat(text);
      if (isNaN(amt) || amt <= 0) return sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال مبلغ صحيح.");
      await setDoc(sessionRef, { step: 'awaiting_dep_proof', amount: amt }, { merge: true });
      await sendTelegramMessage(botToken, chatId, `تم تسجيل مبلغ <b>$${amt}</b>.\n\nأرسل الآن <b>رقم العملية (TXID)</b> أو أي إثبات آخر لإتمام الطلب:`);
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_dep_proof' && user) {
      await addDoc(collection(firestore, "deposit_requests"), {
        userId: user.id,
        userName: user.displayName,
        amount: session.amount,
        methodId: session.portalId,
        methodName: "Telegram Deposit",
        transactionId: text,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      await deleteDoc(sessionRef);
      await sendTelegramMessage(botToken, chatId, "<b>✅ تم استلام طلب الشحن بنجاح</b>\n\nجاري تدقيق البيانات من قبل القسم المختص. سيتم تحديث رصيدك خلال 24 ساعة كحد أقصى.", generateTelegramAppKeyboard(baseUrl));
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_txid' && user) {
      await sendTelegramMessage(botToken, chatId, "⏳ <b>جاري التحقق الرقمي من العملية...</b>");
      const catSnap = await getDoc(doc(firestore, "deposit_methods", session.catId));
      const portal = catSnap.data()?.portals?.find((p: any) => p.id === session.portalId);
      
      const res = await verifyBinanceDeposit(text, 0, portal?.asset || "USDT");
      if (res.success && res.data) {
        await addDoc(collection(firestore, "deposit_requests"), {
          userId: user.id, userName: user.displayName, amount: res.data.amount, transactionId: text, status: "approved", isAutoAudited: true, createdAt: new Date().toISOString()
        });
        await updateDoc(doc(firestore, "users", user.id), { totalBalance: increment(res.data.amount) });
        await deleteDoc(sessionRef);
        await sendTelegramMessage(botToken, chatId, `<b>✨ تم الشحن التلقائي بنجاح!</b>\n\nتم التحقق من العملية وإضافة <b>$${res.data.amount}</b> لمحفظتك فوراً.`, generateTelegramAppKeyboard(baseUrl));
      } else {
        await sendTelegramMessage(botToken, chatId, `❌ <b>تعذر التوثيق الآلي</b>\n\nالسبب: ${res.error}\n\nيرجى التأكد من الرمز والمحاولة مرة أخرى أو التواصل مع الدعم.`);
      }
      return NextResponse.json({ ok: true });
    }

    // --- معالجة إنشاء الحساب ---
    if (text === '✨ إنشاء حساب جديد') {
      await setDoc(sessionRef, { step: 'awaiting_email', createdAt: new Date().toISOString() });
      await sendTelegramMessage(botToken, chatId, "أهلاً بك في النخبة. يرجى إرسال <b>البريد الإلكتروني</b> للمتابعة:");
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_email') {
      if (!text.includes('@')) return sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال بريد صحيح.");
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await sendOTPEmail(text, otp);
      await setDoc(sessionRef, { step: 'awaiting_otp', email: text, otp }, { merge: true });
      await sendTelegramMessage(botToken, chatId, `أرسلنا رمز أمان إلى <b>${text}</b>. أدخله هنا:`);
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_otp') {
      if (text !== session.otp) return sendTelegramMessage(botToken, chatId, "❌ الرمز غير صحيح. حاول مجدداً:");
      await setDoc(sessionRef, { step: 'awaiting_name' }, { merge: true });
      await sendTelegramMessage(botToken, chatId, "✅ تم التحقق. ما هو <b>اسمك الكامل</b> المعتمد؟");
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_name') {
      await setDoc(sessionRef, { step: 'awaiting_password', name: text }, { merge: true });
      await sendTelegramMessage(botToken, chatId, `ممتاز يا ${text}. أخيراً، أرسل <b>كلمة المرور</b> (6 خانات+):`);
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_password') {
      if (text.length < 6) return sendTelegramMessage(botToken, chatId, "❌ قصيرة جداً. أرسل كلمة أقوى:");
      const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
      await setDoc(doc(firestore, "users", userId), {
        id: userId, email: session.email, displayName: session.name, password: text, role: "user", telegramChatId: chatId, totalBalance: 0, createdAt: new Date().toISOString()
      });
      await deleteDoc(sessionRef);
      await sendTelegramMessage(botToken, chatId, `<b>تم إنشاء هويتك الاحترافية بنجاح! 🎉</b>\n\nأهلاً بك في عائلة ناميكس.`, generateTelegramAppKeyboard(baseUrl));
      return NextResponse.json({ ok: true });
    }

    // --- القائمة الرئيسية للمسجلين ---
    if (user) {
      if (text === '💰 الرصيد والمحفظة') {
        await sendTelegramMessage(botToken, chatId, 
          `<b>تقرير المركز المالي 📊</b>\n\n👤 المستثمر: ${user.displayName}\n🏦 الرصيد المتاح: <b>$${user.totalBalance.toLocaleString()}</b>\n📈 صافي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 العقود النشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          { inline_keyboard: [[{ text: "💳 شحن الرصيد فوري", callback_data: "start_deposit" }]] }
        );
      } else if (text === '💳 شحن الرصيد') {
        const catsSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        const buttons = catsSnap.docs.map(doc => ([{ text: doc.data().name, callback_data: `depcat_${doc.id}` }]));
        await sendTelegramMessage(botToken, chatId, "<b>💳 مركز شحن الرصيد المتقدم</b>\n\nاختر فئة الإيداع:", { inline_keyboard: buttons });
      } else if (text === '🔬 مختبر العقود') {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let msg = "<b>🔬 العقود الاستثمارية المتاحة:</b>\n\n";
        plansSnap.forEach(p => {
          const d = p.data();
          msg += `💎 <b>${d.title}</b>\n💰 العائد: %${d.profitPercent}\n⏱️ المدة: ${d.durationValue} ${d.durationUnit}\n\n`;
        });
        await sendTelegramMessage(botToken, chatId, msg, generateTelegramAppKeyboard(baseUrl));
      } else {
        await sendTelegramMessage(botToken, chatId, "يرجى استخدام الأزرار أدناه للوصول السريع للميزات:", generateTelegramAppKeyboard(baseUrl));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
