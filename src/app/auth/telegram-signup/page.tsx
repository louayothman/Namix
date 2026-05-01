"use client";

import React, { useState, useRef, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { User, Mail, Lock, ShieldCheck, Loader2, Zap, Eye, EyeOff, Sparkles, Send } from "lucide-react";
import { registerTelegramUser, sendUserSuccessBriefing, sendTelegramOTP, verifyTelegramOTP } from "@/app/actions/telegram-user-actions";
import { motion, AnimatePresence } from "framer-motion";
import { IdentityCardPreview } from "@/components/profile/IdentityCardPreview";
import * as htmlToImage from 'html-to-image';
import { cn } from "@/lib/utils";

function SignupContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [userDataForCard, setUserDataForCard] = useState<any>(null);

  const [formData, setFormData] = useState({
    chatId: searchParams.get("chatId") || "",
    fullName: searchParams.get("firstName") || "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    invitationCode: ""
  });

  const passStrength = useMemo(() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s += 25;
    if (p.length >= 10) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    return s;
  }, [formData.password]);

  const strengthMeta = useMemo(() => {
    if (passStrength <= 25) return { label: "ضعيفة", color: "bg-red-500", text: "text-red-500" };
    if (passStrength <= 50) return { label: "متوسطة", color: "bg-orange-500", text: "text-orange-500" };
    if (passStrength <= 75) return { label: "قوية", color: "bg-blue-500", text: "text-blue-500" };
    return { label: "آمنة جداً", color: "bg-emerald-500", text: "text-emerald-500" };
  }, [passStrength]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("يرجى استكمال كافة الحقول الأساسية.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة.");
      return;
    }

    setLoading(true);
    setError(null);
    const res = await sendTelegramOTP(formData.email);
    setLoading(false);
    
    if (res.success) setStep('otp');
    else setError(res.error || "فشل إرسال رمز التحقق.");
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const verifyRes = await verifyTelegramOTP(formData.email, formData.otp);
    if (!verifyRes.success) {
      setError("رمز التحقق غير صحيح.");
      setLoading(false);
      return;
    }

    const res = await registerTelegramUser(formData);
    if (res.success) {
      setSuccess(res.user);
    } else {
      setError(res.error || "فشل إنشاء الحساب.");
      setLoading(false);
    }
  };

  const setSuccess = (user: any) => {
    setUserDataForCard(user);
    setStep('success');
    localStorage.setItem("namix_user", JSON.stringify(user));
    
    setTimeout(async () => {
      if (idCardRef.current) {
        try {
          const dataUrl = await htmlToImage.toJpeg(idCardRef.current, { quality: 0.95, pixelRatio: 2 });
          await sendUserSuccessBriefing(formData.chatId, user, dataUrl);
        } catch (captureErr) {
          await sendUserSuccessBriefing(formData.chatId, user);
        }
      }
      if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white font-body p-6 flex flex-col items-center justify-start text-right overflow-x-hidden" dir="rtl">
      <div className="fixed left-[-9999px] top-[-9999px]">
         <div ref={idCardRef}>
            {userDataForCard && <IdentityCardPreview user={userDataForCard} calculatedTier={null} invitationLink="" />}
         </div>
      </div>

      <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center gap-6 text-center pt-4">
           <Logo size="md" />
           <div className="space-y-1">
              <h2 className="text-xl font-black text-[#002d4d]">تفعيل الهوية الرقمية</h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Identity Registration Node</p>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.form key="form" onSubmit={handleInitialSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                 <div className="space-y-1.5 px-1">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">الاسم الكامل</Label>
                    <div className="relative">
                       <Input value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="h-12 rounded-xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner" placeholder="أدخل اسمك الكريم..." />
                       <User size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                 </div>

                 <div className="space-y-1.5 px-1">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">البريد الإلكتروني</Label>
                    <div className="relative">
                       <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-left" dir="ltr" placeholder="name@example.com" />
                       <Mail size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                 </div>

                 <div className="space-y-1.5 px-1">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">كلمة المرور</Label>
                    <div className="relative">
                       <Input type={showPass ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="h-12 rounded-xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-center tracking-widest" placeholder="••••••••" />
                       <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                       <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"><Eye size={14} /></button>
                    </div>
                    {formData.password && (
                      <div className="px-2 space-y-1">
                         <div className="flex justify-between items-center"><span className="text-[7px] font-black text-gray-300 uppercase">Strength</span><span className={cn("text-[7px] font-black", strengthMeta.text)}>{strengthMeta.label}</span></div>
                         <Progress value={passStrength} className={cn("h-0.5", "[&>div]:"+strengthMeta.color)} />
                      </div>
                    )}
                 </div>

                 <div className="space-y-1.5 px-1">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">تأكيد كلمة المرور</Label>
                    <Input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="h-12 rounded-xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-center tracking-widest" placeholder="••••••••" />
                 </div>

                 <div className="space-y-1.5 px-1">
                    <Label className="text-[9px] font-black text-gray-400 uppercase pr-2">كود الدعوة (اختياري)</Label>
                    <div className="relative">
                       <Input value={formData.invitationCode} onChange={e => setFormData({...formData, invitationCode: e.target.value})} className="h-12 rounded-xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-center" placeholder="أدخل الكود إن وجد" />
                       <Zap size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-orange-200" />
                    </div>
                 </div>
              </div>

              {error && <p className="text-red-500 text-[10px] font-bold text-center animate-shake">{error}</p>}
              
              <Button type="submit" disabled={loading} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black text-sm shadow-xl active:scale-95 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>المتابعة للتحقق <ChevronLeft size={16} /></>}
              </Button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.form key="otp" onSubmit={handleOTPVerify} className="space-y-8" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
               <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
                  <Mail className="h-6 w-6 text-blue-600 shrink-0" />
                  <p className="text-xs font-bold text-blue-800 leading-relaxed">أرسلنا رمز التحقق إلى بريدك الإلكتروني. يرجى إدخاله لتفعيل الهوية.</p>
               </div>
               <Input 
                 maxLength={6} 
                 value={formData.otp} 
                 onChange={e => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})} 
                 className="h-20 rounded-3xl bg-gray-50 border-none text-center text-5xl font-black tracking-widest shadow-inner" 
                 placeholder="000000" 
               />
               {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
               <Button type="submit" disabled={loading || formData.otp.length < 6} className="w-full h-16 rounded-full bg-emerald-600 text-white font-black text-lg shadow-xl">
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "تفعيل الحساب الآن"}
               </Button>
               <button type="button" onClick={() => setStep('form')} className="w-full text-center text-[10px] font-black text-gray-400">تعديل البيانات</button>
            </motion.form>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-10 text-center">
               <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative">
                  <ShieldCheck className="h-12 w-12 text-emerald-500" />
                  <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[40px] blur-3xl -z-10" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-black text-[#002d4d]">تم التفعيل بنجاح</h3>
                  <p className="text-sm text-gray-500 font-bold leading-loose px-6">لقد تم إنشاء هويتك المالية. جاري إرسال بطاقة الهوية لدردشة البوت...</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TelegramSignupPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d] opacity-20" /></div>}>
       <SignupContent />
    </Suspense>
  );
}
