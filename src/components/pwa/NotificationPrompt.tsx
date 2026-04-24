
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ShieldCheck, Sparkles, X, CheckCircle2, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationPromptProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSuccess: boolean;
  isLoading: boolean;
}

/**
 * @fileOverview نافذة تفعيل التنبيهات الموحدة v1.0
 * تم استخراج الواجهة في ملف مستقل لسهولة التخصيص وتطهير اللغة من المصطلحات العسكرية.
 */
export function NotificationPrompt({ 
  isVisible, 
  onClose, 
  onConfirm, 
  isSuccess, 
  isLoading 
}: NotificationPromptProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: 20, opacity: 0 }}
          className="fixed bottom-24 left-6 right-6 md:left-auto md:right-10 md:bottom-10 z-[1500] md:w-[380px]"
          dir="rtl"
        >
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 space-y-6 relative overflow-hidden">
             {/* Background Atmosphere */}
             <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none -rotate-12 text-[#002d4d]">
                <Bell size={120} />
             </div>
             
             <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "h-12 w-12 rounded-[20px] flex items-center justify-center shadow-inner transition-all duration-500",
                  isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                )}>
                   {isSuccess ? (
                     <CheckCircle2 size={24} className="animate-in zoom-in duration-500" />
                   ) : isLoading ? (
                     <Loader2 size={24} className="animate-spin" />
                   ) : (
                     <Bell size={24} className="animate-pulse" />
                   )}
                </div>
                <div className="text-right flex-1">
                   <h4 className="text-base font-black text-[#002d4d]">
                     {isSuccess ? "تم تفعيل التنبيهات" : "تفعيل التنبيهات الذكية"}
                   </h4>
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">
                     {isSuccess ? "Active" : "Notifications Center"}
                   </p>
                </div>
                {!isSuccess && !isLoading && (
                  <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition-colors">
                     <X size={18} />
                  </button>
                )}
             </div>

             <div className="relative min-h-[40px]">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div 
                      key="success-text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3"
                    >
                       <ShieldCheck size={16} className="text-emerald-500" />
                       <p className="text-[11px] font-black text-emerald-800">
                          شكراً لك، ستقوم ناميكس الآن بإخطارك بكافة التحديثات والفرص مباشرة على شاشة جهازك.
                       </p>
                    </motion.div>
                  ) : (
                    <motion.p 
                      key="idle-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[12px] font-bold text-gray-500 leading-relaxed text-right pr-2"
                    >
                       احصل على وصول فوري لأحدث التحليلات، وتحديثات محفظتك، وتنبيهات الأمان مباشرة على شاشة قفل جهازك.
                    </motion.p>
                  )}
                </AnimatePresence>
             </div>

             {!isSuccess && (
               <div className="pt-2 relative z-10">
                 <Button 
                   onClick={onConfirm}
                   disabled={isLoading}
                   className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : (
                      <>
                        <span>تفعيل التنبيهات</span>
                        <Sparkles size={16} className="text-[#f9a885]" />
                      </>
                    )}
                 </Button>
               </div>
             )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
