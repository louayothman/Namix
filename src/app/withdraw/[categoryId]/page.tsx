
"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  ChevronRight, 
  Loader2, 
  ShieldCheck, 
  Fingerprint, 
  Wallet, 
  Zap, 
  Cpu,
  ArrowDownCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview مُفاعل صرف المبالغ v1.0
 * يدير واجهة سحب الأموال بناءً على الفئة المختارة (داخلي، يدوي، أو آلي).
 */

export default function CategoryWithdrawPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);

  const categoryRef = useMemoFirebase(() => doc(db, "withdraw_methods", categoryId), [db, categoryId]);
  const { data: category, isLoading: loadingCat } = useDoc(categoryRef);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      const parsed = JSON.parse(session);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
        if (snap.exists()) setDbUser({ ...snap.data(), id: snap.id });
      });
      return () => unsub();
    }
  }, [db]);

  if (loadingCat) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="h-10 w-10 animate-spin text-[#002d4d] opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">تأمين قناة الصرف...</p>
      </div>
    );
  }

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col min-h-screen bg-[#fcfdfe] font-body text-right" dir="rtl">
        
        {/* Header Strip */}
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()} 
                className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#002d4d] active:scale-90 transition-all border border-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="text-right">
                 <h1 className="text-lg font-black text-[#002d4d] leading-none">{category?.name}</h1>
                 <div className="flex items-center gap-1.5 opacity-40 mt-1.5">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-widest">Active Link</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3 px-4 h-10 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-inner">
              <p className="text-[11px] font-black text-[#002d4d] tabular-nums">
                ${dbUser?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <Wallet size={14} className="text-blue-500" />
           </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full space-y-10 px-6 pt-10 pb-32">
          
          <AnimatePresence mode="wait">
            {category?.type === 'internal' ? (
              <motion.div 
                key="internal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="p-8 bg-white rounded-[48px] border border-gray-100 shadow-xl shadow-blue-900/5 space-y-8 text-center">
                   <div className="h-20 w-20 rounded-[32px] bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                      <Fingerprint size={40} />
                   </div>
                   <div className="space-y-2">
                      <h2 className="text-2xl font-black text-[#002d4d]">إرسال لمستخدم Namix</h2>
                      <p className="text-xs font-bold text-gray-400 leading-relaxed px-4">قم بإدخال المعرف الرقمي (Namix ID) الخاص بالمستلم لإرسال المبالغ له فورياً.</p>
                   </div>
                   
                   <div className="py-20 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center gap-4 opacity-40">
                      <Zap size={32} className="text-blue-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest">جاري برمجة واجهة التحويل المباشر...</p>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-4">
                   <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-[11px] font-bold text-gray-500 leading-relaxed">
                     ملاحظة: عمليات الإرسال الداخلية تتم بلمح البصر ولا تخضع لفترات الانتظار الطويلة، لضمان أعلى مستويات المرونة لمستثمري ناميكس.
                   </p>
                </div>
              </motion.div>
            ) : (
              <div className="py-40 text-center opacity-20 flex flex-col items-center gap-6">
                 <ArrowDownCircle size={64} className="rotate-180" />
                 <p className="text-sm font-black uppercase tracking-[0.5em]">قناة الصرف قيد الإعداد</p>
              </div>
            )}
          </AnimatePresence>

        </main>

        <footer className="p-10 flex flex-col items-center gap-4 opacity-10 select-none mt-auto">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Outflow Protocol v1.0</p>
           <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1 w-1 rounded-full bg-[#002d4d]" />))}
           </div>
        </footer>

      </div>
    </Shell>
  );
}

