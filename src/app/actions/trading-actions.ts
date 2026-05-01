'use server';

/**
 * @fileOverview إجراءات التداول v51.0 - Bot Settlement Notifications
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { notifyTelegramUser } from './telegram-user-actions';

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

    await addDoc(collection(firestore, "notifications"), {
      userId: trade.userId,
      title: result === 'win' ? "اكتمال صفقة ناجحة 💰" : "تسوية عملية تداول",
      message: `تم إغلاق رمز ${trade.symbolCode} بنتيجة ${result === 'win' ? 'ربح محقق' : 'إغلاق مركز'}. القيمة الصافية: $${profit.toFixed(2)}.`,
      type: result === 'win' ? "success" : "info",
      url: `/trade/${trade.symbolId}/history`,
      priority: result === 'win' ? "high" : "medium",
      isRead: false,
      createdAt: new Date().toISOString()
    });

    const outcomeLabel = result === 'win' ? '✅ ربح محقق' : '❌ إغلاق مركز';
    const profitLabel = result === 'win' ? `+$${profit.toFixed(2)}` : `-$${trade.amount.toFixed(2)}`;
    
    const userRefreshed = await getDoc(userRef);
    const newBalance = userRefreshed.data()?.totalBalance || 0;

    await notifyTelegramUser(trade.userId, `📊 *تسوية صفقة: ${trade.symbolCode}*\n\nالنتيجة: ${outcomeLabel}\nالعائد: *${profitLabel}*\n💳 الرصيد الحالي: *$${newBalance.toLocaleString()}*`);

    return { success: true, result };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
