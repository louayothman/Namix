"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info, Loader2, Check, Copy, Coins, Hash, ShieldCheck, AlertCircle, ClipboardPaste } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { CryptoIcon } from "@/lib/crypto-icons";

interface ExecutionStepProps {
  instructions: string;
  walletAddress: string;
  loading: boolean;
  amount: string;
  setAmount: (val: string) => void;
  txid: string;
  setTxid: (val: string) => void;
  onSubmit: () => void;
  error: string | null;
  categoryType: string;
  copied: boolean;
  handleCopy: () => void;
  selectedAsset?: any;
  selectedNetwork?: any;
}

export function ExecutionStep({
  instructions,
  walletAddress,
  loading,
  amount,
  setAmount,
  txid,
  setTxid,
  onSubmit,
  error,
  categoryType,
  copied,
  handleCopy,
  selectedAsset,
  selectedNetwork
}: ExecutionStepProps) {
  const isBinance = categoryType === 'binance';
  const isNowPayments = categoryType === 'nowpayments';

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTxid(text);
        toast({ title: "تم اللصق من الحافظة" });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "تعذر الوصول للحافظة" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full space-y-6 font-body text-right" dir="rtl">
      
      <div className="flex items-center gap-4 px-1">
        <div className="shrink-0 flex items-center justify-center">
          <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin || "USDT"} size={36} />
        </div>
        <div className="text-right">
          <h3 className="text-base font-black text-[#002d4d] leading-none">{selectedAsset?.name || selectedAsset?.coin}</h3>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-1.5">{selectedNetwork?.name || selectedAsset?.network || "Network"}</p>
        </div>
      </div>

      <div className="p-5 bg-blue-50/40 rounded-[28px] border border-blue-100/50 space-y-2">
        <div className="flex items-center gap-2 text-blue-600">
          <Info size={14} />
          <h4 className="text-[10px] font-black uppercase">تعليمات الايداع المعتمدة</h4>
        </div>
        <p className="text-[11px] font-bold leading-loose text-blue-800/70">{instructions}</p>
      </div>

      <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
        <div className="space-y-2">
          <Label className="text-[9px] font-black text-gray-400 uppercase pr-3">عنوان استلام الرصيد</Label>
          <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="flex-1 font-mono text-[11px] font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">
              {loading && !walletAddress ? "جاري التوليد..." : walletAddress}
            </div>
            <button 
              onClick={handleCopy} 
              disabled={!walletAddress} 
              className="h-10 w-10 rounded-xl bg-[#002d4d] text-[#f9a885] shadow-lg shrink-0 active:scale-90 transition-all flex items-center justify-center disabled:opacity-20"
            >
              {copied ? <Check size={16}/> : <Copy size={16}/>}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {!isBinance && (
            <div className="space-y-2">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-3">المبلغ المودع ($)</Label>
              <div className="relative">
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  className="h-14 rounded-[20px] bg-white border-none font-black text-center text-xl text-emerald-600 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500/10 transition-all" 
                  placeholder="0.00" 
                />
                <Coins size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-100" />
              </div>
            </div>
          )}
          
          {!isNowPayments && (
            <div className="space-y-2">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-3">معرف العملية (TXID)</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input 
                    value={txid} 
                    onChange={e => setTxid(e.target.value)} 
                    className="h-12 rounded-[18px] bg-white border-none font-mono text-[10px] font-black px-4 text-center shadow-sm" 
                    placeholder="ألصق المعرف هنا..." 
                  />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-100" />
                </div>
                <button 
                  onClick={handlePaste}
                  className="h-12 w-12 rounded-xl bg-gray-100 text-gray-400 hover:text-[#002d4d] hover:bg-white transition-all active:scale-90 flex items-center justify-center border border-transparent shadow-sm"
                >
                  <ClipboardPaste size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 rounded-[20px] border border-red-100 flex items-center gap-2 text-red-600">
          <AlertCircle size={14} />
          <p className="text-[10px] font-black">{error}</p>
        </div>
      )}

      <Button 
        onClick={onSubmit} 
        disabled={loading || (!isBinance && !amount) || (isBinance && !txid)} 
        className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-[0.98] group transition-all"
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
          <div className="flex items-center gap-3">
            <span>المتابعة</span>
            <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
          </div>
        )}
      </Button>
    </motion.div>
  );
}
