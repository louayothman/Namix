
"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerPortal, 
  DrawerOverlay 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  Loader2, 
  ShieldCheck, 
  X,
  ImageIcon
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from 'html-to-image';

interface DepositShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAsset: any;
  selectedNetwork: any;
  walletAddress: string;
}

export function DepositShareDrawer({
  open,
  onOpenChange,
  selectedAsset,
  selectedNetwork,
  walletAddress
}: DepositShareDrawerProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const qrCodeUrl = walletAddress 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff&color=002d4d`
    : null;

  const generateImage = async () => {
    if (!shareCardRef.current || generating) return;
    setGenerating(true);
    setImgUrl(null);
    try {
      // انتظار كافٍ لضمان تحميل الباركود والأيقونات تماماً
      await new Promise(r => setTimeout(r, 1200));
      
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3, // دقة عالية جداً للتصدير
        fontEmbedCSS: '', 
        style: {
          fontFamily: "Tajawal, sans-serif",
        }
      });
      setImgUrl(dataUrl);
    } catch (err) {
      console.error("Failed to generate share image:", err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (open) {
      generateImage();
    }
  }, [open]);

  const handleDownload = () => {
    if (!imgUrl) return;
    setSaving(true);
    const link = document.createElement('a');
    link.download = `namix-deposit-${selectedAsset?.coin || 'address'}.png`;
    link.href = imgUrl;
    link.click();
    setTimeout(() => setSaving(false), 1000);
  };

  const handleNativeShare = async () => {
    if (!imgUrl || sharing) return;
    setSharing(true);
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], `deposit-address.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'صك إيداع معتمد',
          text: `عنوان إيداع ${selectedAsset?.coin} عبر شبكة ${selectedNetwork?.name || selectedAsset?.network}`
        });
      } else {
        handleDownload();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error("Share failed:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* الصك المالي المخفي للتصدير - هندسة تصميمية دقيقة */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none opacity-0">
        <div 
          ref={shareCardRef}
          className="w-[450px] bg-white p-12 flex flex-col items-center gap-10"
          style={{ fontFamily: "Tajawal, sans-serif" }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
            * { font-family: 'Tajawal', sans-serif !important; letter-spacing: normal !important; }
          `}} />

          {/* Top Right Header Node - Small & Precise */}
          <div className="flex flex-row-reverse items-center justify-start gap-4 w-full text-right" dir="rtl">
             <div className="h-12 w-12 flex items-center justify-center shrink-0">
                <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={40} />
             </div>
             <div className="space-y-0.5">
                <h2 className="text-xl font-black text-[#002d4d] leading-none" style={{ fontWeight: 900 }}>{selectedAsset?.name || selectedAsset?.coin}</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase leading-none">{selectedNetwork?.name || selectedAsset?.network}</p>
             </div>
          </div>

          {/* QR Code - Sharp Edges & Pure Center Icon */}
          <div className="flex justify-center w-full mt-4">
             {qrCodeUrl && (
               <div className="relative h-64 w-64 flex items-center justify-center bg-white">
                  <img src={qrCodeUrl} alt="QR" className="w-full h-full" style={{ imageRendering: 'pixelated' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-transparent flex items-center justify-center">
                        <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={32} />
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* Address Node - Centered Single Line */}
          <div className="space-y-3 w-full text-center">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">DEPOSIT ADDRESS</p>
             <div className="bg-gray-50 p-5 rounded-[20px] border border-gray-100 w-full flex items-center justify-center">
                <p className="text-[9.5px] font-mono font-black text-[#002d4d] whitespace-nowrap overflow-hidden text-center" dir="ltr">
                  {walletAddress}
                </p>
             </div>
          </div>

          {/* Signature Footer - Centered & Refined */}
          <div className="mt-auto pt-8 w-full space-y-5">
             <div className="h-[0.5px] w-full bg-gray-100" />
             <div className="flex flex-col items-center gap-3 opacity-40">
                <div className="flex items-center gap-4" dir="ltr">
                   <span className="text-[12px] font-black text-[#002d4d] uppercase" style={{ letterSpacing: '0.6em', marginRight: '-0.6em' }}>NAMIX</span>
                   <div className="grid grid-cols-2 gap-0.5">
                      <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
                      <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
                      <div className="h-1 w-1 rounded-full bg-[#f9a885]" />
                      <div className="h-1 w-1 rounded-full bg-[#002d4d]" />
                   </div>
                </div>
                <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Global Asset Ledger Node</span>
             </div>
          </div>
        </div>
      </div>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1100]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[65dvh] bg-white rounded-t-[48px] border-none shadow-2xl z-[1101] flex flex-col outline-none overflow-hidden font-body" dir="rtl">
            <DrawerHeader className="px-8 pt-6 border-b border-gray-50 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-3 text-right">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                     <ImageIcon size={20} />
                  </div>
                  <DrawerTitle className="text-lg font-black text-[#002d4d]">معاينة صك الإيداع</DrawerTitle>
               </div>
               <button onClick={() => onOpenChange(false)} className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-all"><X size={20} /></button>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center gap-8 scrollbar-none">
               <AnimatePresence mode="wait">
                 {generating || !imgUrl ? (
                   <motion.div 
                     key="loading"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center gap-4"
                   >
                      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جاري بناء الصك المالي...</p>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="preview"
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="relative group"
                   >
                      <div className="p-2 bg-gray-100 rounded-[36px] shadow-inner overflow-hidden">
                         <img 
                           src={imgUrl} 
                           className="w-full max-w-[200px] rounded-[28px] shadow-2xl border border-white/50" 
                           alt="Deposit Card" 
                         />
                      </div>
                      <div className="absolute inset-[-20px] bg-blue-500/5 rounded-full blur-[40px] -z-10" />
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="w-full max-w-[320px] grid grid-cols-2 gap-3 pb-8">
                  <Button 
                    onClick={handleDownload} 
                    disabled={!imgUrl || generating || saving}
                    className="h-14 rounded-[24px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Download size={18} className="text-[#f9a885]" />}
                    <span>حفظ</span>
                  </Button>
                  
                  <Button 
                    onClick={handleNativeShare} 
                    disabled={!imgUrl || generating || sharing}
                    className="h-14 rounded-[24px] bg-gray-100 hover:bg-gray-200 text-[#002d4d] font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {sharing ? <Loader2 className="animate-spin h-4 w-4" /> : <Share2 size={18} className="text-blue-500" />}
                    <span>مشاركة</span>
                  </Button>
               </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3 opacity-30 shrink-0">
               <ShieldCheck size={12} className="text-emerald-500" />
               <p className="text-[8px] font-black uppercase tracking-widest text-[#002d4d]">Secure Asset Verification Node</p>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}
