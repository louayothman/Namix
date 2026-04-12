
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
  ChevronLeft,
  Coins
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { DepositShareDrawer } from "../DepositShareDrawer";
import { QRCodeSVG } from "qrcode.react";
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

/**
 * @fileOverview مكون التنفيذ المطور v15.0 - Dynamic Order Generation
 * تم تحديث الواجهة لتدعم توليد العناوين بعد إدخال المبلغ لدعم بروتوكول NowPayments الجديد.
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
  selectedAsset,
  selectedNetwork
}: ExecutionStepProps) {
  const isBinance = categoryType === 'binance';
  const isNowPayments = categoryType === 'nowpayments';
  const isManual = categoryType === 'manual';
  
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

  const networkName = isBinance ? (selectedNetwork?.name || "المعتمدة") : (selectedAsset?.network || "المعتمدة");

  return (
    <div className="w-full space-y-8 text-right font-body animate-in fade-in duration-700" dir="rtl">
      
      {/* 1. Asset Identity */}
      <section className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-center justify-center">
               <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={48} />
            </div>
            <div className="text-right space-y-0.5">
               <h3 className="text-xl font-normal text-[#002d4d] leading-none">{selectedAsset?.name || selectedAsset?.coin}</h3>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">{networkName}</p>
            </div>
         </div>
         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full animate-pulse">
            PROTOCOL READY
         </Badge>
      </section>

      {/* 2. Amount Input Section - Required for Invoice Generation */}
      {!walletAddress && (
        <section className="space-y-6 animate-in zoom-in-95">
           <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
              <div className="text-center space-y-2">
                 <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مبلغ الإيداع المستهدف ($)</Label>
                 <div className="relative">
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(e.target.value)}
                      className="h-20 w-full bg-transparent border-none text-center font-black text-5xl tabular-nums text-[#002d4d] outline-none"
                      placeholder="0.00"
                    />
                    <Coins className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-100" />
                 </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold text-center">سيتم توليد عنوان إيداع فريد لهذا المبلغ تحديداً لضمان سرعة المزامنة.</p>
           </div>

           <Button 
             onClick={onSubmit} 
             disabled={loading || !amount || Number(amount) <= 0}
             className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 group transition-all"
           >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <div className="flex items-center gap-3">
                   <span>توليد عنوان الإيداع</span>
                   <Sparkles className="h-5 w-5 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                </div>
              )}
           </Button>
           {error && <p className="text-red-500 text-[10px] font-bold text-center animate-shake">{error}</p>}
        </section>
      )}

      {/* 3. QR & Address Display - Shown after generation */}
      {walletAddress && (
        <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
           <div className="flex justify-center">
              <div className="relative h-48 w-48 md:h-56 md:w-56 flex items-center justify-center">
                 <QRCodeSVG 
                   value={walletAddress}
                   size={256}
                   bgColor={"transparent"}
                   fgColor={"#002d4d"}
                   level={"H"}
                   includeMargin={false}
                   className="w-full h-full"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-1 rounded-sm">
                       <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={28} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
                 <p className="flex-1 font-normal text-xs text-[#002d4d] break-all text-center leading-relaxed font-mono opacity-80" dir="ltr">
                   {walletAddress}
                 </p>
                 <button onClick={handleCopy} className="h-10 w-10 text-gray-300 hover:text-[#002d4d] transition-all shrink-0 active:scale-90">
                   {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
                 </button>
              </div>
           </div>

           <div className="p-6 bg-blue-50/40 rounded-[32px] border border-blue-100/50 space-y-5">
             <div className="flex items-center gap-2 text-blue-600 mb-1">
               <Info size={14} />
               <h4 className="text-[10px] font-black uppercase tracking-widest">ميثاق الإيداع المعتمد</h4>
             </div>
             
             <div className="space-y-5 text-[11px] font-normal leading-loose text-blue-800/70">
                <p>أودع الأموال إلى العنوان أعلاه عبر شبكة <span className="font-black text-blue-900">{networkName}</span> فقط.</p>
                <p className="font-black text-blue-900">
                  {isNowPayments ? "سيتم إضافة الرصيد إلى محفظتك بعد اتمام العملية." : "سيتم إضافة الرصيد إلى محفظتك بعد تزويدنا بمعرف العملية TXID."}
                </p>

                <div className="space-y-2 pt-4 border-t border-blue-100/50">
                   <p className="font-black text-red-500/70 flex items-center gap-1.5">
                      <AlertCircle size={10} /> تحذير:
                   </p>
                   <ul className="list-disc pr-4 space-y-2 text-[10px]">
                      <li>تأكد من اختيار شبكة <span className="font-black">{networkName}</span> حصراً عند الإرسال.</li>
                      <li>تحقق من صحة العنوان قبل تنفيذ العملية.</li>
                      <li>أي إيداع عبر شبكة غير مدعومة أو إلى عنوان غير صحيح قد يؤدي إلى فقدان الأموال بشكل دائم.</li>
                   </ul>
                </div>
             </div>
           </div>

           {isBinance && (
             <div className="space-y-3 pt-2">
               <div className="flex items-center justify-between px-4">
                  <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">إثبات المزامنة (TXID)</Label>
                  <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[8px] px-2 py-0.5 rounded-full">Binance Sync</Badge>
               </div>
               
               <div className="relative h-16 md:h-20 rounded-[28px] bg-gray-50/50 border border-gray-100 overflow-hidden">
                  <input 
                    value={txid} 
                    onChange={e => setTxid(e.target.value)} 
                    className="h-full w-full bg-transparent border-none text-center font-normal text-sm px-14 outline-none text-[#002d4d]" 
                    placeholder="ألصق معرف العملية هنا..." 
                  />
                  <button 
                    onClick={handlePaste} 
                    type="button" 
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#f9a885] hover:bg-gray-50 transition-all shadow-sm"
                  >
                     <ClipboardPaste size={18} />
                  </button>
                  <Hash className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
               </div>
             </div>
           )}

           <div className="grid gap-4">
              {isNowPayments ? (
                <button onClick={() => window.location.href = '/home'} className="w-full h-16 rounded-[40px] bg-[#002d4d] text-white font-normal text-base shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] group">
                   <span>العودة للرئيسية</span>
                   <ChevronLeft className="h-6 w-6 text-[#f9a885] transition-transform group-hover:-translate-x-1" />
                </button>
              ) : (
                <Button 
                  onClick={onSubmit} 
                  disabled={loading || (isBinance && !txid)} 
                  className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-normal text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <>
                      <span>تأكيد المزامنة</span>
                      <ShieldCheck size={20} className="text-[#f9a885]" />
                    </>
                  )}
                </Button>
              )}
              
              <Button onClick={() => setIsShareDrawerOpen(true)} variant="ghost" className="h-12 rounded-full text-gray-400 font-bold text-[10px] uppercase tracking-widest">حفظ تفاصيل المعاملة</Button>
           </div>
        </section>
      )}

      <DepositShareDrawer 
        open={isShareDrawerOpen} 
        onOpenChange={setIsShareDrawerOpen} 
        selectedAsset={selectedAsset} 
        selectedNetwork={selectedNetwork} 
        walletAddress={walletAddress} 
      />
    </div>
  );
}
