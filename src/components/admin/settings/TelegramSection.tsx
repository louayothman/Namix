
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Send, ShieldCheck, Loader2, Sparkles, Zap, Globe, Cpu, RefreshCcw, UserCircle } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { setTelegramWebhook } from "@/lib/telegram-bot";

export function TelegramSection() {
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const telegramRef = useMemoFirebase(() => doc(db, "system_settings", "telegram"), [db]);
  const { data: remoteData } = useDoc(telegramRef);
  const [data, setData] = useState<any>({ botToken: "", botUsername: "", webhookUrl: "", isActive: false });

  useEffect(() => {
    if (remoteData) setData(remoteData);
  }, [remoteData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(telegramRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "تم حفظ الإعدادات", description: "بروتوكول تلغرام محدث في القاعدة." });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الحفظ" });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncWebhook = async () => {
    if (!data.botToken) {
      toast({ variant: "destructive", title: "مطلوب Bot Token" });
      return;
    }
    setSyncing(true);
    try {
      const currentUrl = data.webhookUrl || `${window.location.origin}/api/telegram/webhook`;
      const res = await setTelegramWebhook(data.botToken, currentUrl);
      
      if (res.ok) {
        await setDoc(telegramRef, { webhookUrl: currentUrl, isActive: true }, { merge: true });
        toast({ title: "تم تفعيل Webhook بنجاح", description: "البوت الآن يستقبل الرسائل من تلغرام." });
      } else {
        toast({ variant: "destructive", title: "فشل تفعيل Webhook", description: res.description });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في الاتصال" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-6 duration-700 font-body text-right" dir="rtl">
      <Card className="rounded-[48px] border-none shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-[#0088cc] p-10 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Send className="h-32 w-32" /></div>
          <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md shadow-inner">
              <Send className="h-8 w-8 text-white" />
            </div>
            إدارة بروتوكول تلغرام (Namix Nexus)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10 space-y-10">
          <div className="grid gap-8">
            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">Telegram Bot API Token</Label>
              <Input 
                value={data.botToken || ""} 
                onChange={e => setData({...data, botToken: e.target.value})}
                className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 shadow-inner"
                placeholder="أدخل التوكن من BotFather..."
              />
            </div>

            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">يوزر نيم البوت (بدون @)</Label>
              <div className="relative">
                <Input 
                  value={data.botUsername || ""} 
                  onChange={e => setData({...data, botUsername: e.target.value.replace('@', '')})}
                  className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-sm px-8 pr-12 shadow-inner"
                  placeholder="NamiixProBot"
                />
                <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              </div>
              <p className="text-[9px] text-gray-400 font-bold pr-4 italic">يستخدم لتوليد روابط الربط المباشر للمستثمرين.</p>
            </div>
            
            <div className="space-y-3">
              <Label className="font-black text-[11px] text-gray-400 uppercase tracking-widest pr-4">Webhook Endpoint URL</Label>
              <div className="relative">
                <Input 
                  value={data.webhookUrl || ""} 
                  onChange={e => setData({...data, webhookUrl: e.target.value})}
                  className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-xs px-8 shadow-inner text-left"
                  dir="ltr"
                  placeholder="https://your-domain.com/api/telegram/webhook"
                />
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
              </div>
              <p className="text-[9px] text-gray-400 font-bold pr-4 italic">اتركه فارغاً ليتم توليده تلقائياً بناءً على الدومين الحالي.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Cpu className="h-5 w-5 text-blue-600" />
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-[#002d4d]">حالة الربط البرمجي</p>
                      <p className="text-[9px] font-bold text-blue-400 uppercase">Webhook Pulse</p>
                   </div>
                </div>
                <Badge className={cn("font-black text-[8px] px-3 py-1 rounded-full", data.isActive ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400")}>
                   {data.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
             </div>

             <Button onClick={handleSyncWebhook} disabled={syncing} variant="outline" className="h-16 rounded-[32px] border-blue-100 bg-white text-blue-600 font-black text-xs hover:bg-blue-50 shadow-sm active:scale-95 transition-all">
                {syncing ? <Loader2 className="animate-spin h-5 w-5" /> : (
                  <>
                    <RefreshCcw className="ml-2 h-4 w-4" /> تفعيل ومزامنة الـ Webhook
                  </>
                )}
             </Button>
          </div>

          <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex items-start gap-5">
             <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck className="h-6 w-6 text-[#002d4d]" />
             </div>
             <p className="text-[11px] font-bold text-gray-400 leading-relaxed pt-1">
               تأكد من أن رابط الـ Webhook يبدأ بـ HTTPS لضمان قبول تلغرام للطلب. بمجرد التفعيل، سيتمكن المستخدمون من فتح "ناميكس" كتطبيق مصغر داخل تلغرام.
             </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl active:scale-95 group transition-all">
            {saving ? <Loader2 className="animate-spin h-6 w-6" /> : (
              <div className="flex items-center gap-4">
                <span>تثبيت مفاتيح الوصول لبوت تلغرام</span>
                <Zap className="h-5 w-5 text-[#f9a885] group-hover:rotate-12 transition-transform" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
