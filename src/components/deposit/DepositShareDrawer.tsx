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
  Image as ImageIcon
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
    try {
      await new Promise(r => setTimeout(r, 1200));
      
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        fontEmbedCSS: '', 
        style: {
          fontFamily: "'Tajawal', sans-serif",
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
      setImgUrl(null);
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
          title: 'عنوان الإيداع المعتمد',
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
      {/* الصك المالي المخفي للتصدير - هندسة تكنولوجية دقيقة */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none opacity-0">
        <div 
          ref={shareCardRef}
          className="w-[450px] bg-white p-12 flex flex-col gap-12"
          style={{ fontFamily: "'Tajawal', sans-serif" }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
            * { font-family: 'Tajawal', sans-serif !important; letter-spacing: normal !important; }
          `}} />

          {/* Top Right Header Node */}
          <div className="flex flex-row-reverse items-center justify-start gap-6 w-full text-right" dir="rtl">
             <div className="h-20 w-20 flex items-center justify-center shrink-0">
                <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={64} />
             </div>
             <div className="space-y-1">
                <h2 className="text-3xl font-black text-[#002d4d]" style={{ fontWeight: 900 }}>{selectedAsset?.name || selectedAsset?.coin}</h2>
                <p className="text-[12px] font-black text-gray-400 uppercase">{selectedNetwork?.name || selectedAsset?.network}</p>
             </div>
          </div>

          {/* QR Code - Direct on BG, No rounded corners */}
          <div className="flex justify-center w-full">
             {qrCodeUrl && (
               <div className="relative h-72 w-72 flex items-center justify-center bg-white">
                  <img src={qrCodeUrl} alt="QR" className="w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-white p-1 shadow-sm border border-gray-100">
                        <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={36} />
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* Address Node - Single Line Guarantee */}
          <div className="space-y-4 w-full text-right" dir="rtl">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-2">DEPOSIT ADDRESS</p>
             <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 w-full flex items-center justify-center overflow-hidden">
                <p className="text-[11px] font-mono font-black text-[#002d4d] whitespace-nowrap" dir="ltr">
                  {walletAddress}
                </p>
             </div>
          </div>

          {/* Signature Footer - Wide Separator & Letter Spacing */}
          <div className="mt-auto pt-10 w-full space-y-6">
             <div className="h-[0.5px] w-full bg-gray-100" />
             <div className="flex flex-row-reverse items-center justify-between opacity-40 px-2" dir="rtl">
                <div className="flex flex-row-reverse items-center gap-4">
                   <span className="text-[14px] font-black text-[#002d4d]" style={{ letterSpacing: '0.5em' }}>NAMIX</span>
                   <div className="grid grid-cols-2 gap-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                   </div>
                </div>
                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Global Asset Ledger</span>
             </div>
          </div>
        </div>
      </div>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/40 z-[1100]" />
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

            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-8 scrollbar-none">
               <div className="relative group">
                  <div className="p-3 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner overflow-hidden">
                     {imgUrl ? (
                       <motion.img 
                         initial={{ opacity: 0, scale: 0.95 }} 
                         animate={{ opacity: 1, scale: 1 }} 
                         src={imgUrl} 
                         className="w-full max-w-[200px] rounded-[32px] shadow-2xl" 
                         alt="Deposit Card" 
                       />
                     ) : (
                       <div className="w-[200px] h-[280px] flex flex-col items-center justify-center gap-4">
                          <Loader2 className="animate-spin text-blue-500" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جاري التوليد...</p>
                       </div>
                     )}
                  </div>
                  <div className="absolute inset-[-10px] bg-blue-500/5 rounded-full blur-[40px] -z-10" />
               </div>

               <div className="w-full max-w-[320px] grid grid-cols-2 gap-3 pb-8">
                  <Button 
                    onClick={handleDownload} 
                    disabled={!imgUrl || saving}
                    className="h-14 rounded-[24px] bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Download size={16} className="text-[#f9a885]" />}
                    <span>حفظ</span>
                  </Button>
                  
                  <Button 
                    onClick={handleNativeShare} 
                    disabled={!imgUrl || sharing}
                    className="h-14 rounded-[24px] bg-gray-100 hover:bg-gray-200 text-[#002d4d] font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {sharing ? <Loader2 className="animate-spin h-4 w-4" /> : <Share2 size={16} className="text-blue-500" />}
                    <span>مشاركة</span>
                  </Button>
               </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3 opacity-30 shrink-0">
               <ShieldCheck size={12} className="text-emerald-500" />
               <p className="text-[8px] font-black uppercase tracking-widest text-[#002d4d]">Secure Export Protocol</p>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}
