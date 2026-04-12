
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

import { BinanceCurrencyStep } from "@/components/deposit/categories/binance/BinanceCurrencyStep";
import { BinanceNetworkStep } from "@/components/deposit/categories/binance/BinanceNetworkStep";
import { BinanceExecutionStep } from "@/components/deposit/categories/binance/BinanceExecutionStep";

import { NowPaymentsCurrencyStep } from "@/components/deposit/categories/nowpayments/NowPaymentsCurrencyStep";
import { NowPaymentsExecutionStep } from "@/components/deposit/categories/nowpayments/NowPaymentsExecutionStep";

import { ManualCurrencyStep } from "@/components/deposit/categories/manual/ManualCurrencyStep";
import { ManualExecutionStep } from "@/components/deposit/categories/manual/ManualExecutionStep";

import { SuccessStep } from "@/components/deposit/steps/SuccessStep";

const NamixDotsIcon = () => (
  <div className="grid grid-cols-2 gap-1 scale-110">
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#f9a885]" />
    <div className="h-2 w-2 rounded-full bg-[#002d4d]" />
  </div>
);

const SovereignLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-6">
    <div className="relative">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="h-20 w-20 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full shadow-[0_0_20px_rgba(0,45,77,0.05)]"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <NamixDotsIcon />
      </div>
    </div>
  </div>
);

export default function CategoryDepositPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  
  const [step, setStep] = useState<string>("select_asset");
  const [loading, setLoading] = useState(false);
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
    if (category.type === 'binance' && binanceConfig.length === 0) {
      getBinanceCoinsConfig().then(res => { if (res.success) setBinanceConfig(res.coins); });
    }
    if (category.type === 'nowpayments' && npAvailableIds.length === 0) {
      getAvailableNowPaymentsCurrencies().then(res => { if (res.success) setNpAvailableIds(res.currencies); });
    }
  }, [category, binanceConfig.length, npAvailableIds.length]);

  const handleAssetSelect = async (asset: any) => {
    setSelectedAsset(asset);
    setSearchQuery("");
    setWalletAddress("");
    
    if (category?.type === 'nowpayments') {
      // مسار ناوبايمنتس: اختيار مباشر -> جلب العنوان -> تنفيذ
      setStep("execution");
      setLoading(true);
      const res = await createNowPayment(dbUser.id, asset.id, 10);
      if (res.success) setWalletAddress(res.address);
      else setError(res.error);
      setLoading(false);
    } else if (category?.type === 'binance') {
      setStep("select_network");
    } else {
      setWalletAddress(asset.walletAddress || "");
      setStep("execution");
    }
  };

  const handleNetworkSelect = async (network: any) => {
    setSelectedNetwork(network);
    setWalletAddress("");
    setStep("execution");
    setLoading(true);
    if (category?.type === 'binance') {
      const addrRes = await getBinanceDepositAddress(selectedAsset.coin, network.network);
      if (addrRes.success) setWalletAddress(addrRes.address);
      else setError(addrRes.error);
    }
    setLoading(false);
  };

  const handleFinalSubmit = async () => {
    if (!dbUser) return;
    setLoading(true);
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
        methodName: `${category?.name} - ${selectedAsset?.name || selectedAsset?.symbol || selectedAsset?.label}`,
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
    if (step === "execution") { 
      if (category?.type === 'nowpayments') setStep("select_asset");
      else setStep(category?.type === 'binance' ? "select_network" : "select_asset");
      return; 
    }
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
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={cn("h-9 w-9 rounded-xl flex items-center justify-center transition-all", isSearchOpen ? "text-[#002d4d] bg-white shadow-sm" : "text-gray-400")}>
                  {isSearchOpen ? <X size={16} /> : <Search size={16} />}
                </button>
              )}
              <button onClick={handleBack} className="h-9 w-9 rounded-xl flex items-center justify-center text-[#002d4d] active:scale-90 transition-all"><ChevronLeft size={18} /></button>
           </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full space-y-8 px-6 pt-8 pb-32">
          {isSearchOpen && step === "select_asset" && (
            <div className="pb-4">
              <div className="relative">
                <input autoFocus placeholder="ابحث عن العملة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-14 w-full rounded-[24px] bg-gray-50 border-none font-black text-xs px-12 text-right shadow-inner outline-none focus:ring-2 focus:ring-[#002d4d]/10 transition-all" />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {loading && step === "execution" ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SovereignLoader />
              </motion.div>
            ) : (
              <>
                {step === "select_asset" && (
                  <motion.div key="sa" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {category?.type === 'binance' ? <BinanceCurrencyStep assets={binanceConfig} onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} isSearchOpen={isSearchOpen} /> :
                    category?.type === 'nowpayments' ? <NowPaymentsCurrencyStep availableIds={npAvailableIds} onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} /> :
                    <ManualCurrencyStep portals={category?.portals || []} onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} />}
                  </motion.div>
                )}
                
                {step === "select_network" && (
                  <motion.div key="sn" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                    <BinanceNetworkStep selectedAsset={selectedAsset} onSelect={handleNetworkSelect} />
                  </motion.div>
                )}
                
                {step === "execution" && (
                  <motion.div key="ex" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {category?.type === 'binance' ? <BinanceExecutionStep selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} walletAddress={walletAddress} loading={loading} txid={txid} setTxid={setTxid} onSubmit={handleFinalSubmit} error={error} /> :
                    category?.type === 'nowpayments' ? <NowPaymentsExecutionStep selectedAsset={selectedAsset} walletAddress={walletAddress} loading={loading} /> :
                    <ManualExecutionStep selectedAsset={selectedAsset} loading={loading} amount={amount} setAmount={setAmount} txid={txid} setTxid={setTxid} onSubmit={handleFinalSubmit} error={error} />}
                  </motion.div>
                )}
                
                {step === "result" && (
                  <motion.div key="rs" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <SuccessStep categoryType={category?.type} successData={successData} error={error} onBackHome={() => router.push("/home")} onRetry={() => { setError(null); setStep("execution"); }} />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Shell>
  );
}
