
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
  Bitcoin,
  Globe,
  Diamond,
  CircleDollarSign,
  Banknote,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  ShieldAlert,
  Fingerprint,
  Info,
  ShieldX,
  CreditCard,
  Gem,
  Award,
  Shield,
  ListFilter,
  UserCheck,
  Briefcase,
  Clock,
  ClipboardPaste,
  AlertTriangle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, parseISO } from "date-fns";

const PORTAL_ICONS: Record<string, any> = {
  Bitcoin, Coins, Globe, Landmark, Diamond, CircleDollarSign, Banknote, Wallet, Zap, CreditCard, ShieldCheck, TrendingUp, Gem, Award, Shield
};

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

      // 1. PIN Check
      if (!u?.securityPin) { 
        setRuleError({ title: "بروتوكول حماية مفقود", message: "يتطلب سحب الأرباح وجود رمز PIN نشط لتأمين العمليات المالية.", icon: Lock, action: 'setup-pin' }); 
        return; 
      }

      // 2. KYC Verification Check
      if (rules?.requireVerificationToWithdraw && !u?.isVerified) {
        setRuleError({ title: "توثيق الهوية مطلوب", message: "يرجى إكمال ملفك الشخصي وتوثيق بياناتك القانونية لتفعيل بوابة السحب.", icon: ShieldCheck, action: 'setup-profile' });
        return;
      }
      
      // 3. Min Account Balance Remaining Check
      if ((u?.totalBalance || 0) < (rules?.minAccountBalance || 0)) { 
        setRuleError({ title: "محطة تعزيز السيولة", message: `رصيدك المتاح حالياً ($${u?.totalBalance?.toLocaleString()}) أقل من الحد الأدنى المسموح به للبقاء في الحساب ($${rules?.minAccountBalance}).`, icon: Wallet, action: 'deposit' }); 
        return; 
      }
      
      // 4. Min Realized Profits Check
      if ((u?.totalProfits || 0) < (rules?.minTotalProfits || 0)) { 
        setRuleError({ title: "عجز في الأرباح المحققة", message: `يتطلب النظام وصول أرباحك الصافية إلى $${rules?.minTotalProfits} كحد أدنى قبل السماح بالسحب.`, icon: TrendingUp, action: 'invest' }); 
        return; 
      }

      // 5. Historical Investment Volume Check
      const totalVolume = (u?.activeInvestmentsTotal || 0) + (u?.totalProfits || 0);
      if (totalVolume < (rules?.minHistoricalInvest || 0)) {
        setRuleError({ title: "حجم تداول غير كافٍ", message: `يجب أن يتجاوز إجمالي حجم استثماراتك مبلغ $${rules?.minHistoricalInvest} لفتح بوابة السحب.`, icon: Briefcase, action: 'invest' });
        return;
      }

      // 6. Min Lifetime Total Deposits Check
      const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("userId", "==", userId), where("status", "==", "approved")));
      const totalDeposited = depSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
      if (totalDeposited < (rules?.minTotalDeposits || 0)) {
        setRuleError({ title: "متطلب إيداع مفقود", message: `يجب أن يكون مجموع إيداعتك المعتمدة $${rules?.minTotalDeposits} على الأقل قبل السحب.`, icon: ArrowUpRight, action: 'deposit' });
        return;
      }

      // 7. Wait time after last approved deposit
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

      // 8. Cooldown between approved withdrawals
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
    
    if (amt > balance) return { type: 'error', message: 'المبلغ يتجاوز رصيدك الحالي.' };
    if (amt < (rules?.minWithdrawalAmount || 1)) return { type: 'error', message: `أقل مبلغ مسموح سحبه هو $${rules?.minWithdrawalAmount || 1}.` };
    if (amt > (rules?.maxWithdrawalAmount || Infinity)) return { type: 'error', message: `أقصى مبلغ مسموح سحبه هو $${rules?.maxWithdrawalAmount}.` };
    if ((balance - amt) < (rules?.minAccountBalance || 0)) return { type: 'error', message: `يجب إبقاء $${rules?.minAccountBalance} على الأقل في حسابك بعد السحب.` };
    
    return { type: 'success', message: 'المبلغ ضمن الحدود المسموح بها.' };
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
      if (!formData.details[f.label]) errs[f.label] = "هذا الحقل مطلوب لتوثيق التحويل."; 
    });

    if (Object.keys(errs).length > 0) { 
      setFieldErrors(errs); 
      return; 
    }
    setStep("verify_pin");
  };

  const handleSubmit = async () => {
    if (formData.pin !== dbUser.securityPin) { 
      setFieldErrors({ pin: "رمز PIN غير صحيح" }); 
      return; 
    }
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

  const getPortalIcon = (iconId: string) => {
    const IconComp = PORTAL_ICONS[iconId] || Landmark;
    return <IconComp className="h-5 w-5" />;
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[40px] border-none shadow-[0_-20px_80px_rgba(0,0,0,0.4)] z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
            
            <DrawerHeader className="px-6 pt-4 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-3 text-right">
                 <div className="h-10 w-10 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg group">
                    <ArrowDownCircle className="h-5 w-5 rotate-180 relative z-10 transition-transform group-hover:-translate-y-1" />
                 </div>
                 <div className="space-y-0">
                   <DrawerTitle className="text-lg font-black text-[#002d4d]">سحب الأرباح</DrawerTitle>
                   <p className="text-[#f9a885] font-black text-[7px] uppercase tracking-widest">Outflow Protocol</p>
                 </div>
              </div>
              {step !== "select_category" && step !== "success" && !ruleError && (
                <button onClick={() => setStep(step === "verify_pin" ? "form" : step === "form" ? "select_portal" : "select_category")} className="rounded-full h-8 px-3 bg-gray-50 text-gray-400 font-black text-[8px] border border-gray-100 group active:scale-[0.98] transition-all flex items-center">
                  <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" /> رجوع
                </button>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none">
              {checkingRules ? (
                <div className="h-full flex flex-col items-center justify-center py-12 gap-4 animate-pulse">
                  <div className="relative">
                    <div className="h-14 w-14 border-[3px] border-gray-100 border-t-orange-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-[#002d4d]" />
                    </div>
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">تدقيق الملاءة والامتثال...</p>
                </div>
              ) : ruleError ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right">
                  <div className="p-6 bg-[#002d4d] rounded-[32px] text-white relative overflow-hidden shadow-xl group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform">{ruleError.icon && <ruleError.icon className="h-32 w-32" />}</div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-[18px] bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner">{ruleError.icon && <ruleError.icon className="h-6 w-6 text-[#f9a885]" />}</div>
                        <div className="text-right">
                          <h4 className="text-lg font-black">{ruleError.title}</h4>
                          <p className="text-[8px] text-blue-200/40 font-black uppercase tracking-widest">Compliance Node</p>
                        </div>
                      </div>
                      <p className="text-[12px] font-bold leading-relaxed text-blue-100/80 pr-1">{ruleError.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    {ruleError.action === 'setup-pin' && (
                      <Button onClick={() => { handleClose(); router.push('/profile?action=setup-pin'); }} className="h-14 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-sm shadow-xl active:scale-[0.98] group">
                        إكمال بروتوكول الأمان <Fingerprint className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    {ruleError.action === 'setup-profile' && (
                      <Button onClick={() => { handleClose(); router.push('/profile?action=verify'); }} className="h-14 rounded-full bg-blue-600 text-white font-black text-sm shadow-xl active:scale-[0.98] group">
                        توثيق الهوية المعتمد <UserCheck className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    {ruleError.action === 'deposit' && (
                      <Button onClick={() => { handleClose(); if(onOpenDeposit) onOpenDeposit(); }} className="h-14 rounded-full bg-emerald-600 text-white font-black text-sm shadow-xl active:scale-[0.98] group">
                        تعزيز السيولة الجارية <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    {ruleError.action === 'invest' && (
                      <Button onClick={() => { handleClose(); router.push('/invest'); }} className="h-14 rounded-full bg-blue-600 text-white font-black text-sm shadow-xl active:scale-[0.98] group">
                        تفعيل العقود الاستثمارية <TrendingUp className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    <button onClick={handleClose} className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 hover:text-[#002d4d] text-center">إغلاق</button>
                  </div>
                </div>
              ) : (
                <div className="text-right space-y-6">
                  {step === "select_category" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="px-2 space-y-0.5">
                        <h3 className="font-black text-[#002d4d] text-sm flex items-center gap-2 justify-end">
                          حدد فئة السحب <ListFilter className="h-3.5 w-3.5 text-orange-500" />
                        </h3>
                        <p className="text-[9px] text-gray-400 font-bold">اختر القطاع المالي المعتمد لتحويل عوائدك.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {categories?.map(cat => (
                          <button key={cat.id} onClick={() => { setSelectedCatId(cat.id); setStep("select_portal"); }} className="p-4 rounded-[24px] border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-[#002d4d] transition-all flex flex-col items-center gap-3 text-center group active:scale-[0.98] relative overflow-hidden">
                            <div className="h-11 w-11 rounded-2xl bg-white shadow-inner flex items-center justify-center group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all"><Layers className="h-5 w-5" /></div>
                            <p className="font-black text-xs text-[#002d4d]">{cat.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === "select_portal" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
                      <div className="px-2 space-y-0.5">
                        <h3 className="font-black text-[#002d4d] text-sm flex items-center gap-2 justify-end">
                          بوابات {selectedCategory?.name} <Zap className="h-3.5 w-3.5 text-blue-500" />
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {activePortals.map((p: any) => (
                          <button key={p.id} onClick={() => setSelectedPortalId(p.id)} className={cn("flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border transition-all active:scale-[0.98] text-center", selectedPortalId === p.id ? "border-blue-600 bg-blue-50/10 shadow-lg" : "border-gray-100 bg-white")}>
                            <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm", selectedPortalId === p.id ? "bg-blue-600 text-white" : "bg-gray-50 text-blue-600")}>{getPortalIcon(p.icon)}</div>
                            <span className={cn("font-black text-xs", selectedPortalId === p.id ? "text-[#002d4d]" : "text-gray-500")}>{p.name}</span>
                          </button>
                        ))}
                      </div>
                      <Button disabled={!selectedPortalId} onClick={() => setStep("form")} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-[0.98]">متابعة بروتوكول الصرف</Button>
                    </div>
                  )}

                  {step === "form" && selectedPortal && (
                    <div className="space-y-6 animate-in fade-in duration-700 text-right">
                      <div className="p-4 bg-blue-50/40 rounded-[24px] border border-blue-100/50 space-y-2">
                        <div className="flex items-center gap-2 pr-1 text-blue-600"><Info className="h-3 w-3"/><h4 className="text-[10px] font-black">تعليمات الاستلام:</h4></div>
                        <p className="text-[11px] font-bold leading-relaxed text-blue-800/70 pr-1">{selectedPortal.instructions}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-2">
                           <Label className="font-black text-[#002d4d] text-[9px] uppercase tracking-widest">المبلغ المسحوب ($)</Label>
                           <Badge className="bg-red-50 text-red-500 border-none font-black text-[7px] px-2 py-0.5 rounded-full shadow-inner">Fee {rules?.withdrawalFee || 0}%</Badge>
                        </div>
                        <div className="relative">
                          <Input type="number" inputMode="decimal" placeholder="0.00" value={formData.amount} onChange={e => { setFormData({...formData, amount: e.target.value}); setFieldErrors({}); }} className={cn("h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl shadow-inner focus:ring-2", amountValidationHint?.type === 'error' ? "text-red-500 ring-red-200" : "text-[#002d4d] focus:ring-blue-500")} />
                          <Coins className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-100" />
                        </div>
                        
                        {amountValidationHint && (
                          <div className={cn("flex items-center gap-2 px-4 animate-in fade-in slide-in-from-top-1", amountValidationHint.type === 'error' ? "text-red-500" : "text-emerald-500")}>
                             {amountValidationHint.type === 'error' ? <AlertTriangle size={10}/> : <ShieldCheck size={10}/>}
                             <p className="text-[9px] font-bold">{amountValidationHint.message}</p>
                          </div>
                        )}
                        {fieldErrors.amount && <p className="text-red-500 text-[9px] font-black pr-4">{fieldErrors.amount}</p>}
                      </div>

                      <div className="p-5 bg-gray-50/50 rounded-[32px] border border-gray-100 space-y-5">
                        <h4 className="text-[11px] font-black text-[#002d4d] pr-1 flex items-center gap-2">بيانات الوجهة <Sparkles className="h-3 w-3 text-blue-400" /></h4>
                        <div className="grid gap-4">
                          {selectedPortal?.fields?.map((f: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <Label className="font-black text-gray-400 text-[8px] pr-3 uppercase tracking-tighter">{f.label}</Label>
                              {f.type === 'select' ? (
                                <Select onValueChange={(val) => {
                                  setFormData(prev => ({ ...prev, details: { ...prev.details, [f.label]: val } }));
                                  setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; });
                                }}>
                                   <SelectTrigger className="h-11 rounded-xl bg-white border-none font-black text-[10px] shadow-sm px-4">
                                      <SelectValue placeholder={f.placeholder} />
                                    </SelectTrigger>
                                   <SelectContent className="rounded-2xl border-none shadow-2xl z-[1100]" dir="rtl">
                                      {f.options?.map((opt: string, idx: number) => (
                                        <SelectItem key={idx} value={opt} className="font-bold text-right py-2">{opt}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                              ) : (
                                <div className="relative group/field">
                                  <Input placeholder={f.placeholder} value={formData.details[f.label] || ""} onChange={e => { setFormData({...formData, details: { ...formData.details, [f.label]: e.target.value }}); setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; }); }} className={cn("h-11 rounded-xl bg-white border-none font-black text-center text-[10px] shadow-sm px-4", f.hasPasteButton && "pl-12")} />
                                  {f.hasPasteButton && (
                                    <button 
                                      onClick={() => handlePaste(f.label)}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#f9a885] hover:bg-[#002d4d] hover:text-white transition-all shadow-sm"
                                      title="لصق من الحافظة"
                                    >
                                      <ClipboardPaste size={14} />
                                    </button>
                                  )}
                                </div>
                              )}
                              <div className="flex justify-between items-center px-3 mt-1 min-h-[14px]">
                                {fieldErrors[f.label] && <p className="text-red-500 text-[7px] font-black">{fieldErrors[f.label]}</p>}
                                {pasteStatus[f.label] && (
                                  <p className={cn("text-[8px] font-black animate-in fade-in slide-in-from-top-1", pasteStatus[f.label].isError ? "text-red-500" : "text-emerald-500")}>
                                    {pasteStatus[f.label].msg}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleNext} disabled={amountValidationHint?.type === 'error' || !formData.amount} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-[0.98] group flex items-center justify-center gap-3">
                        <span>المتابعة لمرحلة الأمان</span>
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      </Button>
                    </div>
                  )}

                  {step === "verify_pin" && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-700 text-center py-6">
                      <div className="h-20 w-20 rounded-[32px] bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative group">
                        <Fingerprint className="h-10 w-10 relative z-10 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-emerald-400/5 rounded-[32px] animate-pulse" />
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-black text-[#002d4d] tracking-tight">تأكيد السيادة المالية</h3>
                           <p className="text-gray-400 font-bold text-[10px]">يرجى إدخال رمز PIN المكون من 6 أرقام لتنفيذ الحوالة.</p>
                        </div>
                        <div className="max-w-[240px] mx-auto relative">
                           <input 
                             type="password" 
                             inputMode="numeric"
                             maxLength={6} 
                             placeholder="••••••" 
                             value={formData.pin} 
                             onChange={e => { setFormData({...formData, pin: e.target.value.replace(/\D/g, '')}); setFieldErrors({}); }} 
                             className="h-20 w-full rounded-[32px] bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em] shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 text-[#002d4d]" 
                           />
                           {fieldErrors.pin && <p className="text-red-500 text-[10px] font-black mt-3">{fieldErrors.pin}</p>}
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button onClick={handleSubmit} disabled={loading || formData.pin.length < 6} className="w-full h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-4 group overflow-hidden relative">
                          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                            <>
                              <span>تأكيد وإرسال الطلب</span>
                              <ShieldCheck className="h-5 w-5 text-white group-hover:scale-125 transition-transform" />
                            </>
                          )}
                        </Button>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                           <Lock size={10} /> End-to-End Secure Transaction
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
          <DialogContent className="fixed left-[50%] top-[50%] z-[1101] translate-x-[-50%] translate-y-[-50%] rounded-[48px] border-none p-8 max-w-[340px] text-center bg-white shadow-2xl outline-none" dir="rtl">
            <div className="flex flex-col items-center space-y-6">
              <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center shadow-inner animate-bounce border border-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="space-y-1.5">
                <DialogTitle className="text-xl font-black text-[#002d4d]">تم بث الطلب!</DialogTitle>
                <DialogDescription className="text-[11px] text-gray-400 font-bold leading-relaxed px-4">
                  لقد تم استلام بيانات العملية بنجاح. سيتم التحقق من الملاءة وتنفيذ التحويل خلال 24 ساعة.
                </DialogDescription>
              </div>
              <Button onClick={handleClose} className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-xl">العودة للرئيسية</Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
