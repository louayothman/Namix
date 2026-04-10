
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment, addDoc, getDoc } from 'firebase/firestore';

/**
 * @fileOverview NOWPayments Multi-Wallet IPN Monitor v2.0
 * محرك مراقبة ذكي يتحقق من العملة والعنوان لحقن الرصيد بدقة متناهية.
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
      // البحث عن المستخدم الذي يملك هذا العنوان لهذه العملة تحديداً
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where(`assignedWallets.${pay_currency}`, "==", pay_address));
      const userSnap = await getDocs(q);

      if (!userSnap.empty) {
        const userDoc = userSnap.docs[0];
        const amount = Number(actually_paid);

        await updateDoc(doc(firestore, "users", userDoc.id), {
          totalBalance: increment(amount)
        });

        await addDoc(collection(firestore, "deposit_requests"), {
          userId: userDoc.id,
          userName: userDoc.data().displayName,
          amount,
          methodName: `Auto-Sync (${pay_currency.toUpperCase()})`,
          status: "approved",
          isAutoAudited: true,
          createdAt: new Date().toISOString()
        });

        await addDoc(collection(firestore, "notifications"), {
          userId: userDoc.id,
          title: "تم حقن السيولة آلياً ⚡",
          message: `تم رصد إيداع بقيمة $${amount} عبر محفظتك المخصصة (${pay_currency.toUpperCase()}). تم تحديث رصيدك بنجاح.`,
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
