
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
  AlertCircle, 
  ClipboardPaste,
  Sparkles,
  ChevronLeft
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
  const [pasteStatus, setPasteStatus] = useState<Record<string, boolean>>({});
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopyStatus("تم نسخ العنوان");
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(() => {
        setCopyStatus("فشل النسخ");
        setTimeout(() => setCopyStatus(null), 2000);
      });
  };

  const handlePaste = async (fieldName: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTxid(text);
        setPasteStatus(prev => ({ ...prev, [fieldName]: true }));
        setTimeout(() => setPasteStatus(prev => {
          const next = { ...prev };
          delete next[fieldName];
          return next;
        }), 2000);
      }
    } catch (err) {}
  };

  const qrCodeUrl = walletAddress 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff&color=002d4d`
    : null;

  return (
    <div className="w-full space-y-8 font-body text-right select-none" dir="rtl">
      
      {/* هيدر القمة الصافي - نقاء مؤسساتي بدون أطر */}
      <section className="flex items-center gap-4 animate-in fade-in duration-700 px-2">
         <div className="shrink-0 flex items-center justify-center">
            <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={48} />
         </div>
         <div className="text-right space-y-0.5">
            <h3 className="text-xl font-black text-[#002d4d] leading-none tracking-normal">
              {selectedAsset?.name || selectedAsset?.coin}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-normal">
               {selectedNetwork?.name || selectedAsset?.network}
            </p>
         </div>
      </section>

      {/* الباركود المطور - عرض مباشر فوق الخلفية */}
      <section className="flex justify-center relative py-2">
         <div className="relative group">
            <div className="relative p-6 bg-white rounded-[48px] border border-gray-100 shadow-inner overflow-hidden transition-all duration-1000">
               {qrCodeUrl ? (
                 <div className="relative h-48 w-48 md:h-56 md:w-56 flex items-center justify-center">
                    <img src={qrCodeUrl} alt="QR" className="w-full h-full rounded-3xl" />
                    {/* أيقونة مركزية مدمجة بنقاء */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-white p-0.5">
                          <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={28} />
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-48 w-48 md:h-56 md:w-56 flex items-center justify-center bg-gray-50 rounded-3xl">
                    <Loader2 className="animate-spin text-gray-200" />
                 </div>
               )}
            </div>
            {/* توهج خلفي ناعم */}
            <motion.div 
              animate={{ opacity: [0.02, 0.05, 0.02] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-[-30px] bg-blue-500 rounded-full blur-[60px] -z-10"
            />
         </div>
      </section>

      {/* العنوان الرقمي والتحكم */}
      <section className="space-y-6">
         <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
               <p className="flex-1 font-mono text-[10px] font-black text-[#002d4d] break-all text-center leading-relaxed opacity-80" dir="ltr">
                 {loading && !walletAddress ? "جاري الاتصال..." : walletAddress}
               </p>
               <button 
                 onClick={handleCopy} 
                 disabled={!walletAddress}
                 className="h-10 w-10 flex items-center justify-center text-gray-300 hover:text-[#002d4d] transition-all active:scale-90 shrink-0"
               >
                 {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
               </button>
            </div>
            <AnimatePresence>
              {copyStatus && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[9px] font-black text-emerald-500 tracking-normal">{copyStatus}</motion.p>
              )}
            </AnimatePresence>
         </div>

         {/* بوابة المشاركة النخبوية */}
         <Button 
           onClick={() => setIsShareDrawerOpen(true)}
           disabled={!walletAddress}
           className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[11px] md:text-sm shadow-xl transition-all active:scale-[0.98] group relative overflow-hidden"
         >
            <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
            <div className="relative z-10 flex items-center justify-center gap-3">
               <Sparkles size={18} className="group-hover:rotate-12 transition-transform text-[#f9a885]" />
               <span>حفظ ومشاركة العنوان</span>
            </div>
         </Button>
      </section>

      {/* التعليمات والتحذيرات */}
      <section className="space-y-6">
         <div className="p-6 bg-blue-50/40 rounded-[32px] border border-blue-100/50 space-y-2 animate-in fade-in duration-1000">
           <div className="flex items-center gap-2 text-blue-600 mb-1">
             <Info size={14} />
             <h4 className="text-[10px] font-black uppercase tracking-normal">تعليمات الشحن</h4>
           </div>
           <p className="text-[11px] font-bold leading-relaxed text-blue-800/70 tracking-normal">
             يرجى إرسال الرصيد الموضح أعلاه عبر الشبكة المعتمدة. تأكد من تطابق البيانات لتجنب فقدان الأصول.
           </p>
         </div>

         {isBinance && (
           <div className="space-y-3 pt-2 animate-in fade-in duration-500">
             <div className="flex items-center justify-between px-4">
                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-normal">إثبات الإرسال</Label>
                <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[7px] px-2 py-0.5 rounded-md tracking-normal shadow-sm">Sync Node</Badge>
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
                   onClick={() => handlePaste('txid')}
                   type="button"
                   className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#f9a885] hover:bg-[#002d4d] hover:text-white transition-all active:scale-90"
                 >
                   <ClipboardPaste size={18} />
                 </button>
               </div>
               <AnimatePresence>
                 {pasteStatus['txid'] && (
                   <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 right-6 text-[9px] font-black text-emerald-500 tracking-normal">تم اللصق بنجاح</motion.p>
                 )}
               </AnimatePresence>
             </div>
           </div>
         )}

         {isNowPayments && (
           <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <button 
               onClick={() => window.location.href = '/home'}
               className="w-full h-20 rounded-[40px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl relative overflow-hidden group transition-all active:scale-[0.98]"
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
             <p className="text-[10px] font-black tracking-normal">{error}</p>
           </div>
         )}

         {!isNowPayments && (
           <Button 
             onClick={onSubmit} 
             disabled={loading || (!isBinance && !amount) || (isBinance && !txid)} 
             className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all group"
           >
             {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
               <div className="flex items-center gap-3">
                 <span>تأكيد الإيداع</span>
                 <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
               </div>
             )}
           </Button>
         )}
      </section>

      {/* مفاعل المشاركة المنسدل */}
      <DepositShareDrawer 
        open={isShareDrawerOpen} 
        onOpenChange={setIsShareDrawerOpen} 
        selectedAsset={selectedAsset}
        selectedNetwork={selectedNetwork}
        walletAddress={walletAddress}
      />

      <div className="flex items-center justify-center gap-4 opacity-[0.15] select-none pt-2">
         <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase text-[#002d4d] tracking-normal">مؤمن</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-1.5">
            <Sparkles size={10} className="text-[#f9a885]" />
            <span className="text-[7px] font-black uppercase text-[#002d4d] tracking-normal">ناميكس</span>
         </div>
      </div>
    </div>
  );
}
