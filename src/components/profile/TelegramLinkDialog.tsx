
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Loader2, ShieldCheck, Zap, Sparkles, CheckCircle2, ChevronLeft, ArrowUpRight } from "lucide-react";
import { useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface TelegramLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  dbUser: any;
}

/**
 * @fileOverview بروتوكول ربط تلغرام v1.0
 * يولد رمز ربط مؤقت ويوجه المستخدم للبوت لتأمين الاتصال.
 */
export function TelegramLinkDialog({ open, onOpenChange, user, dbUser }: TelegramLinkDialogProps) {
  const [loading, setLoading] = useState(false);
  const db = useFirestore();
  const isLinked = !!dbUser?.telegramChatId;

  const handleLink = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const tempToken = 'LINK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await updateDoc(doc(db, "users", user.id), { tempLinkToken: tempToken });
      
      const botUrl = `https://t.me/NamixNexusBot?start=${tempToken}`; // استبدل بـ username بوتك
      window.open(botUrl, '_blank');
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[48px] border-none shadow-2xl p-0 max-w-[400px] overflow-hidden text-right font-body" dir="rtl">
        <div className="bg-[#0088cc] p-8 text-white relative shrink-0 text-center">
           <div className="absolute top-0 right-0 p-6 opacity-[0.1] -rotate-12 pointer-events-none"><Send className="h-32 w-32" /></div>
           <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner mx-auto mb-4">
              <Send className="h-8 w-8 text-white" />
           </div>
           <DialogTitle className="text-xl font-black">ربط حساب تلغرام</DialogTitle>
           <p className="text-[8px] font-black text-blue-100/60 uppercase tracking-[0.3em] mt-1">Nexus Notification Protocol</p>
        </div>

        <div className="p-8 space-y-8 bg-white text-center">
           {isLinked ? (
             <div className="space-y-6 py-4 animate-in zoom-in-95">
                <div className="h-20 w-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                   <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                   <h4 className="font-black text-lg text-[#002d4d]">حسابك موثق ونشط ✅</h4>
                   <p className="text-[11px] font-bold text-gray-400 leading-relaxed px-4">
                     أنت مرتبط الآن ببوت ناميكس (Namix Nexus). ستتلقى كافة إشعارات الأرباح وتنبيهات الأمان هناك فوراً.
                   </p>
                </div>
                <Button onClick={() => onOpenChange(false)} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl">العودة للملف الشخصي</Button>
             </div>
           ) : (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 space-y-4 text-right">
                   <div className="flex items-center gap-2 text-blue-600">
                      <Zap className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">لماذا تلغرام؟</span>
                   </div>
                   <ul className="space-y-2">
                      {[
                        "إشعارات فورية بنتائج الصفقات",
                        "تنبيهات عند نضوج العقود الاستثمارية",
                        "تداول سريع ومؤمن بلمسة واحدة",
                        "إشارات NAMIX AI الاستراتيجية"
                      ].map((txt, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-blue-800/70">
                           <div className="h-1 w-1 rounded-full bg-blue-400" />
                           {txt}
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="space-y-4">
                   <Button onClick={handleLink} disabled={loading} className="w-full h-16 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group">
                      {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                        <>
                          فتح بوت ناميكس والربط
                          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                   </Button>
                   <p className="text-[9px] text-gray-400 font-bold">سيتم توجيهك لتطبيق تلغرام لإتمام بروتوكول المصادقة.</p>
                </div>
             </div>
           )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center opacity-30">
           <p className="text-[7px] font-black uppercase tracking-widest">End-to-End Encrypted Tunnel</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
