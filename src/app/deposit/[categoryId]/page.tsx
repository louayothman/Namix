
"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Icon } from "@iconify/react";
import { ChevronLeft, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvailableNowPaymentsCurrencies } from "@/app/actions/nowpayments-actions";
import { getBinanceCoinsConfig, getBinanceDepositAddress, verifyAndProcessBinanceDeposit } from "@/app/actions/binance-actions";
import { createNowPayment } from "@/app/actions/nowpayments-actions";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { AnimatePresence, motion } from "framer-motion";

// Categorized Modular Steps (Dumb Components now, just props)
import { BinanceCurrencyStep } from "@/components/deposit/categories/binance/BinanceCurrencyStep";
import { BinanceNetworkStep } from "@/components/deposit/categories/binance/BinanceNetworkStep";
import { BinanceExecutionStep } from "@/components/deposit/categories/binance/BinanceExecutionStep";

import { NowPaymentsCurrencyStep } from "@/components/deposit/categories/nowpayments/NowPaymentsCurrencyStep";
import { NowPaymentsNetworkStep } from "@/components/deposit/categories/nowpayments/NowPaymentsNetworkStep";
import { NowPaymentsExecutionStep } from "@/components/deposit/categories/nowpayments/NowPaymentsExecutionStep";

import { ManualCurrencyStep } from "@/components/deposit/categories/manual/ManualCurrencyStep";
import { ManualExecutionStep } from "@/components/deposit/categories/manual/ManualExecutionStep";

import { SuccessStep } from "@/components/deposit/steps/SuccessStep";

