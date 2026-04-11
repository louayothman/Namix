
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  Loader2, 
  Check, 
  Copy, 
  Coins, 
  Hash, 
  ShieldCheck, 
  AlertCircle, 
  ClipboardPaste,
  ChevronLeft,
  Share2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CryptoIcon } from "@/lib/crypto-icons";
import { cn } from "@/lib/utils";
import * as htmlToImage from 'html-to-image';

interface ExecutionStepProps {
  instructions: string;
  walletAddress: string;
  loading: boolean;
  amount: string;
  setAmount: (val: string) => void;
  txid: string;
  setTxid: (val: string) => void;
  onSubmit: () => void;
  error: string | null;
  categoryType: string;
  selectedAsset?: any;
  selectedNetwork?: any;
}

/**
 * @fileOverview وحدة التنفيذ النهائية v18.0 - Image Share Edition
 * تم دمج محرك توليد الصور لمشاركة بيانات الإيداع كملف PNG احترافي.
 */
export function ExecutionStep({
  instructions,
  walletAddress,
  loading,
  amount,
  setAmount,
  txid,
  setTxid,
  onSubmit,
  error,
  categoryType,
  selectedAsset,
  selectedNetwork
}: ExecutionStepProps) {
  const isBinance = categoryType === 'binance';
  const isNowPayments = categoryType === 'nowpayments';

  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  
  const shareCardRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        setCopyStatus("تم نسخ العنوان بنجاح");
        setTimeout(() => setCopyStatus(null), 2000);
      })
      .catch(() => {
        setCopyStatus("فشل في نسخ العنوان");
        setTimeout(() => setCopyStatus(null), 2000);
      });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTxid(text);
        setPasteStatus("تم اللصق بنجاح");
        setTimeout(() => setPasteStatus(null), 2000);
      }
    } catch (err) {
      setPasteStatus("فشل في قراءة الحافظة");
      setTimeout(() => setPasteStatus(null), 2000);
    }
  };

  const handleShare = async () => {
    if (!walletAddress || !shareCardRef.current || sharing) return;
    
    setSharing(true);
    try {
      // 1. توليد الصورة من العنصر المخفي
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });

      // 2. تحويل الصورة إلى ملف قابل للمشاركة
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `deposit-${selectedAsset?.coin || 'address'}.png`, { type: 'image/png' });

      // 3. استدعاء قائمة المشاركة الأصلية
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `عنوان إيداع ${selectedAsset?.coin}`,
          text: `تم استخراج هذا العنوان عبر منصة ناميكس.`
        });
      } else {
        // Fallback للتحميل إذا كانت المشاركة غير مدعومة (مثل المتصفحات المكتبية)
        const link = document.createElement('a');
        link.download = `deposit-${selectedAsset?.coin}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Share Execution Failed", err);
      }
    } finally {
      setSharing(false);
    }
  };

  const qrCodeUrl = walletAddress 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff&color=002d4d`
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }} 
      className="w-full space-y-8 font-body text-right relative" 
      dir="rtl"
    >
      {/* --- HIDDEN SHARE CARD (For Image Generation) --- */}
      <div className="fixed left-[-9999px] top-[-9999px]">
        <div 
          ref={shareCardRef}
          className="w-[400px] bg-white p-10 flex flex-col items-center gap-8 text-center"
          style={{ fontFamily: 'Tajawal, sans-serif' }}
        >
          <div className="flex flex-col items-center gap-4">
             <div className="h-20 w-20 flex items-center justify-center">
                <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={64} />
             </div>
             <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#002d4d] tracking-tight">{selectedAsset?.name || selectedAsset?.coin}</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{selectedNetwork?.name || selectedAsset?.network}</p>
             </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-[32px] border border-gray-100">
             {qrCodeUrl && <img src={qrCodeUrl} alt="QR" className="w-56 h-56 rounded-xl" />}
          </div>

          <div className="space-y-3 w-full">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deposit Address</p>
             <div className="bg-gray-50 p-5 rounded-[24px] border border-gray-100">
                <p className="text-xs font-mono font-black text-[#002d4d] break-all leading-relaxed" dir="ltr">{walletAddress}</p>
             </div>
          </div>

          <div className="mt-4 pt-6 border-t border-gray-100 w-full flex items-center justify-center gap-3 opacity-40">
             <div className="h-6 w-6 rounded-lg bg-[#002d4d] flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                   <div className="h-1 w-1 rounded-full bg-white" />
                   <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
                   <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
                   <div className="h-1 w-1 rounded-full bg-white" />
                </div>
             </div>
             <span className="text-[10px] font-black text-[#002d4d] uppercase tracking-[0.4em]">NAMIX NETWORK</span>
          </div>
        </div>
      </div>

      {/* --- VISUAL UI --- */}
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
         <div className="text-center space-y-2">
            <div className="h-16 w-16 mx-auto flex items-center justify-center mb-2">
               <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={56} />
            </div>
            <h3 className="text-xl font-black text-[#002d4d] leading-none">
              {selectedAsset?.name || selectedAsset?.coin}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">
              {selectedNetwork?.name || selectedAsset?.network}
            </p>
         </div>

         <div className="relative group">
            <div className="relative p-6 bg-white rounded-[44px] border border-gray-100 shadow-inner transition-transform duration-700">
               {qrCodeUrl ? (
                 <div className="relative h-48 w-48 md:h-56 md:w-56 flex items-center justify-center">
                    <img src={qrCodeUrl} alt="QR" className="w-full h-full rounded-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-white p-1.5 rounded-xl shadow-lg border border-gray-100">
                          <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={28} />
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="h-48 w-48 md:h-56 md:w-56 flex items-center justify-center bg-gray-50 rounded-2xl">
                    <Loader2 className="animate-spin text-gray-200" />
                 </div>
               )}
            </div>
            <motion.div 
              animate={{ opacity: [0.02, 0.05, 0.02] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-[-20px] bg-blue-500 rounded-full blur-[60px] -z-10"
            />
         </div>
      </div>

      <div className="w-full space-y-6">
         <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
               <p className="flex-1 font-mono text-[9px] md:text-[10px] font-black text-[#002d4d] break-all text-center leading-relaxed opacity-80" dir="ltr">
                 {loading && !walletAddress ? "جاري جلب العنوان..." : walletAddress}
               </p>
               <button 
                 onClick={handleCopy} 
                 disabled={!walletAddress}
                 className="h-10 w-10 flex items-center justify-center text-gray-300 hover:text-[#002d4d] transition-all active:scale-90 shrink-0"
               >
                 {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
               </button>
            </div>
            <AnimatePresence>
              {copyStatus && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[9px] font-black text-emerald-500">{copyStatus}</motion.p>
              )}
            </AnimatePresence>
         </div>

         <Button 
           onClick={handleShare}
           disabled={!walletAddress || sharing}
           variant="ghost"
           className="w-full h-14 rounded-full bg-gray-50 text-gray-400 hover:bg-[#002d4d] hover:text-[#f9a885] font-black text-[10px] gap-3 transition-all active:scale-[0.98] group"
         >
            {sharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} className="group-hover:rotate-12 transition-transform" />}
            <span>مشاركة عنوان الإيداع</span>
         </Button>
      </div>

      <div className="p-6 bg-blue-50/40 rounded-[32px] border border-blue-100/50 space-y-2 animate-in fade-in duration-1000">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Info size={14} />
          <h4 className="text-[10px] font-black uppercase">توجيهات الإيداع</h4>
        </div>
        <p className="text-[11px] font-bold leading-[2] text-blue-800/70">{instructions.replace(/أدناه/g, "أعلاه")}</p>
      </div>

      {isBinance && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-500">
          <div className="flex items-center justify-between px-4">
             <Label className="text-[9px] font-black text-gray-400 uppercase">إثبات الإرسال</Label>
             <Badge className="bg-orange-50 text-orange-600 border-none font-black text-[7px] px-2 py-0.5 rounded-full">Binance Sync</Badge>
          </div>
          <div className="relative">
            <div className="relative flex items-center h-[72px] bg-white rounded-[32px] border border-gray-100 shadow-xl transition-all hover:border-[#002d4d]">
              <Input 
                value={txid} 
                onChange={e => setTxid(e.target.value)} 
                className="h-full w-full bg-transparent border-none font-mono text-[10px] font-black px-14 text-center shadow-none focus-visible:ring-0" 
                placeholder="ألصق معرف العملية (TXID) هنا..." 
              />
              <Hash className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
              <button 
                onClick={handlePaste}
                type="button"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-[#f9a885] hover:bg-[#002d4d] hover:text-white transition-all active:scale-90"
              >
                <ClipboardPaste size={18} />
              </button>
            </div>
            <AnimatePresence>
              {pasteStatus && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -bottom-5 right-6 text-[9px] font-black text-emerald-500">{pasteStatus}</motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {!isNowPayments && !isBinance && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-500">
          <Label className="text-[9px] font-black text-gray-400 uppercase pr-4">المبلغ المودع ($)</Label>
          <div className="relative">
            <Input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              className="h-[72px] rounded-[32px] bg-white border border-gray-100 font-black text-center text-2xl text-emerald-600 shadow-xl tabular-nums" 
              placeholder="0.00" 
            />
            <Coins size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-100" />
          </div>
        </div>
      )}

      {isNowPayments && (
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <button 
            onClick={() => window.location.href = '/home'}
            className="w-full h-20 rounded-[40px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl relative overflow-hidden group transition-all active:scale-[0.98]"
          >
            <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-[0.05] group-hover:opacity-[0.12] transition-all duration-1000 pointer-events-none text-[#f9a885]">
               <ShieldCheck size={140} strokeWidth={1.5} />
            </div>
            <div className="relative z-10 flex items-center justify-center gap-4">
               <span>العودة للرئيسية</span>
               <ChevronLeft className="h-6 w-6 text-[#f9a885] group-hover:-translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-[24px] border border-red-100 flex items-center gap-3 text-red-600">
          <AlertCircle size={16} />
          <p className="text-[10px] font-black">{error}</p>
        </div>
      )}

      {!isNowPayments && (
        <Button 
          onClick={onSubmit} 
          disabled={loading || (!isBinance && !amount) || (isBinance && !txid)} 
          className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all group"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
            <div className="flex items-center gap-3">
              <span>تأكيد الإرسال</span>
              <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
            </div>
          )}
        </Button>
      )}

      <div className="flex items-center justify-center gap-4 opacity-[0.15] select-none pt-2">
         <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-[#002d4d]" />
            <span className="text-[7px] font-black uppercase text-[#002d4d]">اتصال مؤمن</span>
         </div>
         <div className="h-1 w-1 rounded-full bg-gray-300" />
         <div className="flex items-center gap-1.5">
            <Sparkles size={10} className="text-[#f9a885]" />
            <span className="text-[7px] font-black uppercase text-[#002d4d]">نظام ناميكس الرسمي</span>
         </div>
      </div>
    </motion.div>
  );
}
