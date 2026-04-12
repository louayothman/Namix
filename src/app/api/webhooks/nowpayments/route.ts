
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';

/**
 * @fileOverview مراقب الإيداع الآلي المطور v4.0 - Global Mapping Lookup
 * تم تحويل آلية البحث لتعتمد على wallet_mappings لضمان إضافة الرصيد اللحظية للمستثمر.
 */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('x-nowpayments-sig');
    
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const ipnSecret = configSnap?.data()?.nowPaymentsIpnSecret;

    if (ipnSecret && sig) {
      const hmac = crypto.createHmac('sha512', ipnSecret);
      const sortedBody = JSON.stringify(JSON.parse(body), Object.keys(JSON.parse(body)).sort());
      hmac.update(sortedBody);
      const signature = hmac.digest('hex');
      if (signature !== sig) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const { payment_status, pay_address, actually_paid, pay_currency } = data;

    // دعم حالات النجاح المختلفة لضمان وصول الرصيد
    if (['finished', 'confirmed', 'partially_paid'].includes(payment_status)) {
      
      // استخدام مخطط الربط العالمي للتعرف الفوري على المستثمر
      const mappingSnap = await getDoc(doc(firestore, "wallet_mappings", pay_address.toLowerCase()));
      
      if (mappingSnap.exists()) {
        const { userId, userName } = mappingSnap.data();
        const amount = Number(actually_paid);

        // جلب إعدادات المكافآت
        const vaultSnap = await getDoc(doc(firestore, "system_settings", "vault_bonus"));
        let bonus = 0;
        let bonusPercent = 0;
        if (vaultSnap.exists()) {
          const bonuses = vaultSnap.data().depositBonuses || [];
          const tier = bonuses.find((t: any) => amount >= t.min && amount <= (t.max || Infinity));
          if (tier) {
            bonusPercent = tier.percent;
            bonus = (amount * bonusPercent) / 100;
          }
        }

        // تنفيذ الإضافة المالية
        await updateDoc(doc(firestore, "users", userId), {
          totalBalance: increment(amount + bonus)
        });

        // توثيق المعاملة
        await addDoc(collection(firestore, "deposit_requests"), {
          userId,
          userName,
          amount,
          approvedAmount: amount,
          bonusApplied: bonus,
          bonusPercent,
          methodName: `آلية المزامنة (${pay_currency.toUpperCase()})`,
          status: "approved",
          isAutoAudited: true,
          createdAt: new Date().toISOString()
        });

        // إرسال التنبيه اللحظي
        await addDoc(collection(firestore, "notifications"), {
          userId,
          title: "تم تأكيد الإيداع الآلي ✅",
          message: `تم رصد إيداع بقيمة $${amount} عبر محفظتك المخصصة. تم تحديث رصيدك بنجاح ${bonus > 0 ? `مع مكافأة $${bonus}` : ''}.`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook Logic Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
