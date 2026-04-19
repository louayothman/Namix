
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, query, getDocs, where } from "firebase/firestore";
import { Send, Bell, Loader2, Target, MessageSquare, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TargetAudienceSelector } from "./TargetAudienceSelector";

interface AppBroadcastFormProps {
  onSuccess: () => void;
}

export function AppBroadcastForm({ onSuccess }: AppBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState('all');
  const [formData, setFormData] = useState({ title: "", message: "", type: "info" });

  const handleSend = async () => {
    if (!formData.title || !formData.message) return;
    setLoading(true);
    try {
      // Fetch targets based on audience selector
      let targetUsers: any[] = [];
      const usersCol = collection(db, "users");
      
      if (targetAudience === 'all') {
        const snap = await getDocs(usersCol);
        targetUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } else if (targetAudience === 'admins') {
        const snap = await getDocs(query(usersCol, where("role", "==", "admin")));
        targetUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } else {
        // Fallback to all for MVP targeting logic
        const snap = await getDocs(usersCol);
        targetUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
      
      const ops = targetUsers.map(u => addDoc(collection(db, "notifications"), {
        userId: u.id,
        title: formData.title,
        message: formData.message,
        type: formData.type,
        isRead: false,
        createdAt: new Date().toISOString()
      }));

      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title: formData.title,
        message: formData.message,
        channel: 'app',
        target: targetAudience,
        recipientCount: targetUsers.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "تم بث التنبيهات بنجاح" });
      onSuccess();
    } catch (e) {
      toast({ variant: "destructive", title: "فشل البث" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-2xl rounded-[64px] overflow-hidden bg-white">
      <CardHeader className="bg-blue-600 p-12 text-white relative">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Bell size={140} /></div>
        <CardTitle className="text-3xl font-black flex items-center gap-6 relative z-10">
          <div className="h-16 w-16 rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
            <Bell size={32} />
          </div>
          محطة بث إشعارات التطبيق
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 space-y-10 text-right" dir="rtl">
        
        <TargetAudienceSelector 
          value={targetAudience}
          onChange={setTargetAudience}
        />

        <div className="grid gap-8 md:grid-cols-2 pt-4">
           <div className="space-y-3">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">نوع التنبيه</Label>
              <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                   <SelectItem value="info" className="font-bold py-3 text-right">إرشادي عام</SelectItem>
                   <SelectItem value="success" className="font-bold py-3 text-right">إيجابي / نجاح</SelectItem>
                   <SelectItem value="warning" className="font-bold py-3 text-right">تنبيه / تحذير</SelectItem>
                </SelectContent>
              </Select>
           </div>
           <div className="space-y-3">
              <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">عنوان الإشعار</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner" placeholder="أدخل العنوان..." />
           </div>
        </div>

        <div className="space-y-3">
           <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">محتوى الرسالة</Label>
           <Textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="min-h-[160px] rounded-[32px] bg-gray-50 border-none font-bold text-sm p-8 leading-loose shadow-inner" placeholder="اكتب نص الرسالة هنا..." />
        </div>

        <Button onClick={handleSend} disabled={loading || !formData.title} className="w-full h-20 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-xl transition-all">
          {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-4"><span>إرسال الإشعارات الفورية</span> <Send size={24} className="rotate-180" /></div>}
        </Button>
      </CardContent>
    </Card>
  );
}
