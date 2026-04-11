"use client";

import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogPortal, 
  DialogOverlay 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Sparkles, 
  Gift, 
  ShieldCheck, 
  Coins, 
  ArrowUpCircle,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { cn } from "@/lib/utils";

/**
 * @fileOverview مراقب الإيداع العالمي v1.0 - Global Deposit Observer
 * يقوم بمراقبة سجل الإيداعات المعتمدة في الخلفية وعرض نافذة منبثقة أينما كان المستثمر.
 */
export function GlobalDepositDialog() {
  const [open, setOpen] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState<any>(null);
  const [localUser, setLocalUser] = useState<any>(null);
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) setLocalUser(JSON.parse(session));
  }, []);

  const depositsQuery = useMemoFirebase(() => {
    if (!localUser?.id) return null;
    return query(
      collection(db, "deposit_requests"),
      where("userId", "==", localUser.id),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
  }, [db, localUser?.id]);

  const { data: latestDeposits } = useCollection(depositsQuery);

  useEffect(() => {
    if (latestDeposits && latestDeposits.length > 0) {
      const dep = latestDeposits[0];
      const ackKey = `ack_dep_${dep.id}`;
      const alreadyShown = localStorage.getItem(ackKey);

      if (!alreadyShown) {
        setCurrentDeposit(dep);
        setOpen(true);
        localStorage.setItem(ackKey, "true");
      }
    }
  }, [latestDeposits]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setCurrentDeposit(null), 300);
  };

  if (!currentDeposit) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]" />
        <DialogContent 
          className="fixed left-[50%] top-[50%] z-[2001] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-0 max-w-[380px] w-[92vw] overflow-hidden bg-white shadow-2xl outline-none font-body text-right" 
          dir="rtl"
        >
          {/* Top Visual Glow */}
          <div className="bg-[#002d4d] p-8 text-white relative shrink-0 text-center overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-[0.05] -rotate-12 pointer-events-none">
                <Sparkles size={120} />
             </div>
             
             <motion.div 
               initial={{ scale: 0, rotate: -45 }}
               animate={{ scale: 1, rotate: 0 }}
               className="h-24 w-24 rounded-[32px] bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] mx-auto mb-6 relative"
             >
                <Check size={48} strokeWidth={3} />
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-400/20 rounded-[32px] blur-2xl -z-10"
                />
             </motion.div>

             <DialogTitle className="text-2xl font-black tracking-normal">تم اعتماد الإيداع!</DialogTitle>
             <div className="flex items-center justify-center gap-2 text-blue-200/40 font-black text-[8px] uppercase tracking-[0.3em] mt-2">
                <ShieldCheck size={10} />
                Transaction Verified
             </div>
          </div>

          <div className="p-8 space-y-8 bg-white">
             <div className="text-center space-y-2">
                <p className="text-gray-400 font-bold text-xs leading-relaxed">لقد تم رصد وتأكيد عملية إرسال جديدة في محفظتك. تم تحديث رصيدك المتاح فوراً.</p>
             </div>

             <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-6">
                <div className="text-center space-y-1">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المبلغ المعتمد</p>
                   <h4 className="text-4xl font-black text-[#002d4d] tabular-nums tracking-tighter">${currentDeposit.amount?.toLocaleString()}</h4>
                </div>

                {currentDeposit.bonusApplied > 0 && (
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                           <Gift size={14} className="text-[#f9a885]" />
                           <span className="text-[10px] font-black text-[#002d4d]">مكافأة النظام</span>
                        </div>
                        <span className="text-sm font-black text-[#f9a885] tabular-nums">+$ {currentDeposit.bonusApplied.toLocaleString()}</span>
                     </div>
                     <div className="flex items-center justify-between px-4 py-3 bg-[#002d4d] rounded-2xl text-white shadow-lg">
                        <span className="text-[9px] font-black uppercase tracking-widest">إجمالي الرصيد المُضاف</span>
                        <span className="text-lg font-black tabular-nums tracking-tighter">${(currentDeposit.amount + currentDeposit.bonusApplied).toLocaleString()}</span>
                     </div>
                  </div>
                )}
             </div>

             <div className="space-y-4">
                <Button 
                  onClick={handleClose}
                  className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                   <span>متابعة الاستثمار</span>
                   <ChevronLeft className="h-5 w-5 text-[#f9a885] transition-transform group-hover:-translate-x-1" />
                </Button>
                
                <div className="flex items-center justify-center gap-3 opacity-20">
                   <ShieldCheck size={12} className="text-emerald-500" />
                   <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-widest leading-none">Automated Security Node</p>
                </div>
             </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
