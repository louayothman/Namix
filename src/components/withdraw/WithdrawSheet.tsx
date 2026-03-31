
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerPortal,
  DrawerOverlay
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { collection, query, where, getDocs, doc, onSnapshot, orderBy, limit, increment } from "firebase/firestore";
import { 
  Landmark, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Coins, 
  Zap, 
  ArrowDownCircle, 
  Sparkles, 
  Lock, 
  Layers, 
  ChevronLeft, 
  Wallet, 
  ArrowUpRight, 
  ShieldCheck, 
  TrendingUp, 
  ShieldAlert, 
  Fingerprint, 
  Info, 
  ShieldX, 
  X,
  ClipboardPaste,
  Briefcase,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, parseISO } from "date-fns";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

interface WithdrawSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenDeposit?: () => void;
}

type Step = "select_category" | "select_portal" | "form" | "verify_pin" | "success";

export function WithdrawSheet({ open, onOpenChange, onOpenDeposit }: WithdrawSheetProps) {
  const router = useRouter();
  const db = useFirestore();
  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedPortalId, setSelectedPortalId] = useState("");
  const [step, setStep] = useState<Step>("select_category");
  const [loading, setLoading] = useState(false);
  const [checkingRules, setCheckingRules] = useState(true);
  const [ruleError, setRuleError] = useState<{ message: string, title: string, icon: any, action?: 'setup-pin' | 'setup-profile' | 'deposit' | 'invest' } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pasteStatus, setPasteStatus] = useState<Record<string, { msg: string, isError: boolean }>>({});
  const [localUser, setLocalUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [formData, setFormData] = useState({ amount: "", pin: "", details: {} as Record<string, string> });

  const categoriesQuery = useMemoFirebase(() => query(collection(db, "withdraw_methods"), where("isActive", "==", true)), [db]);
  const { data: categories } = useCollection(categoriesQuery);
  const rulesRef = useMemoFirebase(() => doc(db, "system_settings", "withdrawal_rules"), [db]);
  const { data: rules } = useDoc(rulesRef);

  const selectedCategory = useMemo(() => categories?.find(c => c.id === selectedCatId), [categories, selectedCatId]);
  const activePortals = useMemo(() => selectedCategory?.portals?.filter((p: any) => p.isActive) || [], [selectedCategory]);
  const selectedPortal = useMemo(() => activePortals.find((p: any) => p.id === selectedPortalId), [activePortals, selectedPortalId]);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session && open) {
      const parsed = JSON.parse(session);
      setLocalUser(parsed);
      const userRef = doc(db, "users", parsed.id);
      const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) setDbUser({ ...snap.data(), id: snap.id });
      });
      return () => unsub();
    }
  }, [open, db]);

  useEffect(() => {
    if (open && dbUser && rules) checkRules(dbUser.id);
  }, [open, dbUser, rules]);

  const checkRules = async (userId: string) => {
    setCheckingRules(true);
    setRuleError(null);
    try {
      const u = dbUser;
      const now = new Date();

      if (!u?.securityPin) { 
        setRuleError({ title: "بروتوكول حماية مفقود", message: "يتطلب سحب الأرباح وجود رمز PIN نشط لتأمين العمليات المالية.", icon: Lock, action: 'setup-pin' }); 
        return; 
      }

      if (rules?.requireVerificationToWithdraw && !u?.isVerified) {
        setRuleError({ title: "توثيق الهوية مطلوب", message: "يرجى إكمال ملفك الشخصي وتوثيق بياناتك القانونية لتفعيل بوابة السحب.", icon: ShieldCheck, action: 'setup-profile' });
        return;
      }
      
      if ((u?.totalBalance || 0) < (rules?.minAccountBalance || 0)) { 
        setRuleError({ title: "محطة تعزيز السيولة", message: `رصيدك المتاح حالياً ($${u?.totalBalance?.toLocaleString()}) أقل من الحد الأدنى المسموح به للبقاء في الحساب ($${rules?.minAccountBalance}).`, icon: Wallet, action: 'deposit' }); 
        return; 
      }
      
      if ((u?.totalProfits || 0) < (rules?.minTotalProfits || 0)) { 
        setRuleError({ title: "عجز في الأرباح المحققة", message: `يتطلب النظام وصول أرباحك الصافية إلى $${rules?.minTotalProfits} كحد أدنى قبل السماح بالسحب.`, icon: TrendingUp, action: 'invest' }); 
        return; 
      }

      const totalVolume = (u?.activeInvestmentsTotal || 0) + (u?.totalProfits || 0);
      if (totalVolume < (rules?.minHistoricalInvest || 0)) {
        setRuleError({ title: "حجم تداول غير كافٍ", message: `يجب أن يتجاوز إجمالي حجم استثماراتك مبلغ $${rules?.minHistoricalInvest} لفتح بوابة السحب.`, icon: Briefcase, action: 'invest' });
        return;
      }

      const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("userId", "==", userId), where("status", "==", "approved")));
      const totalDeposited = depSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
      if (totalDeposited < (rules?.minTotalDeposits || 0)) {
        setRuleError({ title: "متطلب إيداع مفقود", message: `يجب أن يكون مجموع إيداعتك المعتمدة $${rules?.minTotalDeposits} على الأقل قبل السحب.`, icon: ArrowUpRight, action: 'deposit' });
        return;
      }

      const lastDeposit = depSnap.docs.length > 0 ? depSnap.docs.sort((a,b) => new Date(b.data().createdAt).getTime() - new Date(a.data().createdAt).getTime())[0].data() : null;
      if (lastDeposit && rules?.minTimeValue > 0) {
        const lastDepDate = parseISO(lastDeposit.createdAt);
        let diff = 0;
        const unit = rules.minTimeUnit || 'days';
        if (unit === 'minutes') diff = differenceInMinutes(now, lastDepDate);
        else if (unit === 'hours') diff = differenceInHours(now, lastDepDate);
        else if (unit === 'months') diff = differenceInMonths(now, lastDepDate);
        else diff = differenceInDays(now, lastDepDate);

        if (diff < rules.minTimeValue) {
          setRuleError({ title: "بروتوكول انتظار الإيداع", message: `يجب الانتظار لمدة ${rules.minTimeValue} ${unit} بعد آخر عملية إيداع قبل إمكانية السحب.`, icon: Clock });
          return;
        }
      }

      const withSnap = await getDocs(query(collection(db, "withdraw_requests"), where("userId", "==", userId), where("status", "==", "approved")));
      const lastWithdrawal = withSnap.docs.length > 0 ? withSnap.docs.sort((a,b) => new Date(b.data().createdAt).getTime() - new Date(a.data().createdAt).getTime())[0].data() : null;
      if (lastWithdrawal && rules?.cooldownValue > 0) {
        const lastWithDate = parseISO(lastWithdrawal.createdAt);
        let diffWith = 0;
        const cUnit = rules.cooldownUnit || 'hours';
        if (cUnit === 'minutes') diffWith = differenceInMinutes(now, lastWithDate);
        else if (cUnit === 'days') diffWith = differenceInDays(now, lastWithDate);
        else diffWith = differenceInHours(now, lastWithDate);

        if (diffWith < rules.cooldownValue) {
          setRuleError({ title: "بروتوكول تهدئة السيولة", message: `يرجى الانتظار ${rules.cooldownValue} ${cUnit} بين كل عمليتي سحب لضمان استقرار محفظتك.`, icon: Zap });
          return;
        }
      }

    } catch (e) { 
      console.error(e); 
    } finally { 
      setCheckingRules(false); 
    }
  };

  const amountValidationHint = useMemo(() => {
    const amt = Number(formData.amount);
    if (!amt) return null;
    const balance = dbUser?.totalBalance || 0;
    
    if (amt > balance) return { type: 'error', message: 'المبلغ يتجاوز رصيدك المتاح.' };
    if (amt < (rules?.minWithdrawalAmount || 1)) return { type: 'error', message: `أقل مبلغ مسموح سحبه هو $${rules?.minWithdrawalAmount || 1}.` };
    if (amt > (rules?.maxWithdrawalAmount || Infinity)) return { type: 'error', message: `أقصى مبلغ مسموح سحبه هو $${rules?.maxWithdrawalAmount}.` };
    if ((balance - amt) < (rules?.minAccountBalance || 0)) return { type: 'error', message: `يجب إبقاء $${rules?.minAccountBalance} على الأقل في حسابك بعد السحب.` };
    
    return { type: 'success', message: 'المبلغ ضمن الحدود التشغيلية المسموح بها.' };
  }, [formData.amount, dbUser?.totalBalance, rules]);

  const handlePaste = async (fieldName: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({
          ...prev,
          details: { ...prev.details, [fieldName]: text }
        }));
        setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "تم اللصق!", isError: false } }));
      } else {
        setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "الحافظة فارغة", isError: true } }));
      }
    } catch (err) {
      setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "فشل الوصول", isError: true } }));
    }
    setTimeout(() => {
      setPasteStatus(prev => {
        const newState = { ...prev };
        delete newState[fieldName];
        return newState;
      });
    }, 2000);
  };

  const handleNext = () => {
    if (amountValidationHint?.type === 'error') return;
    const errs: Record<string, string> = {};
    const amt = Number(formData.amount);
    if (!amt) errs.amount = "يرجى تحديد المبلغ.";
    selectedPortal?.fields?.forEach((f: any) => { 
      if (!formData.details[f.label]) errs[f.label] = "بيان مطلوب."; 
    });
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setStep("verify_pin");
  };

  const handleSubmit = async () => {
    if (formData.pin !== dbUser.securityPin) { setFieldErrors({ pin: "رمز PIN غير صحيح" }); return; }
    setLoading(true);
    try {
      const amt = Number(formData.amount);
      const fee = (amt * (rules?.withdrawalFee || 0)) / 100;
      await addDocumentNonBlocking(collection(db, "withdraw_requests"), {
        userId: localUser.id, 
        userName: dbUser?.displayName,
        amount: amt, 
        fee, 
        netAmount: amt - fee,
        methodId: selectedPortalId, 
        methodName: `${selectedCategory?.name} - ${selectedPortal?.name}`,
        details: formData.details, 
        status: "pending", 
        createdAt: new Date().toISOString()
      });
      setStep("success");
    } catch (e) {} finally { setLoading(false); }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { 
      setStep("select_category"); 
      setSelectedCatId(""); 
      setSelectedPortalId(""); 
      setFormData({ amount: "", pin: "", details: {} }); 
      setRuleError(null);
      setPasteStatus({});
    }, 300);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[40px] border-none shadow-[0_-20px_80px_rgba(0,45,77,0.4)] z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
            
            <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-4 text-right">
                 <div className="h-12 w-12 rounded-[20px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-10 bg-gradient-to-tr from-white to-transparent" />
                    <ArrowDownCircle className="h-6 w-6 rotate-180 relative z-10" />
                 </div>
                 <div className="space-y-0.5">
                   <DrawerTitle className="text-xl font-black text-[#002d4d] tracking-tight">سحب الأرباح</DrawerTitle>
                   <p className="text-[#f9a885] font-black text-[8px] uppercase tracking-[0.3em]">Capital Outflow Protocol</p>
                 </div>
              </div>
              {step !== "select_category" && step !== "success" && !ruleError && (
                <button onClick={() => setStep(step === "verify_pin" ? "form" : step === "form" ? "select_portal" : "select_category")} className="rounded-full h-10 px-5 bg-gray-50 text-gray-400 font-black text-[10px] border border-gray-100 group active:scale-[0.98] transition-all flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /> رجوع
                </button>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none space-y-8 bg-gradient-to-b from-white to-gray-50/30">
              {checkingRules ? (
                <div className="h-full flex flex-col items-center justify-center py-12 gap-6 animate-pulse">
                  <div className="relative">
                    <div className="h-16 w-16 border-[4px] border-gray-100 border-t-orange-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-[#002d4d]" />
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">تدقيق الملاءة والامتثال السيادي...</p>
                </div>
              ) : ruleError ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right">
                  <div className="p-8 bg-[#002d4d] rounded-[48px] text-white relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">{ruleError.icon && <ruleError.icon className="h-48 w-48" />}</div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">{ruleError.icon && <ruleError.icon className="h-7 w-7 text-[#f9a885]" />}</div>
                        <div className="text-right">
                          <h4 className="text-xl font-black">{ruleError.title}</h4>
                          <p className="text-[9px] text-blue-200/40 font-black uppercase tracking-[0.3em]">Compliance Restriction Node</p>
                        </div>
                      </div>
                      <p className="text-[13px] font-bold leading-[2.2] text-blue-100/80 pr-1 tracking-normal">{ruleError.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 px-2">
                    {ruleError.action === 'setup-pin' && (
                      <Button onClick={() => { handleClose(); router.push('/profile?action=setup-pin'); }} className="h-16 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-base shadow-xl active:scale-[0.98] group">
                        تفعيل بروتوكول الأمان (PIN) <Fingerprint className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                    {ruleError.action === 'setup-profile' && (
                      <Button onClick={() => { handleClose(); router.push('/profile?action=verify'); }} className="h-16 rounded-full bg-blue-600 text-white font-black text-base shadow-xl active:scale-[0.98] group">
                        إكمال توثيق الهوية <UserCheck className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                    {ruleError.action === 'deposit' && (
                      <Button onClick={() => { handleClose(); if(onOpenDeposit) onOpenDeposit(); }} className="h-16 rounded-full bg-emerald-600 text-white font-black text-base shadow-xl active:scale-[0.98] group">
                        حقن السيولة الجارية <ArrowUpRight className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                    {ruleError.action === 'invest' && (
                      <Button onClick={() => { handleClose(); router.push('/invest'); }} className="h-16 rounded-full bg-blue-600 text-white font-black text-base shadow-xl active:scale-[0.98] group">
                        تفعيل العقود الاستثمارية <TrendingUp className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                    <button onClick={handleClose} className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4 hover:text-[#002d4d] text-center tracking-normal">إغلاق المساعد</button>
                  </div>
                </div>
              ) : (
                <div className="text-right space-y-8">
                  {step === "select_category" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="px-2 space-y-1">
                        <h3 className="font-black text-[#002d4d] text-base flex items-center gap-3 justify-end tracking-normal">
                          حدد فئة الصرف <ListFilter className="h-4 w-4 text-orange-500" />
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Asset Sector Selection</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {categories?.map(cat => (
                          <button key={cat.id} onClick={() => { setSelectedCatId(cat.id); setStep("select_portal"); }} className="p-6 rounded-[40px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-2xl transition-all duration-500 flex flex-col items-center gap-4 text-center group active:scale-[0.98] relative overflow-hidden">
                            <div className="absolute -bottom-4 -left-4 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-1000"><Layers size={80} /></div>
                            <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500"><Layers className="h-7 w-7" /></div>
                            <p className="font-black text-sm text-[#002d4d] tracking-normal">{cat.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === "select_portal" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 text-right">
                      <div className="px-2 space-y-1">
                        <h3 className="font-black text-[#002d4d] text-base flex items-center gap-3 justify-end tracking-normal">
                          بوابات {selectedCategory?.name} <Zap className="h-4 w-4 text-blue-500" />
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Withdrawal Protocol Entry</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {activePortals.map((p: any) => (
                          <button key={p.id} onClick={() => setSelectedPortalId(p.id)} className={cn("flex flex-col items-center justify-center gap-4 p-6 rounded-[40px] border transition-all duration-500 active:scale-[0.98] text-center relative group overflow-hidden", selectedPortalId === p.id ? "border-[#002d4d] bg-[#002d4d]/[0.02] shadow-2xl scale-[1.02]" : "border-gray-100 bg-white")}>
                            <div className="absolute -bottom-4 -left-4 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-1000"><CryptoIcon name={p.icon} size={80} /></div>
                            <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center shadow-inner transition-all duration-500", selectedPortalId === p.id ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-blue-600")}>
                               <CryptoIcon name={p.icon} size={32} />
                            </div>
                            <div className="space-y-1 relative z-10">
                               <span className={cn("font-black text-[13px] block tracking-normal", selectedPortalId === p.id ? "text-[#002d4d]" : "text-gray-500")}>{p.name}</span>
                               {selectedPortalId === p.id && <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[7px] px-2 py-0.5 rounded-md animate-in fade-in">PROTOCOL ACTIVE</Badge>}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="pt-4">
                        <Button disabled={!selectedPortalId} onClick={() => setStep("form")} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 group transition-all">
                           متابعة بروتوكول الصرف
                           <ChevronLeft className="mr-2 h-5 w-5 text-[#f9a885]" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === "form" && selectedPortal && (
                    <div className="space-y-8 animate-in fade-in duration-700 text-right">
                      <div className="p-8 bg-blue-50/40 rounded-[40px] border border-blue-100/50 space-y-4 shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000"><Info size={120} /></div>
                        <div className="flex items-center gap-3 pr-1 text-blue-600 relative z-10">
                          <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm"><Info size={18} /></div>
                          <h4 className="text-sm font-black uppercase tracking-tight">تعليمات الاستلام:</h4>
                        </div>
                        <p className="text-[13px] font-bold leading-[2.2] text-blue-800/70 pr-1 tracking-normal relative z-10">{selectedPortal.instructions}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-4">
                           <Label className="font-black text-[#002d4d] text-[10px] uppercase tracking-[0.3em]">المبلغ المسحوب ($)</Label>
                           <Badge className="bg-red-50 text-red-500 border-none font-black text-[8px] px-3 py-1 rounded-full shadow-inner">Fee {rules?.withdrawalFee || 0}%</Badge>
                        </div>
                        <div className="relative group">
                          <Input type="number" inputMode="decimal" placeholder="0.00" value={formData.amount} onChange={e => { setFormData({...formData, amount: e.target.value}); setFieldErrors({}); }} className={cn("h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl shadow-inner focus:ring-4 transition-all text-[#002d4d] tabular-nums tracking-tighter", amountValidationHint?.type === 'error' ? "ring-red-500/5" : "focus:ring-blue-500/5")} />
                          <Coins className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-100 group-focus-within:text-blue-500/20 transition-colors" />
                        </div>
                        
                        {amountValidationHint && (
                          <div className={cn("flex items-center gap-2 px-6 animate-in fade-in slide-in-from-top-1", amountValidationHint.type === 'error' ? "text-red-500" : "text-emerald-500")}>
                             {amountValidationHint.type === 'error' ? <ShieldAlert size={12}/> : <ShieldCheck size={12}/>}
                             <p className="text-[10px] font-bold tracking-normal">{amountValidationHint.message}</p>
                          </div>
                        )}
                        {fieldErrors.amount && <p className="text-red-500 text-[10px] font-black pr-6 animate-in slide-in-from-top-1">{fieldErrors.amount}</p>}
                      </div>

                      <div className="p-8 bg-gray-50/50 rounded-[48px] border border-gray-100 space-y-8 shadow-inner">
                        <div className="flex items-center justify-between px-2">
                           <h4 className="text-sm font-black text-[#002d4d] uppercase tracking-tight">بيانات الوجهة النهائية</h4>
                           <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        </div>
                        <div className="grid gap-6">
                          {selectedPortal?.fields?.map((f: any, i: number) => (
                            <div key={i} className="space-y-2">
                              <Label className="font-black text-gray-400 text-[9px] pr-4 uppercase tracking-widest">{f.label}</Label>
                              {f.type === 'select' ? (
                                <Select onValueChange={(val) => {
                                  setFormData(prev => ({ ...prev, details: { ...prev.details, [f.label]: val } }));
                                  setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; });
                                }}>
                                   <SelectTrigger className="h-14 rounded-[20px] bg-white border-none font-black text-sm shadow-sm px-8">
                                      <SelectValue placeholder={f.placeholder} />
                                    </SelectTrigger>
                                   <SelectContent className="rounded-[28px] border-none shadow-2xl z-[1100]" dir="rtl">
                                      {f.options?.map((opt: string, idx: number) => (
                                        <SelectItem key={idx} value={opt} className="font-bold text-right py-3 cursor-pointer">{opt}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                              ) : (
                                <div className="relative group/field">
                                  <Input placeholder={f.placeholder} value={formData.details[f.label] || ""} onChange={e => { setFormData({...formData, details: { ...formData.details, [f.label]: e.target.value }}); setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; }); }} className={cn("h-14 rounded-[20px] bg-white border-none font-black text-center text-xs shadow-sm px-8 group-focus-within/field:ring-2 group-focus-within/field:ring-blue-500/10 transition-all", f.hasPasteButton && "pl-14")} />
                                  {f.hasPasteButton && (
                                    <button 
                                      onClick={() => handlePaste(f.label)}
                                      className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-[#f9a885] hover:bg-[#002d4d] hover:text-white transition-all shadow-sm active:scale-90"
                                      title="لصق من الحافظة"
                                    >
                                      <ClipboardPaste size={16} />
                                    </button>
                                  )}
                                </div>
                              )}
                              <div className="flex justify-between items-center px-4 mt-1 min-h-[16px]">
                                {fieldErrors[f.label] && <p className="text-red-500 text-[8px] font-black">{fieldErrors[f.label]}</p>}
                                {pasteStatus[f.label] && (
                                  <p className={cn("text-[9px] font-black animate-in fade-in slide-in-from-top-1", pasteStatus[f.label].isError ? "text-red-500" : "text-emerald-500")}>
                                    {pasteStatus[f.label].msg}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleNext} disabled={amountValidationHint?.type === 'error' || !formData.amount} className="w-full h-18 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-2xl active:scale-95 group transition-all">
                         <span>المتابعة لمرحلة الأمان</span>
                         <ChevronLeft className="mr-2 h-6 w-6 text-[#f9a885] group-hover:-translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}

                  {step === "verify_pin" && (
                    <div className="space-y-10 animate-in zoom-in-95 duration-700 text-center py-10">
                      <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative group">
                        <Fingerprint className="h-12 w-12 text-emerald-600 relative z-10 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-emerald-400/5 rounded-[40px] animate-pulse" />
                      </div>
                      
                      <div className="space-y-8">
                        <div className="space-y-2">
                           <h3 className="text-3xl font-black text-[#002d4d] tracking-tight">تأكيد السيادة المالية</h3>
                           <p className="text-gray-400 font-bold text-xs">يرجى إدخال رمز PIN المكون من 6 أرقام لتنفيذ الحوالة.</p>
                        </div>
                        <div className="max-w-[260px] mx-auto relative group/pin">
                           <input 
                             type="password" 
                             inputMode="numeric"
                             maxLength={6} 
                             placeholder="••••••" 
                             value={formData.pin} 
                             onChange={e => { setFormData({...formData, pin: e.target.value.replace(/\D/g, '')}); setFieldErrors({}); }} 
                             className="h-24 w-full rounded-[40px] bg-gray-50 border-none font-black text-center text-5xl tracking-[0.4em] shadow-inner outline-none focus:ring-8 focus:ring-emerald-500/5 text-[#002d4d] transition-all" 
                           />
                           {fieldErrors.pin && <p className="text-red-500 text-[11px] font-black mt-4 animate-in fade-in">{fieldErrors.pin}</p>}
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button onClick={handleSubmit} disabled={loading || formData.pin.length < 6} className="w-full h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group overflow-hidden relative">
                          <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-[-250%] transition-transform duration-1000" />
                          {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                            <>
                              <span>تأكيد وإرسال الطلب</span>
                              <ShieldCheck className="h-7 w-7 text-white group-hover:scale-125 transition-transform" />
                            </>
                          )}
                        </Button>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] mt-6 flex items-center justify-center gap-3">
                           <Lock size={12} /> End-to-End Secure Transaction
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>

      <Dialog open={step === "success"} onOpenChange={(open) => !open && handleClose()}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1100]" />
          <DialogContent className="fixed left-[50%] top-[50%] z-[1101] translate-x-[-50%] translate-y-[-50%] rounded-[64px] border-none p-12 max-w-[400px] text-center bg-white shadow-2xl outline-none font-body" dir="rtl">
            <div className="flex flex-col items-center space-y-10">
              <div className="h-28 w-28 bg-emerald-50 rounded-[44px] flex items-center justify-center shadow-inner animate-in zoom-in-50 duration-700 border border-emerald-100">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
              </div>
              <div className="space-y-3">
                <DialogTitle className="text-3xl font-black text-[#002d4d] tracking-tight leading-none">تم بث الطلب!</DialogTitle>
                <DialogDescription className="text-[14px] text-gray-400 font-bold leading-[2.2] px-2 tracking-normal">
                  لقد تم استلام بيانات العملية بنجاح. سيتم التحقق من الملاءة وتنفيذ التحويل خلال 24 ساعة وفقاً لبروتوكول الأمان المعتمد.
                </DialogDescription>
              </div>
              <Button onClick={handleClose} className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all">العودة للوحة القيادة</Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
