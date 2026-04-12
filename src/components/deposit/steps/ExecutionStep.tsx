"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  Loader2, 
  Check, 
  Copy, 
  Hash, 
  ShieldCheck, 
  ClipboardPaste,
  Sparkles,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { DepositShareDrawer } from "../DepositShareDrawer";

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
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopyStatus("تم النسخ");
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setTxid(text);
    } catch (err) {}
  };

  const qrCodeUrl = walletAddress 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff&color=002d4d`
    : null;

  return (
    <div className="w-full space-y-8 text-right" dir="rtl">
      <section className="flex items-center gap-4 px-2">
         <div className="shrink-0 flex items-center justify-center">
            <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={48} />
         </div>
         <div className="text-right space-y-0.5">
            <h3 className="text-xl font-normal text-[#002d4d] leading-none">{selectedAsset?.name || selectedAsset?.coin}</h3>
            <p className="text-[10px] text-gray-400 uppercase">{selectedNetwork?.name || selectedAsset?.network}</p>
         </div>
      </section>

      <section className="flex justify-center relative py-2">
         <div className="relative p-6 bg-white rounded-[48px] border border-gray-100 shadow-inner">
            {qrCodeUrl ? (
              <div className="relative h-48 w-48 md:h-56 md:w-56">
                 <img src={qrCodeUrl} alt="QR" className="w-full h-full rounded-3xl" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-0.5"><CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={28} /></div>
                 </div>
              </div>
            ) : <Loader2 className="animate-spin text-gray-200" />}
         </div>
      </section>

      <section className="space-y-6">
         <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
               <p className="flex-1 font-normal text-xs text-[#002d4d] break-all text-center leading-relaxed" dir="ltr">
                 {walletAddress || "جاري التحميل..."}
               </p>
               <button onClick={handleCopy} disabled={!walletAddress} className="h-10 w-10 text-gray-300 hover:text-[#002d4d] transition-all shrink-0">
                 {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
               </button>
            </div>
         </div>

         <Button onClick={() => setIsShareDrawerOpen(true)} disabled={!walletAddress} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-normal text-sm shadow-xl active:scale-95 group">
            <Sparkles size={18} className="ml-3 text-[#f9a885]" />
            <span>حفظ ومشاركة العنوان</span>
         </Button>
      </section>

      <section className="space-y-6">
         <div className="p-6 bg-blue-50/40 rounded-[32px] border border-blue-100/50 space-y-2">
           <div className="flex items-center gap-2 text-blue-600 mb-1">
             <Info size={14} />
             <h4 className="text-[10px] font-normal uppercase">تعليمات الإيداع</h4>
           </div>
           <p className="text-[11px] font-normal leading-relaxed text-blue-800/70">{instructions}</p>
         </div>

         {isBinance && (
           <div className="space-y-3 pt-2">
             <div className="flex items-center justify-between px-4">
                <Label className="text-[9px] font-normal text-gray-400 uppercase">إثبات المعاملة</Label>
                <Badge className="bg-orange-50 text-orange-600 border-none font-normal text-[8px] px-2 py-0.5 rounded-full">تنسيق آلي</Badge>
             </div>
             <div className="relative">
               <div className="relative flex items-center h-[72px] bg-white rounded-[32px] border border-gray-100 shadow-xl transition-all hover:border-[#002d4d]">
                 <Input value={txid} onChange={e => setTxid(e.target.value)} className="h-full w-full bg-transparent border-none text-center font-normal text-xs px-14 focus-visible:ring-0 shadow-none" placeholder="ألصق معرف العملية (TXID) هنا..." />
                 <Hash className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
                 <button onClick={handlePaste} type="button" className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#f9a885] active:scale-90 shadow-sm"><ClipboardPaste size={18} /></button>
               </div>
             </div>
           </div>
         )}

         {isNowPayments && (
           <div className="pt-2">
             <button onClick={() => window.location.href = '/home'} className="w-full h-20 rounded-[40px] bg-[#002d4d] text-white font-normal text-base shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]">
                <span>العودة للرئيسية</span>
                <ChevronLeft className="h-6 w-6 text-[#f9a885]" />
             </button>
           </div>
         )}

         {error && (
           <div className="p-4 bg-red-50 rounded-[24px] border border-red-100 flex items-center gap-3 text-red-600">
             <AlertCircle size={16} />
             <p className="text-[11px] font-normal">{error}</p>
           </div>
         )}

         {!isNowPayments && (
           <Button onClick={onSubmit} disabled={loading || (isBinance && !txid)} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-normal text-base shadow-xl active:scale-95 transition-all">
             {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <div className="flex items-center gap-3"><span>تأكيد الإيداع</span><ShieldCheck className="h-5 w-5 text-[#f9a885]" /></div>}
           </Button>
         )}
      </section>

      <DepositShareDrawer open={isShareDrawerOpen} onOpenChange={setIsShareDrawerOpen} selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} walletAddress={walletAddress} />

      <div className="flex items-center justify-center gap-4 opacity-[0.15] select-none pt-2">
         <div className="flex items-center gap-1.5"><ShieldCheck size={10} /><span className="text-[8px] font-normal uppercase">مشفر</span></div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-1.5"><Sparkles size={10} /><span className="text-[8px] font-normal uppercase">ناميكس</span></div>
      </div>
    </div>
  );
}