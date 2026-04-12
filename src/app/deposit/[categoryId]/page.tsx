
"use client";

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { useFirestore, useMemoFirebase, useDoc } from "@/firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { Icon } from "@iconify/react";
import { ChevronLeft, Loader2, Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createNowPayment } from "@/app/actions/nowpayments-actions";
import { getBinanceDepositAddress, getBinanceCoinsConfig, verifyAndProcessBinanceDeposit } from "@/app/actions/binance-actions";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { AnimatePresence, motion } from "framer-motion";

// Categorized Modular Steps
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

type Step = "select_asset" | "select_network" | "execution" | "verifying" | "result";

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

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  
  const [walletAddress, setWalletAddress] = useState("");
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
      getBinanceCoinsConfig().then(res => { if (res.success) setBinanceConfig(res.coins); });
    }
  }, [category, binanceConfig.length]);

  const handleAssetSelect = async (asset: any) => {
    setSelectedAsset(asset);
    if (category?.type === 'binance' || category?.type === 'nowpayments') setStep("select_network");
    else setStep("execution");
  };

  const handleNetworkSelect = async (network: any) => {
    setSelectedNetwork(network);
    setLoading(true);
    setError(null);

    if (category?.type === 'binance') {
      const addrRes = await getBinanceDepositAddress(selectedAsset.coin, network.network);
      if (addrRes.success) {
        setWalletAddress(addrRes.address);
        setStep("execution");
      } else {
        setError(addrRes.error);
      }
    } else if (category?.type === 'nowpayments') {
      // Automatic Generation for NowPayments - Silent without text
      const res = await createNowPayment(dbUser.id, network.id, 10);
      if (res.success) {
        setWalletAddress(res.address);
        setStep("execution");
      } else {
        setError(res.error);
      }
    }
    setLoading(false);
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

    // Manual Logic
    try {
      await addDocumentNonBlocking(collection(db, "deposit_requests"), {
        userId: dbUser.id, userName: dbUser.displayName, amount: Number(amount),
        methodName: `${category?.name} - ${selectedAsset?.name}`,
        transactionId: txid || "MANUAL_REVIEW_PENDING",
        status: "pending", createdAt: new Date().toISOString()
      });
      setStep("result");
    } catch (e) { setError("فشل إرسال البيانات."); } finally { setLoading(false); }
  };

  const handleBack = () => {
    if (step === "result") { router.push("/home"); return; }
    if (step === "execution") { setStep("select_network"); return; }
    if (step === "select_network") { setStep("select_asset"); return; }
    router.back();
  };

  if (loadingCat) return <Shell><div className="h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-[#002d4d]" /></div></Shell>;

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
                 <div className="flex items-center gap-1.5 opacity-40 mt-1"><div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[7px] font-black uppercase">Active Protocol</span></div>
              </div>
           </div>
           <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-2xl border border-gray-100">
              {step === "select_asset" && (
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={cn("h-9 w-9 rounded-xl flex items-center justify-center bg-transparent", isSearchOpen ? "text-[#002d4d]" : "text-gray-400")}>{isSearchOpen ? <X size={16} /> : <Search size={16} />}</button>
              )}
              <button onClick={handleBack} className="h-9 w-9 rounded-xl bg-transparent flex items-center justify-center text-[#002d4d]"><ChevronLeft size={18} /></button>
           </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full space-y-8 px-6 pt-8 pb-32">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center py-24 gap-8">
                 <div className="relative">
                    <div className="h-20 w-20 border-[3px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center"><Check className="h-6 w-6 text-[#002d4d] animate-pulse" /></div>
                 </div>
                 {/* No Text for NowPayments per user request */}
                 {category?.type !== 'nowpayments' && <p className="text-xl font-black text-[#002d4d]">جاري تهيئة القناة...</p>}
              </motion.div>
            ) : step === "verifying" ? (
              <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center py-24 gap-8">
                 <div className="relative"><div className="h-24 w-24 border-[4px] border-gray-100 border-t-[#002d4d] rounded-full animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><Check className="h-8 w-8 text-[#002d4d] animate-pulse" /></div></div>
                 <p className="text-xl font-black text-[#002d4d]">جاري مطابقة البيانات...</p>
              </motion.div>
            ) : step === "select_asset" ? (
              category?.type === 'binance' ? <BinanceCurrencyStep assets={binanceConfig} onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} isSearchOpen={isSearchOpen} /> :
              category?.type === 'nowpayments' ? <NowPaymentsCurrencyStep onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} /> :
              <ManualCurrencyStep portals={category?.portals || []} onSelect={handleAssetSelect} loading={loading} searchQuery={searchQuery} />
            ) : step === "select_network" ? (
              category?.type === 'nowpayments' ? <NowPaymentsNetworkStep selectedAsset={selectedAsset} onSelect={handleNetworkSelect} loading={loading} /> :
              <BinanceNetworkStep selectedAsset={selectedAsset} onSelect={handleNetworkSelect} loading={loading} />
            ) : step === "execution" ? (
              category?.type === 'binance' ? <BinanceExecutionStep selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} walletAddress={walletAddress} loading={loading} txid={txid} setTxid={setTxid} onSubmit={handleFinalSubmit} error={error} /> :
              category?.type === 'nowpayments' ? <NowPaymentsExecutionStep selectedAsset={selectedAsset} selectedNetwork={selectedNetwork} walletAddress={walletAddress} loading={loading} onSubmit={handleFinalSubmit} error={error} /> :
              <ManualExecutionStep selectedAsset={selectedAsset} loading={loading} amount={amount} setAmount={setAmount} txid={txid} setTxid={setTxid} onSubmit={handleFinalSubmit} error={error} />
            ) : (
              <SuccessStep categoryType={category?.type} successData={successData} error={error} onBackHome={() => router.push("/home")} onRetry={() => { setError(null); setStep("execution"); }} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </Shell>
  );
}
