
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, Info, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalLinksProps {
  terms: string;
  privacy: string;
}

export function LegalLinks({ terms, privacy }: LegalLinksProps) {
  return (
    <div className="text-center px-6">
      <div className="text-[10px] leading-relaxed text-gray-400 font-bold space-x-1 space-x-reverse opacity-60 flex items-center justify-center flex-wrap gap-1">
        <span>بالاستمرار، أنت توافق على</span>
        <Dialog>
          <DialogTrigger className="text-[#002d4d] hover:text-[#f9a885] transition-colors font-black cursor-pointer underline underline-offset-4 decoration-blue-100 hover:decoration-[#f9a885]">شروط الاستخدام</DialogTrigger>
          <DialogContent className="max-w-lg rounded-[48px] border-none shadow-2xl p-0 overflow-hidden font-body text-right outline-none" dir="rtl">
            <div className="bg-[#002d4d] p-10 text-white relative shrink-0">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none">
                  <Info className="h-40 w-40" />
               </div>
               <div className="flex items-center gap-5 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                     <Info className="h-6 w-6 text-[#f9a885]" />
                  </div>
                  <div className="space-y-0.5">
                     <DialogTitle className="text-2xl font-black">شروط الاستخدام</DialogTitle>
                     <div className="flex items-center gap-2 text-blue-200/60 font-black text-[8px] uppercase tracking-widest">
                        <Sparkles className="h-2 w-2" />
                        Legal Agreement Protocol
                     </div>
                  </div>
               </div>
            </div>
            <ScrollArea className="h-[45vh] p-10 bg-white">
              <p className="whitespace-pre-wrap leading-[2.2] text-gray-500 font-bold text-[13px] pr-2">{terms || "جاري جرد بنود الاتفاقية..."}</p>
            </ScrollArea>
            <div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
               <DialogClose asChild>
                 <Button className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-xl active:scale-95 transition-all">
                    إغلاق الوثيقة
                 </Button>
               </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        <span>و</span>
        <Dialog>
          <DialogTrigger className="text-[#002d4d] hover:text-[#f9a885] transition-colors font-black cursor-pointer underline underline-offset-4 decoration-blue-100 hover:decoration-[#f9a885]">سياسة الخصوصية</DialogTrigger>
          <DialogContent className="max-w-lg rounded-[48px] border-none shadow-2xl p-0 overflow-hidden font-body text-right outline-none" dir="rtl">
            <div className="bg-emerald-600 p-10 text-white relative shrink-0">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 pointer-events-none">
                  <ShieldCheck className="h-40 w-40" />
               </div>
               <div className="flex items-center gap-5 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                     <ShieldCheck className="h-6 w-6 text-emerald-100" />
                  </div>
                  <div className="space-y-0.5">
                     <DialogTitle className="text-2xl font-black">سياسة الخصوصية</DialogTitle>
                     <div className="flex items-center gap-2 text-emerald-100/60 font-black text-[8px] uppercase tracking-widest">
                        <ShieldCheck className="h-2 w-2" />
                        Data Protection Standard
                     </div>
                  </div>
               </div>
            </div>
            <ScrollArea className="h-[45vh] p-10 bg-white">
              <p className="whitespace-pre-wrap leading-[2.2] text-gray-500 font-bold text-[13px] pr-2">{privacy || "جاري تهيئة ميثاق الخصوصية..."}</p>
            </ScrollArea>
            <div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
               <DialogClose asChild>
                 <Button className="w-full h-12 rounded-full bg-emerald-600 text-white font-black text-xs shadow-xl active:scale-95 transition-all">
                    لقد قرأت السياسة
                 </Button>
               </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
