
"use client";

import { useState, useEffect, useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerPortal, DrawerOverlay } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { 
  Copy, Check, ChevronRight, Loader2, CheckCircle2, Zap, ShieldCheck, 
  Sparkles, ArrowUpCircle, Info, Cpu, Wallet, ListFilter, Hash,
  AlertCircle,
  Network
} from "lucide-react";
import { getOrCreateUserWallet } from "@/app/actions/nowpayments-actions";
import { getBinanceDepositAddress } from "@/app/actions/binance-actions";
import { BINANCE_SUPPORTED_ASSETS } from "@/lib/binance-constants";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { motion, AnimatePresence } from "framer-motion";

interface DepositSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "select_category" | "select_portal" | "select_automated_asset" | "execution" | "success";

const NOWPAYMENTS_ASSETS = [
  { id: 'usdttrc20', name: 'USDT', network: 'TRC20', icon: 'USDT' },
  { id: 'usdtbsc', name: 'USDT', network: 'BEP20 (BSC)', icon: 'BNB' },
  { id: 'btc', name: 'Bitcoin', network: 'BTC', icon: 'BTC' },
  { id: 'eth', name: 'Ethereum', network: 'ERC20', icon: 'ETH' },
  { id: 'ltc', name: 'Litecoin', network: 'LTC', icon: 'LTC' },
];

