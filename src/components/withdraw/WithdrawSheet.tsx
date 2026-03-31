
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
        setRuleError({ title: "رمز الحماية مفقود", message: "يتطلب سحب الأرباح وجود رمز PIN نشط لتأمين محفظتك.", icon: Lock, action: 'setup-pin' }); 
        return; 
      }

      if (rules?.requireVerificationToWithdraw && !u?.isVerified) {
        setRuleError({ title: "التوثيق مطلوب", message: "يرجى إكمال ملفك الشخصي وتوثيق بياناتك لتفعيل السحب.", icon: ShieldCheck, action: 'setup-profile' });
        return;
      }
      
      if ((u?.totalBalance || 0) < (rules?.minAccountBalance || 0)) { 
        setRuleError({ title: "تعزيز السيولة", message: `رصيدك المتاح ($${u?.totalBalance?.toLocaleString()}) أقل من الحد الأدنى للبقاء في الحساب ($${rules?.minAccountBalance}).`, icon: Wallet, action: 'deposit' }); 
        return; 
      }
      
      if ((u?.totalProfits || 0) < (rules?.minTotalProfits || 0)) { 
        setRuleError({ title: "عجز في الأرباح", message: `يتطلب النظام أرباحاً صافية بقيمة $${rules?.minTotalProfits} كحد أدنى قبل السحب.`, icon: TrendingUp, action: 'invest' }); 
        return; 
      }

      const depSnap = await getDocs(query(collection(db, "deposit_requests"), where("userId", "==", userId), where("status", "==", "approved")));
      const totalDeposited = depSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
      if (totalDeposited < (rules?.minTotalDeposits || 0)) {
        setRuleError({ title: "متطلب إيداع", message: `يجب أن يكون مجموع إيداعتك المعتمدة $${rules?.minTotalDeposits} على الأقل.`, icon: ArrowUpRight, action: 'deposit' });
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
          setRuleError({ title: "انتظار الإيداع", message: `يرجى الانتظار لمدة ${rules.minTimeValue} ${unit} بعد آخر إيداع قبل السحب.`, icon: Clock });
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
    
    if (amt > balance) return { type: 'error', message: 'المبلغ يتجاوز رصيدك.' };
    if (amt < (rules?.minWithdrawalAmount || 1)) return { type: 'error', message: `الحد الأدنى للسحب $${rules?.minWithdrawalAmount || 1}.` };
    if (amt > (rules?.maxWithdrawalAmount || Infinity)) return { type: 'error', message: `الحد الأقصى للسحب $${rules?.maxWithdrawalAmount}.` };
    
    return { type: 'success', message: 'المبلغ متاح للسحب.' };
  }, [formData.amount, dbUser?.totalBalance, rules]);

  const handlePaste = async (fieldName: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({
          ...prev,
          details: { ...prev.details, [fieldName]: text }
        }));
        setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "تم!", isError: false } }));
      }
    } catch (err) {
      setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "فشل", isError: true } }));
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
    if (!Number(formData.amount)) errs.amount = "مطلوب.";
    selectedPortal?.fields?.forEach((f: any) => { if (!formData.details[f.label]) errs[f.label] = "مطلوب."; });
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
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[40px] border-none shadow-2xl z-[1001] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
            
            <DrawerHeader className="px-6 pt-5 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-3 text-right">
                 <div className="h-10 w-10 rounded-[16px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg relative overflow-hidden">
                    <ArrowDownCircle className="h-5 w-5 rotate-180 relative z-10" />
                 </div>
                 <div className="space-y-0">
                   <DrawerTitle className="text-lg font-black text-[#002d4d] tracking-normal leading-none">سحب الأرباح</DrawerTitle>
                   <p className="text-[#f9a885] font-black text-[7px] uppercase tracking-widest mt-1">Capital Outflow</p>
                 </div>
              </div>
              {step !== "select_category" && step !== "success" && !ruleError && (
                <button onClick={() => setStep(step === "verify_pin" ? "form" : step === "form" ? "select_portal" : "select_category")} className="rounded-full h-8 px-4 bg-gray-50 text-gray-400 font-black text-[9px] border border-gray-100 group active:scale-[0.98] transition-all flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" /> رجوع
                </button>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none space-y-6 bg-gradient-to-b from-white to-gray-50/20">
              {checkingRules ? (
                <div className="h-full flex flex-col items-center justify-center py-12 gap-6 animate-pulse">
                  <div className="h-16 w-16 border-[3px] border-gray-100 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">تدقيق الامتثال...</p>
                </div>
              ) : ruleError ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-right">
                  <div className="p-6 bg-[#002d4d] rounded-[36px] text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-[18px] bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">{ruleError.icon && <ruleError.icon className="h-5 w-5 text-[#f9a885]" />}</div>
                        <div className="text-right">
                          <h4 className="text-base font-black">{ruleError.title}</h4>
                          <p className="text-[7px] text-blue-200/40 font-black uppercase tracking-widest">Restriction Node</p>
                        </div>
                      </div>
                      <p className="text-[11px] font-bold leading-loose text-blue-100/80 tracking-normal">{ruleError.message}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 px-2">
                    {ruleError.action && (
                      <Button onClick={() => { handleClose(); router.push(ruleError.action === 'deposit' ? '/home' : ruleError.action === 'setup-pin' ? '/profile?action=setup-pin' : '/profile?action=verify'); if(ruleError.action === 'deposit' && onOpenDeposit) onOpenDeposit(); }} className="h-14 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-sm shadow-xl active:scale-95 transition-all">
                        تفعيل المتطلبات
                      </Button>
                    )}
                    <button onClick={handleClose} className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 hover:text-[#002d4d] text-center tracking-normal">إغلاق</button>
                  </div>
                </div>
              ) : (
                <div className="text-right space-y-6">
                  {step === "select_category" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="px-2 space-y-0.5 text-right">
                        <h3 className="font-black text-[#002d4d] text-sm flex items-center gap-2 justify-end tracking-normal">حدد فئة الصرف <ListFilter className="h-3.5 w-3.5 text-orange-500" /></h3>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Asset Sector</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {categories?.map(cat => (
                          <button key={cat.id} onClick={() => { setSelectedCatId(cat.id); setStep("select_portal"); }} className="p-4 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex flex-col items-center gap-3 text-center group active:scale-[0.98] relative overflow-hidden">
                            <div className="h-11 w-11 rounded-[18px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all"><Layers className="h-5 w-5" /></div>
                            <p className="font-black text-xs text-[#002d4d] tracking-normal">{cat.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === "select_portal" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-500 text-right">
                      <div className="px-2 space-y-0.5">
                        <h3 className="font-black text-[#002d4d] text-sm flex items-center gap-2 justify-end tracking-normal">بوابات {selectedCategory?.name} <Zap className="h-3.5 w-3.5 text-blue-500" /></h3>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Select Portal</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {activePortals.map((p: any) => (
                          <button key={p.id} onClick={() => setSelectedPortalId(p.id)} className={cn("flex flex-col items-center justify-center gap-3 p-4 rounded-[32px] border transition-all duration-500 active:scale-[0.98] text-center relative group overflow-hidden", selectedPortalId === p.id ? "border-[#002d4d] bg-[#002d4d]/[0.02] shadow-xl" : "border-gray-100 bg-white")}>
                            <div className={cn("h-12 w-12 rounded-[18px] flex items-center justify-center shadow-inner transition-all", selectedPortalId === p.id ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-blue-600")}>
                               <CryptoIcon name={p.icon} size={24} />
                            </div>
                            <span className={cn("font-black text-[11px] block tracking-normal", selectedPortalId === p.id ? "text-[#002d4d]" : "text-gray-500")}>{p.name}</span>
                          </button>
                        ))}
                      </div>
                      <Button disabled={!selectedPortalId} onClick={() => setStep("form")} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl transition-all">متابعة الصرف</Button>
                    </div>
                  )}

                  {step === "form" && selectedPortal && (
                    <div className="space-y-6 animate-in fade-in duration-500 text-right">
                      <div className="p-5 bg-blue-50/40 rounded-[28px] border border-blue-100/50 space-y-2">
                        <div className="flex items-center gap-2 text-blue-600"><Info size={14} /><h4 className="text-[11px] font-black tracking-normal">تعليمات الاستلام:</h4></div>
                        <p className="text-[11px] font-bold leading-relaxed text-blue-800/70 tracking-normal">{selectedPortal.instructions}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-4">
                           <Label className="font-black text-[#002d4d] text-[9px] uppercase tracking-widest">المبلغ المسحوب ($)</Label>
                           <Badge className="bg-red-50 text-red-500 border-none font-black text-[7px] px-2 py-0.5 rounded-full">Fee {rules?.withdrawalFee || 0}%</Badge>
                        </div>
                        <div className="relative">
                          <Input type="number" inputMode="decimal" placeholder="0.00" value={formData.amount} onChange={e => { setFormData({...formData, amount: e.target.value}); setFieldErrors({}); }} className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl shadow-inner text-[#002d4d] tabular-nums tracking-tighter" />
                          <Coins className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-100" />
                        </div>
                        {amountValidationHint && <p className={cn("text-[8px] font-bold px-4", amountValidationHint.type === 'error' ? "text-red-500" : "text-emerald-500")}>{amountValidationHint.message}</p>}
                      </div>

                      <div className="p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 space-y-4 shadow-inner">
                        <div className="grid gap-4">
                          {selectedPortal?.fields?.map((f: any, i: number) => (
                            <div key={i} className="space-y-1.5">
                              <Label className="font-black text-gray-400 text-[8px] pr-3 uppercase tracking-widest">{f.label}</Label>
                              {f.type === 'select' ? (
                                <Select onValueChange={(val) => {
                                  setFormData(prev => ({ ...prev, details: { ...prev.details, [f.label]: val } }));
                                  setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; });
                                }}>
                                   <SelectTrigger className="h-12 rounded-[18px] bg-white border-none font-black text-xs shadow-sm px-6"><SelectValue placeholder={f.placeholder} /></SelectTrigger>
                                   <SelectContent className="rounded-2xl" dir="rtl">
                                      {f.options?.map((opt: string, idx: number) => (
                                        <SelectItem key={idx} value={opt} className="font-bold text-right py-2.5">{opt}</SelectItem>
                                      ))}
                                   </SelectContent>
                                </Select>
                              ) : (
                                <div className="relative">
                                  <Input placeholder={f.placeholder} value={formData.details[f.label] || ""} onChange={e => { setFormData({...formData, details: { ...formData.details, [f.label]: e.target.value }}); setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; }); }} className={cn("h-12 rounded-[18px] bg-white border-none font-black text-center text-[11px] shadow-sm px-6", f.hasPasteButton && "pl-12")} />
                                  {f.hasPasteButton && <button onClick={() => handlePaste(f.label)} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#f9a885] active:scale-90 transition-all"><ClipboardPaste size={14} /></button>}
                                </div>
                              )}
                              <div className="flex justify-between px-3">
                                {fieldErrors[f.label] && <p className="text-red-500 text-[8px] font-black">{fieldErrors[f.label]}</p>}
                                {pasteStatus[f.label] && <p className="text-[8px] font-black text-emerald-500">{pasteStatus[f.label].msg}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleNext} disabled={amountValidationHint?.type === 'error' || !formData.amount} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">المتابعة للأمان</Button>
                    </div>
                  )}

                  {step === "verify_pin" && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-700 text-center py-6">
                      <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                        <Fingerprint className="h-10 w-10 text-emerald-600" />
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-1">
                           <h3 className="text-xl font-black text-[#002d4d] tracking-tight">تأكيد السيادة المالية</h3>
                           <p className="text-gray-400 font-bold text-[10px]">يرجى إدخال رمز PIN المكون من 6 أرقام.</p>
                        </div>
                        <input type="password" inputMode="numeric" maxLength={6} placeholder="••••••" value={formData.pin} onChange={e => { setFormData({...formData, pin: e.target.value.replace(/\D/g, '')}); setFieldErrors({}); }} className="h-20 w-full max-w-[240px] rounded-[32px] bg-gray-50 border-none font-black text-center text-5xl tracking-[0.4em] shadow-inner outline-none text-[#002d4d] transition-all" />
                        {fieldErrors.pin && <p className="text-red-500 text-[10px] font-black mt-2">{fieldErrors.pin}</p>}
                      </div>
                      <Button onClick={handleSubmit} disabled={loading || formData.pin.length < 6} className="w-full h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl active:scale-95 transition-all">
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "تأكيد وإرسال الطلب"}
                      </Button>
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
          <DialogContent className="fixed left-[50%] top-[50%] z-[1101] translate-x-[-50%] translate-y-[-50%] rounded-[40px] border-none p-10 max-w-[340px] text-center bg-white shadow-2xl outline-none font-body" dir="rtl">
            <div className="flex flex-col items-center space-y-6">
              <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center shadow-inner border border-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-black text-[#002d4d] tracking-tight">تم بث الطلب!</DialogTitle>
                <DialogDescription className="text-xs text-gray-400 font-bold leading-relaxed tracking-normal">
                  لقد تم استلام البيانات. سيتم التحقق وتنفيذ التحويل خلال 24 ساعة وفق بروتوكول الأمان.
                </DialogDescription>
              </div>
              <Button onClick={handleClose} className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-xl active:scale-95 transition-all">العودة للرئيسية</Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
