
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Landmark, 
  Zap,
  Settings2,
  Loader2,
  Cpu,
  Wallet,
  ChevronLeft,
  X,
  Sparkles,
  Activity
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, addDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, orderBy } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CryptoIcon, ICON_OPTIONS } from "@/lib/crypto-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

/**
 * @fileOverview هندسة بوابات السحب السيادية v12.0 - Inline Forge & Logic Control
 * تم تحديث الواجهة لتكون مدمجة بالكامل مع حوكمة منطقية تمنع إضافة بوابات للأنماط الآلية.
 */

export function WithdrawPortalsSection() {
  const db = useFirestore();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isAddPortalOpen, setIsAddPortalOpen] = useState(false);
  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // New Category State
  const [newCat, setNewCat] = useState({
    name: "",
    description: "",
    type: "manual" as 'manual' | 'binance' | 'nowpayments'
  });
  const [creating, setCreating] = useState(false);

  const [newPortal, setNewPortal] = useState({
    name: "Namix Internal Payout",
    instructions: "يرجى إدخال Namix ID الخاص بالمستلم والمكون من 10 أرقام.",
    icon: "NAMIX_ID"
  });

  const categoriesQuery = useMemoFirebase(() => query(collection(db, "withdraw_methods"), orderBy("name", "asc")), [db]);
  const { data: categories, isLoading } = useCollection(categoriesQuery);

  const handleAddCategory = async () => {
    if (!newCat.name.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "withdraw_methods"), { 
        name: newCat.name, 
        description: newCat.description,
        type: newCat.type,
        isActive: true,
        portals: [] 
      });
      setNewCat({ name: "", description: "", type: "manual" });
      setIsCreatorOpen(false);
      toast({ title: "تم تفعيل القسم بنجاح" });
    } catch (e) { 
      toast({ variant: "destructive", title: "خطأ في التفعيل" }); 
    } finally {
      setCreating(false);
    }
  };

  const handleAddPortal = async () => {
    if (!activeCatId || !newPortal.name.trim()) return;
    try {
      const portalData = {
        id: Math.random().toString(36).substr(2, 9),
        name: newPortal.name,
        instructions: newPortal.instructions,
        icon: newPortal.icon,
        isActive: true,
        fields: [
          { label: "Namix ID المستلم", placeholder: "أدخل الـ ID المكون من 10 أرقام...", type: "text", hasPasteButton: true }
        ]
      };
      await updateDoc(doc(db, "withdraw_methods", activeCatId), {
        portals: arrayUnion(portalData)
      });
      setNewPortal({ name: "Namix Internal Payout", instructions: "يرجى إدخال Namix ID الخاص بالمستلم والمكون من 10 أرقام.", icon: "NAMIX_ID" });
      setIsAddPortalOpen(false);
      toast({ title: "تمت إضافة البوابة بنجاح" });
    } catch (e) { toast({ variant: "destructive", title: "خطأ" }); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 text-right font-body" dir="rtl">
      
      {/* 1. Inline Category Creator Forge */}
      <Card className="rounded-[48px] border-none shadow-xl bg-white overflow-hidden group transition-all">
        <CardHeader className="bg-[#002d4d] p-8 text-white relative flex flex-row items-center justify-between border-b border-white/5">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12 pointer-events-none transition-transform group-hover:rotate-0 duration-1000">
              <Layers size={120} />
           </div>
           <div className="flex items-center gap-5 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner group-hover:rotate-12 transition-transform">
                 <Plus className="h-7 w-7 text-[#f9a885]" />
              </div>
              <div className="text-right">
                 <CardTitle className="text-xl font-black">تأسيس فئة سحب</CardTitle>
                 <p className="text-[9px] font-bold text-blue-200/40 uppercase tracking-widest mt-1">Sovereign Section Forge</p>
              </div>
           </div>
           <Button 
             variant="ghost" 
             onClick={() => setIsCreatorOpen(!isCreatorOpen)}
             className="rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-[10px] px-6 h-10 border border-white/10 transition-all"
           >
              {isCreatorOpen ? "إخفاء المفاعل" : "إضافة فئة صرف جديدة"}
           </Button>
        </CardHeader>

        <AnimatePresence>
          {isCreatorOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              transition={{ duration: 0.5, ease: "circOut" }}
            >
              <CardContent className="p-10 space-y-8 border-t border-gray-50">
                 <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">اسم القسم</Label>
                          <Input 
                            value={newCat.name} 
                            onChange={e => setNewCat({...newCat, name: e.target.value})} 
                            className="h-14 rounded-[24px] bg-gray-50 border-none font-black text-center text-lg shadow-inner" 
                            placeholder="مثلاً: حوالات بنكية، تحويل داخلي..." 
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">نمط التشغيل (Operational Mode)</Label>
                          <Select value={newCat.type} onValueChange={(val: any) => setNewCat({...newCat, type: val})}>
                             <SelectTrigger className="h-14 rounded-[24px] bg-white border border-gray-100 font-black text-xs px-8 shadow-sm">
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                                <SelectItem value="manual" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>يدوي (بوابات مخصصة)</span><Wallet size={14}/></div></SelectItem>
                                <SelectItem value="nowpayments" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>آلي (NOWPayments Sync)</span><Zap size={14} className="text-purple-500 fill-current"/></div></SelectItem>
                                <SelectItem value="binance" className="font-bold text-right py-3"><div className="flex items-center gap-3 justify-end"><span>شبه آلي (Binance Sync)</span><Cpu size={14} className="text-orange-500"/></div></SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black text-gray-400 pr-4 uppercase tracking-widest">وصف القسم وتوجيهات الصرف</Label>
                       <Textarea 
                         value={newCat.description} 
                         onChange={e => setNewCat({...newCat, description: e.target.value})} 
                         className="min-h-[140px] rounded-[32px] bg-gray-50 border-none font-bold text-xs p-6 shadow-inner leading-relaxed" 
                         placeholder="اكتب وصفاً مختصراً يظهر للمستثمر في صفحة السحب..." 
                       />
                    </div>
                 </div>
                 <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleAddCategory} 
                      disabled={creating || !newCat.name} 
                      className="h-16 px-12 rounded-full bg-[#002d4d] hover:bg-[#001d33] text-white font-black text-base shadow-xl active:scale-95 group transition-all"
                    >
                       {creating ? <Loader2 className="animate-spin h-6 w-6" /> : (
                         <div className="flex items-center gap-4">
                            <span>تفعيل الفئة في النظام</span>
                            <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                         </div>
                       )}
                    </Button>
                 </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
             <Loader2 className="h-10 w-10 animate-spin text-gray-200" />
             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Scanning Repository...</p>
          </div>
        ) : categories?.length > 0 ? (
          categories.map(category => (
            <Card key={category.id} className="border-none shadow-sm rounded-[44px] bg-white overflow-hidden border border-gray-100 group transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center text-[#002d4d] shadow-inner group-hover:bg-[#002d4d] group-hover:text-[#f9a885] transition-all duration-500">
                      {category.type === 'manual' ? <Wallet size={28}/> : category.type === 'nowpayments' ? <Zap size={28} className="text-purple-500 fill-current" /> : <Cpu size={28} className="text-orange-500"/>}
                    </div>
                    <div className="text-right space-y-1">
                      <h4 className="font-black text-lg text-[#002d4d]">{category.name}</h4>
                      <div className="flex items-center gap-3">
                         <Badge className={cn("text-[8px] font-black border-none px-3 py-1 rounded-full", category.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400")}>
                           {category.isActive ? "ACTIVE" : "DISABLED"}
                         </Badge>
                         <Badge variant="outline" className={cn(
                           "text-[7px] font-black border-gray-100 px-2.5 py-0.5 rounded-md",
                           category.type === 'manual' ? "text-blue-500" : "text-orange-500"
                         )}>
                           {category.type?.toUpperCase()}
                         </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Switch checked={!!category.isActive} onCheckedChange={async (val) => await updateDoc(doc(db, "withdraw_methods", category.id), { isActive: val })} className="data-[state=checked]:bg-emerald-500" />
                    
                    {/* Only show "Add Portal" if type is MANUAL */}
                    {category.type === 'manual' ? (
                      <Button variant="ghost" size="icon" onClick={() => { setActiveCatId(category.id); setIsAddPortalOpen(true); }} className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm transition-all active:scale-90"><Plus size={18}/></Button>
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-200 cursor-not-allowed" title="النمط الآلي لا يتطلب بوابات فرعية"><Zap size={16} /></div>
                    )}

                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-100" onClick={async () => { if(confirm("حذف القسم؟")) await deleteDoc(doc(db, "withdraw_methods", category.id)); }}><Trash2 size={18}/></Button>
                    
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400" onClick={() => setExpandedCat(expandedCat === category.id ? null : category.id)}>
                      {expandedCat === category.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </Button>
                  </div>
                </div>

                {expandedCat === category.id && (
                  <div className="p-8 space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="p-5 bg-gray-50/50 rounded-[28px] border border-gray-100 border-dashed">
                       <p className="text-[11px] font-bold text-gray-400 leading-loose">{category.description || "لا يوجد وصف محدد لهذا القسم."}</p>
                    </div>

                    {category.type === 'manual' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {category.portals?.map((portal: any) => (
                          <div key={portal.id} className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group/portal transition-all hover:shadow-md">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-[18px] bg-gray-50 shadow-inner flex items-center justify-center text-blue-600 group-hover/portal:bg-blue-50 transition-all">
                                   <CryptoIcon name={portal.icon} size={24} />
                                </div>
                                <div className="text-right">
                                   <p className="font-black text-sm text-[#002d4d]">{portal.name}</p>
                                   <p className="text-[8px] font-bold text-gray-400 uppercase">NODE: {portal.id}</p>
                                </div>
                             </div>
                             <button onClick={async () => {
                               const updated = category.portals.filter((p: any) => p.id !== portal.id);
                               await updateDoc(doc(db, "withdraw_methods", category.id), { portals: updated });
                             }} className="h-10 w-10 rounded-xl bg-white text-red-400 flex items-center justify-center opacity-0 group-hover/portal:opacity-100 transition-all shadow-sm hover:bg-red-50">
                                <Trash2 size={16} />
                             </button>
                          </div>
                        ))}
                        {(!category.portals || category.portals.length === 0) && (
                          <div className="col-span-full py-10 text-center opacity-20 flex flex-col items-center gap-2">
                             <Sparkles size={24} />
                             <p className="text-[10px] font-black uppercase tracking-widest">قم بإضافة بوابة لبدء التشغيل</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 bg-blue-50/20 rounded-[32px] border border-blue-100/30 flex flex-col items-center text-center gap-4">
                         <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Zap className="animate-pulse" /></div>
                         <div className="space-y-1">
                            <p className="font-black text-sm text-[#002d4d]">المزامنة الآلية نشطة</p>
                            <p className="text-[10px] font-bold text-gray-400 leading-relaxed max-w-sm">هذا القسم يعتمد على بروتوكولات API العالمية لتنفيذ السحوبات؛ لا حاجة لتعريف بوابات يدوية فرعية.</p>
                         </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center opacity-20 flex flex-col items-center gap-4 border-2 border-dashed border-gray-100 rounded-[64px]">
             <Activity size={48} />
             <p className="text-xs font-black uppercase tracking-widest">لا توجد سجلات في المفاعل</p>
          </div>
        )}
      </div>

      <Dialog open={isAddPortalOpen} onOpenChange={setIsAddPortalOpen}>
        <DialogContent className="rounded-[48px] border-none p-10 max-w-[420px] font-body text-right" dir="rtl">
          <DialogHeader className="items-center gap-4">
            <div className="h-14 w-14 rounded-[22px] bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner"><CryptoIcon name={newPortal.icon} size={28} /></div>
            <DialogTitle className="text-2xl font-black text-[#002d4d]">إضافة بوابة سحب</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">أيقونة البوابة</Label>
               <Select value={newPortal.icon} onValueChange={val => setNewPortal({...newPortal, icon: val})}>
                  <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-none font-black text-xs px-6 shadow-inner"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl" dir="rtl">
                    {ICON_OPTIONS.slice(0, 40).map(opt => (
                      <SelectItem key={opt.id} value={opt.id} className="font-bold text-right py-2"><div className="flex items-center gap-3 justify-end"><span>{opt.label}</span><CryptoIcon name={opt.id} size={16}/></div></SelectItem>
                    ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">تسمية القناة</Label>
               <Input value={newPortal.name} onChange={e => setNewPortal({...newPortal, name: e.target.value})} className="h-12 rounded-2xl bg-gray-50 border-none font-black px-6 shadow-inner text-right" />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black text-gray-400 uppercase pr-4">تعليمات الاستلام</Label>
               <Textarea value={newPortal.instructions} onChange={e => setNewPortal({...newPortal, instructions: e.target.value})} className="min-h-[100px] rounded-[24px] bg-gray-50 border-none font-bold text-xs p-6 shadow-inner text-right leading-loose" />
            </div>
          </div>
          <Button onClick={handleAddPortal} className="w-full h-14 rounded-full bg-[#002d4d] text-white font-black shadow-xl active:scale-95 transition-all">تثبيت القناة</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
