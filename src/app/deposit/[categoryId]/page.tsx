
"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Loader2, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Info, 
  Cpu, 
  Wallet, 
  AlertCircle,
  Hash,
  Globe,
  Coins,
  Search,
  ArrowUpDown,
  X,
  Star
} from "lucide-react";
import { getOrCreateUserWallet } from "@/app/actions/nowpayments-actions";
import { getBinanceDepositAddress, getBinanceCoinsConfig } from "@/app/actions/binance-actions";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DepositPageProps {
  params: Promise<{ categoryId: string }>;
}

type Step = "select_asset" | "select_network" | "execution" | "success";
type SortMode = 'popular' | 'name';

const NOWPAYMENTS_ASSETS = [
  { id: 'usdttrc20', name: 'Tether', coin: 'USDT', network: 'TRC20', icon: 'USDT' },
  { id: 'usdtbsc', name: 'Tether', coin: 'USDT', network: 'BEP20 (BSC)', icon: 'USDT' },
  { id: 'usdteth', name: 'Tether', coin: 'USDT', network: 'ERC20 (ETH)', icon: 'USDT' },
  { id: 'btc', name: 'Bitcoin', coin: 'BTC', network: 'BTC', icon: 'BTC' },
  { id: 'eth', name: 'Ethereum', coin: 'ETH', network: 'ERC20', icon: 'ETH' },
  { id: 'sol', name: 'Solana', coin: 'SOL', network: 'SOL', icon: 'SOL' },
  { id: 'trx', name: 'TRON', coin: 'TRX', network: 'TRC20', icon: 'TRX' },
  { id: 'ltc', name: 'Litecoin', coin: 'LTC', network: 'LTC', icon: 'LTC' },
  { id: 'doge', name: 'Dogecoin', coin: 'DOGE', network: 'DOGE', icon: 'DOGE' },
  { id: 'shib', name: 'Shiba Inu', coin: 'SHIB', network: 'ERC20/BSC', icon: 'SHIB' },
  { id: 'matic', name: 'Polygon', coin: 'MATIC', network: 'POLYGON', icon: 'MATIC' },
  { id: 'bnbbsc', name: 'Binance Coin', coin: 'BNB', network: 'BEP20 (BSC)', icon: 'BNB' },
  { id: 'xrp', name: 'Ripple', coin: 'XRP', network: 'XRP', icon: 'XRP' },
  { id: 'ada', name: 'Cardano', coin: 'ADA', network: 'ADA', icon: 'ADA' },
  { id: 'dot', name: 'Polkadot', coin: 'DOT', network: 'DOT', icon: 'DOT' },
];

const POPULAR_COINS = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];

