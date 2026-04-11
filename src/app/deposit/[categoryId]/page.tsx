
"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFirestore, useMemoFirebase, useDoc, useCollection } from "@/firebase";
import { doc, onSnapshot, collection, addDoc, query, where } from "firebase/firestore";
import { 
  Copy, 
  Check, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  ArrowUpCircle, 
  Info, 
  Cpu, 
  Wallet, 
  Coins,
  AlertCircle,
  ClipboardPaste,
  Hash,
  Globe
} from "lucide-react";
import { getOrCreateUserWallet } from "@/app/actions/nowpayments-actions";
import { getBinanceDepositAddress } from "@/app/actions/binance-actions";
import { BINANCE_SUPPORTED_ASSETS } from "@/lib/binance-constants";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { motion, AnimatePresence } from "framer-motion";

interface DepositPageProps {
  params: Promise<{ categoryId: string }>;
}

type Step = "select_asset" | "execution" | "success";

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

export default function CategoryDepositPage({ params }: DepositPageProps) {
  const { categoryId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  
  const [step, setStep] = useState<Step>("select_asset");
  const [loading, setLoading] = useState(false);
  const [selectedPortalId, setSelectedPortalId] = useState("");
  const [selectedAutoAsset, setSelectedAutoAsset] = useState<any>(null);
  
  const [walletAddress, setWalletAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [copied, setCopied] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const categoryRef = useMemoFirebase(() => doc(db, "deposit_methods", categoryId), [db, categoryId]);
  const { data: category, isLoading: loadingCat } = useDoc(categoryRef);

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

  const activePortals = useMemo(() => {
    if (category?.type !== 'manual') return [];
    return category?.portals?.filter((p: any) => p.isActive) || [];
  }, [category]);

  const handlePortalSelect = (portal: any) => {
    setSelectedPortalId(portal.id);
    setWalletAddress(portal.walletAddress);
    setInstructions(portal.instructions);
    setStep("execution");
  };

  const handleAutoAssetSelect = async (asset: any) => {
    if (!dbUser || !category) return;
    setLoading(true);
    setError(null);
    setSelectedAutoAsset(asset);

    try {
      if (category.type === 'nowpayments') {
        const res = await getOrCreateUserWallet(dbUser.id, asset.id);
        if (res.success) {
          setWalletAddress(res.address);
          setInstructions(`هذا العنوان هو هويتك المالية الدائمة في ناميكس لهذه العملة. يرجى التحويل عبر شبكة ${asset.network} حصراً. سيقوم النظام برصد الحوالة وحقن الرصيد آلياً.`);
          setStep("execution");
        } else {
          setError(res.error);
        }
      } else if (category.type === 'binance') {
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
    if (category?.type !== 'nowpayments' && !txid) return;

    setLoading(true);
    try {
      const methodName = category?.type === 'manual' 
        ? `${category?.name} - ${activePortals.find(p => p.id === selectedPortalId)?.name}`
        : `${category?.name} (${selectedAutoAsset?.name || selectedAutoAsset?.coin})`;

      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        amount: Number(amount),
        methodName,
        transactionId: txid || "AUTO_SYNC_PENDING",
        status: "pending",
        isAutoAudited: category?.type !== 'manual',
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

  if (loadingCat) return (
    <Shell>
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-10 w-10 animate-spin text-[#002d4d] opacity-20" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">Syncing Secure Node...</p>
      </div>
    </Shell>
  );

  return (
    <Shell isPublic={false}>
      <div className="max-w-2xl mx-auto space-y-10 px-6 pt-10 pb-32 font-body text-right" dir="rtl">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8">
           <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-[28px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-2xl">
                 {category?.type === 'manual' ? <Wallet size={32}/> : category?.type === 'nowpayments' ? <Zap size={32} className="fill-current"/> : <Cpu size={32}/>}
              </div>
              <div className="space-y-1">
                 <h1 className="text-2xl md:text-3xl font-black text-[#002d4d]">{category?.name}</h1>
                 <div className="flex items-center gap-2 opacity-40">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-black uppercase tracking-widest">{category?.type?.toUpperCase()} Inflow Protocol</p>
                 </div>
              </div>
           </div>
           <button 
             onClick={() => step === "execution" ? setStep("select_asset") : router.back()} 
             className="h-12 w-12 rounded-[20px] bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#002d4d] active:scale-90 transition-all"
           >
              <ChevronRight size={24} />
           </button>
        </div>

        <AnimatePresence mode="wait">
          {step === "select_asset" && (
            <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
               <div className="p-8 bg-gray-50 rounded-[48px] border border-gray-100 shadow-inner">
                  <p className="text-[11px] font-bold text-gray-500 leading-[2.2]">{category?.description || "يرجى اختيار الوسيلة المناسبة لشحن محفظتك الاستثمارية."}</p>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                     <h3 className="text-lg font-black text-[#002d4d]">اختر وسيلة الدفع</h3>
                     <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full">SELECT NODE</Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {category?.type === 'manual' ? (
                      activePortals.map((p: any) => (
                        <button key={p.id} onClick={() => handlePortalSelect(p)} className="p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center justify-between group active:scale-[0.99]">
                          <div className="flex items-center gap-5">
                             <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all"><CryptoIcon name={p.icon} size={28} /></div>
                             <p className="font-black text-base text-[#002d4d]">{p.name}</p>
                          </div>
                          <ChevronLeft className="h-6 w-6 text-gray-200 group-hover:text-[#002d4d] transition-all" />
                        </button>
                      ))
                    ) : (
                      (category?.type === 'nowpayments' ? NOWPAYMENTS_ASSETS : BINANCE_SUPPORTED_ASSETS).map((asset: any) => (
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
                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Network: {asset.network || asset.networks?.[0].label}</p>
                             </div>
                          </div>
                          <ChevronLeft className="h-6 w-6 text-gray-200 group-hover:text-[#002d4d] transition-all" />
                        </button>
                      ))
                    )}
                  </div>
               </div>
            </motion.div>
          )}

          {step === "execution" && (
            <motion.div key="exec" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-10">
               <div className="p-8 bg-blue-50/40 rounded-[48px] border border-blue-100/50 space-y-4">
                  <div className="flex items-center gap-3 text-blue-600">
                     <Info size={20} />
                     <h4 className="text-sm font-black uppercase tracking-widest">بروتوكول التحويل المعتمد</h4>
                  </div>
                  <p className="text-[13px] font-bold leading-[2.2] text-blue-800/70">{instructions}</p>
               </div>

               <div className="p-10 bg-gray-50 rounded-[56px] border border-gray-100 shadow-inner space-y-8">
                  <div className="space-y-3">
                     <Label className="text-[10px] font-black text-gray-400 uppercase pr-6 tracking-widest">عنوان استلام السيولة</Label>
                     <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
                        <div className="flex-1 font-mono text-sm md:text-base font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">{walletAddress}</div>
                        <button onClick={handleCopy} className="h-16 w-16 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-2xl shrink-0 active:scale-90 transition-all flex items-center justify-center">
                           {copied ? <Check size={28}/> : <Copy size={28}/>}
                        </button>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-3">
                        <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-widest">المبلغ المراد شحنه ($)</Label>
                        <div className="relative">
                           <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-20 rounded-[32px] bg-white border-none font-black text-center text-5xl text-emerald-600 shadow-lg" placeholder="0.00" />
                           <Coins size={28} className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-100" />
                        </div>
                     </div>
                     
                     {category?.type !== 'nowpayments' && (
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-widest">معرف العملية الرقمي (TXID)</Label>
                          <Input value={txid} onChange={e => setTxid(e.target.value)} className="h-16 rounded-[24px] bg-white border-none font-mono text-sm font-black px-8 text-center shadow-lg" placeholder="أدخل رمز العملية (64 خانة)..." />
                       </div>
                     )}
                  </div>
               </div>

               {error && (
                 <div className="p-6 bg-red-50 rounded-[32px] border border-red-100 flex items-center gap-4 text-red-600 animate-pulse">
                    <AlertCircle size={24} />
                    <p className="text-sm font-black">{error}</p>
                 </div>
               )}

               <Button 
                 onClick={handleSubmit} 
                 disabled={loading || !amount || (category?.type !== 'nowpayments' && !txid)} 
                 className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl active:scale-95 group transition-all"
               >
                  {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                    <div className="flex items-center gap-4">
                       <span>{category?.type === 'nowpayments' ? "تأكيد واستلام السيولة" : "إرسال صك الإيداع للمراجعة"}</span>
                       <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                    </div>
                  )}
               </Button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center py-20">
               <div className="relative inline-flex">
                  <div className="h-40 w-40 bg-emerald-50 rounded-[56px] flex items-center justify-center shadow-inner border border-emerald-100 animate-in zoom-in-50 duration-700">
                     <CheckCircle2 className="h-20 w-20 text-emerald-500" />
                  </div>
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[56px] blur-2xl" />
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-4xl font-black text-[#002d4d]">تم إطلاق البروتوكول</h3>
                  <p className="text-gray-400 font-bold text-base px-12 leading-[2.2]">
                    {category?.type === 'nowpayments' 
                      ? "سيتم تحديث رصيدك آلياً بمجرد رصد الحوالة في سجلات البلوكشين العالمية." 
                      : "لقد تم استلام بيانات الإيداع. سيقوم محرك التدقيق بمراجعة العملية وحقن الرصيد خلال دقائق."}
                  </p>
               </div>

               <Button onClick={() => router.push("/home")} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl active:scale-95">
                  العودة للوحة القيادة
               </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-4 pt-10 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Sovereign Ledger v10.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
