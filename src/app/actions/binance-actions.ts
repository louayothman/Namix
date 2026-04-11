
'use server';

/**
 * @fileOverview Binance Sovereign Automation Protocol v9.0
 * يدعم الآن جلب قائمة العملات والشبكات الحية (Live Config) والتحقق من الـ TXID.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

/**
 * جلب كافة العملات والشبكات المدعومة من بينانس حياً
 */
export async function getBinanceCoinsConfig() {
  try {
    const nodes = await getActiveBinanceNodes();
    if (nodes.length === 0) return { success: false, error: "API Nodes not configured" };

    const res = await binanceSignedRequest('/sapi/v1/capital/config/getall', {}, nodes[0].apiKey, nodes[0].apiSecret);
    
    if (res.status !== 200) throw new Error(res.data.msg || "Failed to fetch Binance config");

    // تصفية العملات التي تدعم الإيداع فقط
    const coins = res.data.filter((c: any) => c.depositAllEnable);
    
    return { success: true, coins };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * التحقق من الإيداع مع تدوير المفاتيح والتحقق من عدم تكرار الـ TXID
 */
export async function verifyBinanceDeposit(txid: string, asset: string = "USDT") {
  try {
    const { firestore } = initializeFirebase();
    
    // 1. التحقق أولاً من أن الـ TXID لم يتم استخدامه مسبقاً في قاعدة بياناتنا
    const dupQuery = query(collection(firestore, "deposit_requests"), where("transactionId", "==", txid.trim()));
    const dupSnap = await getDocs(dupQuery);
    if (!dupSnap.empty) return { success: false, error: "تم استخدام معرف العملية هذا مسبقاً." };

    const nodes = await getActiveBinanceNodes();
    if (nodes.length === 0) return { success: false, error: "بروتوكول الأمان غير مفعل." };

    for (const node of nodes) {
      const res = await binanceSignedRequest('/sapi/v1/capital/deposit/hisrec', { 
        coin: asset.toUpperCase(),
        status: "1" 
      }, node.apiKey, node.apiSecret);

      if (res.status === 429) continue; 

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

    return { success: false, error: "لم يتم العثور على عملية إيداع مطابقة في السجلات العالمية." };
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

    return { success: false, error: "Failed to fetch address from Binance API." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
