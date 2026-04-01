
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc, addDoc, increment } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { sendWeeklyPerformanceReport, sendOTPEmail } from '@/app/actions/auth-actions';

/**
 * @fileOverview NAMIX NEXUS INTERACTIVE CORE v11.0
 * المحرك المركزي المطور - حل مشاكل الشحن، الأسواق، الرصيد الترحيبي، وتكثيف العمليات.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    const { firestore } = initializeFirebase();
    
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });
    const botToken = config.botToken;

    // 1. معالجة العمليات الخلفية (Callback Queries)
    if (update.callback_query) {
      const chatId = update.callback_query.message?.chat.id.toString();
      const data = update.callback_query.data;
      if (!chatId) return NextResponse.json({ ok: true });

      const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
      const userSnap = await getDocs(userQ);
      const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

      // اختيار فئة إيداع
      if (data.startsWith('dep_cat_')) {
        const catId = data.replace('dep_cat_', '');
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        if (catSnap.exists()) {
          const portals = catSnap.data().portals?.filter((p: any) => p.isActive) || [];
          if (portals.length === 0) {
            await sendTelegramMessage(botToken, chatId, "⚠️ نعتذر، لا توجد بوابات نشطة في هذه الفئة حالياً.");
          } else {
            const buttons = portals.map((p: any) => [{ text: `💳 ${p.name}`, callback_data: `dep_port_${catId}_${p.id}` }]);
            await sendTelegramMessage(botToken, chatId, `<b>💳 بوابات ${catSnap.data().name}:</b>\n\nاختر وسيلة الشحن المناسبة لك:`, { inline_keyboard: buttons });
          }
        }
      }

      // اختيار بوابة إيداع محددة
      if (data.startsWith('dep_port_')) {
        const [, , catId, portId] = data.split('_');
        const catSnap = await getDoc(doc(firestore, "deposit_methods", catId));
        const portal = catSnap.data()?.portals?.find((p: any) => p.id === portId);
        if (portal) {
          await setDoc(doc(firestore, "telegram_sessions", chatId), { 
            step: 'AWAITING_DEPOSIT_DATA', 
            catId, 
            portId, 
            portalName: portal.name,
            isBinanceLinked: !!portal.isBinanceLinked,
            asset: portal.asset || "USDT"
          }, { merge: true });

          let msg = `<b>🛠️ تعليمات الشحن عبر ${portal.name}:</b>\n\n${portal.instructions}\n\n`;
          if (portal.walletAddress) {
            msg += `<b>الوجهة:</b> <code>${portal.walletAddress}</code>\n\n`;
          }
          msg += `<i>يرجى إرسال قيمة المبلغ ثم معرف العملية (TXID) في رسالة واحدة، أو إرسال الـ TXID فقط إذا كانت البوابة تدعم التدقيق الآلي.</i>`;
          await sendTelegramMessage(botToken, chatId, msg);
        }
      }

      // تفعيل خطة استثمارية
      if (data.startsWith('activate_plan_')) {
        const planId = data.replace('activate_plan_', '');
        const planSnap = await getDoc(doc(firestore, "investment_plans", planId));
        if (planSnap.exists()) {
          const plan = planSnap.data();
          await setDoc(doc(firestore, "telegram_sessions", chatId), { step: 'AWAITING_PLAN_AMOUNT', planId, planTitle: plan.title, min: plan.min }, { merge: true });
          await sendTelegramMessage(botToken, chatId, `<b>🔬 تفعيل عقد: ${plan.title}</b>\n\nيرجى إرسال مبلغ الاستثمار ($):\n<i>الحد الأدنى المطلوب: $${plan.min}</i>`);
        }
      }

      return NextResponse.json({ ok: true });
    }

    // 2. معالجة الرسائل النصية
    if (!update.message || !update.message.chat) return NextResponse.json({ ok: true });
    const chatId = update.message.chat.id.toString();
    const text = (update.message.text || "").trim();

    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    const sessionRef = doc(firestore, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() : null;

    // أوامر البدء
    if (text.startsWith('/start')) {
      if (user) {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك مجدداً في ناميكس نكسوس 🚀</b>\n\nأهلاً <b>${user.displayName}</b>، حسابك المتقدم جاهز للعمليات.`, generateTelegramAppKeyboard());
      } else {
        await sendTelegramMessage(botToken, chatId, `<b>مرحباً بك في ناميكس نكسوس المطور 💎</b>\n\nبوابتك النخبوية لإدارة الأصول الرقمية والتداول الذكي.`, generateGuestKeyboard());
      }
      return NextResponse.json({ ok: true });
    }

    // تدفق إنشاء الحساب مع الرصيد الترحيبي
    if (!user) {
      if (text === '✨ إنشاء حساب جديد') {
        await setDoc(sessionRef, { step: 'REG_EMAIL' });
        await sendTelegramMessage(botToken, chatId, "<b>✨ بدء بروتوكول التسجيل</b>\n\nيرجى تزويدنا بـ <b>بريدك الإلكتروني</b> الرسمي:");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_EMAIL') {
        if (!text.includes('@')) return sendTelegramMessage(botToken, chatId, "❌ تنسيق البريد غير صالح.");
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await sendOTPEmail(text, otp);
        await updateDoc(sessionRef, { step: 'REG_OTP', email: text, otp });
        await sendTelegramMessage(botToken, chatId, "📩 <b>تم إرسال الرمز!</b>\n\nأدخل الرمز المكون من 6 أرقام لتأكيد هويتك الرقمية:");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_OTP') {
        if (text !== session.otp) return sendTelegramMessage(botToken, chatId, "❌ رمز غير صحيح. حاول مجدداً.");
        await updateDoc(sessionRef, { step: 'REG_NAME' });
        await sendTelegramMessage(botToken, chatId, "✅ <b>تم التحقق.</b>\n\nالآن، ما هو اسمك الكامل المعتمد؟");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_NAME') {
        await updateDoc(sessionRef, { step: 'REG_PASS', fullName: text });
        await sendTelegramMessage(botToken, chatId, "🛡️ <b>تثبيت الهوية..</b>\n\nأدخل كلمة مرور قوية لتأمين حسابك:");
        return NextResponse.json({ ok: true });
      }

      if (session?.step === 'REG_PASS') {
        setLoading(true);
        const onboardSnap = await getDoc(doc(firestore, "system_settings", "onboarding"));
        const trialBalance = onboardSnap.exists() ? (onboardSnap.data().trialCreditAmount || 0) : 0;
        
        const userId = Math.floor(1000000 + Math.random() * 9000000).toString();
        await setDoc(doc(firestore, "users", userId), {
          id: userId,
          email: session.email,
          displayName: session.fullName,
          password: text,
          role: "user",
          totalBalance: trialBalance,
          telegramChatId: chatId,
          createdAt: new Date().toISOString()
        });
        await deleteDoc(sessionRef);
        await sendTelegramMessage(botToken, chatId, `<b>تهانينا يا ${session.fullName}! 🎉</b>\n\nتم تفعيل حسابك بنجاح.\n💰 حصلت على <b>$${trialBalance}</b> كرصيد نمو ترحيبي.`, generateTelegramAppKeyboard());
        return NextResponse.json({ ok: true });
      }
    }

    // أوامر المستثمرين
    if (user) {
      if (text === '📊 الأسواق الحية') {
        const symSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true), limit(10)));
        let msg = "<b>📈 نبض الأسواق اللحظي (Binance Sync):</b>\n\n";
        symSnap.forEach(s => {
          const d = s.data();
          msg += `• <b>${d.code}</b>: <code>$${(d.currentPrice || 0).toLocaleString()}</code>\n`;
        });
        await sendTelegramMessage(botToken, chatId, msg + "\n<i>يتم التحديث كل 10 ثوانٍ عبر بروتوكول ناميكس المتقدم.</i>");
        return NextResponse.json({ ok: true });
      }

      if (text === '🔬 مختبر العقود') {
        const plansSnap = await getDocs(query(collection(firestore, "investment_plans"), where("isActive", "==", true)));
        let msg = "<b>🔬 العقود الاستثمارية المتاحة:</b>\n\n";
        const buttons = [];
        plansSnap.forEach(p => {
          const d = p.data();
          msg += `💎 <b>${d.title}</b>\n💰 ربح: %${d.profitPercent} | ⏱️ مدة: ${d.durationValue} ${d.durationUnit}\n\n`;
          buttons.push([{ text: `🚀 تفعيل ${d.title}`, callback_data: `activate_plan_${p.id}` }]);
        });
        await sendTelegramMessage(botToken, chatId, msg, { inline_keyboard: buttons });
        return NextResponse.json({ ok: true });
      }

      if (text === '💰 الرصيد والمحفظة') {
        await sendTelegramMessage(botToken, chatId, 
          `<b>📊 تقرير المحفظة المتقدم</b>\n\n👤 المستثمر: <b>${user.displayName}</b>\n🏦 الرصيد المتاح: <b>$${(user.totalBalance || 0).toLocaleString()}</b>\n📈 إجمالي الأرباح: <b>$${(user.totalProfits || 0).toLocaleString()}</b>\n🚀 عقود نشطة: <b>$${(user.activeInvestmentsTotal || 0).toLocaleString()}</b>`,
          { inline_keyboard: [[{ text: "🔐 إدارة PIN", callback_data: "manage_pin" }]] }
        );
        return NextResponse.json({ ok: true });
      }

      if (text === '💳 شحن الرصيد') {
        const catSnap = await getDocs(query(collection(firestore, "deposit_methods"), where("isActive", "==", true)));
        let msg = "<b>💳 بروتوكول شحن الرصيد</b>\n\nاختر الفئة المطلوبة للإيداع:";
        const buttons = [];
        catSnap.forEach(c => buttons.push([{ text: `📂 ${c.data().name}`, callback_data: `dep_cat_${c.id}` }]));
        await sendTelegramMessage(botToken, chatId, msg, { inline_keyboard: buttons });
        return NextResponse.json({ ok: true });
      }

      if (text === '📊 التقارير والأداء') {
        await sendTelegramMessage(botToken, chatId, "⏳ جاري جرد أدائك الأسبوعي وتوليد التقرير الاستراتيجي...");
        await sendWeeklyPerformanceReport(user.id);
        return NextResponse.json({ ok: true });
      }

      // استقبال بيانات الشحن
      if (session?.step === 'AWAITING_DEPOSIT_DATA') {
        const txid = text;
        await sendTelegramMessage(botToken, chatId, "⏳ جاري التحقق من صحة المعاملة برمجياً...");
        
        if (session.isBinanceLinked) {
          const res = await verifyBinanceDeposit(txid, 0, session.asset);
          if (res.success) {
            const actualAmount = res.data.amount;
            await updateDoc(doc(firestore, "users", user.id), { totalBalance: increment(actualAmount) });
            await addDoc(collection(firestore, "deposit_requests"), {
              userId: user.id, userName: user.displayName, amount: actualAmount, status: "approved", transactionId: txid, createdAt: new Date().toISOString(), isAutoAudited: true
            });
            await sendTelegramMessage(botToken, chatId, `✅ <b>اكتمل الشحن التلقائي!</b>\n\nتم التحقق من $${actualAmount} وإضافتها لمحفظتك فوراً.`);
          } else {
            await sendTelegramMessage(botToken, chatId, "❌ تعذر التوثيق الآلي. يرجى التأكد من الـ TXID أو التواصل مع الدعم.");
          }
        } else {
          await addDoc(collection(firestore, "deposit_requests"), {
            userId: user.id, userName: user.displayName, amount: 0, status: "pending", transactionId: txid, createdAt: new Date().toISOString(), details: { TXID: txid }
          });
          await sendTelegramMessage(botToken, chatId, "✅ <b>تم استلام الإثبات.</b>\n\nسيقوم الفريق التقني بمراجعة طلبك خلال 24 ساعة.");
        }
        await deleteDoc(sessionRef);
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Critical Webhook Error:", e);
    return NextResponse.json({ ok: true });
  }
}
function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

