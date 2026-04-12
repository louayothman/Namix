
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
  Sparkles,
  AlertCircle,
  ChevronLeft,
  Clock,
  Zap
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

  return (
    <div className="w-full space-y-8 text-right font-body animate-in fade-in duration-700" dir="rtl">
      <section className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-center justify-center">
               <CryptoIcon name={selectedAsset?.icon} size={48} />
            </div>
            <div className="text-right space-y-0.5">
               <h3 className="text-xl font-normal text-[#002d4d] leading-none">{selectedAsset?.name}</h3>
               <p className="text-[10px] text-gray-400 uppercase tracking-widest">{selectedNetwork?.network}</p>
            </div>
         </div>
         <Badge className="bg-purple-50 text-purple-600 border-none font-black text-[8px] px-3 py-1 rounded-full animate-pulse">AUTO-SYNC ACTIVE</Badge>
      </section>

      {!walletAddress ? (
        <section className="space-y-8 animate-in zoom-in-95">
           <div className="p-10 bg-[#002d4d] rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                 <Zap size={160} />
              </div>
              <div className="relative z-10 flex flex-col items-center text-center gap-6">
                 <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner">
                    <Sparkles className="h-8 w-8 text-[#f9a885] animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-2xl font-black">جاهز لتوليد العنوان</h4>
                    <p className="text-[11px] font-bold text-blue-100/60 leading-loose px-4">
                      اضغط على الزر أدناه للحصول على عنوان إيداع فريد. يمكنك إرسال أي مبلغ وسيقوم النظام بمزامنته مع رصيدك آلياً.
                    </p>
                 </div>
              </div>
           </div>

           <Button onClick={onSubmit} disabled={loading} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl active:scale-95 transition-all group">
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <div className="flex items-center gap-3">
                   <span>توليد عنوان الإيداع</span>
                   <ChevronLeft className="h-5 w-5 text-[#f9a885] group-hover:-translate-x-1 transition-transform" />
                </div>
              )}
           </Button>
           {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
        </section>
      ) : (
        <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
           <div className="flex justify-center">
              <div className="relative h-48 w-48 md:h-56 md:w-56 flex items-center justify-center">
                 <QRCodeSVG value={walletAddress} size={256} bgColor={"transparent"} fgColor={"#002d4d"} level={"H"} includeMargin={false} className="w-full h-full" />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-1 rounded-sm"><CryptoIcon name={selectedAsset?.icon} size={28} /></div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
                 <p className="flex-1 font-normal text-xs text-[#002d4d] break-all text-center leading-relaxed font-mono opacity-80" dir="ltr">{walletAddress}</p>
                 <button onClick={handleCopy} className="h-10 w-10 text-gray-300 hover:text-[#002d4d] transition-all shrink-0 active:scale-90">
                   {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
                 </button>
              </div>
           </div>

           <div className="p-6 bg-blue-50/40 rounded-[32px] border border-blue-100/50 space-y-5">
             <div className="flex items-center gap-2 text-blue-600 mb-1">
               <Info size={14} />
               <h4 className="text-[10px] font-black uppercase tracking-widest">تعليمات الإيداع المباشر</h4>
             </div>
             <div className="space-y-5 text-[11px] font-normal leading-loose text-blue-800/70">
                <p>أودع الأموال إلى العنوان أعلاه عبر شبكة <span className="font-black text-blue-900">{selectedNetwork?.network}</span> فقط.</p>
                <p className="font-black text-blue-900 text-sm">سيتم إضافة الرصيد إلى محفظتك بعد اتمام العملية.</p>
                <div className="flex items-center gap-3 py-2 px-4 bg-white/50 rounded-2xl border border-white">
                   <Clock size={14} className="text-[#f9a885]" />
                   <span className="text-[9px] font-black uppercase">هذا العنوان مخصص لك ولمدة ساعة كاملة</span>
                </div>
                <div className="space-y-2 pt-4 border-t border-blue-100/50">
                   <p className="font-black text-red-500/70 flex items-center gap-1.5"><AlertCircle size={10} /> تحذير:</p>
                   <ul className="list-disc pr-4 space-y-2 text-[10px]">
                      <li>تأكد من اختيار شبكة <span className="font-black">{selectedNetwork?.network}</span> حصراً عند الإرسال.</li>
                      <li>تحقق من صحة العنوان قبل تنفيذ العملية.</li>
                      <li>أي إيداع عبر شبكة غير مدعومة أو إلى عنوان غير صحيح قد يؤدي إلى فقدان الأموال بشكل دائم.</li>
                   </ul>
                </div>
             </div>
           </div>

           <div className="grid gap-4">
              <button onClick={() => window.location.href = '/home'} className="w-full h-16 rounded-[40px] bg-[#002d4d] text-white font-normal text-base shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] group">
                 <span>العودة للرئيسية</span><ChevronLeft className="h-6 w-6 text-[#f9a885] group-hover:-translate-x-1 transition-transform" />
              </button>
              <Button onClick={() => setIsShareDrawerOpen(true)} variant="ghost" className="h-12 rounded-full text-gray-400 font-bold text-[10px] uppercase tracking-widest">حفظ تفاصيل المعاملة</Button>
           </div>
        </section>
      )}

      <DepositShareDrawer open={isShareDrawerOpen} onOpenChange={setIsShareDrawerOpen} selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} walletAddress={walletAddress} />
    </div>
  );
}
