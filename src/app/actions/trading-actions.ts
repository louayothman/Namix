
'use server';

/**
 * @fileOverview إجراءات التداول المحدثة v5.0
 * دمج نظام التنبيهات المعتمد مع نتائج الصفقات.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';

export async function settleTrade(tradeId: string, finalPrice: number) {
  try {
    const { firestore } = initializeFirebase();
    const tradeRef = doc(firestore, "trades", tradeId);
    const tradeSnap = await getDoc(tradeRef);
    
    if (!tradeSnap.exists()) return { success: false, error: "الصفقة غير موجودة" };
    
    const trade = tradeSnap.data();
    if (trade.status !== 'open') return { success: false, error: "الصفقة مغلقة مسبقاً" };
    
    let result: 'win' | 'lose' = 'lose';
    if (trade.tradeType === 'buy') {
      result = finalPrice > trade.entryPrice ? 'win' : 'lose';
    } else {
      result = finalPrice < trade.entryPrice ? 'win' : 'lose';
    }

    const profit = result === 'win' ? trade.expectedProfit : -trade.amount;

    await updateDoc(tradeRef, {
      status: "closed",
      result: result,
      finalPrice: finalPrice,
      profit: profit,
      updatedAt: new Date().toISOString()
    });

    const userRef = doc(firestore, "users", trade.userId);
    if (result === 'win') {
      await updateDoc(userRef, {
        totalBalance: increment(trade.amount + profit),
        totalProfits: increment(profit)
      });
    }

    // إضافة إشعار داخلي (سيقوم NotificationManager بتحويله لـ Push)
    await addDoc(collection(firestore, "notifications"), {
      userId: trade.userId,
      title: "تحديث نتيجة التداول",
      message: `تم إغلاق عملية التداول لرمز ${trade.symbolCode} بنتيجة ${result === 'win' ? 'ربح' : 'إغلاق بدون ربح'}. القيمة النهائية: ${profit.toFixed(2)} دولار.`,
      type: result === 'win' ? "success" : "info",
      url: `/trade/${trade.symbolId}/history`,
      isRead: false,
      createdAt: new Date().toISOString()
    });

    return { success: true, result };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
