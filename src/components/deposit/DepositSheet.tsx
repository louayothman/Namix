
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
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
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
  Activity
} from "lucide-react";
import { getOrCreateUserWallet } from "@/app/actions/nowpayments-actions";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DepositSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "select_currency" | "address_view";

const SUPPORTED_ASSETS = [
  { id: "usdttrc20", label: "USDT (TRC20)", icon: "USDT", color: "text-emerald-500" },
  { id: "btc", label: "Bitcoin", icon: "BTC", color: "text-orange-500" },
  { id: "eth", label: "Ethereum", icon: "ETH", color: "text-blue-500" },
  { id: "trx", label: "TRON", icon: "TRX", color: "text-red-500" }
];

export function DepositSheet({ open, onOpenChange }: DepositSheetProps) {
  const [step, setStep] = useState<Step>("select_currency");
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);
  
  const db = useFirestore();

  useEffect(() => {
    const session = localStorage.getItem("namix_user");
    if (session && open) {
      const parsed = JSON.parse(session);
      const unsub = onSnapshot(doc(db, "users", parsed.id), (snap) => {
        if (snap.exists()) setDbUser(snap.data());
      });
      return () => unsub();
    }
  }, [open, db]);

  const handleSelectCurrency = async (asset: any) => {
    setSelectedCurrency(asset);
    setLoading(true);
    try {
      if (!dbUser?.id) return;
      const res = await getOrCreateUserWallet(dbUser.id, asset.id);
      if (res.success) {
        setWalletAddress(res.address);
        setStep("address_view");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("select_currency");
      setSelectedCurrency(null);
      setWalletAddress("");
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
                 <DrawerTitle className="text-base font-black text-[#002d4d]">شحن الرصيد الآلي</DrawerTitle>
                 <p className="text-gray-400 font-black text-[7px] uppercase tracking-widest mt-1">Autonomous Inflow</p>
               </div>
            </div>
            {step === "address_view" && (
              <button onClick={() => setStep("select_currency")} className="rounded-full h-7 px-3 bg-gray-50 text-gray-400 font-black text-[8px] border border-gray-100 active:scale-95 transition-all flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" /> تغيير العملة
              </button>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-none space-y-6">
            
            {step === "select_currency" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 text-right">
                <div className="p-5 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex items-start gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <Cpu className="h-5 w-5 text-blue-600" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-black text-[#002d4d]">نظام العناوين الدائمة</p>
                      <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">
                        اختر العملة المفضلة لتوليد محفظة خاصة بك. أي مبالغ تصل لهذا العنوان سيتم إضافتها لحسابك فوراً وتلقائياً.
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {SUPPORTED_ASSETS.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleSelectCurrency(asset)}
                      disabled={loading}
                      className="p-6 rounded-[40px] border border-gray-50 bg-white hover:border-[#002d4d] hover:shadow-xl transition-all duration-500 flex flex-col items-center gap-3 group active:scale-[0.98]"
                    >
                      {loading && selectedCurrency?.id === asset.id ? (
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      ) : (
                        <div className={cn("h-12 w-12 rounded-[20px] bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-[#002d4d] transition-all", asset.color)}>
                          <CryptoIcon name={asset.icon} size={24} />
                        </div>
                      )}
                      <p className="font-black text-[11px] text-[#002d4d]">{asset.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "address_view" && selectedCurrency && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-right">
                
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="h-20 w-20 rounded-[32px] bg-gray-50 flex items-center justify-center shadow-inner relative">
                      <CryptoIcon name={selectedCurrency.icon} size={40} className={selectedCurrency.color} />
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                         <ShieldCheck size={12} className="text-white fill-white" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-[#002d4d]">محفظة {selectedCurrency.label} الخاصة بك</h3>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] px-3 py-1 rounded-full uppercase animate-pulse">Waiting for Payment</Badge>
                   </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner space-y-4">
                   <div className="space-y-2">
                      <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pr-2">Your Personal Deposit Address</Label>
                      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-3">
                         <div className="flex-1 font-mono text-[11px] font-black text-[#002d4d] break-all text-left leading-relaxed" dir="ltr">
                            {walletAddress}
                         </div>
                         <Button onClick={handleCopy} className="h-12 w-12 rounded-2xl bg-[#002d4d] text-[#f9a885] shadow-xl shrink-0 active:scale-90 transition-all">
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                         </Button>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3 px-2">
                      <Info size={14} className="text-blue-500 shrink-0" />
                      <p className="text-[10px] font-bold text-gray-400 leading-relaxed">
                        هذا العنوان ثابت لك؛ يمكنك استخدامه في أي وقت لشحن رصيدك دون الحاجة لفتح هذه النافذة مجدداً.
                      </p>
                   </div>
                </div>

                <div className="p-6 bg-blue-50/50 rounded-[40px] border border-blue-100 flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600"><Zap size={20} className="fill-current" /></div>
                      <div className="text-right">
                         <p className="text-[11px] font-black text-[#002d4d]">المزامنة اللحظية (Webhook)</p>
                         <p className="text-[9px] font-bold text-blue-800/60">سيتم إضافة الرصيد فور تأكيد البلوكشين.</p>
                      </div>
                   </div>
                   <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-full w-1/3 bg-blue-500 rounded-full"
                      />
                   </div>
                </div>

                <Button onClick={handleClose} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all">
                   إغلاق والعودة
                </Button>
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
                   <span className="text-[8px] font-black uppercase text-[#002d4d]">NOWPayments Verified</span>
                </div>
             </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
