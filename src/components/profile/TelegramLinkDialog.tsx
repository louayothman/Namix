
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Loader2, CheckCircle2, ChevronLeft, ArrowUpRight, AlertCircle, Zap } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface TelegramLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  dbUser: any;
}

/**
 * @fileOverview بروتوكول الربط اللحظي v3.0 - Instant Zero-Login Edition
 * تم تحسين عملية الربط لتعمل بمجرد فتح البوت عبر التوكن المشفر.
 */
export function TelegramLinkDialog({ open, onOpenChange, user, dbUser }: TelegramLinkDialogProps) {
  const [loading, setLoading] = useState(false);
  const db = useFirestore();
  
  const telegramRef = useMemoFirebase(() => doc(db, "system_settings", "telegram"), [db]);
  const { data: telegramConfig, isLoading: configLoading } = useDoc(telegramRef);

  const isLinked = !!dbUser?.telegramChatId;
  const botUsername = telegramConfig?.botUsername;

  const handleLinkInitiation = async () => {
    if (!user?.id || !botUsername) return;
    setLoading(true);
    try {
      // 1. توليد توكن فريد مشفر وحفظه كبصمة مؤقتة للربط
      const tempToken = 'LINK-' + Math.random().toString(36).substr(2, 12).toUpperCase();
      await updateDoc(doc(db, "users", user.id), { 
        tempLinkToken: tempToken,
        updatedAt: new Date().toISOString()
      });
      
      // 2. توجيه المستثمر للبوت مع تمرير التوكن عبر معايير البدء
      const botUrl = `https://t.me/${botUsername}?start=${tempToken}`;
      window.location.href = botUrl;
    } catch (e) {
      console.error("Telegram Sync Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[48px] border-none shadow-2xl p-0 max-w-[400px] overflow-hidden text-right font-body outline-none" dir="rtl">
        <div className="bg-[#0088cc] p-8 text-white relative shrink-0 text-center">
           <div className="absolute top-0 right-0 p-6 opacity-[0.1] -rotate-12 pointer-events-none"><Send className="h-32 w-32" /></div>
           <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner mx-auto mb-4">
              <Send className="h-8 w-8 text-white" />
           </div>
           <DialogTitle className="text-xl font-black">ربط حساب ناميكس نكسوس</DialogTitle>
           <p className="text-[8px] font-black text-blue-100/60 uppercase tracking-[0.3em] mt-1">Instant Sync Protocol</p>
        </div>

        <div className="p-8 space-y-8 bg-white text-center min-h-[200px] flex flex-col justify-center">
           {configLoading ? (
             <div className="py-6 flex flex-col items-center gap-4 animate-in fade-in">
                <Loader2 className="h-8 w-8 animate-spin text-[#0088cc]" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مزامنة القنوات التقنية...</p>
             </div>
           ) : isLinked ? (
             <div className="space-y-6 py-4 animate-in zoom-in-95">
                <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                   <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                   <h4 className="font-black text-lg text-[#002d4d]">تم الربط بنجاح ✅</h4>
                   <p className="text-[11px] font-bold text-gray-400 leading-relaxed px-4">
                     حسابك الآن متصل بمركز الإشعارات المتقدم. ستتلقى كافة الإشارات والتقارير عبر تلغرام فوراً.
                   </p>
                </div>
                <Button onClick={() => onOpenChange(false)} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">العودة للملف</Button>
             </div>
           ) : !botUsername ? (
             <div className="py-6 space-y-4 animate-in fade-in">
                <div className="h-16 w-16 rounded-3xl bg-orange-50 flex items-center justify-center mx-auto border border-orange-100">
                   <AlertCircle className="h-8 w-8 text-orange-400" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-black text-[#002d4d]">الخدمة قيد الإعداد</p>
                   <p className="text-[11px] font-bold text-gray-400 leading-relaxed px-4">نعمل على تهيئة قنوات التواصل المعتمدة. يرجى المحاولة لاحقاً.</p>
                </div>
             </div>
           ) : (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4 text-right shadow-inner">
                   <div className="flex items-center gap-2 text-[#0088cc]">
                      <Zap className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">المميزات النخبوية</span>
                   </div>
                   <ul className="space-y-2.5">
                      {[
                        "استقبال إشارات التداول الآلية (كل دقيقتين)",
                        "الوصول السريع للمنصة عبر التطبيق المصغر",
                        "تقارير أداء أسبوعية مفصلة",
                        "تنبيهات فورية عند نضوج العقود"
                      ].map((txt, i) => (
                        <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                           <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                           {txt}
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="space-y-4">
                   <Button 
                     onClick={handleLinkInitiation} 
                     disabled={loading} 
                     className="w-full h-16 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
                   >
                      {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                        <>
                          ربط الحساب وتفعيل البوت
                          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                   </Button>
                   <p className="text-[9px] text-gray-400 font-bold">سيتم توجيهك الآن للربط التلقائي والآمن.</p>
                </div>
             </div>
           )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center opacity-30">
           <p className="text-[7px] font-black uppercase tracking-widest">Namix Sync Tunnel Secured</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
