
"use client";

import { useState, useEffect, useMemo } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerPortal, DrawerOverlay } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFirestore, useMemoFirebase, useCollection, useDoc } from "@/firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { 
  Copy, Check, ChevronRight, ChevronLeft, Loader2, CheckCircle2, Zap, ShieldCheck, 
  Sparkles, ArrowUpCircle, Info, Cpu, Wallet, ListFilter, Hash,
  AlertCircle,
  Network,
  TrendingUp,
  Gift,
  Coins
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
  { id: 'usdtbsc', name: 'USDT', network: 'BEP20 (BSC)', icon: 'USDT' },
  { id: 'usdteth', name: 'USDT', network: 'ERC20 (ETH)', icon: 'USDT' },
  { id: 'btc', name: 'Bitcoin', network: 'BTC', icon: 'BTC' },
  { id: 'eth', name: 'Ethereum', network: 'ERC20', icon: 'ETH' },
  { id: 'sol', name: 'Solana', network: 'SOL', icon: 'SOL' },
  { id: 'trx', name: 'TRON', network: 'TRC20', icon: 'TRX' },
  { id: 'ltc', name: 'Litecoin', network: 'LTC', icon: 'LTC' },
  { id: 'doge', name: 'Dogecoin', network: 'DOGE', icon: 'DOGE' },
  { id: 'shib', name: 'Shiba Inu', network: 'ERC20/BSC', icon: 'SHIB' },
  { id: 'matic', name: 'Polygon', network: 'POLYGON', icon: 'MATIC' },
  { id: 'bnbbsc', name: 'Binance Coin', network: 'BEP20 (BSC)', icon: 'BNB' },
  { id: 'xrp', name: 'Ripple', network: 'XRP', icon: 'XRP' },
  { id: 'ada', name: 'Cardano', network: 'ADA', icon: 'ADA' },
  { id: 'dot', name: 'Polkadot', network: 'DOT', icon: 'DOT' },
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

  // جلب الفئات والجوائز
  const categoriesQuery = useMemoFirebase(() => query(collection(db, "deposit_methods"), where("isActive", "==", true)), [db]);
  const { data: categories, isLoading: loadingCats } = useCollection(categoriesQuery);

  const vaultBonusRef = useMemoFirebase(() => doc(db, "system_settings", "vault_bonus"), [db]);
  const { data: vaultBonus } = useDoc(vaultBonusRef);

  const selectedCategory = useMemo(() => categories?.find(c => c.id === selectedCatId), [categories, selectedCatId]);
  
  const activePortals = useMemo(() => {
    if (selectedCategory?.type !== 'manual') return [];
    return selectedCategory?.portals?.filter((p: any) => p.isActive) || [];
  }, [selectedCategory]);

  const selectedPortal = useMemo(() => activePortals.find((p: any) => p.id === selectedPortalId), [activePortals, selectedPortalId]);

  const maxBonus = useMemo(() => {
    if (!vaultBonus?.depositBonuses || vaultBonus.depositBonuses.length === 0) return 0;
    return Math.max(...vaultBonus.depositBonuses.map((b: any) => b.percent));
  }, [vaultBonus]);

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
          setInstructions(`هذا العنوان هو هويتك المالية الدائمة في ناميكس لهذه العملة. يرجى التحويل عبر شبكة ${asset.network} حصراً. سيقوم النظام برصد الحوالة وحقن الرصيد آلياً.`);
          setStep("execution");
        } else {
          setError(res.error);
        }
      } else if (selectedCategory.type === 'binance') {
        const res = await getBinanceDepositAddress(asset.coin, asset.networks[0].code);
        if (res.success) {
          setWalletAddress(res.address);
          setInstructions(`يرجى تحويل المبلغ لعنوان الاستلام الموضح أعلاه عبر شبكة ${asset.networks[0].label}. بعد التحويل، يجب إدخال الـ TXID للتحقق الفوري.`);
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
          
          <DrawerHeader className="px-8 pt-6 shrink-0 flex flex-row items-center justify-between border-b border-gray-50 pb-4">
            <div className="flex items-center gap-4 text-right">
               <div className="h-11 w-11 rounded-2xl bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-xl"><ArrowUpCircle size={24} /></div>
               <div className="space-y-0.5">
                 <DrawerTitle className="text-xl font-black text-[#002d4d]">تعزيز الرصيد</DrawerTitle>
                 <p className="text-gray-400 font-black text-[8px] uppercase tracking-widest leading-none mt-1">Capital Infusion Protocol</p>
               </div>
            </div>
            {step !== "select_category" && step !== "success" && (
              <button onClick={() => setStep(step === "execution" && selectedCategory?.type !== 'manual' ? "select_automated_asset" : step === "select_automated_asset" ? "select_category" : "select_category")} className="rounded-full h-10 px-5 bg-gray-50 text-gray-400 font-black text-[10px] border border-gray-100 active:scale-95 flex items-center gap-2">
                <ChevronRight size={14} /> رجوع
              </button>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-none">
            {loadingCats || loading ? (
              <div className="h-full flex flex-col items-center justify-center py-20 gap-6">
                 <div className="h-12 w-12 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                 <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Secure Tunnel...</p>
              </div>
            ) : (
              <div className="space-y-8">
                
                {step === "select_category" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Bonus Banner Node */}
                    {maxBonus > 0 && (
                      <div className="p-6 bg-emerald-600 rounded-[32px] text-white relative overflow-hidden shadow-xl group">
                         <div className="absolute top-0 left-0 p-6 opacity-[0.1] -rotate-12 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                            <Sparkles size={100} />
                         </div>
                         <div className="flex items-center gap-5 relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                               <Gift className="h-7 w-7 text-[#f9a885] animate-bounce" />
                            </div>
                            <div className="text-right space-y-1">
                               <h4 className="font-black text-lg leading-tight">مكافأة الشحن نشطة!</h4>
                               <p className="text-[11px] font-bold text-emerald-100 leading-relaxed">
                                 احصل على مكافأة فورية تصل إلى <span className="text-[#f9a885] font-black">%{maxBonus}</span> عند تعزيز رصيدك اليوم.
                               </p>
                            </div>
                         </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                         <h3 className="text-base font-black text-[#002d4d]">حدد بروتوكول الشحن</h3>
                         <Badge variant="outline" className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase">Choose Sector</Badge>
                      </div>

                      <div className="grid gap-3">
                        {categories?.map((cat) => (
                          <button 
                            key={cat.id} 
                            onClick={() => { setSelectedCatId(cat.id); setStep(cat.type === 'manual' ? "select_portal" : "select_automated_asset"); }} 
                            className="w-full p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center gap-6 text-right group active:scale-[0.99] relative overflow-hidden"
                          >
                            <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all shrink-0">
                              {cat.type === 'manual' ? <Wallet size={28}/> : cat.type === 'nowpayments' ? <Zap size={28} className="text-purple-500 fill-current"/> : <Cpu size={28} className="text-orange-500"/>}
                            </div>
                            <div className="flex-1 space-y-1">
                               <div className="flex items-center justify-between">
                                  <p className="font-black text-base text-[#002d4d]">{cat.name}</p>
                                  <Badge className={cn(
                                    "text-[7px] font-black border-none px-2 py-0.5 rounded-md",
                                    cat.type === 'nowpayments' ? "bg-purple-50 text-purple-600" :
                                    cat.type === 'binance' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                                  )}>
                                    {cat.type?.toUpperCase() || 'MANUAL'}
                                  </Badge>
                               </div>
                               <p className="text-[10px] font-bold text-gray-400 leading-relaxed line-clamp-2">{cat.description || "استخدم هذا المسار لشحن رصيدك بذكاء وأمان."}</p>
                            </div>
                            <ChevronLeft className="h-5 w-5 text-gray-200 group-hover:text-[#002d4d] transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === "select_portal" && selectedCategory?.type === 'manual' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="px-2 space-y-1">
                       <h3 className="text-lg font-black text-[#002d4d]">اختر بوابة الاستلام</h3>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select Manual Node</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {activePortals.map((p: any) => (
                        <button key={p.id} onClick={() => handlePortalSelect(p)} className="p-8 rounded-[40px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-2xl transition-all duration-500 flex flex-col items-center gap-4 active:scale-[0.98] relative overflow-hidden group">
                          <div className="h-16 w-16 rounded-[24px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all"><CryptoIcon name={p.icon} size={32} /></div>
                          <p className="font-black text-sm text-[#002d4d]">{p.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === "select_automated_asset" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="px-2 space-y-1">
                       <h3 className="text-lg font-black text-[#002d4d]">اختر العملة والشبكة</h3>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select Automated Asset</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 pb-10">
                      {(selectedCategory?.type === 'nowpayments' ? NOWPAYMENTS_ASSETS : BINANCE_SUPPORTED_ASSETS).map((asset: any) => (
                        <button 
                          key={asset.id || asset.coin} 
                          onClick={() => handleAutoAssetSelect(asset)} 
                          className="p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center justify-between group active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-5">
                             <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all">
                                <CryptoIcon name={asset.icon} size={28} />
                             </div>
                             <div className="text-right">
                                <p className="font-black text-base text-[#002d4d]">{asset.name || asset.coin}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">شبكة: {asset.network || asset.networks?.[0].label}</p>
                             </div>
                          </div>
                          <ChevronLeft className="h-6 w-6 text-gray-200 group-hover:text-[#002d4d] transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === "execution" && (
                  <div className="space-y-10 animate-in zoom-in-95 duration-500 text-right">
                    <div className="p-8 bg-blue-50/40 rounded-[48px] border border-blue-100/50 space-y-4">
                       <div className="flex items-center gap-3 text-blue-600"><Info size={20} /><h4 className="text-sm font-black uppercase">بروتوكول التحويل</h4></div>
                       <p className="text-[12px] font-bold leading-[2.2] text-blue-800/70">{instructions}</p>
                    </div>

                    <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner space-y-6">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">
                            {selectedCategory?.type === 'nowpayments' ? 'عنوان محفظتك الدائم' : 'عنوان استلام السيولة'}
                          </Label>
                          <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-4">
                             <div className="flex-1 font-mono text-[13px] font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">{walletAddress}</div>
                             <button onClick={handleCopy} className="h-14 w-14 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-2xl shrink-0 active:scale-90 transition-all flex items-center justify-center">
                               {copied ? <Check size={24}/> : <Copy size={24}/>}
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8 pb-10">
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-widest">المبلغ المحول ($)</Label>
                             <div className="relative">
                                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-20 rounded-[32px] bg-gray-50 border-none font-black text-center text-4xl text-emerald-600 shadow-inner" placeholder="0.00" />
                                <Coins size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-100" />
                             </div>
                          </div>
                          
                          {selectedCategory?.type !== 'nowpayments' && (
                            <div className="space-y-2 animate-in fade-in">
                               <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-widest">معرف العملية (TXID)</Label>
                               <Input value={txid} onChange={e => setTxid(e.target.value)} className="h-16 rounded-[24px] bg-gray-50 border-none font-mono text-sm font-black px-8 text-center shadow-inner" placeholder="أدخل رمز العملية المكون من 64 خانة..." />
                            </div>
                          )}
                       </div>
                       
                       {error && (
                         <div className="p-5 bg-red-50 rounded-3xl border border-red-100 flex items-center gap-4 text-red-600 animate-pulse">
                            <AlertCircle size={20} />
                            <p className="text-xs font-black">{error}</p>
                         </div>
                       )}
                       
                       <Button onClick={handleSubmit} disabled={loading || !amount || (selectedCategory?.type !== 'nowpayments' && !txid)} className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-2xl active:scale-95 group transition-all">
                          {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                            selectedCategory?.type === 'nowpayments' ? "تأكيد واستلام السيولة" : "إرسال صك الإيداع للمراجعة"
                          )}
                       </Button>
                    </div>
                  </div>
                )}

                {step === "success" && (
                  <div className="space-y-10 animate-in zoom-in-95 duration-700 text-center py-16">
                    <div className="h-32 w-32 bg-emerald-50 rounded-[48px] flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                       <CheckCircle2 className="h-16 w-16 text-emerald-500" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-3xl font-black text-[#002d4d]">تم إطلاق البروتوكول</h3>
                       <p className="text-gray-400 font-bold text-sm px-12 leading-[2.2]">
                         {selectedCategory?.type === 'nowpayments' 
                           ? "سيتم تحديث رصيدك آلياً بمجرد رصد الحوالة في سجلات البلوكشين العالمية." 
                           : "لقد تم استلام بيانات الإيداع. سيقوم محرك التدقيق بمراجعة العملية وحقن الرصيد خلال دقائق."}
                       </p>
                    </div>
                    <Button onClick={handleClose} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-lg shadow-2xl">إكمال والعودة للوحة القيادة</Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-8 bg-gray-50/50 border-t border-gray-100 text-center shrink-0">
             <div className="flex items-center justify-center gap-6 opacity-30 select-none">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   <span className="text-[9px] font-black uppercase text-[#002d4d] tracking-widest">Sovereign Encryption Node</span>
                </div>
                <div className="h-4 w-px bg-gray-300" />
                <div className="flex items-center gap-2">
                   <Sparkles size={14} className="text-[#f9a885]" />
                   <span className="text-[9px] font-black uppercase text-[#002d4d] tracking-widest">Global Payout Sync</span>
                </div>
             </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
