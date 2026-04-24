
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useFirestore } from "@/firebase";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { Send, Globe, Loader2, Sparkles, Zap, Mail, Bell, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";
import { TargetAudienceSelector } from "./TargetAudienceSelector";

interface GlobalBroadcastFormProps {
  onSuccess: () => void;
}

export function GlobalBroadcastForm({ onSuccess }: GlobalBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", message: "" });

  const handleSend = async () => {
    if (!formData.title || !formData.message) return;
    setLoading(true);
    try {
      const usersCol = collection(db, "users");
      let targetUsers: {id: string, email?: string}[] = [];

      if (targetAudience === 'single_user' && selectedUserId) {
        const uSnap = await getDoc(doc(db, "users", selectedUserId));
        if (uSnap.exists()) targetUsers = [{ id: uSnap.id, email: uSnap.data().email }];
      } else {
        const snap = await getDocs(usersCol);
        targetUsers = snap.docs.map(d => ({ id: d.id, email: d.data().email }));
      }
      
      const ops = targetUsers.flatMap(u => {
        const tasks = [];
        // 1. App Notif & Push (Internal logic triggers push)
        tasks.push(addDoc(collection(db, "notifications"), {
          userId: u.id, title: formData.title, message: formData.message,
          type: "info", isRead: false, createdAt: new Date().toISOString()
        }));
        // 2. Email
        if (u.email) {
          tasks.push(sendBroadcastEmail(u.email, formData.title, formData.message));
        }
        return tasks;
      });

      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        channel: 'unified',
        target: targetAudience,
        recipientCount: targetUsers.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "اكتمل البث الشامل الموحد بنجاح" });
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
            <Globe size={32} className="text-[#f9a885]" />
          </div>
          محطة البث الشامل الموحد (Omnichannel)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 space-y-10 text-right" dir="rtl">
        <TargetAudienceSelector 
          value={targetAudience} 
          onChange={setTargetAudience} 
          onUserSelect={(id) => setSelectedUserId(id)}
        />

        <div className="space-y-4">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-6 tracking-widest">العنوان الموحد للحملة</Label>
           <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-16 rounded-[28px] bg-gray-50 border-none font-black px-10 text-lg shadow-inner" placeholder="أدخل العنوان..." />
        </div>

        <div className="space-y-4">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-6 tracking-widest">المحتوى النصي الشامل</Label>
           <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="min-h-[200px] rounded-[44px] bg-gray-50 border-none font-bold text-base p-10 leading-loose shadow-inner" placeholder="اكتب محتوى الرسالة..." />
        </div>

        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[28px] border border-blue-100">
              <Bell size={18} className="text-blue-500" />
              <div className="text-right">
                 <p className="text-[9px] font-black text-[#002d4d]">إشعار داخلي</p>
                 <p className="text-[7px] font-bold text-gray-400 uppercase">App Node</p>
              </div>
           </div>
           <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-[28px] border border-emerald-100">
              <Smartphone size={18} className="text-emerald-500" />
              <div className="text-right">
                 <p className="text-[9px] font-black text-[#002d4d]">تنبيه Push</p>
                 <p className="text-[7px] font-bold text-gray-400 uppercase">Device Node</p>
              </div>
           </div>
           <div className="flex items-center gap-4 p-5 bg-orange-50 rounded-[28px] border border-orange-100">
              <Mail size={18} className="text-orange-500" />
              <div className="text-right">
                 <p className="text-[9px] font-black text-[#002d4d]">بريد إلكتروني</p>
                 <p className="text-[7px] font-bold text-gray-400 uppercase">Email Node</p>
              </div>
           </div>
        </div>

        <Button 
          onClick={handleSend} 
          disabled={loading || !formData.title || (targetAudience === 'single_user' && !selectedUserId)} 
          className="w-full h-20 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xl shadow-xl transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-4"><span>إطلاق البث الموحد الموجه</span> <Send size={24} className="rotate-180" /></div>}
        </Button>
      </CardContent>
    </Card>
  );
}
