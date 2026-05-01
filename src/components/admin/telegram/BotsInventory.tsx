
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
  Settings2,
  X,
  Cpu
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { addNewTelegramBot } from "@/app/actions/telegram-actions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview جرد مصفوفة البوتات v3.0 - Individual Settings Trigger
 * تم إضافة زر الإعدادات لكل بوت لتمكين الخصخصة الفردية.
 */

interface BotsInventoryProps {
  onOpenSettings: (botId: string) => void;
}

export function BotsInventory({ onOpenSettings }: BotsInventoryProps) {
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
    <div className="space-y-12 font-body text-right" dir="rtl">
      
      {/* 1. The Inline Bot Forge */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="overflow-hidden"
          >
            <Card className="rounded-[56px] border-none shadow-2xl bg-white overflow-hidden mb-10 group">
              <CardHeader className="bg-[#002d4d] p-10 text-white relative flex flex-row items-center justify-between">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 pointer-events-none group-hover:rotate-0 duration-1000">
                    <Cpu size={160} />
                 </div>
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-[28px] bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                       <Plus className="h-8 w-8 text-[#f9a885]" />
                    </div>
                    <div className="space-y-0.5">
                       <CardTitle className="text-2xl font-black">ربط محطة بث جديدة</CardTitle>
                       <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.3em] mt-1">New Telegram Node Forge</p>
                    </div>
                 </div>
                 <Button 
                   variant="ghost" 
                   onClick={() => setIsAddOpen(false)}
                   className="rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-[10px] px-8 h-12 border border-white/10"
                 >
                    إلغاء وإخفاء المفاعل
                 </Button>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                 <div className="grid gap-10 md:grid-cols-2">
                    <div className="space-y-6">
                       <div className="space-y-3">
                          <Label className="text-[11px] font-black text-gray-400 pr-4 uppercase tracking-widest">اسم البوت الإداري</Label>
                          <Input 
                            value={newBot.name} 
                            onChange={e => setNewBot({...newBot, name: e.target.value})} 
                            className="h-14 rounded-2xl bg-gray-50 border-none font-black text-sm px-8 shadow-inner" 
                            placeholder="مثلاً: Namix Core Bot" 
                          />
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[11px] font-black text-gray-400 pr-4 uppercase tracking-widest">بوت توكن (Bot API Token)</Label>
                          <Input 
                            value={newBot.token} 
                            onChange={e => setNewBot({...newBot, token: e.target.value})} 
                            className="h-14 rounded-2xl bg-gray-50 border-none font-mono text-[10px] px-8 shadow-inner text-left" 
                            dir="ltr"
                            placeholder="123456789:ABCDefGhI..." 
                          />
                       </div>
                    </div>
                    
                    <div className="flex flex-col justify-between gap-6">
                       <div className="p-8 bg-blue-50/50 rounded-[40px] border border-blue-100/50 flex items-start gap-6">
                          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                             <ShieldCheck className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="text-[11px] font-bold text-blue-800/60 leading-[2.2]">
                            سيقوم النظام بالاتصال بخوادم تلغرام فوراً للتحقق من صلاحية التوكن. تأكد من تفعيل صلاحية إرسال الرسائل بداخل BotFather لضمان بث الإشارات.
                          </p>
                       </div>
                       
                       <Button 
                         onClick={handleAdd} 
                         disabled={loading || !newBot.name || !newBot.token}
                         className="w-full h-18 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                       >
                          {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                            <>
                               <span>تنشيط البوت في المصفوفة</span>
                               <Zap className="h-5 w-5 text-[#f9a885] fill-current" />
                            </>
                          )}
                       </Button>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {!isAddOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsAddOpen(true)}
            className="p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[56px] flex flex-col items-center justify-center gap-6 hover:bg-white hover:border-blue-500 hover:shadow-2xl transition-all group active:scale-95 h-full min-h-[300px]"
          >
            <div className="h-20 w-20 rounded-[28px] bg-white shadow-sm flex items-center justify-center text-gray-300 group-hover:text-blue-500 transition-colors">
              <Plus size={32} />
            </div>
            <div className="text-center space-y-1">
               <h4 className="font-black text-lg text-[#002d4d]">إدراج بوت جديد</h4>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect New Telegram Node</p>
            </div>
          </motion.button>
        )}

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
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">API Endpoint Token</span>
                      <KeyRound size={12} className="text-gray-200" />
                   </div>
                   <p className="text-[10px] font-mono text-[#002d4d] truncate max-w-full opacity-60" dir="ltr">{bot.token}</p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => onOpenSettings(bot.id)}
                        variant="ghost" 
                        size="icon" 
                        className="h-11 w-11 rounded-2xl bg-gray-50 text-[#002d4d] hover:bg-[#002d4d] hover:text-[#f9a885] transition-all"
                      >
                         <Settings2 size={20} />
                      </Button>
                      <Badge className={cn("text-[8px] font-black border-none px-4 py-1.5 rounded-full shadow-sm", bot.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400")}>
                        {bot.isActive ? "OPERATIONAL" : "HIBERNATING"}
                      </Badge>
                   </div>
                   <Button onClick={() => handleRemove(bot.id)} variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-red-50 text-red-400 hover:bg-red-100">
                      <Trash2 size={20} />
                   </Button>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
