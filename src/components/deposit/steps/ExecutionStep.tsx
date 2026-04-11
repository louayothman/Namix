
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info, Loader2, Check, Copy, Coins, Hash, ShieldCheck, AlertCircle, ClipboardPaste } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

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
}

/**
 * @fileOverview مكون التنفيذ المحدث v3.0 - Clean Tactical Edition
 * تم توحيد الأحجام، تطهير المصطلحات المحظورة، وإضافة زر اللصق للـ TXID.
 */
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
  handleCopy
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8 font-body text-right" dir="rtl">
      {/* Box Info - تعليمات الإيداع */}
      <div className="p-6 bg-blue-50/40 rounded-[32px] border border-blue-100/50 space-y-3">
        <div className="flex items-center gap-3 text-blue-600">
          <Info size={18} />
          <h4 className="text-xs font-black uppercase">تعليمات الشحن المعتمدة</h4>
        </div>
        <p className="text-[11px] md:text-sm font-bold leading-loose text-blue-800/70">{instructions}</p>
      </div>

      <div className="p-6 md:p-10 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner space-y-8">
        {/* Wallet Address Node */}
        <div className="space-y-3">
          <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">عنوان استلام الرصيد</Label>
          <div className="bg-white p-4 md:p-6 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-lg transition-all min-h-[72px]">
            {loading && !walletAddress ? (
              <div className="flex-1 flex items-center gap-3 animate-pulse">
                <Loader2 size={14} className="animate-spin text-blue-500" />
                <span className="text-[9px] font-black text-gray-300 uppercase">Generating Address...</span>
              </div>
            ) : (
              <div className="flex-1 font-mono text-xs md:text-lg font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">{walletAddress}</div>
            )}
            <button 
              onClick={handleCopy} 
              disabled={!walletAddress} 
              className="h-12 w-12 rounded-xl bg-[#002d4d] text-[#f9a885] shadow-lg shrink-0 active:scale-90 transition-all flex items-center justify-center disabled:opacity-20"
            >
              {copied ? <Check size={20}/> : <Copy size={20}/>}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Amount Field - Only for non-Binance */}
          {!isBinance && (
            <div className="space-y-3">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">المبلغ المراد شحنه ($)</Label>
              <div className="relative group">
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  className="h-16 rounded-[24px] bg-white border-none font-black text-center text-3xl text-emerald-600 shadow-sm focus-visible:ring-4 focus-visible:ring-emerald-500/5 transition-all tabular-nums" 
                  placeholder="0.00" 
                />
                <Coins size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-100 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>
          )}
          
          {/* Transaction ID Field - With Paste Button */}
          {!isNowPayments && (
            <div className="space-y-3">
              <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">
                {isBinance ? 'معرف العملية (TXID)' : 'رقم العملية المرجعي'}
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Input 
                    value={txid} 
                    onChange={e => setTxid(e.target.value)} 
                    className="h-14 rounded-[24px] bg-white border-none font-mono text-xs font-black px-10 text-center shadow-sm focus-visible:ring-4 focus-visible:ring-blue-500/5" 
                    placeholder="ألصق الـ Hash هنا..." 
                  />
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-100" />
                </div>
                <button 
                  onClick={handlePaste}
                  className="h-14 w-14 rounded-2xl bg-gray-100 text-gray-400 hover:text-[#002d4d] hover:bg-white hover:shadow-md transition-all active:scale-90 flex items-center justify-center border border-transparent hover:border-gray-100"
                  title="لصق من الحافظة"
                >
                  <ClipboardPaste size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-[24px] border border-red-100 flex items-center gap-3 text-red-600 animate-in zoom-in-95">
          <AlertCircle size={18} />
          <p className="text-[11px] font-black">{error}</p>
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
            <ShieldCheck className="h-5 w-5 text-[#f9a885] group-hover:rotate-12 transition-transform" />
          </div>
        )}
      </Button>
    </motion.div>
  );
}
