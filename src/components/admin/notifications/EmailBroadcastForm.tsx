
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore } from "@/firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { 
  Send, 
  Mail, 
  Loader2, 
  Sparkles,
  Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendBroadcastEmail } from "@/app/actions/auth-actions";
import { EmailTemplateForge, EmailBlock } from "./EmailTemplateForge";
import { TargetAudienceSelector } from "./TargetAudienceSelector";

interface EmailBroadcastFormProps {
  onSuccess: () => void;
}

export function EmailBroadcastForm({ onSuccess }: EmailBroadcastFormProps) {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [footer, setFooter] = useState("هذا البريد مرسل إليك بصفتك مستثمراً مسجلاً في منصة ناميكس.");

  const handleSend = async () => {
    if (!title || blocks.length === 0) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى كتابة عنوان وإضافة محتوى للرسالة." });
      return;
    }
    setLoading(true);
    try {
      const renderHtml = () => {
        return `
          <div dir="rtl" style="font-family: sans-serif; background-color: #ffffff; padding: 40px; border-radius: 40px; border: 1px solid #f0f0f0;">
            <div style="text-align: center; margin-bottom: 50px;">
              <h1 style="color: #002d4d; margin: 0; font-size: 28px;">Namix</h1>
            </div>
            ${blocks.map(b => {
              if (b.type === 'text') {
                return `<p style="font-size: ${b.style.fontSize}; color: ${b.style.color}; font-weight: ${b.style.fontWeight}; text-align: ${b.style.textAlign}; font-style: ${b.style.italic ? 'italic' : 'normal'}; text-decoration: ${b.style.underline ? 'underline' : 'none'}; line-height: 1.8; margin-bottom: 20px;">${b.content}</p>`;
              }
              if (b.type === 'button') {
                return `
                  <div style="text-align: ${b.style.textAlign}; margin: 30px 0;">
                    <a href="${b.style.link || '#'}" style="background-color: ${b.style.backgroundColor}; color: ${b.style.color}; padding: 14px 40px; border-radius: ${b.style.borderRadius}; text-decoration: none; font-weight: ${b.style.fontWeight}; font-size: ${b.style.fontSize}; display: inline-block;">
                      ${b.content}
                    </a>
                  </div>
                `;
              }
              return '';
            }).join('')}
            <div style="margin-top: 50px; pt-30px; border-top: 1px solid #f5f5f5; text-align: center; color: #99aabb; font-size: 11px;">
              <p>${footer}</p>
              <p style="margin-top: 15px; opacity: 0.5;">© 2024 Namix Universal Network</p>
            </div>
          </div>
        `;
      };

      const usersCol = collection(db, "users");
      let targetUsers: {email?: string}[] = [];
      
      if (targetAudience === 'single_user' && selectedUserId) {
        const uSnap = await getDoc(doc(db, "users", selectedUserId));
        if (uSnap.exists()) targetUsers = [{ email: uSnap.data().email }];
      } else {
        const snap = await getDocs(usersCol);
        targetUsers = snap.docs.map(d => ({ email: d.data().email })).filter(u => !!u.email);
      }

      const htmlContent = renderHtml();
      const ops = targetUsers.map(u => sendBroadcastEmail(u.email!, title, "", { htmlOverride: htmlContent }));
      await Promise.all(ops);
      
      await addDoc(collection(db, "broadcast_logs"), {
        title,
        channel: 'email',
        target: targetAudience,
        recipientCount: targetUsers.length,
        createdAt: new Date().toISOString()
      });

      toast({ title: "تم إطلاق الحملة البريدية بنجاح" });
      onSuccess();
    } catch (e) {
      toast({ variant: "destructive", title: "فشل الإرسال" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      <Card className="border-none shadow-2xl rounded-[64px] overflow-hidden bg-white">
        <CardHeader className="bg-orange-500 p-12 text-white relative">
          <div className="absolute top-0 right-0 p-10 opacity-10"><Mail size={140} /></div>
          <CardTitle className="text-3xl font-black flex items-center gap-6 relative z-10">
            <div className="h-16 w-16 rounded-[22px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
              <Mail size={32} />
            </div>
            قُمرة بث الحملات البريدية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 space-y-10 text-right" dir="rtl">
           <div className="grid gap-10 md:grid-cols-2">
              <TargetAudienceSelector 
                value={targetAudience} 
                onChange={setTargetAudience} 
                onUserSelect={(id) => setSelectedUserId(id)}
              />
              <div className="space-y-3">
                 <Label className="text-[10px] font-black text-gray-400 uppercase pr-4 tracking-widest">عنوان الرسالة (الموضوع)</Label>
                 <Input value={title} onChange={e => setTitle(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-black px-8 shadow-inner" placeholder="أدخل موضوع البريد..." />
              </div>
           </div>
        </CardContent>
      </Card>

      <EmailTemplateForge 
        blocks={blocks} 
        onChange={setBlocks} 
        footer={footer} 
        onFooterChange={setFooter} 
      />

      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSend} 
          disabled={loading || !title || blocks.length === 0 || (targetAudience === 'single_user' && !selectedUserId)} 
          className="w-full max-w-2xl h-20 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xl shadow-xl transition-all group"
        >
          {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-4"><span>إطلاق الحملة المخصصة الآن</span> <Send size={24} className="rotate-180" /></div>}
        </Button>
      </div>
    </div>
  );
}
