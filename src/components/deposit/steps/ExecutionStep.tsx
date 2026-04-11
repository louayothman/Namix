
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Info, 
  Loader2, 
  Check, 
  Copy, 
  Coins, 
  Hash, 
  ShieldCheck, 
  AlertCircle, 
  ClipboardPaste,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  selectedAsset,
  selectedNetwork
}: ExecutionStepProps) {
  const isBinance = categoryType === 'binance';
  const isNowPayments = categoryType === 'nowpayments';

  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopyStatus("تم نسخ العنوان بنجاح");
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(() => {
        setCopyStatus("فشل النسخ");
        setTimeout(() => setCopyStatus(null), 2000);
      });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTxid(text);
        setPasteStatus("تم اللصق");
        setTimeout(() => setPasteStatus(null), 2000);
      }
    } catch (err) {
      setPasteStatus("تعذر الوصول للحافظة");
      setTimeout(() => setPasteStatus(null), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }} 
      className="w-full space-y-6 font-body text-right" 
      dir="rtl"
    >
      {/* 1. التوجيهات والتحذيرات الصريحة */}
      <div className="p-5 bg-blue-50/40 rounded-[28px] border border-blue-100/50 space-y-1">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Info size={14} />
          <h4 className="text-[10px] font-black uppercase tracking-normal">توجيهات الإيداع المعتمدة</h4>
        </div>
        <p className="text-[11px] font-bold leading-loose text-blue-800/70 tracking-normal">{instructions}</p>
      </div>

      {/* 2. حقل العنوان وتأكيد العملة */}
      <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
        
        <div className="space-y-3">
          <div className="flex items-center justify-between px-4">
             <Label className="text-[9px] font-black text-gray-400 uppercase tracking-normal">عنوان استلام الرصيد</Label>
             <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{selectedAsset?.name || selectedAsset?.coin}</span>
                <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{selectedNetwork?.name || selectedAsset?.network || "Network"}</span>
             </div>
          </div>
          
          <div className="relative group">
            <div className="bg-white p-4 h-[72px] rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-[#002d4d]">
              <div className="flex-1 font-mono text-[9px] font-black text-[#002d4d] break-all text-left leading-tight overflow-hidden opacity-80" dir="ltr">
                {loading && !walletAddress ? "جاري التوليد..." : walletAddress}
              </div>
              <button 
                onClick={handleCopy} 
                disabled={!walletAddress} 
                className="h-10 w-10 rounded-xl bg-[#002d4d] text-[#f9a885] shadow-lg shrink-0 active:scale-90 transition-all flex items-center justify-center disabled:opacity-20"
              >
                {copyStatus ? <Check size={16}/> : <Copy size={16}/>}
              </button>
            </div>
            <AnimatePresence>
              {copyStatus && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 right-4 text-[8px] font-black text-emerald-500 uppercase tracking-normal">{copyStatus}</motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* حقول إضافية فقط لفئة Binance */}
        {!isNowPayments && isBinance && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-500">
            <Label className="text-[9px] font-black text-gray-400 uppercase pr-4 tracking-normal">معرف العملية (TXID)</Label>
            <div className="relative group">
              <div className="relative flex items-center h-[72px] bg-white rounded-[24px] border border-gray-100 shadow-sm transition-all hover:border-[#002d4d]">
                <Input 
                  value={txid} 
                  onChange={e => setTxid(e.target.value)} 
                  className="h-full w-full bg-transparent border-none font-mono text-[10px] font-black px-12 text-center shadow-none focus-visible:ring-0" 
                  placeholder="ألصق المعرف هنا..." 
                />
                <Hash className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
                <button 
                  onClick={handlePaste}
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#f9a885] hover:bg-[#002d4d] hover:text-white transition-all active:scale-90 shadow-sm border border-gray-100"
                >
                  <ClipboardPaste size={18} />
                </button>
              </div>
              <AnimatePresence>
                {pasteStatus && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 right-4 text-[8px] font-black text-emerald-500 uppercase tracking-normal">{pasteStatus}</motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* حقل المبلغ للفئات اليدوية الأخرى */}
        {!isNowPayments && !isBinance && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-500">
            <Label className="text-[9px] font-black text-gray-400 uppercase pr-4 tracking-normal">المبلغ المودع ($)</Label>
            <div className="relative">
              <Input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                className="h-[72px] rounded-[24px] bg-white border-none font-black text-center text-2xl text-emerald-600 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500/10 tabular-nums tracking-tighter" 
                placeholder="0.00" 
              />
              <Coins size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-100" />
            </div>
          </div>
        )}
      </div>

      {/* 3. زر العودة للرئيسية - خاص بالمدفوعات الآلية */}
      {isNowPayments && (
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <button 
            onClick={() => window.location.href = '/home'}
            className="w-full h-20 rounded-[32px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl relative overflow-hidden group transition-all active:scale-[0.98]"
          >
            <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-[0.05] group-hover:opacity-[0.12] group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000 pointer-events-none text-[#f9a885]">
               <ShieldCheck size={140} strokeWidth={1.5} />
            </div>
            
            <div className="relative z-10 flex items-center justify-center gap-4">
               <span className="tracking-normal">العودة للرئيسية</span>
               <ChevronLeft className="h-6 w-6 text-[#f9a885] group-hover:-translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-[24px] border border-red-100 flex items-center gap-3 text-red-600">
          <AlertCircle size={16} />
          <p className="text-[10px] font-black tracking-normal">{error}</p>
        </div>
      )}

      {/* 4. زر المتابعة - للفئات اليدوية والمزامنة */}
      {!isNowPayments && (
        <Button 
          onClick={onSubmit} 
          disabled={loading || (!isBinance && !amount) || (isBinance && !txid)} 
          className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-[0.98] group transition-all"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
            <div className="flex items-center gap-3">
              <span className="tracking-normal">المتابعة</span>
              <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
            </div>
          )}
        </Button>
      )}
    </motion.div>
  );
}
