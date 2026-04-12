
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  ShieldCheck, 
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { AddressDisplay } from "../../shared/AddressDisplay";

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
         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full">READY</Badge>
      </section>

      <section className="space-y-10">
         <AddressDisplay 
           walletAddress={walletAddress} 
           selectedAsset={selectedAsset} 
           selectedNetwork={selectedNetwork}
           loading={loading}
         />

         <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
           <div className="flex items-center gap-2 text-[#002d4d] mb-1">
             <Info size={16} />
             <h4 className="text-[11px] font-black uppercase tracking-widest">تعليمات الإيداع المعتمدة</h4>
           </div>
           
           <div className="space-y-6 text-[12px] font-normal leading-loose text-gray-500">
              <p>أودع الأموال إلى العنوان أعلاه عبر شبكة <span className="font-black text-[#002d4d]">{networkLabel}</span> فقط.</p>
              <div className="space-y-3 pt-6 border-t border-gray-200">
                 <p className="font-black text-red-500 flex items-center gap-2"><AlertCircle size={14} /> تحذير:</p>
                 <ul className="space-y-3 pr-2 list-none text-[11px]">
                    <li>تأكد من اختيار شبكة <span className="font-black text-red-600">{networkLabel}</span> حصراً.</li>
                    <li>أي إيداع عبر شبكة غير مدعومة قد يؤدي لفقدان الأصول.</li>
                 </ul>
              </div>
           </div>
         </div>

         <div className="pt-4">
            <button 
              onClick={() => window.location.href = '/home'} 
              className="w-full h-18 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all"
            >
               <span>العودة للرئيسية</span>
               <ChevronLeft className="h-6 w-6 text-[#f9a885]" />
            </button>
         </div>
      </section>
    </div>
  );
}
