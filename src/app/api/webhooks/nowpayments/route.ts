import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { notifyTelegramUser } from '@/app/actions/telegram-user-actions';

/**
 * @fileOverview مراقب الإيداع الآلي v12.2 - Bot Notification Update
 */

export async function POST(req: Request) {
  const { firestore } = initializeFirebase();
  const timestamp = new Date().toISOString();
  
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('x-nowpayments-sig');
    const data = JSON.parse(rawBody);

    const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
    const ipnSecret = configSnap?.data()?.nowPaymentsIpnSecret;

    if (ipnSecret && sig) {
      const sortedKeys = Object.keys(data).sort();
      const sortedData: Record<string, any> = {};
      sortedKeys.forEach(key => {
        sortedData[key] = data[key];
      });

      const hmac = crypto.createHmac('sha512', ipnSecret);
      hmac.update(JSON.stringify(sortedData));
      const signature = hmac.digest('hex');
      
      if (signature !== sig) {
        return NextResponse.json({ error: 'Unauthorized Signature' }, { status: 401 });
      }
    }

    if (data.payment_status === 'test') {
      return NextResponse.json({ ok: true });
    }

    const { 
      payment_id, 
      payment_status, 
      price_amount, 
      outcome_amount, 
      purchase_id 
    } = data;

    const depQuery = query(collection(firestore, "deposit_requests"), where("paymentId", "==", payment_id.toString()), limit(1));
    const depSnap = await getDocs(depQuery);

    if (depSnap.empty) return NextResponse.json({ ok: true });

    const depositDoc = depSnap.docs[0];
    const depositData = depositDoc.data();
    const userId = depositData.userId;

    let newStatus = "pending";
    if (['finished', 'confirmed'].includes(payment_status)) newStatus = "approved";
    if (payment_status === 'failed' || payment_status === 'expired') newStatus = "rejected";
    if (payment_status === 'confirming') newStatus = "confirming";

    if (newStatus === "approved" && depositData.status !== "approved") {
      const finalAmountUSD = Number(outcome_amount || price_amount);
      const vaultSnap = await getDoc(doc(firestore, "system_settings", "vault_bonus"));
      let bonus = 0;
      let bonusPercent = 0;
      if (vaultSnap.exists()) {
        const bonuses = vaultSnap.data().depositBonuses || [];
        const tier = bonuses.find((t: any) => finalAmountUSD >= t.min && finalAmountUSD <= (t.max || Infinity));
        if (tier) {
          bonusPercent = tier.percent;
          bonus = (finalAmountUSD * bonusPercent) / 100;
        }
      }

      await updateDoc(doc(firestore, "users", userId), {
        totalBalance: increment(finalAmountUSD + bonus),
        updatedAt: timestamp
      });

      await updateDoc(depositDoc.ref, {
        status: "approved",
        amount: finalAmountUSD,
        approvedAmount: finalAmountUSD,
        bonusApplied: bonus,
        bonusPercent: bonusPercent,
        transactionId: purchase_id || data.payment_id.toString(),
        updatedAt: timestamp
      });

      await addDoc(collection(firestore, "notifications"), {
        userId, title: "تأكيد الإيداع",
        message: `تمت إضافة مبلغ بقيمة $${finalAmountUSD.toFixed(2)} بنجاح.`,
        type: "success", isRead: false, createdAt: timestamp
      });

      const userRefreshed = await getDoc(doc(firestore, "users", userId));
      const newBalance = userRefreshed.data()?.totalBalance || 0;
      await notifyTelegramUser(userId, `✅ *تم رصد إيداع آلي بنجاح!*\n\n💰 المبلغ المعتمد: $${finalAmountUSD.toFixed(2)}\n🎁 مكافأة: $${bonus.toFixed(2)}\n💳 الرصيد الحالي: *$${newBalance.toLocaleString()}*`);
    } else {
      await updateDoc(depositDoc.ref, { status: newStatus, updatedAt: timestamp });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
