
'use server';

/**
 * @fileOverview Binance Sovereign Automation Protocol v8.0
 * يدعم الآن تدوير المفاتيح (Key Rotation) لتجاوز قيود SAPI اللحظية.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import crypto from 'node:crypto';

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

export async function getBinanceTickerPrice(symbol: string) {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return { success: true, price: Number(data.price) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * التحقق من الإيداع مع تدوير المفاتيح تلقائياً عند حدوث ضغط (Failover)
 */
export async function verifyBinanceDeposit(txid: string, amount?: number, asset: string = "USDT") {
  try {
    const nodes = await getActiveBinanceNodes();
    if (nodes.length === 0) return { success: false, error: "بروتوكول الأمان (Binance Nodes) غير مفعل." };

    for (const node of nodes) {
      const res = await binanceSignedRequest('/sapi/v1/capital/deposit/hisrec', { 
        coin: asset.toUpperCase(),
        status: "1" 
      }, node.apiKey, node.apiSecret);

      if (res.status === 429) continue; // تجاوز الحد، جرب العقدة التالية

      const history = res.data;
      if (history.code) continue;

      if (Array.isArray(history)) {
        const match = history.find((d: any) => d.txId.toLowerCase() === txid.trim().toLowerCase());
        if (match) {
          return { 
            success: true, 
            data: {
              amount: Number(match.amount),
              asset: match.coin,
              network: match.network,
              insertTime: match.insertTime,
              txId: match.txId
            } 
          };
        }
      }
    }

    return { success: false, error: "لم يتم العثور على عملية إيداع مطابقة. يرجى الانتظار أو التأكد من العقد النشطة." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getBinanceDepositAddress(coin: string, network: string) {
  try {
    const nodes = await getActiveBinanceNodes();
    if (nodes.length === 0) return { success: false, error: "لا توجد عقد نشطة لجلب العناوين." };

    for (const node of nodes) {
      const res = await binanceSignedRequest('/sapi/v1/capital/deposit/address', { 
        coin: coin.toUpperCase(), 
        network: network.toUpperCase() 
      }, node.apiKey, node.apiSecret);

      if (res.status === 429) continue;
      if (res.data.code) continue;

      return { success: true, address: res.data.address };
    }

    return { success: false, error: "فشل جلب العنوان من كافة العقد المتاحة." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
