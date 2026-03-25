
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Loader2, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Mail, 
  Fingerprint, 
  ArrowRight, 
  ChevronLeft,
  ShieldAlert,
  CheckCircle2
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { sendOTPEmail } from "@/app/actions/auth-actions";
import { cn } from "@/lib/utils";

/**
 * @fileOverview بروتوكول تغيير كلمة المرور v4980.0 - المدمج
 * واجهة مضغوطة تلغي التمرير وتسهل التفاعل على الهواتف.
 */

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  dbUser?: any;
}

type Step = 'verify_current' | 'verify_otp' | 'new_password' | 'success';

export function ChangePasswordDialog({ open, onOpenChange, userId, dbUser }: ChangePasswordDialogProps) {
  const db = useFirestore();
  const [step, setStep] = useState<Step>('verify_current');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [passData, setPassData] = useState({
    current: "",
    otp: "",
    next: "",
    confirm: ""
  });

  const [showPass, setShowPass] = useState({
    current: false,
    next: false,
    confirm: false
  });

  useEffect(() => {
    if (open) {
      setStep('verify_current');
      setPassData({ current: "", otp: "", next: "", confirm: "" });
      setError(null);
    }
  }, [open]);

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

  const strength = calculateStrength(passData.next);
  const strengthMeta = strength <= 40 ? { color: "bg-red-500", label: "ضعيفة", text: "text-red-500" } :
                       strength <= 80 ? { color: "bg-orange-500", label: "متوسطة", text: "text-orange-500" } :
                       { color: "bg-emerald-500", label: "قوية جداً", text: "text-emerald-500" };

  const handleVerifyCurrent = () => {
    if (passData.current !== dbUser?.password) {
      setError("كلمة المرور الحالية غير صحيحة.");
      return;
    }
    setError(null);
    setStep('new_password');
  };

  const handleSendOTP = async () => {
    if (!dbUser?.email) {
      setError("بريد إلكتروني مفقود للاستعادة.");
      return;
    }
    setLoading(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      await setDoc(doc(db, "otp_verifications", dbUser.email), {
        code: otpCode,
        expiresAt: expiresAt.toISOString(),
      });

      const res = await sendOTPEmail(dbUser.email, otpCode);
      if (res.success) {
        setStep('verify_otp');
      } else {
        setError("فشل إرسال البريد.");
      }
    } catch (e) {
      setError("خطأ في البروتوكول.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      const otpRef = doc(db, "otp_verifications", dbUser.email);
      const snap = await getDoc(otpRef);
      if (!snap.exists() || snap.data().code !== passData.otp) {
        setError("رمز غير صحيح.");
        return;
      }
      await deleteDoc(otpRef);
      setStep('new_password');
    } catch (e) {
      setError("فشل التحقق.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (passData.next.length < 6) {
      setError("يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    if (passData.next !== passData.confirm) {
      setError("غير متطابقة.");
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", userId), { 
        password: passData.next, 
        updatedAt: new Date().toISOString() 
      });
      setStep('success');
    } catch (e) {
      setError("فشل التحديث.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[40px] md:rounded-[56px] border-none shadow-2xl p-0 w-[94vw] max-w-[360px] overflow-hidden text-right flex flex-col outline-none z-[1100]" dir="rtl">
        
        <div className="bg-[#002d4d] p-6 text-white relative shrink-0 text-center border-b border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-[0.04] -rotate-12 pointer-events-none"><KeyRound className="h-32 w-32" /></div>
           <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-inner mx-auto mb-3">
              <Lock className="h-6 w-6 text-[#f9a885]" />
           </div>
           <DialogTitle className="text-lg font-black tracking-normal">تغيير الأمان</DialogTitle>
           <p className="text-[7px] font-black text-blue-200/30 uppercase tracking-[0.3em] mt-1">Sovereign Encryption</p>
        </div>

        <div className="p-6 space-y-6 bg-white flex-1 overflow-y-auto scrollbar-none min-h-[280px]">
          
          {step === 'verify_current' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-gray-400 pr-3 uppercase tracking-widest">كلمة المرور الحالية</Label>
                <div className="relative group">
                  <Input 
                    type={showPass.current ? "text" : "password"}
                    value={passData.current} 
                    onChange={e => { setPassData({...passData, current: e.target.value}); setError(null); }}
                    className="h-12 rounded-xl bg-gray-50 border-none font-black px-10 text-center text-base shadow-inner"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                    {showPass.current ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                </div>
                <div className="flex justify-center pt-1">
                   <button type="button" onClick={handleSendOTP} className="text-[9px] font-black text-[#f9a885] hover:text-[#002d4d] transition-all uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>هل نسيت كلمة المرور؟</span>
                   </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-[9px] font-bold text-center">{error}</p>}
              <Button onClick={handleVerifyCurrent} disabled={!passData.current} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95 transition-all">
                المتابعة
              </Button>
            </div>
          )}

          {step === 'verify_otp' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 text-center">
              <div className="p-4 bg-blue-50 rounded-[24px] border border-blue-100 flex items-start gap-3 text-right">
                 <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-bold text-blue-800/60 leading-relaxed">تم إرسال رمز الأمان لبريدك الإلكتروني. يرجى إدخاله.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">رمز التحقق (OTP)</Label>
                <div className="relative">
                  <Input 
                    maxLength={6}
                    value={passData.otp}
                    onChange={e => { setPassData({...passData, otp: e.target.value.replace(/\D/g, '')}); setError(null); }}
                    className="h-14 rounded-xl bg-gray-50 border-none font-black text-center text-3xl tracking-[0.4em] shadow-inner"
                    placeholder="000000"
                  />
                  <Fingerprint className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-200" />
                </div>
              </div>
              {error && <p className="text-red-500 text-[9px] font-bold text-center">{error}</p>}
              <Button onClick={handleVerifyOTP} disabled={loading || passData.otp.length < 6} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "تحقق من الرمز"}
              </Button>
            </div>
          )}

          {step === 'new_password' && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-gray-400 pr-3 uppercase tracking-widest">الكلمة الجديدة</Label>
                  <div className="relative group">
                    <Input 
                      type={showPass.next ? "text" : "password"}
                      value={passData.next}
                      onChange={e => { setPassData({...passData, next: e.target.value}); setError(null); }}
                      className="h-12 rounded-xl bg-gray-50 border-none font-black px-10 text-center text-sm shadow-inner"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPass({...showPass, next: !showPass.next})} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      {showPass.next ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                    <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                  </div>
                  {passData.next && (
                    <div className="px-2 space-y-1 animate-in fade-in">
                       <div className="flex justify-between items-center text-[7px] font-black uppercase">
                          <span className="text-gray-400">Strength</span>
                          <span className={strengthMeta.text}>{strengthMeta.label}</span>
                       </div>
                       <Progress value={strength} className={cn("h-1 rounded-full bg-gray-100", `[&>div]:${strengthMeta.color}`)} />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black text-gray-400 pr-3 uppercase tracking-widest">تأكيد الكلمة</Label>
                  <div className="relative group">
                    <Input 
                      type={showPass.confirm ? "text" : "password"}
                      value={passData.confirm}
                      onChange={e => { setPassData({...passData, confirm: e.target.value}); setError(null); }}
                      className="h-12 rounded-xl bg-gray-50 border-none font-black px-10 text-center text-sm shadow-inner"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      {showPass.confirm ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                    <ShieldCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-[9px] font-bold text-center">{error}</p>}
              <Button onClick={handleFinalize} disabled={loading || !passData.next} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "تثبيت الأمان الجديد"}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-700 text-center py-4">
               <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#002d4d]">تم التحديث!</h3>
                  <p className="text-gray-500 font-bold text-[11px] px-4 leading-relaxed">
                    تم تحديث كلمة المرور بنجاح وفقاً لبروتوكول الأمان السيادي.
                  </p>
               </div>
               <Button onClick={() => onOpenChange(false)} className="w-full h-12 rounded-full bg-[#002d4d] text-white font-black text-xs shadow-xl">
                  إغلاق النافذة
               </Button>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
           <p className="text-[7px] font-black uppercase tracking-widest text-gray-300">End-to-End Encryption Protocol</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
