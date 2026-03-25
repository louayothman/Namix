
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { KeyRound, ShieldCheck, Lock, Loader2, Sparkles, Fingerprint, Mail, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { sendAdminResetEmail } from "@/app/actions/auth-actions";
import { toast } from "@/hooks/use-toast";

interface CredentialResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onConfirm: (type: 'password' | 'pin', newValue: string) => void;
  processing: boolean;
}

export function CredentialResetDialog({ open, onOpenChange, user, onConfirm, processing }: CredentialResetDialogProps) {
  const [type, setType] = useState<'password' | 'pin'>('password');
  const [value, setValue] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [emailLoading, setEmailLoading] = useState(false);

  const handleConfirm = async () => {
    if (!value || !user) return;
    
    // Call the original confirm logic (Firestore update)
    onConfirm(type, value);

    if (sendEmail && user.email) {
      setEmailLoading(true);
      try {
        const res = await sendAdminResetEmail(user.email, type, value);
        if (res.success) {
          toast({ title: "تم الإرسال بنجاح", description: "تم حقن البيانات الجديدة في بريد المستثمر." });
        } else {
          toast({ variant: "destructive", title: "فشل الإرسال البريدي", description: res.error });
        }
      } catch (e) {
        toast({ variant: "destructive", title: "خطأ في بروتوكول الإرسال" });
      } finally {
        setEmailLoading(false);
      }
    }

    setValue("");
  };

  const generateRandom = () => {
    if (type === 'pin') {
      setValue(Math.floor(100000 + Math.random() * 900000).toString());
    } else {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
      let pass = "";
      for (let i = 0; i < 10; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
      setValue(pass);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[420px] overflow-hidden text-right" dir="rtl">
        <div className="bg-[#002d4d] p-8 text-white relative">
           <div className="absolute top-0 right-0 p-6 opacity-[0.05] -rotate-12 pointer-events-none">
              <KeyRound className="h-32 w-32" />
           </div>
           <div className="flex items-center gap-4 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                 <Lock className="h-6 w-6 text-[#f9a885]" />
              </div>
              <div className="space-y-0.5">
                 <DialogTitle className="text-xl font-black">تصفير بيانات الوصول</DialogTitle>
                 <p className="text-[9px] font-black text-blue-200/60 uppercase tracking-[0.3em]">Access Credential Override</p>
              </div>
           </div>
        </div>

        <div className="p-10 space-y-8 bg-white max-h-[70vh] overflow-y-auto scrollbar-none">
          <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl">
             <button 
               onClick={() => { setType("password"); setValue(""); }}
               className={cn(
                 "flex-1 h-11 rounded-xl font-black text-[11px] transition-all flex items-center justify-center gap-2",
                 type === 'password' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
               )}
             >
               <Lock className="h-3.5 w-3.5" />
               كلمة المرور
             </button>
             <button 
               onClick={() => { setType("pin"); setValue(""); }}
               className={cn(
                 "flex-1 h-11 rounded-xl font-black text-[11px] transition-all flex items-center justify-center gap-2",
                 type === 'pin' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"
               )}
             >
               <Fingerprint className="h-3.5 w-3.5" />
               رمز PIN
             </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-2 text-gray-400">
                  <Sparkles className="h-3 w-3 text-[#f9a885]" />
                  <Label className="font-black text-[10px] uppercase">القيمة الجديدة</Label>
               </div>
               <Button variant="ghost" onClick={generateRandom} className="h-8 rounded-lg text-[9px] font-black text-blue-500 hover:bg-blue-50">توليد عشوائي</Button>
            </div>
            
            <div className="relative">
              <Input 
                type="text"
                maxLength={type === 'pin' ? 6 : 32}
                value={value}
                onChange={e => setValue(type === 'pin' ? e.target.value.replace(/\D/g, '') : e.target.value)}
                className="h-16 rounded-[28px] bg-gray-50 border-none font-black text-center text-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-[#002d4d]"
                placeholder={type === 'pin' ? "000000" : "أدخل القيمة..."}
              />
              <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-200" />
            </div>
          </div>

          <div className="p-6 bg-blue-50/30 rounded-[32px] border border-blue-100/50 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Mail className="h-5 w-5 text-blue-600" />
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-[#002d4d]">إرسال عبر البريد الإلكتروني</p>
                      <p className="text-[8px] font-bold text-gray-400">بث البيانات فوراً لبريد المستثمر</p>
                   </div>
                </div>
                <Switch checked={sendEmail} onCheckedChange={setSendEmail} className="data-[state=checked]:bg-blue-600" />
             </div>
             {sendEmail && (
               <div className="px-2 pt-2 border-t border-blue-100/50">
                  <p className="text-[9px] font-bold text-blue-400 italic">سيتم الإرسال إلى: {user?.email || "لا يوجد بريد مسجل"}</p>
               </div>
             )}
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <Button 
            onClick={handleConfirm} 
            disabled={processing || emailLoading || !value || (type === 'pin' && value.length < 6)}
            className="w-full h-16 rounded-full bg-[#002d4d] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {processing || emailLoading ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <>
                تأكيد وبث البيانات
                <Send className="h-5 w-5 text-[#f9a885] rotate-180" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
