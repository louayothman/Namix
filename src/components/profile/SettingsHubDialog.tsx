"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, UserCircle, Lock, ChevronLeft, Fingerprint, KeyRound, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SettingsHubDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenEdit: () => void;
  onOpenPassword: () => void;
  onOpenPin: () => void;
}

/**
 * @fileOverview مركز التحكم بالهوية v4990.0 - إصدار الاستقرار الفائق
 * تم إلغاء الإزاحة الرأسية (y-axis) في الحركات الأولية لمنع "الرجفة" عند الفتح على الهواتف.
 */
export function SettingsHubDialog({ open, onOpenChange, onOpenEdit, onOpenPassword, onOpenPin }: SettingsHubDialogProps) {
  const actions = [
    { title: "توثيق الهوية المعتمد", desc: "تحديث البيانات الشخصية والمستندات القانونية", icon: UserCircle, color: "text-blue-500", action: onOpenEdit },
    { title: "تغيير كلمة المرور", desc: "تحديث شفرة الدخول وبروتوكولات الأمان", icon: KeyRound, color: "text-[#f9a885]", action: onOpenPassword },
    { title: "رمز PIN الخزنة", desc: "تأمين العمليات المالية برمز حماية حيوي", icon: Fingerprint, color: "text-emerald-500", action: onOpenPin },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[48px] border-none shadow-2xl p-0 max-w-[380px] overflow-hidden font-body text-right flex flex-col max-h-[85vh] outline-none z-[1100] transition-none" dir="rtl">
        
        {/* Header - Fixed & Stable */}
        <div className="bg-[#002d4d] p-6 md:p-8 text-white relative shrink-0 overflow-hidden text-center border-b border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-[0.04] -rotate-12 pointer-events-none will-change-transform">
              <Settings className="h-32 w-32" />
           </div>
           
           <div className="relative z-10 space-y-3">
              <div className="h-12 w-12 rounded-[20px] bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner mx-auto">
                 <Settings className="h-6 w-6 text-[#f9a885]" />
              </div>
              <div className="space-y-0.5">
                 <DialogTitle className="text-lg font-black tracking-normal">مركز التحكم بالهوية</DialogTitle>
                 <div className="flex items-center justify-center gap-2 text-blue-200/40 font-black text-[7px] uppercase tracking-[0.3em]">
                    <Sparkles className="h-1.5 w-1.5" />
                    Sovereign Identity Hub
                 </div>
              </div>
           </div>
        </div>
        
        {/* Content Area - Optimized Stagger */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white scrollbar-none">
           {actions.map((item, i) => (
             <motion.button 
               key={i}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: i * 0.04, duration: 0.3 }}
               onClick={() => { 
                 onOpenChange(false); 
                 setTimeout(() => item.action(), 100); 
               }} 
               className="w-full relative overflow-hidden flex items-center justify-between p-5 bg-gray-50/50 hover:bg-white border border-gray-100 rounded-[32px] transition-all group active:scale-[0.98] hover:shadow-xl"
             >
                {/* Background Icon - Stable Position */}
                <div className={cn(
                  "absolute -bottom-4 -left-4 opacity-[0.03] transition-all duration-700 pointer-events-none will-change-transform",
                  item.color
                )}>
                   <item.icon size={80} strokeWidth={1.2} />
                </div>

                <div className="relative z-10 text-right space-y-0.5">
                   <h3 className="font-black text-[13px] text-[#002d4d] tracking-normal">
                      {item.title}
                   </h3>
                   <p className="text-[9px] text-gray-400 font-bold leading-tight max-w-[200px]">
                      {item.desc}
                   </p>
                </div>

                <div className="relative z-10 h-8 w-8 rounded-full bg-white flex items-center justify-center text-gray-200 group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shadow-sm">
                   <ChevronLeft className="h-4 w-4" />
                </div>
             </motion.button>
           ))}
        </div>
        
        <div className="p-5 bg-gray-50/50 border-t border-gray-100 text-center shrink-0">
           <button onClick={() => onOpenChange(false)} className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">
              Close Identity Console
           </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
