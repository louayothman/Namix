
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ShieldCheck, Loader2, Zap, Sparkles } from "lucide-react";
import { registerTelegramUser } from "@/app/actions/telegram-user-actions";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview واجهة التسجيل المدمجة لـ تلغرام (TMA) v1.0
 */

function SignupContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    chatId: searchParams.get("chatId") || "",
    fullName: searchParams.get("firstName") || "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("يرجى استكمال كافة الحقول.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await registerTelegramUser(formData);
      if (res.success) {
        setSuccess(true);
        // حفظ الجلسة في المتصفح المدمج لتلغرام
        localStorage.setItem("namix_user", JSON.stringify(res.user));
        
        // إغلاق التطبيق المصغر بعد 3 ثوانٍ
        setTimeout(() => {
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.close();
          }
        }, 3000);
      } else {
        setError(res.error || "فشل إنشاء الحساب.");
      }
    } catch (e) {
      setError("خطأ في الاتصال بالشبكة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body p-8 flex flex-col items-center justify-start text-right" dir="rtl">
      <div className="w-full max-w-sm space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="flex flex-col items-center gap-8 text-center pt-8">
           <Logo size="md" />
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#002d4d]">تفعيل الهوية الرقمية</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] opacity-60">Telegram Identity Node</p>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 py-10 text-center"
            >
               <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative">
                  <ShieldCheck className="h-12 w-12 text-emerald-500" />
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-400/20 rounded-[40px] blur-3xl -z-10"
                  />
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-black text-[#002d4d]">تم التفعيل بنجاح</h3>
                  <p className="text-sm text-gray-500 font-bold leading-loose px-6">لقد تم إنشاء هويتك المالية وربطها بـ تلغرام. جاري توجيهك لغرفة العمليات...</p>
               </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              onSubmit={handleSubmit} 
              className="space-y-8"
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-5">
                 <div className="space-y-2 px-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-2">الاسم الكامل</Label>
                    <div className="relative">
                       <Input 
                         value={formData.fullName} 
                         onChange={e => setFormData({...formData, fullName: e.target.value})}
                         className="h-14 rounded-2xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner" 
                         placeholder="أدخل اسمك الكريم..."
                       />
                       <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                 </div>

                 <div className="space-y-2 px-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-2">البريد الإلكتروني</Label>
                    <div className="relative">
                       <Input 
                         type="email"
                         value={formData.email} 
                         onChange={e => setFormData({...formData, email: e.target.value})}
                         className="h-14 rounded-2xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-left" 
                         dir="ltr"
                         placeholder="name@example.com"
                       />
                       <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                 </div>

                 <div className="space-y-2 px-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-2">كلمة المرور</Label>
                    <div className="relative">
                       <Input 
                         type="password"
                         value={formData.password} 
                         onChange={e => setFormData({...formData, password: e.target.value})}
                         className="h-14 rounded-2xl bg-gray-50/50 border-none font-black text-xs px-10 shadow-inner text-center tracking-widest" 
                         placeholder="••••••••"
                       />
                       <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                 </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center animate-shake">
                   <p className="text-[10px] font-black text-red-600">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <span>إنشاء الحساب الموثق</span>
                    <Zap className="h-5 w-5 text-[#f9a885] fill-current group-hover:scale-125 transition-transform" />
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="pt-8 flex flex-col items-center gap-4 opacity-30 select-none">
           <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-[#f9a885]" />
              <p className="text-[8px] font-black text-[#002d4d] uppercase tracking-[0.5em]">Secure Protocol v1.0</p>
           </div>
        </div>
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
