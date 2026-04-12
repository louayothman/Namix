"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  Loader2, 
  Hash, 
  Coins,
  ShieldCheck
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { AddressDisplay } from "../../shared/AddressDisplay";

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
         <AddressDisplay 
           walletAddress={selectedAsset?.walletAddress} 
           selectedAsset={selectedAsset} 
           selectedNetwork={{ name: 'يدوي' }}
           loading={loading}
         />

         <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-5">
           <div className="flex items-center gap-2 text-[#002d4d] mb-1">
             <Info size={14} />
             <h4 className="text-[10px] font-black uppercase tracking-widest">تعليمات الإيداع</h4>
           </div>
           <p className="text-[11px] font-bold leading-loose text-gray-500 pr-1">{selectedAsset?.instructions}</p>
         </div>

         <div className="space-y-6">
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">مبلغ الإيداع ($)</Label>
               <div className="relative h-18 rounded-[32px] bg-gray-50 border border-gray-100 overflow-hidden shadow-inner">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-full w-full bg-transparent border-none text-center font-normal text-2xl text-[#002d4d] outline-none" placeholder="0.00" />
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-200" />
               </div>
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase">معرف العملية (TXID) / رقم الحوالة</Label>
               <div className="relative h-18 rounded-[32px] bg-gray-50 border border-gray-100 shadow-inner">
                  <input value={txid} onChange={e => setTxid(e.target.value)} className="h-full w-full bg-transparent border-none text-center font-normal text-sm text-[#002d4d] outline-none px-12" placeholder="أدخل المرجع الرقمي..." />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-200" />
               </div>
            </div>
         </div>

         <div className="pt-2">
            <Button onClick={onSubmit} disabled={loading || !amount || !txid} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                <>
                  <span>إرسال طلب الإيداع</span>
                  <ShieldCheck size={20} className="text-[#f9a885]" />
                </>
              )}
            </Button>
         </div>
      </section>
    </div>
  );
}
