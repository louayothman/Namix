
"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Zap,
  ArrowRight,
  ArrowLeft,
  Trophy
} from "lucide-react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const NebulaBackground = () => {
  const [particles, setParticles] = useState<{ x: number; y: number; s: number; d: number }[]>([]);

  useEffect(() => {
    const p = [...Array(30)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.5 + Math.random() * 1.5,
      d: 4 + Math.random() * 8
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#001a2d]">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 360]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-30%] right-[-20%] w-[120%] h-[120%] bg-blue-600/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.35, 0.15],
          rotate: [360, 0]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] bg-[#f9a885]/10 rounded-full blur-[100px]" 
      />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -120, 0],
            x: [0, i % 2 === 0 ? 60 : -60, 0],
            opacity: [0, 0.5, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: p.d, 
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          style={{ 
            top: `${p.y}%`, 
            left: `${p.x}%`, 
            width: p.s, 
            height: p.s 
          }}
        />
      ))}
    </div>
  );
};

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactClick: () => void;
}

export function FAQDialog({ open, onOpenChange, onContactClick }: FAQDialogProps) {
  const db = useFirestore();
  const legalDocRef = useMemoFirebase(() => doc(db, "system_settings", "legal"), [db]);
  const { data: legal, isLoading } = useDoc(legalDocRef);
  const [animationData, setAnimationData] = useState<any>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (open) {
      setCurrentPage(0); // Reset to first page on open
      fetch("https://lottie.host/a3b075de-a80a-45aa-9541-69dec9a4b509/1zLc1g5GYE.json")
        .then(res => res.json())
        .then(data => setAnimationData(data))
        .catch(err => console.error("Lottie Load Error:", err));
    }
  }, [open]);

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
          className="fixed left-[50%] top-[50%] z-[1001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[900px] w-[95vw] overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(0,45,77,0.3)] outline-none font-body" 
          dir="rtl"
        >
          <div className="flex flex-row min-h-[450px] md:min-h-[600px]">
            
            <div className="w-1/2 bg-[#001a2d] p-4 md:p-10 relative overflow-hidden flex flex-col items-center justify-center border-l border-white/5">
               <NebulaBackground />
               
               <div className="relative z-10 w-full max-w-[240px] md:max-w-[320px] aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-[40px] md:blur-[80px] animate-pulse" />
                  {animationData ? (
                    <Lottie animationData={animationData} loop={true} className="w-full h-full scale-110" />
                  ) : (
                    <Loader2 className="h-8 w-8 animate-spin text-[#f9a885] opacity-20" />
                  )}
               </div>

               <div className="mt-6 text-center space-y-1 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[#f9a885] font-black text-[7px] md:text-[9px] uppercase tracking-[0.3em]">
                     <HelpCircle size={10} />
                     Knowledge Base
                  </div>
                  <p className="text-blue-100/30 text-[6px] md:text-[8px] font-bold uppercase tracking-widest">Namix Global Support</p>
               </div>
            </div>

            <div className="w-1/2 p-5 md:p-12 space-y-6 md:space-y-10 bg-white relative flex flex-col">
               <div className="space-y-2 md:space-y-4 text-right group/header">
                  <div className="relative inline-flex items-center justify-start">
                     <div className="absolute -right-6 -top-6 md:-right-10 md:-top-10 opacity-5 group-hover/header:opacity-15 group-hover/header:rotate-12 transition-all duration-700 pointer-events-none text-blue-600">
                        <Trophy size={80} className="md:size-[120px]" />
                     </div>
                     <DialogTitle className="text-sm md:text-3xl font-black text-[#002d4d] leading-none relative z-10">الأسئلة الشائعة</DialogTitle>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 justify-start opacity-40">
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                     <p className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Sovereign FAQ Repository</p>
                  </div>
               </div>

               <div className="flex-1 overflow-hidden flex flex-col space-y-6">
                  {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                       <Loader2 className="h-6 w-6 animate-spin text-gray-200" />
                       <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">جاري جرد بروتوكولات المعرفة...</p>
                    </div>
                  ) : faqs.length > 0 ? (
                    <>
                      <div className="flex-1 overflow-y-auto pr-1 scrollbar-none space-y-4">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Accordion type="single" collapsible className="w-full">
                              {currentFaqs.map((faq: any, i: number) => (
                                <AccordionItem key={i} value={`item-${i}`} className="border-gray-50 last:border-0 mb-2">
                                  <AccordionTrigger className="text-right font-black text-[#002d4d] text-[10px] md:text-xs hover:no-underline py-4 transition-all hover:px-2 group">
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

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-50 bg-white shrink-0">
                           <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                                className="h-8 w-8 rounded-xl bg-gray-50 text-[#002d4d] disabled:opacity-30 active:scale-90"
                              >
                                 <ArrowRight size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage === totalPages - 1}
                                className="h-8 w-8 rounded-xl bg-gray-50 text-[#002d4d] disabled:opacity-30 active:scale-90"
                              >
                                 <ArrowLeft size={14} />
                              </Button>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-[#002d4d] tabular-nums">
                                صفحة {currentPage + 1} من {totalPages}
                              </span>
                              <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                           </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-20 opacity-20">
                       <ShieldCheck className="h-12 w-12 mx-auto mb-4" />
                       <p className="text-[10px] font-black uppercase">No active protocols found</p>
                    </div>
                  )}
               </div>

               <div className="pt-6 border-t border-gray-50 mt-auto flex flex-col gap-3">
                  <Button onClick={() => { onOpenChange(false); onContactClick(); }} className="h-10 md:h-16 px-6 md:px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-[10px] md:text-lg shadow-xl active:scale-95 group transition-all flex items-center justify-center gap-3">
                     تواصل معنا الآن
                     <MessageSquare className="h-4 w-4 md:h-6 md:w-6 group-hover:rotate-12 transition-transform text-[#f9a885]" />
                  </Button>
                  <button onClick={() => onOpenChange(false)} className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-[#002d4d] transition-colors text-center">إغلاق والمتابعة</button>
               </div>
            </div>

          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
