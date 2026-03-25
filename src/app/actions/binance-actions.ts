
'use server';

/**
 * @fileOverview Binance Sovereign Automation Protocol v6.0
 * Enhanced with deep transaction verification and amount extraction.
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
 * This ignores the user's manual input and trusts the blockchain.
 */
export async function verifyBinanceDeposit(txid: string, amount?: number, asset: string = "USDT") {
  try {
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "binance"));
    const configData = configSnap.exists() ? configSnap.data() : null;
    
    if (!configData || !configData.apiKey || !configData.apiSecret) {
      return { success: false, error: "بروتوكول الأمان (Binance API) غير مهيأ في الإعدادات." };
    }

    // Fetch deposit history for the specific asset
    const history = await binanceSignedRequest('/sapi/v1/capital/deposit/hisrec', { 
      coin: asset.toUpperCase(),
      status: "1" // 1 = Success
    }, configData.apiKey, configData.apiSecret);

    if (history.code) return { success: false, error: history.msg };

    if (Array.isArray(history)) {
      // Search for the TXID in the recent history
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

    return { success: false, error: "لم يتم العثور على عملية إيداع مطابقة لهذا المعرف (TXID) في سجلات بينانس حتى الآن. يرجى الانتظار بضع دقائق والمحاولة مجدداً." };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getBinanceExchangeSymbols() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      cache: 'no-store'
    });
    const data = await response.json();
    
    if (!data.symbols) return { success: false, symbols: [] };

    const usdtPairs = data.symbols
      .filter((s: any) => s.symbol.endsWith('USDT') && s.status === 'TRADING')
      .map((s: any) => ({
        symbol: s.symbol,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset,
        precision: s.baseAssetPrecision
      }));

    return { success: true, symbols: usdtPairs };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getBinanceDepositAddress(coin: string, network: string) {
  try {
    const { firestore } = initializeFirebase();
    const configSnap = await getDoc(doc(firestore, "system_settings", "binance"));
    const configData = configSnap.exists() ? configSnap.data() : null;
    
    if (!configData || !configData.apiKey || !configData.apiSecret) {
      return { success: false, error: "بروتوكول الأمان غير مكتمل." };
    }

    const data = await binanceSignedRequest('/sapi/v1/capital/deposit/address', { 
      coin: coin.toUpperCase(), 
      network: network.toUpperCase() 
    }, configData.apiKey, configData.apiSecret);

    if (data.code) return { success: false, error: data.msg };

    return { success: true, address: data.address };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
