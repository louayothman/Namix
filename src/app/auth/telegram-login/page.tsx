"use client";

import React, { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ShieldCheck, Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { loginTelegramUser, sendUserSuccessBriefing } from "@/app/actions/telegram-user-actions";
import { motion, AnimatePresence } from "framer-motion";
import { IdentityCardPreview } from "@/components/profile/IdentityCardPreview";
import * as htmlToImage from 'html-to-image';

function LoginContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);
  const [userDataForCard, setUserDataForCard] = useState<any>(null);

  const [formData, setFormData] = useState({
    chatId: searchParams.get("chatId") || "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("يرجى إدخال البريد وكلمة المرور.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginTelegramUser(formData);
      if (res.success) {
        setSuccess(true);
        setUserDataForCard(res.user);
        localStorage.setItem("namix_user", JSON.stringify(res.user));
        
        setTimeout(async () => {
          if (idCardRef.current) {
            try {
              const dataUrl = await htmlToImage.toJpeg(idCardRef.current, { quality: 0.95, pixelRatio: 2 });
              await sendUserSuccessBriefing(formData.chatId, res.user, dataUrl);
            } catch (captureErr) {
              await sendUserSuccessBriefing(formData.chatId, res.user);
            }
          }
          if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
        }, 3000);
      } else {
        setError(res.error || "بيانات الدخول غير صحيحة.");
      }
    } catch (e) {
      setError("خطأ في الاتصال بالشبكة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body p-8 flex flex-col items-center justify-start text-right" dir="rtl">
      <div className="fixed left-[-9999px] top-[-9999px]">
         <div ref={idCardRef}>
            {userDataForCard && <IdentityCardPreview user={userDataForCard} calculatedTier={null} invitationLink="" />}
         </div>
      </div>

      <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col items-center gap-8 text-center pt-8">
           <Logo size="md" />
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#002d4d]">دخول مؤمن</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Identity Link Protocol</p>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-10 text-center">
               <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative">
                  <ShieldCheck className="h-12 w-12 text-emerald-500" />
                  <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-emerald-400/20 rounded-[40px] blur-3xl -z-10" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-black text-[#002d4d]">تم تسجيل الدخول</h3>
                  <p className="text-sm text-gray-500 font-bold leading-loose px-6">جاري مزامنة بيانات حسابك مع تلغرام وتحديث بطاقة هويتك...</p>
               </div>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-8" exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-5">
                 <div className="space-y-2 px-1">
                    <Label className="text-[10px] font-black text-gray-400 uppercase pr-2">البريد الإلكتروني</Label>
                    <div className="relative">
                       <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-14 rounded-2xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-left" dir="ltr" placeholder="name@example.com" />
                       <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    </div>
                 </div>
                 <div className="space-y-2 px-1">
                    <Label className="text-[10px] font-black text-gray-400 uppercase pr-2">كلمة المرور</Label>
                    <div className="relative">
                       <Input type={showPass ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="h-14 rounded-2xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-center tracking-widest" placeholder="••••••••" />
                       <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                       <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors">
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                    </div>
                 </div>
              </div>
              {error && <p className="text-red-500 text-[10px] font-bold text-center animate-shake">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>دخول ومزامنة <Zap className="h-5 w-5 text-[#f9a885] fill-current" /></>}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TelegramLoginPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#002d4d] opacity-20" /></div>}>
       <LoginContent />
    </Suspense>
  );
}
