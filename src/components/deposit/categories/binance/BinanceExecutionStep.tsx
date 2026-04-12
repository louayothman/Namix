
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
  AlertCircle
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { QRCodeSVG } from "qrcode.react";
import { DepositShareDrawer } from "../../DepositShareDrawer";

interface BinanceExecutionStepProps {
  selectedAsset: any;
  selectedNetwork: any;
  walletAddress: string;
  loading: boolean;
  txid: string;
  setTxid: (val: string) => void;
  onSubmit: () => void;
  error: string | null;
}

/**
 * @fileOverview بروتوكول تعليمات Namix النخبوية v16.0
 * تم تحديث الواجهة لتكون بلسان "ناميكس" بالكامل مع تجريد الباركود من الحاويات.
 */
export function BinanceExecutionStep({
  selectedAsset,
  selectedNetwork,
  walletAddress,
  loading,
  txid,
  setTxid,
  onSubmit,
  error
}: BinanceExecutionStepProps) {
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

  const networkLabel = selectedNetwork?.name || selectedNetwork?.network || "المعتمدة";

  return (
    <div className="w-full space-y-10 text-right font-body animate-in fade-in duration-700" dir="rtl">
      
      {/* Asset Identity Header */}
      <section className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-center justify-center">
               <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={48} />
            </div>
            <div className="text-right space-y-0.5">
               <h3 className="text-xl font-normal text-[#002d4d] leading-none">{selectedAsset?.name || selectedAsset?.coin}</h3>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">{networkLabel}</p>
            </div>
         </div>
         <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[8px] px-3 py-1 rounded-full animate-pulse">VERIFICATION REQUIRED</Badge>
      </section>

      {/* Pure QR & Address Section */}
      <section className="space-y-10">
         <div className="flex justify-center">
            <div className="relative h-56 w-56 md:h-64 md:w-64 flex items-center justify-center">
               <QRCodeSVG 
                 value={walletAddress} 
                 size={256} 
                 bgColor={"transparent"} 
                 fgColor={"#002d4d"} 
                 level={"H"} 
                 includeMargin={false} 
                 className="w-full h-full" 
               />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white p-1 rounded-sm shadow-sm">
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

         {/* Native Namix Instructions */}
         <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
           <div className="flex items-center gap-2 text-[#002d4d] mb-1">
             <Info size={16} />
             <h4 className="text-[11px] font-black uppercase tracking-widest">تعليمات الإيداع المعتمدة</h4>
           </div>
           
           <div className="space-y-6 text-[12px] font-normal leading-loose text-gray-500">
              <p>أودع الأموال إلى العنوان أعلاه عبر شبكة <span className="font-black text-[#002d4d]">{networkLabel}</span> فقط.</p>
              <p className="font-black text-[#002d4d] text-[13px]">سيتم إضافة الرصيد إلى محفظتك بعد تزويدنا بمعرف العملية TXID.</p>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                 <p className="font-black text-red-500 flex items-center gap-2">
                    <AlertCircle size={14} /> تحذير:
                 </p>
                 <ul className="space-y-3 pr-2 list-none">
                    <li className="flex items-start gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                       <span>تأكد من اختيار شبكة <span className="font-black text-red-600">{networkLabel}</span> حصراً عند الإرسال.</span>
                    </li>
                    <li className="flex items-start gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                       <span>تحقق من صحة العنوان قبل تنفيذ العملية.</span>
                    </li>
                    <li className="flex items-start gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                       <span>أي إيداع عبر شبكة غير مدعومة أو إلى عنوان غير صحيح قد يؤدي إلى فقدان الأموال بشكل دائم.</span>
                    </li>
                 </ul>
              </div>
           </div>
         </div>

         <div className="space-y-4 pt-2">
           <div className="flex items-center justify-between px-4">
              <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">إثبات المزامنة (TXID)</Label>
              <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[8px] px-2 py-0.5 rounded-full">TXID Required</Badge>
           </div>
           <div className="relative h-18 rounded-[32px] bg-gray-50/50 border border-gray-100 overflow-hidden group/input transition-all focus-within:border-[#002d4d]">
              <input 
                value={txid} 
                onChange={e => setTxid(e.target.value)} 
                className="h-full w-full bg-transparent border-none text-center font-normal text-sm px-14 outline-none text-[#002d4d]" 
                placeholder="ألصق معرف العملية هنا..." 
              />
              <button 
                onClick={handlePaste} 
                type="button" 
                className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#f9a885] shadow-sm hover:bg-gray-50 transition-all active:scale-90"
              >
                 <ClipboardPaste size={20} />
              </button>
              <Hash className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-200" />
           </div>
         </div>

         <div className="grid gap-4">
            <Button 
              onClick={onSubmit} 
              disabled={loading || !txid} 
              className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-normal text-base shadow-xl active:scale-95 flex items-center justify-center gap-3 transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <><span className="font-black">تأكيد المزامنة</span><ShieldCheck size={24} className="text-[#f9a885]" /></>
              )}
            </Button>
            <Button onClick={() => setIsShareDrawerOpen(true)} variant="ghost" className="h-12 rounded-full text-gray-400 font-bold text-[10px] uppercase tracking-widest">حفظ تفاصيل المعاملة</Button>
         </div>
      </section>

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
