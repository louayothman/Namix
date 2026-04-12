"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { CryptoIcon } from "@/lib/crypto-icons";
import { ChevronLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface NowPaymentsCurrencyStepProps {
  availableIds: string[];
  onSelect: (asset: any) => void;
  loading: boolean;
  searchQuery: string;
}

const POPULAR_COINS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];

/**
 * خوارزمية الأفضلية لاختيار أفضل شبكة متاحة لكل عملة
 */
const PREFERRED_NETWORKS: Record<string, string[]> = {
  'USDT': ['usdttrc20', 'usdtbsc', 'usdteth', 'usdtsol', 'usdtmatic'],
  'ETH': ['eth', 'ethbsc'],
  'BNB': ['bnbbsc'],
  'BTC': ['btc'],
  'SOL': ['sol'],
  'TRX': ['trx'],
  'MATIC': ['maticpolygon'],
  'LTC': ['ltc'],
  'DOGE': ['doge'],
  'XRP': ['xrp']
};

const NP_ASSET_METADATA: Record<string, { label: string, icon: string, network: string, coin: string }> = {
  'usdttrc20': { label: 'Tether', coin: 'USDT', icon: 'USDT', network: 'TRON (TRC20)' },
  'usdtbsc': { label: 'Tether', coin: 'USDT', icon: 'USDT', network: 'BSC (BEP20)' },
  'usdteth': { label: 'Tether', coin: 'USDT', icon: 'USDT', network: 'Ethereum (ERC20)' },
  'usdtsol': { label: 'Tether', coin: 'USDT', icon: 'USDT', network: 'Solana' },
  'usdtmatic': { label: 'Tether', coin: 'USDT', icon: 'USDT', network: 'Polygon' },
  'btc': { label: 'Bitcoin', coin: 'BTC', icon: 'BTC', network: 'Bitcoin Native' },
  'eth': { label: 'Ethereum', coin: 'ETH', icon: 'ETH', network: 'Ethereum Native' },
  'trx': { label: 'TRON', coin: 'TRX', icon: 'TRX', network: 'TRON Native' },
  'sol': { label: 'Solana', coin: 'SOL', icon: 'SOL', network: 'Solana Native' },
  'ltc': { label: 'Litecoin', coin: 'LTC', icon: 'LTC', network: 'Litecoin Native' },
  'bnbbsc': { label: 'BNB', coin: 'BNB', icon: 'BNB', network: 'BSC (BEP20)' },
  'doge': { label: 'Dogecoin', coin: 'DOGE', icon: 'DOGE', network: 'Doge Native' },
  'xrp': { label: 'Ripple', coin: 'XRP', icon: 'XRP', network: 'Ripple Native' },
  'maticpolygon': { label: 'Polygon', coin: 'MATIC', icon: 'MATIC', network: 'Polygon Native' }
};

export function NowPaymentsCurrencyStep({
  availableIds,
  onSelect,
  loading,
  searchQuery
}: NowPaymentsCurrencyStepProps) {
  const filtered = useMemo(() => {
    // 1. تجميع الأفضل: اختيار أفضل شبكة واحدة لكل عملة
    const bestAssets: any[] = [];
    const coinsProcessed = new Set<string>();

    // أولاً: تصفية العملات بناءً على قائمة الأفضلية
    Object.keys(PREFERRED_NETWORKS).forEach(coin => {
      const networkIds = PREFERRED_NETWORKS[coin];
      // البحث عن أول شبكة متوفرة ضمن قائمة التفضيل
      const bestId = networkIds.find(id => availableIds.includes(id));
      if (bestId) {
        bestAssets.push({ id: bestId, ...NP_ASSET_METADATA[bestId] });
        coinsProcessed.add(coin);
      }
    });

    // ثانياً: إضافة أي عملات أخرى متوفرة وليست في قائمة التفضيل (إضافية)
    availableIds.forEach(id => {
      const meta = NP_ASSET_METADATA[id];
      if (meta && !coinsProcessed.has(meta.coin)) {
        bestAssets.push({ id, ...meta });
        coinsProcessed.add(meta.coin);
      }
    });

    let list = [...bestAssets];

    // 2. تطبيق البحث
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.label.toLowerCase().includes(q) || a.coin.toLowerCase().includes(q));
    }
    
    // 3. الترتيب: الأكثر شعبية أولاً ثم أبجدياً
    return list.sort((a, b) => {
      const aSymbol = a.coin.toUpperCase();
      const bSymbol = b.coin.toUpperCase();
      const aPop = POPULAR_COINS.indexOf(aSymbol);
      const bPop = POPULAR_COINS.indexOf(bSymbol);
      
      if (aPop !== -1 && bPop !== -1) return aPop - bPop;
      if (aPop !== -1) return -1;
      if (bPop !== -1) return 1;
      
      return aSymbol.localeCompare(bSymbol);
    });
  }, [availableIds, searchQuery]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="text-right">
           <h3 className="text-base font-black text-[#002d4d]">اختر العملة</h3>
           <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Select Asset Node</p>
        </div>
        <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">SECURE SYNC</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((asset) => (
          <button 
            key={asset.id} 
            onClick={() => onSelect(asset)} 
            disabled={loading}
            className="h-[88px] w-full p-4 rounded-[24px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center gap-4 text-right group active:scale-[0.98]"
          >
            <div className="shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <CryptoIcon name={asset.icon} size={36} />
            </div>
            <div className="flex-1 space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-[13px] text-[#002d4d] group-hover:text-blue-600 transition-colors truncate">{asset.label}</p>
                {POPULAR_COINS.includes(asset.coin.toUpperCase()) && <Sparkles size={8} className="text-orange-400 animate-pulse" />}
              </div>
              <div className="flex flex-col gap-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase leading-none">{asset.coin}</p>
                 <Badge className="font-black text-[7px] px-1.5 py-0.5 rounded-md shadow-sm uppercase border-none bg-blue-50 text-blue-600 w-fit">
                   {asset.network}
                 </Badge>
              </div>
            </div>
            <ChevronLeft className="h-4 w-4 text-gray-200 group-hover:text-[#002d4d] transition-all" />
          </button>
        ))}
      </div>

      {filtered.length === 0 && availableIds.length > 0 && (
        <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4 border-2 border-dashed border-gray-100 rounded-[48px]">
           <X size={40} />
           <p className="text-[10px] font-black uppercase">لم يتم العثور على العملة المطلوبة</p>
        </div>
      )}
    </motion.div>
  );
}
