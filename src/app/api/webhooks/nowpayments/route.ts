import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, getDoc } from 'firebase/firestore';

/**
 * @fileOverview مراقب الإيداع الآلي المطور v3.0 - NOWPayments Multi-Wallet Monitor
 * محرك مراقبة ذكي يتحقق من العملة والعنوان ويقوم بحساب المكافآت آلياً لتنبيه المستثمر فوراً.
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
      hmac.update(JSON.stringify(JSON.parse(body), Object.keys(JSON.parse(body)).sort()));
      const signature = hmac.digest('hex');
      if (signature !== sig) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const { payment_status, pay_address, actually_paid, pay_currency } = data;

    if (payment_status === 'finished') {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where(`assignedWallets.${pay_currency}`, "==", pay_address));
      const userSnap = await getDocs(q);

      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const amount = Number(actually_paid);

        // حساب المكافآت من إعدادات الخزنة
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

        await updateDoc(doc(firestore, "users", userDoc.id), {
          totalBalance: increment(amount + bonus)
        });

        await addDoc(collection(firestore, "deposit_requests"), {
          userId: userDoc.id,
          userName: userDoc.data().displayName,
          amount,
          approvedAmount: amount,
          bonusApplied: bonus,
          bonusPercent,
          methodName: `آلية المزامنة (${pay_currency.toUpperCase()})`,
          status: "approved",
          isAutoAudited: true,
          createdAt: new Date().toISOString()
        });

        await addDoc(collection(firestore, "notifications"), {
          userId: userDoc.id,
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
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
