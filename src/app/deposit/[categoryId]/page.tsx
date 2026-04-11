
"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { 
  ChevronRight, 
  Loader2, 
  Cpu, 
  Wallet, 
  Zap,
  Search,
  ArrowUpDown,
  X
} from "lucide-react";
import { getOrCreateUserWallet } from "@/app/actions/nowpayments-actions";
import { getBinanceDepositAddress, getBinanceCoinsConfig } from "@/app/actions/binance-actions";
import { cn } from "@/lib/utils";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Star, Check } from "lucide-react";

// Modular Step Components
import { AssetSelectionStep } from "@/components/deposit/steps/AssetSelectionStep";
import { NetworkSelectionStep } from "@/components/deposit/steps/NetworkSelectionStep";
import { ExecutionStep } from "@/components/deposit/steps/ExecutionStep";
import { SuccessStep } from "@/components/deposit/steps/SuccessStep";

interface DepositPageProps {
  params: Promise<{ categoryId: string }>;
}

type Step = "select_asset" | "select_network" | "execution" | "success";
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

  const filteredAssets = useMemo(() => {
    let list: any[] = [];
    if (category?.type === 'manual') {
      list = category?.portals?.filter((p: any) => p.isActive) || [];
    } 
    else if (category?.type === 'nowpayments') {
      const assignedKeys = dbUser?.assignedWallets ? Object.keys(dbUser.assignedWallets) : [];
      list = NOWPAYMENTS_ASSETS.filter(a => assignedKeys.includes(a.id));
    } 
    else if (category?.type === 'binance') {
      list = binanceConfig;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => 
        (a.name || "").toLowerCase().includes(q) || 
        (a.coin || "").toLowerCase().includes(q) ||
        (a.id || "").toLowerCase().includes(q)
      );
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
    if (!dbUser?.id) {
      setError("يرجى الانتظار حتى اكتمال تهيئة الجلسة...");
      return;
    }
    
    setError(null);
    setSelectedAsset(asset);
    
    if (category?.type === 'nowpayments') {
      setLoading(true);
      try {
        const res = await getOrCreateUserWallet(dbUser.id, asset.id);
        if (res.success) {
          setWalletAddress(res.address);
          setInstructions(`هذا العنوان هو هويتك المالية الدائمة لعملة ${asset.coin}. يرجى الإرسال عبر شبكة ${asset.network} حصراً. سيقوم النظام بإضافة الرصيد آلياً فور رصد العملية.`);
          setStep("execution");
        } else {
          setError(res.error || "تعذر توليد المحفظة حالياً.");
        }
      } catch (e) {
        setError("فشل الاتصال بمحرك المزامنة الآلي.");
      } finally {
        setLoading(false);
      }
    } else if (category?.type === 'binance') {
      setStep("select_network");
    } else if (category?.type === 'manual') {
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
        setInstructions(`يرجى إرسال المبلغ لعنوان الاستلام الموضح أعلاه عبر شبكة ${network.name}. بعد الإرسال، يجب إدخال الـ TXID فقط للتحقق الآلي من الميزانية وإضافة الرصيد.`);
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

  const handleFinalSubmit = async () => {
    if (!dbUser) return;
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
        <p className="text-[10px] font-black text-gray-300 uppercase animate-pulse">Initializing Secure Node...</p>
      </div>
    </Shell>
  );

  return (
    <Shell hideMobileNav>
      <div className="max-w-4xl mx-auto space-y-10 px-4 md:px-8 pt-8 pb-32 font-body text-right" dir="rtl">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-8">
           <div className="flex items-center gap-4 md:gap-6">
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-[28px] bg-[#002d4d] text-[#f9a885] flex items-center justify-center shadow-2xl shrink-0">
                 {category?.type === 'manual' ? <Wallet size={28}/> : category?.type === 'nowpayments' ? <Zap size={28} className="fill-current"/> : <Cpu size={28}/>}
              </div>
              <div className="space-y-1">
                 <h1 className="text-xl md:text-3xl font-black text-[#002d4d]">{category?.name}</h1>
                 <div className="flex items-center gap-2 opacity-40">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[8px] md:text-[9px] font-black uppercase">{category?.type?.toUpperCase()} Node Ready</p>
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
                            الاسم (A-Z) {sortMode === 'name' && <Check size={12} className="text-blue-50" />}
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
            <AssetSelectionStep 
              key="asset-step"
              filteredAssets={filteredAssets}
              onSelect={handleAssetSelect}
              loading={loading}
              selectedAsset={selectedAsset}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchOpen={isSearchOpen}
            />
          )}

          {step === "select_network" && (
            <NetworkSelectionStep 
              key="network-step"
              selectedAsset={selectedAsset}
              onSelect={handleNetworkSelect}
              loading={loading}
            />
          )}

          {step === "execution" && (
            <ExecutionStep 
              key="execution-step"
              instructions={instructions}
              walletAddress={walletAddress}
              loading={loading}
              amount={amount}
              setAmount={setAmount}
              txid={txid}
              setTxid={setTxid}
              onSubmit={handleFinalSubmit}
              error={error}
              categoryType={category?.type}
              copied={copied}
              handleCopy={handleCopy}
            />
          )}

          {step === "success" && (
            <SuccessStep 
              key="success-step"
              categoryType={category?.type}
              onBackHome={() => router.push("/home")}
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-4 pt-10 opacity-20 select-none">
           <p className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.8em]">Namix Ledger v12.0</p>
           <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (<div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-300" />))}
           </div>
        </div>
      </div>
    </Shell>
  );
}
