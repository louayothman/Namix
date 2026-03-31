
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
import { collection, doc, query, where, updateDoc, increment, onSnapshot, getDocs } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase";
import { 
  Copy, 
  Check, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
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
    if (!formData.amount && !selectedPortal?.isBinanceLinked) newErrors.amount = "مطلوب.";
    
    selectedPortal?.fields?.forEach((f: any) => {
      if (!formData.details[f.label]) newErrors[f.label] = "مطلوب.";
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    const txidField = selectedPortal.fields?.find((f: any) => f.isTxid) || selectedPortal.fields?.[0];
    const txid = txidField ? (formData.details[txidField.label] || "").trim() : "";

    setStep("validating");

    try {
      const q = query(collection(db, "deposit_requests"), where("transactionId", "==", txid));
      const duplicateSnap = await getDocs(q);
      if (!duplicateSnap.empty) {
        setBinanceError("هذا المعرف مستخدم مسبقاً.");
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

          setStep("success");
        } else {
          setBinanceError("تعذر العثور على المعاملة. تأكد من صحة البيانات.");
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
      setBinanceError("خطأ تقني في التحقق.");
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
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[82vh] outline-none flex flex-col bg-white rounded-t-[44px] border-none shadow-2xl z-[1001] font-body" dir="rtl">
            
            <DrawerHeader className="px-6 pt-4 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-3 text-right">
                 <div className="h-9 w-9 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg">
                    <ArrowUpCircle className="h-5 w-5" />
                 </div>
                 <div className="space-y-0">
                   <DrawerTitle className="text-base font-black text-[#002d4d] tracking-normal leading-none">شحن الرصيد</DrawerTitle>
                   <p className="text-gray-400 font-black text-[7px] uppercase tracking-widest mt-1">Capital Accumulation</p>
                 </div>
              </div>
              
              {step !== "select_category" && step !== "success" && step !== "validating" && (
                <button onClick={handleBack} className="rounded-full h-7 px-3 bg-gray-50 text-gray-400 font-black text-[8px] border border-gray-100 active:scale-95 transition-all flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3" /> رجوع
                </button>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-5 py-3 scrollbar-none space-y-5 bg-gradient-to-b from-white to-gray-50/20">
              {step === "select_category" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="px-2 space-y-0.5 text-right">
                    <h3 className="font-black text-[#002d4d] text-xs flex items-center gap-2 justify-end tracking-normal">
                      اختر فئة الإيداع <ListFilter className="h-3 w-3 text-blue-500" />
                    </h3>
                    <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">Select Category</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories?.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCatId(cat.id); setStep("select_portal"); }}
                        className="p-4 rounded-[36px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex flex-col items-center gap-2.5 text-center group active:scale-[0.98] relative overflow-hidden"
                      >
                        <div className="h-10 w-10 rounded-[16px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                          <Layers className="h-4 w-4" />
                        </div>
                        <p className="font-black text-[11px] text-[#002d4d] tracking-normal">{cat.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "select_portal" && (
                <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-500 text-right">
                  <div className="px-2 space-y-0.5">
                    <h3 className="font-black text-[#002d4d] text-xs flex items-center gap-2 justify-end tracking-normal">
                      بوابات {selectedCategory?.name} <Zap className="h-3 w-3 text-emerald-500" />
                    </h3>
                    <p className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">Select Portal</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {activePortals.map((p: any) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPortalId(p.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 p-4 rounded-[36px] border transition-all duration-500 active:scale-[0.98] text-center relative overflow-hidden group min-h-[110px]",
                          selectedPortalId === p.id ? "border-[#002d4d] bg-[#002d4d]/[0.02] shadow-xl" : "border-gray-50 bg-white"
                        )}
                      >
                        {/* Background Watermark */}
                        <div className="absolute -bottom-2 -left-2 opacity-[0.03] transition-all duration-700 pointer-events-none group-hover:opacity-[0.08] group-hover:scale-125">
                           <CryptoIcon name={p.icon} size={80} />
                        </div>

                        {/* Floating Icon - Clean Style */}
                        <div className={cn(
                          "transition-all duration-500 relative z-10",
                          selectedPortalId === p.id ? "text-[#f9a885] scale-110" : "text-gray-300 group-hover:text-[#002d4d]"
                        )}>
                          <CryptoIcon name={p.icon} size={32} />
                        </div>
                        <span className={cn("font-black text-[10px] block tracking-normal relative z-10 leading-none", selectedPortalId === p.id ? "text-[#002d4d]" : "text-gray-400")}>{p.name}</span>
                      </button>
                    ))}
                  </div>
                  <Button disabled={!selectedPortalId} onClick={() => setStep("instructions")} className="w-full h-13 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-xl transition-all">
                     المتابعة
                  </Button>
                </div>
              )}

              {step === "instructions" && selectedPortal && (
                <div className="space-y-5 animate-in fade-in duration-500 text-right">
                  <div className="p-5 bg-blue-50/40 rounded-[28px] border border-blue-100/50 space-y-2 shadow-inner">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Info size={14} />
                      <h4 className="text-[11px] font-black uppercase tracking-normal">خطوات الشحن:</h4>
                    </div>
                    <p className="text-[11px] font-bold leading-relaxed text-blue-800/70 tracking-normal">{selectedPortal.instructions}</p>
                  </div>

                  {selectedPortal.walletAddress && (
                    <div className="p-5 bg-gray-50 rounded-[28px] border border-gray-100 space-y-2 shadow-sm">
                      <Label className="text-[8px] text-gray-400 font-black uppercase tracking-widest pr-2">Portal Destination</Label>
                      <div className="flex items-center gap-2 bg-white p-1 rounded-[18px] border border-gray-100">
                        <div className="flex-1 px-3 font-mono text-[9px] break-all font-black text-[#002d4d] text-left leading-relaxed" dir="ltr">{selectedPortal.walletAddress}</div>
                        <Button size="icon" className="shrink-0 h-9 w-9 rounded-xl bg-[#002d4d] text-[#f9a885]" onClick={() => handleCopy(selectedPortal.walletAddress)}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button onClick={() => setStep("form")} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95 transition-all">
                     لقد أتممت التحويل
                  </Button>
                </div>
              )}

              {step === "form" && (
                <div className="space-y-5 animate-in fade-in duration-500 text-right">
                  {!selectedPortal?.isBinanceLinked && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-4">
                        <Label className="font-black text-[#002d4d] text-[8px] uppercase tracking-widest">المبلغ المودع ($)</Label>
                        {currentBonusData.percent > 0 && <Badge className="bg-emerald-500 text-white border-none font-black text-[7px] px-2 py-0.5 rounded-full animate-pulse">BONUS +{currentBonusData.percent}%</Badge>}
                      </div>
                      <div className="relative">
                        <Input type="number" inputMode="decimal" placeholder="0.00" value={formData.amount} onChange={e => { setFormData({...formData, amount: e.target.value}); setFieldErrors({}); }} className="h-14 rounded-[20px] bg-gray-50 border-none font-black text-center text-2xl shadow-inner text-[#002d4d] tabular-nums tracking-tighter" />
                        <Coins className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-100" />
                      </div>
                      {fieldErrors.amount && <p className="text-red-500 text-[8px] font-black pr-4">{fieldErrors.amount}</p>}
                    </div>
                  )}

                  <div className="p-5 bg-gray-50/50 rounded-[32px] border border-gray-100 space-y-4 shadow-inner">
                    <div className="grid gap-3">
                      {selectedPortal?.fields?.map((f: any, i: number) => (
                        <div key={i} className="space-y-1">
                          <Label className="font-black text-gray-400 text-[8px] pr-3 uppercase tracking-widest">{f.label}</Label>
                          {f.type === 'select' ? (
                            <Select onValueChange={(val) => {
                              setFormData(prev => ({ ...prev, details: { ...prev.details, [f.label]: val } }));
                              setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; });
                            }}>
                               <SelectTrigger className="h-11 rounded-[16px] bg-white border-none font-black text-xs shadow-sm px-5">
                                  <SelectValue placeholder={f.placeholder} />
                                </SelectTrigger>
                               <SelectContent className="rounded-2xl" dir="rtl">
                                  {f.options?.map((opt: string, idx: number) => (
                                    <SelectItem key={idx} value={opt} className="font-bold text-right py-2">{opt}</SelectItem>
                                  ))}
                               </SelectContent>
                            </Select>
                          ) : (
                            <div className="relative">
                              <Input placeholder={f.placeholder} value={formData.details[f.label] || ""} onChange={e => { setFormData({...formData, details: { ...formData.details, [f.label]: e.target.value }}); setFieldErrors(prev => { const newErrs = {...prev}; delete newErrs[f.label]; return newErrs; }); }} className={cn("h-11 rounded-[16px] bg-white border-none font-black text-center text-[10px] shadow-sm px-5", f.hasPasteButton && "pl-10")} />
                              {f.hasPasteButton && (
                                <button onClick={() => handlePaste(f.label)} className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-gray-50 flex items-center justify-center text-[#f9a885] active:scale-90 transition-all shadow-sm">
                                  <ClipboardPaste size={12} />
                                </button>
                              )}
                            </div>
                          )}
                          <div className="flex justify-between px-3">
                            {fieldErrors[f.label] && <p className="text-red-500 text-[7px] font-black">{fieldErrors[f.label]}</p>}
                            {pasteStatus[f.label] && <p className="text-[7px] font-black text-emerald-500">{pasteStatus[f.label].msg}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSubmit} disabled={loading} className="w-full h-15 rounded-full bg-[#f9a885] hover:bg-white text-[#002d4d] font-black text-sm shadow-xl active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "إرسال البيانات"}
                  </Button>
                </div>
              )}

              {step === "validating" && (
                <div className="h-full flex flex-col items-center justify-center py-10 gap-5 animate-in zoom-in-95">
                   <div className="relative">
                      <div className="h-16 w-16 border-[2px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-[#002d4d] animate-pulse">
                         <ShieldCheck className="h-6 w-6" />
                      </div>
                   </div>
                   <p className="text-xs font-black text-[#002d4d] tracking-normal">جاري التحقق الرقمي...</p>
                </div>
              )}

              {step === "fail" && (
                <div className="space-y-5 animate-in fade-in duration-500 text-center py-4">
                   <div className="h-14 w-14 bg-red-50 rounded-[20px] flex items-center justify-center mx-auto border border-red-100">
                      <ShieldX className="h-7 w-7 text-red-500" />
                   </div>
                   <p className="text-[11px] font-bold text-red-800/60 leading-relaxed px-6 tracking-normal">{binanceError}</p>
                   <Button onClick={handleBack} className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-xl">تعديل البيانات</Button>
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
                <DialogTitle className="text-xl font-black text-[#002d4d] tracking-tight">عملية ناجحة!</DialogTitle>
                <DialogDescription className="text-xs text-gray-400 font-bold leading-relaxed tracking-normal">
                  لقد تم استلام البيانات. سيتم تحديث رصيدك فور انتهاء الفحص الفني المعتمد.
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
