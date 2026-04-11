
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
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
  Share2,
  QrCode,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";

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
        setCopyStatus("فشل في نسخ البيانات");
        setTimeout(() => setCopyStatus(null), 2000);
      });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTxid(text);
        setPasteStatus("تم لصق المعرف");
        setTimeout(() => setPasteStatus(null), 2000);
      }
    } catch (err) {
      setPasteStatus("فشل الوصول للحافظة");
      setTimeout(() => setPasteStatus(null), 2000);
    }
  };

  const handleShare = async () => {
    if (!walletAddress) return;
    try {
      const shareData = {
        title: `عنوان إيداع ${selectedAsset?.coin}`,
        text: `يرجى إرسال ${selectedAsset?.coin} عبر شبكة ${selectedNetwork?.name || selectedAsset?.network} إلى هذا العنوان المعتمد: ${walletAddress}`,
        url: window.location.href
      };
      if (navigator.share) {
        await navigator.share(shareData);
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const qrCodeUrl = walletAddress 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff&color=002d4d`
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }} 
      className="w-full space-y-8 font-body text-right" 
      dir="rtl"
    >
      {/* هيدر التعريف اللحظي */}
      <div className="flex items-center gap-4 px-2">
         <div className="h-14 w-14 flex items-center justify-center shrink-0">
            <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={48} />
         </div>
         <div className="text-right space-y-0.5">
            <h3 className="text-lg font-black text-[#002d4d] leading-none">
              {selectedAsset?.name || selectedAsset?.coin}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mt-1">
              {selectedNetwork?.name || selectedAsset?.network || "نظام الشبكات المعتمد"}
            </p>
         </div>
      </div>

      {/* حاوية التعليمات المباشرة */}
      <div className="p-6 bg-blue-50/40 rounded-[32px] border border-blue-100/50 space-y-2">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Info size={14} />
          <h4 className="text-[10px] font-black uppercase">توجيهات الإيداع</h4>
        </div>
        <p className="text-[11px] font-bold leading-[2] text-blue-800/70">{instructions}</p>
      </div>

      {/* تحفة عنوان الاستلام والباركود */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-4">
            <Label className="text-[9px] font-black text-gray-400 uppercase">بيانات استلام الرصيد</Label>
            <div className="flex items-center gap-1">
               <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-black text-emerald-600 uppercase">نظام فحص نشط</span>
            </div>
         </div>

         <Card className="rounded-[48px] border-none shadow-2xl bg-white overflow-hidden p-10 flex flex-col items-center gap-8 relative group">
            {/* الباركود المركزي - تطابق تام مع بينانس */}
            <div className="relative p-5 bg-white rounded-[40px] border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
               {qrCodeUrl ? (
                 <img src={qrCodeUrl} alt="Deposit QR" className="h-48 w-48 md:h-56 md:w-56 rounded-2xl" />
               ) : (
                 <div className="h-48 w-48 md:h-56 md:w-56 flex items-center justify-center bg-gray-50 rounded-2xl">
                    <Loader2 className="animate-spin text-gray-200" />
                 </div>
               )}
               <div className="absolute -top-2 -right-2 h-10 w-10 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl">
                  <QrCode size={20} />
               </div>
            </div>

            {/* عرض العنوان الصافي بدون حقل */}
            <div className="w-full space-y-5">
               <div className="flex flex-col items-center gap-1 text-center">
                  <p className="text-[8px] font-black text-gray-300 uppercase leading-none">{selectedAsset?.coin} • {selectedNetwork?.name || selectedAsset?.network}</p>
                  <div className="flex items-center justify-center gap-4 w-full">
                     <p className="flex-1 font-mono text-[10px] md:text-xs font-black text-[#002d4d] break-all text-center leading-relaxed opacity-80" dir="ltr">
                       {loading && !walletAddress ? "جاري جلب بيانات العنوان..." : walletAddress}
                     </p>
                     <button 
                       onClick={handleCopy} 
                       disabled={!walletAddress}
                       className="h-10 w-10 flex items-center justify-center text-gray-300 hover:text-[#002d4d] transition-all active:scale-90 shrink-0 bg-transparent border-none shadow-none"
                     >
                       {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
                     </button>
                  </div>
               </div>
               
               <AnimatePresence>
                 {copyStatus && (
                   <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[9px] font-black text-emerald-500 uppercase text-center">{copyStatus}</motion.p>
                 )}
               </AnimatePresence>

               {/* زر المشاركة النخبوي */}
               <Button 
                 onClick={handleShare}
                 variant="ghost"
                 className="w-full h-14 rounded-full bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 font-black text-[10px] gap-3 transition-all active:scale-[0.98] border-none shadow-none"
               >
                  <Share2 size={16} />
                  <span>مشاركة بيانات الإيداع</span>
               </Button>
            </div>
         </Card>
      </div>

      {/* حقل معرف العملية لـ Binance */}
      {!isNowPayments && isBinance && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-500">
          <div className="flex items-center justify-between px-4">
             <Label className="text-[9px] font-black text-gray-400 uppercase">إثبات الإرسال</Label>
             <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md">Binance Sync</Badge>
          </div>
          <div className="relative">
            <div className="relative flex items-center h-[72px] bg-white rounded-[32px] border border-gray-100 shadow-xl transition-all hover:border-[#002d4d]">
              <Input 
                value={txid} 
                onChange={e => setTxid(e.target.value)} 
                className="h-full w-full bg-transparent border-none font-mono text-[10px] font-black px-14 text-center shadow-none focus-visible:ring-0" 
                placeholder="ألصق معرف العملية (TXID) هنا..." 
              />
              <Hash className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              <button 
                onClick={handlePaste}
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#f9a885] hover:bg-[#002d4d] hover:text-white transition-all active:scale-90 shadow-sm border-none"
              >
                <ClipboardPaste size={18} />
              </button>
            </div>
            <AnimatePresence>
              {pasteStatus && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 right-6 text-[9px] font-black text-emerald-500 uppercase">{pasteStatus.msg}</motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* حقل المبلغ للفئات اليدوية */}
      {!isNowPayments && !isBinance && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-500">
          <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">المبلغ المودع ($)</Label>
          <div className="relative">
            <Input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              className="h-[72px] rounded-[32px] bg-white border border-gray-100 font-black text-center text-2xl text-emerald-600 shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500/10 tabular-nums" 
              placeholder="0.00" 
            />
            <Coins size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-100" />
          </div>
        </div>
      )}

      {/* مخرج الإيداع الآلي (NOWPayments) */}
      {isNowPayments && (
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <button 
            onClick={() => window.location.href = '/home'}
            className="w-full h-20 rounded-[40px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl relative overflow-hidden group transition-all active:scale-[0.98] border-none"
          >
            <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-1000 pointer-events-none text-[#f9a885]">
               <ShieldCheck size={140} strokeWidth={1.5} />
            </div>
            
            <div className="relative z-10 flex items-center justify-center gap-4">
               <span>العودة للرئيسية</span>
               <ChevronLeft className="h-6 w-6 text-[#f9a885] group-hover:-translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-[24px] border border-red-100 flex items-center gap-3 text-red-600">
          <AlertCircle size={16} />
          <p className="text-[10px] font-black">{error}</p>
        </div>
      )}

      {/* زر المتابعة (Binance واليدوي) */}
      {!isNowPayments && (
        <Button 
          onClick={onSubmit} 
          disabled={loading || (!isBinance && !amount) || (isBinance && !txid)} 
          className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-[0.98] group transition-all"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
            <div className="flex items-center gap-3">
              <span>تأكيد الإرسال</span>
              <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
            </div>
          )}
        </Button>
      )}

      <div className="flex items-center justify-center gap-4 opacity-[0.15] select-none pt-2">
         <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase text-[#002d4d]">اتصال مشفر</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-1.5">
            <Sparkles size={10} className="text-[#f9a885]" />
            <span className="text-[7px] font-black uppercase text-[#002d4d]">نظام ناميكس المعتمد</span>
         </div>
      </div>
    </motion.div>
  );
}
