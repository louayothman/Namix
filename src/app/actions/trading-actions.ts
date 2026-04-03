
'use server';

/**
 * @fileOverview NAMIX SOVEREIGN TRADING ACTIONS v3.6
 * Idempotent trade execution and settlement logic with Telegram integration.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, updateDoc, increment, addDoc, collection } from 'firebase/firestore';
import { sendTelegramNotification, broadcastSignalOutcome } from './auth-actions';

/**
 * Settles an open trade based on the final price at expiration.
 */
export async function settleTrade(tradeId: string, finalPrice: number) {
  try {
    const { firestore } = initializeFirebase();
    const tradeRef = doc(firestore, "trades", tradeId);
    const tradeSnap = await getDoc(tradeRef);
    
    if (!tradeSnap.exists()) return { success: false, error: "Trade not found" };
    
    const trade = tradeSnap.data();
    
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
      
      await updateDoc(doc(firestore, "users", trade.userId), {
        totalBalance: increment(totalPayout),
        totalProfits: increment(profit)
      });

      // App Notification
      await addDoc(collection(firestore, "notifications"), {
        userId: trade.userId,
        title: "صفقة رابحة! 💰",
        message: `اكتملت صفقة ${trade.symbolCode} بنجاح. حققت ربحاً قدره $${profit.toFixed(2)}.`,
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Telegram Personal Notification
      await sendTelegramNotification(trade.userId, 
        `💰 <b>صفقة رابحة!</b>\n\nاكتملت صفقاتك على <b>${trade.symbolCode}</b> بنجاح.\n\n📈 الربح الصافي: <b>$${profit.toFixed(2)}</b>\n🏦 المبلغ المسترد: <b>$${totalPayout.toFixed(2)}</b>\n\n<i>تم التحديث عبر محرك ناميكس السيادي.</i>`
      );

      // Global Signal Outcome Broadcast
      await broadcastSignalOutcome(trade.symbolCode, 'win', profit);
    } else {
      await addDoc(collection(firestore, "notifications"), {
        userId: trade.userId,
        title: "انتهت الصفقة (خسارة) 📉",
        message: `نعتذر، انتهت صفقة ${trade.symbolCode} بخسارة المبلغ المستثمر. حاول مجدداً باستراتيجية مختلفة.`,
        type: "error",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // Telegram Personal Notification
      await sendTelegramNotification(trade.userId, 
        `📉 <b>انتهت الصفقة (خسارة)</b>\n\nنعتذر، لم يتحرك السوق في اتجاه توقعك لصفقة <b>${trade.symbolCode}</b>.\n\n💸 الخسارة: <b>$${trade.amount.toFixed(2)}</b>\n\n<i>ننصحك بمراجعة إشارات NAMIX AI قبل العملية القادمة.</i>`
      );
    }

    return { success: true, result };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
