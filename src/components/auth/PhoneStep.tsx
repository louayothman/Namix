
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, ChevronLeft, Loader2 } from "lucide-react";

interface PhoneStepProps {
  phone: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
}

export function PhoneStep({ phone, onChange, onSubmit, loading, error }: PhoneStepProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <div className="space-y-2.5 px-2">
          <Label className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest opacity-30 pr-2">رقم الهاتف</Label>
          <div className="relative group">
            <input
              type="tel"
              dir="ltr"
              placeholder="000 000 000"
              value={phone}
              onChange={(e) => onChange(e.target.value)}
              className="h-14 w-full bg-gray-50/50 border border-transparent rounded-[24px] text-center px-12 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/5 focus-visible:border-blue-100 text-[#002d4d] font-black text-xl transition-all shadow-inner outline-none"
            />
            <Phone className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 transition-colors group-focus-within:text-blue-500" />
          </div>
          {error && <p className="text-red-500 text-[10px] font-bold mt-2 text-center animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl active:scale-95 transition-all group"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
          <div className="flex items-center gap-2">
            <span>المتابعة</span>
            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </div>
        )}
      </Button>
    </form>
  );
}
