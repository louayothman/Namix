
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  Check, 
  Copy, 
  ShieldCheck, 
  AlertCircle,
  ChevronLeft,
  Share2,
  Loader2
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { QRCodeSVG } from "qrcode.react";
import { DepositShareDrawer } from "../../DepositShareDrawer";

interface NowPaymentsExecutionStepProps {
  selectedAsset: any;
  selectedNetwork: any;
  walletAddress: string;
  loading: boolean;
  onSubmit: () => void;
  error: string | null;
}

export function NowPaymentsExecutionStep({
  selectedAsset,
  selectedNetwork,
  walletAddress,
  loading,
  onSubmit,
  error
}: NowPaymentsExecutionStepProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopyStatus("تم النسخ");
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const networkLabel = selectedNetwork?.network || "المعتمدة";

  return (
    <div className="w-full space-y-10 text-right font-body animate-in fade-in duration-700" dir="rtl">
      
      <section className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-center justify-center">
               <CryptoIcon name={selectedAsset?.icon} size={48} />
            </div>
            <div className="text-right space-y-0.5">
               <h3 className="text-xl font-normal text-[#002d4d] leading-none">{selectedAsset?.name}</h3>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">{networkLabel}</p>
            </div>
         </div>
         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full animate-pulse">ACTIVE NODE</Badge>
      </section>

      <section className="space-y-10">
         <div className="flex flex-col items-center gap-8">
            <div className="relative h-56 w-56 md:h-64 md:w-64 flex items-center justify-center">
               <QRCodeSVG 
                 value={walletAddress || "Generating..."} 
                 size={256} 
                 bgColor={"transparent"} 
                 fgColor={"#002d4d"} 
                 level={"H"} 
                 includeMargin={false} 
                 className="w-full h-full" 
               />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!walletAddress && <Loader2 className="animate-spin text-gray-200" size={32} />}
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
               <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
                  <p className="flex-1 font-normal text-xs text-[#002d4d] break-all text-center leading-relaxed font-mono opacity-80" dir="ltr">
                    {walletAddress || "جاري توليد العنوان..."}
                  </p>
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

         <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
           <div className="flex items-center gap-2 text-[#002d4d] mb-1">
             <Info size={16} />
             <h4 className="text-[11px] font-black uppercase tracking-widest">تعليمات الإيداع المعتمدة</h4>
           </div>
           
           <div className="space-y-6 text-[12px] font-normal leading-loose text-gray-500">
              <p>أودع الأموال إلى العنوان أعلاه عبر شبكة <span className="font-black text-[#002d4d]">{networkLabel}</span> فقط.</p>
              <p className="font-black text-[#002d4d] text-[13px]">سيتم إضافة الرصيد إلى محفظتك تلقائياً بعد إتمام العملية.</p>

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

         <div className="pt-4">
            <button 
              onClick={() => window.location.href = '/home'} 
              className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
               <span className="relative z-10">العودة للرئيسية</span>
               <ChevronLeft className="h-6 w-6 text-[#f9a885] transition-transform group-hover:-translate-x-1 relative z-10" />
            </button>
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
