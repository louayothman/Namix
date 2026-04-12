
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
  ShieldCheck, 
  Hash,
  ChevronLeft,
  Coins,
  Share2
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { QRCodeSVG } from "qrcode.react";
import { DepositShareDrawer } from "../../DepositShareDrawer";

interface ManualExecutionStepProps {
  selectedAsset: any;
  loading: boolean;
  amount: string;
  setAmount: (val: string) => void;
  txid: string;
  setTxid: (val: string) => void;
  onSubmit: () => void;
  error: string | null;
}

export function ManualExecutionStep({
  selectedAsset,
  loading,
  amount,
  setAmount,
  txid,
  setTxid,
  onSubmit,
  error
}: ManualExecutionStepProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);

  const handleCopy = () => {
    if (!selectedAsset?.walletAddress) return;
    navigator.clipboard.writeText(selectedAsset.walletAddress).then(() => {
      setCopyStatus("تم النسخ");
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  return (
    <div className="w-full space-y-8 text-right font-body animate-in fade-in duration-700" dir="rtl">
      <section className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-center justify-center">
               <CryptoIcon name={selectedAsset?.icon} size={48} />
            </div>
            <div className="text-right space-y-0.5">
               <h3 className="text-xl font-normal text-[#002d4d] leading-none">{selectedAsset?.name}</h3>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">بوابة يدوية</p>
            </div>
         </div>
         <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full">MANUAL REVIEW</Badge>
      </section>

      <section className="space-y-10">
         <div className="flex flex-col items-center gap-8">
            <div className="relative h-48 w-48 md:h-56 md:w-56 flex items-center justify-center">
               <QRCodeSVG value={selectedAsset?.walletAddress || "..."} size={256} bgColor={"transparent"} fgColor={"#002d4d"} level={"H"} includeMargin={false} className="w-full h-full" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-1 rounded-sm shadow-sm"><CryptoIcon name={selectedAsset?.icon} size={28} /></div>
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
               <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
                  <p className="flex-1 font-normal text-xs text-[#002d4d] break-all text-center leading-relaxed font-mono opacity-80" dir="ltr">{selectedAsset?.walletAddress}</p>
                  <button onClick={handleCopy} className="h-10 w-10 text-gray-300 hover:text-[#002d4d] transition-all shrink-0 active:scale-90">
                    {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
                  </button>
               </div>
               
               <Button 
                 onClick={() => setIsShareDrawerOpen(true)} 
                 variant="ghost" 
                 className="h-11 rounded-full bg-gray-50 text-[#002d4d] font-black text-[10px] px-8 border border-gray-100 shadow-sm active:scale-95 transition-all flex items-center gap-2"
               >
                  <Share2 size={14} className="text-blue-500" />
                  حفظ ومشاركة العنوان
               </Button>
            </div>
         </div>

         <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-5">
           <div className="flex items-center gap-2 text-[#002d4d] mb-1">
             <Info size={14} />
             <h4 className="text-[10px] font-black uppercase tracking-widest">تعليمات الإيداع اليدوي</h4>
           </div>
           <p className="text-[11px] font-bold leading-loose text-gray-500 pr-1">{selectedAsset?.instructions}</p>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">مبلغ الإيداع ($)</Label>
               <div className="relative">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-16 w-full bg-gray-50 border-none rounded-[20px] text-center font-black text-xl text-[#002d4d] shadow-inner outline-none" placeholder="0.00" />
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
               </div>
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">معرف العملية (TXID) / رقم الحوالة</Label>
               <div className="relative h-16 rounded-[24px] bg-gray-50 border border-gray-100 shadow-inner">
                  <input value={txid} onChange={e => setTxid(e.target.value)} className="h-full w-full bg-transparent border-none text-center font-black text-xs text-[#002d4d] outline-none px-12" placeholder="أدخل المرجع الرقمي..." />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
               </div>
            </div>
         </div>

         <div className="pt-2">
            <Button onClick={onSubmit} disabled={loading || !amount || !txid} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "إرسال طلب الإيداع للتدقيق"}
            </Button>
         </div>
      </section>

      <DepositShareDrawer open={isShareDrawerOpen} onOpenChange={setIsShareDrawerOpen} selectedAsset={selectedAsset} selectedNetwork={{ name: 'يدوي' }} walletAddress={selectedAsset?.walletAddress} />
    </div>
  );
}
