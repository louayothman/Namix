
"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Check, 
  Share2, 
  Link as LinkIcon, 
  ShieldCheck, 
  Sparkles,
  Info,
  ChevronLeft,
  X
} from "lucide-react";
import { NamixIdQR } from "../../shared/NamixIdQR";
import { DepositShareDrawer } from "../../DepositShareDrawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InternalExecutionStepProps {
  dbUser: any;
}

/**
 * @fileOverview مركز الاستلام الداخلي المطور v2.0 - محتوى مطهر
 * تم حذف كلمات (بروتوكول، ميثاق، سيادة، أرباح، سيولة) واستبدالها بمصطلحات مباشرة.
 */
export function InternalExecutionStep({ dbUser }: InternalExecutionStepProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const namixId = dbUser?.namixId || "...";
  const paymentLink = typeof window !== "undefined" ? `${window.location.origin}/pay?id=${namixId}` : "";

  const handleCopy = (text: string, type: 'id' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopyStatus("تم النسخ");
      setTimeout(() => setCopyStatus(null), 2000);
    } else {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700 font-body text-right" dir="rtl">
      
      {/* 1. Header Section */}
      <section className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-[18px] bg-[#002d4d] text-white flex items-center justify-center shadow-lg">
               <div className="grid grid-cols-2 gap-0.5">
                  <div className="h-1 w-1 rounded-full bg-white" />
                  <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
                  <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
                  <div className="h-1 w-1 rounded-full bg-white" />
               </div>
            </div>
            <div className="space-y-0.5">
               <h3 className="text-xl font-black text-[#002d4d]">استلام مباشر</h3>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Namix Internal Transfer</p>
            </div>
         </div>
         <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner">
            ACTIVE ID
         </Badge>
      </section>

      {/* 2. QR Core */}
      <section className="flex flex-col items-center gap-10">
         <NamixIdQR namixId={namixId} size={220} />

         <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center justify-center gap-3 bg-gray-50/80 px-8 py-3 rounded-full border border-gray-100 shadow-inner group">
               <p className="text-xl font-black text-[#002d4d] tabular-nums tracking-[0.2em]">{namixId}</p>
               <button 
                 onClick={() => handleCopy(namixId, 'id')}
                 className="h-10 w-10 text-gray-300 hover:text-[#002d4d] transition-all shrink-0 active:scale-90"
               >
                 {copyStatus ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
               </button>
            </div>

            <Button 
              onClick={() => setIsShareOpen(true)}
              variant="ghost" 
              className="h-12 rounded-full bg-white text-[#002d4d] font-black text-[10px] px-8 border border-gray-100 shadow-sm active:scale-95 transition-all flex items-center gap-3"
            >
               <Share2 size={16} className="text-blue-500" />
               حفظ ومشاركة المعرف الرقمي
            </Button>
         </div>
      </section>

      {/* 3. Information Briefing */}
      <section className="p-8 bg-[#002d4d] rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 transition-transform duration-1000 group-hover:rotate-0">
            <Sparkles size={120} />
         </div>
         <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
                  <ShieldCheck size={20} className="text-[#f9a885]" />
               </div>
               <h4 className="text-base font-black">دليل الاستلام</h4>
            </div>
            <p className="text-[11px] font-bold text-blue-100/60 leading-[2.2]">
              هذا المعرف الرقمي هو عنوان حسابك في ناميكس. يمكن للمستخدمين الآخرين تحويل الرصيد لك فورياً من محافظهم الجارية عبر مسح هذا الرمز أو استخدام الرابط المخصص.
            </p>
         </div>
      </section>

      {/* 4. Payment Link */}
      <section className="pt-4 pb-20">
         <button 
           onClick={() => setIsLinkOpen(true)}
           className="w-full h-18 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-between px-8 group hover:bg-white hover:shadow-xl transition-all active:scale-[0.98]"
         >
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm group-hover:bg-blue-50 transition-colors">
                  <LinkIcon size={18} />
               </div>
               <div className="text-right">
                  <p className="font-black text-sm text-[#002d4d]">رابط التحويل المباشر</p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Generate URL</p>
               </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-gray-300 group-hover:text-[#002d4d] transition-all" />
         </button>
      </section>

      <Dialog open={isLinkOpen} onOpenChange={setIsLinkOpen}>
         <DialogContent className="rounded-[48px] border-none shadow-2xl p-0 max-w-[400px] overflow-hidden font-body text-right outline-none" dir="rtl">
            <div className="bg-[#002d4d] p-8 text-white relative text-center">
               <div className="absolute top-0 right-0 p-6 opacity-[0.05] -rotate-12 pointer-events-none"><LinkIcon size={120} /></div>
               <div className="h-16 w-16 rounded-3xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner mx-auto mb-4">
                  <LinkIcon size={24} className="text-[#f9a885]" />
               </div>
               <DialogTitle className="text-2xl font-black">رابط التحويل</DialogTitle>
               <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.3em] mt-1">Direct Checkout Link</p>
            </div>
            
            <div className="p-10 space-y-8 bg-white">
               <p className="text-gray-500 font-bold text-xs text-center leading-relaxed">انسخ الرابط وأرسله للآخرين ليتمكنوا من إرسال الرصيد لك بلمسة واحدة.</p>
               
               <div className="p-4 bg-gray-50 rounded-[28px] border border-gray-100 shadow-inner flex flex-col gap-4">
                  <p className="text-[10px] font-mono text-blue-600 break-all text-left" dir="ltr">{paymentLink}</p>
                  <Button 
                    onClick={() => handleCopy(paymentLink, 'link')}
                    className={cn(
                      "w-full h-14 rounded-full font-black text-xs shadow-xl transition-all active:scale-95",
                      linkCopied ? "bg-emerald-500 text-white" : "bg-[#002d4d] text-white"
                    )}
                  >
                     {linkCopied ? (
                       <div className="flex items-center gap-2"><Check size={16} /> <span>تم نسخ الرابط</span></div>
                     ) : (
                       <div className="flex items-center gap-2"><Copy size={16} /> <span>نسخ الرابط</span></div>
                     )}
                  </Button>
               </div>
               
               <button onClick={() => setIsLinkOpen(false)} className="w-full text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">إغلاق</button>
            </div>
         </DialogContent>
      </Dialog>

      <DepositShareDrawer 
        open={isShareOpen} 
        onOpenChange={setIsShareOpen} 
        selectedAsset={{ name: 'Namix User', coin: 'Internal', icon: 'USDT' }} 
        selectedNetwork={{ name: 'تحويل داخلي' }} 
        walletAddress={namixId} 
      />
    </div>
  );
}
