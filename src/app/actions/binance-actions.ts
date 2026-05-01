'use server';

/**
 * @fileOverview آلية التحقق من إيداعات بينانس v11.2 - Bot Notification Update
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, increment, addDoc } from 'firebase/firestore';
import crypto from 'node:crypto';
import { notifyTelegramUser } from './telegram-user-actions';

async function binanceSignedRequest(endpoint: string, params: Record<string, string>, apiKey: string, apiSecret: string) {
  const baseUrl = 'https://api.binance.com';
  const timestamp = Date.now().toString();
  
  const queryParams = new URLSearchParams({ 
    ...params, 
    timestamp,
    recvWindow: "60000" 
  });
  
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(queryParams.toString())
    .digest('hex');
  
  const url = `${baseUrl}${endpoint}?${queryParams.toString()}&signature=${signature}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': apiKey,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    
    return { status: response.status, data: await response.json() };
  } catch (e: any) {
    throw new Error(`Binance Connectivity Error: ${e.message}`);
  }
}

async function getLivePriceInUSDT(coin: string) {
  if (coin.toUpperCase() === 'USDT') return 1;
  try {
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin.toUpperCase()}USDT`);
    const data = await res.json();
    return parseFloat(data.price) || 0;
  } catch (e) {
    console.error("Price Fetch Error:", e);
    return 0;
  }
}

async function getActiveBinanceNodes() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return [];
  
  const data = configSnap.data();
  if (data.nodes && Array.isArray(data.nodes)) {
    return data.nodes.filter((n: any) => n.provider === 'binance' && n.isActive);
  }
  
  if (data.binanceApiKey) {
    return [{ apiKey: data.binanceApiKey, apiSecret: data.binanceApiSecret }];
  }
  
  return [];
}

export async function verifyAndProcessBinanceDeposit(userId: string, txid: string, asset: string = "USDT") {
  try {
    const { firestore } = initializeFirebase();
    const dupQuery = query(collection(firestore, "deposit_requests"), where("transactionId", "==", txid.trim()));
    const dupSnap = await getDocs(dupQuery);
    if (!dupSnap.empty) return { success: false, error: "تم استخدام معرف العملية هذا مسبقاً." };

    const nodes = await getActiveBinanceNodes();
    if (nodes.length === 0) return { success: false, error: "آلية التحقق غير مفعلة." };

    let match = null;
    for (const node of nodes) {
      const res = await binanceSignedRequest('/sapi/v1/capital/deposit/hisrec', { 
        coin: asset.toUpperCase(),
        status: "1" 
      }, node.apiKey, node.apiSecret);

      if (res.status === 429) continue; 
      if (Array.isArray(res.data)) {
        match = res.data.find((d: any) => d.txId.toLowerCase() === txid.trim().toLowerCase());
        if (match) break;
      }
    }

    if (!match) return { success: false, error: "لم يتم العثور على عملية إرسال مطابقة." };

    const coinAmount = Number(match.amount);
    const livePrice = await getLivePriceInUSDT(asset);
    if (livePrice === 0) return { success: false, error: "تعذر جلب سعر العملة اللحظي." };
    
    const amountInUSD = coinAmount * livePrice;
    const vaultSnap = await getDoc(doc(firestore, "system_settings", "vault_bonus"));
    let bonus = 0;
    let bonusPercent = 0;
    if (vaultSnap.exists()) {
      const bonuses = vaultSnap.data().depositBonuses || [];
      const tier = bonuses.find((t: any) => amountInUSD >= t.min && amountInUSD <= (t.max || Infinity));
      if (tier) {
        bonusPercent = tier.percent;
        bonus = (amountInUSD * bonusPercent) / 100;
      }
    }

    const totalToCredit = amountInUSD + bonus;
    await updateDoc(doc(firestore, "users", userId), {
      totalBalance: increment(totalToCredit)
    });

    const userSnap = await getDoc(doc(firestore, "users", userId));
    const userName = userSnap.data()?.displayName || "مستثمر";

    await addDoc(collection(firestore, "deposit_requests"), {
      userId, userName, coinAmount, coinAsset: asset.toUpperCase(), livePriceAtDeposit: livePrice,
      amount: amountInUSD, approvedAmount: amountInUSD, bonusApplied: bonus, bonusPercent,
      transactionId: txid.trim(), methodName: `Binance Sync (${asset.toUpperCase()})`,
      status: "approved", isAutoAudited: true, createdAt: new Date().toISOString()
    });

    await addDoc(collection(firestore, "notifications"), {
      userId, title: "تأكيد إيداع الرصيد",
      message: `تم رصد إيداع بقيمة ${coinAmount} ${asset}. القيمة المعتمدة: $${amountInUSD.toFixed(2)}.`,
      type: "success", isRead: false, createdAt: new Date().toISOString()
    });

    const userRefreshed = await getDoc(doc(firestore, "users", userId));
    const newBalance = userRefreshed.data()?.totalBalance || 0;
    await notifyTelegramUser(userId, `✅ *تم اعتماد الإيداع بنجاح!*\n\n💰 المبلغ المضاف: $${amountInUSD.toFixed(2)}\n🎁 مكافأة: $${bonus.toFixed(2)}\n💳 الرصيد الحالي: *$${newBalance.toLocaleString()}*`);

    return { success: true, data: { amount: amountInUSD, bonus, totalAdded: totalToCredit } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getBinanceCoinsConfig() {
  try {
    const nodes = await getActiveBinanceNodes();
    if (nodes.length === 0) return { success: false, error: "API Nodes not configured" };
    const res = await binanceSignedRequest('/sapi/v1/capital/config/getall', {}, nodes[0].apiKey, nodes[0].apiSecret);
    if (res.status !== 200) throw new Error(res.data.msg || "Failed to fetch Binance config");
    const coins = res.data.filter((c: any) => c.depositAllEnable);
    return { success: true, coins };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getBinanceDepositAddress(coin: string, network: string) {
  try {
    const nodes = await getActiveBinanceNodes();
    if (nodes.length === 0) return { success: false, error: "No active nodes." };
    for (const node of nodes) {
      const res = await binanceSignedRequest('/sapi/v1/capital/deposit/address', { 
        coin: coin.toUpperCase(), 
        network: network.toUpperCase() 
      }, node.apiKey, node.apiSecret);
      if (res.status === 429) continue;
      if (res.data.code) continue;
      return { success: true, address: res.data.address };
    }
    return { success: false, error: "Failed to fetch address." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
