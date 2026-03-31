
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
  ArrowUpCircle,
  Info,
  Cpu,
  ShieldX,
  X,
  ClipboardPaste
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";
import { verifyBinanceDeposit } from "@/app/actions/binance-actions";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[85vh] outline-none flex flex-col bg-white rounded-t-[48px] border-none shadow-[0_-20px_80px_rgba(0,45,77,0.4)] z-[1001] font-body" dir="rtl">
            
            <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-5">
              <div className="flex items-center gap-4 text-right">
                 <div className="h-12 w-12 rounded-[20px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-10 bg-gradient-to-tr from-white to-transparent" />
                    <ArrowUpCircle className="h-6 w-6 relative z-10" />
                 </div>
                 <div className="space-y-0.5">
                   <DrawerTitle className="text-xl font-black text-[#002d4d] tracking-tight">شحن الرصيد</DrawerTitle>
                   <p className="text-[#f9a885] font-black text-[8px] uppercase tracking-[0.3em]">Capital Inflow Protocol</p>
                 </div>
              </div>
              
              {step !== "select_category" && step !== "success" && step !== "validating" && (
                <button onClick={handleBack} className="rounded-full h-10 px-5 bg-gray-50 text-gray-400 font-black text-[10px] border border-gray-100 group active:scale-95 transition-all flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /> رجوع
                </button>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none space-y-8 bg-gradient-to-b from-white to-gray-50/30">
              {step === "select_category" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="px-2 space-y-1 text-right">
                    <h3 className="font-black text-[#002d4d] text-base flex items-center gap-3 justify-end tracking-normal">
                      حدد فئة الأصول <ListFilter className="h-4 w-4 text-blue-500" />
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Inflow Categorization</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {categories?.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCatId(cat.id); setStep("select_portal"); }}
                        className="p-6 rounded-[40px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-2xl transition-all duration-500 flex flex-col items-center gap-4 text-center group active:scale-[0.98] relative overflow-hidden"
                      >
                        <div className="absolute -bottom-4 -left-4 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-1000">
                           <Layers size={80} />
                        </div>
                        <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                          <Layers className="h-7 w-7" />
                        </div>
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
                      بوابات {selectedCategory?.name} <Zap className="h-4 w-4 text-emerald-500" />
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Protocol Entry Points</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {activePortals.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPortalId(p.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-4 p-6 rounded-[40px] border transition-all duration-500 active:scale-[0.98] text-center relative overflow-hidden group",
                          selectedPortalId === p.id ? "border-[#002d4d] bg-[#002d4d]/[0.02] shadow-2xl scale-[1.02]" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className="absolute -bottom-4 -left-4 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-1000">
                           <CryptoIcon name={p.icon} size={80} />
                        </div>
                        <div className={cn(
                          "h-16 w-16 rounded-[24px] flex items-center justify-center shadow-inner transition-all duration-500",
                          selectedPortalId === p.id ? "bg-[#002d4d] text-[#f9a885]" : "bg-gray-50 text-[#002d4d]"
                        )}>
                          <CryptoIcon name={p.icon} size={32} />
                        </div>
                        <div className="space-y-1 relative z-10">
                           <span className={cn("font-black text-[13px] block tracking-normal", selectedPortalId === p.id ? "text-[#002d4d]" : "text-gray-500")}>{p.name}</span>
                           {selectedPortalId === p.id && <Badge className="bg-[#002d4d] text-[#f9a885] border-none font-black text-[7px] px-2 py-0.5 rounded-md animate-in fade-in">SELECTED</Badge>}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button disabled={!selectedPortalId} onClick={() => setStep("instructions")} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-2xl active:scale-95 transition-all">
                       المتابعة للتعليمات
                       <ChevronLeft className="mr-2 h-5 w-5 text-[#f9a885]" />
                    </Button>
                  </div>
                </div>
              )}

              {step === "instructions" && selectedPortal && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 text-right">
                  <div className="p-8 bg-blue-50/40 rounded-[40px] border border-blue-100/50 space-y-4 shadow-inner relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><Info size={120} /></div>
                    <div className="flex items-center gap-3 pr-1 text-blue-600 relative z-10">
                      <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm"><Info size={18} /></div>
                      <h4 className="text-sm font-black uppercase tracking-tight">بروتوكول الشحن المعتمد:</h4>
                    </div>
                    <p className="text-[13px] font-bold leading-[2.2] text-blue-800/70 pr-1 tracking-normal relative z-10">{selectedPortal.instructions}</p>
                  </div>

                  {selectedPortal.walletAddress && (
                    <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center px-4">
                         <Label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Portal Destination</Label>
                         <Badge variant="outline" className="text-[8px] font-black border-gray-200 text-gray-400">ENCRYPTED</Badge>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-2 rounded-[28px] border border-gray-100 shadow-sm">
                        <div className="flex-1 px-5 font-mono text-[11px] break-all font-black text-[#002d4d] text-left leading-relaxed py-2" dir="ltr">{selectedPortal.walletAddress}</div>
                        <Button size="icon" className="shrink-0 h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-xl active:scale-[0.9] transition-all" onClick={() => handleCopy(selectedPortal.walletAddress)}>
                          {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button onClick={() => setStep("form")} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-2xl active:scale-95 group">
                     لقد أتممت التحويل
                     <ChevronLeft className="mr-2 h-5 w-5 text-[#f9a885] group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}

              {step === "form" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 text-right">
                  {!selectedPortal?.isBinanceLinked && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4">
                        <Label className="font-black text-[#002d4d] text-[10px] uppercase tracking-[0.3em]">المبلغ المودع ($)</Label>
                        {currentBonusData.percent > 0 && (
                          <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] px-3 py-1 rounded-full animate-pulse shadow-lg shadow-emerald-900/20">
                            BONUS ACTIVE +{currentBonusData.percent}%
                          </Badge>
                        )}
                      </div>
                      <div className="relative group">
                        <Input type="number" inputMode="decimal" placeholder="0.00" value={formData.amount} onChange={e => { setFormData({...formData, amount: e.target.value}); setFieldErrors({}); }} className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl shadow-inner focus-visible:ring-4 focus-visible:ring-emerald-500/5 transition-all text-[#002d4d] tabular-nums tracking-tighter" />
                        <Coins className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-100 group-focus-within:text-emerald-500/20 transition-colors" />
                      </div>
                      {fieldErrors.amount && <p className="text-red-500 text-[10px] font-black pr-6 animate-in slide-in-from-top-1">{fieldErrors.amount}</p>}
                    </div>
                  )}

                  <div className="p-8 bg-gray-50/50 rounded-[48px] border border-gray-100 space-y-8 shadow-inner">
                    <div className="flex items-center justify-between px-2">
                       <h4 className="text-sm font-black text-[#002d4d] uppercase tracking-tight">بيانات التوثيق السيادي</h4>
                       {selectedPortal?.isBinanceLinked && (
                         <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            <span className="text-[8px] font-black text-blue-600 uppercase">Automated API Node</span>
                         </div>
                       )}
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

                  <Button onClick={handleSubmit} disabled={loading} className="w-full h-18 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-lg shadow-2xl active:scale-95 transition-all group overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/10 skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                      <div className="flex items-center gap-3 relative z-10">
                        <span>إكمال بروتوكول الإيداع</span>
                        <ShieldCheck className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {step === "validating" && (
                <div className="h-full flex flex-col items-center justify-center py-20 gap-10 animate-in zoom-in-95 duration-1000">
                   <div className="relative">
                      <div className="h-28 w-28 border-[4px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin shadow-inner" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <ShieldCheck className="h-10 w-10 text-[#002d4d] animate-pulse" />
                      </div>
                   </div>
                   <div className="text-center space-y-2">
                      <h4 className="text-2xl font-black text-[#002d4d]">جاري توثيق المعاملة...</h4>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] animate-pulse">Operational Verification Node</p>
                   </div>
                </div>
              )}

              {step === "fail" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center py-10">
                   <div className="h-24 w-24 bg-red-50 rounded-[36px] flex items-center justify-center shadow-inner mx-auto border border-red-100 animate-bounce">
                      <ShieldX className="h-12 w-12 text-red-500" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-red-600 tracking-tight">فشل التحقق أمنياً</h3>
                      <p className="text-[13px] font-bold text-red-800/60 leading-[2] px-10 tracking-normal">{binanceError}</p>
                   </div>
                   <div className="pt-4 px-6">
                      <Button onClick={handleBack} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95 transition-all">العودة لتصحيح البيانات</Button>
                   </div>
                </div>
              )}
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>

      <Dialog open={step === "success"} onOpenChange={(open) => !open && handleClose()}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1100]" />
          <DialogContent className="fixed left-[50%] top-[50%] z-[1101] translate-x-[-50%] translate-y-[-50%] rounded-[64px] border-none p-10 max-w-[380px] text-center bg-white shadow-2xl outline-none font-body" dir="rtl">
            <div className="flex flex-col items-center space-y-8">
              <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center shadow-inner animate-in zoom-in-50 duration-700 border border-emerald-100">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black text-[#002d4d] tracking-tight">عملية شحن ناجحة!</DialogTitle>
                <DialogDescription className="text-[13px] text-gray-400 font-bold leading-[2] px-4 tracking-normal">
                  لقد تم استلام بيانات العملية بنجاح. سيتم تحديث رصيد محفظتك فور انتهاء التدقيق الأمني المعتمد.
                </DialogDescription>
              </div>
              <Button onClick={handleClose} className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl active:scale-95 transition-all">العودة للوحة القيادة</Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
