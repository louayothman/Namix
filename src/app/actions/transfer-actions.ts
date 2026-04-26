
'use server';

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { sendFinancialNotification } from './notification-actions';

/**
 * تنفيذ عملية التحويل الداخلي بين الحسابات مع نظام إشعارات وتوثيق رقمي
 */
export async function executeInternalTransfer(fromId: string, toId: string, amount: number, pin: string) {
  try {
    const { firestore } = initializeFirebase();
    
    const senderRef = doc(firestore, "users", fromId);
    const senderSnap = await getDoc(senderRef);
    if (!senderSnap.exists()) throw new Error("فشل في تحديد هوية المرسل.");
    const senderData = senderSnap.data();

    const recipientRef = doc(firestore, "users", toId);
    const recipientSnap = await getDoc(recipientRef);
    if (!recipientSnap.exists()) throw new Error("فشل في تحديد هوية المستقبل.");
    const recipientData = recipientSnap.data();

    if (senderData.securityPin !== pin) {
      return { success: false, error: "رمز PIN غير صحيح." };
    }

    const bonus = senderData.welcomeBonus || 0;
    const available = (senderData.totalBalance || 0) - bonus;
    if (available < amount) {
      return { success: false, error: "عجز في الرصيد المتاح للتحويل (المبالغ الممنوحة كهدية مخصصة للاستثمار فقط)." };
    }

    const transactionHash = Date.now().toString() + Math.floor(1000 + Math.random() * 9000).toString();

    await updateDoc(senderRef, { totalBalance: increment(-amount) });
    await updateDoc(recipientRef, { totalBalance: increment(amount) });

    await addDoc(collection(firestore, "internal_transfers"), {
      hash: transactionHash, fromUserId: fromId, fromUserName: senderData.displayName,
      toUserId: toId, toUserName: recipientData.displayName, amount: amount,
      createdAt: new Date().toISOString()
    });

    // تسجيل العمليات في السجلات المالية
    await addDoc(collection(firestore, "withdraw_requests"), {
      userId: fromId, userName: senderData.displayName, amount: amount, methodName: "تحويل داخلي", status: "approved", transactionId: transactionHash, createdAt: new Date().toISOString()
    });
    await addDoc(collection(firestore, "deposit_requests"), {
      userId: toId, userName: recipientData.displayName, amount: amount, methodName: "استلام داخلي", status: "approved", transactionId: transactionHash, createdAt: new Date().toISOString()
    });

    // إطلاق الإشعارات عبر المحرك المركزي (ستظهر كـ Push في شاشة القفل)
    await sendFinancialNotification(fromId, 'send', amount, `إلى: ${recipientData.displayName}`);
    await sendFinancialNotification(toId, 'receive', amount);

    return { success: true, hash: transactionHash };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
