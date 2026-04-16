
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';

/**
 * تنفيذ عملية التحويل الداخلي بين الحسابات
 */
export async function executeInternalTransfer(fromId: string, toId: string, amount: number, pin: string) {
  try {
    const { firestore } = initializeFirebase();
    const senderRef = doc(firestore, "users", fromId);
    const senderSnap = await getDoc(senderRef);

    if (!senderSnap.exists()) throw new Error("فشل في تحديد هوية المرسل.");
    const senderData = senderSnap.data();

    // التحقق من الرمز
    if (senderData.securityPin !== pin) {
      return { success: false, error: "رمز PIN غير صحيح." };
    }

    // التحقق من الرصيد الفعلي (خصم الهدية الترحيبية)
    const bonus = senderData.welcomeBonus || 0;
    const available = senderData.totalBalance - bonus;
    if (available < amount) {
      return { success: false, error: "عجز في الرصيد المتاح للتحويل (المبالغ الممنوحة كهدايا غير قابلة للإرسال)." };
    }

    // تنفيذ العملية
    await updateDoc(senderRef, { totalBalance: increment(-amount) });
    await updateDoc(doc(firestore, "users", toId), { totalBalance: increment(amount) });

    // تسجيل العملية في سجل السحوبات للمرسل
    await addDoc(collection(firestore, "withdraw_requests"), {
      userId: fromId,
      userName: senderData.displayName,
      amount: amount,
      methodName: "تحويل داخلي (Namix)",
      status: "approved",
      targetUserId: toId,
      createdAt: new Date().toISOString()
    });

    // تسجيل العملية في سجل الإيداعات للمستقبل
    const recipientSnap = await getDoc(doc(firestore, "users", toId));
    await addDoc(collection(firestore, "deposit_requests"), {
      userId: toId,
      userName: recipientSnap.data()?.displayName || "مستثمر",
      amount: amount,
      methodName: "استلام داخلي (Namix)",
      status: "approved",
      senderUserId: fromId,
      createdAt: new Date().toISOString()
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
