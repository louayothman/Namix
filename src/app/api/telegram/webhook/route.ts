
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc, addDoc, increment } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { sendOTPEmail } from '@/app/actions/auth-actions';

/**
 * @fileOverview NAMIX NEXUS CONVERSATIONAL ENGINE v4.0
 * محرك المحادثة السيادي - يدعم التداول المباشر، إنشاء الحسابات، وعرض المحفظة.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    
    // معالجة الـ Callback Queries (ضغطات الأزرار الشفافة)
    if (update.callback_query) {
      const { firestore } = initializeFirebase();
      const chatId = update.callback_query.message.chat.id.toString();
      const data = update.callback_query.data;
      const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
      const botToken = configSnap.data()?.botToken;

      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

      if (!user || !botToken) return NextResponse.json({ ok: true });

      // معالجة بدء تنفيذ صفقة من إشارة
      if (data.startsWith('exec_')) {
        const symbolId = data.split('_')[1];
        const tradeType = data.split('_')[2]; // buy or sell
        await setDoc(doc(firestore, "telegram_sessions", chatId), { 
          step: 'awaiting_trade_amount', 
          symbolId, 
          tradeType,
          createdAt: new Date().toISOString() 
        }, { merge: true });
        
        await sendTelegramMessage(botToken, chatId, `<b>🚀 بدء تنفيذ صفقة ${tradeType === 'buy' ? 'شراء 📈' : 'بيع 📉'}</b>\n\nيرجى إرسال <b>المبلغ</b> الذي ترغب بالتداول به ($):`);
      }

      // معالجة اختيار مدة الصفقة
      if (data.startsWith('dur_')) {
        const durationSeconds = parseInt(data.split('_')[1]);
        const sessionSnap = await getDoc(doc(firestore, "telegram_sessions", chatId));
        const session = sessionSnap.data();

        if (session?.step === 'awaiting_trade_duration') {
          const amount = session.amount;
          const symbolId = session.symbolId;
          const tradeType = session.tradeType;

          // التحقق النهائي من الرصيد
          if (user.totalBalance < amount) {
            await sendTelegramMessage(botToken, chatId, "❌ عجز في السيولة؛ رصيدك الحالي أقل من مبلغ الصفقة.");
            await deleteDoc(doc(firestore, "telegram_sessions", chatId));
            return NextResponse.json({ ok: true });
          }

          // جلب سعر العملة (تبسيطياً نستخدم السعر الحالي المسجل أو نفترض نجاح العملية)
          const symbolSnap = await getDoc(doc(firestore, "trading_symbols", symbolId));
          const symbolData = symbolSnap.data();
          const entryPrice = symbolData?.currentPrice || 0;

          const startTime = new Date();
          const endTime = new Date(startTime.getTime() + durationSeconds * 1000);
          const profitRate = 80; // افتراضي

          // تسجيل الصفقة
          await addDoc(collection(firestore, "trades"), {
            userId: user.id,
            userName: user.displayName,
            symbolId,
            symbolCode: symbolData?.code || "ASSET",
            tradeType,
            amount,
            entryPrice,
            profitRate,
            expectedProfit: (amount * profitRate) / 100,
            status: "open",
            result: "pending",
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            createdAt: startTime.toISOString()
          });

          // خصم الرصيد
          await updateDoc(doc(firestore, "users", user.id), { totalBalance: increment(-amount) });
          await deleteDoc(doc(firestore, "telegram_sessions", chatId));

          await sendTelegramMessage(botToken, chatId, `<b>✅ تم إطلاق الصفقة بنجاح!</b>\n\nالعملية: ${tradeType === 'buy' ? 'شراء 📈' : 'بيع 📉'}\nالمبلغ: <b>$${amount}</b>\nالمدة: <b>${durationSeconds} ثانية</b>\nسعر الدخول: <b>$${entryPrice}</b>\n\n<i>سيتم إخطارك بالنتيجة فور الإغلاق.</i>`, generateTelegramAppKeyboard(""));
        }
      }
      return NextResponse.json({ ok: true });
    }

    if (!update || !update.message || !update.message.chat) return NextResponse.json({ ok: true });

    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });

    const chatId = update.message.chat.id.toString();
    const text = update.message.text || "";
    const botToken = config.botToken;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

    const sessionRef = doc(firestore, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() : null;

    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    if (text.startsWith('/start')) {
      // التعامل مع روابط الربط
      const startParam = text.split(' ')[1];
      if (startParam && startParam.startsWith('LINK-')) {
        const linkQ = query(collection(firestore, "users"), where("tempLinkToken", "==", startParam));
        const linkSnap = await getDocs(linkQ);
        if (!linkSnap.empty) {
          const userDoc = linkSnap.docs[0];
          await updateDoc(userDoc.ref, { telegramChatId: chatId, tempLinkToken: "" });
          await sendTelegramMessage(botToken, chatId, `<b>تم الربط بنجاح! 🎉</b>\n\nأهلاً بك يا <b>${userDoc.data().displayName}</b>. حسابك الآن مرتبط تماماً بنظام الإشعارات والتداول اللحظي.`, generateTelegramAppKeyboard(baseUrl));
          return NextResponse.json({ ok: true });
        }
      }

      await deleteDoc(sessionRef);
      if (user) {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في قمرة ناميكس السيادية 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الحماية والنمو. استخدم القائمة أدناه للتحكم الكامل:`, generateTelegramAppKeyboard(baseUrl));
      } else {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nأنت الآن في قلب نظام إدارة الأصول الأكثر تطوراً. يمكنك البدء بإنشاء حسابك أو ربط حسابك الحالي:`, generateGuestKeyboard(baseUrl));
      }
      return NextResponse.json({ ok: true });
    }

    // --- معالجة تدفق التداول ---
    if (session?.step === 'awaiting_trade_amount' && user) {
      const amt = parseFloat(text);
      if (isNaN(amt) || amt <= 0) {
        await sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال مبلغ صحيح.");
        return NextResponse.json({ ok: true });
      }
      if (user.totalBalance < amt) {
        await sendTelegramMessage(botToken, chatId, `❌ رصيدك الحالي ($${user.totalBalance}) غير كافٍ لتنفيذ هذه الصفقة.`);
        await deleteDoc(sessionRef);
        return NextResponse.json({ ok: true });
      }

      await setDoc(sessionRef, { step: 'awaiting_trade_duration', amount: amt }, { merge: true });
      await sendTelegramMessage(botToken, chatId, `تم تحديد مبلغ <b>$${amt}</b>.\n\nالآن اختر <b>مدة الصفقة</b> من الخيارات أدناه:`, {
        inline_keyboard: [
          [{ text: "⏱️ 30 ثانية", callback_data: "dur_30" }, { text: "⏱️ 60 ثانية", callback_data: "dur_60" }],
          [{ text: "⏱️ 3 دقائق", callback_data: "dur_180" }, { text: "⏱️ 5 دقائق", callback_data: "dur_300" }]
        ]
      });
      return NextResponse.json({ ok: true });
    }

    // --- إنشاء حساب ---
    if (text === '✨ إنشاء حساب جديد') {
      await setDoc(sessionRef, { step: 'awaiting_email', createdAt: new Date().toISOString() });
      await sendTelegramMessage(botToken, chatId, "يرجى إرسال <b>البريد الإلكتروني</b> الذي ترغب بالتسجيل به:");
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_email') {
      if (!text.includes('@')) {
        await sendTelegramMessage(botToken, chatId, "❌ يرجى إدخال بريد إلكتروني صحيح.");
        return NextResponse.json({ ok: true });
      }
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await sendOTPEmail(text, otpCode);
      await setDoc(sessionRef, { step: 'awaiting_otp', email: text, otp: otpCode }, { merge: true });
      await sendTelegramMessage(botToken, chatId, `تم إرسال رمز التحقق إلى <b>${text}</b>. يرجى إدخال الرمز المكون من 6 أرقام هنا:`);
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_otp') {
      if (text !== session.otp) {
        await sendTelegramMessage(botToken, chatId, "❌ الرمز غير صحيح. حاول مجدداً:");
        return NextResponse.json({ ok: true });
      }
      await setDoc(sessionRef, { step: 'awaiting_name' }, { merge: true });
      await sendTelegramMessage(botToken, chatId, "✅ تم التحقق. يرجى إرسال <b>اسمك الكامل</b> المعتمد:");
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_name') {
      await setDoc(sessionRef, { step: 'awaiting_password', name: text }, { merge: true });
      await sendTelegramMessage(botToken, chatId, "ممتاز يا <b>" + text + "</b>. أخيراً، أرسل <b>كلمة المرور</b> التي ترغب بتعيينها (6 خانات على الأقل):");
      return NextResponse.json({ ok: true });
    }

    if (session?.step === 'awaiting_password') {
      if (text.length < 6) {
        await sendTelegramMessage(botToken, chatId, "❌ كلمة المرور قصيرة جداً. أرسل كلمة مرور أقوى:");
        return NextResponse.json({ ok: true });
      }
      const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
      const newUser = {
        id: userId,
        email: session.email,
        displayName: session.name,
        password: text,
        role: "user",
        telegramChatId: chatId,
        totalBalance: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(firestore, "users", userId), newUser);
      await deleteDoc(sessionRef);
      await sendTelegramMessage(botToken, chatId, `<b>تم إنشاء هويتك السيادية بنجاح! 🎉</b>\n\nمرحباً بك في عائلة ناميكس.`, generateTelegramAppKeyboard(baseUrl));
      return NextResponse.json({ ok: true });
    }

    // --- العمليات الحيوية للأعضاء ---
    if (user) {
      if (text === '💰 الرصيد والمحفظة') {
        await sendTelegramMessage(botToken, chatId, 
          `<b>تقرير الملاءة المالية 📊</b>\n\n👤 المستثمر: ${user.displayName}\n🏦 الرصيد المتاح: <b>$${user.totalBalance.toLocaleString()}</b>\n📈 صافي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 العقود النشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          generateTelegramAppKeyboard(baseUrl)
        );
      } else if (text === '🔬 مختبر العقود') {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let message = "<b>🔬 المناهج الاستثمارية المتاحة حالياً:</b>\n\n";
        plansSnap.forEach(p => {
          const d = p.data();
          message += `💎 <b>${d.title}</b>\n💰 العائد: %${d.profitPercent}\n⏱️ المدة: ${d.durationValue} ${d.durationUnit}\n💵 الحد الأدنى: $${d.min}\n\n`;
        });
        message += "<i>لتفعيل أي عقد، يرجى فتح واجهة المختبر أدناه:</i>";
        await sendTelegramMessage(botToken, chatId, message, generateTelegramAppKeyboard(baseUrl));
      } else if (text === '📊 الأسواق الحية') {
        const symsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true), limit(10)));
        let message = "<b>📊 حالة الأسواق الرئيسية الآن:</b>\n\n";
        const inlineKeyboard: any[] = [];
        symsSnap.forEach(s => {
          const d = s.data();
          message += `• ${d.code}: <b>$${d.currentPrice?.toLocaleString()}</b>\n`;
          inlineKeyboard.push([{ text: `📈 تداول ${d.code}`, callback_data: `exec_${s.id}_buy` }]);
        });
        message += "\n<i>اختر عملة لبدء تنفيذ صفقة فورية من تلغرام.</i>";
        await sendTelegramMessage(botToken, chatId, message, { inline_keyboard: inlineKeyboard });
      } else {
        await sendTelegramMessage(botToken, chatId, "يرجى استخدام لوحة التحكم للوصول السريع للميزات:", generateTelegramAppKeyboard(baseUrl));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