export default function CategoryDepositPage({ params }: DepositPageProps) {
  const { categoryId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  
  const [step, setStep] = useState<Step>("select_asset");
  const [loading, setLoading] = useState(false);
  const [binanceConfig, setBinanceConfig] = useState<any[]>([]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('popular');

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  const [selectedPortalId, setSelectedPortalId] = useState("");
  
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

  useEffect(() => {
    if (category?.type === 'binance' && binanceConfig.length === 0) {
      const fetchConfig = async () => {
        const res = await getBinanceCoinsConfig();
        if (res.success) setBinanceConfig(res.coins);
      };
      fetchConfig();
    }
  }, [category, binanceConfig.length]);

  // Combined Filtering & Sorting Logic
  const filteredAssets = useMemo(() => {
    let list: any[] = [];
    if (category?.type === 'manual') list = category?.portals?.filter((p: any) => p.isActive) || [];
    else if (category?.type === 'nowpayments') list = NOWPAYMENTS_ASSETS;
    else if (category?.type === 'binance') list = binanceConfig;

    // 1. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => 
        (a.name || "").toLowerCase().includes(q) || 
        (a.coin || "").toLowerCase().includes(q) ||
        (a.id || "").toLowerCase().includes(q)
      );
    }

    // 2. Sort Logic
    if (sortMode === 'name') {
      list = [...list].sort((a, b) => (a.name || a.coin || "").localeCompare(b.name || b.coin || ""));
    } else {
      // Sort by popular priority
      list = [...list].sort((a, b) => {
        const aSymbol = (a.coin || a.name || "").toUpperCase();
        const bSymbol = (b.coin || b.name || "").toUpperCase();
        const aPop = POPULAR_COINS.indexOf(aSymbol);
        const bPop = POPULAR_COINS.indexOf(bSymbol);
        
        if (aPop !== -1 && bPop !== -1) return aPop - bPop;
        if (aPop !== -1) return -1;
        if (bPop !== -1) return 1;
        return aSymbol.localeCompare(bSymbol);
      });
    }

    return list;
  }, [category, binanceConfig, searchQuery, sortMode]);

  const handleAssetSelect = async (asset: any) => {
    setError(null);
    setSelectedAsset(asset);
    
    if (category?.type === 'nowpayments') {
      setLoading(true);
      try {
        const res = await getOrCreateUserWallet(dbUser.id, asset.id);
        if (res.success) {
          setWalletAddress(res.address);
          setInstructions(`هذا العنوان هو هويتك المالية الدائمة لعملة ${asset.coin}. يرجى التحويل عبر شبكة ${asset.network} حصراً. سيقوم النظام بحقن الرصيد آلياً فور رصد العملية.`);
          setStep("execution");
        } else {
          setError(res.error);
        }
      } catch (e) {
        setError("فشل الاتصال بمزود الخدمة.");
      } finally {
        setLoading(false);
      }
    } else if (category?.type === 'binance') {
      setStep("select_network");
    } else if (category?.type === 'manual') {
      setSelectedPortalId(asset.id);
      setWalletAddress(asset.walletAddress);
      setInstructions(asset.instructions);
      setStep("execution");
    }
  };

  const handleNetworkSelect = async (network: any) => {
    if (!dbUser || !selectedAsset) return;
    setLoading(true);
    setError(null);
    setSelectedNetwork(network);

    try {
      const res = await getBinanceDepositAddress(selectedAsset.coin, network.network);
      if (res.success) {
        setWalletAddress(res.address);
        setInstructions(`يرجى تحويل المبلغ لعنوان الاستلام الموضح أعلاه عبر شبكة ${network.name}. بعد التحويل، يجب إدخال الـ TXID فقط للتحقق الآلي من الميزانية وحقن الرصيد.`);
        setStep("execution");
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError("فشل الاتصال ببروتوكول بينانس.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!dbUser) return;
    if (category?.type !== 'binance' && !amount) return;
    if (category?.type === 'binance' && !txid) return;

    setLoading(true);
    try {
      const methodName = category?.type === 'manual' 
        ? `${category?.name} - ${selectedAsset?.name}`
        : `${category?.name} (${selectedAsset?.coin || selectedAsset?.name})`;

      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        amount: category?.type === 'binance' ? 0 : Number(amount),
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
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-white font-body">
        <Loader2 className="h-10 w-10 animate-spin text-[#002d4d] opacity-20" />
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">Initializing Secure Node...</p>
      </div>
    </Shell>
  );

  return (
    <Shell hideMobileNav>
      <div className="max-w-4xl mx-auto space-y-10 px-4 md:px-8 pt-8 pb-32 font-body text-right" dir="rtl">
        
        {/* Responsive Header Matrix */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-8">
           <div className="flex items-center gap-4 md:gap-6">
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-[28px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-2xl shrink-0">
                 {category?.type === 'manual' ? <Wallet size={28}/> : category?.type === 'nowpayments' ? <Zap size={28} className="fill-current"/> : <Cpu size={28}/>}
              </div>
              <div className="space-y-1">
                 <h1 className="text-xl md:text-3xl font-black text-[#002d4d] tracking-tight">{category?.name}</h1>
                 <div className="flex items-center gap-2 opacity-40">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">{category?.type?.toUpperCase()} Node Ready</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
              {step === "select_asset" && (
                <div className="flex items-center gap-1">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <button className="h-10 px-4 rounded-xl flex items-center gap-2 text-gray-400 hover:text-[#002d4d] transition-all outline-none">
                            <ArrowUpDown size={16} />
                            <span className="text-[10px] font-black hidden sm:inline-block">فرز</span>
                         </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px] bg-white z-[1002]" dir="rtl">
                         <DropdownMenuItem onClick={() => setSortMode('popular')} className="font-black text-[10px] py-3 px-4 rounded-xl cursor-pointer justify-between">
                            الأكثر شيوعاً {sortMode === 'popular' && <Star size={12} className="text-orange-400 fill-current" />}
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setSortMode('name')} className="font-black text-[10px] py-3 px-4 rounded-xl cursor-pointer justify-between">
                            الاسم (A-Z) {sortMode === 'name' && <Check size={12} className="text-blue-500" />}
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>

                   <button 
                     onClick={() => setIsSearchOpen(!isSearchOpen)}
                     className={cn(
                       "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                       isSearchOpen ? "bg-[#002d4d] text-[#f9a885] shadow-lg" : "text-gray-400"
                     )}
                   >
                      {isSearchOpen ? <X size={18}/> : <Search size={18}/>}
                   </button>
                </div>
              )}

              <button 
                onClick={() => {
                  if (step === "execution") setStep(category?.type === 'binance' ? "select_network" : "select_asset");
                  else if (step === "select_network") setStep("select_asset");
                  else router.back();
                }} 
                className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#002d4d] shadow-sm active:scale-90"
              >
                 <ChevronRight size={20} />
              </button>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "select_asset" && (
            <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
               
               {isSearchOpen && (
                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                    <div className="relative group">
                       <Input 
                         autoFocus
                         placeholder="ابحث عن اسم العملة أو الرمز..."
                         value={searchQuery}
                         onChange={e => setSearchQuery(e.target.value)}
                         className="h-14 rounded-2xl bg-gray-50 border-none font-bold text-sm px-12 text-right focus-visible:ring-4 focus-visible:ring-blue-500/5 shadow-inner"
                       />
                       <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                    </div>
                 </motion.div>
               )}

               <div className="p-6 md:p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 shadow-inner">
                  <p className="text-[11px] md:text-sm font-bold text-gray-500 leading-loose">
                    {category?.description || "يرجى اختيار الأصل الرقمي المراد شحنه لبدء بروتوكول المزامنة والمصادقة."}
                  </p>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                     <h3 className="text-lg font-black text-[#002d4d]">الأصول المتاحة</h3>
                     <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[8px] px-3 py-1 rounded-full">CRYPTO INVENTORY</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssets.map((asset: any) => {
                      const coinSymbol = asset.coin || asset.name || "";
                      const iconName = category?.type === 'binance' ? coinSymbol : (asset.icon || coinSymbol);
                      
                      return (
                        <button 
                          key={asset.id || asset.coin} 
                          onClick={() => handleAssetSelect(asset)} 
                          className="p-6 rounded-[36px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-2xl transition-all duration-500 flex flex-col items-center gap-4 text-center group active:scale-[0.98] relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000">
                             <CryptoIcon name={iconName} size={80} />
                          </div>
                          
                          <div className="h-16 w-16 rounded-[24px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500 relative z-10">
                             <CryptoIcon name={iconName} size={32} />
                          </div>
                          
                          <div className="relative z-10 space-y-1">
                             <p className="font-black text-base text-[#002d4d] group-hover:text-blue-600 transition-colors">{asset.name || asset.coin}</p>
                             <div className="flex items-center justify-center gap-2">
                                <Badge variant="outline" className="bg-gray-50 border-gray-100 text-gray-400 font-black text-[7px] px-2 py-0.5">{asset.coin || asset.network}</Badge>
                                {POPULAR_COINS.includes(coinSymbol.toUpperCase()) && <Sparkles size={10} className="text-orange-400" />}
                             </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {filteredAssets.length === 0 && (
                    <div className="py-20 text-center opacity-20 border-2 border-dashed border-gray-100 rounded-[48px] flex flex-col items-center gap-4">
                       <Search size={48} />
                       <p className="text-xs font-black uppercase tracking-widest">لم يتم العثور على نتائج</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}

          {step === "select_network" && selectedAsset && (
            <motion.div key="network" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
               <div className="flex items-center gap-5 px-4">
                  <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner"><CryptoIcon name={selectedAsset.coin} size={32} /></div>
                  <div className="text-right">
                     <h3 className="text-xl font-black text-[#002d4d]">حدد شبكة التحويل</h3>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Network Selection Node for {selectedAsset.coin}</p>
                  </div>
               </div>

               <div className="grid gap-3">
                  {selectedAsset.networkList?.filter((n: any) => n.depositEnable).map((net: any) => (
                    <button 
                      key={net.network} 
                      onClick={() => handleNetworkSelect(net)}
                      className="p-6 rounded-[32px] border border-gray-100 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex items-center justify-between group active:scale-[0.99]"
                    >
                       <div className="text-right">
                          <p className="font-black text-lg text-[#002d4d]">{net.name} ({net.network})</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-2.5 py-0.5 rounded-full shadow-sm">INSTANT VERIFICATION</Badge>
                             <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                          </div>
                       </div>
                       <ChevronLeft className="h-6 w-6 text-gray-200 group-hover:text-[#002d4d] transition-all" />
                    </button>
                  ))}
               </div>
            </motion.div>
          )}

          {step === "execution" && (
            <motion.div key="exec" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-10">
               <div className="p-8 bg-blue-50/40 rounded-[48px] border border-blue-100/50 space-y-4">
                  <div className="flex items-center gap-3 text-blue-600">
                     <Info size={20} />
                     <h4 className="text-sm font-black uppercase tracking-widest">بروتوكول الشحن المعتمد</h4>
                  </div>
                  <p className="text-[13px] md:text-base font-bold leading-loose text-blue-800/70">{instructions}</p>
               </div>

               <div className="p-8 md:p-12 bg-gray-50 rounded-[56px] border border-gray-100 shadow-inner space-y-10">
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black text-gray-400 uppercase pr-6 tracking-[0.2em]">عنوان استلام السيولة</Label>
                     <div className="bg-white p-6 md:p-8 rounded-[36px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                        {loading ? (
                          <div className="flex-1 flex items-center gap-3 animate-pulse">
                             <Loader2 size={16} className="animate-spin text-blue-500" />
                             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Generating Address...</span>
                          </div>
                        ) : (
                          <div className="flex-1 font-mono text-xs md:text-xl font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">{walletAddress}</div>
                        )}
                        <button onClick={handleCopy} disabled={loading} className="h-16 w-16 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-2xl shrink-0 active:scale-90 transition-all flex items-center justify-center disabled:opacity-20">
                           {copied ? <Check size={28}/> : <Copy size={28}/>}
                        </button>
                     </div>
                  </div>

                  <div className="space-y-10">
                     {category?.type !== 'binance' && (
                       <div className="space-y-4">
                          <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-[0.2em]">المبلغ المراد شحنه ($)</Label>
                          <div className="relative group">
                             <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="h-24 rounded-[40px] bg-white border-none font-black text-center text-6xl text-emerald-600 shadow-xl focus-visible:ring-8 focus-visible:ring-emerald-500/5 transition-all" placeholder="0.00" />
                             <Coins size={32} className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-100 group-focus-within:text-emerald-500 transition-colors" />
                          </div>
                       </div>
                     )}
                     
                     {category?.type !== 'nowpayments' && (
                       <div className="space-y-4">
                          <Label className="text-[10px] font-black text-gray-400 pr-6 uppercase tracking-[0.2em]">{category?.type === 'binance' ? 'معرف العملية (TXID)' : 'رقم العملية المرجعي'}</Label>
                          <div className="relative">
                            <Input value={txid} onChange={e => setTxid(e.target.value)} className="h-16 rounded-[24px] bg-white border-none font-mono text-sm font-black px-10 text-center shadow-lg focus-visible:ring-4 focus-visible:ring-blue-500/5" placeholder="ألصق الـ Hash هنا..." />
                            <Hash className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100" />
                          </div>
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
                 disabled={loading || (category?.type !== 'binance' && !amount) || (category?.type === 'binance' && !txid)} 
                 className="w-full h-20 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xl shadow-2xl active:scale-95 group transition-all"
               >
                  {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                    <div className="flex items-center gap-4">
                       <span>{category?.type === 'nowpayments' ? "تأكيد واستلام السيولة" : "توثيق الإيداع آلياً"}</span>
                       <ShieldCheck className="h-6 w-6 text-[#f9a885] group-hover:rotate-12 transition-transform" />
                    </div>
                  )}
               </Button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 text-center py-20">
               <div className="relative inline-flex">
                  <div className="h-48 w-48 bg-emerald-50 rounded-[64px] flex items-center justify-center shadow-inner border border-emerald-100 animate-in zoom-in-50 duration-700">
                     <CheckCircle2 className="h-24 w-24 text-emerald-500" />
                  </div>
                  <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[64px] blur-3xl" />
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-black text-[#002d4d] tracking-tight">تم إطلاق البروتوكول</h3>
                  <p className="text-gray-400 font-bold text-base md:text-xl px-12 leading-loose">
                    {category?.type === 'nowpayments' 
                      ? "سيتم تحديث رصيدك آلياً بمجرد رصد الحوالة في سجلات البلوكشين العالمية (0 Confirmation)." 
                      : "لقد تم استلام بيانات الإيداع. سيقوم محرك التدقيق بمراجعة العملية وحقن الرصيد خلال دقائق معدودة."}
                  </p>
               </div>

               <Button onClick={() => router.push("/home")} className="w-full h-20 rounded-full bg-[#002d4d] text-white font-black text-xl shadow-2xl active:scale-95 transition-all">
                  العودة للوحة القيادة
               </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-4 pt-10 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Sovereign Ledger v12.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
