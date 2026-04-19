
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { 
  Send, 
  Globe, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Zap,
  Mail,
  Bell
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";

interface GlobalBroadcastFormProps {
  onSuccess: () => void;
}

export function GlobalBroadcastForm({ onSuccess }: GlobalBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", message: "" });

  const usersQuery = useMemoFirebase(() => collection(db, "users"), [db]);
  const { data: users } = useCollection(usersQuery);

  const handleSend = async () => {
    if (!formData.title || !formData.message) return;
    setLoading(true);
    try {
      const targetList = users || [];
      
      const ops = targetList.flatMap(u => {
        const tasks = [];
        // App Notif
        tasks.push(addDoc(collection(db, "notifications"), {
          userId: u.id, title: formData.title, message: formData.message,
          type: "info", isRead: false, createdAt: new Date().toISOString()
        }));
        // Email
        if (u.email) {
          tasks.push(sendBroadcastEmail(u.email, formData.title, formData.message));
        }
        return tasks;
      });

      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        channel: 'both',
        recipientCount: targetList.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "اكتمل البث الشامل بنجاح" });
      onSuccess();
    } catch (e) {
      toast({ variant: "destructive", title: "فشل البث" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-2xl rounded-[64px] overflow-hidden bg-white">
      <CardHeader className="bg-purple-600 p-12 text-white relative">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Globe size={140} /></div>
        <CardTitle className="text-3xl font-black flex items-center gap-6 relative z-10">
          <div className="h-16 w-16 rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
            <Zap size={32} className="text-[#f9a885] fill-current" />
          </div>
          محطة البث الشامل الموحد
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 space-y-10 text-right" dir="rtl">
        <div className="p-8 bg-purple-50/50 rounded-[40px] border border-purple-100 flex items-start gap-6">
           <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-sm shrink-0">
              <Sparkles size={24} />
           </div>
           <p className="text-xs font-bold text-purple-800/70 leading-loose">سيتم بث هذه الرسالة عبر كافة القنوات الرسمية (التطبيق والبريد) لضمان وصول التنبيه لكافة المستخدمين الموثقين في النظام.</p>
        </div>

        <div className="space-y-4">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-6">العنوان الموحد</Label>
           <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-16 rounded-[28px] bg-gray-50 border-none font-black px-10 text-lg shadow-inner" placeholder="عنوان الحملة الشاملة..." />
        </div>

        <div className="space-y-4">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-6">المحتوى التشغيلي</Label>
           <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="min-h-[240px] rounded-[44px] bg-gray-50 border-none font-bold text-base p-10 leading-loose shadow-inner" placeholder="اكتب محتوى الرسالة هنا..." />
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[28px] border border-blue-100">
              <Bell size={20} className="text-blue-500" />
              <div className="text-right">
                 <p className="text-[10px] font-black text-[#002d4d]">إشعار التطبيق</p>
                 <p className="text-[8px] font-bold text-gray-400 uppercase">Operational Node</p>
              </div>
           </div>
           <div className="flex items-center gap-4 p-5 bg-orange-50 rounded-[28px] border border-orange-100">
              <Mail size={20} className="text-orange-500" />
              <div className="text-right">
                 <p className="text-[10px] font-black text-[#002d4d]">بريد إلكتروني</p>
                 <p className="text-[8px] font-bold text-gray-400 uppercase">Communication Node</p>
              </div>
           </div>
        </div>

        <Button onClick={handleSend} disabled={loading || !formData.title} className="w-full h-20 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xl shadow-2xl transition-all">
          {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-4"><span>إطلاق البث الشامل</span> <Send size={24} className="rotate-180" /></div>}
        </Button>
      </CardContent>
    </Card>
  );
}
