
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface OTPStepProps {
  otp: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

export function OTPStep({ otp, onChange, onSubmit, onBack, loading, error }: OTPStepProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="space-y-4 text-center">
        <div className="space-y-2.5 px-2">
          <Label className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest opacity-30 pr-2">رمز التحقق (OTP)</Label>
          <div className="relative group">
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
              className="h-16 w-full bg-gray-50/50 border border-transparent rounded-[24px] text-center px-4 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/5 focus-visible:border-blue-100 text-[#002d4d] font-black text-4xl tracking-[0.5em] transition-all shadow-inner outline-none"
            />
            <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
          </div>
          <p className="text-[9px] text-gray-400 mt-4 font-bold">تم إرسال رمز التحقق إلى بريدك الإلكتروني.</p>
          {error && <p className="text-red-500 text-[10px] font-bold mt-2 text-center animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
      </div>

      <div className="space-y-5">
        <Button 
          type="submit" 
          className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all"
          disabled={loading || otp.length < 6}
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "تحقق من الرمز"}
        </Button>
        <button 
          type="button" 
          onClick={onBack} 
          className="w-full text-[10px] font-black text-gray-400 hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all uppercase tracking-widest group"
        >
          <span>تغيير البريد الإلكتروني</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
