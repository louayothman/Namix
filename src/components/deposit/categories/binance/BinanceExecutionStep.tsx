"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  Hash, 
  ShieldCheck, 
  ClipboardPaste,
  AlertCircle
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { AddressDisplay } from "../../shared/AddressDisplay";

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
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setTxid(text);
    } catch (err) {}
  };

  const networkLabel = selectedNetwork?.name || selectedNetwork?.network || "الرئيسية";

  return (
    <div className="w-full space-y-10 text-right font-body animate-in fade-in duration-700" dir="rtl">
      
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
         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full">ACTIVE</Badge>
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
             <h4 className="text-[11px] font-black uppercase tracking-widest">تعليمات الإيداع</h4>
           </div>
           
           <div className="space-y-6 text-[12px] font-normal leading-loose text-gray-500">
              <p>أودع الأموال إلى العنوان الموضح أعلاه عبر شبكة <span className="font-black text-[#002d4d]">{networkLabel}</span> فقط.</p>
              <div className="space-y-3 pt-6 border-t border-gray-200">
                 <p className="font-bold text-red-500 flex items-center gap-2"><AlertCircle size={14} /> تحذير:</p>
                 <ul className="space-y-3 pr-2 list-none text-[11px]">
                    <li>تأكد من اختيار شبكة <span className="font-bold text-red-600">{networkLabel}</span> حصراً عند الإرسال.</li>
                    <li>تحقق من صحة العنوان قبل تنفيذ العملية لضمان وصول الأصول.</li>
                 </ul>
              </div>
           </div>
         </div>

         <div className="space-y-4 pt-2">
           <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4">إثبات المزامنة (TXID)</Label>
           <div className="relative h-18 rounded-[32px] bg-gray-50 border border-gray-100 overflow-hidden shadow-inner">
              <input 
                value={txid} 
                onChange={e => setTxid(e.target.value)} 
                className="h-full w-full bg-transparent border-none text-center font-normal text-sm px-14 outline-none text-[#002d4d]" 
                placeholder="ألصق معرف العملية هنا..." 
              />
              <button onClick={handlePaste} type="button" className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#f9a885] active:scale-90 shadow-sm"><ClipboardPaste size={20} /></button>
              <Hash className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-200" />
           </div>
         </div>

         <div className="pt-4">
            <button 
              onClick={onSubmit} 
              disabled={loading || !txid || !walletAddress} 
              className="w-full h-18 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 flex items-center justify-center gap-3"
            >
               <span>المتابعة</span>
               <ShieldCheck size={24} className="text-[#f9a885]" />
            </button>
         </div>
      </section>
    </div>
  );
}
