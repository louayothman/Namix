
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { 
  Copy, 
  Check, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpCircle,
  Info,
  Cpu,
  Wallet,
  Coins,
  Activity,
  Layers,
  ListFilter,
  CreditCard,
  Hash
} from "lucide-react";
import { getOrCreateUserWallet } from "@/app/actions/nowpayments-actions";
import { verifyBinanceDeposit } from "@/app/actions/binance-actions";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

interface DepositSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "select_category" | "select_portal" | "execution" | "verifying" | "success";

export function DepositSheet({ open, onOpenChange }: DepositSheetProps) {
  const [step, setStep] = useState<Step>("select_category");
  const [loading, setLoading] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedPortalId, setSelectedPortalId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const db = useFirestore();

  const categoriesQuery = useMemoFirebase(() => query(collection(db, "deposit_methods"), where("isActive", "==", true)), [db]);
  const { data: categories, isLoading: loadingCats } = useCollection(categoriesQuery);

  const selectedCategory = useMemo(() => categories?.find(c => c.id === selectedCatId), [categories, selectedCatId]);
  const activePortals = useMemo(() => selectedCategory?.portals?.filter((p: any) => p.isActive) || [], [selectedCategory]);
  const selectedPortal = useMemo(() => activePortals.find((p: any) => p.id === selectedPortalId), [activePortals, selectedPortalId]);

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session && open) {
      const parsed = JSON.parse(session);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
        if (snap.exists()) setDbUser({ ...snap.data(), id: snap.id });
      });
      return () => unsub();
    }
  }, [open, db]);

  const handlePortalSelect = async (portal: any) => {
    setSelectedPortalId(portal.id);
    setLoading(true);
    setError(null);
    try {
      if (portal.automationType === 'nowpayments') {
        if (!dbUser?.id) return;
        const res = await getOrCreateUserWallet(dbUser.id, portal.nowPaymentsCurrency);
        if (res.success) {
          setWalletAddress(res.address);
          setStep("execution");
        } else {
          setError("تعذر توليد عنوان الإيداع الآلي.");
        }
      } else {
        setWalletAddress(portal.walletAddress);
        setStep("execution");
      }
    } catch (e) {
      setError("خطأ في الاتصال بالبروتوكول.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!txid || !amount || !dbUser) return;
    setLoading(true);
    try {
      // 1. If Binance automation is enabled for this portal
      if (selectedPortal?.automationType === 'binance') {
        setStep("verifying");
        const res = await verifyBinanceDeposit(txid, Number(amount), selectedPortal.binanceAsset);
        if (res.success) {
          // Success handled in DB via Webhook or manually here for speed
          setStep("success");
          return;
        } else {
          setError(res.error || "لم يتم العثور على العملية في سجلات بينانس.");
          setStep("execution");
          return;
        }
      }

      // 2. Pure Manual Flow
      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        amount: Number(amount),
        methodName: `${selectedCategory?.name} - ${selectedPortal?.name}`,
        transactionId: txid,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setStep("success");
    } catch (e) {
      setError("فشل في إرسال طلب التدقيق.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("select_category");
      setSelectedCatId("");
      setSelectedPortalId("");
      setWalletAddress("");
      setTxid("");
      setAmount("");
      setError(null);
    }, 300);
  };

  return (
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
                 <DrawerTitle className="text-base font-black text-[#002d4d]">شحن الرصيد السيادي</DrawerTitle>
                 <p className="text-gray-400 font-black text-[7px] uppercase tracking-widest mt-1">Capital Infusion Hub</p>
               </div>
            </div>
            {step !== "select_category" && step !== "success" && (
              <button onClick={() => setStep(step === "execution" ? "select_portal" : "select_category")} className="rounded-full h-7 px-3 bg-gray-50 text-gray-400 font-black text-[8px] border border-gray-100 active:scale-95 transition-all flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" /> رجوع
              </button>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-none space-y-6">
            
            {loadingCats ? (
              <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="h-8 w-8 animate-spin text-[#002d4d]" />
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning Nodes...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {step === "select_category" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-right">
                    <div className="px-2">
                       <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2 justify-end">حدد فئة الشحن <ListFilter className="h-4 w-4 text-[#f9a885]" /></h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {categories?.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCatId(cat.id); setStep("select_portal"); }}
                          className="p-6 rounded-[40px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex flex-col items-center gap-3 group active:scale-[0.98] relative overflow-hidden"
                        >
                          <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                            <Layers className="h-6 w-6" />
                          </div>
                          <p className="font-black text-[11px] text-[#002d4d]">{cat.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === "select_portal" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-500 text-right">
                    <div className="px-2">
                       <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2 justify-end">اختر بوابة الاستلام <Zap className="h-4 w-4 text-blue-500" /></h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {activePortals.map((p: any) => (
                        <button
                          key={p.id}
                          onClick={() => handlePortalSelect(p)}
                          className="p-6 rounded-[40px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex flex-col items-center gap-3 group active:scale-[0.98] relative overflow-hidden"
                        >
                          <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] transition-all">
                            <CryptoIcon name={p.icon} size={24} />
                          </div>
                          <div className="text-center">
                             <p className="font-black text-[11px] text-[#002d4d] leading-none">{p.name}</p>
                             <Badge className={cn(
                               "text-[6px] font-black border-none px-1.5 py-0.5 rounded-sm mt-1.5",
                               p.automationType === 'nowpayments' ? "bg-purple-50 text-purple-600" :
                               p.automationType === 'binance' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                             )}>
                               {p.automationType?.toUpperCase() || 'MANUAL'}
                             </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === "execution" && selectedPortal && (
                  <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-right">
                    
                    <div className="p-6 bg-blue-50/40 rounded-[40px] border border-blue-100/50 space-y-3">
                       <div className="flex items-center gap-2 text-blue-600">
                          <Info size={16} />
                          <h4 className="text-xs font-black">تعليمات الاستلام المعتمدة:</h4>
                       </div>
                       <p className="text-[11px] font-bold leading-loose text-blue-800/70">{selectedPortal.instructions}</p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-4">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black text-gray-400 uppercase pr-2 tracking-widest">
                            {selectedPortal.automationType === 'nowpayments' ? 'Your Unique Deposit Address' : 'Official Portal Address'}
                          </Label>
                          <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-3">
                             <div className="flex-1 font-mono text-[11px] font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">
                                {walletAddress}
                             </div>
                             <Button onClick={handleCopy} className="h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-xl shrink-0 active:scale-90 transition-all">
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                             </Button>
                          </div>
                       </div>
                    </div>

                    {selectedPortal.automationType === 'nowpayments' ? (
                      <div className="p-10 bg-[#002d4d] rounded-[48px] text-center space-y-6 relative overflow-hidden group shadow-2xl">
                         <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000"><Zap size={120} /></div>
                         <div className="h-16 w-16 rounded-[24px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 mx-auto">
                            <Loader2 className="h-8 w-8 animate-spin text-[#f9a885]" />
                         </div>
                         <div className="space-y-2 relative z-10">
                            <h4 className="text-lg font-black text-white">بانتظار وصول الحوالة...</h4>
                            <p className="text-[10px] font-bold text-blue-100/60 px-6 leading-relaxed">
                               بمجرد قيامك بالتحويل إلى العنوان أعلاه، سيقوم المفاعل بتحديث رصيدك آلياً خلال دقائق دون أي تدخل منك.
                            </p>
                         </div>
                         <Button onClick={handleClose} variant="ghost" className="text-[9px] font-black text-blue-200/40 uppercase tracking-[0.3em] hover:text-white transition-colors">Close View</Button>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in slide-in-from-top-4 duration-700">
                         <div className="space-y-4">
                            <div className="space-y-1.5">
                               <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">المبلغ المودع ($)</Label>
                               <div className="relative">
                                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-2xl text-emerald-600 shadow-inner" placeholder="0.00" />
                                  <Coins size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-200" />
                               </div>
                            </div>
                            <div className="space-y-1.5">
                               <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">معرف العملية (TXID / Reference)</Label>
                               <div className="relative">
                                  <Input value={txid} onChange={e => setTxid(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-[10px] font-black px-12 text-center shadow-inner" placeholder="أدخل رقم التحويل هنا..." />
                                  <Hash size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
                               </div>
                            </div>
                         </div>
                         
                         {error && <p className="text-red-500 text-[10px] font-bold text-center animate-pulse">{error}</p>}

                         <Button 
                           onClick={handleManualSubmit} 
                           disabled={loading || !amount || !txid}
                           className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all group"
                         >
                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                              <div className="flex items-center gap-3">
                                 <span>{selectedPortal.automationType === 'binance' ? 'تدقيق الحوالة فوراً' : 'إرسال طلب التدقيق'}</span>
                                 <ShieldCheck size={20} className="text-[#f9a885]" />
                              </div>
                            )}
                         </Button>
                      </div>
                    )}
                  </div>
                )}

                {step === "verifying" && (
                  <div className="h-full flex flex-col items-center justify-center py-24 gap-8 animate-in zoom-in-95">
                     <div className="relative">
                        <div className="h-32 w-32 border-[4px] border-gray-50 border-t-blue-600 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Cpu size={48} className="text-blue-600 animate-pulse" />
                        </div>
                     </div>
                     <div className="text-center space-y-2">
                        <h3 className="text-xl font-black text-[#002d4d]">جاري مطابقة البيانات...</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Binance SAPI Verification in progress</p>
                     </div>
                  </div>
                )}

                {step === "success" && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-700 text-center py-10">
                    <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-[#002d4d]">تم الاستلام بنجاح</h3>
                      <p className="text-gray-400 font-bold text-xs px-8 leading-relaxed">
                        {selectedPortal?.automationType === 'binance' 
                          ? 'لقد تم التحقق من الحوالة برمجياً وتم حقن الرصيد في محفظتك فوراً.' 
                          : 'لقد تم استلام طلبك. سيقوم فريق التدقيق بمراجعة العملية وتحديث رصيدك خلال دقائق.'}
                      </p>
                    </div>
                    <Button onClick={handleClose} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">العودة للوحة القيادة</Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center shrink-0">
             <div className="flex items-center justify-center gap-4 opacity-30 select-none">
                <div className="flex items-center gap-1.5">
                   <ShieldCheck size={12} className="text-emerald-500" />
                   <span className="text-[8px] font-black uppercase text-[#002d4d]">Sovereign Node Secured</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5">
                   <Sparkles size={12} className="text-[#f9a885]" />
                   <span className="text-[8px] font-black uppercase text-[#002d4d]">Global Protocol Active</span>
                </div>
             </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
