
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info, Loader2, Check, Copy, Coins, Hash, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10">
      <div className="p-8 bg-blue-50/40 rounded-[48px] border border-blue-100/50 space-y-4">
        <div className="flex items-center gap-3 text-blue-600">
          <Info size={20} />
          <h4 className="text-sm font-black uppercase tracking-widest">بروتوكول الشحن المعتمد</h4>
        </div>
        <p className="text-[13px] md:text-base font-bold leading-loose text-blue-800/70">{instructions}</p>
      </div>

      <div className="p-8 md:p-12 bg-gray-50 rounded-[56px] border border-gray-100 shadow-inner space-y-10">
        <div className="space-y-4">
          <Label className="text-[10px] font-black text-gray-400 uppercase pr-6 tracking-[0.2em]">عنوان استلام السيولة</Label>
          <div className="bg-white p-6 md:p-8 rounded-[36px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
            {loading && !walletAddress ? (
              <div className="flex-1 flex items-center gap-3 animate-pulse">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Generating Address...</span>
              </div>
            ) : (
              <div className="flex-1 font-mono text-xs md:text-xl font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">{walletAddress}</div>
            )}
            <button onClick={handleCopy} disabled={!walletAddress} className="h-16 w-16 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-2xl shrink-0 active:scale-90 transition-all flex items-center justify-center disabled:opacity-20">
              {copied ? <Check size={28}/> : <Copy size={28}/>}
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {!isBinance && (
            <div className="space-y-4">
              <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-[0.2em]">المبلغ المراد شحنه ($)</Label>
              <div className="relative group">
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-24 rounded-[40px] bg-white border-none font-black text-center text-6xl text-emerald-600 shadow-xl focus-visible:ring-8 focus-visible:ring-emerald-500/5 transition-all" placeholder="0.00" />
                <Coins size={32} className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-100 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>
          )}
          
          {!isNowPayments && (
            <div className="space-y-4">
              <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-[0.2em]">{isBinance ? 'معرف العملية (TXID)' : 'رقم العملية المرجعي'}</Label>
              <div className="relative">
                <Input value={txid} onChange={e => setTxid(e.target.value)} className="h-16 rounded-[24px] bg-white border-none font-mono text-sm font-black px-10 text-center shadow-lg focus-visible:ring-4 focus-visible:ring-blue-500/5" placeholder="ألصق الـ Hash هنا..." />
                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100" />
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 rounded-[32px] border border-red-100 flex items-center gap-4 text-red-600 animate-pulse">
          <AlertCircle size={24} />
          <p className="text-sm font-black">{error}</p>
        </div>
      )}

      <Button 
        onClick={onSubmit} 
        disabled={loading || (!isBinance && !amount) || (isBinance && !txid)} 
        className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl active:scale-[0.98] group transition-all"
      >
        {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
          <div className="flex items-center gap-4">
            <span>{isNowPayments ? "تأكيد واستلام السيولة" : "توثيق الإيداع آلياً"}</span>
            <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
          </div>
        )}
      </Button>
    </motion.div>
  );
}
