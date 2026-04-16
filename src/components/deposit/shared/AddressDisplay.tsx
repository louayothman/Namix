
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Copy, 
  Share2
} from "lucide-react";
import { CryptoIcon } from "@/lib/crypto-icons";
import { QRCodeSVG } from "qrcode.react";
import { DepositShareDrawer } from "../DepositShareDrawer";
import { cn } from "@/lib/utils";

interface AddressDisplayProps {
  walletAddress: string;
  selectedAsset: any;
  selectedNetwork?: any;
  loading?: boolean;
}

export function AddressDisplay({
  walletAddress,
  selectedAsset,
  selectedNetwork,
  loading = false
}: AddressDisplayProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress).then(() => {
      setCopyStatus("تم النسخ");
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-8">
        
        <div className="relative h-56 w-56 md:h-64 md:w-64 flex items-center justify-center">
          {walletAddress ? (
            <div className="relative w-full h-full animate-in zoom-in duration-700">
              <QRCodeSVG 
                value={walletAddress} 
                size={256} 
                bgColor={"transparent"} 
                fgColor={"#002d4d"} 
                level={"H"} 
                includeMargin={false} 
                className="w-full h-full" 
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-50">
                    <CryptoIcon name={selectedAsset?.icon || selectedAsset?.coin || selectedAsset?.symbol} size={32} />
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-full bg-gray-50/50 animate-pulse border border-dashed border-gray-200" />
          )}
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4">
            <p className={cn(
              "flex-1 font-normal text-xs break-all text-center leading-relaxed font-mono transition-all",
              walletAddress ? "text-[#002d4d] opacity-80" : "text-gray-200"
            )}>
              {walletAddress || "........................................"}
            </p>
            <button 
              onClick={handleCopy} 
              disabled={!walletAddress}
              className="h-10 w-10 text-gray-300 hover:text-[#002d4d] transition-all shrink-0 active:scale-90 disabled:opacity-5"
            >
              {copyStatus ? <Check size={22} className="text-emerald-500" /> : <Copy size={22} />}
            </button>
          </div>
          
          <Button 
            onClick={() => setIsShareDrawerOpen(true)} 
            disabled={!walletAddress}
            variant="ghost" 
            className="h-11 rounded-full bg-gray-50 text-[#002d4d] font-black text-[10px] px-8 border border-gray-100 shadow-sm active:scale-95 transition-all flex items-center gap-2 disabled:opacity-20"
          >
            <Share2 size={14} className="text-blue-500" />
            حفظ ومشاركة العنوان
          </Button>
        </div>
      </div>

      <DepositShareDrawer 
        open={isShareDrawerOpen} 
        onOpenChange={setIsShareDrawerOpen} 
        selectedAsset={selectedAsset} 
        selectedNetwork={selectedNetwork} 
        walletAddress={walletAddress} 
      />
    </div>
  );
}
