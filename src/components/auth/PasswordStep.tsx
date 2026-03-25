
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Loader2, ArrowRight, KeyRound } from "lucide-react";
import { useState } from "react";

interface PasswordStepProps {
  password: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onForgotPassword: () => void;
  loading: boolean;
  error: string | null;
}

export function PasswordStep({ password, onChange, onSubmit, onBack, onForgotPassword, loading, error }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="w-full space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="space-y-4">
        <div className="space-y-2.5 px-2">
          <Label className="text-[#002d4d] font-black text-[10px] uppercase tracking-widest opacity-30 pr-2">كلمة المرور</Label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => onChange(e.target.value)}
              className="h-14 w-full bg-gray-50/50 border border-transparent rounded-[24px] text-center px-12 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/5 focus-visible:border-blue-100 text-[#002d4d] font-black text-xl transition-all shadow-inner outline-none tracking-widest"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <Lock className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          </div>
          
          <div className="flex justify-center pt-2">
            <button 
              type="button"
              onClick={onForgotPassword}
              className="text-[10px] font-black text-[#f9a885] hover:text-[#002d4d] transition-colors uppercase tracking-widest flex items-center gap-2 group/forgot"
            >
              <KeyRound className="h-3 w-3 transition-transform group-hover/forgot:rotate-12" />
              <span>هل نسيت كلمة المرور؟</span>
            </button>
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold mt-2 text-center animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
      </div>

      <div className="space-y-5">
        <Button 
          type="submit" 
          className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-2xl active:scale-95 transition-all"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "دخول"}
        </Button>
        <button 
          type="button" 
          onClick={onBack} 
          className="w-full text-[10px] font-black text-gray-400 hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all uppercase tracking-widest group"
        >
          <span>رجوع</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
