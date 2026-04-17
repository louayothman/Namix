
"use client";

import React, { useState, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogPortal, 
  DialogOverlay
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Zap,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const NebulaBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#001a2d]">
    <div className="absolute top-[-30%] right-[-20%] w-[120%] h-[120%] bg-blue-600/5 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-[#f9a885]/5 rounded-full blur-[120px]" />
  </div>
);

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactClick: () => void;
}

export function FAQDialog({ open, onOpenChange, onContactClick }: FAQDialogProps) {
  const db = useFirestore();
  const legalDocRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: legal, isLoading } = useDoc(legalDocRef);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const faqs = useMemo(() => legal?.faq || [], [legal]);
  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  
  const currentFaqs = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return faqs.slice(start, start + itemsPerPage);
  }, [faqs, currentPage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[900px] w-[95vw] overflow-hidden bg-white shadow-2xl outline-none font-body" 
          dir="rtl"
        >
          <div className="flex flex-row min-h-[450px] md:min-h-[600px]">
            
            <div className="w-1/2 bg-[#001a2d] p-4 md:p-10 relative overflow-hidden flex flex-col items-center justify-center border-l border-white/5">
               <NebulaBackground />
               
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-[60px] animate-pulse" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                     <HelpCircle className="h-32 w-32 md:h-56 md:w-56 text-[#f9a885] drop-shadow-[0_0_40px_rgba(249,168,133,0.3)]" strokeWidth={1} />
                  </motion.div>
               </div>

               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#f9a885] font-black text-[7px] md:text-[9px] uppercase tracking-normal">
                     <Sparkles size={10} />
                     Knowledge Base
                  </div>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-12 space-y-6 md:space-y-10 bg-white relative flex flex-col">
               <div className="space-y-2 md:space-y-4 text-right group/header">
                  <div className="relative inline-flex items-center justify-start">
                     <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5 transition-all duration-700 pointer-events-none text-blue-600">
                        <Trophy size={80} className="md:size-[120px]" />
                     </div>
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">الأسئلة الشائعة</DialogTitle>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-start opacity-40">
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                     <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-normal">Sovereign FAQ Repository</p>
                  </div>
               </div>

               <div className="flex-1 overflow-hidden flex flex-col space-y-6">
                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                       <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
                       <p className="text-[8px] font-black text-gray-300 uppercase tracking-normal">Scanning Nodes...</p>
                    </div>
                  ) : faqs.length > 0 ? (
                    <>
                      <div className="flex-1 overflow-y-auto pr-1 scrollbar-none space-y-4">
                        <AnimatePresence mode="wait">
                          <motion.div key={currentPage} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <Accordion type="single" collapsible className="w-full">
                              {currentFaqs.map((faq: any, i: number) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-gray-50 last:border-0 mb-2">
                                  <AccordionTrigger className="text-right font-black text-[#002d4d] text-[10px] md:text-xs hover:no-underline py-4 group">
                                    <div className="flex items-center gap-3">
                                       <div className="h-6 w-6 rounded-lg bg-gray-50 flex items-center justify-center text-blue-500 shadow-inner group-hover:bg-blue-50 transition-all">
                                          <Zap size={12} className="fill-current" />
                                       </div>
                                       {faq.q}
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="text-gray-500 font-medium leading-relaxed text-[9px] md:text-sm text-right pb-6 pr-10 border-r border-[#f9a885]/20 mr-3 whitespace-pre-wrap">
                                    {faq.a}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-50 bg-white">
                           <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="h-8 w-8 rounded-xl bg-gray-50 text-[#002d4d]"><ArrowRight size={14} /></Button>
                              <Button variant="ghost" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} className="h-8 w-8 rounded-xl bg-gray-50 text-[#002d4d]"><ArrowLeft size={14} /></Button>
                           </div>
                           <span className="text-[10px] font-black text-[#002d4d]">صفحة {currentPage + 1} من {totalPages}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20 opacity-20">
                       <ShieldCheck className="h-12 w-12 mx-auto mb-4" />
                       <p className="text-[10px] font-black uppercase">No Data Found</p>
                    </div>
                  )}
               </div>

               <div className="pt-6 border-t border-gray-50 mt-auto flex flex-col gap-3">
                  <Button onClick={() => { onOpenChange(false); onContactClick(); }} className="h-10 md:h-16 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[9px] md:text-lg shadow-xl active:scale-95 group transition-all flex items-center justify-center gap-3">
                     تواصل معنا الآن
                     <MessageSquare className="h-4 w-4 md:h-6 md:w-6 group-hover:rotate-12 transition-transform text-[#f9a885]" />
                  </Button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
