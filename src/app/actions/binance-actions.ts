
'use server';

/**
 * @fileOverview Binance Sovereign Automation Protocol v7.0
 * Updated to support dynamic multi-node API connectivity.
 */

import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import crypto from 'node:crypto';

/**
 * Helper to perform signed requests to Binance SAPI
 */
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
    
    return await response.json();
  } catch (e: any) {
    throw new Error(`Binance Connectivity Error: ${e.message}`);
  }
}

/**
 * Finds the currently active Binance Node from the dynamic matrix.
 */
async function getActiveBinanceConfig() {
  const { firestore } = initializeFirebase();
  const configSnap = await getDoc(doc(firestore, "system_settings", "connectivity"));
  if (!configSnap.exists()) return null;
  
  const data = configSnap.data();
  // Try to find active node in new structure
  if (data.nodes && Array.isArray(data.nodes)) {
    const active = data.nodes.find((n: any) => n.provider === 'binance' && n.isActive);
    if (active) return { apiKey: active.apiKey, apiSecret: active.apiSecret };
  }
  
  // Fallback to legacy fields if nodes array is empty
  if (data.binanceApiKey) {
    return { apiKey: data.binanceApiKey, apiSecret: data.binanceApiSecret };
  }
  
  return null;
}

/**
 * Fetches the current price for a symbol using Public API.
 */
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
 * Verifies a deposit by TXID and returns the ACTUAL amount from Binance records.
 */
export async function verifyBinanceDeposit(txid: string, amount?: number, asset: string = "USDT") {
  try {
    const config = await getActiveBinanceConfig();
    
    if (!config || !config.apiKey || !config.apiSecret) {
      return { success: false, error: "بروتوكول الأمان (Binance Active Node) غير مفعل أو مفقود في الإعدادات." };
    }

    const history = await binanceSignedRequest('/sapi/v1/capital/deposit/hisrec', { 
      coin: asset.toUpperCase(),
      status: "1" 
    }, config.apiKey, config.apiSecret);

    if (history.code) return { success: false, error: history.msg };

    if (Array.isArray(history)) {
      const match = history.find((d: any) => 
        d.txId.toLowerCase() === txid.trim().toLowerCase()
      );

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

    return { success: false, error: "لم يتم العثور على عملية إيداع مطابقة لهذا المعرف (TXID). يرجى الانتظار والمحاولة مجدداً." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getBinanceDepositAddress(coin: string, network: string) {
  try {
    const config = await getActiveBinanceConfig();
    
    if (!config || !config.apiKey || !config.apiSecret) {
      return { success: false, error: "بروتوكول الأمان غير مكتمل أو العقدة النشطة غير موجودة." };
    }

    const data = await binanceSignedRequest('/sapi/v1/capital/deposit/address', { 
      coin: coin.toUpperCase(), 
      network: network.toUpperCase() 
    }, config.apiKey, config.apiSecret);

    if (data.code) return { success: false, error: data.msg };

    return { success: true, address: data.address };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
