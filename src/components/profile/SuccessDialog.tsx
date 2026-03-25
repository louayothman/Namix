
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, Zap, ZapOff, Gift, Coins, Check, Copy } from "lucide-react";
import { useState } from "react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: any;
  type: 'profile' | 'password' | 'pin' | 'auto-invest' | 'auto-invest-off' | 'voucher-create' | 'voucher-redeem';
  extraData?: string;
}

export function SuccessDialog({ open, onOpenChange, title, description, icon: Icon, type, extraData }: SuccessDialogProps) {
  const [copied, setCopied] = useState(false);

  const getSubTitle = () => {
    switch (type) {
      case 'profile': return "Identity Secured";
      case 'password': return "Security Vault Updated";
      case 'pin': return "Transaction Vault Active";
      case 'auto-invest': return "Growth Protocol Optimized";
      case 'auto-invest-off': return "Yield Engine Hibernating";
      case 'voucher-create': return "Capital Asset Issued";
      case 'voucher-redeem': return "Liquidity Flow Verified";
      default: return "Protocol Verified";
    }
  };

  const getAccentColor = () => {
    if (type === 'profile' || type === 'pin' || type === 'voucher-redeem') return "text-emerald-500 bg-emerald-50 border-emerald-100";
    if (type === 'password' || type === 'auto-invest') return "text-blue-600 bg-blue-50 border-blue-100";
    if (type === 'auto-invest-off') return "text-red-500 bg-red-50 border-red-100";
    if (type === 'voucher-create') return "text-[#f9a885] bg-orange-50 border-orange-100";
    return "text-emerald-600 bg-emerald-50 border-emerald-100";
  };

  const handleCopy = () => {
    if (extraData) {
      navigator.clipboard.writeText(extraData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[64px] border-none shadow-2xl p-12 max-w-[420px] overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-[0.02] -rotate-12 pointer-events-none">
           <Icon className="h-48 w-48" />
        </div>
        
        <DialogHeader className="items-center gap-10 relative z-10">
          <div className={`h-28 w-28 rounded-[40px] flex items-center justify-center animate-bounce shadow-inner border-4 border-white relative ${getAccentColor()}`}>
            <Icon className="h-14 w-14 relative z-10" />
          </div>
          <div className="text-center space-y-3">
            <DialogTitle className="text-3xl font-black text-[#002d4d] tracking-normal">{title}</DialogTitle>
            <div className="flex items-center justify-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles className="h-3 w-3 text-[#f9a885]" />
              {getSubTitle()}
            </div>
          </div>
        </DialogHeader>
        
        <div className="text-center space-y-8 mt-8 relative z-10">
          <p className="text-gray-500 font-bold leading-[2.2] text-sm px-6 text-right">
            {description}
          </p>

          {type === 'voucher-create' && extraData && (
            <div className="p-6 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 space-y-3 animate-in zoom-in duration-500">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Voucher Code</p>
               <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex-1 font-mono text-center font-black text-lg text-[#002d4d]">{extraData}</div>
                  <Button size="icon" variant="ghost" onClick={handleCopy} className="h-10 w-10 text-[#f9a885]">
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </Button>
               </div>
            </div>
          )}

          <Button onClick={() => onOpenChange(false)} className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3">
            <span>إغلاق النافذة</span>
            <ShieldCheck className="h-5 w-5 text-[#f9a885]" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