interface DepositPageProps {
  params: Promise<{ categoryId: string }>;
}

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
  
  const [step, setStep] = useState<string>("select_asset");
  const [loading, setLoading] = useState(false);
  
  // Data Cache - Pre-fetched
  const [binanceConfig, setBinanceConfig] = useState<any[]>([]);
  const [npAvailableIds, setNpAvailableIds] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  
  const [walletAddress, setWalletAddress] = useState("");
  const [dbUser, setDbUser] = useState<any>(null);
  const [txid, setTxid] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const categoryRef = useMemoFirebase(() => doc(db, "deposit_methods", categoryId), [db, categoryId]);
  const { data: category } = useDoc(categoryRef);

  // 1. Initial Session & Pre-fetch Data
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
    if (!category) return;
    
    // جلب بيانات بينانس مسبقاً بصمت
    if (category.type === 'binance' && binanceConfig.length === 0) {
      getBinanceCoinsConfig().then(res => { if (res.success) setBinanceConfig(res.coins); });
    }
    
    // جلب شبكات ناوبايمنتس مسبقاً بصمت
    if (category.type === 'nowpayments' && npAvailableIds.length === 0) {
      getAvailableNowPaymentsCurrencies().then(res => { if (res.success) setNpAvailableIds(res.currencies); });
    }
  }, [category, binanceConfig.length, npAvailableIds.length]);

  // 2. Navigation Logic
  const handleAssetSelect = (asset: any) => {
    setSelectedAsset(asset);
    setSearchQuery("");
    setWalletAddress("");
    if (category?.type === 'binance' || category?.type === 'nowpayments') setStep("select_network");
    else {
      setWalletAddress(asset.walletAddress || "");
      setStep("execution");
    }
  };

  const handleNetworkSelect = async (network: any) => {
    setSelectedNetwork(network);
    setWalletAddress(""); // تصفير العنوان القديم فوراً
    setStep("execution");
    setLoading(true);
    setError(null);

    try {
      if (category?.type === 'binance') {
        const addrRes = await getBinanceDepositAddress(selectedAsset.coin, network.network);
        if (addrRes.success) setWalletAddress(addrRes.address);
        else setError(addrRes.error);
      } else if (category?.type === 'nowpayments') {
        const res = await createNowPayment(dbUser.id, network.id, 10);
        if (res.success) setWalletAddress(res.address);
        else setError(res.error);
      }
    } catch (e) {
      setError("فشل في مزامنة العنوان.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!dbUser) return;
    setLoading(true);
    setError(null);
    
    if (category?.type === 'binance') {
      const res = await verifyAndProcessBinanceDeposit(dbUser.id, txid, selectedAsset.coin);
      if (res.success) setSuccessData(res.data);
      else setError(res.error);
      setStep("result");
      setLoading(false);
      return;
    }

    try {
      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: dbUser.id, userName: dbUser.displayName, amount: Number(amount),
        methodName: `${category?.name} - ${selectedAsset?.name || selectedAsset?.symbol}`,
        transactionId: txid || "MANUAL_REVIEW_PENDING",
        status: "pending", createdAt: new Date().toISOString()
      });
      setStep("result");
    } catch (e) { setError("فشل إرسال البيانات."); } finally { setLoading(false); }
  };

  const handleBack = () => {
    setError(null);
    setWalletAddress("");
    setTxid("");
    if (step === "result") { router.push("/home"); return; }
    if (step === "execution") { setStep("select_network"); return; }
    if (step === "select_network") { setStep("select_asset"); return; }
    router.back();
  };

  return (
    <Shell hideMobileNav>
      <div className="flex flex-col min-h-screen bg-white font-body" dir="rtl">
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="shrink-0 flex items-center justify-center text-[#002d4d]">
                 {category?.type === 'binance' ? <Icon icon="cryptocurrency-color:bnb" width={32} height={32} /> : <NamixDotsIcon />}
              </div>
              <div className="text-right">
                 <h1 className="text-lg font-black text-[#002d4d] leading-none">{category?.name}</h1>
                 <div className="flex items-center gap-1.5 opacity-40 mt-1"><div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[7px] font-black uppercase">Direct Sync</span></div>
              </div>
           </div>
           <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
              {step === "select_asset" && (
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={cn("h-9 w-9 rounded-xl flex items-center justify-center bg-transparent transition-all", isSearchOpen ? "text-[#002d4d] bg-white shadow-sm" : "text-gray-400")}>
                  {isSearchOpen ? <X size={16} /> : <Search size={16} />}
                </button>
              )}
              <button onClick={handleBack} className="h-9 w-9 rounded-xl bg-transparent flex items-center justify-center text-[#002d4d] active:scale-90 transition-all"><ChevronLeft size={18} /></button>
           </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full space-y-8 px-6 pt-8 pb-32">
          {isSearchOpen && step === "select_asset" && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden pb-4">
              <div className="relative">
                <input 
                  autoFocus
                  placeholder="ابحث عن العملة..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-14 w-full rounded-[24px] bg-gray-50 border-none font-black text-xs px-12 text-right shadow-inner focus:ring-2 focus:ring-[#002d4d]/10 transition-all outline-none"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === "select_asset" && (
              <div key="sa" className="animate-in fade-in duration-500">
                {category?.type === 'binance' ? <BinanceCurrencyStep assets={binanceConfig} onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} isSearchOpen={isSearchOpen} /> :
                category?.type === 'nowpayments' ? <NowPaymentsCurrencyStep onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} /> :
                <ManualCurrencyStep portals={category?.portals || []} onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} />}
              </div>
            )}
            
            {step === "select_network" && (
              <div key="sn" className="animate-in fade-in duration-500">
                {category?.type === 'nowpayments' ? <NowPaymentsNetworkStep selectedAsset={selectedAsset} onSelect={handleNetworkSelect} availableIds={npAvailableIds} /> :
                <BinanceNetworkStep selectedAsset={selectedAsset} onSelect={handleNetworkSelect} />}
              </div>
            )}
            
            {step === "execution" && (
              <div key="ex" className="animate-in fade-in duration-500">
                {category?.type === 'binance' ? <BinanceExecutionStep selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} walletAddress={walletAddress} loading={loading} txid={txid} setTxid={setTxid} onSubmit={handleFinalSubmit} error={error} /> :
                category?.type === 'nowpayments' ? <NowPaymentsExecutionStep selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} walletAddress={walletAddress} loading={loading} /> :
                <ManualExecutionStep selectedAsset={selectedAsset} loading={loading} amount={amount} setAmount={setAmount} txid={txid} setTxid={setTxid} onSubmit={handleFinalSubmit} error={error} />}
              </div>
            )}
            
            {step === "result" && (
              <div key="rs" className="animate-in fade-in duration-500">
                <SuccessStep categoryType={category?.type} successData={successData} error={error} onBackHome={() => router.push("/home")} onRetry={() => { setError(null); setStep("execution"); }} />
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Shell>
  );
}
