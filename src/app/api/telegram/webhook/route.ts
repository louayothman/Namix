
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { sendTelegramMessage, generateTelegramAppKeyboard, generateGuestKeyboard } from '@/lib/telegram-bot';
import { sendOTPEmail } from '@/app/actions/auth-actions';

/**
 * @fileOverview NAMIX NEXUS CONVERSATIONAL ENGINE v3.0
 * محرك المحادثة السيادي - يدعم إنشاء الحساب والعمليات الحيوية داخل الدردشة.
 */

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    if (!update || !update.message || !update.message.chat) return NextResponse.json({ ok: true });

    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "telegram"));
    const config = configSnap.data();
    if (!config || !config.botToken) return NextResponse.json({ ok: true });

    const chatId = update.message.chat.id.toString();
    const text = update.message.text || "";
    const botToken = config.botToken;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://namix.pro";

    // 1. جلب جلسة المستخدم أو حالته الحالية
    const sessionRef = doc(firestore, "telegram_sessions", chatId);
    const sessionSnap = await getDoc(sessionRef);
    const session = sessionSnap.exists() ? sessionSnap.data() : null;

    // 2. البحث عن المستخدم المرتبط
    const userQ = query(collection(firestore, "users"), where("telegramChatId", "==", chatId));
    const userSnap = await getDocs(userQ);
    const user = !userSnap.empty ? { id: userSnap.docs[0].id, ...userSnap.docs[0].data() as any } : null;

    // --- معالجة الأوامر الأساسية ---
    if (text.startsWith('/start')) {
      await deleteDoc(sessionRef); // تصفير الجلسة عند البدء
      if (user) {
        await sendTelegramMessage(botToken, chatId, 
          `<b>مرحباً بك في قمرة ناميكس السيادية 🛡️</b>\n\nأهلاً <b>${user.displayName}</b>، أصولك تحت الحماية والنمو. استخدم القائمة أدناه للتحكم الكامل:`,
          generateTelegramAppKeyboard(baseUrl)
        );
      } else {
        await sendTelegramMessage(botToken, chatId, 
          `<b>مرحباً بك في ناميكس نكسوس 🚀</b>\n\nأنت الآن في قلب نظام إدارة الأصول الأكثر تطوراً. يمكنك البدء بإنشاء حسابك أو ربط حسابك الحالي:`,
          generateGuestKeyboard(baseUrl)
        );
      }
      return NextResponse.json({ ok: true });
    }

    // --- محرك إنشاء الحساب التفاعلي (Signup Flow) ---
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
      await sendTelegramMessage(botToken, chatId, 
        `<b>تم إنشاء هويتك السيادية بنجاح! 🎉</b>\n\nمرحباً بك في عائلة ناميكس. يمكنك الآن البدء بشحن رصيدك وتفعيل عقودك الأولى.`,
        generateTelegramAppKeyboard(baseUrl)
      );
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
        const symsSnap = await getDocs(query(collection(firestore, "trading_symbols"), where("isActive", "==", true), limit(5)));
        let message = "<b>📊 حالة الأسواق الرئيسية الآن:</b>\n\n";
        symsSnap.forEach(s => {
          const d = s.data();
          message += `• ${d.code}: <b>$${d.currentPrice?.toLocaleString()}</b>\n`;
        });
        message += "\n<i>افتح واجهة التداول لتنفيذ الصفقات الوميضية.</i>";
        await sendTelegramMessage(botToken, chatId, message, generateTelegramAppKeyboard(baseUrl));
      } else {
        await sendTelegramMessage(botToken, chatId, "يرجى استخدام لوحة التحكم للوصول السريع للميزات:", generateTelegramAppKeyboard(baseUrl));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
