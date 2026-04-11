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
  Activity
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
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className="shrink-0 flex items-center justify-center">
            <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin || "USDT"} size={36} />
          </div>
          <div className="text-right">
            <h3 className="text-base font-black text-[#002d4d] leading-none">{selectedAsset?.name || selectedAsset?.coin}</h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1.5">{selectedNetwork?.name || selectedAsset?.network || "Network"}</p>
          </div>
        </div>
        {isNowPayments && (
          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full animate-pulse shadow-inner">آلية المراقبة نشطة</Badge>
        )}
      </div>

      <div className="p-5 bg-blue-50/40 rounded-[28px] border border-blue-100/50 space-y-1">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Info size={14} />
          <h4 className="text-[10px] font-black uppercase">تعليمات الإيداع المعتمدة</h4>
        </div>
        <p className="text-[11px] font-bold leading-loose text-blue-800/70">{instructions}</p>
      </div>

      <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
        <div className="space-y-2">
          <Label className="text-[9px] font-black text-gray-400 uppercase pr-3">عنوان استلام الرصيد</Label>
          <div className="relative group">
            <div className="bg-white p-4 h-[72px] rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between gap-4 transition-all hover:border-[#002d4d]">
              <div className="flex-1 font-mono text-[11px] font-black text-[#002d4d] break-all text-left leading-tight overflow-hidden" dir="ltr">
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
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 right-4 text-[8px] font-black text-emerald-500 uppercase">{copyStatus}</motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {!isNowPayments && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-500">
            {isBinance ? (
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-gray-400 uppercase pr-3">معرف العملية (TXID)</Label>
                <div className="relative group">
                  <div className="relative flex items-center">
                    <Input 
                      value={txid} 
                      onChange={e => setTxid(e.target.value)} 
                      className="h-[72px] rounded-[24px] bg-white border-none font-mono text-[11px] font-black px-14 text-center shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/10" 
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
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 right-4 text-[8px] font-black text-emerald-500 uppercase">{pasteStatus}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-gray-400 uppercase pr-3">المبلغ المودع ($)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    className="h-[72px] rounded-[24px] bg-white border-none font-black text-center text-2xl text-emerald-600 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500/10" 
                    placeholder="0.00" 
                  />
                  <Coins size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-100" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isNowPayments && (
        <div className="p-6 bg-white border-2 border-dashed border-gray-100 rounded-[40px] text-center space-y-3">
           <Activity className="h-6 w-6 text-gray-200 mx-auto animate-pulse" />
           <p className="text-[10px] font-bold text-gray-400 leading-relaxed">بمجرد إتمام الإرسال، سيتلقى نظامنا إشعاراً فورياً. سيظهر لك ملخص الإيداع والمكافأة في نافذة منبثقة أينما كنت داخل المنصة.</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-[24px] border border-red-100 flex items-center gap-3 text-red-600">
          <AlertCircle size={16} />
          <p className="text-[10px] font-black">{error}</p>
        </div>
      )}

      {!isNowPayments && (
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
      )}
    </motion.div>
  );
}
