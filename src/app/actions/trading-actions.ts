'use server';

/**
 * @fileOverview NAMIX SOVEREIGN TRADING ACTIONS v3.5
 * Idempotent trade execution and settlement logic.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';

/**
 * Settles an open trade based on the final price at expiration.
 * Added protection against double counting.
 */
export async function settleTrade(tradeId: string, finalPrice: number) {
  try {
    const { firestore } = initializeFirebase();
    const tradeRef = doc(firestore, "trades", tradeId);
    const tradeSnap = await getDoc(tradeRef);
    
    if (!tradeSnap.exists()) return { success: false, error: "Trade not found" };
    
    const trade = tradeSnap.data();
    
    // CRITICAL: Idempotency check - Ensure trade is still open
    // This prevents browser triggers from double-adding profits
    if (trade.status !== 'open') {
      return { success: false, error: "Trade already settled" };
    }
    
    let result: 'win' | 'lose' = 'lose';
    let profit = 0;

    if (trade.tradeType === 'buy') {
      result = finalPrice > trade.entryPrice ? 'win' : 'lose';
    } else {
      result = finalPrice < trade.entryPrice ? 'win' : 'lose';
    }

    // Mark as closed BEFORE updating balance to prevent concurrent triggers from adding twice
    await updateDoc(tradeRef, {
      status: "closed",
      result: result,
      finalPrice: finalPrice,
      profit: result === 'win' ? trade.expectedProfit : -trade.amount,
      updatedAt: new Date().toISOString()
    });

    if (result === 'win') {
      profit = trade.expectedProfit;
      const totalPayout = trade.amount + profit;
      
      // Update User Balance - This happens ONCE because of the status check above
      await updateDoc(doc(firestore, "users", trade.userId), {
        totalBalance: increment(totalPayout),
        totalProfits: increment(profit)
      });

      // Send Notification
      await addDoc(collection(firestore, "notifications"), {
        userId: trade.userId,
        title: "صفقة رابحة! 💰",
        message: `اكتملت صفقة ${trade.symbolCode} بنجاح. حققت ربحاً قدره $${profit.toFixed(2)}.`,
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString()
      });
    } else {
      // Send Notification for loss
      await addDoc(collection(firestore, "notifications"), {
        userId: trade.userId,
        title: "انتهت الصفقة (خسارة) 📉",
        message: `نعتذر، انتهت صفقة ${trade.symbolCode} بخسارة المبلغ المستثمر. حاول مجدداً باستراتيجية مختلفة.`,
        type: "error",
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return { success: true, result };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