export function DepositSheet({ open, onOpenChange }: DepositSheetProps) {
  const [step, setStep] = useState<Step>("select_category");
  const [loading, setLoading] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedPortalId, setSelectedPortalId] = useState("");
  const [selectedAutoAsset, setSelectedAutoAsset] = useState<any>(null);
  
  const [walletAddress, setWalletAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [copied, setCopied] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const db = useFirestore();

  const categoriesQuery = useMemoFirebase(() => query(collection(db, "deposit_methods"), where("isActive", "==", true)), [db]);
  const { data: categories, isLoading: loadingCats } = useCollection(categoriesQuery);

  const selectedCategory = useMemo(() => categories?.find(c => c.id === selectedCatId), [categories, selectedCatId]);
  
  const activePortals = useMemo(() => {
    if (selectedCategory?.type !== 'manual') return [];
    return selectedCategory?.portals?.filter((p: any) => p.isActive) || [];
  }, [selectedCategory]);

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

  const handlePortalSelect = (portal: any) => {
    setSelectedPortalId(portal.id);
    setWalletAddress(portal.walletAddress);
    setInstructions(portal.instructions);
    setStep("execution");
  };

  const handleAutoAssetSelect = async (asset: any) => {
    if (!dbUser || !selectedCategory) return;
    setLoading(true);
    setError(null);
    setSelectedAutoAsset(asset);

    try {
      if (selectedCategory.type === 'nowpayments') {
        const res = await getOrCreateUserWallet(dbUser.id, asset.id);
        if (res.success) {
          setWalletAddress(res.address);
          setInstructions(`هذا العنوان هو هويتك المالية الدائمة في ناميكس لهذه العملة. يرجى التحويل عبر شبكة ${asset.network} حصراً. سيقوم النظام برصد الحوالة وحقن الرصيد آلياً دون الحاجة لإرسال TXID.`);
          setStep("execution");
        } else {
          setError(res.error);
        }
      } else if (selectedCategory.type === 'binance') {
        // في وضع بينانس، نجلب العنوان الخاص بحساب المشرف
        const res = await getBinanceDepositAddress(asset.coin, asset.networks[0].code);
        if (res.success) {
          setWalletAddress(res.address);
          setInstructions(`يرجى تحويل المبلغ لعنوان المشرف الموضح أعلاه عبر شبكة ${asset.networks[0].label}. بعد التحويل، يجب إدخال الـ TXID ليقوم النظام بالتحقق الفوري منه.`);
          setStep("execution");
        } else {
          setError(res.error);
        }
      }
    } catch (e: any) {
      setError("فشل الاتصال ببروتوكول المزامنة.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !dbUser) return;
    // في وضع NOWPayments لا نشترط TXID لأن الأتمتة تعتمد على الـ IPN
    if (selectedCategory?.type !== 'nowpayments' && !txid) return;

    setLoading(true);
    try {
      const methodName = selectedCategory?.type === 'manual' 
        ? `${selectedCategory?.name} - ${selectedPortal?.name}`
        : `${selectedCategory?.name} (${selectedAutoAsset?.name || selectedAutoAsset?.coin})`;

      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        amount: Number(amount),
        methodName,
        transactionId: txid || "AUTO_SYNC_PENDING",
        status: "pending",
        isAutoAudited: selectedCategory?.type !== 'manual',
        createdAt: new Date().toISOString()
      });
      setStep("success");
    } catch (e) {
      setError("فشل إرسال طلب التدقيق.");
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
      setSelectedAutoAsset(null);
      setWalletAddress("");
      setInstructions("");
      setTxid("");
      setAmount("");
      setError(null);
    }, 300);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 h-[85vh] outline-none flex flex-col bg-white rounded-t-[44px] border-none shadow-2xl z-[1001] font-body" dir="rtl">
          
          <DrawerHeader className="px-6 pt-4 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-2">
            <div className="flex items-center gap-3 text-right">
               <div className="h-9 w-9 rounded-xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-lg"><ArrowUpCircle size={20} /></div>
               <div className="space-y-0">
                 <DrawerTitle className="text-base font-black text-[#002d4d]">شحن الرصيد السيادي</DrawerTitle>
                 <p className="text-gray-400 font-black text-[7px] uppercase tracking-widest mt-1">Capital Infusion Hub</p>
               </div>
            </div>
            {step !== "select_category" && step !== "success" && (
              <button onClick={() => setStep(step === "execution" && selectedCategory?.type !== 'manual' ? "select_automated_asset" : step === "select_automated_asset" ? "select_category" : "select_category")} className="rounded-full h-7 px-3 bg-gray-50 text-gray-400 font-black text-[8px] border border-gray-100 active:scale-95 flex items-center gap-1.5">
                <ChevronRight size={12} /> رجوع
              </button>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-none">
            {loadingCats || loading ? (
              <div className="h-full flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="h-8 w-8 animate-spin text-[#002d4d]" />
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Secure Protocol...</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* الخطوة 1: اختيار الفئة */}
                {step === "select_category" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2 justify-end px-2">حدد فئة الشحن <ListFilter size={16} className="text-[#f9a885]" /></h3>
                    <div className="grid grid-cols-2 gap-3">
                      {categories?.map((cat) => (
                        <button key={cat.id} onClick={() => { setSelectedCatId(cat.id); setStep(cat.type === 'manual' ? "select_portal" : "select_automated_asset"); }} className="p-6 rounded-[40px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex flex-col items-center gap-3 active:scale-[0.98] relative overflow-hidden group">
                          <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                            {cat.type === 'manual' ? <Wallet size={24}/> : cat.type === 'nowpayments' ? <Zap size={24} className="text-purple-500 fill-current"/> : <Cpu size={24}/>}
                          </div>
                          <div className="text-center">
                             <p className="font-black text-[11px] text-[#002d4d]">{cat.name}</p>
                             <Badge className={cn(
                               "text-[6px] font-black border-none px-1.5 py-0.5 mt-1.5",
                               cat.type === 'nowpayments' ? "bg-purple-50 text-purple-600" :
                               cat.type === 'binance' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                             )}>
                               {cat.type?.toUpperCase() || 'MANUAL'}
                             </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* الخطوة 2 (يدوي): اختيار البوابة */}
                {step === "select_portal" && selectedCategory?.type === 'manual' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-500">
                    <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2 justify-end px-2">اختر بوابة الاستلام <Zap size={16} className="text-blue-500" /></h3>
                    <div className="grid grid-cols-2 gap-3">
                      {activePortals.map((p: any) => (
                        <button key={p.id} onClick={() => handlePortalSelect(p)} className="p-6 rounded-[40px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex flex-col items-center gap-3 active:scale-[0.98] relative overflow-hidden group">
                          <div className="h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all"><CryptoIcon name={p.icon} size={24} /></div>
                          <p className="font-black text-[11px] text-[#002d4d] leading-none">{p.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* الخطوة 2 (آلي): اختيار العملة والشبكة */}
                {step === "select_automated_asset" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-500">
                    <h3 className="text-sm font-black text-[#002d4d] flex items-center gap-2 justify-end px-2">اختر العملة والشبكة <Network size={16} className="text-blue-500" /></h3>
                    <div className="grid grid-cols-1 gap-3">
                      {(selectedCategory?.type === 'nowpayments' ? NOWPAYMENTS_ASSETS : BINANCE_SUPPORTED_ASSETS).map((asset: any) => (
                        <button 
                          key={asset.id || asset.coin} 
                          onClick={() => handleAutoAssetSelect(asset)} 
                          className="p-5 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-lg transition-all duration-500 flex items-center justify-between group active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-[18px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                                <CryptoIcon name={asset.icon} size={24} />
                             </div>
                             <div className="text-right">
                                <p className="font-black text-sm text-[#002d4d]">{asset.name || asset.coin}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{asset.network || asset.networks?.[0].label}</p>
                             </div>
                          </div>
                          <ChevronLeft className="h-5 w-5 text-gray-200 group-hover:text-[#002d4d] transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* الخطوة 3: التنفيذ */}
                {step === "execution" && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500 text-right">
                    <div className="p-6 bg-blue-50/40 rounded-[40px] border border-blue-100/50 space-y-3">
                       <div className="flex items-center gap-2 text-blue-600"><Info size={16} /><h4 className="text-xs font-black">تعليمات البروتوكول:</h4></div>
                       <p className="text-[11px] font-bold leading-loose text-blue-800/70">{instructions}</p>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-4">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black text-gray-400 uppercase pr-2 tracking-widest">
                            {selectedCategory?.type === 'nowpayments' ? 'عنوان محفظتك الشخصي' : 'عنوان استلام المشرف'}
                          </Label>
                          <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-3">
                             <div className="flex-1 font-mono text-[11px] font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">{walletAddress}</div>
                             <Button onClick={handleCopy} className="h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-xl shrink-0 active:scale-90 transition-all">{copied ? <Check size={20}/> : <Copy size={20}/>}</Button>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-4">
                          <div className="space-y-1.5">
                             <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">المبلغ المودع ($)</Label>
                             <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-center text-2xl text-emerald-600 shadow-inner" placeholder="0.00" />
                          </div>
                          
                          {selectedCategory?.type !== 'nowpayments' && (
                            <div className="space-y-1.5 animate-in fade-in">
                               <Label className="text-[9px] font-black text-gray-400 pr-4 uppercase">معرف العملية (TXID)</Label>
                               <Input value={txid} onChange={e => setTxid(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-[10px] font-black px-8 text-center shadow-inner" placeholder="أدخل رقم التحويل هنا..." />
                            </div>
                          )}
                       </div>
                       
                       {error && <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600"><AlertCircle size={16}/><p className="text-[10px] font-bold">{error}</p></div>}
                       
                       <Button onClick={handleSubmit} disabled={loading || !amount || (selectedCategory?.type !== 'nowpayments' && !txid)} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 group transition-all">
                          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                            selectedCategory?.type === 'nowpayments' ? "إتمام وتأكيد الدفع اللحظي" : "إرسال طلب التدقيق السيادي"
                          )}
                       </Button>
                    </div>
                  </div>
                )}

                {step === "success" && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-700 text-center py-10">
                    <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                       <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-[#002d4d]">تم الاستلام بنجاح</h3>
                       <p className="text-gray-400 font-bold text-xs px-8 leading-relaxed">
                         {selectedCategory?.type === 'nowpayments' 
                           ? "سيتم حقن الرصيد آلياً في محفظتك بمجرد تأكيد الحوالة على الشبكة." 
                           : "لقد تم استلام طلبك. سيقوم فريق التدقيق بمراجعة العملية وتحديث رصيدك خلال دقائق."}
                       </p>
                    </div>
                    <Button onClick={handleClose} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">العودة للرئيسية</Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center shrink-0">
             <div className="flex items-center justify-center gap-4 opacity-30 select-none">
                <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /><span className="text-[8px] font-black uppercase text-[#002d4d]">Sovereign Node Secured</span></div>
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5"><Sparkles size={12} className="text-[#f9a885]" /><span className="text-[8px] font-black uppercase text-[#002d4d]">Global Protocol Active</span></div>
             </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
