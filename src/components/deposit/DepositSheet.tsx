"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useFirestore, useCollection, useDoc } from "@/firebase";
import { collection, doc, query, where, updateDoc, increment, addDoc, onSnapshot, getDocs } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { 
  Copy, 
  Check, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Wallet, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Coins, 
  Hash, 
  ChevronLeft, 
  Layers, 
  ListFilter,
  Bitcoin,
  Globe,
  Landmark,
  Diamond,
  CircleDollarSign,
  Banknote,
  ArrowUpCircle,
  Info,
  Cpu,
  ShieldX,
  AlertTriangle,
  TrendingUp,
  Activity,
  Gem,
  Award,
  Shield,
  X,
  ClipboardPaste
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";
import { verifyBinanceDeposit } from "@/app/actions/binance-actions";
import { toast } from "@/hooks/use-toast";

const PORTAL_ICONS: Record<string, any> = {
  Bitcoin, Coins, Globe, Landmark, Diamond, CircleDollarSign, Banknote, Wallet, Zap, CreditCard, ShieldCheck, TrendingUp, Activity, Gem, Award, Shield
};

interface DepositSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "select_category" | "select_portal" | "instructions" | "form" | "validating" | "success" | "fail";

export function DepositSheet({ open, onOpenChange }: DepositSheetProps) {
  const [step, setStep] = useState<Step>("select_category");
  const [loading, setLoading] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedPortalId, setSelectedPortalId] = useState("");
  const [copied, setCopied] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [binanceError, setBinanceError] = useState<string | null>(null);
  const [pasteStatus, setPasteStatus] = useState<Record<string, { msg: string, isError: boolean }>>({});
  
  const [formData, setFormData] = useState({
    amount: "",
    details: {} as Record<string, string>
  });

  const db = useFirestore();
  const categoriesQuery = useMemoFirebase(() => query(collection(db, "deposit_methods"), where("isActive", "==", true)), [db]);
  const { data: categories } = useCollection(categoriesQuery);

  const vaultBonusConfigRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: vaultBonusConfig } = useDoc(vaultBonusConfigRef);

  const selectedCategory = useMemo(() => categories?.find(c => c.id === selectedCatId), [categories, selectedCatId]);
  const activePortals = useMemo(() => selectedCategory?.portals?.filter((p: any) => p.isActive) || [], [selectedCategory]);
  const selectedPortal = useMemo(() => activePortals.find((p: any) => p.id === selectedPortalId), [activePortals, selectedPortalId]);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session) {
      const parsed = JSON.parse(session);
      setLocalUser(parsed);
      const userRef = doc(db, "users", parsed.id);
      const unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) setDbUser(snap.data());
      });
      return () => unsub();
    }
  }, [open, db]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePaste = async (fieldName: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFormData(prev => ({
          ...prev,
          details: { ...prev.details, [fieldName]: text }
        }));
        setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "تم اللصق بنجاح!", isError: false } }));
      } else {
        setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "الحافظة فارغة", isError: true } }));
      }
    } catch (err) {
      setPasteStatus(prev => ({ ...prev, [fieldName]: { msg: "فشل الوصول للحافظة", isError: true } }));
    }
    setTimeout(() => {
      setPasteStatus(prev => {
        const newState = { ...prev };
        delete newState[fieldName];
        return newState;
      });
    }, 2000);
  };

  const handleBack = () => {
    if (step === "select_portal") setStep("select_category");
    else if (step === "instructions") setStep("select_portal");
    else if (step === "form") setStep("instructions");
    else if (step === "fail") setStep("form");
  };

  const currentBonusData = useMemo(() => {
    const amount = Number(formData.amount);
    if (!amount || !vaultBonusConfig?.depositBonuses) return { percent: 0, bonus: 0 };
    const tier = vaultBonusConfig.depositBonuses.find((t: any) => amount >= (t.min || 0) && amount <= (t.max || Infinity));
    if (tier && tier.percent > 0) {
      return { percent: tier.percent, bonus: (amount * tier.percent) / 100 };
    }
    return { percent: 0, bonus: 0 };
  }, [formData.amount, vaultBonusConfig]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount && !selectedPortal?.isBinanceLinked) newErrors.amount = "يرجى تحديد مبلغ الإيداع.";
    
    selectedPortal?.fields?.forEach((f: any) => {
      if (!formData.details[f.label]) newErrors[f.label] = "هذا البيان مطلوب.";
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    const txidField = selectedPortal.fields?.find((f: any) => f.isTxid) || selectedPortal.fields?.[0];
    const txid = txidField ? (formData.details[txidField.label] || "").trim() : "";

    if (!txid) {
      const targetLabel = txidField?.label || "TXID";
      setFieldErrors({ [targetLabel]: "معرف العملية مطلوب للتوثيق." });
      return;
    }

    setStep("validating");

    try {
      const q = query(collection(db, "deposit_requests"), where("transactionId", "==", txid));
      const duplicateSnap = await getDocs(q);
      if (!duplicateSnap.empty) {
        setBinanceError("عذراً، هذا المعرف تم استخدامه مسبقاً في عملية إيداع أخرى.");
        setStep("fail");
        return;
      }

      if (selectedPortal?.isBinanceLinked) {
        const asset = selectedPortal.asset || "USDT";
        const res = await verifyBinanceDeposit(txid, 0, asset);
        
        if (res.success && res.data) {
          const actualAmount = res.data.amount;
          let bonus = 0;
          let bonusPercent = 0;
          if (vaultBonusConfig?.depositBonuses) {
            const tier = vaultBonusConfig.depositBonuses.find((t: any) => actualAmount >= t.min && actualAmount <= (t.max || Infinity));
            if (tier) {
              bonusPercent = tier.percent;
              bonus = (actualAmount * bonusPercent) / 100;
            }
          }

          const totalToAdd = actualAmount + bonus;
          
          await addDocumentNonBlocking(collection(db, "deposit_requests"), {
            userId: localUser?.id,
            userName: dbUser?.displayName,
            amount: actualAmount,
            approvedAmount: actualAmount,
            bonusApplied: bonus,
            bonusPercent: bonusPercent,
            methodId: selectedPortalId,
            methodName: `${selectedCategory?.name} - ${selectedPortal?.name}`,
            transactionId: txid,
            details: formData.details,
            status: "approved",
            isAutoAudited: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });

          await updateDoc(doc(db, "users", localUser.id), {
            totalBalance: increment(totalToAdd)
          });

          await addDoc(collection(db, "notifications"), {
            userId: localUser.id,
            title: "تم توثيق الإيداع بنجاح ⚡",
            message: `تم التحقق من المعاملة ${txid} وإيداع المبلغ الفعلي مع المكافأة في محفظتك فوراً.`,
            type: "success",
            isRead: false,
            createdAt: new Date().toISOString()
          });

          setStep("success");
        } else {
          setBinanceError("تعذر العثور على المعاملة الموثقة. تأكد من صحة البيانات والشبكة المستخدمة.");
          setStep("fail");
        }
        return;
      }

      setLoading(true);
      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: localUser?.id,
        userName: dbUser?.displayName,
        amount: Number(formData.amount),
        methodId: selectedPortalId,
        methodName: `${selectedCategory?.name} - ${selectedPortal?.name}`,
        transactionId: txid,
        details: formData.details,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setStep("success");
    } catch (e: any) {
      setBinanceError("حدث خطأ تقني أثناء محاولة توثيق العملية.");
      setStep("fail");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("select_category");
      setSelectedCatId("");
      setSelectedPortalId("");
      setFormData({ amount: "", details: {} });
      setFieldErrors({});
      setBinanceError(null);
      setPasteStatus({});
    }, 300);
  };

  const getPortalIcon = (iconId: string) => {
    const IconComp = PORTAL_ICONS[iconId] || Coins;
    return <IconComp className="h-5 w-5" />;
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[85vh] outline-none flex flex-col bg-white rounded-t-[40px] border-none shadow-2xl z-[1001]">
            
            <DrawerHeader className="px-6 pt-4 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3 text-right">
                 <div className="h-10 w-10 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg">
                    <ArrowUpCircle className="h-5 w-5" />
                 </div>
                 <div className="space-y-0">
                   <DrawerTitle className="text-lg font-black text-[#002d4d]">شحن الرصيد</DrawerTitle>
                   <p className="text-[#f9a885] font-black text-[7px] uppercase tracking-widest">Inflow Protocol</p>
                 </div>
              </div>
              
              {step !== "select_category" && step !== "success" && step !== "validating" && (
                <Button variant="ghost" size="sm" onClick={handleBack} className="rounded-full h-8 px-3 bg-gray-50 text-gray-400 font-black text-[8px] border border-gray-100 group active:scale-95 transition-all">
                  <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" /> رجوع
                </Button>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none">
              {step === "select_category" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="px-2 space-y-0.5 text-right">
                    <h3 className="font-black text-[#002d4d] text-sm flex items-center gap-2 justify-end">
                      حدد فئة الشحن <ListFilter className="h-3.5 w-3.5 text-blue-500" />
                    </h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Select Asset Sector</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories?.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCatId(cat.id); setStep("select_portal"); }}
                        className="p-4 rounded-[24px] border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-[#002d4d] hover:shadow-xl transition-all flex flex-col items-center gap-3 text-center group active:scale-[0.98]"
                      >
                        <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                          <Layers className="h-5 w-5" />
                        </div>
                        <p className="font-black text-xs text-[#002d4d]">{cat.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "select_portal" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 text-right">
                  <div className="px-2 space-y-0.5">
                    <h3 className="font-black text-[#002d4d] text-sm flex items-center gap-2 justify-end">
                      بوابات {selectedCategory?.name} <Zap className="h-3.5 w-3.5 text-emerald-500" />
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {activePortals.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPortalId(p.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border transition-all active:scale-[0.98] text-center relative overflow-hidden",
                          selectedPortalId === p.id ? "border-[#002d4d] bg-blue-50/10 shadow-lg" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm", selectedPortalId === p.id ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-emerald-600")}>
                          {getPortalIcon(p.icon)}
                        </div>
                        <span className={cn("font-black text-xs block", selectedPortalId === p.id ? "text-[#002d4d]" : "text-gray-500")}>{p.name}</span>
                      </button>
                    ))}
                  </div>
                  <Button disabled={!selectedPortalId} onClick={() => setStep("instructions")} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95">الاستمرار للتعليمات</Button>
                </div>
              )}

              {step === "instructions" && selectedPortal && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 text-right">
                  <div className="p-5 bg-blue-50/40 rounded-[28px] border border-blue-100/50 space-y-2">
                    <div className="flex items-center gap-2 pr-1 text-blue-600">
                      <Info className="h-3.5 w-3.5" />
                      <h4 className="text-[11px] font-black uppercase tracking-tight">بروتوكول الشحن:</h4>
                    </div>
                    <p className="text-xs font-bold leading-relaxed text-blue-800/70 pr-1">{selectedPortal.instructions}</p>
                  </div>

                  {selectedPortal.walletAddress && (
                    <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 space-y-3">
                      <Label className="text-[8px] text-gray-400 font-black uppercase pr-2 tracking-widest">Portal Address</Label>
                      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100">
                        <div className="flex-1 px-3 font-mono text-[10px] break-all font-black text-[#002d4d] text-left" dir="ltr">{selectedPortal.walletAddress}</div>
                        <Button size="icon" className="shrink-0 h-10 w-10 rounded-xl bg-[#002d4d] text-[#f9a885] shadow-lg active:scale-[0.98]" onClick={() => handleCopy(selectedPortal.walletAddress)}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button onClick={() => setStep("form")} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95">لقد أتممت التحويل</Button>
                </div>
              )}

              {step === "form" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 text-right">
                  {!selectedPortal?.isBinanceLinked && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-2">
                        <Label className="font-black text-[#002d4d] text-[9px] uppercase tracking-widest">المبلغ المودع ($)</Label>
                        {currentBonusData.percent > 0 && <Badge className="bg-emerald-500 text-white border-none font-black text-[7px] animate-pulse">Bonus +{currentBonusData.percent}%</Badge>}
                      </div>
                      <div className="relative">
                        <Input type="number" placeholder="0.00" value={formData.amount} onChange={e => { setFormData({...formData, amount: e.target.value}); setFieldErrors({}); }} className="h-16 rounded-[24px] bg-gray-50 border-none font-black text-center text-3xl shadow-inner focus-visible:ring-2 focus-visible:ring-emerald-500" />
                        <Coins className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-100" />
                      </div>
                      {fieldErrors.amount && <p className="text-red-500 text-[9px] font-black pr-4">{fieldErrors.amount}</p>}
                    </div>
                  )}

                  <div className="p-5 bg-gray-50/50 rounded-[32px] border border-gray-100 space-y-5">
                    <div className="flex items-center justify-between px-1">
                       <h4 className="text-[11px] font-black text-[#002d4d] uppercase tracking-tight">بيانات التوثيق</h4>
                       {selectedPortal?.isBinanceLinked && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />}
                    </div>
                    
                    <div className="grid gap-4">
                      {selectedPortal?.fields?.map((f: any, i: number) => (
                        <div key={i} className="space-y-1.5">
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

                  <Button onClick={handleSubmit} disabled={loading} className="w-full h-16 rounded-full bg-[#f9a885] text-[#002d4d] font-black text-base shadow-xl active:scale-[0.98] group">
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "إكمال عملية الإيداع"}
                  </Button>
                </div>
              )}

              {step === "validating" && (
                <div className="h-full flex flex-col items-center justify-center py-16 gap-6 animate-in zoom-in-95 duration-1000">
                   <div className="relative">
                      <div className="h-20 w-20 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <ShieldCheck className="h-7 w-7 text-[#002d4d] animate-pulse" />
                      </div>
                   </div>
                   <div className="text-center space-y-1">
                      <h4 className="text-lg font-black text-[#002d4d]">جاري توثيق المعاملة...</h4>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em]">Operational Verification Node</p>
                   </div>
                </div>
              )}

              {step === "fail" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center py-6">
                   <div className="h-20 w-20 bg-red-50 rounded-[28px] flex items-center justify-center shadow-inner mx-auto">
                      <ShieldX className="h-10 w-10 text-red-500" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-red-600">فشل التحقق أمنياً</h3>
                      <p className="text-[11px] font-bold text-red-800 leading-relaxed px-4">{binanceError}</p>
                   </div>
                   <Button onClick={handleBack} className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-xs">العودة للبيانات</Button>
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
              <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="space-y-1.5">
                <DialogTitle className="text-xl font-black text-[#002d4d]">عملية ناجحة!</DialogTitle>
                <DialogDescription className="text-[11px] text-gray-400 font-bold leading-relaxed">
                  لقد تم استلام بيانات العملية بنجاح. سيتم تحديث رصيدك فور انتهاء البروتوكول الأمني.
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
