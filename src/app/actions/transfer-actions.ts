
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';

/**
 * تنفيذ عملية التحويل الداخلي بين الحسابات مع نظام إشعارات وتوثيق رقمي
 */
export async function executeInternalTransfer(fromId: string, toId: string, amount: number, pin: string) {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. جلب بيانات المرسل والمستقبل
    const senderRef = doc(firestore, "users", fromId);
    const senderSnap = await getDoc(senderRef);
    if (!senderSnap.exists()) throw new Error("فشل في تحديد هوية المرسل.");
    const senderData = senderSnap.data();

    const recipientRef = doc(firestore, "users", toId);
    const recipientSnap = await getDoc(recipientRef);
    if (!recipientSnap.exists()) throw new Error("فشل في تحديد هوية المستقبل.");
    const recipientData = recipientSnap.data();

    // 2. التحقق من رمز PIN
    if (senderData.securityPin !== pin) {
      return { success: false, error: "رمز PIN غير صحيح." };
    }

    // 3. التحقق من الرصيد الفعلي (استبعاد الهدية الترحيبية)
    const bonus = senderData.welcomeBonus || 0;
    const available = senderData.totalBalance - bonus;
    if (available < amount) {
      return { success: false, error: "عجز في الرصيد المتاح للتحويل (المبالغ الممنوحة كهدية غير قابلة للإرسال)." };
    }

    // 4. توليد رقم هاش فريد (أرقام فقط)
    const transactionHash = Date.now().toString() + Math.floor(1000 + Math.random() * 9000).toString();

    // 5. تنفيذ العمليات المالية
    await updateDoc(senderRef, { totalBalance: increment(-amount) });
    await updateDoc(recipientRef, { totalBalance: increment(amount) });

    // 6. حفظ العملية في مجموعة التحويلات الداخلية
    await addDoc(collection(firestore, "internal_transfers"), {
      hash: transactionHash,
      fromUserId: fromId,
      fromUserName: senderData.displayName,
      toUserId: toId,
      toUserName: recipientData.displayName,
      amount: amount,
      createdAt: new Date().toISOString()
    });

    // 7. تسجيل العملية في سجل السحوبات للمرسل
    await addDoc(collection(firestore, "withdraw_requests"), {
      userId: fromId,
      userName: senderData.displayName,
      amount: amount,
      methodName: "تحويل داخلي (Namix)",
      status: "approved",
      targetUserId: toId,
      transactionId: transactionHash,
      createdAt: new Date().toISOString()
    });

    // 8. تسجيل العملية في سجل الإيداعات للمستقبل
    await addDoc(collection(firestore, "deposit_requests"), {
      userId: toId,
      userName: recipientData.displayName,
      amount: amount,
      methodName: "استلام داخلي (Namix)",
      status: "approved",
      senderUserId: fromId,
      transactionId: transactionHash,
      createdAt: new Date().toISOString()
    });

    // 9. إرسال الإشعار للمرسل
    await addDoc(collection(firestore, "notifications"), {
      userId: fromId,
      title: transactionHash,
      message: `تم إرسال مبلغ $${amount.toLocaleString()} إلى المستخدم ${recipientData.displayName}`,
      type: "info",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // 10. إرسال الإشعار للمستقبل
    await addDoc(collection(firestore, "notifications"), {
      userId: toId,
      title: transactionHash,
      message: `تم استلام مبلغ $${amount.toLocaleString()} من المستخدم ${senderData.displayName}`,
      type: "success",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return { success: true, hash: transactionHash };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
