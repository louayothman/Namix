"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { 
  ShieldCheck, 
  Loader2, 
  Plus, 
  ChevronRight
} from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { DepositSheet } from "@/components/deposit/DepositSheet";
import { ContractGateway } from "@/components/invest/ContractGateway";
import { ActivationDialog } from "@/components/invest/ActivationDialog";

/**
 * @fileOverview مختبر العقود السيادي v2200.0 - Refined Architecture
 * تم استخراج نافذة التفعيل إلى مكون مستقل وإصلاح أخطاء الاستيراد لضمان تجربة مستخدم فاخرة ومستقرة.
 */

function InvestContent() {
  const [dbUser, setDbUser] = useState<any>(null);
  const [now, setNow] = useState(new Date());
  const db = useFirestore();
  const router = useRouter();
  
  const plansQuery = useMemoFirebase(() => query(collection(db, "investment_plans"), where("isActive", "==", true)), [db]);
  const { data: plans, isLoading } = useCollection(plansQuery);

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [depositOpen, setDepositOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col h-screen max-h-screen bg-[#fcfdfe] overflow-hidden font-body" dir="rtl">
        
        {/* Compact Navigation Header */}
        <header className="px-6 pt-6 pb-4 flex items-center justify-between shrink-0 z-50">
          <div className="flex items-center gap-3">
             <button 
               onClick={() => router.push('/')} 
               className="h-9 w-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#002d4d] active:scale-90 transition-all"
             >
               <ChevronRight className="h-5 w-5" />
             </button>
             <div className="space-y-0 text-right">
                <h1 className="text-lg font-black text-[#002d4d] tracking-tight leading-none">مختبر العقود</h1>
                <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest mt-1">Sovereign Yield Hub</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
             <div className="text-right">
                <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest leading-none">Liquidity</p>
                <p className="text-[11px] font-black text-[#002d4d] tabular-nums mt-0.5">${dbUser?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
             </div>
             <button onClick={() => setDepositOpen(true)} className="h-7 w-7 rounded-lg bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg active:scale-90 transition-all ml-1">
                <Plus size={14} />
             </button>
          </div>
        </header>

        {/* Contract Gateway Viewport */}
        <div className="flex-1 flex flex-col justify-center py-4 relative">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-20">
               <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Syncing Nodes...</p>
            </div>
          ) : plans ? (
            <ContractGateway plans={plans} onSelect={setSelectedPlan} now={now} />
          ) : (
            <div className="text-center py-20 opacity-20">
               <ShieldCheck className="h-12 w-12 mx-auto mb-4" />
               <p className="text-[10px] font-black uppercase">No active protocols found</p>
            </div>
          )}
        </div>

        {/* Compliance Footer Strip */}
        <footer className="px-8 py-10 shrink-0">
           <div className="p-5 bg-gray-50/50 rounded-[32px] border border-gray-100 flex items-center gap-4 group">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:rotate-12">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-[#002d4d]">بروتوكول الضمان السيادي</p>
                 <p className="text-[8px] font-bold text-gray-400 leading-relaxed">كافة العقود في المختبر تخضع لنظام الحماية المزدوج لضمان عودة رأس المال الموثق.</p>
              </div>
           </div>
        </footer>

        {/* Global Sheets & Dialogs */}
        <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
        
        <ActivationDialog 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          dbUser={dbUser} 
          onOpenDeposit={() => { setSelectedPlan(null); setDepositOpen(true); }}
        />
      </div>
    </Shell>
  );
}

export default function InvestPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d]" /></div>}>
      <InvestContent />
    </Suspense>
  );
}