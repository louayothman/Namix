"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerPortal, 
  DrawerOverlay,
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  Loader2, 
  ShieldCheck, 
  Sparkles
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { motion, AnimatePresence } from "framer-motion";
import * as htmlToImage from 'html-to-image';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

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
      // إيقاف مؤقت محسوب لضمان استقرار تحميل الباركود والأيقونات
      await new Promise(r => setTimeout(r, 1500));
      
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 3,
        fontEmbedCSS: '', 
        style: {
          fontFamily: "'TajawalLocal', 'CairoLocal', sans-serif",
        }
      });
      setImgUrl(dataUrl);
    } catch (err) {
      console.error("Capture Logic Fail:", err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (open) {
      generateImage();
    }
  }, [open, walletAddress]);

  const handleDownload = () => {
    if (!imgUrl) return;
    setSaving(true);
    const link = document.createElement('a');
    link.download = `namix-${selectedAsset?.coin || 'deposit'}.png`;
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
      const file = new File([blob], `deposit.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'عنوان الإيداع',
          text: `عنوان إيداع ${selectedAsset?.coin}`
        });
      } else {
        handleDownload();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error("Share fail:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      {/* صك الإيداع النخبوي - تصميم مجهري نقي ومستقر */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none opacity-0">
        <div 
          ref={shareCardRef}
          className="w-[450px] bg-white p-12 flex flex-col items-center gap-12"
          style={{ fontFamily: "'TajawalLocal', 'CairoLocal', sans-serif" }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @font-face {
              font-family: 'TajawalLocal';
              src: url('/fonts/Tajawal.ttf') format('truetype');
              font-weight: normal;
            }
            @font-face {
              font-family: 'CairoLocal';
              src: url('/fonts/cairo.ttf') format('truetype');
              font-weight: normal;
            }
            * { letter-spacing: normal !important; }
            .font-ar { font-family: 'TajawalLocal', sans-serif !important; }
            .font-en { font-family: 'CairoLocal', sans-serif !important; }
          `}} />

          {/* الهوية العلوية - أقصى اليمين بنقاء تام */}
          <div className="w-full flex flex-row-reverse items-center justify-start gap-4" dir="rtl">
             <div className="shrink-0">
                <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={40} />
             </div>
             <div className="text-right space-y-0.5">
                <h2 className="text-sm font-black text-[#002d4d] leading-none font-ar">
                  {selectedAsset?.name || selectedAsset?.coin}
                </h2>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none font-en">
                  {selectedNetwork?.name || selectedAsset?.network}
                </p>
             </div>
          </div>

          {/* الباركود المربع الحاد - بدون أي حاويات مشتتة */}
          <div className="flex items-center justify-center w-full py-4">
             {qrCodeUrl && (
               <div className="relative h-64 w-64">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR" 
                    className="w-full h-full" 
                    style={{ imageRendering: 'pixelated' }} 
                    crossOrigin="anonymous" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-white p-0.5">
                        <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin} size={32} />
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* العنوان الرقمي - سطر واحد نقي بدون كبسولة */}
          <div className="w-full text-center px-4">
             <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.4em] mb-3 font-en">DEPOSIT ADDRESS</p>
             <p className="text-[10px] font-black text-[#002d4d] whitespace-nowrap overflow-hidden font-en" dir="ltr">
               {walletAddress}
             </p>
          </div>

          {/* التوقيع المؤسساتي - تباعد حروف واسع وفخم */}
          <div className="w-full space-y-8 pt-6">
             <div className="h-[0.5px] w-full bg-gray-100" />
             <div className="flex items-center justify-center gap-6" dir="ltr">
                <span className="text-[16px] font-black text-[#002d4d] uppercase font-en" style={{ letterSpacing: '1em', marginRight: '-1em' }}>
                  NAMIX
                </span>
                <div className="grid grid-cols-2 gap-0.5 scale-90">
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#f9a885]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#002d4d]" />
                </div>
             </div>
          </div>
        </div>
      </div>

      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1100]" />
          <DrawerContent className="fixed bottom-0 left-0 right-0 h-[65dvh] bg-white rounded-t-[48px] border-none shadow-2xl z-[1101] flex flex-col outline-none overflow-hidden" dir="rtl">
            <VisuallyHidden.Root>
              <DrawerTitle>مشاركة العنوان</DrawerTitle>
            </VisuallyHidden.Root>

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
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">جاري تجهيز الصورة...</p>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="preview"
                     initial={{ opacity: 0, scale: 0.95 }} 
                     animate={{ opacity: 1, scale: 1 }} 
                     className="relative"
                   >
                      <div className="p-2 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
                         <img 
                           src={imgUrl} 
                           className="w-full max-w-[180px] md:max-w-[200px] rounded-[24px]" 
                           alt="Preview" 
                         />
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="w-full max-w-[320px] grid grid-cols-2 gap-3 pb-4">
                  <Button 
                    onClick={handleDownload} 
                    disabled={!imgUrl || generating || saving}
                    className="h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Download size={16} className="text-[#f9a885]" />}
                    <span>حفظ</span>
                  </Button>
                  
                  <Button 
                    onClick={handleNativeShare} 
                    disabled={!imgUrl || generating || sharing}
                    className="h-14 rounded-full bg-gray-100 hover:bg-gray-200 text-[#002d4d] font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {sharing ? <Loader2 className="animate-spin h-4 w-4" /> : <Share2 size={16} className="text-blue-500" />}
                    <span>مشاركة</span>
                  </Button>
               </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3 opacity-20 shrink-0">
               <ShieldCheck size={12} className="text-emerald-500" />
               <p className="text-[8px] font-black uppercase tracking-widest text-[#002d4d]">Secure Transfer Node</p>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
}