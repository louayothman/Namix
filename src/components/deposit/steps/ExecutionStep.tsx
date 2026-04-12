
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { DepositShareDrawer } from "../DepositShareDrawer";
import { QRCodeSVG } from "qrcode.react";

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

  return (
    <div className="w-full space-y-8 text-right" dir="rtl">
      {/* 1. Asset Header Identity */}
      <section className="flex items-center gap-4 px-2">
         <div className="shrink-0 flex items-center justify-center">
            <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={48} />
         </div>
         <div className="text-right space-y-0.5">
            <h3 className="text-xl font-normal text-[#002d4d] leading-none">{selectedAsset?.name || selectedAsset?.coin}</h3>
            <p className="text-[10px] text-gray-400 uppercase">{selectedNetwork?.name || selectedAsset?.network}</p>
         </div>
      </section>

      {/* 2. Visual QR Center (Local Generation) */}
      <section className="flex justify-center relative py-2">
         <div className="relative p-6 bg-white rounded-[48px] border border-gray-100 shadow-inner">
            {walletAddress ? (
              <div className="relative h-48 w-48 md:h-56 md:w-56 flex items-center justify-center">
                 <QRCodeSVG 
                   value={walletAddress}
                   size={256}
                   bgColor={"#ffffff"}
                   fgColor={"#002d4d"}
                   level={"L"}
                   includeMargin={false}
                   className="w-full h-full"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded-xl">
                       <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={28} />
                    </div>
                 </div>
              </div>
            ) : <Loader2 className="animate-spin text-gray-200" />}
         </div>
      </section>

      {/* 3. Address Interaction Matrix */}
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

      {/* 4. Submission & Data Input */}
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
             
             <div className="relative group">
               <div className="relative flex items-center h-16 md:h-20 bg-gray-50/50 rounded-[28px] border border-gray-100 transition-all duration-300 group-within:bg-white group-within:border-[#002d4d] group-within:shadow-xl group-within:ring-4 group-within:ring-blue-500/5 overflow-hidden">
                 <div className="absolute right-6 pointer-events-none opacity-20 group-within:opacity-100 transition-opacity">
                    <Hash size={18} className="text-[#002d4d]" />
                 </div>
                 <input 
                   value={txid} 
                   onChange={e => setTxid(e.target.value)} 
                   className="h-full w-full bg-transparent border-none text-center font-normal text-sm px-16 focus:ring-0 outline-none text-[#002d4d] placeholder:text-gray-300" 
                   placeholder="ألصق معرف العملية (TXID) هنا..." 
                 />
                 <button 
                   onClick={handlePaste} 
                   type="button" 
                   className="absolute left-3 h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#f9a885] hover:bg-gray-50 active:scale-90 transition-all shadow-sm z-10"
                 >
                    <ClipboardPaste size={18} />
                 </button>
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
