
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
  Scan,
  User,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { findUserByIdOrEmail } from "@/app/actions/user-actions";
import { executeInternalTransfer } from "@/app/actions/transfer-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview محطة إرسال المبالغ الداخلية v5.0
 */

export default function CategoryWithdrawPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  
  const [dbUser, setDbUser] = useState<any>(null);
  const [step, setStep] = useState<'search' | 'amount' | 'verify' | 'success'>('search');
  
  // Form State
  const [identifier, setIdentifier] = useState("");
  const [recipient, setRecipient] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryRef = useMemoFirebase(() => doc(db, "withdraw_methods", categoryId), [db, categoryId]);
  const { data: category, isLoading: loadingCat } = useDoc(categoryRef);

  const rulesRef = useMemoFirebase(() => doc(db, "system_settings", "withdrawal_rules"), [db]);
  const { data: rules } = useDoc(rulesRef);

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

  const withdrawableMax = useMemo(() => {
    if (!dbUser) return 0;
    return Math.max(0, dbUser.totalBalance - (dbUser.welcomeBonus || 0));
  }, [dbUser]);

  const handleFindUser = async () => {
    if (!identifier.trim()) return;
    setLoading(true);
    setError(null);
    const res = await findUserByIdOrEmail(identifier);
    setLoading(false);
    if (res.success) {
      setRecipient(res.user);
      setStep('amount');
    } else {
      setError(res.error);
    }
  };

  const handleValidateAmount = () => {
    const amt = Number(amount);
    if (!amt || amt < (rules?.minWithdrawalAmount || 10)) {
      setError(`أقل مبلغ مسموح بإرساله هو $${rules?.minWithdrawalAmount || 10}`);
      return;
    }
    if (amt > withdrawableMax) {
      setError("رصيدك المتاح (بدون الهدية) لا يكفي لتغطية هذا المبلغ.");
      return;
    }
    setError(null);
    setStep('verify');
  };

  const handleFinalExecute = async () => {
    if (pin.length < 6 || !dbUser) return;
    setLoading(true);
    setError(null);
    const res = await executeInternalTransfer(dbUser.id, recipient.id, Number(amount), pin);
    setLoading(false);
    if (res.success) {
      setStep('success');
    } else {
      setError(res.error);
    }
  };

  if (loadingCat) return <div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d] opacity-20" /></div>;

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col min-h-screen bg-[#fcfdfe] font-body text-right" dir="rtl">
        
        {/* Header Strip */}
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="grid grid-cols-2 gap-1 scale-90 opacity-80">
                 <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
                 <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                 <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
                 <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
              </div>
              <h1 className="text-lg font-black text-[#002d4d]">{category?.name}</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 h-10 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-inner">
                 <p className="text-[11px] font-black text-[#002d4d] tabular-nums">${dbUser?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                 <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">رصيدك</span>
              </div>
              <button onClick={() => router.back()} className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#002d4d] active:scale-90 border border-gray-100 shadow-sm"><ChevronRight size={20} /></button>
           </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full px-6 pt-10 pb-32">
          <AnimatePresence mode="wait">
            {step === 'search' && (
              <motion.div key="s" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                 <div className="space-y-1 text-center mb-10">
                    <h2 className="text-2xl font-black text-[#002d4d]">تحديد المستلم</h2>
                    <p className="text-xs font-bold text-gray-400">أدخل بيانات الشخص المراد إرسال المبالغ له.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="relative flex-1">
                          <Input 
                            value={identifier} 
                            onChange={e => {setIdentifier(e.target.value); setError(null);}} 
                            placeholder="ID المستخدم أو البريد الإلكتروني..." 
                            className="h-16 rounded-[28px] bg-white border-gray-100 shadow-inner px-8 text-right font-black text-sm focus-visible:ring-2 focus-visible:ring-blue-500" 
                          />
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
                       </div>
                       <button className="h-16 w-16 rounded-[28px] bg-gray-50 border border-gray-100 flex items-center justify-center text-[#002d4d] active:scale-95 transition-all shadow-sm">
                          <Scan size={24} />
                       </button>
                    </div>
                    {error && <p className="text-red-500 text-[10px] font-bold pr-4">{error}</p>}
                 </div>

                 {identifier.length >= 3 && (
                   <Button onClick={handleFindUser} disabled={loading} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">
                      {loading ? <Loader2 className="animate-spin" /> : "متابعة"}
                   </Button>
                 )}
              </motion.div>
            )}

            {step === 'amount' && (
              <motion.div key="a" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                 <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner flex flex-col items-center gap-4 text-center">
                    <div className="h-20 w-20 rounded-[32px] bg-white flex items-center justify-center shadow-sm text-blue-500">
                       <User size={40} />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-black text-[#002d4d]">{recipient?.displayName}</h3>
                       <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] px-3 py-1 rounded-full uppercase">ID: {recipient?.namixId}</Badge>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-widest">المبلغ المراد إرساله ($)</Label>
                    <div className="relative">
                       <Input 
                         type="number" 
                         value={amount} 
                         onChange={e => {setAmount(e.target.value); setError(null);}} 
                         className="h-20 rounded-[32px] bg-white border-gray-100 shadow-inner text-center font-black text-4xl text-[#002d4d] tabular-nums" 
                         placeholder="0.00" 
                       />
                       <Coins className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-blue-50" />
                    </div>
                    <div className="flex justify-between px-6">
                       <p className="text-[10px] font-bold text-gray-400">الحد الأقصى القابل للإرسال: <span className="text-[#002d4d] font-black">${withdrawableMax.toLocaleString()}</span></p>
                    </div>
                    {error && <p className="text-red-500 text-[10px] font-bold pr-6 animate-shake">{error}</p>}
                 </div>

                 <div className="grid gap-3">
                    <Button onClick={handleValidateAmount} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95">المتابعة للتحقق</Button>
                    <button onClick={() => setStep('search')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest py-4">تغيير المستلم</button>
                 </div>
              </motion.div>
            )}

            {step === 'verify' && (
              <motion.div key="v" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
                 <div className="p-10 bg-[#002d4d] rounded-[56px] text-white space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12"><Lock size={120} /></div>
                    <div className="h-20 w-20 rounded-[32px] bg-white/10 flex items-center justify-center mx-auto backdrop-blur-xl border border-white/20 shadow-inner">
                       <Fingerprint size={40} className="text-[#f9a885]" />
                    </div>
                    <div className="space-y-1 relative z-10">
                       <h3 className="text-2xl font-black">تحقق من الهوية</h3>
                       <p className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest">أدخل رمز PIN لتأكيد الإرسال</p>
                    </div>
                    
                    <div className="relative z-10 pt-4">
                       <input 
                         type="password" 
                         maxLength={6} 
                         value={pin}
                         onChange={e => {setPin(e.target.value.replace(/\D/g, '')); setError(null);}}
                         className="h-20 w-full bg-white/5 border border-white/10 rounded-[32px] text-center font-black text-5xl tracking-[0.4em] text-white outline-none focus:bg-white/10 transition-all" 
                         placeholder="000000"
                       />
                    </div>
                 </div>

                 {error && <p className="text-red-500 text-[11px] font-bold">{error}</p>}

                 <div className="grid gap-4">
                    <Button onClick={handleFinalExecute} disabled={loading || pin.length < 6} className="h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-3">
                       {loading ? <Loader2 className="animate-spin" /> : <><span>تأكيد وإرسال المبالغ</span> <ShieldCheck size={24} /></>}
                    </Button>
                    <button onClick={() => setStep('amount')} className="text-[10px] font-black text-gray-300 uppercase tracking-widest py-4">رجوع</button>
                 </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center py-10">
                 <div className="relative inline-flex mb-4">
                    <div className="h-40 w-40 bg-emerald-50 rounded-[56px] flex items-center justify-center shadow-inner border border-emerald-100">
                       <CheckCircle2 size={80} className="text-emerald-500 animate-in zoom-in duration-500" />
                    </div>
                    <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl -z-10" />
                 </div>
                 
                 <div className="space-y-3">
                    <h2 className="text-3xl font-black text-[#002d4d]">تم الإرسال بنجاح</h2>
                    <p className="text-gray-500 font-bold text-sm max-w-xs mx-auto leading-loose">لقد تم تحويل مبلغ <span className="text-emerald-600 font-black">${amount}</span> بنجاح إلى حساب {recipient?.displayName}.</p>
                 </div>

                 <Button onClick={() => router.push('/home')} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black shadow-xl active:scale-95">العودة للرئيسية</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="p-10 flex flex-col items-center gap-4 opacity-10 select-none mt-auto">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Transfer Protocol v5.0</p>
           <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />))}
           </div>
        </footer>

      </div>
    </Shell>
  );
}
