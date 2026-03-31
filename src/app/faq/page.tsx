
"use client";

import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFirestore, useDoc } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { Loader2, HelpCircle, ChevronRight, Sparkles, Headset, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SupportSheet } from "@/components/support/SupportSheet";

export default function FAQPage() {
  const router = useRouter();
  const db = useFirestore();
  const legalDocRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: legal, isLoading } = useDoc(legalDocRef);
  
  const [supportOpen, setSupportOpen] = useState(false);

  const faqs = legal?.faq || [];

  return (
    <Shell isPublic>
      <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-24">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#8899AA] font-black text-[9px] uppercase tracking-[0.3em]">
              <div className="h-1.5 w-1.5 rounded-full bg-[#8899AA]" />
              Knowledge Base Protocol
            </div>
            <h1 className="text-3xl font-black text-[#002d4d]">الأسئلة الشائعة</h1>
            <p className="text-muted-foreground font-bold text-[10px]">دليلك الشامل لفهم آليات عمل المنصة.</p>
          </div>
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full bg-white shadow-sm h-14 w-14 border border-gray-50 transition-all hover:shadow-md active:scale-95">
            <ChevronRight className="h-6 w-6 text-[#002d4d]" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">جاري جلب البيانات من القاعدة...</p>
          </div>
        ) : faqs.length > 0 ? (
          <div className="bg-white rounded-[48px] p-8 shadow-sm border border-gray-50 pb-12">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq: any, i: number) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-gray-50 last:border-0 mb-2">
                  <AccordionTrigger className="text-right font-black text-[#002d4d] text-sm hover:no-underline py-6 transition-all hover:px-2 group">
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-blue-500 shadow-inner group-hover:bg-blue-50 transition-all">
                          <HelpCircle className="h-4 w-4" />
                       </div>
                       {faq.q}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 font-medium leading-[2.2] text-[13px] text-right pb-8 pr-12 border-r-2 border-[#f9a885]/20 mr-4 whitespace-pre-wrap animate-in fade-in duration-500">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-40 bg-white/40 rounded-[56px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-6">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center">
              <HelpCircle className="h-10 w-10 text-gray-200" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-300 font-black text-sm uppercase tracking-widest">No FAQ Found</p>
              <p className="text-[10px] text-gray-200 font-bold">لم يتم تحديث قاعدة المعرفة بعد.</p>
            </div>
          </div>
        )}

        <div className="p-8 bg-[#002d4d] rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 transition-transform duration-1000 group-hover:scale-150">
             <MessageSquare className="h-32 w-32" />
          </div>
          <div className="space-y-1 text-center md:text-right relative z-10">
            <h3 className="font-black text-lg">لم تجد إجابتك؟</h3>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Direct Support Protocol</p>
          </div>
          <Button 
            onClick={() => setSupportOpen(true)}
            className="rounded-full h-14 px-8 bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-xs shadow-xl transition-all active:scale-95 relative z-10"
          >
            تحدث مع الدعم الفني
          </Button>
        </div>
      </div>

      <SupportSheet open={supportOpen} onOpenChange={setSupportOpen} />
    </Shell>
  );
}
