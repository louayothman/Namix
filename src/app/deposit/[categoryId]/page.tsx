"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { Icon } from "@iconify/react";
import { 
  ChevronLeft,
  Loader2, 
  Search,
  ArrowUpDown,
  X,
  Check,
  Star
} from "lucide-react";
import { getOrCreateUserWallet } from "@/app/actions/nowpayments-actions";
import { getBinanceDepositAddress, getBinanceCoinsConfig, verifyAndProcessBinanceDeposit } from "@/app/actions/binance-actions";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { AnimatePresence, motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Modular Step Components
import { AssetSelectionStep } from "@/components/deposit/steps/AssetSelectionStep";
import { NetworkSelectionStep } from "@/components/deposit/steps/NetworkSelectionStep";
import { ExecutionStep } from "@/components/deposit/steps/ExecutionStep";
import { SuccessStep } from "@/components/deposit/steps/SuccessStep";

interface DepositPageProps {
  params: Promise<{ categoryId: string }>;
}

type Step = "select_asset" | "select_network" | "execution" | "verifying" | "result";
type SortMode = 'popular' | 'name';

const NOWPAYMENTS_ASSETS = [
  { id: 'usdttrc20', name: 'Tether (TRC20)', coin: 'USDT', network: 'TRC20', icon: 'USDT' },
  { id: 'usdtbsc', name: 'Tether (BEP20)', coin: 'USDT', network: 'BEP20 (BSC)', icon: 'USDT' },
  { id: 'usdteth', name: 'Tether (ERC20)', coin: 'USDT', network: 'ERC20 (ETH)', icon: 'USDT' },
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

const NamixDotsIcon = () => (
  <div className="grid grid-cols-2 gap-1 scale-110">
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
  </div>
);

export default function CategoryDepositPage({ params }: DepositPageProps) {
  const { categoryId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  
  const [step, setStep] = useState<Step>("select_asset");
  const [loading, setLoading] = useState(false);
  const [binanceConfig, setBinanceConfig] = useState<any[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('popular');

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  
  const [walletAddress, setWalletAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dbUser, setDbUser] = useState<any>(null);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

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

  const filteredAssets = useMemo(() => {
    let list: any[] = [];
    if (category?.type === 'manual') {
      list = category?.portals?.filter((p: any) => p.isActive) || [];
    } else if (category?.type === 'nowpayments') {
      const assignedKeys = dbUser?.assignedWallets ? Object.keys(dbUser.assignedWallets) : [];
      list = NOWPAYMENTS_ASSETS.filter(a => assignedKeys.includes(a.id));
    } else if (category?.type === 'binance') {
      list = binanceConfig;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => (a.name || "").toLowerCase().includes(q) || (a.coin || "").toLowerCase().includes(q));
    }

    if (sortMode === 'name') {
      list = [...list].sort((a, b) => (a.name || a.coin || "").localeCompare(b.name || b.coin || ""));
    } else {
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
  }, [category, binanceConfig, searchQuery, sortMode, dbUser?.assignedWallets]);

  const handleAssetSelect = async (asset: any) => {
    if (!dbUser?.id) return;
    setError(null);
    setSelectedAsset(asset);
    if (category?.type === 'nowpayments') {
      setLoading(true);
      try {
        const res = await getOrCreateUserWallet(dbUser.id, asset.id);
        if (res.success) {
          setWalletAddress(res.address);
          setInstructions(`يرجى إرسال العملات إلى العنوان الموضح أعلاه عبر شبكة ${asset.network} فقط. تأكد من اختيار الشبكة الصحيحة؛ إرسال الأموال عبر شبكة غير مدعومة قد يؤدي إلى فقدانها نهائياً.`);
          setStep("execution");
        } else setError(res.error);
      } catch (e) { setError("خطأ في الاتصال."); } finally { setLoading(false); }
    } else if (category?.type === 'binance') setStep("select_network");
    else if (category?.type === 'manual') {
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
        setInstructions(`يرجى إرسال المبلغ إلى عنوان الاستلام الموضح أعلاه عبر شبكة ${network.name}. انتبه: إرسال الأموال عبر شبكة غير مطابقة قد يؤدي إلى فقدانها بشكل نهائي. يرجى تزويدنا بمعرف العملية (TXID) بعد الإرسال.`);
        setStep("execution");
      } else setError(res.error);
    } catch (e) { setError("خطأ في الاتصال."); } finally { setLoading(false); }
  };

  const handleFinalSubmit = async () => {
    if (!dbUser) return;
    setLoading(true);
    setError(null);
    
    if (category?.type === 'binance') {
      setStep("verifying");
      const res = await verifyAndProcessBinanceDeposit(dbUser.id, txid, selectedAsset.coin);
      if (res.success) {
        setSuccessData(res.data);
        setStep("result");
      } else {
        setError(res.error);
        setStep("result");
      }
      setLoading(false);
      return;
    }

    try {
      const methodName = category?.type === 'manual' 
        ? `${category?.name} - ${selectedAsset?.name}`
        : `${category?.name} (${selectedAsset?.coin || selectedAsset?.name})`;
      
      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: dbUser.id,
        userName: dbUser.displayName,
        amount: Number(amount),
        methodName,
        transactionId: txid || "AUTO_SYNC_PENDING",
        status: "pending",
        isAutoAudited: category?.type === 'nowpayments',
        createdAt: new Date().toISOString()
      });
      setStep("result");
    } catch (e) { setError("فشل إرسال البيانات."); } finally { setLoading(false); }
  };

  const handleClose = () => {
    router.push("/home");
  };

  if (loadingCat) return (
    <Shell>
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#002d4d] opacity-20" />
      </div>
    </Shell>
  );

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col min-h-screen bg-white font-body" dir="rtl">
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="shrink-0 flex items-center justify-center text-[#002d4d]">
                 {category?.type === 'binance' ? (
                   <Icon icon="cryptocurrency-color:bnb" width={32} height={32} />
                 ) : (
                   <NamixDotsIcon />
                 )}
              </div>
              <div className="text-right">
                 <h1 className="text-lg font-black text-[#002d4d] leading-none">{category?.name}</h1>
                 <div className="flex items-center gap-1.5 opacity-40 mt-1">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black uppercase tracking-widest leading-none">Operational Node Active</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
              {step === "select_asset" && (
                <>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <button className="h-9 px-3 rounded-xl flex items-center gap-2 text-gray-400 hover:text-[#002d4d] outline-none">
                            <ArrowUpDown size={14} />
                            <span className="text-[9px] font-black hidden sm:inline-block">فرز</span>
                         </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px] bg-white z-[1002]" dir="rtl">
                         <DropdownMenuItem onClick={() => setSortMode('popular')} className="font-black text-[10px] py-3 px-4 rounded-xl cursor-pointer justify-between">الأكثر شيوعاً {sortMode === 'popular' && <Star size={12} className="text-orange-400 fill-current" />}</DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setSortMode('name')} className="font-black text-[10px] py-3 px-4 rounded-xl cursor-pointer justify-between">الاسم (A-Z) {sortMode === 'name' && <Check size={12} className="text-blue-500" />}</DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                   <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={cn("h-9 w-9 rounded-xl flex items-center justify-center", isSearchOpen ? "text-[#002d4d]" : "text-gray-400")}>{isSearchOpen ? <X size={16}/> : <Search size={16}/>}</button>
                </>
              )}
              <button onClick={() => {
                if (step === "result") handleClose();
                else if (step === "execution") setStep(category?.type === 'binance' ? "select_network" : "select_asset");
                else if (step === "select_network") setStep("select_asset");
                else router.back();
              }} className="h-9 w-9 rounded-xl bg-transparent flex items-center justify-center text-[#002d4d]"><ChevronLeft size={18} /></button>
           </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full space-y-8 px-6 pt-8 pb-32">
          <AnimatePresence mode="wait">
            {step === "verifying" ? (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center py-24 gap-8"
              >
                 <div className="relative">
                    <div className="h-24 w-24 border-[4px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center"><Check className="h-8 w-8 text-[#002d4d] animate-pulse" /></div>
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-[#002d4d]">جاري مطابقة البيانات</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verifying transaction integrity...</p>
                 </div>
              </motion.div>
            ) : step === "select_asset" ? (
              <AssetSelectionStep key="a" filteredAssets={filteredAssets} onSelect={handleAssetSelect} loading={loading} selectedAsset={selectedAsset} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isSearchOpen={isSearchOpen} />
            ) : step === "select_network" ? (
              <NetworkSelectionStep key="n" selectedAsset={selectedAsset} onSelect={handleNetworkSelect} loading={loading} />
            ) : step === "execution" ? (
              <ExecutionStep key="e" instructions={instructions} walletAddress={walletAddress} loading={loading} amount={amount} setAmount={setAmount} txid={txid} setTxid={setTxid} onSubmit={handleFinalSubmit} error={error} categoryType={category?.type} selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} />
            ) : (
              <SuccessStep 
                key="r" 
                categoryType={category?.type} 
                successData={successData} 
                error={error}
                onBackHome={handleClose} 
                onRetry={() => { setError(null); setStep("execution"); }}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </Shell>
  );
}
