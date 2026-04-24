
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Zap, 
  ShieldCheck, 
  Loader2, 
  Bot, 
  KeyRound, 
  Activity, 
  Globe,
  Settings2,
  X,
  ChevronLeft
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { addNewTelegramBot } from "@/app/actions/telegram-actions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * @fileOverview جرد مصفوفة البوتات v1.0
 * يدير عرض البوتات الحالية وإضافة بوتات جديدة عبر مفاتيح API.
 */

export function BotsInventory() {
  const db = useFirestore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBot, setNewBot] = useState({ name: "", token: "" });

  const botsQuery = useMemoFirebase(() => collection(db, "system_settings", "telegram", "bots"), [db]);
  const { data: bots, isLoading } = useCollection(botsQuery);

  const handleAdd = async () => {
    if (!newBot.name || !newBot.token) return;
    setLoading(true);
    const res = await addNewTelegramBot(newBot.name, newBot.token);
    setLoading(false);
    
    if (res.success) {
      toast({ title: "تم تفعيل البوت بنجاح" });
      setNewBot({ name: "", token: "" });
      setIsAddOpen(false);
    } else {
      toast({ variant: "destructive", title: "فشل التفعيل", description: res.error });
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("حذف البوت من المصفوفة؟")) return;
    await deleteDoc(doc(db, "system_settings", "telegram", "bots", id));
    toast({ title: "تم إزالة البوت" });
  };

  const toggleBot = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "system_settings", "telegram", "bots", id), { isActive: !current });
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Bot Action Card */}
        <button 
          onClick={() => setIsAddOpen(true)}
          className="p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[56px] flex flex-col items-center justify-center gap-6 hover:bg-white hover:border-blue-500 hover:shadow-2xl transition-all group active:scale-95"
        >
          <div className="h-20 w-20 rounded-[28px] bg-white shadow-sm flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
            <Plus size={32} />
          </div>
          <div className="text-center space-y-1">
             <h4 className="font-black text-lg text-[#002d4d]">إدراج بوت جديد</h4>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect New Telegram Node</p>
          </div>
        </button>

        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-20">
             <Loader2 className="animate-spin h-10 w-10 text-gray-200" />
          </div>
        ) : bots?.map((bot) => (
          <Card key={bot.id} className={cn("rounded-[56px] border-none shadow-sm overflow-hidden bg-white transition-all duration-500 hover:shadow-2xl relative", !bot.isActive && "opacity-60 saturate-0")}>
             <CardContent className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-[24px] bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner group-hover:rotate-12 transition-transform">
                         <Bot size={32} />
                      </div>
                      <div className="text-right">
                         <h4 className="font-black text-xl text-[#002d4d]">{bot.name}</h4>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{bot.botUsername || 'Telegram Bot'}</p>
                      </div>
                   </div>
                   <Switch checked={!!bot.isActive} onCheckedChange={() => toggleBot(bot.id, bot.isActive)} className="data-[state=checked]:bg-emerald-500 scale-110" />
                </div>

                <div className="p-5 bg-gray-50 rounded-[32px] border border-gray-100 shadow-inner space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">API Endpoint Token</span>
                      <KeyRound size={12} className="text-gray-200" />
                   </div>
                   <p className="text-[10px] font-mono text-[#002d4d] truncate max-w-full opacity-60" dir="ltr">{bot.token}</p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                   <Badge className={cn("text-[8px] font-black border-none px-4 py-1.5 rounded-full shadow-sm", bot.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400")}>
                      {bot.isActive ? "OPERATIONAL" : "HIBERNATING"}
                   </Badge>
                   <Button onClick={() => handleRemove(bot.id)} variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-red-50 text-red-400 hover:bg-red-100">
                      <Trash2 size={20} />
                   </Button>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
         <DialogContent className="rounded-[56px] border-none shadow-2xl p-0 max-w-[440px] overflow-hidden font-body text-right outline-none" dir="rtl">
            <div className="bg-[#002d4d] p-10 text-white relative text-center">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none"><Zap size={160} /></div>
               <div className="h-20 w-20 rounded-[32px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner mx-auto mb-6">
                  <Bot size={40} className="text-[#f9a885]" />
               </div>
               <DialogTitle className="text-2xl font-black">ربط محطة بث جديدة</DialogTitle>
               <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em] mt-2">New Bot Integration Node</p>
            </div>

            <div className="p-10 space-y-8 bg-white">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <Label className="text-[11px] font-black text-gray-400 pr-4 uppercase">اسم البوت (للمرجع الإداري)</Label>
                     <Input 
                       value={newBot.name} 
                       onChange={e => setNewBot({...newBot, name: e.target.value})} 
                       className="h-14 rounded-2xl bg-gray-50 border-none font-black text-sm px-8 shadow-inner" 
                       placeholder="مثلاً: Namix Signals Bot" 
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[11px] font-black text-gray-400 pr-4 uppercase">بوت توكن (Bot API Token)</Label>
                     <Input 
                       value={newBot.token} 
                       onChange={e => setNewBot({...newBot, token: e.target.value})} 
                       className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-[10px] px-8 shadow-inner text-left" 
                       dir="ltr"
                       placeholder="123456789:ABCDefGhI..." 
                     />
                  </div>
               </div>

               <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex items-start gap-4">
                  <ShieldCheck size={20} className="text-blue-600 shrink-0" />
                  <p className="text-[10px] font-bold text-blue-800/60 leading-loose">
                    يتم التحقق من صحة التوكن لحظياً قبل الحفظ. تأكد من تفعيل صلاحيات الإرسال في إعدادات BotFather.
                  </p>
               </div>

               <Button 
                 onClick={handleAdd} 
                 disabled={loading || !newBot.name || !newBot.token}
                 className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "تنشيط البوت في المصفوفة"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
