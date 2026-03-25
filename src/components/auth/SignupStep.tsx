
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCircle, Lock, UserPlus, Loader2, ArrowRight, Fingerprint, Eye, EyeOff, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignupStepProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}

export function SignupStep({ formData, setFormData, onSubmit, onBack, loading, error }: SignupStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 20;
    if (pass.length >= 10) score += 20;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return score;
  };

  const getStrengthMeta = (score: number) => {
    if (score <= 40) return { color: "bg-red-500", label: "ضعيفة", text: "text-red-500" };
    if (score <= 80) return { color: "bg-orange-500", label: "متوسطة", text: "text-orange-500" };
    return { color: "bg-emerald-500", label: "قوية جداً", text: "text-emerald-500" };
  };

  const passStrength = calculateStrength(formData.password);
  const passMeta = getStrengthMeta(passStrength);

  const confirmStrength = calculateStrength(formData.confirmPassword);
  const confirmMeta = getStrengthMeta(confirmStrength);

  return (
    <form onSubmit={onSubmit} className="w-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 max-h-[65vh] overflow-y-auto px-1 scrollbar-none pb-4">
      <div className="grid gap-5">
        <div className="space-y-2 px-2">
          <Label className="text-[#002d4d] font-black text-[9px] uppercase tracking-widest opacity-30 pr-2">الاسم الكامل</Label>
          <div className="relative">
            <Input
              placeholder="أدخل اسمك كما في الهوية"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="h-12 bg-gray-50/50 border-none rounded-[20px] text-right px-10 font-black text-[#002d4d] text-xs shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/5"
            />
            <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          </div>
        </div>

        <div className="space-y-2 px-2">
          <Label className="text-[#002d4d] font-black text-[9px] uppercase tracking-widest opacity-30 pr-2">الجنس</Label>
          <Select value={formData.gender} onValueChange={(val: any) => setFormData({ ...formData, gender: val })}>
            <SelectTrigger className="h-12 bg-gray-50/50 border-none rounded-[20px] text-right px-6 font-black text-[#002d4d] text-xs shadow-inner">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="male" className="font-bold">ذكر</SelectItem>
              <SelectItem value="female" className="font-bold">أنثى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 px-2">
          <Label className="text-[#002d4d] font-black text-[9px] uppercase tracking-widest opacity-30 pr-2">كلمة المرور</Label>
          <div className="relative group">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 bg-gray-50/50 border-none rounded-[20px] text-center font-black text-[#002d4d] text-sm tracking-widest shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/5"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <Fingerprint className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          </div>
          {formData.password && (
            <div className="space-y-1.5 px-2 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center text-[8px] font-black uppercase">
                <span className="text-gray-400">Security Strength</span>
                <span className={passMeta.text}>{passMeta.label}</span>
              </div>
              <Progress value={passStrength} className={cn("h-1 rounded-full bg-gray-100", `[&>div]:${passMeta.color}`)} />
            </div>
          )}
        </div>

        <div className="space-y-3 px-2">
          <Label className="text-[#002d4d] font-black text-[9px] uppercase tracking-widest opacity-30 pr-2">تأكيد كلمة المرور</Label>
          <div className="relative group">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="h-12 bg-gray-50/50 border-none rounded-[20px] text-center font-black text-[#002d4d] text-sm tracking-widest shadow-inner focus-visible:ring-4 focus-visible:ring-blue-500/5"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          </div>
          {formData.confirmPassword && (
            <div className="space-y-1.5 px-2 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center text-[8px] font-black uppercase">
                <span className="text-gray-400">Match Status</span>
                {formData.password === formData.confirmPassword ? (
                  <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="h-2 w-2" /> متطابقة</span>
                ) : (
                  <span className="text-red-400">غير متطابقة</span>
                )}
              </div>
              <Progress value={formData.password === formData.confirmPassword ? 100 : 30} className={cn("h-1 rounded-full bg-gray-100", formData.password === formData.confirmPassword ? "[&>div]:bg-emerald-500" : "[&>div]:bg-red-400")} />
            </div>
          )}
        </div>

        <div className="space-y-2 px-2">
          <Label className="text-[#002d4d] font-black text-[9px] uppercase tracking-widest opacity-30 pr-2">كود الدعوة (اختياري)</Label>
          <div className="relative">
            <Input
              placeholder="أدخل كود الشريك إن وجد"
              value={formData.invitationCode}
              onChange={(e) => setFormData({ ...formData, invitationCode: e.target.value })}
              className="h-12 bg-gray-50/50 border-none rounded-[20px] text-center font-black text-[#f9a885] text-xs shadow-inner"
            />
            <UserPlus className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
          </div>
        </div>
        {error && <p className="text-red-500 text-[10px] font-bold text-center mt-2 animate-in fade-in slide-in-from-top-1">{error}</p>}
      </div>

      <div className="space-y-5 pt-4">
        <Button type="submit" className="w-full h-14 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all" disabled={loading}>
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "إنشاء الحساب المعتمد"}
        </Button>
        <button type="button" onClick={onBack} className="w-full text-[10px] font-black text-gray-400 hover:text-[#002d4d] flex items-center justify-center gap-2 transition-all uppercase tracking-widest group">
          <span>الرجوع للخلف</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
